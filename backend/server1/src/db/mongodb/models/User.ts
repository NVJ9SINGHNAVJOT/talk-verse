import mongoose, { Schema, Document, Model } from 'mongoose';
import { IToken } from "@/db/mongodb/models/Token";

// Define interfaces for each model to represent the document structure
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    gender?: string;
    dateOfBirth?: string;
    about?: string;
    contactNumber?: number;
    imageUrl?: string;
    userToken?: mongoose.Types.ObjectId & IToken;
    friends: mongoose.Types.ObjectId[];
}

// Define the User schema
const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    gender: { type: String, trim: true },
    dateOfBirth: { type: String, trim: true },
    about: { type: String, trim: true },
    contactNumber: { type: Number, trim: true },
    imageUrl: { type: String, trim: true },
    userToken: { type: Schema.Types.ObjectId, ref: 'Token' },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// Create the User model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
