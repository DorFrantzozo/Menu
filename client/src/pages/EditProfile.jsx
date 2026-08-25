import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";

import axiosInstance from "@/utils/baseUrl";
import { updateUser } from "@/state/user/userSlice";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner";
import PlanSummaryCard from "@/components/Profile/PlanSummaryCard";
import { toast } from "react-toastify";

/* One titled block of related fields. Grouping is what turns a long
   undifferentiated column into something scannable. */
const Section = ({ title, description, badge, children, className = "" }) => (
  <Card className={`rounded-2xl border-border shadow-sm ${className}`}>
    <CardContent className="p-5 sm:p-6">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children}
    </CardContent>
  </Card>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  badge: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
};

/* Short fields sit two-up from `sm` and stack below it. */
const FieldPair = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
);

FieldPair.propTypes = { children: PropTypes.node };

export default function EditProfile() {
  const user = useSelector((state) => state.user.user);
  const [img, setImg] = useState(null); // הלינק לתצוגה המקדימה
  const [imgFile, setImgFile] = useState(null); // הקובץ האמיתי שיישלח לשרת!
  const [restaurantName, setRestaurantName] = useState(user?.restaurantName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [menuDescription, setMenuDescription] = useState(user?.menuDescription || "");
  const [googleReviewUrl, setGoogleReviewUrl] = useState(
    user?.reviewSettings?.googleReviewUrl || ""
  );
  const [reviewPromptEnabled, setReviewPromptEnabled] = useState(
    user?.reviewSettings?.isEnabled ?? false
  );
  const [isLoading, setIsLoading] = useState(false);

  const isPro = user?.plan === "iMenu PRO";
  const savedReviewUrl = user?.reviewSettings?.googleReviewUrl || "";
  const savedUrlStatus = user?.reviewSettings?.urlStatus || "unset";
  // Status describes what was saved, so it goes stale the moment you type.
  const reviewUrlDirty = googleReviewUrl.trim() !== savedReviewUrl.trim();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file); // שומרים את הקובץ הפיזי לשליחה לשרת
      setImg(URL.createObjectURL(file)); // שומרים לינק רק בשביל להציג למשתמש
    }
  };

  const removeImage = () => {
    setImg(null);
    setImgFile(null); // מוחקים גם את הקובץ הפיזי
  };

  const handleRestaurantNameChange = (e) => {
    const value = e.target.value;
    const englishOnly = value.replace(/[^A-Za-z\s]/g, "");
    setRestaurantName(englishOnly);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    // מוסיף רק את השדות שהמשתמש שינה
    if (restaurantName !== user?.restaurantName) formData.append("restaurantName", restaurantName);

    // שינוי קריטי: שולחים את הקובץ (imgFile) ולא את הלינק הוירטואלי (img)
    if (imgFile) formData.append("logo", imgFile);

    if (email !== user?.email) formData.append("email", email);
    if (phone !== user?.phone) formData.append("phone", phone);
    if (password) formData.append("password", password);
    if (displayName !== user?.displayName) formData.append("displayName", displayName);
    if (menuDescription !== user?.menuDescription) formData.append("menuDescription", menuDescription);

    // Flat keys: FormData is multipart and cannot carry nested objects.
    const urlChanged =
      googleReviewUrl !== (user?.reviewSettings?.googleReviewUrl || "");
    const enabledChanged =
      reviewPromptEnabled !== (user?.reviewSettings?.isEnabled ?? false);
    const reviewTouched = urlChanged || enabledChanged;

    if (urlChanged) formData.append("googleReviewUrl", googleReviewUrl);
    if (enabledChanged)
      formData.append("reviewPromptEnabled", String(reviewPromptEnabled));

    try {
      const response = await axiosInstance.put(
        `/user/updateUser/${user?._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" , Authorization: `Bearer ${token}`,} }
      );

      if (response.status === 200) {
        dispatch(updateUser(response.data.user));
        const savedStatus = response.data.user?.reviewSettings?.urlStatus;
        if (reviewTouched && savedStatus === "invalid") {
          toast.warning("הפרופיל נשמר, אבל לא זיהינו קישור ביקורות תקין.");
        } else {
          toast.success("הפרופיל עודכן בהצלחה!");
        }
        // Stay put when the review link changed, so the owner can see whether
        // it validated and open it to check. Being bounced to the dashboard
        // would hide the one piece of feedback that matters here.
        if (!reviewTouched) {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error(error.message);
      toast.error("שגיאה בעדכון הפרופיל. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 sm:px-6 pb-12"
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {isLoading && (
        <div className="absolute inset-0 ">
          <Spinner />
        </div>
      )}

      {/* Save travels with the page: on a form this long it would otherwise
          sit below the fold, and the review link is the last field of all. */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 mb-6 bg-background/90 backdrop-blur-md border-b border-border flex items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
          עריכת פרופיל
        </h1>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
          className="rounded-xl px-6 shrink-0"
        >
          שמירה
        </Button>
      </div>

      {/* Top row only. Both items are flex children of the same grid row, so
          the logo card and the first section resolve to the same height
          instead of ending on two different baselines. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* ─── Side rail: logo ─── */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* flex-1 lets the logo card absorb whatever slack the row has, so
              the rail and the identity card still end on the same line. */}
          <Card className="rounded-2xl border-border shadow-sm w-full flex-1">
            <CardContent className="p-5 sm:p-6 h-full flex flex-col items-center justify-center text-center">
              {user?.logo || img ? (
                <img
                  src={img || user?.logo}
                  alt="תצוגת פרופיל"
                  className="w-24 h-24 rounded-full object-cover shadow bg-muted"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
                  אין תמונה
                </div>
              )}

              <p className="text-base font-bold text-foreground mt-4">
                {displayName || user?.displayName || "המסעדה שלי"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                הלוגו מופיע בתפריט ובקוד ה־QR
              </p>

              <div className="flex items-center gap-4 mt-4">
                <Label className="cursor-pointer">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    העלאת לוגו
                  </span>
                  <Input type="file" onChange={handleImageChange} className="hidden" />
                </Label>
                {img && (
                  <Button
                    variant="ghost"
                    onClick={removeImage}
                    className="text-red-500 dark:text-red-400 p-0 h-auto text-sm"
                  >
                    הסר
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <PlanSummaryCard user={user} />
        </aside>

        {/* ─── Identity, paired with the logo card above ─── */}
        <div className="lg:col-span-8 flex">
          <Section
            title="זהות העסק"
            description="השמות והתיאור שהסועדים רואים בתפריט."
            className="w-full"
          >
            <div className="space-y-4">
              <FieldPair>
                <div>
                  <Label htmlFor="restaurantName">שם מסעדה (אנגלית בלבד)</Label>
                  <Input
                    id="restaurantName"
                    value={restaurantName}
                    onChange={handleRestaurantNameChange}
                    placeholder={user?.restaurantName || "למשל: MyRestaurant"}
                  />
                </div>
                <div>
                  <Label htmlFor="displayName">שם להצגה</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={user?.displayName || "למשל: המסעדה של דוד"}
                  />
                </div>
              </FieldPair>
              <div>
                <Label htmlFor="menuDescription">תיאור תפריט / הכרזות</Label>
                <Input
                  id="menuDescription"
                  value={menuDescription}
                  onChange={(e) => setMenuDescription(e.target.value)}
                  placeholder={user?.menuDescription || "למשל: Happy Hour בכל יום בין 17:00 ל-20:00"}
                />
              </div>
            </div>
          </Section>
        </div>
      </div>

      {/* Remaining sections stay on the same 8-column track, so their right
          edge lines up with the identity card above rather than drifting. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="hidden lg:block lg:col-span-4" aria-hidden="true" />

        <div className="lg:col-span-8 space-y-6">
          <Section
            title="פרטי התקשרות"
            description="לשימוש המערכת בלבד. לא מוצג לסועדים."
          >
            <FieldPair>
              <div>
                <Label htmlFor="email">אימייל</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  dir="ltr"
                  className="text-left"
                  placeholder={user?.email || "example@email.com"}
                />
              </div>
              <div>
                <Label htmlFor="phone">טלפון</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  dir="ltr"
                  className="text-left"
                  placeholder={user?.phone || "050-1234567"}
                />
              </div>
            </FieldPair>
          </Section>

          <Section
            title="אבטחה"
            description="השאירו ריק כדי לשמור על הסיסמה הנוכחית."
          >
            <div className="sm:max-w-[calc(50%-0.5rem)]">
              <Label htmlFor="password">סיסמה חדשה</Label>
              <Input
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
              />
            </div>
          </Section>

          <Section
            title="ביקורות Google"
            badge={
              <span className="text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded bg-foreground text-background">
                iMenu PRO
              </span>
            }
            description="סועדים שסיימו לאכול יקבלו הזמנה להשאיר ביקורת בגוגל. יותר ביקורות משפרות את הדירוג ואת הנראות של העסק בחיפוש ובמפות."
          >
            {!isPro ? (
              <div className="rounded-xl border border-dashed border-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  הפיצ׳ר זמין במסלול iMenu PRO.
                </p>
                <Button
                  type="button"
                  onClick={() => navigate("/upgrade")}
                  className="rounded-xl shrink-0 self-start sm:self-auto"
                >
                  שדרוג ל־iMenu PRO
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="googleReviewUrl">קישור לביקורות</Label>
                  <Input
                    id="googleReviewUrl"
                    dir="ltr"
                    className="text-left"
                    value={googleReviewUrl}
                    onChange={(e) => setGoogleReviewUrl(e.target.value)}
                    placeholder="https://g.page/r/.../review"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    מומלץ להעתיק את הקישור מ־
                    <a
                      href="https://business.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      פרופיל העסק בגוגל
                    </a>{" "}
                    ← ״בקשו ביקורות״. אפשר גם להדביק קישור למפות.
                  </p>

                  {googleReviewUrl.trim() && (
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      {reviewUrlDirty ? (
                        <span className="text-amber-600 dark:text-amber-500">
                          ● לא נשמר עדיין
                        </span>
                      ) : savedUrlStatus === "valid" ? (
                        <>
                          <span className="text-emerald-600 dark:text-emerald-400">
                            ● הקישור תקין
                          </span>
                          <a
                            href={user?.reviewSettings?.resolvedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-muted-foreground"
                          >
                            בדקו איך זה נראה ←
                          </a>
                        </>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">
                          ● לא זיהינו קישור גוגל תקין. בדקו והדביקו שוב.
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={reviewPromptEnabled}
                    onChange={(e) => setReviewPromptEnabled(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border accent-zinc-900 dark:accent-white"
                  />
                  <span className="text-sm text-foreground">
                    הצגת בקשת ביקורת בתפריט
                    <span className="block text-xs text-muted-foreground">
                      נדלק רק אחרי שהקישור נשמר ואומת.
                    </span>
                  </span>
                </label>
              </div>
            )}
          </Section>
        </div>
      </div>
    </motion.div>
  );
}
