import express from "express";
import {
  getWords,
  addWord,
  updateWord,
  deleteWord,
} from "../controllers/WordController.js";

const router = express.Router();

router.get("/", getWords);
router.post("/", addWord);
router.put("/:id", updateWord);
router.delete("/:id", deleteWord);

export default router;
