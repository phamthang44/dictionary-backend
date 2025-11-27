import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import wordRoutes from "./src/routes/word.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import statisticsRoutes from "./src/routes/statistics.routes.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import connectToDatabase from "./src/utils/db.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: [
      "https://dictionary-frontend-roan.vercel.app/",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Connect MongoDB
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ error: "Lỗi kết nối Database" });
  }
});
// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/words", wordRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Local Server running on port ${PORT}`));
}
export default app;
