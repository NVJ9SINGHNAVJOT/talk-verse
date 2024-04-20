import mongoose, { InferSchemaType } from 'mongoose';

// Define the Profile schema
const tokenSchema = new mongoose.Schema(
    {
        userToken: {
            type: String,
            required: true,
            unique: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 60 * 60 * 24 * 1, // The document will be automatically deleted after 1 day or 24h
        },
    },
    { timestamps: true }
);

// Use InferSchemaType to derive the TypeScript type
type TokenType = InferSchemaType<typeof tokenSchema>;

// Export the Profile model
const Token = mongoose.model<TokenType>('Token', tokenSchema);
export default Token;
