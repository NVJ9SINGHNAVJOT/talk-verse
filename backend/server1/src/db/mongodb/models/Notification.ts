import mongoose, { InferSchemaType } from 'mongoose';

// Define the Profile schema
const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        freindRequests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        unseenMessages: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                unseenCount: {
                    type: Number,
                    default: 0,
                },
            }
        ],
    },
    { timestamps: true }
);

// Use InferSchemaType to derive the TypeScript type
type NotificationType = InferSchemaType<typeof notificationSchema>;

// Export the Profile model
const Notification = mongoose.model<NotificationType>('Notification', notificationSchema);
export default Notification;