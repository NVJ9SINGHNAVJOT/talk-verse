import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '@/db/mongodb/models/User';

// Define an interface representing a Chat document
export interface IChat extends Document {
    user1: mongoose.Types.ObjectId & IUser;
    user2: mongoose.Types.ObjectId & IUser;
}

// user 1 is who initially sent request and user 2 is who accepted that request
// Define the Chat schema using the interface
const chatSchema = new Schema<IChat>({
    user1: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    user2: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Create the Chat model
const Chat: Model<IChat> = mongoose.model<IChat>('Chat', chatSchema);

export default Chat;
