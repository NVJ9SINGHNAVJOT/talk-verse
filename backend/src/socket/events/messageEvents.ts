import { Server, Socket } from 'socket.io';
import { clientE, serverE } from '@/socket/events';
import { getMultiSockets, getSingleSocket } from '@/utils/getSocketIds';
import { SoGroupMessageRecieved, SoMessageRecieved, SoSendGroupMessage, SoSendMessage } from '@/types/socket/eventTypes';
import { channels, groupIds } from '@/socket/index';
import { logger } from '@/logger/logger';
import { v4 as uuidv4 } from "uuid";
import Message from '@/db/mongodb/models/Message';
import UnseenCount from '@/db/mongodb/models/UnseenCount';
import GpMessage from '@/db/mongodb/models/GpMessage';

export const registerMessageEvents = (io: Server, socket: Socket, userId: string): void => {

    socket.on(serverE.SEND_MESSAGE, async (data: SoSendMessage) => {
        try {
            const channel = channels.get(data.chatId);
            if (!channel) {
                logger.error('channel is not present in channels', data);
                return;
            }

            // message through channel
            await channel.lock();
            const uuId = uuidv4();
            const createdAt = new Date();
            const newMessage: SoMessageRecieved = {
                uuId: uuId,
                isFile: false,
                from: userId,
                text: data.text,
                createdAt: createdAt
            };
            const sId = getSingleSocket(data.to);
            if (sId) {
                io.to([sId, socket.id]).emit(clientE.MESSAGE_RECIEVED, newMessage);
            }
            else {
                io.to(socket.id).emit(clientE.MESSAGE_RECIEVED, newMessage);
            }
            // release channel
            channel.unlock();

            try {
                await Message.create({ uuId: uuId, chatId: data.chatId, from: userId, to: data.to, text: data.text, createdAt: createdAt });
                if (sId === undefined) {
                    await UnseenCount.findOneAndUpdate({ userId: data.to, mainId: data.chatId }, { $inc: { count: 1 } });
                }
            } catch (error) {
                logger.error('error while creating message', { error: error, data: data, newMessage: newMessage });
            }
        } catch (error) {
            logger.error('error while sending message for chat', { error: error });
        }
    });

    socket.on(serverE.SEND_GROUP_MESSAGE, async (data: SoSendGroupMessage) => {
        try {


            const members = groupIds.get(data._id);
            if (!members || members.length === 0) {
                logger.error('no members present for group', { data: data });
                return;
            }
            const memData = getMultiSockets(members, userId);
            if (memData.online.length > 0) {
                const channel = channels.get(data._id);
                if (!channel) {
                    logger.error('channel not present for groupId', { data: data });
                    return;
                }

                // message through channel
                await channel.lock();
                const uuId = uuidv4();
                const createdAt = new Date();

                const newGpMessage: SoGroupMessageRecieved = {
                    uuId: uuId,
                    isFile: false,
                    from: userId,
                    to: data._id,
                    text: data.text,
                    createdAt: createdAt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    imageUrl: data.imageUrl
                };
                io.to(memData.online).emit(clientE.GROUP_MESSAGE_RECIEVED, newGpMessage);
                // release channel
                channel.unlock();

                try {
                    await GpMessage.create({ uuId: uuId, from: userId, to: data._id, text: data.text, createdAt: createdAt });
                    if (memData.offline.length > 0) {
                        await UnseenCount.updateMany(
                            { userId: { $in: memData.offline }, mainId: data._id },
                            { $inc: { count: 1 } }
                        );
                    }
                } catch (error) {
                    logger.error('error while creating goupMessage', { error: error, data: data, newGpMessage: newGpMessage });
                }
            }
        } catch (error) {
            logger.error('error while sending group message', { error: error });
        }
    });
};
