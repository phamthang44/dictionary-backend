import Category from "../models/category.model.js";
import { responseDto } from "../dtos/response/response.dto.js";
import { paginateDto } from "../dtos/response/pageResponse.dto.js";
import { NotFoundException } from "../common/exceptions/NotFoundException.js";
import { HttpError } from "../common/exceptions/CustomError.js";
import Word from "../models/word.model.js";

export const categoryService = {
  async getAllCategories() {
    // Logic to get all categories
    const categories = await Category.find();
    return responseDto(
      {
        data: categories,
      },
      "Categories fetched successfully",
      200
    );
  },
  async createCategory(data) {
    // Logic to create a new category
    if (data) {
      console.log("ℹ️ Creating category with data:", data);
      if (!data._id) {
        delete data._id;
        console.log("ℹ️ Removed _id from data for new category creation");
      }
    }
    try {
      const category = new Category(data);
      const created = await category.save();

      console.log("✅ Category created with _id:", created._id);

      return responseDto(created, "Category created successfully", 201);
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new HttpError(400, error.message);
      }
      if (error.code === 11000) {
        throw new HttpError(409, "Category already exists");
      }
      throw error;
    }
  },

  async updateCategory(id, data) {
    try {
      // Logic to update a category
      const category = await Category.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!category) {
        throw new NotFoundException("Category not found");
      }
      return responseDto(category, "Category updated successfully");
    } catch (error) {
      throw error;
    }
  },
  async deleteCategory(id) {
    // Logic to delete a category
    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        throw new NotFoundException("Category not found");
      }
      await Word.updateMany({ category: id }, { $set: { category: null } });
      return responseDto(null, "Category deleted successfully");
    } catch (error) {
      throw error;
    }
  },

  async getCategoryById(id) {
    const category = await Category.findById(id);
    return responseDto(category, "Category fetched successfully");
  },

  async getCategoriesByName(name) {
    const categories = await Category.find({
      name: { $regex: name, $options: "i" },
    });
    return responseDto(categories, "Categories fetched successfully");
  },

  async getCategoryByName(name) {
    const category = await Category.findOne({ name });
    return responseDto(category, "Category fetched successfully");
  },

  async getCategoryByDescription(description) {
    const category = await Category.findOne({ description });
    return responseDto(category, "Category fetched successfully");
  },

  async getCategoriesByPagination({ page = 1, limit = 10, search = "" }) {
    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const [categories, total] = await Promise.all([
      Category.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Category.countDocuments(filter),
    ]);

    return paginateDto(
      categories,
      total,
      Number(page),
      Number(limit),
      "Categories fetched successfully"
    );
  },

  async getAllByPagination({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    // Logic to get categories with pagination
    const [categories, total] = await Promise.all([
      Category.find().skip(skip).limit(limit),
      Category.countDocuments(),
    ]);

    return paginateDto(
      categories,
      total,
      Number(page),
      Number(limit),
      "Categories fetched successfully"
    );
  },
};
