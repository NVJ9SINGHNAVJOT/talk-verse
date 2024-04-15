import mongoose, { InferSchemaType } from 'mongoose';

// Define the Profile schema
const tokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        email: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 60 * 60 * 24 * 7, // The document will be automatically deleted after 5 minutes of its creation time
        },
    },
    { timestamps: true }
);

// Use InferSchemaType to derive the TypeScript type
type TokenType = InferSchemaType<typeof tokenSchema>;

// Export the Profile model
const Token = mongoose.model<TokenType>('Token', tokenSchema);
export default Token;
