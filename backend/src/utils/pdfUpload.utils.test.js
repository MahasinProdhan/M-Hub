import test from "node:test";
import assert from "node:assert/strict";

let cloudinary;
let resolveResourceLinks;

const ensureTestModules = async () => {
  if (cloudinary && resolveResourceLinks) return;

  process.env.CLOUDINARY_CLOUD_NAME ||= "test-cloud";
  process.env.CLOUDINARY_API_KEY ||= "test-key";
  process.env.CLOUDINARY_API_SECRET ||= "test-secret";

  ({ default: cloudinary } = await import("../config/cloudinary.js"));
  ({ resolveResourceLinks } = await import("./pdfUpload.utils.js"));
};

test("PDF upload success", async (t) => {
  await ensureTestModules();

  const originalUploadStream = cloudinary.uploader.upload_stream;
  t.after(() => {
    cloudinary.uploader.upload_stream = originalUploadStream;
  });

  cloudinary.uploader.upload_stream = (options, callback) => {
    assert.equal(options.resource_type, "image");
    assert.equal(options.type, "upload");
    assert.equal(options.access_mode, "public");
    assert.equal(options.format, "pdf");
    assert.equal(options.folder, "mhub/pdfs");

    return {
      end: () =>
        callback(null, {
          secure_url: "https://res.cloudinary.com/demo/raw/upload/v1/mhub/pdfs/unit-test.pdf",
          public_id: "mhub/pdfs/unit-test",
        }),
    };
  };

  const result = await resolveResourceLinks({
    file: {
      buffer: Buffer.from("%PDF-1.7"),
      originalname: "unit-test.pdf",
      mimetype: "application/pdf",
      size: 1024,
    },
    driveLink: "",
  });

  assert.equal(result.ok, true);
  assert.equal(result.fileUrl?.includes("/mhub/pdfs/"), true);
  assert.equal(result.filePublicId, "mhub/pdfs/unit-test");
  assert.equal(result.driveLink, null);
  assert.equal(result.fallbackUsed, false);
});

test("Drive-only success", async () => {
  await ensureTestModules();

  const driveLink = "https://drive.google.com/file/d/demo/view";

  const result = await resolveResourceLinks({
    file: null,
    driveLink,
  });

  assert.equal(result.ok, true);
  assert.equal(result.fileUrl, null);
  assert.equal(result.filePublicId, null);
  assert.equal(result.driveLink, driveLink);
  assert.equal(result.fallbackUsed, false);
});

test("Both missing validation fail", async () => {
  await ensureTestModules();

  const result = await resolveResourceLinks({
    file: null,
    driveLink: "",
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
  assert.match(result.message, /Upload a PDF file or provide a Google Drive link/i);
});

test("Cloudinary fail + Drive fallback success", async (t) => {
  await ensureTestModules();

  const originalUploadStream = cloudinary.uploader.upload_stream;
  t.after(() => {
    cloudinary.uploader.upload_stream = originalUploadStream;
  });

  cloudinary.uploader.upload_stream = (options, callback) => {
    return {
      end: () => callback(new Error("Simulated Cloudinary failure")),
    };
  };

  const driveLink = "https://drive.google.com/file/d/fallback/view";
  const result = await resolveResourceLinks({
    file: {
      buffer: Buffer.from("%PDF-1.7"),
      originalname: "fallback.pdf",
      mimetype: "application/pdf",
      size: 2048,
    },
    driveLink,
  });

  assert.equal(result.ok, true);
  assert.equal(result.fileUrl, null);
  assert.equal(result.filePublicId, null);
  assert.equal(result.driveLink, driveLink);
  assert.equal(result.fallbackUsed, true);
});
