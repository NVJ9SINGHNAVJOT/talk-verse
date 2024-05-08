import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '@/db/mongodb/models/User';

// Define an interface representing a Group document
export interface IGroup extends Document {
    groupName: string;
    gpCreater: mongoose.Types.ObjectId & IUser;
    gpImageUrl: string;
    members: mongoose.Types.ObjectId[] & IUser[];
}

// Define the Group schema using the interface
const groupSchema = new Schema<IGroup>({
    groupName: {
        type: String,
        required: true,
        trim: true,
    },
    gpCreater: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    gpImageUrl: {
        type: String,
        trim: true,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
}, { timestamps: true });

// Define the model
const Group: Model<IGroup> = mongoose.model<IGroup>('Group', groupSchema);

export default Group;
