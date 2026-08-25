/**
 * Standard projection for public-facing menu data.
 * Excludes internal database tracking fields to reduce payload size
 * and prevent over-fetching vulnerabilities.
 */
export const PUBLIC_MENU_PROJECTION = "-createdAt -updatedAt -__v";

/**
 * Fields the public menu is allowed to see about the restaurant owner.
 *
 * This is an allow-list, not a deny-list, and deliberately so: the endpoints
 * that use it are unauthenticated, and the User document carries billing
 * tokens, contact details and the Wi-Fi password. With a deny-list every new
 * sensitive field would leak by default until someone remembered to exclude
 * it. Here a new field stays private until it is added on purpose.
 *
 * Add a field only when the public menu actually renders it. `logo`, `qrSlug`
 * and `enableSubCategories` are intentionally absent — no menu code reads them
 * today.
 */
export const PUBLIC_USER_PROJECTION = [
  "_id",
  "restaurantName",
  "displayName",
  "menuDescription",
  "designNumber",
  "isPaid",
  "trialExpiresAt",
].join(" ");
