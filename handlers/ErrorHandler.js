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

export class ErrorResponse extends Error {
  constructor(message = '', statusCode = 400, data = {}, serverOnlyData = {}) {
    super(message)
    this.data = data
    this.statusCode = statusCode
    this.serverOnlyData = serverOnlyData
    Error.captureStackTrace(this, this.constructor)
  }
}
