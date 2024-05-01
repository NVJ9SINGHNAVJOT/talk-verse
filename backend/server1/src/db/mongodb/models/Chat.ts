import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '@/db/mongodb/models/User';

// Define an interface representing a Chat document
export interface IChat extends Document {
    chatUsers: mongoose.Types.ObjectId[] & IUser;
}

// Define the Chat schema using the interface
const chatSchema = new Schema<IChat>({
    chatUsers: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        validate: [
            (array: mongoose.Types.ObjectId[]) => array.length <= 2,
            'chatUsers array exceeds the limit of 2'
        ],
    },
}, { timestamps: true });

// Create the Chat model
const Chat: Model<IChat> = mongoose.model<IChat>('Chat', chatSchema);

export default Chat;
