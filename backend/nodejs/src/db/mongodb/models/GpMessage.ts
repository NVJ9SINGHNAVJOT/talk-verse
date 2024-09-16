import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "@/db/mongodb/models/User";
import { IGroup } from "@/db/mongodb/models/Group";

// Define an interface representing a Group Message document
export interface IGpMessage {
  _id: mongoose.Types.ObjectId;
  uuId: string;
  isFile: boolean;
  from: string | IUser;
  to: string | IGroup;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export type KafkaIGpMessageType = Omit<IGpMessage, keyof Document | "_id" | "isFile" | "from" | "to" | "updatedAt"> & {
  from: string;
  to: string;
  isFile?: boolean;
};

// Define the Group Message schema using the interface
const gpMessageSchema = new Schema<IGpMessage>({
  uuId: {
    type: String,
    required: true,
    unique: true,
  },
  isFile: {
    type: Boolean,
    default: false,
  },
  from: {
    type: String,
    ref: "User",
    required: true,
  },
  to: {
    type: String,
    ref: "Group",
    required: true,
  },
  text: {
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

// Create the Group Message model
const GpMessage: Model<IGpMessage> = mongoose.model<IGpMessage>("GpMessage", gpMessageSchema);

export default GpMessage;
