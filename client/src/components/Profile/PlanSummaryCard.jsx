import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Compact subscription summary for a narrow column. The existing
// SubscriptionCard and SubscriptionStatusCard are both built for the wide
// profile page — one lays out md:flex-row with a feature list, the other
// shows billing dates and card details — so neither survives a 4-column rail.
const STATUS_LABELS = {
  active: { label: "פעיל", tone: "text-emerald-600 dark:text-emerald-400" },
  trial: { label: "תקופת ניסיון", tone: "text-amber-600 dark:text-amber-500" },
  past_due: { label: "חיוב שלא הושלם", tone: "text-red-600 dark:text-red-400" },
  canceled: { label: "מנוי בוטל", tone: "text-muted-foreground" },
};

const daysUntil = (date) => {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return diff > 0 ? Math.ceil(diff / 86400000) : 0;
};

const PlanSummaryCard = ({ user, className = "" }) => {
  const navigate = useNavigate();

  // The model's own value. This card only names the plan, so there is nothing
  // to look up in ALL_PLANS — that is for feature lists.
  const plan = user?.plan || "Free";
  const isPro = plan === "iMenu PRO";
  const status = STATUS_LABELS[user?.subscriptionStatus] || STATUS_LABELS.trial;
  const trialDaysLeft =
    user?.subscriptionStatus === "trial" ? daysUntil(user?.trialExpiresAt) : null;

  return (
    <Card className={`rounded-2xl border-border shadow-sm ${className}`}>
      <CardContent className="p-5 sm:p-6">
        <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-2">
          המנוי שלך
        </p>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl font-extrabold text-foreground">{plan}</span>
          {isPro && (
            <span aria-hidden="true" className="text-lg">
              🏆
            </span>
          )}
        </div>

        <p className={`text-sm font-semibold ${status.tone}`}>
          {status.label}
          {trialDaysLeft !== null && (
            <span className="font-normal text-muted-foreground">
              {trialDaysLeft > 0
                ? ` · נותרו ${trialDaysLeft} ימים`
                : " · הסתיימה"}
            </span>
          )}
        </p>

        {!isPro && (
          <Button
            type="button"
            onClick={() => navigate("/upgrade")}
            className="w-full rounded-xl mt-4"
          >
            שדרוג מסלול
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

PlanSummaryCard.propTypes = {
  user: PropTypes.shape({
    plan: PropTypes.string,
    subscriptionStatus: PropTypes.string,
    trialExpiresAt: PropTypes.string,
  }),
  className: PropTypes.string,
};

export default PlanSummaryCard;
