// Fire-and-forget reporting for the review-prompt funnel.
//
// Uses navigator.sendBeacon rather than axios on purpose. The click handler
// runs while the diner is on their way to Google, and a beacon is the one
// request the browser promises to deliver without holding anything up. We
// never read a response: if the server is slow or down the diner still
// reaches Google and we simply lose a data point. That trade is the whole
// reason this is not a redirect through our own domain.
const ENDPOINT = "/api/analytics/review-event";

const send = (restaurantId, event) => {
  if (typeof navigator === "undefined" || !navigator.sendBeacon) return false;

  try {
    const blob = new Blob([JSON.stringify({restaurantId, event})], {
      type: "application/json",
    });
    return navigator.sendBeacon(ENDPOINT, blob);
  } catch {
    // Analytics must never break the menu.
    return false;
  }
};

// Both halves of the funnel are counted once per diner per visit, so
// clicks/impressions stays a ratio between real people. Without this a diner
// who taps the button twice would produce two conversions against a single
// impression, and the owner would be shown a rate above 100% — a number that
// makes every other figure on the dashboard look untrustworthy.
//
// sessionStorage is the right grain: it clears itself when the tab closes, so
// a return visit tomorrow counts again, which is what we want. Scoped per
// restaurant so eating at two of our venues never mutes the second.
const oncePerSession = (key, deliver) => {
  let storage;
  try {
    storage = window.sessionStorage;
    if (storage.getItem(key)) return false;
  } catch {
    // Storage blocked (private browsing, hardened settings). Counting twice
    // is a smaller problem than counting nothing.
    return deliver();
  }

  const sent = deliver();
  if (sent) {
    try {
      storage.setItem(key, "true");
    } catch {
      /* nothing to do — the event is already reported */
    }
  }
  return sent;
};

/** A diner actually saw the review prompt. Counted once per visit. */
export const trackReviewPromptShown = (restaurantId) =>
  restaurantId
    ? oncePerSession(`review_prompt_seen_${restaurantId}`, () =>
        send(restaurantId, "shown"),
      )
    : false;

/**
 * A diner went through to Google to write a review. Counted once per visit:
 * tapping the button again still opens Google, it just is not a second
 * conversion.
 */
export const trackReviewClick = (restaurantId) =>
  restaurantId
    ? oncePerSession(`review_clicked_${restaurantId}`, () =>
        send(restaurantId, "click"),
      )
    : false;
