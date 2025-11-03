import mongoose from "mongoose";

const wordSchema = new mongoose.Schema(
  {
    word: { type: String, required: true },
    pronunciation: { type: String, required: false },
    definition: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    exampleSentence: { type: [String], required: false },
  },
  { timestamps: true }
);

export default mongoose.model("Word", wordSchema);
