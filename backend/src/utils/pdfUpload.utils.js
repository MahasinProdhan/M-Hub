import path from "path";
import cloudinary from "../config/cloudinary.js";

const CLOUDINARY_HOST = "res.cloudinary.com";
const PDF_FOLDER = "mhub/pdfs";
const CLOUDINARY_IMAGE_UPLOAD_SEGMENT = "/image/upload/";
const CLOUDINARY_RAW_UPLOAD_SEGMENT = "/raw/upload/";

const sanitizeBaseName = (filename = "document") => {
  const baseName = path.parse(filename).name || "document";

  const sanitized = baseName
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return sanitized || "document";
};

export const uploadPdfBufferToCloudinary = async (file) => {
  if (!file?.buffer) {
    throw new Error("Missing PDF file buffer");
  }

  const publicId = `${Date.now()}-${sanitizeBaseName(file.originalname)}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: PDF_FOLDER,
        // Upload PDFs as image resources so Cloudinary serves them inline.
        resource_type: "image",
        type: "upload",
        access_mode: "public",
        format: "pdf",
        public_id: publicId,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary did not return a secure URL"));
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(file.buffer);
  });
};

export const resolveResourceLinks = async ({ file, driveLink }) => {
  const normalizedDriveLink =
    typeof driveLink === "string" ? driveLink.trim() : "";
  const hasDriveLink = normalizedDriveLink.length > 0;

  if (!file && !hasDriveLink) {
    return {
      ok: false,
      status: 400,
      message: "Upload a PDF file or provide a Google Drive link",
    };
  }

  if (!file) {
    return {
      ok: true,
      fileUrl: null,
      filePublicId: null,
      driveLink: normalizedDriveLink,
      fallbackUsed: false,
    };
  }

  try {
    const uploadedFile = await uploadPdfBufferToCloudinary(file);

    return {
      ok: true,
      fileUrl: uploadedFile.secure_url,
      filePublicId: uploadedFile.public_id || null,
      driveLink: null,
      fallbackUsed: false,
    };
  } catch (error) {
    if (hasDriveLink) {
      return {
        ok: true,
        fileUrl: null,
        filePublicId: null,
        driveLink: normalizedDriveLink,
        fallbackUsed: true,
      };
    }

    return {
      ok: false,
      status: 503,
      message: "PDF upload failed. Please use a Google Drive link fallback.",
      details: error.message,
    };
  }
};

export const extractPdfPublicIdFromUrl = (fileUrl) => {
  if (typeof fileUrl !== "string" || !fileUrl.trim()) return null;

  try {
    const parsed = new URL(fileUrl);
    if (!parsed.hostname.includes(CLOUDINARY_HOST)) return null;

    const cleanPath = parsed.pathname || "";
    const isImageResource = cleanPath.includes(CLOUDINARY_IMAGE_UPLOAD_SEGMENT);
    const isRawResource = cleanPath.includes(CLOUDINARY_RAW_UPLOAD_SEGMENT);
    if (!isImageResource && !isRawResource) return null;

    const uploadMarker = "/upload/";
    const uploadIndex = cleanPath.indexOf(uploadMarker);
    if (uploadIndex === -1) return null;

    const afterUpload = cleanPath.slice(uploadIndex + uploadMarker.length);
    const folderIndex = afterUpload.indexOf(`${PDF_FOLDER}/`);
    if (folderIndex === -1) return null;

    const publicPathWithExtension = afterUpload.slice(folderIndex);
    const decodedPublicPath = decodeURIComponent(publicPathWithExtension);

    if (isImageResource) {
      return decodedPublicPath.replace(/\.[a-zA-Z0-9]+$/, "");
    }

    return decodedPublicPath;
  } catch (error) {
    return null;
  }
};

export const getPdfPublicId = (resource = {}) => {
  if (typeof resource?.filePublicId === "string" && resource.filePublicId.trim()) {
    return resource.filePublicId.trim();
  }

  return extractPdfPublicIdFromUrl(resource?.fileUrl);
};

export const deletePdfFromCloudinary = async (resource = {}) => {
  const publicId = getPdfPublicId(resource);
  if (!publicId) return false;

  const fileUrl = typeof resource?.fileUrl === "string" ? resource.fileUrl : "";
  const primaryResourceType = fileUrl.includes(CLOUDINARY_IMAGE_UPLOAD_SEGMENT)
    ? "image"
    : "raw";
  const fallbackResourceType = primaryResourceType === "image" ? "raw" : "image";

  const firstAttempt = await cloudinary.uploader.destroy(publicId, {
    resource_type: primaryResourceType,
    invalidate: true,
  });

  if (firstAttempt?.result === "ok") {
    return true;
  }

  if (firstAttempt?.result !== "not found") {
    return false;
  }

  const secondAttempt = await cloudinary.uploader.destroy(publicId, {
    resource_type: fallbackResourceType,
    invalidate: true,
  });

  if (secondAttempt?.result === "ok") {
    return true;
  }

  return false;
};
