import User from '@/db/mongodb/models/User';
import { SignUp } from '@/types/controller/authReq';
import { Request, Response } from 'express';
import uploadToCloudinary from '@/helpers/cloudinaryUpload';
import { errRes } from '@/helpers/error';

// create user
export const signUp = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data: SignUp = req.body;

    const response = await User.find({ email: data.email });

    if (response.length !== 0) {
      return errRes(res, 400, "user already present");
    }

    let secUrl;
    if (req.file) {
      secUrl = await uploadToCloudinary(req.file)
      if (secUrl === null) {
        return errRes(res, 500, "error while uploading user image");
      }
    }
    const newUser = await User.create({
      firstName: data.firstName, lastName: data.lastName, password: data.password,
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
