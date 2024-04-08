import mongoose, { InferSchemaType } from 'mongoose';

// Define the Profile schema
const userSchema = new mongoose.Schema({
    gender: {
        type: String,
    },
    dateOfBirth: {
        type: String,
    },
    about: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: Number,
        trim: true,
    },
});

// Use InferSchemaType to derive the TypeScript type
type UserType = InferSchemaType<typeof userSchema>;

// Export the Profile model
const User = mongoose.model<UserType>('Profile', userSchema);
export default User;
