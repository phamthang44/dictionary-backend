import express from "express";

export const createRouter = (controller, routes) => {
  const router = express.Router();

  routes.forEach(({ method, path, handler }) => {
    if (!controller[handler]) {
      console.warn(`[RouterFactory] Missing handler: ${handler}`);
      return;
    }
    router[method](path, controller[handler]);
  });

  return router;
};
