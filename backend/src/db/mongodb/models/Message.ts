import mongoose, { Schema, Document, Model } from 'mongoose';
import { IChat } from '@/db/mongodb/models/Chat';
import { IUser } from '@/db/mongodb/models/User';

// Define an interface representing a Message document
export interface IMessage extends Document {
    chatId: mongoose.Types.ObjectId & IChat;
    from: mongoose.Types.ObjectId & IUser;
    to: mongoose.Types.ObjectId & IUser;
    text: string;
}

// Define the Message schema using the interface
const messageSchema = new Schema<IMessage>({
    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });

// Create the Message model
const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

export default Message;