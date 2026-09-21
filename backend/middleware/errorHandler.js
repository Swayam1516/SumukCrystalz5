/**
 * Centralized Error Handling Middleware
 * Sanitizes errors in production to avoid leaking database schema, stack traces, or credentials.
 */

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Resource not found: Cannot ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  const message =
    isProduction && statusCode === 500
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
}

errorHandler.errorHandler = errorHandler;
errorHandler.notFoundHandler = notFoundHandler;

module.exports = errorHandler;


