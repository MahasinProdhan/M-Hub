import express from "express";
import cors from "cors";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import cloudinary from "./config/cloudinary.js";

import authRoutes from "./routes/auth.routes.js";
import pyqRoutes from "./routes/pyq.routes.js";
import materialRoutes from "./routes/material.routes.js";
import organizerRoutes from "./routes/organizer.routes.js";
import syllabusRoutes from "./routes/syllabus.routes.js";
import userRoutes from "./routes/user.routes.js";

import adminPYQRoutes from "./routes/admin/pyq.admin.routes.js";
import adminMaterialRoutes from "./routes/admin/material.admin.routes.js";
import adminOrganizerRoutes from "./routes/admin/organizer.admin.routes.js";
import adminSyllabusRoutes from "./routes/admin/syllabus.admin.routes.js";
import adminStatsRoutes from "./routes/admin/stats.admin.routes.js";
import adminUserRoutes from "./routes/admin/user.admin.routes.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import {
  decodeAvatarProxyPath,
  isCloudinaryAvatarUrl,
} from "./utils/avatar.utils.js";
import {
  decodePdfProxyPath,
  extractCloudinaryAssetFromUrl,
  getPdfFilenameFromUrl,
  getPdfProxySourceFromRequest,
  isAllowedPdfSourceUrl,
} from "./utils/pdfView.utils.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/uploads/avatars/proxy/:encodedAvatarUrl", (req, res) => {
  try {
    const avatarUrl = decodeAvatarProxyPath(req.params.encodedAvatarUrl);

    if (!isCloudinaryAvatarUrl(avatarUrl)) {
      return res.status(400).json({ message: "Invalid avatar URL" });
    }

    return res.redirect(avatarUrl);
  } catch (error) {
    return res.status(400).json({ message: "Invalid avatar URL" });
  }
});

const PDF_PROXY_FETCH_TIMEOUT_MS = Number(process.env.PDF_PROXY_FETCH_TIMEOUT_MS || 30000);
const CLOUDINARY_SIGNED_URL_TTL_SECONDS = Number(
  process.env.PDF_PROXY_SIGNED_URL_TTL_SECONDS || 180,
);

const sanitizeUrlForLogs = (urlValue) => {
  try {
    const parsed = new URL(urlValue);
    return `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
  } catch {
    return "<invalid-url>";
  }
};

const readUpstreamErrorSnippet = async (upstreamResponse) => {
  try {
    const contentType = (upstreamResponse.headers.get("content-type") || "").toLowerCase();
    if (!contentType.includes("text") && !contentType.includes("json")) return "";

    const text = await upstreamResponse.text();
    return text.slice(0, 300);
  } catch {
    return "";
  }
};

const buildCloudinarySignedDownloadUrl = (sourceUrl) => {
  const asset = extractCloudinaryAssetFromUrl(sourceUrl);
  if (!asset) return null;

  const format = asset.format || "pdf";
  const expiresAt = Math.floor(Date.now() / 1000) + CLOUDINARY_SIGNED_URL_TTL_SECONDS;

  return cloudinary.utils.private_download_url(asset.publicId, format, {
    resource_type: asset.resourceType,
    type: asset.deliveryType,
    expires_at: expiresAt,
    attachment: false,
  });
};

const proxyPdfHandler = async (req, res, next) => {
  const traceId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const encodedValue = getPdfProxySourceFromRequest(req);
    if (!encodedValue) {
      return res.status(400).json({ message: "Missing encoded PDF URL" });
    }

    let pdfUrl = "";
    try {
      pdfUrl = decodePdfProxyPath(encodedValue);
    } catch (error) {
      console.error(`[PDF_PROXY:${traceId}] decode_failed`, {
        encodedLength: encodedValue.length,
        error: error.message,
      });
      return res.status(400).json({ message: "Invalid PDF URL encoding" });
    }

    if (!isAllowedPdfSourceUrl(pdfUrl)) {
      console.error(`[PDF_PROXY:${traceId}] source_not_allowed`, {
        source: sanitizeUrlForLogs(pdfUrl),
      });
      return res.status(400).json({ message: "Invalid PDF URL" });
    }

    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), PDF_PROXY_FETCH_TIMEOUT_MS);

    const upstreamHeaders = {
      Accept: "application/pdf,application/octet-stream;q=0.9,*/*;q=0.8",
    };

    if (req.headers.range) {
      upstreamHeaders.Range = req.headers.range;
    }

    const fetchUpstreamPdf = async (sourceUrl) =>
      fetch(sourceUrl, {
        method: "GET",
        redirect: "follow",
        headers: upstreamHeaders,
        signal: controller.signal,
      });

    let upstream;
    let upstreamSource = pdfUrl;
    try {
      upstream = await fetchUpstreamPdf(pdfUrl);

      if ((upstream.status === 401 || upstream.status === 403) && extractCloudinaryAssetFromUrl(pdfUrl)) {
        const signedUrl = buildCloudinarySignedDownloadUrl(pdfUrl);

        if (signedUrl) {
          console.warn(`[PDF_PROXY:${traceId}] retry_signed_url`, {
            source: sanitizeUrlForLogs(pdfUrl),
            status: upstream.status,
          });

          const retried = await fetchUpstreamPdf(signedUrl);
          if (retried.ok) {
            upstream = retried;
            upstreamSource = signedUrl;
            console.info(`[PDF_PROXY:${traceId}] retry_signed_url_success`, {
              source: sanitizeUrlForLogs(pdfUrl),
            });
          } else {
            const retrySnippet = await readUpstreamErrorSnippet(retried);
            console.error(`[PDF_PROXY:${traceId}] retry_signed_url_failed`, {
              source: sanitizeUrlForLogs(pdfUrl),
              status: retried.status,
              statusText: retried.statusText,
              contentType: retried.headers.get("content-type") || "",
              snippet: retrySnippet,
            });
          }
        }
      }
    } catch (error) {
      const reason = error?.name === "AbortError" ? "timeout" : "network_error";
      console.error(`[PDF_PROXY:${traceId}] fetch_failed`, {
        reason,
        source: sanitizeUrlForLogs(upstreamSource),
        message: error.message,
      });
      return res.status(502).json({ message: "Failed to fetch PDF" });
    } finally {
      clearTimeout(timeoutHandle);
    }

    if (!upstream.ok) {
      const snippet = await readUpstreamErrorSnippet(upstream);
      console.error(`[PDF_PROXY:${traceId}] upstream_not_ok`, {
        source: sanitizeUrlForLogs(upstreamSource),
        status: upstream.status,
        statusText: upstream.statusText,
        contentType: upstream.headers.get("content-type") || "",
        snippet,
      });
      return res.status(502).json({ message: "Failed to fetch PDF" });
    }

    const upstreamContentType = (upstream.headers.get("content-type") || "").toLowerCase();
    const looksLikePdf =
      !upstreamContentType ||
      upstreamContentType.includes("pdf") ||
      upstreamContentType.includes("octet-stream");

    if (!looksLikePdf) {
      const snippet = await readUpstreamErrorSnippet(upstream);
      console.error(`[PDF_PROXY:${traceId}] unexpected_content_type`, {
        source: sanitizeUrlForLogs(upstreamSource),
        status: upstream.status,
        contentType: upstreamContentType,
        snippet,
      });
      return res.status(502).json({ message: "Failed to fetch PDF" });
    }

    if (!upstream.body) {
      console.error(`[PDF_PROXY:${traceId}] empty_body`, {
        source: sanitizeUrlForLogs(upstreamSource),
      });
      return res.status(502).json({ message: "Failed to fetch PDF" });
    }

    const fileName = getPdfFilenameFromUrl(pdfUrl);
    const contentLength = upstream.headers.get("content-length");
    const contentRange = upstream.headers.get("content-range");
    const acceptRanges = upstream.headers.get("accept-ranges");
    const cacheControl = upstream.headers.get("cache-control");
    const etag = upstream.headers.get("etag");
    const lastModified = upstream.headers.get("last-modified");

    res.status(upstream.status === 206 ? 206 : 200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (contentLength) res.setHeader("Content-Length", contentLength);
    if (contentRange) res.setHeader("Content-Range", contentRange);
    if (acceptRanges) res.setHeader("Accept-Ranges", acceptRanges);
    if (cacheControl) res.setHeader("Cache-Control", cacheControl);
    if (etag) res.setHeader("ETag", etag);
    if (lastModified) res.setHeader("Last-Modified", lastModified);

    await pipeline(Readable.fromWeb(upstream.body), res);
    return undefined;
  } catch (error) {
    console.error(`[PDF_PROXY:${traceId}] unexpected_error`, {
      message: error.message,
      stack: error.stack,
    });
    return next(error);
  }
};

app.get("/uploads/pdfs/proxy/:encodedPdfUrl", proxyPdfHandler);
app.get("/uploads/pdfs/proxy", proxyPdfHandler);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/pyqs", pyqRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/organizers", organizerRoutes);
app.use("/api/syllabus", syllabusRoutes);
app.use("/api/users", userRoutes);

// admin routes
app.use("/api/admin", adminPYQRoutes);
app.use("/api/admin", adminMaterialRoutes);
app.use("/api/admin", adminOrganizerRoutes);
app.use("/api/admin", adminSyllabusRoutes);
app.use("/api/admin", adminStatsRoutes);
app.use("/api/admin", adminUserRoutes);

app.get("/", (req, res) => {
  res.send("M Hub Backend API is running");
});

app.use(notFound);
app.use(errorHandler);

export default app;
