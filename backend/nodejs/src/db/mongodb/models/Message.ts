import mongoose, { Schema, Document, Model } from "mongoose";
import { IChat } from "@/db/mongodb/models/Chat";
import { IUser } from "@/db/mongodb/models/User";

// Define an interface representing a Message document
export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  uuId: string;
  isFile: boolean;
  chatId: mongoose.Types.ObjectId | IChat;
  from: mongoose.Types.ObjectId | IUser;
  to: mongoose.Types.ObjectId | IUser;
  fromText: string;
  toText: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IMessageType = Omit<
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
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: Schema.Types.ObjectId,
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
