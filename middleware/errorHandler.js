const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

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
