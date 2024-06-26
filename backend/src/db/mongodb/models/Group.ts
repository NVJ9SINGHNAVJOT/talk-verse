import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "@/db/mongodb/models/User";

// Define an interface representing a Group document
export interface IGroup extends Document {
  _id: mongoose.Types.ObjectId;
  groupName: string;
  gpCreater: mongoose.Types.ObjectId | IUser;
  gpImageUrl: string;
  members: (mongoose.Types.ObjectId | IUser)[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the Group schema using the interface
const groupSchema = new Schema<IGroup>(
  {
    groupName: {
      type: String,
      required: true,
      trim: true,
    },
    gpCreater: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gpImageUrl: {
      type: String,
      trim: true,
    },
    members: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Define the model
const Group: Model<IGroup> = mongoose.model<IGroup>("Group", groupSchema);

export default Group;
