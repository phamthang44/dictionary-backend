import { createRouter } from "../utils/routeFactory.js";
import StatisticsController from "../controllers/statistics.controller.js";

const routes = [{ method: "get", path: "/", handler: "getStats" }];

export default createRouter(StatisticsController, routes);
