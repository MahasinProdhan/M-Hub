import multer from "multer";

export const PDF_MIME_TYPE = "application/pdf";
export const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

export const validatePdfMimeType = (file) => {
  if (!file) return null;

  if (file.mimetype !== PDF_MIME_TYPE) {
    return "Only PDF files are allowed";
  }

  return null;
};

export const validatePdfSize = (file) => {
  if (!file || typeof file.size !== "number") return null;

  if (file.size > MAX_PDF_SIZE_BYTES) {
    return "PDF file size must be 10MB or less";
  }

  return null;
};

const pdfUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const mimeError = validatePdfMimeType(file);
    if (mimeError) {
      return cb(new Error(mimeError), false);
    }

    cb(null, true);
  },
  limits: {
    fileSize: MAX_PDF_SIZE_BYTES,
  },
});

export const uploadPdfSingle = (fieldName = "pdfFile") => (req, res, next) => {
  pdfUpload.single(fieldName)(req, res, (error) => {
    if (!error) {
      const sizeError = validatePdfSize(req.file);
      if (sizeError) {
        return res.status(400).json({
          message: sizeError,
        });
      }

      return next();
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "PDF file size must be 10MB or less",
        });
      }

      return res.status(400).json({
        message: error.message || "Invalid PDF upload",
      });
    }

    return res.status(400).json({
      message: error.message || "Invalid PDF upload",
    });
  });
};
