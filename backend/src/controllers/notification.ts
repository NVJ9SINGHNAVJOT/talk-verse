import Chat from '@/db/mongodb/models/Chat';
import Notification from '@/db/mongodb/models/Notification';
import User from '@/db/mongodb/models/User';
import { chatLocks } from '@/socket/index';
import { AcceptRequestBody, SendRequestBody } from '@/types/controller/notificationReq';
import { CustomRequest } from '@/types/custom';
import Mutex from '@/types/mutex';
import { errRes } from '@/utils/error';
import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;
        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }

        const { userName } = req.query;

        // validation
        if (!userName) {
            return res.status(400).json({
                success: false,
                message: 'invalid username input'
            });
        }

        const users = await User.find({ _id: { $nin: userId }, userName: { $regex: userName, $options: 'i' } })
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

export const sendRequest = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;
        const data: SendRequestBody = req.body;

        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }

        if (!data.reqUserId) {
            return errRes(res, 400, 'invalid data');
        }

        // check user exist or not for req id
        const user = User.exists({ _id: data.reqUserId }).exec();

        if (!user) {
            return errRes(res, 400, 'user not present for given id');
        }

        // update user with req
        await Notification.updateOne({ userId: data.reqUserId },
            { $push: { friendRequests: userId } }).exec();

        // TODO: socket event

        return res.status(200).json({
            success: true,
            message: 'request send successfully'
        });
    } catch (error) {
        return errRes(res, 500, "error while sending request");
    }
};

export const getAllNotifications = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }

        const notifications = await Notification.findOne({ userId: userId })
            .select({ friendRequest: true, unseenMessages: true })
            .populate({
                path: 'friendRequests',
                select: 'userName imageUrl'
            }).exec();

        if (!notifications) {
            return errRes(res, 500, 'error while getting notifications');
        }

        if (notifications?.friendRequests.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'no notifications for user'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'notifications for user',
            users: notifications.friendRequests,
            unseenMessages: notifications.unseenMessages
        });

    } catch (error) {
        return errRes(res, 500, 'error while getting notifications');
    }
};

export const acceptRequest = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;
        const data: AcceptRequestBody = req.body;

        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }

        if (!data.acceptUserId) {
            return errRes(res, 400, 'invalid data');
        }

        // check user exist or not for req id
        const user = User.exists({ _id: data.acceptUserId }).exec();

        if (!user) {
            return errRes(res, 400, 'user not present for given id');
        }

        // remove from notifications
        await Notification.updateOne({ userId: userId },
            { $pull: { friendRequests: data.acceptUserId } }).exec();

        // create chatId for both users
        // user 1 is who initially sent request and user 2 is who accepted that request
        const chat = await Chat.create({ user1: data.acceptUserId, user2: userId });

        // now add acceptUserId in friend list of user
        await User.updateOne({ _id: userId }, { $push: { friends: { friendId: data.acceptUserId, chatId: chat?._id } } }).exec();
        // now add userId in friend list of acceptUserId
        await User.updateOne({ _id: data.acceptUserId }, { $push: { friends: { friendId: userId, chatId: chat?._id } } }).exec();

        // Create a new mutex instance
        const newMutex = new Mutex();
        // set newmutex for new chatid
        chatLocks.set(chat._id, newMutex);

        // TODO: socket event

        return res.status(200).json({
            success: true,
            message: 'request accepted successfully'
        });

    } catch (error) {
        return errRes(res, 500, "error while sending request");
    }
};