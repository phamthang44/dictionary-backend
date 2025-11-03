import mongoose from "mongoose";
import Category from "../models/category.model.js";
import Word from "../models/word.model.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://...";

async function seedData() {
  await mongoose.connect(MONGO_URI);
  console.log("🌱 Connected to MongoDB");

  // Xóa dữ liệu cũ (nếu muốn reset mỗi lần seed)
  await Promise.all([Category.deleteMany(), Word.deleteMany()]);

  // Tạo dữ liệu mẫu
  const categoryNames = [
    "Animals",
    "Technology",
    "Food",
    "Travel",
    "Sports",
    "Education",
    "Health",
    "Music",
    "Movies",
    "Books",
    "Nature",
    "Science",
    "History",
    "Politics",
    "Fashion",
    "Art",
    "Gaming",
    "Finance",
    "Culture",
    "Language",
  ];

  const categories = await Category.insertMany(
    categoryNames.map((name, index) => ({
      name,
      description: `Sample description for ${name}`,
    }))
  );

  const words = await Word.insertMany([
    {
      id: 1,
      word: "Eloquent",
      pronunciation: "/ˈɛl.ə.kwənt/",
      definition: "Fluent or persuasive in speaking or writing.",
      category: categories[1]._id,
      examples: [
        "Her eloquent speech moved the audience.",
        "He gave an eloquent presentation.",
      ],
    },
    {
      id: 2,
      word: "Algorithm",
      pronunciation: "/ˈæl.ɡə.rɪð.əm/",
      definition: "A step-by-step procedure for solving a problem.",
      category: categories[0]._id,
      examples: [
        "The search algorithm is very efficient.",
        "We need to optimize this algorithm.",
      ],
    },
  ]);

  const words2 = await Word.insertMany(
    Array.from({ length: 20 }).map((_, i) => {
      const category = categories[i % categories.length]; // lặp qua categories
      return {
        id: i + 1,
        word: `Word${i + 1}`,
        pronunciation: `/pronunciation${i + 1}/`,
        definition: `Definition of Word${i + 1}`,
        category: category._id,
        exampleSentence: [
          `Example sentence 1 for Word${i + 1}`,
          `Example sentence 2 for Word${i + 1}`,
        ],
      };
    })
  );

  console.log("✅ Seed data created successfully!");
  console.log(`📦 ${categories.length} categories, ${words.length} words`);
  await mongoose.disconnect();
}

seedData().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
