import {useEffect, useRef} from "react";
import {trackReviewPromptShown} from "../utils/reviewAnalytics";

// Counts an impression only once the prompt has actually entered the diner's
// screen, and returns the ref to attach to the element being watched.
//
// Firing on mount instead would count every diner who opened the menu, even
// though the prompt sits below the last dish and most people never scroll
// that far. The denominator would then track menu views, the conversion rate
// would read artificially low, and — worse — "few people clicked" would be
// indistinguishable from "few people ever saw it". Those are two different
// problems with two different fixes, so the metric has to tell them apart.
//
// Deduplication per visit lives in reviewAnalytics, alongside the click.
const VISIBLE_FRACTION = 0.5;

const useTrackReviewImpression = (restaurantId, isVisible) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!restaurantId || !isVisible) return undefined;

    const element = elementRef.current;
    if (!element) return undefined;

    // Old browser without the API: counting on mount beats never counting.
    if (typeof IntersectionObserver === "undefined") {
      trackReviewPromptShown(restaurantId);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          trackReviewPromptShown(restaurantId);
          observer.disconnect();
        }
      },
      {threshold: VISIBLE_FRACTION},
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [restaurantId, isVisible]);

  return elementRef;
};

export default useTrackReviewImpression;
