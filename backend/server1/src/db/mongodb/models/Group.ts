import mongoose, { InferSchemaType } from 'mongoose';

// Define the Profile schema
const groupSchema = new mongoose.Schema(
    {
        groupName: {
            type: String,
            required: true,
            trim: true,
        },
        gpCreater: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

// Use InferSchemaType to derive the TypeScript type
type GroupType = InferSchemaType<typeof groupSchema>;

// Export the Profile model
const Group = mongoose.model<GroupType>('Group', groupSchema);
export default Group;