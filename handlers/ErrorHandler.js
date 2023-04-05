import { response } from './ResponseHandler.js'

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  response(res, error.statusCode || 500, error.message || "Server Error", error.data || { success: false }, true)
};

export default errorHandler;