import GpMessage from "@/db/mongodb/models/GpMessage";
import Group from "@/db/mongodb/models/Group";
import Message from "@/db/mongodb/models/Message";
import User from "@/db/mongodb/models/User";
import { CreateGroupBody, FileMessageBody } from "@/types/controller/chatReq";
import { CustomRequest } from "@/types/custom";
import uploadToCloudinary from "@/utils/cloudinaryUpload";
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

export const chatMessages = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }

        const { chatId, skip } = req.query;

        if (!chatId || !skip) {
            return errRes(res, 400, 'invalid data in querry');
        }

        const skipN = parseInt(skip as string);

        const messages = await Message.find({ chatId: chatId })
            .sort({ createAt: -1 })
            .skip(skipN)
            .limit(20)
            .select({ from: true, to: true, text: true, createdAt: true })
            .lean()
            .exec();

        if (messages.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'no messages yet for this chatId'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'messages for chatid successfull',
            messages: messages
        });

    } catch (error) {
        return errRes(res, 500, "error while getting chat messages");
    }
};

export const fileMessage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;
        const data: FileMessageBody = req.body;

        // validation
        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }
        if (!data.from || !data.to || !data.isGroup || !data.mainId || !req.file) {
            return errRes(res, 400, 'invalid data for filemessage');
        }


        const secUrl = await uploadToCloudinary(req.file);
        if (secUrl === null) {
            return errRes(res, 500, "error while uploading user image");
        }


        // TODO: socket event

        return res.status(200).json({
            success: true,
            message: 'filemessage send successfully',
        });

    } catch (error) {
        return errRes(res, 500, 'error while uploading filemessage');
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
        if (!data.groupName || data.userIdsInGroup.length === 0) {
            return errRes(res, 400, 'invalid data for creating group');
        }

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
            gpImageUrl: secUrl, members: data.userIdsInGroup
        });

        // TODO: socket event

        return res.status(200).json({
            success: true,
            message: 'group created successfully',
        });

    } catch (error) {
        return errRes(res, 500, 'error while uploading filemessage');
    }
};

export const groupMessages = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }

        const { groupId, skip } = req.query;

        if (!groupId || !skip) {
            return errRes(res, 400, 'invalid data in querry');
        }

        const skipN = parseInt(skip as string);

        const gpMessages = await GpMessage.find({ chatId: groupId })
            .sort({ createAt: -1 })
            .skip(skipN)
            .limit(20)
            .select({ from: true, text: true, createdAt: true })
            .lean()
            .exec();

        if (gpMessages.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'no messages yet for this chatId'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'messages for chatid successfull',
            messages: gpMessages
        });

    } catch (error) {
        return errRes(res, 500, "error while getting chat messages");
    }
};