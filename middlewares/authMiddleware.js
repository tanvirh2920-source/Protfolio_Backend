const { verifyToken } = require('../utils/jwtToken');
const catchAsyncError = require('../utils/catchAsyncError');

/**
 * Authentication Middleware.
 * Checks for Bearer token in Authorization header, verifies it, and attaches user to req.admin.
 */
const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token.',
    });
  }
});

/**
 * Role authorization middleware (extensible for multi-role setups).
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (req.admin && req.admin.role && !roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        error: `Role (${req.admin.role}) is not allowed to access this resource.`,
      });
    }
    next();
  };
};

module.exports = { isAuthenticated, authorizeRoles };
