import { createRouter } from "../utils/routeFactory.js";
import { categoryController } from "../controllers/category.controller.js";

const routes = [
  { method: "get", path: "/", handler: "getCategories" },
  { method: "get", path: "/all", handler: "getAllCategories" },
  { method: "post", path: "/", handler: "addCategory" },
  { method: "put", path: "/:id", handler: "updateCategory" },
  { method: "delete", path: "/:id", handler: "deleteCategory" },
  { method: "get", path: "/:id", handler: "getCategoryById" },
];

export default createRouter(categoryController, routes);
