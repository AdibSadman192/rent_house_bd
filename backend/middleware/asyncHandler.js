// Async handler to wrap async route handlers and catch errors
const asyncHandler = fn => (req, res, next) => {
  return Promise
    .resolve(fn(req, res, next))
    .catch(next);
};

module.exports = asyncHandler;
