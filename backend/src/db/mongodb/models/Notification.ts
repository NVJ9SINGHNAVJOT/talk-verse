import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '@/db/mongodb/models/User';
import { IUnseenCount } from '@/db/mongodb/models/UnseenCount';

// Define an interface representing a Notification document
export interface INotification extends Document {
    userId: mongoose.Types.ObjectId & IUser;
    friendRequests: mongoose.Types.ObjectId[] & IUser[];
    unseenMessages: mongoose.Types.ObjectId[] & IUnseenCount[];
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
            type: Schema.Types.ObjectId,
            ref: 'UnseenCount'
        },
    ],
}, { timestamps: true });

// Create the Notification model
const Notification: Model<INotification> = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
