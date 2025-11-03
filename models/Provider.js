import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  experience_years: {
    type: Number,
    required: [true, "Experience years are required"],
    min: [0, "Experience cannot be negative"],
  },
  skills: {
    type: [String],
    required: [true, "At least one skill is required"],
  },
  availability_status: {
    type: String,
    enum: ["Available", "Unavailable"],
    default: "Available",
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
});

export default mongoose.model("Provider", providerSchema);
