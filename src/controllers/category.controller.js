import { categoryService } from "../services/category.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const categoryController = {
  addCategory: asyncHandler(async (req, res) => {
    const newCategory = await categoryService.createCategory(req.body);
    res.status(newCategory.status).json(newCategory);
  }),

  updateCategory: asyncHandler(async (req, res) => {
    const updated = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    res.status(updated.status).json(updated);
  }),

  deleteCategory: asyncHandler(async (req, res) => {
    const deleted = await categoryService.deleteCategory(req.params.id);
    res.status(deleted.status).json(deleted);
  }),

  getCategoryById: asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    res.status(category.status).json(category);
  }),

  getCategories: asyncHandler(async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const categories = await categoryService.getCategoriesByPagination({
      search,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.status(categories.status).json(categories);
  }),

  getAllCategories: asyncHandler(async (req, res) => {
    const categories = await categoryService.getAllCategories();
    res.status(categories.status).json(categories);
  }),

  getAllCategoriesByPagination: asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const categories = await categoryService.getAllCategoriesByPagination({
      page,
      limit,
    });
    res.status(categories.status).json(categories);
  }),
};
