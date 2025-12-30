const { ERROR_MESSAGES } = require('../config/constants');

/**
 * Standardized error handler for the application
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @param {number} customStatusCode - Custom status code (optional)
 */
function handleError(res, error, context = '', customStatusCode = null) {
  const errorMessage = error.message || ERROR_MESSAGES.SERVER_ERROR;
  const statusCode = customStatusCode || error.statusCode || 500;

  // Log error with context
  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ [${context}] Error:`, {
      message: error.message,
      statusCode: statusCode,
      stack: error.stack,
      body: error.body || null,
      query: error.query || null
    });
  } else {
    // In production, log less sensitive info
    console.error(`❌ [${context}] ${errorMessage}`);
  }

  // Send appropriate response
  const response = {
    success: false,
    message: errorMessage
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    response.error = error.toString();
    response.stack = error.stack;
  }

  // Include validation errors if available
  if (error.errors && Array.isArray(error.errors)) {
    response.errors = error.errors.map(err => ({
      field: err.path || err.field,
      message: err.message
    }));
  }

  res.status(statusCode).json(response);
}

/**
 * Handle async errors in route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function with error handling
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(error => {
      handleError(res, error, fn.name);
    });
  };
}

/**
 * Handle validation errors
 * @param {Object} res - Express response object
 * @param {Array} errors - Array of validation errors
 * @param {string} message - Custom message (optional)
 */
function handleValidationError(res, errors, message = 'Validation failed') {
  const statusCode = 400;

  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ Validation Error:`, { errors, message });
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.map(err => ({
      field: err.path || err.field || 'unknown',
      message: err.message,
      value: err.value
    }))
  });
}

/**
 * Handle not found errors
 * @param {Object} res - Express response object
 * @param {string} resource - Resource name (optional)
 */
function handleNotFound(res, resource = 'Resource') {
  const message = `${resource} not found`;

  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ Not Found:`, { resource, message });
  }

  res.status(404).json({
    success: false,
    message
  });
}

/**
 * Handle unauthorized access
 * @param {Object} res - Express response object
 * @param {string} message - Custom message (optional)
 */
function handleUnauthorized(res, message = ERROR_MESSAGES.ACCESS_DENIED) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ Unauthorized:`, { message });
  }

  res.status(401).json({
    success: false,
    message
  });
}

/**
 * Handle forbidden access
 * @param {Object} res - Express response object
 * @param {string} message - Custom message (optional)
 */
function handleForbidden(res, message = ERROR_MESSAGES.ACCESS_DENIED) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ Forbidden:`, { message });
  }

  res.status(403).json({
    success: false,
    message
  });
}

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  handleError,
  asyncHandler,
  handleValidationError,
  handleNotFound,
  handleUnauthorized,
  handleForbidden,
  AppError
};