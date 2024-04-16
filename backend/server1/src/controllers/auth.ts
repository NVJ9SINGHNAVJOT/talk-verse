import User from '@/db/mongodb/models/User';
import { SignUp } from '@/types/controller/authReq';
import { Request, Response } from 'express';


// create user
export const signUp = async (req: Request, res: Response): Promise<Response> => {
  try {

    const data: SignUp = req.body;

    console.log("data", data, data.email)

    const response = await User.find({ email: data.email });
    console.log("db res", response)
    if (response.length !== 0) {
      return res.status(400).json({
        success: false,
        message: "user already present"
      });
    }
    await User.create({ firstName: data.firstName, lastName: data.lastName, password: data.password, email: data.email });
    return res.status(200).json({
      success: true,
      message: "user registered successfully"
    });

  } catch (error) {
    console.log("error backend", error);
    return res.status(500).json({
      success: false,
      message: "error while creating user"
    });
  }
};