import User from "@/db/mongodb/models/User";
import { LogInReqSchema, SendOtpReqSchema, SignUpReqSchema } from "@/types/controllers/authReq";
import { Request, Response } from "express";
import { uploadToCloudinary } from "@/utils/cloudinaryHandler";
import { errRes } from "@/utils/error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from "@/db/mongodb/models/Token";
import Notification from "@/db/mongodb/models/Notification";
import { jwtVerify } from "@/utils/token";
import { generateOTP } from "@/utils/generateOtp";
import Otp from "@/db/mongodb/models/Otp";
import { sendPrivateKeyMail, sendVerficationMail } from "@/utils/sendMail";
import * as forge from "node-forge";
import { deleteFile } from "@/utils/deleteFile";
import { db } from "@/db/postgresql/connection";
import { user } from "@/db/postgresql/schema/user";

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

    const checkOtp = await Otp.findOne({ email: data.email, otpValue: data.otp });

    if (!checkOtp) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 400, "Invalid otp or otp has expired");
    }
    // delete otp after verification
    await Otp.deleteOne({ otpValue: data.otp });

    // now check if user is already registered
    const response = await User.findOne({ email: data.email }).select({ email: true }).exec();
    if (response) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 400, "user already present");
    }

    // check if userName is already in use
    const checkUserName = await User.findOne({ userName: data.userName }).select({ userName: true }).exec();

    if (checkUserName) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 400, "user name already in use");
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

    // Generate a key pair (public and private keys)
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);

    const newUser = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      userName: data.userName,
      password: hashedPassword,
      publicKey: publicKeyPem,
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
      .returning({ id: user.id });
    if (newUser2.length !== 1 || !newUser2[0]) {
      await Notification.deleteOne({ userId: newUser.id });
      await User.deleteOne({ _id: newUser.id });
      return errRes(res, 500, "error while creating user in other database");
    }

    // save user's id from postgreSQL
    newUser.userId2 = newUser2[0].id;
    await newUser.save();

    // now generate pair of public and private keys for user
    // Split the key into lines
    const lines = privateKeyPem.trim().split("\n");

    // Remove the first and last lines (which contain the comment)
    const privateKeyPemOnly = lines.slice(1, -1).join("\n");

    /* NOTE: commented only for development purpose, remove comment in production */
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
      return errRes(res, 400, `invalid email id, ${sendOtpReq.error.message}`);
    }

    const data = sendOtpReq.data;

    const newOtp = generateOTP();
    await Otp.create({ email: data.email, otpValue: newOtp });

    /* NOTE: commented only for development purpose, remove comment in production */
    await sendVerficationMail(data.email, newOtp);

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
      return errRes(res, 400, "user in not signed up");
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
    if (!userIds || userIds.length !== 2) {
      return errRes(res, 401, "user authorization failed");
    }

    const user = await User.findById({ _id: `${userIds[0]}` })
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
    if (!userIds || userIds.length !== 2) {
      return errRes(res, 400, "user token invalid");
    }

    await Token.findOneAndDelete({ tokenValue: token });
    await User.findByIdAndUpdate({ _id: `${userIds[0]}` }, { $unset: { userToken: true } });

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
