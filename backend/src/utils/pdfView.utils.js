import net from "node:net";

const PDF_PROXY_BASE_PATH = "/uploads/pdfs/proxy";
const MAX_PROXY_PATH_SEGMENT_LENGTH = 1500;
const DISALLOWED_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);
const CLOUDINARY_HOST = "res.cloudinary.com";

const normalizeBase64 = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "+");
  const paddingLength = (4 - (normalized.length % 4)) % 4;
  return normalized + "=".repeat(paddingLength);
};

const decodeBase64Candidates = (encodedValue) => {
  const raw = String(encodedValue || "").trim();
  if (!raw) return [];

  let decodedUriComponent = raw;
  try {
    decodedUriComponent = decodeURIComponent(raw);
  } catch {
    decodedUriComponent = raw;
  }

  const results = [];

  const tryDecode = (input, encoding) => {
    try {
      const decoded = Buffer.from(input, encoding).toString("utf8");
      if (decoded) results.push(decoded);
    } catch {
      // Ignore malformed candidate, try next format.
    }
  };

  // Modern url-safe base64 (preferred).
  tryDecode(decodedUriComponent, "base64url");

  // Backward compatibility with old encoding style.
  tryDecode(normalizeBase64(decodedUriComponent), "base64");

  return [...new Set(results)];
};

const isPrivateIpv4 = (hostname) => {
  const parts = hostname.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return false;

  const [a, b] = parts;
  return (
    a === 10 ||
    a === 127 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254)
  );
};

const isPrivateIpv6 = (hostname) => {
  const lower = hostname.toLowerCase();
  return lower === "::1" || lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80");
};

const isDisallowedHost = (hostname) => {
  const lower = hostname.toLowerCase();
  if (DISALLOWED_HOSTS.has(lower)) return true;
  if (lower.endsWith(".local")) return true;

  const ipVersion = net.isIP(lower);
  if (ipVersion === 4) return isPrivateIpv4(lower);
  if (ipVersion === 6) return isPrivateIpv6(lower);

  return false;
};

const isHttpUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const isLikelyPdfUrl = (value) => {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;

    const pathname = (parsed.pathname || "").toLowerCase();
    const hasPdfPath = pathname.endsWith(".pdf");
    const hasCloudinaryPdfPath =
      pathname.includes("/raw/upload/") || pathname.includes("/image/upload/");
    const responseContentType = (parsed.searchParams.get("response-content-type") || "")
      .toLowerCase()
      .trim();
    const hasPdfQuery = responseContentType.includes("application/pdf");

    return hasPdfPath || hasCloudinaryPdfPath || hasPdfQuery;
  } catch {
    return false;
  }
};

export const extractCloudinaryAssetFromUrl = (value) => {
  try {
    const parsed = new URL(value);
    if (parsed.hostname !== CLOUDINARY_HOST) return null;

    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length < 5) return null;

    const cloudName = segments[0];
    const resourceType = segments[1];
    const deliveryType = segments[2];
    if (!cloudName || !resourceType || !deliveryType) return null;

    const versionIndex = segments.findIndex((segment, index) => index >= 3 && /^v\d+$/.test(segment));
    const publicSegments = versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments.slice(3);
    if (publicSegments.length === 0) return null;

    const encodedLast = publicSegments[publicSegments.length - 1];
    const decodedLast = decodeURIComponent(encodedLast);
    const extensionMatch = decodedLast.match(/\.([a-zA-Z0-9]+)$/);
    const format = extensionMatch ? extensionMatch[1].toLowerCase() : "";
    const lastWithoutExtension = extensionMatch
      ? decodedLast.slice(0, -extensionMatch[0].length)
      : decodedLast;

    const normalizedPublicSegments = [
      ...publicSegments.slice(0, -1).map((segment) => decodeURIComponent(segment)),
      lastWithoutExtension,
    ].filter(Boolean);

    if (normalizedPublicSegments.length === 0) return null;

    return {
      cloudName,
      resourceType,
      deliveryType,
      publicId: normalizedPublicSegments.join("/"),
      format,
    };
  } catch {
    return null;
  }
};

const getRequestOrigin = (req) => {
  if (!req) return "";

  const forwardedProto = req.get("x-forwarded-proto");
  const forwardedHost = req.get("x-forwarded-host");
  const protocol = forwardedProto
    ? forwardedProto.split(",")[0].trim()
    : req.protocol;
  const host = forwardedHost
    ? forwardedHost.split(",")[0].trim()
    : req.get("host");

  if (!protocol || !host) return "";
  return `${protocol}://${host}`;
};

const sanitizeFilename = (value) =>
  value
    .replace(/[\r\n"]/g, "")
    .replace(/[^A-Za-z0-9._() -]/g, "_")
    .replace(/\s+/g, " ")
    .trim();

export const encodePdfProxyPath = (value) => Buffer.from(value, "utf8").toString("base64url");

export const decodePdfProxyPath = (encodedValue) => {
  const candidates = decodeBase64Candidates(encodedValue);

  for (const candidate of candidates) {
    if (!isHttpUrl(candidate)) continue;
    return candidate;
  }

  throw new Error("Invalid encoded PDF URL");
};

export const isAllowedPdfSourceUrl = (value) => {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    if (isDisallowedHost(parsed.hostname)) return false;
    return true;
  } catch {
    return false;
  }
};

export const isCloudinaryPdfUrl = (value) => isLikelyPdfUrl(value);

export const toPdfProxyPath = (value) => {
  if (!isLikelyPdfUrl(value)) return value;

  const encoded = encodePdfProxyPath(value);
  if (encoded.length > MAX_PROXY_PATH_SEGMENT_LENGTH) {
    return `${PDF_PROXY_BASE_PATH}?u=${encodeURIComponent(encoded)}`;
  }

  return `${PDF_PROXY_BASE_PATH}/${encoded}`;
};

export const toPdfClientUrl = (value, req) => {
  if (!value || typeof value !== "string") return value;
  if (!isLikelyPdfUrl(value)) return value;

  const path = toPdfProxyPath(value);
  const origin = getRequestOrigin(req);

  return origin ? `${origin}${path}` : path;
};

export const withPdfViewUrl = (resource, req) => {
  if (!resource || typeof resource !== "object") return resource;

  const normalized =
    typeof resource.toObject === "function" ? resource.toObject() : { ...resource };

  normalized.fileUrl = toPdfClientUrl(normalized.fileUrl, req);
  return normalized;
};

export const getPdfFilenameFromUrl = (pdfUrl) => {
  try {
    const parsed = new URL(pdfUrl);
    const cleanPath = parsed.pathname || "";
    const lastSegment = cleanPath.split("/").filter(Boolean).pop() || "document.pdf";
    const decoded = decodeURIComponent(lastSegment);
    const sanitized = sanitizeFilename(decoded);

    if (!sanitized) return "document.pdf";
    return sanitized.toLowerCase().endsWith(".pdf") ? sanitized : `${sanitized}.pdf`;
  } catch {
    return "document.pdf";
  }
};

export const getPdfProxySourceFromRequest = (req) => {
  const fromPath = String(req?.params?.encodedPdfUrl || "").trim();
  if (fromPath) return fromPath;

  const fromQuery = String(req?.query?.u || "").trim();
  if (fromQuery) return fromQuery;

  return "";
};
