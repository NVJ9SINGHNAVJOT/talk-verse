import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface representing a Otp document
export interface IOtp extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    otpValue: string;
    createdAt: Date;
    updatedAt: Date;
}

// Define the Otp schema using the interface
const otpSchema = new Schema<IOtp>({
    email: {
        type: String,
        required: true,
    },
    otpValue: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
    },
}, { timestamps: true });

// Create the Otp model
const Otp: Model<IOtp> = mongoose.model<IOtp>('Otp', otpSchema);

export default Otp;