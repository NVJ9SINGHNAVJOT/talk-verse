import User from '@/db/mongodb/models/User';
import { LogInBody, SignUpBody } from '@/types/controller/authReq';
import { Request, Response } from 'express';
import uploadToCloudinary from '@/utils/cloudinaryUpload';
import { errRes } from '@/utils/error';
import valid from '@/validators/validator';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import Token from '@/db/mongodb/models/Token';
configDotenv();

// create user
export const signUp = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data: SignUpBody = req.body;

    // validation
    if (
      !valid.isEmail(data.email) ||
      !valid.isName(data.firstName) ||
      !valid.isName(data.lastName) ||
      !valid.isPassword(data.confirmPassword, data.confirmPassword)
    ) {
      return errRes(res, 400, "invalid data");
    }

    const response = await User.find({ email: data.email }).select({ email: true }).exec();

    if (response.length !== 0) {
      return errRes(res, 400, "user already present");
    }

    let secUrl;
    if (req.file) {
      secUrl = await uploadToCloudinary(req.file);
      if (secUrl === null) {
        return errRes(res, 500, "error while uploading user image");
      }
    }

    // encrypt password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await User.create({
      firstName: data.firstName, lastName: data.lastName, password: hashedPassword,
      email: data.email, imageUrl: secUrl ? secUrl : ""
    });

    if (newUser) {
      return res.status(200).json({
        success: true,
        message: "user registered successfully"
      });
    }
    else {
      return errRes(res, 500, "error while creating user");
    }
  } catch (error) {
    return errRes(res, 500, "error while creating user");
  }
};

// user login
export const logIn = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data: LogInBody = req.body;

    // validation
    if (!valid.isEmail(data.email) ||
      !valid.isPassword(data.confirmPassword, data.confirmPassword)
    ) {
      return errRes(res, 401, "invalid data");
    }

    const checkUser = await User.find({ email: data.email }).select({ email: true, password: true }).exec();

    if (checkUser.length === 0 && checkUser.length > 1) {
      return errRes(res, 401, "user in not signed up");
    }

    const user = checkUser[0];

    let token: string;
    // check password and generate token
    if (await bcrypt.compare(data.password, user?.password as string)) {
      token = jwt.sign(
        { id: user?._id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "24h",
        }
      );
    }
    else {
      return errRes(res, 401, "incorrect password");
    }

    // save token in db and set in cookie for response
    if (token) {
      const newToken = await Token.create({ userToken: token });
      const options = {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
        httpOnly: true,
      };

      const userToken = await User.findByIdAndUpdate({ _id: user?._id },
        { $set: { userToken: newToken._id } },
        { new: true }).select({ userToken: true }).exec();

      if (userToken?.userToken) {
        return res.cookie("user-talkverse-token", token, options).status(200).json({
          success: true,
          message: "user login successfull",
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
    return errRes(res, 500, "error while user login");
  }
};
