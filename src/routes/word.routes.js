import { createRouter } from "../utils/routeFactory.js";
import { wordController } from "../controllers/word.controller.js";

const routes = [
  { method: "get", path: "/", handler: "getWords" },
  { method: "post", path: "/", handler: "addWord" },
  { method: "put", path: "/:id", handler: "updateWord" },
  { method: "delete", path: "/:id", handler: "deleteWord" },
  { method: "get", path: "/:id", handler: "getWordById" },
];

export default createRouter(wordController, routes);
