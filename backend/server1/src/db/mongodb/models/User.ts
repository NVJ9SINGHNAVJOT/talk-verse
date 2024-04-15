import mongoose, { InferSchemaType } from 'mongoose';

// Define the Profile schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        trim: true,
    },
    dateOfBirth: {
        type: String,
        trim: true,
    },
    about: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: Number,
        trim: true,
    },
    userToken: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Token",
    },
});

// Use InferSchemaType to derive the TypeScript type
type UserType = InferSchemaType<typeof userSchema>;

// Export the Profile model
const User = mongoose.model<UserType>('User', userSchema);
export default User;
