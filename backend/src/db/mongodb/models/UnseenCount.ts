import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '@/db/mongodb/models/User';

// Define an interface representing a UnseenCount document
export interface IUnseenCount extends Document {
    userId: mongoose.Types.ObjectId & IUser;
    mainId: mongoose.Types.ObjectId;
    count: number;
}

// Define the UnseenCount schema using the interface
const unseenCountSchema = new Schema<IUnseenCount>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mainId: {
        // type: Schema.Types.ObjectId
        // ref: Chat
        // ref: Group
        type: Schema.Types.ObjectId,
        required: true,
    },
    count: {
        type: Number,
        required: true,
        default: 0,
    }

}, { timestamps: true });

// Create the UnseenCount model
const UnseenCount: Model<IUnseenCount> = mongoose.model<IUnseenCount>('UnseenCount', unseenCountSchema);

export default UnseenCount;
