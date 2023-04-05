import { response } from './ResponseHandler.js'

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === "CastError")
    error = new ErrorResponse("Resource not found", 404);

  // Mongoose duplicate key
  if (err.code === 11000)
    error = new ErrorResponse("Duplicate field value entered", 400);

  // Mongoose validation error
  if (err.name === "ValidationError")
    error = new ErrorResponse(Object.values(err.errors).map((val) => val.message), 400);

  response(res, error.statusCode || 500, error.message || "Server Error", error.data || { success: false }, true)
};

export default errorHandler;