import mongoose, { InferSchemaType } from 'mongoose';

// Define the Profile schema
const messageSchema = new mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
type MessageType = InferSchemaType<typeof messageSchema>;

// Export the Profile model
const Message = mongoose.model<MessageType>('Message', messageSchema);
export default Message;
