/**
 * 404 Route Not Found Handler.
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.originalUrl}`,
  });
}

/**
 * Global Error Handling Middleware.
 */
function globalErrorHandler(err, req, res, next) {
  console.error('Unhandled error:', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error.'
    : err.message || 'Internal server error.';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

module.exports = { notFoundHandler, globalErrorHandler };
