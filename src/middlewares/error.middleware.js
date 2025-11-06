// middlewares/error.middleware.js
export function errorHandler(err, req, res, next) {
  console.error("Error caught:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ====== Error exception of Mongo/Mongoose ======
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate key error";
  }

  // ====== If the service throws a custom error with additional data ======
  const payload = {
    success: statusCode < 400,
    message,
    statusCode,
  };

  if (err.data !== undefined) {
    payload.data = err.data;
  }

  res.status(statusCode).json(payload);
}
