const globalErrorHandler = (err, req, res, next) => {
  // 1. Log the error stack for the developer

  // 2. If headers are already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // 3. Set a dynamic status code (default to 500 if not specified)
  const statusCode = err.statusCode || 500;

  // 4. Adapt response based on Environment (Development vs. Production)
  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }

  // Production Response
  return res.status(statusCode).json({
    success: false,
    message: err.isOperational ? err.message : "Internal Server Error",
  });
};

module.exports = globalErrorHandler;
