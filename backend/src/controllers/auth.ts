import User from "@/db/mongodb/models/User";
import {
  ChangePasswordReqSchema,
  LogInReqSchema,
  SendOtpReqSchema,
  ResetPasswordReqSchema,
  SignUpReqSchema,
  VerifyOtpReqSchema,
} from "@/types/controllers/authReq";
import { Request, Response } from "express";
import { uploadToCloudinary } from "@/utils/cloudinaryHandler";
import { errRes } from "@/utils/error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from "@/db/mongodb/models/Token";
import Notification from "@/db/mongodb/models/Notification";
import { jwtVerify } from "@/utils/token";
import { checkOTP, generateOTP } from "@/utils/otp";
import {
  sendForgotPasswordVerificationMail,
  sendPasswordUpdatedMail,
  sendPrivateKeyMail,
  sendVerficationMail,
} from "@/utils/sendMail";
import { deleteFile } from "@/utils/deleteFile";
import { db } from "@/db/postgresql/connection";
import { user } from "@/db/postgresql/schema/user";
import { CustomRequest } from "@/types/custom";
import generateAsymmetricKeyPair from "@/utils/generateAsymmetricKeyPair";

export const signUp = async (req: Request, res: Response): Promise<Response> => {
  try {
    // validation
    const signUpReq = SignUpReqSchema.safeParse(req.body);
    if (!signUpReq.success) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 400, `invalid data, ${signUpReq.error.message}`);
    }

    const data = signUpReq.data;

    const checkOtp = await checkOTP(data.email, data.otp);

    if (!checkOtp) {
      if (req.file) {
        deleteFile(req.file);
      }
      return res.status(200).json({
        success: false,
        message: "otp expired or invalid",
      });
    }

    // check if userName is already in use
    const checkUserName = await User.findOne({ userName: data.userName }).select({ userName: true }).exec();
    if (checkUserName) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 400, "userName already in use");
    }

    // now check if user is already registered
    const response = await User.findOne({ email: data.email }).select({ email: true }).exec();
    if (response) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 400, "user already present");
    }

    /* all verification done, now create user */
    let secUrl;
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file);
      if (imageUrl === null) {
        deleteFile(req.file);
        return errRes(res, 500, "error while uploading user image");
      }
      secUrl = imageUrl;
    }

    // encrypt password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // get key pairs for new user
    const keyPair = generateAsymmetricKeyPair();

    const newUser = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      userName: data.userName,
      password: hashedPassword,
      publicKey: keyPair.publicKeyPem,
      email: data.email,
      imageUrl: secUrl ? secUrl : "",
    });

    // create notification model for user
    await Notification.create({ userId: newUser._id });

    // create user in postgreSQL database
    const newUser2 = await db
      .insert(user)
      .values({
        refId: newUser._id.toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        imageUrl: secUrl ? secUrl : null,
      })
      .onConflictDoNothing()
      .returning({ id: user.id });

    if (newUser2.length === 0) {
      await Notification.deleteOne({ userId: newUser.id });
      await User.deleteOne({ _id: newUser.id });
      return errRes(res, 500, "error while creating user in postgreSQL database");
    }

    // save user's id from postgreSQL
    newUser.userId2 = newUser2[0]?.id as number;
    await newUser.save();

    // now generate pair of public and private keys for user
    // Split the key into lines
    const lines = keyPair.privateKeyPem.trim().split("\n");

    // Remove the first and last lines (which contain the comment)
    const privateKeyPemOnly = lines.slice(1, -1).join("\n");

    await sendPrivateKeyMail(data.email, privateKeyPemOnly);

    return res.status(200).json({
      success: true,
      message: "user registered successfully",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (req.file) {
      deleteFile(req.file);
    }
    return errRes(res, 500, "error while creating user", error.message);
  }
};

export const sendOtp = async (req: Request, res: Response): Promise<Response> => {
  try {
    // validation
    const sendOtpReq = SendOtpReqSchema.safeParse(req.body);
    if (!sendOtpReq.success) {
      return errRes(res, 400, `invalid data for otp, ${sendOtpReq.error.message}`);
    }

    const data = sendOtpReq.data;
    const checkUser = await User.findOne({ email: data.email });

    // otp to send for new user
    if (data.newUser === "yes") {
      // otp is need to be sent to new user but user already exists
      if (checkUser) {
        return res.status(200).json({
          success: false,
          message: "user already exists for mail id",
        });
      }

      const newOtp = await generateOTP(data.email);
      await sendVerficationMail(data.email, newOtp);

      return res.status(200).json({
        success: true,
        message: "otp send successfully",
      });
    }

    // otp to send for existing user
    if (!checkUser) {
      return res.status(200).json({
        success: false,
        message: "user not registerd for mail id",
      });
    }

    const newOtp = await generateOTP(data.email);
    await sendForgotPasswordVerificationMail(data.email, newOtp);

    return res.status(200).json({
      success: true,
      message: "otp send successfully",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while sending otp", error.message);
  }
};

export const logIn = async (req: Request, res: Response): Promise<Response> => {
  try {
    const logInReq = LogInReqSchema.safeParse(req.body);

    // validation
    if (!logInReq.success) {
      return errRes(res, 400, `invalid data, ${logInReq.error.message}`);
    }

    const data = logInReq.data;

    const checkUser = await User.findOne({ email: data.email })
      .select({
        userId2: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        userToken: true,
        publicKey: true,
      })
      .exec();

    if (!checkUser) {
      return res.status(200).json({
        success: false,
        message: "user not registerd for mail id",
      });
    }

    // check password and generate token
    let newUserToken: string;
    if (await bcrypt.compare(data.password, checkUser.password)) {
      newUserToken = jwt.sign({ userId: checkUser._id }, `${process.env["JWT_SECRET"]}`, {
        expiresIn: "24h",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "incorrect password",
      });
    }

    /*
      save token in db and set in cookie for response.
      token will be automatically deleted after 24 hrs.
    */

    // delete previous token
    if (checkUser.userToken) {
      await Token.findByIdAndDelete({ _id: checkUser.userToken }).exec();
    }

    // create token and add in user
    const newToken = await Token.create({ tokenValue: newUserToken });
    checkUser.userToken = newToken._id;
    await checkUser.save();

    // set token in cookie and select httponly: true
    const options = {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
      httpOnly: true,
      secure: true,
    };
    return res
      .cookie(`${process.env["TOKEN_NAME"]}`, newUserToken, options)
      .status(200)
      .json({
        success: true,
        message: "user login successfull",
        user: {
          _id: checkUser._id,
          id: checkUser.userId2,
          userName: checkUser.userName,
          firstName: checkUser.firstName,
          lastName: checkUser.lastName,
          imageUrl: checkUser.imageUrl,
          publicKey: checkUser.publicKey,
        },
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while user login", error.message);
  }
};

export const checkUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extracting JWT from request cookies or header
    const token = req.cookies[`${process.env["TOKEN_NAME"]}`];

    if (!token) {
      return res.status(200).json({
        success: false,
        message: "token not present",
      });
    }

    const userIds = await jwtVerify(token);

    // If JWT token present and userId invalid or null
    if (!userIds) {
      return errRes(res, 401, "user authorization failed");
    }

    const user = await User.findById({ _id: userIds.userId })
      .select({
        userId2: true,
        firstName: true,
        lastName: true,
        userName: true,
        imageUrl: true,
        publicKey: true,
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "user check successfull",
      user: user,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while user check", error.message);
  }
};

export const logOut = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.cookies[`${process.env["TOKEN_NAME"]}`];

    if (!token) {
      return res.status(200).json({
        success: false,
        message: "token not present",
      });
    }

    const userIds = await jwtVerify(token);

    // If JWT token present and userId invalid or null
    if (!userIds) {
      return errRes(res, 400, "user token invalid");
    }

    await Token.findOneAndDelete({ tokenValue: token });
    await User.findByIdAndUpdate({ _id: userIds.userId }, { $unset: { userToken: true } });

    res.cookie(`${process.env["TOKEN_NAME"]}`, "", {
      expires: new Date(0), // Set an immediate expiration date (in the past)
      httpOnly: true,
      secure: true,
    });

    // Redirect the user to the login page
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while user log out", error.message);
  }
};

export const changePassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;

    const changePasswordReq = ChangePasswordReqSchema.safeParse(req.body);
    if (!changePasswordReq.success) {
      return errRes(res, 400, `invalid data, ${changePasswordReq.error.message}`);
    }

    const data = changePasswordReq.data;

    const userDetails = await User.findById({ _id: userId })
      .select({ userName: true, email: true, password: true, userToken: true })
      .exec();
    if (!userDetails) {
      return errRes(res, 400, "userDetails not present in database");
    }

    // check old password
    const checkOldPassword = await bcrypt.compare(data.oldPassword, userDetails.password);
    if (!checkOldPassword) {
      return res.status(200).json({
        success: false,
        message: "old password did not matched",
      });
    }

    // encrypt password
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    userDetails.password = hashedPassword;

    // validation done, now update new password and delete current token
    if (userDetails.userToken) {
      await Token.findByIdAndDelete({ _id: userDetails.userToken }).exec();
    }

    // generate new token
    const newUserToken = jwt.sign({ userId: userDetails._id }, `${process.env["JWT_SECRET"]}`, {
      expiresIn: "24h",
    });

    const newToken = await Token.create({ tokenValue: newUserToken });
    // update new token _id in userDetails
    userDetails.userToken = newToken._id;

    await userDetails.save();
    await sendPasswordUpdatedMail(userDetails.userName, userDetails.email);

    // set token in cookie and select httponly: true
    const options = {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
      httpOnly: true,
      secure: true,
    };
    return res.cookie(`${process.env["TOKEN_NAME"]}`, newUserToken, options).status(200).json({
      success: true,
      message: "user password updated successfully",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while updating password", error.message);
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<Response> => {
  try {
    const verifyOtpReq = VerifyOtpReqSchema.safeParse(req.body);
    if (!verifyOtpReq.success) {
      return errRes(res, 400, `invalid data, ${verifyOtpReq.error.message}`);
    }

    const data = verifyOtpReq.data;

    const checkOtp = await checkOTP(data.email, data.otp);
    if (checkOtp) {
      return res.status(200).json({
        success: true,
        message: "otp validation successfull",
      });
    }
    return res.status(200).json({
      success: false,
      message: "otp validation failed",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while validating otp", error.message);
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const resetPasswordReq = ResetPasswordReqSchema.safeParse(req.body);
    if (!resetPasswordReq.success) {
      return errRes(res, 400, `invalid data, ${resetPasswordReq.error.message}`);
    }

    const data = resetPasswordReq.data;

    const checkOtp = await checkOTP(data.email, data.otp);
    if (!checkOtp) {
      return res.status(200).json({
        success: false,
        message: "otp validation failed",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const updateUser = await User.findOneAndUpdate(
      { email: data.email },
      { $set: { password: hashedPassword } },
      { new: true }
    )
      .select({ email: true })
      .exec();

    if (!updateUser) {
      return errRes(res, 400, "user does not exist for email id");
    }

    return res.status(200).json({
      success: true,
      message: "new password set successfully",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while setting new password", error.message);
  }
};
