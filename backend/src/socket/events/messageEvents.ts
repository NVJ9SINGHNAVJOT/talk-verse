import { Server, Socket } from "socket.io";
import { clientE, serverE } from "@/socket/events";
import { getSingleSocket } from "@/utils/getSocketIds";
import {
  SoGroupMessageRecieved,
  SoMessageRecieved,
  SoSendGroupMessage,
  SoSendMessage,
} from "@/types/socket/eventTypes";
import { channels, groupIds, groupOffline } from "@/socket/index";
import { logger } from "@/logger/logger";
import { v4 as uuidv4 } from "uuid";
import Message from "@/db/mongodb/models/Message";
import UnseenCount from "@/db/mongodb/models/UnseenCount";
import GpMessage from "@/db/mongodb/models/GpMessage";

export const registerMessageEvents = (io: Server, socket: Socket, userId: string): void => {
  socket.on(serverE.SEND_MESSAGE, async (data: SoSendMessage) => {
    try {
      if (!data.chatId || !data.fromText || !data.toText || !data.to) {
        logger.error("invalid data in socket send message event", { data: data });
        return;
      }

      const channel = channels.get(data.chatId);
      if (!channel) {
        logger.error("channel is not present in channels", data);
        return;
      }

      // message through channel
      await channel.lock();
      const uuId = uuidv4();
      const createdAt = new Date();
      const newMessage: SoMessageRecieved = {
        uuId: uuId,
        isFile: false,
        chatId: data.chatId,
        from: userId,
        text: data.fromText,
        createdAt: createdAt.toISOString(),
      };
      /* NOTE: fromText for currUser and toText for friend */
      const sId = getSingleSocket(data.to);
      io.to(socket.id).emit(clientE.MESSAGE_RECIEVED, newMessage);
      if (sId) {
        // now send message to friend, text to changed to toText
        newMessage.text = data.toText;
        io.to(sId).emit(clientE.MESSAGE_RECIEVED, newMessage);
      }
      // release channel
      channel.unlock();

      try {
        await Message.create({
          uuId: uuId,
          chatId: data.chatId,
          from: userId,
          to: data.to,
          fromText: data.fromText,
          toText: data.toText,
          createdAt: createdAt,
        });
        if (sId === undefined) {
          await UnseenCount.findOneAndUpdate({ userId: data.to, mainId: data.chatId }, { $inc: { count: 1 } });
        }
      } catch (error) {
        logger.error("error while creating message", { error: error, data: data, newMessage: newMessage });
      }
    } catch (error) {
      logger.error("error while sending message for chat", { error: error });
    }
  });

  socket.on(serverE.SEND_GROUP_MESSAGE, async (data: SoSendGroupMessage) => {
    try {
      if (!data._id || !data.text || !data.firstName || !data.lastName) {
        logger.error("invalid data in socket send group message event", { data: data });
        return;
      }

      const members = groupIds.get(data._id);
      if (!members || members.length === 0) {
        logger.error("no members present for group", { data: data });
        return;
      }

      const channel = channels.get(data._id);
      if (!channel) {
        logger.error("channel not present for groupId", { data: data });
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
        createdAt: createdAt.toISOString(),
        firstName: data.firstName,
        lastName: data.lastName,
        imageUrl: data.imageUrl,
      };
      io.to(data._id).emit(clientE.GROUP_MESSAGE_RECIEVED, newGpMessage);
      // release channel
      channel.unlock();

      try {
        await GpMessage.create({ uuId: uuId, from: userId, to: data._id, text: data.text, createdAt: createdAt });
        const offlineMem = groupOffline.get(data._id);
        if (offlineMem) {
          const newOfline = Array.from(offlineMem);
          if (newOfline.length > 0) {
            await UnseenCount.updateMany({ userId: { $in: newOfline }, mainId: data._id }, { $inc: { count: 1 } });
          }
        } else {
          logger.error("no offline set present for groupId", { data: data, newGpMessage: newGpMessage });
        }
      } catch (error) {
        logger.error("error while creating goupMessage", { error: error, data: data, newGpMessage: newGpMessage });
      }
    } catch (error) {
      logger.error("error while sending group message", { error: error });
    }
  });
};
