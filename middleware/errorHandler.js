const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Prisma errors
  if (err.code) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = `${err.meta?.target?.join(", ")} already registered`;
        break;
      case "P2025":
      case "P2001":
        statusCode = 404;
        message = "Record not found";
        break;
      case "P2007":
        statusCode = 400;
        message = "Validation error: Invalid data provided";
        break;
      default:
        statusCode = 500;
        message = "Unknown database error occurred";
    }
  }

  if (err.redirectTo) {
    return res.redirect(err.redirectTo);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      statusCode,
      message,
    },
  });
};

export default errorHandler;
