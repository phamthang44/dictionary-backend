import mongoose from "mongoose";

const wordSchema = new mongoose.Schema(
  {
    word: { type: String, required: true },
    language: { type: String, required: true },
    translation: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Word", wordSchema);
