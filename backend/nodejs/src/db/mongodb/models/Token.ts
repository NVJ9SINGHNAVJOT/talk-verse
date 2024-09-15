import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface representing a Token document
export interface IToken extends Document {
  _id: mongoose.Types.ObjectId;
  tokenValue: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Token schema using the interface
const tokenSchema = new Schema<IToken>(
  {
    tokenValue: {
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

// Create the Token model
const Token: Model<IToken> = mongoose.model<IToken>("Token", tokenSchema);

export default Token;
