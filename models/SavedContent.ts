import mongoose, { Schema, Document, Model } from "mongoose";

export type ContentType = "hook" | "caption" | "hashtags" | "script";
export type Platform = "instagram" | "youtube" | "tiktok";

export interface ISavedContent extends Document {
  userId: mongoose.Types.ObjectId;
  type: ContentType;
  platform: Platform;
  tone: string;
  topic: string;
  content: string | string[];
  createdAt: Date;
}

const SavedContentSchema = new Schema<ISavedContent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["hook", "caption", "hashtags", "script"],
      required: true,
    },
    platform: {
      type: String,
      enum: ["instagram", "youtube", "tiktok"],
      required: true,
    },
    tone: { type: String, required: true },
    topic: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true }, // string or string[]
  },
  { timestamps: true }
);

const SavedContent: Model<ISavedContent> =
  mongoose.models.SavedContent || mongoose.model<ISavedContent>("SavedContent", SavedContentSchema);

export default SavedContent;
