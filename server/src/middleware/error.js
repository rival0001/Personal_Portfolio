// What: Shared async and error handling middleware.
// Why: Routes can throw errors cleanly without repeating try/catch blocks.
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function notFound(req, res, next) {
  const error = new Error(`Not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({
    message: error.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
}
