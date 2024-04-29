import mongoose, { InferSchemaType } from 'mongoose';

// Define the Profile schema
const chatSchema = new mongoose.Schema(
    {
        chatUsers: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            max: [2, 'chatUsers array exceeds the limit of 2'],
        },
    },
    { timestamps: true }
);

// Use InferSchemaType to derive the TypeScript type
type ChatType = InferSchemaType<typeof chatSchema>;

// Export the Profile model
const Chat = mongoose.model<ChatType>('Chat', chatSchema);
export default Chat;