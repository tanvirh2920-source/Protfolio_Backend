/**
 * Wrapper function for async route handlers to catch errors automatically.
 */
const catchAsyncError = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
};

module.exports = catchAsyncError;
