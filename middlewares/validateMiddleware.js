const { validationResult } = require('express-validator');

/**
 * Middleware to check express-validator validation results.
 * Returns 400 Bad Request with field error messages if validation fails.
 */
function validateMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
}

module.exports = validateMiddleware;
