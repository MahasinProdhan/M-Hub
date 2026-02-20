const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
const MAX_PATH_SEGMENT_LENGTH = 1500;

const toBase64Url = (value) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  // Avoid call stack issues for very long URLs.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
};

const isHttpUrl = (value) => {
  if (!value || typeof value !== "string") return false;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const isAlreadyPdfProxyUrl = (value) => {
  if (!value || typeof value !== "string") return false;

  try {
    const parsed = new URL(value, API_ORIGIN);
    return parsed.pathname === "/uploads/pdfs/proxy" || parsed.pathname.startsWith("/uploads/pdfs/proxy/");
  } catch {
    return false;
  }
};

export const toInlinePdfViewUrl = (value) => {
  if (!isHttpUrl(value)) return value;
  if (isAlreadyPdfProxyUrl(value)) return value;

  const encoded = toBase64Url(value);

  if (encoded.length > MAX_PATH_SEGMENT_LENGTH) {
    return `${API_ORIGIN}/uploads/pdfs/proxy?u=${encodeURIComponent(encoded)}`;
  }

  return `${API_ORIGIN}/uploads/pdfs/proxy/${encoded}`;
};

export const resolveResourceUrl = (fileUrl, driveLink) => {
  const normalizedFileUrl = typeof fileUrl === "string" ? fileUrl.trim() : "";
  if (normalizedFileUrl) {
    return toInlinePdfViewUrl(normalizedFileUrl);
  }

  return typeof driveLink === "string" ? driveLink.trim() : "";
};
