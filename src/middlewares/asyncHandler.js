// middlewares/asyncHandler.js
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
// This middleware wraps async route handlers to catch errors and pass them to the error handling middleware.
