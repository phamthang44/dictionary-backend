import Word from "../models/word.model.js";
import Category from "../models/category.model.js";
import { responseDto } from "../dtos/response/response.dto.js";
import { paginateDto } from "../dtos/response/pageResponse.dto.js";
import { NotFoundException } from "../common/exceptions/NotFoundException.js";
import { HttpError } from "../common/exceptions/CustomError.js";

export const wordService = {
  async getWordById(id) {
    const word = await Word.findById(id);
    if (!word) {
      throw new NotFoundException("Word not found");
    }
    return responseDto(word, "Word fetched successfully");
  },

  async createWord(data) {
    try {
      const word = new Word(data);
      await word.save();
      return responseDto(word, "Word created successfully", 201);
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpError(409, "Word already exists");
      }
      if (error.name === "ValidationError") {
        throw new HttpError(400, error.message);
      }
      throw new HttpError(500, "Failed to create word");
    }
  },

  async updateWord(id, data) {
    try {
      const word = await Word.findByIdAndUpdate(id, data, { new: true });
      if (!word) {
        throw new HttpError(404, "Word not found");
      }
      return responseDto(word, "Word updated successfully");
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpError(409, "Word already exists");
      }
      if (error.name === "ValidationError") {
        throw new HttpError(400, error.message);
      }
      throw error;
    }
  },

  async deleteWord(id) {
    try {
      const word = await Word.findByIdAndDelete(id);
      if (!word) {
        throw new NotFoundException("Word not found");
      }
      return responseDto(null, "Word deleted successfully");
    } catch (error) {
      throw error;
    }
  },

  async getWordsByCategory(categoryId) {
    const words = await Word.find({ category: categoryId }).populate(
      "category"
    );
    return responseDto(words, "Words fetched successfully");
  },

  async getWordsByDefinition(definitionText) {
    const words = await Word.find({
      definition: { $regex: definitionText, $options: "i" },
    }).populate("category");
    return responseDto(words, "Words fetched successfully");
  },

  async getByWordTextByPagination({ wordText, page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const [words, total] = await Promise.all([
      Word.find({
        word: { $regex: wordText, $options: "i" },
      })
        .populate("category")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Word.countDocuments({
        word: { $regex: wordText, $options: "i" },
      }),
    ]);

    return paginateDto(words, total, Number(page), Number(limit));
  },

  async getAllByPagination({ page = 1, limit = 10, search = "" }) {
    const skip = (page - 1) * limit;

    // Tạo điều kiện filter linh hoạt
    const filter = {};
    if (search) {
      filter.$or = [
        { word: { $regex: search, $options: "i" } },
        { definition: { $regex: search, $options: "i" } },
        { exampleSentence: { $regex: search, $options: "i" } },
        {
          category: await Category.find({
            name: search,
          }),
        },
      ];
    }

    // Dùng Promise.all để query song song
    const [words, total] = await Promise.all([
      Word.find(filter)
        .populate("category")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Word.countDocuments(filter),
    ]);

    return paginateDto(words, total, Number(page), Number(limit));
  },
};
