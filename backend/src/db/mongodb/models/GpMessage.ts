import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '@/db/mongodb/models/User';
import { IGroup } from '@/db/mongodb/models/Group';

// Define an interface representing a Group Message document
export interface IGpMessage extends Document {
    uuId: string;
    isFile: boolean,
    from: mongoose.Types.ObjectId & IUser;
    to: mongoose.Types.ObjectId & IGroup;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

// Define the Group Message schema using the interface
const gpMessageSchema = new Schema<IGpMessage>({
    uuId: {
        type: String,
        required: true,
        unique: true,
    },
    isFile: {
        type: Boolean,
        default: false
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
},);

// Create the Group Message model
const GpMessage: Model<IGpMessage> = mongoose.model<IGpMessage>('GpMessage', gpMessageSchema);

export default GpMessage;
