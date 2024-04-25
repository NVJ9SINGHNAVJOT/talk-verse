import mongoose, { InferSchemaType } from 'mongoose';

// Define the Profile schema
const gpMessageSchema = new mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

// Use InferSchemaType to derive the TypeScript type
type GpMessageType = InferSchemaType<typeof gpMessageSchema>;

// Export the Profile model
const GpMessage = mongoose.model<GpMessageType>('GpMessage', gpMessageSchema);
export default GpMessage;