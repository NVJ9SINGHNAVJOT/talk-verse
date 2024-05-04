import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '@/db/mongodb/models/User';
import { IGroup } from '@/db/mongodb/models/Group';

// Define an interface representing a Group Message document
export interface IGpMessage extends Document {
    from: mongoose.Types.ObjectId & IUser;
    to: mongoose.Types.ObjectId & IGroup;
    text: string;
}

// Define the Group Message schema using the interface
const gpMessageSchema = new Schema<IGpMessage>({
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
}, { timestamps: true });

// Create the Group Message model
const GpMessage: Model<IGpMessage> = mongoose.model<IGpMessage>('GpMessage', gpMessageSchema);

export default GpMessage;
