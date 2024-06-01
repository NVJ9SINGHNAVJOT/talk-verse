import GpMessage from "@/db/mongodb/models/GpMessage";
import Group from "@/db/mongodb/models/Group";
import Message from "@/db/mongodb/models/Message";
import UnseenCount from "@/db/mongodb/models/UnseenCount";
import User from "@/db/mongodb/models/User";
import { channels, groupIds, groupOffline } from "@/socket";
import { clientE } from "@/socket/events";
import { ChatMessagesReqSchema, FileMessageReqSchema, GroupMessagesReqSchema } from "@/types/controllers/chatReq";
import { CustomRequest } from "@/types/custom";
import { SoGroupMessageRecieved, SoMessageRecieved } from "@/types/socket/eventTypes";
import { uploadToCloudinary } from '@/utils/cloudinaryHandler';
import emitSocketEvent from "@/utils/emitSocketEvent";
import { errRes } from "@/utils/error";
import { getSingleSocket } from "@/utils/getSocketIds";
import { Request, Response } from 'express';
import { v4 as uuidv4 } from "uuid";
import { deleteFile } from "@/utils/deleteFile";

type BarData = {
    // common
    _id: string,

    // friend
    chatId?: string
    firstName?: string,
    lastName?: string,
    imageUrl?: string,

    // group
    groupName?: string,
    gpImageUrl?: string
}

type FriendPublicKey = {
    friendId: string,
    publicKey: string
}

export const chatBarData = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        const userFriends = await User.findById({ _id: userId })
            .select({ friends: true, chatBarOrder: true })
            .populate({
                path: 'friends.friendId',
                select: 'firstName lastName imageUrl publicKey',
            })
            .exec();

        const groups = await Group.find({ members: { $in: [userId] } })
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

        // chatBar data and friends public key pairs
        const chatBar: BarData[] = [];
        const friendPublicKeys: FriendPublicKey[] = [];

        // combine user friends and their chatId in array and push in chatbar 
        const friends = userFriends?.friends?.map((item) => {
            const newValue: BarData = {
                _id: item.friendId._id.toString(),
                firstName: item.friendId.firstName,
                lastName: item.friendId.lastName,
                imageUrl: item.friendId.imageUrl,
                chatId: item.chatId._id.toString(),
            };
            chatBar.push(newValue);
            friendPublicKeys.push({ friendId: item.friendId._id.toString(), publicKey: item.friendId.publicKey });
            return newValue;
        }
        );

        // push groups in chatbar
        groups.forEach((group) => {
            chatBar.push(group as BarData);
        });

        // sort chatbar as per user chatbarorder
        const sortedBarData = chatBar.sort((a, b) => {
            const tempA = a.chatId ? a.chatId : a._id.toString();
            const tempB = b.chatId ? b.chatId : b._id.toString();
            const indexA = userFriends?.chatBarOrder.indexOf(tempA);
            const indexB = userFriends?.chatBarOrder.indexOf(tempB);
            if (indexA === undefined || indexB === undefined) {
                return 0;
            }
            return indexA - indexB;
        });

        return res.status(200).json({
            success: true,
            message: 'chat bar data send successfully',
            friends: friends,
            groups: groups,
            chatBarData: sortedBarData,
            friendPublicKeys: friendPublicKeys
        });

    } catch (error) {
        return errRes(res, 500, "error while getting chatbar data", error);
    }
};

export const fileMessage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;
        const fileMessageReq = FileMessageReqSchema.safeParse(req.body);

        // validation
        if (!req.file) {
            return errRes(res, 400, 'file not present for message');
        }
        if (!fileMessageReq.success) {
            deleteFile(req.file);
            return errRes(res, 400, `invalid data for filemessage, ${fileMessageReq.error.toString()}`);
        }
        const data = fileMessageReq.data;

        const secUrl = await uploadToCloudinary(req.file);
        if (secUrl === null) {
            if (req.file) {
                deleteFile(req.file);
            }
            return errRes(res, 500, "error while uploading filemessage to cloudinary, url is null");
        }

        if (data.isGroup === "true") {
            if (!data.firstName || !data.lastName) {
                return errRes(res, 400, 'invalid user group data for sending group message');
            }

            const members = groupIds.get(data.mainId);
            if (!members) {
                return errRes(res, 400, "no members for group for file message");
            }

            const channel = channels.get(data.mainId);
            if (!channel) {
                return errRes(res, 500, 'no channel for group');
            }

            // message through channel
            await channel.lock();
            const uuId = uuidv4();
            const createdAt = new Date();
            const sdata: SoGroupMessageRecieved = {
                uuId: uuId,
                isFile: true,
                from: userId,
                to: data.to,
                text: secUrl,
                createdAt: createdAt.toISOString(),
                firstName: data.firstName,
                lastName: data.lastName,
                imageUrl: data.imageUrl,
            };

            emitSocketEvent(req, clientE.GROUP_MESSAGE_RECIEVED, sdata, data.mainId);

            // release channel
            channel.unlock();

            // increase unseen count for offline members of group
            try {
                await GpMessage.create({ uuId: uuId, isFile: true, from: userId, to: data.to, text: secUrl, createdAt: createdAt });

                // offline users dont include userId of current user
                const offlineMem = groupOffline.get(data.mainId);
                if (offlineMem) {
                    const newOfline = Array.from(offlineMem);
                    if (newOfline.length > 0) {
                        await UnseenCount.updateMany(
                            { userId: { $in: newOfline }, mainId: data.mainId },
                            { $inc: { count: 1 } }
                        );
                    }
                }
                else {
                    return errRes(res, 400, "no offline set present for groupId");
                }
            } catch (error) {
                return errRes(res, 500, "error while updating unseen count for group members", { error, sdata });
            }
        }
        else {
            const channel = channels.get(data.mainId);
            if (!channel) {
                return errRes(res, 500, 'no channel for two user chat');
            }
            // message through channel
            await channel.lock();
            const combineSocketIds: string[] = [];
            const mySocketId = getSingleSocket(userId);
            const friendSocketId = getSingleSocket(data.to);

            if (mySocketId) {
                combineSocketIds.push(mySocketId);
            }
            if (friendSocketId) {
                combineSocketIds.push(friendSocketId);
            }

            const uuId = uuidv4();
            const createdAt = new Date();
            const sdata: SoMessageRecieved = {
                uuId: uuId,
                isFile: true,
                chatId: data.mainId,
                from: userId,
                text: secUrl,
                createdAt: createdAt.toISOString(),
            };
            if (combineSocketIds.length > 0) {
                emitSocketEvent(req, clientE.MESSAGE_RECIEVED, sdata, null, combineSocketIds);
            }
            // release channel
            channel.unlock();

            try {
                await Message.create({
                    uuId: uuId, isFile: true, chatId: data.mainId, from: userId,
                    to: data.to, fromText: secUrl, toText: secUrl, createdAt: createdAt
                });
                if (!friendSocketId) {
                    await UnseenCount.updateOne({ userId: data.to, mainId: data.mainId }, { $inc: { count: 1 } });
                }
            } catch (error) {
                errRes(res, 500, 'error while updating unseen count for chat', error);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'filemessage send successfully',
        });

    } catch (error) {
        if (req.file) {
            deleteFile(req.file);
        }
        return errRes(res, 500, 'error while uploading filemessage', error);
    }
};

export const chatMessages = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        const chatMessagesReq = ChatMessagesReqSchema.safeParse(req.query);

        if (!chatMessagesReq.success) {
            return errRes(res, 400, `invalid data for chat messages, ${chatMessagesReq.error.toString()}`);
        }

        const data = chatMessagesReq.data;

        const messages = await Message.find({
            chatId: `${data.chatId}`,
            createdAt: { $lt: `${data.createdAt}` }
        })
            .sort({ createdAt: -1 })
            .limit(15)
            .select({ uuId: true, isFile: true, chatId: true, from: true, fromText: true, toText: true, createdAt: true, _id: false })
            .lean()
            .exec();

        if (messages.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'no further messages for this chatId'
            });
        }

        const newMessages: SoMessageRecieved[] = [];

        messages.forEach((message) => {
            const userChatMessage: SoMessageRecieved = {
                uuId: message.uuId,
                isFile: message.isFile,
                chatId: message.chatId._id.toString(),
                from: message.from._id.toString(),
                text: message.from._id.toString() === userId ? message.fromText : message.toText,
                createdAt: message.createdAt.toISOString()
            };
            newMessages.push(userChatMessage);
        });

        return res.status(200).json({
            success: true,
            message: 'messages for chatid successfull',
            messages: newMessages
        });

    } catch (error) {
        return errRes(res, 500, "error while getting chat messages", error);
    }
};

export const groupMessages = async (req: Request, res: Response): Promise<Response> => {
    try {
        const groupMessagesReq = GroupMessagesReqSchema.safeParse(req.query);

        if (!groupMessagesReq.success) {
            return errRes(res, 400, `invalid data for group messages, ${groupMessagesReq.error.toString()}`);
        }

        const data = groupMessagesReq.data;

        const gpMessages = await GpMessage.find({
            to: `${data.groupId}`,
            createdAt: { $lt: `${data.createdAt}` }
        })
            .sort({ createdAt: -1 })
            .limit(15)
            .select({ uuId: true, isFile: true, from: true, to: true, text: true, createdAt: true, _id: false })
            .populate({
                path: "from",
                select: "firstName lastName imageUrl"
            })
            .lean()
            .exec();

        if (gpMessages.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'no further messages for this group'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'messages for group successfull',
            messages: gpMessages
        });

    } catch (error) {
        return errRes(res, 500, "error while getting group messages", error);
    }
};