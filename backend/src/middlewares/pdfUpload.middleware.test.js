import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_PDF_SIZE_BYTES,
  validatePdfMimeType,
  validatePdfSize,
} from "./pdfUpload.middleware.js";

test("Non-PDF fail", () => {
  const errorMessage = validatePdfMimeType({
    mimetype: "image/png",
  });

  assert.equal(errorMessage, "Only PDF files are allowed");
});

test("PDF mime type pass", () => {
  const errorMessage = validatePdfMimeType({
    mimetype: "application/pdf",
  });

  assert.equal(errorMessage, null);
});

test("10MB fail", () => {
  const errorMessage = validatePdfSize({
    size: MAX_PDF_SIZE_BYTES + 1,
  });

  assert.equal(errorMessage, "PDF file size must be 10MB or less");
});

test("10MB pass at boundary", () => {
  const errorMessage = validatePdfSize({
    size: MAX_PDF_SIZE_BYTES,
  });

  assert.equal(errorMessage, null);
});

