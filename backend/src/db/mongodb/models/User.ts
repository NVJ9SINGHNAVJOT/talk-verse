import mongoose, { Schema, Document, Model } from "mongoose";
import { IToken } from "@/db/mongodb/models/Token";
import { IChat } from "@/db/mongodb/models/Chat";

export interface CombineChatId {
  friendId: mongoose.Types.ObjectId & IUser;
  chatId: mongoose.Types.ObjectId & IChat;
}

// Define interfaces for each model to represent the document structure
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  userId2: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  publicKey: string;
  gender?: string;
  dateOfBirth?: string;
  bio?: string;
  countryCode: string;
  contactNumber?: number;
  imageUrl?: string;
  userToken?: mongoose.Types.ObjectId & IToken;
  friends: CombineChatId[];
  chatBarOrder: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const userSchema = new Schema<IUser>(
  {
    userId2: {
      type: Number,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    publicKey: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      trim: true,
    },
    dateOfBirth: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    countryCode: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: Number,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    userToken: {
      type: Schema.Types.ObjectId,
      ref: "Token",
    },
    friends: [
      {
        friendId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        chatId: {
          type: Schema.Types.ObjectId,
          ref: "Chat",
        },
      },
    ],
    chatBarOrder: [
      {
        // type: Schema.Types.ObjectId
        // ref: Chat
        // ref: Group
        type: String,
      },
    ],
  },
  { timestamps: true }
);

// Create the User model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
