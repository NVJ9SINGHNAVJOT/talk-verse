import { Socket } from "socket.io-client";
import { serverE } from "@/socket/events";
import { SoSendGroupMessage, SoSendMessage } from "@/types/socket/eventTypes";
import { encryptGMessage, encryptPMessage } from "@/utils/encryptionAndDecryption";
import { toast } from "react-toastify";

export const sendMessageEvent = async (
  socket: Socket,
  chatId: string,
  to: string,
  text: string,
  myPublicKey: string,
  friendPublicKey: string
) => {
  const newFromText = await encryptPMessage(text, myPublicKey);
  const newToText = await encryptPMessage(text, friendPublicKey);

  if (!newFromText || !newToText) {
    toast.error("Error while sending message, encryption failed");
    return;
  }

  const newMessage: SoSendMessage = {
    chatId: chatId,
    to: to,
    fromText: newFromText,
    toText: newToText,
  };
  try {
    socket.emit(serverE.SEND_MESSAGE, newMessage);
  } catch (error) {
    toast.error("Error while sending message");
  }
};

export const sendGroupMessageEvent = async (
  socket: Socket,
  groupId: string,
  text: string,
  firstName: string,
  lastName: string,
  imageUrl?: string
) => {
  const newText = await encryptGMessage(text);
  if (!newText) {
    toast.error("Error while sending group message, encryption failed");
    return;
  }
  const newGpMessage: SoSendGroupMessage = {
    _id: groupId,
    firstName: firstName,
    lastName: lastName,
    text: newText,
    imageUrl: imageUrl,
  };
  try {
    socket.emit(serverE.SEND_GROUP_MESSAGE, newGpMessage);
  } catch (error) {
    toast.error("Error while sending group message");
  }
};
