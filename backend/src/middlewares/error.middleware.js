import multer from "multer";

const getValidationErrorMessage = (error) => {
  if (!error?.errors || typeof error.errors !== "object") {
    return error.message || "Validation failed";
  }

  const messages = Object.values(error.errors)
    .map((item) => item?.message)
    .filter(Boolean);

  return messages.length > 0 ? messages.join(", ") : "Validation failed";
};

export const errorHandler = (error, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = error?.message || "Internal server error";

  if (error instanceof multer.MulterError) {
    statusCode = 400;
    message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Uploaded file exceeds allowed size limit"
        : error.message || "Invalid file upload";
  } else if (error?.name === "ValidationError") {
    statusCode = 400;
    message = getValidationErrorMessage(error);
  } else if (error?.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier";
  } else if (error?.code === 11000) {
    statusCode = 409;
    message = "Duplicate resource value";
  } else if (error?.name === "JsonWebTokenError" || error?.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired authentication token";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" ? { stack: error?.stack } : {}),
  });
};
