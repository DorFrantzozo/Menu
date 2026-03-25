/**
 * Standard projection for public-facing menu data.
 * Excludes internal database tracking fields to reduce payload size
 * and prevent over-fetching vulnerabilities.
 */
export const PUBLIC_MENU_PROJECTION = "-createdAt -updatedAt -__v";
