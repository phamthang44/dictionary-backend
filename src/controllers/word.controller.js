import { asyncHandler } from "../middlewares/asyncHandler.js";
import { wordService } from "../services/word.service.js";

export const wordController = {
  getWords: asyncHandler(async (req, res) => {
    const { search, page = 1, limit = 10, categoryId } = req.query;
    const words = await wordService.getAllByPagination({
      page: parseInt(page),
      limit: parseInt(limit),
      search: search || "",
      categoryId: categoryId || null,
    });
    res.status(words.status).json(words);
  }),

  addWord: asyncHandler(async (req, res) => {
    const newWord = await wordService.createWord(req.body);
    res.status(newWord.status).json(newWord);
  }),

  updateWord: asyncHandler(async (req, res) => {
    const updated = await wordService.updateWord(req.params.id, req.body);
    res.status(updated.status).json(updated);
  }),

  deleteWord: asyncHandler(async (req, res) => {
    const deleted = await wordService.deleteWord(req.params.id);
    res.status(deleted.status).json(deleted);
  }),

  getWordById: asyncHandler(async (req, res) => {
    const word = await wordService.getWordById(req.params.id);
    res.status(word.status).json(word);
  }),
};
