import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  service_name: {
    type: String,
    required: [true, "Service name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  price_range: {
    type: String,
    required: [true, "Price range is required"],
  },
  image_url: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Service", serviceSchema);
