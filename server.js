import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import wordRoutes from "./src/routes/word.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import { errorHandler } from "./src/middlewares/error.middlewaree.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Route
app.use("/api/categories", categoryRoutes);
app.use("/api/words", wordRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
