const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

/**
 * Catches routes that don't match any defined endpoint.
 */
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

/**
 * Global exception handler. Every thrown/forwarded error in the app
 * ends up here so responses stay consistent and every failure is logged.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message, details } = err;

  // Mongoose schema validation errors (required fields, maxlength, etc.)
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = 'Validation error';
    details = Object.values(err.errors).map((e) => e.message);
  }

  // Mongoose duplicate key error (e.g. unique email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists`;
  }

  // Malformed MongoDB ObjectId passed in a route param/body
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  if (!(err instanceof ApiError) && !statusCode) {
    statusCode = err.statusCode || 500;
  }

  statusCode = statusCode || 500;
  message = message || 'Internal server error';

  const logPayload = {
    statusCode,
    path: req.originalUrl,
    method: req.method,
    userId: req.user ? req.user.id : undefined,
    err: { message: err.message, stack: err.stack },
  };

  if (statusCode >= 500) {
    logger.error(logPayload, 'Unhandled exception');
  } else {
    logger.warn(logPayload, 'Handled request error');
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

module.exports = { notFoundHandler, errorHandler };
