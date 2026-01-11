/**
 * Async handler wrapper
 * Catches async errors and passes them to the error handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Format error response
 */
const formatError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

/**
 * Validate pagination params
 */
const validatePagination = (limit, offset) => {
  return {
    limit: Math.min(Math.max(parseInt(limit) || 20, 1), 100),
    offset: Math.max(parseInt(offset) || 0, 0)
  };
};

/**
 * Format success response
 */
const successResponse = (res, data, message = 'Success', status = 200) => {
  res.status(status).json({
    success: true,
    message,
    data
  });
};

/**
 * Format error response for API
 */
const errorResponse = (res, message, status = 500) => {
  res.status(status).json({
    success: false,
    error: message
  });
};

module.exports = {
  asyncHandler,
  formatError,
  validatePagination,
  successResponse,
  errorResponse
};
