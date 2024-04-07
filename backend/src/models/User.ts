import mongoose, { InferSchemaType } from 'mongoose';

// Define the Profile schema
const profileSchema = new mongoose.Schema({
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
type ProfileType = InferSchemaType<typeof profileSchema>;

// Export the Profile model
const Profile = mongoose.model<ProfileType>('Profile', profileSchema);
export default Profile;
