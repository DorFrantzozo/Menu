/**
 * Transforms a Cloudinary URL to force WebP format delivery.
 * If the URL already includes f_webp or is not a Cloudinary URL, it is returned unchanged.
 */
export const toWebP = (url) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  if (url.includes("f_webp")) return url;
  return url.replace("/upload/", "/upload/f_webp,q_auto/");
};
