import Chat from '@/db/mongodb/models/Chat';
import Notification from '@/db/mongodb/models/Notification';
import UnseenCount from '@/db/mongodb/models/UnseenCount';
import User from '@/db/mongodb/models/User';
import { clientE } from '@/socket/events';
import { channels, groupIds, userSocketIDs } from '@/socket/index';
import { AcceptRequestBody, SendRequestBody, SetOrderBody, SetUnseenCountBody } from '@/types/controllers/notificationReq';
import { CustomRequest } from '@/types/custom';
import Channel from '@/types/channel';
import { SoAddedInGroup, SoRequestAccepted, SoUserRequest } from '@/types/socket/eventTypes';
import emitSocketEvent from '@/utils/emitSocketEvent';
import { errRes } from '@/utils/error';
import { getMultiSockets, getSingleSocket } from '@/utils/getSocketIds';
import { Request, Response } from 'express';
import { CreateGroupBody } from '@/types/controllers/chatReq';
import uploadToCloudinary from '@/utils/cloudinaryUpload';
import Group from '@/db/mongodb/models/Group';

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

        const userFriends = await User.findById({ _id: userId }).select({ friends: true }).exec();

        const excluedIds: string[] = [];

        userFriends?.friends?.map((item) => {
            excluedIds.push(item.friendId._id.toString());
        }
        );
        excluedIds.push(userId);

        const users = await User.find({ _id: { $nin: excluedIds }, userName: { $regex: userName, $options: 'i' } })
            .select({ userName: true, imageUrl: true }).limit(20).exec();

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
        const checkUser = await User.findById({ _id: data.reqUserId }).select({ userName: true, imageUrl: true, friends: true }).exec();

        let errCheck: boolean = false;
        checkUser?.friends?.forEach((item) => {
            if (userId === item.friendId._id.toString()) {
                errCheck = true;
                return;
            }
        });

        if (errCheck) {
            return errRes(res, 400, 'requested user is already friend of user');
        }

        if (!checkUser) {
            return errRes(res, 400, 'user not present for given reqUserId');
        }

        const myDetails = await User.findById({ _id: userId }).select({ userName: true, imageUrl: true, _id: false }).exec();
        if (!myDetails) {
            return errRes(res, 400, 'could not found user details');
        }

        // update user with req
        await Notification.updateOne({ userId: data.reqUserId },
            { $push: { friendRequests: userId } }).exec();

        const socketId = getSingleSocket(data.reqUserId);
        if (socketId) {
            const sdata: SoUserRequest = {
                _id: userId,
                userName: myDetails.userName,
                imageUrl: myDetails.imageUrl
            };
            emitSocketEvent(req, clientE.USER_REQUEST, sdata, socketId);
        }

        return res.status(200).json({
            success: true,
            message: 'request send successfully'
        });
    } catch (error) {
        return errRes(res, 500, "error while sending request", error);
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
            .populate([{
                path: 'friendRequests',
                select: 'userName imageUrl'
            },
            {
                path: 'unseenMessages',
                select: 'mainId count -_id'
            }]).exec();

        if (!notifications) {
            return errRes(res, 500, 'error while getting notifications');
        }

        if (notifications?.friendRequests.length === 0 && notifications.unseenMessages.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'no notifications for user'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'notifications for user',
            userReqs: notifications.friendRequests,
            unseenMessages: notifications.unseenMessages
        });

    } catch (error) {
        return errRes(res, 500, 'error while getting notifications', error);
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
        const otherUser = await User.findById({ _id: data.acceptUserId }).select({ firstName: true, lastName: true, imageUrl: true }).exec();

        if (!otherUser) {
            return errRes(res, 400, 'user not present for given id');
        }

        // create chatId for both users
        // user 1 is who initially sent request and user 2 is who accepted that request
        const chat = await Chat.create({ user1: data.acceptUserId, user2: userId });

        // create unseen count for both users , set 0 for both users in their unseenMessages for chat._id as mainId
        const ucotherUser = await UnseenCount.create({ userId: data.acceptUserId, mainId: chat._id });
        const ucUser = await UnseenCount.create({ userId: userId, mainId: chat._id });

        // remove from notifications and set unseen messages count id
        await Notification.findOneAndUpdate({ userId: userId },
            { $pull: { friendRequests: data.acceptUserId }, $push: { unseenMessages: ucUser._id } }).exec();

        await Notification.findOneAndUpdate({ userId: data.acceptUserId },
            { $pull: { friendRequests: userId }, $push: { unseenMessages: ucotherUser._id } }).exec();

        // now add userId in friend list of acceptUserId
        const user1 = await User.findByIdAndUpdate({ _id: data.acceptUserId }, { $push: { friends: { friendId: userId, chatId: chat?._id } } },
            { new: true })
            .select({ chatBarOrder: true }).exec();

        // now add acceptUserId in friend list of user
        const user2 = await User.findByIdAndUpdate({ _id: userId }, { $push: { friends: { friendId: data.acceptUserId, chatId: chat?._id } } },
            { new: true })
            .select({ chatBarOrder: true, firstName: true, lastName: true, imageUrl: true }).exec();

        user1?.chatBarOrder.unshift(chat._id);
        await user1?.save();

        user2?.chatBarOrder.unshift(chat._id);
        await user2?.save();

        // Create a new mutex instance
        const newChannel = new Channel();
        // set newmutex for new chatid

        channels.set(chat._id.toString(), newChannel);

        const socketId = getSingleSocket(data.acceptUserId);

        if (socketId && user2) {
            const sdata: SoRequestAccepted = {
                _id: user2._id,
                chatId: chat._id,
                firstName: user2.firstName,
                lastName: user2.lastName,
                imageUrl: user2.imageUrl
            };
            emitSocketEvent(req, clientE.REQUEST_ACCEPTED, sdata, socketId);
            emitSocketEvent(req, clientE.SET_USER_ONLINE, user2._id.toString(), socketId);

            // socketId is of other user, now send useronline to myself as other user is online and socketId is present
            // get mysocketId
            const mySocketId = getSingleSocket(userId);
            if (mySocketId && user1) {
                emitSocketEvent(req, clientE.SET_USER_ONLINE, user1._id.toString(), mySocketId);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'request accepted successfully',
            newFriend: otherUser,
            newChatId: chat._id
        });

    } catch (error) {
        return errRes(res, 500, "error while accept request", error);
    }
};

export const createGroup = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;
        const data: CreateGroupBody = req.body;

        // validation
        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }
        if (!data.groupName || !data.userIdsInGroup) {
            return errRes(res, 400, 'invalid data for creating group');
        }

        const memebers: string[] = JSON.parse(data.userIdsInGroup);
        if (memebers?.length < 1) {
            return errRes(res, 400, 'invalid data for creating group');
        }
        memebers.push(userId);

        let secUrl;
        if (req.file) {
            secUrl = await uploadToCloudinary(req.file);
            if (secUrl === null) {
                return errRes(res, 500, "error while uploading user image");
            }
        }
        else {
            secUrl = "";
        }

        const newGroup = await Group.create({
            groupName: data.groupName, gpCreater: userId,
            gpImageUrl: secUrl, members: memebers
        });

        // Create a new mutex instance
        const newChannel = new Channel();
        // set newmutex for new groupId
        channels.set(newGroup._id.toString(), newChannel);

        // set members with groupId
        groupIds.set(newGroup._id.toString(), memebers);

        await Promise.all(memebers.map(async (userId) => {
            const ucOfGroupMem = await UnseenCount.create({ userId: userId, mainId: newGroup._id });
            await Notification.findOneAndUpdate({ userId: userId }, { $push: { unseenMessages: ucOfGroupMem._id } }).exec();
            const groupUser = await User.findById({ _id: userId });
            groupUser?.chatBarOrder.unshift(newGroup._id);
            await groupUser?.save();
        }));

        const memData = getMultiSockets(memebers, userId);
        // in online users of group, event is emitted only except for creater, as creater get group in response
        if (memData.online.length > 0) {
            const sdata: SoAddedInGroup = {
                _id: newGroup._id,
                groupName: data.groupName,
                gpImageUrl: secUrl
            };
            emitSocketEvent(req, clientE.ADDED_IN_GROUP, sdata, null, memData.online);
        }

        return res.status(200).json({
            success: true,
            message: 'group created successfully',
            newGroup: {
                _id: newGroup._id,
                groupName: newGroup.groupName,
                gpImageUrl: newGroup.gpImageUrl
            }
        });

    } catch (error) {
        return errRes(res, 500, 'error while creating group', error);
    }
};

export const checkOnlineFriends = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }

        const userData = await User.findById({ _id: userId }).select({ friends: true }).exec();

        if (userData?.friends.length === undefined || userData?.friends.length < 1) {
            return res.status(200).json({
                success: false,
                message: 'user have no friends',
            });
        }

        const onlineFriends: string[] = [];

        userData?.friends.forEach((friend) => {
            const friendId: string = friend.friendId._id.toString();
            if (userSocketIDs.has(friendId)) {
                onlineFriends.push(friendId);
            }
        });

        if (onlineFriends?.length === undefined || onlineFriends?.length < 1) {
            return res.status(200).json({
                success: false,
                message: 'no online friends',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'online friends',
            onlineFriends: onlineFriends
        });
    } catch (error) {
        return errRes(res, 500, 'error while getting online friends', error);
    }
};

export const setUnseenCount = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;
        const data: SetUnseenCountBody = req.body;

        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }

        if (!data.mainId || data.count === undefined) {
            return errRes(res, 400, 'invalid data for setunseencount');
        }

        await UnseenCount.findOneAndUpdate({ userId: userId, mainId: data.mainId },
            { $set: { count: data.count } });

        return res.status(200).json({
            success: true,
            message: 'unseen count updated successfully'
        });

    } catch (error) {
        return errRes(res, 400, 'error while setting unseen count', error);
    }
};

export const setOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;
        const data: SetOrderBody = req.body;

        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }

        if (!data.mainId) {
            return errRes(res, 400, 'invalid data for setunseencount');
        }
        const user = await User.findById({ _id: userId }).select({ chatBarOrder: true });
        const existingIndex = user?.chatBarOrder.indexOf(data.mainId);

        if (existingIndex !== undefined && existingIndex !== -1) {
            // mainId exists, move it to the first position
            user?.chatBarOrder.splice(existingIndex, 1); // Remove from current position
            user?.chatBarOrder.unshift(data.mainId); // Add to the beginning
        } else {
            // mainId doesn't exist
            return errRes(res, 400, 'error while getting previous order of mainId');
        }

        // Save the updated document
        await user?.save();

        return res.status(200).json({
            success: true,
            message: 'order updated successfully'
        });

    } catch (error) {
        return errRes(res, 400, 'error while setting order', error);
    }
};

