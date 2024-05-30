import User from '@/db/mongodb/models/User';
import { LogInReq, SendOtpReq, SignUpReq } from '@/types/controllers/authReq';
import { Request, Response } from 'express';
import { uploadToCloudinary } from '@/utils/cloudinaryHandler';
import { errRes } from '@/utils/error';
import valid from '@/validators/validator';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import Token from '@/db/mongodb/models/Token';
import Notification from '@/db/mongodb/models/Notification';
import { jwtVerify } from '@/utils/token';
import { generateOTP } from '@/utils/generateOtp';
import Otp from '@/db/mongodb/models/Otp';
import { sendPrivateKeyMail, sendVerficationMail } from '@/utils/sendMail';
import * as forge from 'node-forge';
import { deleteFile } from '@/utils/deleteFile';
import { db } from '@/db/postgresql/connection';
import { user } from '@/db/postgresql/schema/user';

export const signUp = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data: SignUpReq = req.body;

    // validation
    if (
      !valid.isEmail(data.email) ||
      !valid.isName(data.firstName) ||
      !valid.isName(data.lastName) ||
      !valid.isUserName(data.userName) ||
      !valid.isPassword(data.confirmPassword, data.confirmPassword) ||
      !data.otp
    ) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 400, "invalid data");
    }

    const checkOtp = await Otp.findOne({ email: data.email, otpValue: data.otp });

    if (!checkOtp) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 400, 'Invalid otp or otp has expired');
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
      secUrl = await uploadToCloudinary(req.file);
      if (secUrl === null) {
        deleteFile(req.file);
        return errRes(res, 500, "error while uploading user image");
      }
    }

    // encrypt password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    /* ===== Caution: create key pair for user ===== */
    // Generate a key pair (public and private keys)
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);

    const newUser = await User.create({
      firstName: data.firstName, lastName: data.lastName, userName: data.userName, password: hashedPassword,
      publicKey: publicKeyPem, email: data.email, imageUrl: secUrl ? secUrl : ""
    });

    // create notification model for user
    await Notification.create({ userId: newUser?._id });

    // create user in postgreSQL database
    const newUser2 = await db.insert(user).values({ refId: newUser._id.toString(), userName: data.userName, imageUrl: secUrl as string }).returning({ id: user.id });
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

    /* ===== Caution: only for development purpose, remove comment in production ===== */
    // await sendPrivateKeyMail(data.email, privateKeyPemOnly);

    return res.status(200).json({
      success: true,
      message: "user registered successfully"
    });

  } catch (error) {
    if (req.file) {
      deleteFile(req.file);
    }
    return errRes(res, 500, "error while creating user", error);
  }
};

export const sendOtp = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data: SendOtpReq = req.body;
    if (!data.email || !valid.isEmail(data.email)) {
      return errRes(res, 400, 'invalid email id');
    }

    const newOtp = generateOTP();
    await Otp.create({ email: data.email, otpValue: newOtp });

    /* ===== Caution: only for development purpose, remove comment in production ===== */
    // await sendVerficationMail(data.email, newOtp);

    return res.status(200).json({
      success: true,
      message: 'otp send successfully'
    });

  } catch (error) {
    return errRes(res, 500, "error while sending otp", error);
  }
};

export const logIn = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data: LogInReq = req.body;

    // validation
    if (!valid.isEmail(data.email) ||
      !valid.isPassword(data.confirmPassword, data.confirmPassword)
    ) {
      return errRes(res, 401, "invalid data");
    }

    const checkUser = await User.findOne({ email: data.email }).select({
      email: true, password: true,
      firstName: true, lastName: true, imageUrl: true, userToken: true, publicKey: true
    }).exec();

    if (!checkUser) {
      return errRes(res, 401, "user in not signed up");
    }

    // check password and generate token
    let newUserToken: string;
    if (await bcrypt.compare(data.password, checkUser.password as string)) {
      newUserToken = jwt.sign(
        { userId: checkUser._id },
        process.env['JWT_SECRET'] as string,
        {
          expiresIn: "24h",
        }
      );
    }
    else {
      return errRes(res, 401, "incorrect password");
    }

    // save token in db and set in cookie for response
    if (newUserToken) {

      // delete previous token 
      if (checkUser.userToken) {
        await Token.findByIdAndDelete(checkUser.userToken).exec();
      }

      const newToken = await Token.create({ tokenValue: newUserToken });

      // create token and add in user
      const userToken = await User.findByIdAndUpdate({ _id: checkUser?._id },
        { $set: { userToken: newToken._id } },
        { new: true }).select({ userToken: true }).exec();

      // set token in cookie and select httponly: true
      if (userToken?.userToken) {
        const options = {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
          httpOnly: true,
          secure: true,
        };
        return res.cookie(process.env['TOKEN_NAME'] as string, newUserToken, options).status(200).json({
          success: true,
          message: "user login successfull",
          user: {
            _id: checkUser._id,
            firstName: checkUser.firstName,
            lastName: checkUser.lastName,
            imageUrl: checkUser.imageUrl,
            publicKey: checkUser.publicKey
          },
        });
      }
      else {
        return errRes(res, 500, "error while generating token");
      }
    }
    else {
      return errRes(res, 500, "error while generating token");
    }

  } catch (error) {
    return errRes(res, 500, "error while user login", error);
  }
};

export const checkUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extracting JWT from request cookies or header
    const token = req.cookies[process.env['TOKEN_NAME'] as string];

    if (!token) {
      return res.status(200).json({
        success: false,
        message: "token not present"
      });
    }

    const userIds = await jwtVerify(token);

    // If JWT token present and userId invalid or null
    if (!userIds || userIds.length !== 2) {
      return errRes(res, 401, "user authorization failed");
    }

    const user = await User.findById({ _id: userIds[0] as string }).select({
      firstName: true, lastName: true, imageUrl: true, publicKey: true
    }).exec();

    if (!user) {
      return errRes(res, 401, "user authorization failed, no user found for userId");
    }

    return res.status(200).json({
      success: true,
      message: "user check successfull",
      user: user
    });
  }
  catch (error) {
    return errRes(res, 500, "error while user check", error);
  }
};

export const logOut = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.cookies[process.env['TOKEN_NAME'] as string];

    if (!token) {
      return res.status(200).json({
        success: false,
        message: "token not present"
      });
    }

    const userIds = await jwtVerify(token);

    // If JWT token present and userId invalid or null
    if (!userIds || userIds.length !== 2) {
      return errRes(res, 401, "user authorization failed");
    }

    await Token.findOneAndDelete({ tokenValue: token });
    await User.findByIdAndUpdate({ _id: userIds[0] as string }, { $unset: { userToken: true } });

    res.cookie(process.env['TOKEN_NAME'] as string, "", {
      expires: new Date(0), // Set an immediate expiration date (in the past)
      httpOnly: true,
      secure: true,
    });

    // Redirect the user to the login page
    return res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });

  } catch (error) {
    return errRes(res, 500, "error while user log out", error);
  }
};
