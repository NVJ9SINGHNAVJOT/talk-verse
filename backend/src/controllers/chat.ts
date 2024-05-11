import GpMessage from "@/db/mongodb/models/GpMessage";
import Group from "@/db/mongodb/models/Group";
import Message from "@/db/mongodb/models/Message";
import UnseenCount from "@/db/mongodb/models/UnseenCount";
import User from "@/db/mongodb/models/User";
import { channels, groupIds } from "@/socket";
import { clientE } from "@/socket/events";
import { CreateGroupBody, FileMessageBody } from "@/types/controllers/chatReq";
import { CustomRequest } from "@/types/custom";
import Channel from "@/types/channel";
import { SoAddedInGroup, SoGroupMessageRecieved, SoMessageRecieved } from "@/types/socket/eventTypes";
import uploadToCloudinary from "@/utils/cloudinaryUpload";
import emitSocketEvent from "@/utils/emitSocketEvent";
import { errRes } from "@/utils/error";
import { getMultiSockets } from "@/utils/getSocketIds";
import { Request, Response } from 'express';
import { v4 as uuidv4 } from "uuid";

type BarData = {
    // common
    _id: string,

    // friend
    chatId?: string
    firstName?: string,
    lastName?: string,
    imageUrl?: string

    // group
    groupName?: string,
    gpImageUrl?: string
}
export const chatBarData = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }

        const userFriends = await User.findById({ _id: userId })
            .select({ friends: true, chatBar: true })
            .populate({
                path: 'friends.friendId',
                select: 'firstName lastName imageUrl',
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

        // sort as per chatBar
        const chatBar: (BarData)[] = [];

        // combine user friends and their chatId in array and push in chatbar 
        const friends = userFriends?.friends?.map((item) => {
            const newValue: BarData = {
                _id: item.friendId._id,
                firstName: item.friendId.firstName,
                lastName: item.friendId.lastName,
                imageUrl: item.friendId.imageUrl,
                chatId: item.chatId as unknown as string,
            };
            chatBar.push(newValue);
            return newValue;
        }
        );

        // push groups in chatbar
        groups.forEach((group) => {
            chatBar.push(group);
        });

        // sort chatbar as per user chatbarorder
        const sortedBarData = chatBar.sort((a, b) => {
            const indexA = userFriends?.chatBarOrder.indexOf(a._id);
            const indexB = userFriends?.chatBarOrder.indexOf(b._id);
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
            chatBarData: sortedBarData
        });

    } catch (error) {
        return errRes(res, 500, "error while sending request", error);
    }
};

export const chatMessages = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }

        const { chatId, createdAt } = req.query;

        if (!chatId) {
            return errRes(res, 400, 'invalid data in querry');
        }

        let query;
        console.log('createdat', createdAt)
        if (createdAt) {
            const before = new Date(createdAt as string);
            console.log('bveforeee', before)
            query = {
                chatId: chatId as string,
                createdAt: { $lt: before }
            };
        }
        else {
            query = {
                chatId: chatId as string
            };
        }

        const messages = await Message.find(query)
            .sort({ createAt: -1 })
            .limit(20)
            .select({ uuId: true, isFile: true, from: true, text: true, createdAt: true, _id: false })
            .lean()
            .exec();

        if (messages.length === 0) {
            if (createdAt) {
                return res.status(200).json({
                    success: false,
                    message: 'no further messages for this chatId'
                });
            }
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
        return errRes(res, 500, "error while getting chat messages", error);
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
        if (!data.to || !data.mainId || !req.file) {
            return errRes(res, 400, 'invalid data for filemessage');
        }

        const secUrl = await uploadToCloudinary(req.file);
        if (secUrl === null) {
            return errRes(res, 500, "error while uploading user image");
        }

        if (data.isGroup === "1") {
            if (!data.firstName || !data.lastName) {
                return errRes(res, 400, 'invalid data for sending group message');
            }

            const members = groupIds.get(data.mainId);
            if (!members) {
                return errRes(res, 400, "no members for group for file message");
            }

            const channel = channels.get(data.mainId);
            if (!channel) {
                return errRes(res, 500, 'no channel for group');
            }
            const memData = getMultiSockets(members, userId);
            if (members.length > 0) {
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
                if (memData.online.length > 0) {
                    emitSocketEvent(req, clientE.GROUP_MESSAGE_RECIEVED, sdata, null, memData.online);
                }
                // release channel
                channel.unlock();

                // increase unseen count for offline members of group
                try {
                    await GpMessage.create({ uuId: uuId, isFile: true, from: userId, to: data.to, text: secUrl, createdAt: createdAt });
                    // offline users dont include userId of current user
                    if (memData.offline.length > 0) {
                        await UnseenCount.updateMany(
                            { userId: { $in: memData.offline }, mainId: data.mainId },
                            { $inc: { count: 1 } }
                        );
                    }
                } catch (error) {
                    return errRes(res, 500, "error while updating unseen count for group members", { error, sdata });
                }
            }
        }
        else {
            const twoUser = getMultiSockets([userId, data.to], userId);
            const channel = channels.get(data.mainId);
            if (!channel) {
                return errRes(res, 500, 'no channel for two user chat');
            }
            // message through channel
            await channel.lock();
            const uuId = uuidv4();
            const createdAt = new Date();
            const sdata: SoMessageRecieved = {
                uuId: uuId,
                isFile: true,
                from: userId,
                text: secUrl,
                createdAt: createdAt.toISOString(),
            };
            if (twoUser.online.length > 0) {
                emitSocketEvent(req, clientE.MESSAGE_RECIEVED, sdata, null, twoUser.online);
            }
            // release channel
            channel.unlock();

            try {
                await Message.create({ uuId: uuId, isFile: true, from: userId, to: data.to, text: secUrl, createdAt: createdAt });
                if (twoUser.offline.length === 1) {
                    await UnseenCount.updateOne({ userId: twoUser.offline[0], mainId: data.mainId }, { $inc: { count: 1 } });
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
        return errRes(res, 500, 'error while uploading filemessage', error);
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

        // Create a new mutex instance
        const newChannel = new Channel();
        // set newmutex for new groupId
        channels.set(newGroup._id.toString(), newChannel);

        // set members with groupId
        groupIds.set(newGroup._id.toString(), data.userIdsInGroup);

        await Promise.all(data.userIdsInGroup.map(async (userId) => {
            await UnseenCount.create({ userId, mainId: newGroup._id });
        }));

        const memData = getMultiSockets(data.userIdsInGroup, userId);
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
                gpName: newGroup.groupName,
                gpImageUrl: newGroup.gpImageUrl
            }
        });

    } catch (error) {
        return errRes(res, 500, 'error while uploading filemessage', error);
    }
};

export const groupMessages = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        if (!userId) {
            return errRes(res, 400, 'user id not present');
        }

        const { groupId, createdAt } = req.query;

        if (!groupId) {
            return errRes(res, 400, 'invalid data in querry');
        }

        let query;
        if (createdAt) {
            const before = new Date(createdAt as string);
            query = {
                to: groupId as string,
                createdAt: { $lt: before }
            };
        }
        else {
            query = {
                to: groupId as string
            };
        }

        const gpMessages = await GpMessage.find(query)
            .sort({ createAt: -1 })
            .limit(20)
            .select({ uuId: true, isFile: true, from: true, text: true, createdAt: true, _id: false })
            .populate({
                path: "from",
                select: "firstName lastName imageUrl"
            })
            .lean()
            .exec();

        if (gpMessages.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'no messages yet for this group'
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