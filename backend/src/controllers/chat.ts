import Group from "@/db/mongodb/models/Group";
import User from "@/db/mongodb/models/User";
import { CustomRequest } from "@/types/custom";
import { errRes } from "@/utils/error";
import { Request, Response } from 'express';

export const chatBarData = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }

        const userFriends = await User.findById({ userId })
            .select({ friends: true })
            .populate({
                path: 'friends.friendId',
                select: 'firstName lastName imageUrl',
            })
            .exec();

        const groups = await Group.find({ members: { $inc: userId } })
            .select({ groupName: true, gpImageUrl: true }).exec();

        if (userFriends?.friends?.length !== undefined &&
            userFriends?.friends?.length < 1 &&
            groups.length === 0
        ) {
            return res.status(200).json({
                success: false,
                message: 'user have no chat bar data'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'chat bar data send successfully',
            friends: userFriends?.friends,
            groups: groups
        });

    } catch (error) {
        return errRes(res, 500, "error while sending request");
    }
};