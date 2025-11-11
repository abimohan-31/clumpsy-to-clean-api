import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // TTL index - automatically delete expired tokens
    },
  },
  {
    timestamps: true,
  }
);

// Create TTL index
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("TokenBlacklist", tokenBlacklistSchema);

