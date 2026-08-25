import PropTypes from "prop-types";
import {getDesignConfig} from "@/designs/registry";
import {useLanguage} from "@/context/LanguageContext";
import useTrackReviewImpression from "@/hooks/useTrackReviewImpression";
import {trackReviewClick} from "@/utils/reviewAnalytics";

// Passive review invitation closing the menu, between the last dish and the
// site footer.
//
// It lives in Menu.jsx rather than inside a design, so one implementation
// serves all six and a seventh works the day it is added. Colours come from
// the design's own theme tokens — Design3 is dark and would reject a white
// card, which is exactly why this reads them instead of hard-coding.
//
// Shaped as a full-bleed band rather than a centred card: a card floating in
// whitespace reads as an ad, while an edge-to-edge strip reads as the end of
// the page. Everything sits on one row from `sm` up to keep it short.
//
// The server only sends menu.reviewSettings when every gate passes, so the
// single check below is the whole client-side condition.
const MenuReviewBlock = ({menu}) => {
  const {language} = useLanguage();
  const isEnglish = language === "en";

  const reviewUrl = menu?.reviewSettings?.resolvedUrl;
  const config = getDesignConfig(menu?.designNumber);
  const isVisible = Boolean(reviewUrl && config.supportsReviewPrompt);

  // Called before any early return: hooks cannot sit behind a condition, so
  // visibility is passed in rather than guarded around. The ref goes on the
  // band so the impression is counted when it reaches the screen, not on mount.
  const impressionRef = useTrackReviewImpression(menu?._id, isVisible);

  if (!isVisible) return null;

  const t = config.theme;

  return (
    <section
      ref={impressionRef}
      dir={isEnglish ? "ltr" : "rtl"}
      className="w-full border-t"
      style={{background: t.surface, borderColor: t.border}}
    >
      <div className="mx-auto max-w-5xl px-5 py-3.5 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
        <div className="flex items-center gap-3 min-w-0">
          <span
            aria-hidden="true"
            className="text-[10px] leading-none tracking-[0.12em] shrink-0"
            style={{color: t.accent}}
          >
            ★★★★★
          </span>
          <div className="min-w-0">
            <p
              className="text-[15px] font-semibold leading-tight"
              style={{color: t.text}}
            >
              {isEnglish ? "Enjoyed your meal?" : "נהניתם מהארוחה?"}
            </p>
            <p
              className="text-[13px] leading-snug mt-0.5"
              style={{color: t.muted}}
            >
              {isEnglish
                ? "A short Google review helps us more than you'd think."
                : "ביקורת קצרה בגוגל עוזרת לנו יותר ממה שנדמה."}
            </p>
          </div>
        </div>

        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackReviewClick(menu?._id)}
          className="shrink-0 self-start sm:self-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-[13px] font-semibold border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            color: t.accent,
            borderColor: t.accent,
            borderRadius: t.radius,
            outlineColor: t.accent,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = t.accent;
            e.currentTarget.style.color = t.accentText;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = t.accent;
          }}
        >
          {isEnglish ? "Write a review" : "כתיבת ביקורת"}
          <svg
            aria-hidden="true"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isEnglish ? "" : "rotate-180"}
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </section>
  );
};

MenuReviewBlock.propTypes = {
  menu: PropTypes.shape({
    _id: PropTypes.string,
    designNumber: PropTypes.number,
    reviewSettings: PropTypes.shape({
      resolvedUrl: PropTypes.string,
      promptDelayMinutes: PropTypes.number,
    }),
  }),
};

export default MenuReviewBlock;
