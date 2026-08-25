// Normalises whatever a restaurant owner pastes into the review-link field.
//
// Pure and offline on purpose: short links such as maps.app.goo.gl can only be
// expanded with a network round trip, so instead of following them we accept
// them as-is. The goal is to reject obvious mistakes (a homepage, a competitor
// link, a typo) without pretending we can verify a destination we never fetch.
//
// Best input is the ready-made link from the owner's Google Business Profile
// ("Ask for reviews"), which opens the review composer directly.

const GOOGLE_HOSTS = new Set([
  "g.page",
  "goo.gl",
  "maps.app.goo.gl",
  "search.google.com",
  "maps.google.com",
  "www.google.com",
  "google.com",
]);

// google.co.il, google.de, google.com.au …
const GOOGLE_TLD_HOST = /^(?:www\.|maps\.)?google\.[a-z]{2,3}(?:\.[a-z]{2})?$/i;

const isGoogleHost = (host) =>
  GOOGLE_HOSTS.has(host) || GOOGLE_TLD_HOST.test(host);

const writeReviewUrl = (placeId) =>
  `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;

/**
 * @param {string} input raw text from the owner
 * @returns {{googleReviewUrl: string, resolvedUrl: string, urlStatus: "unset"|"valid"|"invalid"}}
 */
export function normalizeReviewUrl(input) {
  const raw = typeof input === "string" ? input.trim() : "";

  // Clearing the field is not an error — it switches the feature back off.
  if (!raw) {
    return {googleReviewUrl: "", resolvedUrl: "", urlStatus: "unset"};
  }

  // Owners paste "g.page/r/..." without a scheme more often than not.
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  let url;
  try {
    url = new URL(withScheme);
  } catch {
    return {googleReviewUrl: raw, resolvedUrl: "", urlStatus: "invalid"};
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return {googleReviewUrl: raw, resolvedUrl: "", urlStatus: "invalid"};
  }

  const host = url.hostname.toLowerCase();
  if (!isGoogleHost(host)) {
    return {googleReviewUrl: raw, resolvedUrl: "", urlStatus: "invalid"};
  }

  // A place id anywhere in the query is the one case we can upgrade into a
  // direct "write a review" link.
  const placeId =
    url.searchParams.get("placeid") || url.searchParams.get("placeId");
  if (placeId) {
    return {
      googleReviewUrl: raw,
      resolvedUrl: writeReviewUrl(placeId),
      urlStatus: "valid",
    };
  }

  // A bare Google host with nothing after it is the homepage, not a business.
  const hasPath = url.pathname && url.pathname !== "/";
  if (!hasPath) {
    return {googleReviewUrl: raw, resolvedUrl: "", urlStatus: "invalid"};
  }

  // Everything else that lives on a Google host and points somewhere specific:
  // g.page/r/<id>/review, /maps/place/..., short links. Pass through as-is.
  return {
    googleReviewUrl: raw,
    resolvedUrl: url.toString(),
    urlStatus: "valid",
  };
}

/** True when the menu is allowed to show the prompt for this user. */
export function isReviewPromptReady(reviewSettings) {
  return Boolean(
    reviewSettings &&
      reviewSettings.isEnabled &&
      reviewSettings.urlStatus === "valid" &&
      reviewSettings.resolvedUrl,
  );
}

// Owners choose a venue type; these are the delays behind those choices.
export const PROMPT_DELAY_PRESETS = {
  cafe: 10,
  restaurant: 25,
  fine: 45,
};

export const DEFAULT_PROMPT_DELAY_MINUTES = 15;

export function coercePromptDelay(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return DEFAULT_PROMPT_DELAY_MINUTES;
  // Below ~5 minutes nobody has eaten; above 4 hours the visit window in the
  // client has already closed, so the prompt could never fire.
  return Math.min(240, Math.max(5, Math.round(n)));
}
