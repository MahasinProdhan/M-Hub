import test from "node:test";
import assert from "node:assert/strict";
import {
  decodePdfProxyPath,
  encodePdfProxyPath,
  extractCloudinaryAssetFromUrl,
  getPdfFilenameFromUrl,
  isAllowedPdfSourceUrl,
  toPdfProxyPath,
} from "./pdfView.utils.js";

test("encode/decode roundtrip works for signed PDF URLs", () => {
  const sourceUrl =
    "https://res.cloudinary.com/demo/raw/upload/v1700000000/mhub/pdfs/de-2026-sem3.pdf?token=abc123XYZ-_.~&response-content-type=application%2Fpdf";

  const encoded = encodePdfProxyPath(sourceUrl);
  const decoded = decodePdfProxyPath(encoded);

  assert.equal(decoded, sourceUrl);
});

test("decode supports legacy base64 format", () => {
  const sourceUrl = "https://res.cloudinary.com/demo/image/upload/v1/mhub/pdfs/new-file.pdf";
  const legacy = Buffer.from(sourceUrl, "utf8").toString("base64");

  const decoded = decodePdfProxyPath(legacy);
  assert.equal(decoded, sourceUrl);
});

test("proxy path uses URL-safe base64 token", () => {
  const sourceUrl =
    "https://storage.example-cdn.com/private/docs/unit-1.pdf?signature=abc+123/def";

  const proxyPath = toPdfProxyPath(sourceUrl);
  const encoded = proxyPath.split("/").pop();

  assert.ok(encoded);
  assert.equal(encoded.includes("+"), false);
  assert.equal(encoded.includes("/"), false);
  assert.equal(encoded.includes("="), false);
  assert.equal(decodePdfProxyPath(encoded), sourceUrl);
});

test("proxy path uses query fallback for very long URLs", () => {
  const longToken = "a".repeat(2500);
  const sourceUrl = `https://res.cloudinary.com/demo/raw/upload/v1/mhub/pdfs/de-2026.pdf?token=${longToken}`;

  const proxyPath = toPdfProxyPath(sourceUrl);
  assert.equal(proxyPath.startsWith("/uploads/pdfs/proxy?u="), true);

  const parsed = new URL(`https://example.com${proxyPath}`);
  const encoded = parsed.searchParams.get("u");

  assert.ok(encoded);
  assert.equal(decodePdfProxyPath(encoded), sourceUrl);
});

test("allowed source validation blocks localhost/private targets", () => {
  assert.equal(isAllowedPdfSourceUrl("http://localhost:5000/private.pdf"), false);
  assert.equal(isAllowedPdfSourceUrl("http://127.0.0.1:8000/private.pdf"), false);
  assert.equal(isAllowedPdfSourceUrl("http://192.168.1.4/private.pdf"), false);
  assert.equal(
    isAllowedPdfSourceUrl("https://res.cloudinary.com/demo/raw/upload/v1/mhub/pdfs/a.pdf"),
    true,
  );
});

test("filename extraction is safe and always returns pdf extension", () => {
  assert.equal(
    getPdfFilenameFromUrl("https://res.cloudinary.com/demo/raw/upload/v1/mhub/pdfs/operating-system-2025.pdf"),
    "operating-system-2025.pdf",
  );
  assert.equal(
    getPdfFilenameFromUrl("https://cdn.example.com/files/encoded-name"),
    "encoded-name.pdf",
  );
});

test("cloudinary URL parser extracts public id and format", () => {
  const sourceUrl =
    "https://res.cloudinary.com/demo/image/upload/v1771613734/mhub/pdfs/1771613722441-datastructurealgorithms-2010-sem3.pdf";

  const parsed = extractCloudinaryAssetFromUrl(sourceUrl);

  assert.deepEqual(parsed, {
    cloudName: "demo",
    resourceType: "image",
    deliveryType: "upload",
    publicId: "mhub/pdfs/1771613722441-datastructurealgorithms-2010-sem3",
    format: "pdf",
  });
});
