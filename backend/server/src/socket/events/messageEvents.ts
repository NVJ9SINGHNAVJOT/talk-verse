import { Server, Socket } from "socket.io";
import { clientE, serverE } from "@/socket/events";
import { getSingleUserSockets } from "@/utils/getSocketIds";
import {
  SoGroupMessageRecieved,
  SoMessageRecieved,
  SoSendGroupMessageSchema,
  SoSendMessageSchema,
} from "@/types/socket/eventTypes";
import { channels, groupOffline } from "@/socket/index";
import { logger } from "@/logger/logger";
import { v4 as uuidv4 } from "uuid";
import { kafkaProducer } from "@/kafka/kafka";

export const registerMessageEvents = (io: Server, socket: Socket, userId: string): void => {
  socket.on(serverE.SEND_MESSAGE, async (data) => {
    let uuId;
    let createdAt;
    try {
      // check event data
      const sendMessageEvent = SoSendMessageSchema.safeParse(data);
      if (!sendMessageEvent.success) {
        logger.error(`invalid data in socket send message event, ${sendMessageEvent.error.message}`);
        return;
      }
      const edata = sendMessageEvent.data;

      const channel = channels.get(data.chatId);
      if (!channel) {
        logger.error("channel is not present in channels", data);
        return;
      }

      // message through channel
      await channel.lock();
      uuId = uuidv4();
      createdAt = new Date();
      const newMessage: SoMessageRecieved = {
        uuId: uuId,
        isFile: false,
        chatId: edata.chatId,
        from: userId,
        text: edata.fromText,
        createdAt: createdAt.toISOString(),
      };
      /* INFO: fromText for currUser and toText for friend */
      const currUserSocketIds = getSingleUserSockets(userId);
      const friendSocketIds = getSingleUserSockets(edata.to);

      if (currUserSocketIds.length > 0) {
        io.to(currUserSocketIds).emit(clientE.MESSAGE_RECIEVED, newMessage);
      }
      if (friendSocketIds.length > 0) {
        // now send message to friend, text to changed to toText
        newMessage.text = edata.toText;
        io.to(friendSocketIds).emit(clientE.MESSAGE_RECIEVED, newMessage);
      }
      // release channel
      channel.unlock();
      await kafkaProducer.message({
        uuId: uuId,
        chatId: edata.chatId,
        from: userId,
        to: edata.to,
        fromText: edata.fromText,
        toText: edata.toText,
        createdAt: createdAt,
      });

      if (friendSocketIds.length === 0) {
        await kafkaProducer.unseenCount([edata.to], edata.chatId);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error("error while sending message for chat", {
        error: error.message,
        data: data,
        uuId: uuId,
        createdAt: createdAt,
      });
    }
  });

  socket.on(serverE.SEND_GROUP_MESSAGE, async (data) => {
    let uuId;
    let createdAt;
    try {
      // check event data
      const sendGroupMessageEvent = SoSendGroupMessageSchema.safeParse(data);
      if (!sendGroupMessageEvent.success) {
        logger.error(`invalid data in socket send group message event, ${sendGroupMessageEvent.error.message}`);
        return;
      }
      const edata = sendGroupMessageEvent.data;

      const channel = channels.get(edata._id);
      if (!channel) {
        logger.error("channel not present for groupId", { data: edata });
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
        to: edata._id,
        text: edata.text,
        createdAt: createdAt.toISOString(),
        firstName: edata.firstName,
        lastName: edata.lastName,
        imageUrl: edata.imageUrl,
      };
      io.to(edata._id).emit(clientE.GROUP_MESSAGE_RECIEVED, newGpMessage);
      // release channel
      channel.unlock();

      await kafkaProducer.gpMessage({
        uuId: uuId,
        from: userId,
        to: edata._id,
        text: edata.text,
        createdAt: createdAt,
      });
      const offlineMem = groupOffline.get(edata._id);

      if (!offlineMem) {
        logger.error("no offline set present for groupId", { data: edata, newGpMessage: newGpMessage });
        return;
      }

      if (offlineMem.size !== 0) {
        const newOfline = Array.from(offlineMem);
        await kafkaProducer.unseenCount(newOfline, edata._id);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error("error while sending group message", {
        error: error.message,
        data: data,
        uuId: uuId,
        createdAt: createdAt,
      });
    }
  });
};
