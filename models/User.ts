import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  passwordHash?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  creatorProfile: {
    niche: string;
    targetAudience: string;
    goals: string[];
  };
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String },
    passwordHash: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    creatorProfile: {
      niche: { type: String, default: "" },
      targetAudience: { type: String, default: "" },
      goals: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

// Prevent model recompilation in dev hot-reload
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
