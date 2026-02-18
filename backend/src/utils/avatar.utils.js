const CLOUDINARY_HOST = "res.cloudinary.com";
const AVATAR_FOLDER_SEGMENT = "/mhub/avatars/";
const AVATAR_PROXY_PREFIX = "/uploads/avatars/proxy/";

const toBase64Url = (value) =>
  Buffer.from(value, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const fromBase64Url = (value) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf-8");
};

export const isCloudinaryAvatarUrl = (value) => {
  if (typeof value !== "string" || !value) return false;

  try {
    const parsed = new URL(value);
    return (
      parsed.hostname === CLOUDINARY_HOST &&
      parsed.pathname.includes(AVATAR_FOLDER_SEGMENT)
    );
  } catch (error) {
    return false;
  }
};

export const toAvatarClientPath = (value) => {
  if (!value || typeof value !== "string") return "";
  if (!isCloudinaryAvatarUrl(value)) return value;
  return `${AVATAR_PROXY_PREFIX}${toBase64Url(value)}`;
};

export const decodeAvatarProxyPath = (encodedValue) => {
  const decoded = fromBase64Url(encodedValue);
  return decoded;
};

export const extractCloudinaryPublicId = (avatarUrl) => {
  if (!isCloudinaryAvatarUrl(avatarUrl)) return null;

  const cleanUrl = avatarUrl.split("?")[0];
  const uploadIndex = cleanUrl.indexOf("/upload/");

  if (uploadIndex === -1) return null;

  const afterUpload = cleanUrl.slice(uploadIndex + "/upload/".length);
  const segments = afterUpload.split("/").filter(Boolean);

  const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
  const publicIdSegments =
    versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments;

  let publicPath = publicIdSegments.join("/");
  publicPath = publicPath.replace(/\.[a-zA-Z0-9]+$/, "");

  if (!publicPath.includes("mhub/avatars/")) return null;
  return publicPath;
};
