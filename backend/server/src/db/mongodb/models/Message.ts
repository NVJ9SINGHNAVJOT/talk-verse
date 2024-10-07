import mongoose, { Schema, Document, Model } from "mongoose";
import { IChat } from "@/db/mongodb/models/Chat";
import { IUser } from "@/db/mongodb/models/User";

// Define an interface representing a Message document
export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  uuId: string;
  isFile: boolean;
  chatId: string | IChat;
  from: string | IUser;
  to: string | IUser;
  fromText: string;
  toText: string;
  createdAt: Date;
  updatedAt: Date;
}

export type KafkaIMessageType = Omit<
  IMessage,
  keyof Document | "_id" | "chatId" | "isFile" | "from" | "to" | "updatedAt"
> & {
  chatId: string;
  from: string;
  to: string;
  isFile?: boolean;
};

// Define the Message schema using the interface
const messageSchema = new Schema<IMessage>({
  uuId: {
    type: String,
    required: true,
    unique: true,
  },
  isFile: {
    type: Boolean,
    default: false,
  },
  chatId: {
    type: String,
    ref: "Chat",
    required: true,
  },
  from: {
    type: String,
    ref: "User",
    required: true,
  },
  to: {
    type: String,
    ref: "User",
    required: true,
  },
  fromText: {
    type: String,
    required: true,
    trim: true,
  },
  toText: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Message model
const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
