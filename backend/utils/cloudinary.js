import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Every tenant's media lives under a single root, namespaced by the restaurant's
 * user id, so a customer's whole media footprint is one subtree:
 *
 *   restaurants/<userId>/branding/logo
 *   restaurants/<userId>/categories/<categoryId>
 *   restaurants/<userId>/dishes/<dishId>
 *   restaurants/<userId>/assets/<assetId>
 *
 * Public ids are derived from immutable document ids (never from user-supplied
 * names), so a path is stable across renames and can never collide with another
 * tenant's asset.
 */
const TENANT_ROOT = "restaurants";

export const AssetFolder = Object.freeze({
  BRANDING: "branding",
  CATEGORIES: "categories",
  DISHES: "dishes",
  ASSETS: "assets",
});

/**
 * Default transformation for menu imagery. `crop: "limit"` only ever scales
 * down, so smaller uploads are delivered untouched.
 */
export const IMAGE_TRANSFORMATION = Object.freeze({
  quality: "auto",
  fetch_format: "auto",
  width: 1000,
  crop: "limit",
});

/** Delivery transformation segment, e.g. `f_webp,q_auto` or `w_1000`. */
const TRANSFORMATION_SEGMENT = /^[a-z]{1,3}_[^/]*(,[a-z]{1,3}_[^/]*)*$/;

const UPLOAD_MARKER = "/upload/";

/** Folder holding one asset type for one tenant. */
export const buildTenantFolder = (userId, assetFolder) =>
  `${TENANT_ROOT}/${userId}/${assetFolder}`;

/**
 * Full public id of a single asset.
 *
 * The whole path is passed as one `public_id` so the stored identifier — and
 * therefore the delivery URL — is exactly what is written here, with no
 * implicit prefixing to reason about.
 */
export const buildTenantPublicId = (userId, assetFolder, assetId) =>
  `${buildTenantFolder(userId, assetFolder)}/${assetId}`;

/**
 * Recover the Cloudinary public id from a stored delivery URL.
 *
 * Derived from the URL itself rather than rebuilt from a hardcoded folder, so it
 * resolves assets uploaded under any historical folder layout.
 */
export const extractPublicId = (url) => {
  if (typeof url !== "string") return null;

  const markerIndex = url.indexOf(UPLOAD_MARKER);
  if (markerIndex === -1) return null;

  // Everything after `/upload/` is: [transformations/][v<version>/]<public_id>.<ext>
  const path = url.slice(markerIndex + UPLOAD_MARKER.length).split("?")[0];
  const segments = path.split("/").filter(Boolean);

  // The version marker is the reliable boundary; anything before it is a
  // transformation. Without one, fall back to dropping transformation segments.
  const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
  const idSegments =
    versionIndex === -1
      ? segments.filter((segment) => !TRANSFORMATION_SEGMENT.test(segment))
      : segments.slice(versionIndex + 1);

  if (idSegments.length === 0) return null;

  // Only the final segment carries the file extension.
  const lastIndex = idSegments.length - 1;
  idSegments[lastIndex] = idSegments[lastIndex].replace(/\.[^./]+$/, "");

  try {
    return decodeURIComponent(idSegments.join("/"));
  } catch {
    return idSegments.join("/");
  }
};

/**
 * Best-effort removal of a previously uploaded asset.
 *
 * Two deliberate guarantees:
 *  1. Scoped — only assets under the caller's own tenant folder are touched.
 *     Assets predating the tenant layout sat in shared, globally-named paths
 *     that different restaurants could collide on, so they are left in place
 *     rather than risking the deletion of an image another tenant still shows.
 *  2. Never throws — losing an old file must not fail the user's request.
 */
export const destroyTenantAsset = async (url, userId) => {
  const publicId = extractPublicId(url);
  if (!publicId) return false;

  if (!publicId.startsWith(`${TENANT_ROOT}/${userId}/`)) {
    console.info(
      `Skipping Cloudinary cleanup for out-of-scope asset "${publicId}" (user ${userId})`,
    );
    return false;
  }

  try {
    const { result } = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    return result === "ok";
  } catch (error) {
    console.error(
      `Cloudinary cleanup failed for "${publicId}":`,
      error.message,
    );
    return false;
  }
};

/** Promisified `upload_stream` for in-memory (multer) buffers. */
const uploadBuffer = (buffer, options) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error.message);
          return reject(error);
        }
        resolve(result);
      })
      .end(buffer);
  });

/**
 * Upload a buffer into the tenant's folder at a deterministic public id.
 *
 * This cloud runs in Cloudinary's `dynamic` folder mode, where the delivery
 * identifier and the Media Library folder are two independent things:
 *   - `public_id`    drives the URL — slashes in it do NOT create folders.
 *   - `asset_folder` drives where the asset is filed in the Media Library.
 * Both are set to the same tenant path so the console tree and the URL agree.
 *
 * `display_name` is what the Media Library labels the asset. Public ids stay
 * id-based (stable across renames), while the label stays human-readable.
 *
 * Re-uploading the same entity overwrites in place and invalidates the CDN copy;
 * Cloudinary returns a freshly versioned URL, so viewers never see a stale image.
 */
export const uploadTenantAsset = ({
  buffer,
  userId,
  folder,
  publicId,
  displayName,
  transformation = IMAGE_TRANSFORMATION,
}) =>
  uploadBuffer(buffer, {
    public_id: buildTenantPublicId(userId, folder, publicId),
    asset_folder: buildTenantFolder(userId, folder),
    ...(displayName ? { display_name: String(displayName) } : {}),
    transformation,
    overwrite: true,
    invalidate: true,
  });

export default cloudinary;
