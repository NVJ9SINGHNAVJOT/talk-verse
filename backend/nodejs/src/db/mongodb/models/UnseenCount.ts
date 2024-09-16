import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "@/db/mongodb/models/User";

// Define an interface representing a UnseenCount document
export interface IUnseenCount extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string | IUser;
  mainId: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the UnseenCount schema using the interface
const unseenCountSchema = new Schema<IUnseenCount>(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    mainId: {
      // ref: Chat
      // ref: Group
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create the UnseenCount model
const UnseenCount: Model<IUnseenCount> = mongoose.model<IUnseenCount>("UnseenCount", unseenCountSchema);

export default UnseenCount;
