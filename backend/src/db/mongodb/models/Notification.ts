import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '@/db/mongodb/models/User';

// Define interfaces for the nested objects in the Notification schema
interface UnseenMessage {
    userId: mongoose.Types.ObjectId & IUser;
    unseenCount: number;
}

// Define an interface representing a Notification document
export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    friendRequests: mongoose.Types.ObjectId[] & IUser[];
    unseenMessages: UnseenMessage[];
}

// Define the Notification schema using the interface
const notificationSchema = new Schema<INotification>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    friendRequests: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    unseenMessages: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            unseenCount: {
                type: Number,
                default: 0,
            },
        },
    ],
}, { timestamps: true });

// Create the Notification model
const Notification: Model<INotification> = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
