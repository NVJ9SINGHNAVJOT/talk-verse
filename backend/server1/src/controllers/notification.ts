import User from '@/db/mongodb/models/User';
import { GetUsersBody } from '@/types/controller/notificationReq';
import { CustomRequest } from '@/types/custom';
import { errRes } from '@/utils/error';
import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;
        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }

        const data: GetUsersBody = req.body;

        // validation
        if (!data.userName) {
            return res.status(400).json({
                success: false,
                message: 'invalid username input'
            });
        }

        const users = await User.find({ _id: { $nin: userId }, userName: { $regex: data.userName, $options: 'i' } })
            .select({ userName: true, imageUrl: true }).exec();

        if (users.length < 1) {
            return res.status(200).json({
                success: false,
                message: 'no user found for given username'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'users',
            users: users
        });

    } catch (error) {
        return errRes(res, 500, "error while getting users");
    }
};