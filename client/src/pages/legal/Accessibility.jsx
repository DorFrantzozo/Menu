import React from "react";

const Accessibility = () => {
  return (
    <div
      className="accessibility-page"
      dir="rtl"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        lineHeight: "1.8",
        color: "#333",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        הצהרת נגישות לאתר iMenu
      </h1>

      <section style={{marginBottom: "2rem"}}>
        <h2 style={{fontSize: "1.5rem", marginBottom: "0.5rem"}}>מבוא</h2>
        <p>
          אנו במיזם iMenu רואים חשיבות עליונה במתן שירות שוויוני, מכבד, נגיש
          ומקצועי לכלל ציבור הגולשים, ובכלל זה לאנשים עם מוגבלות. בהתאם לחוק
          שוויון זכויות לאנשים עם מוגבלות תשנ"ח-1998 ולתקנות שהותקנו מכוחו,
          הושקעו מאמצים ומשאבים בהנגשת אתר האינטרנט שלנו, במטרה לאפשר חוויית
          גלישה קלה, נוחה וטבעית לכל אדם.
        </p>
      </section>

      <section style={{marginBottom: "2rem"}}>
        <h2 style={{fontSize: "1.5rem", marginBottom: "0.5rem"}}>
          מידע על הנגישות באתר
        </h2>
        <p>
          אתר iMenu, בכתובת{" "}
          <a href="https://imenu-il.online/" style={{color: "#0056b3"}}>
            https://imenu-il.online/
          </a>
          , פועל על מנת לעמוד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות
          (התאמות נגישות לשירות), התשע"ג-2013.
        </p>
        <ul style={{paddingRight: "20px", listStyleType: "disc"}}>
          <li>
            התאמות הנגישות בוצעו עפ"י המלצות התקן הישראלי (ת"י 5568) לנגישות
            תכנים באינטרנט ברמת AA, ומסמך WCAG 2.0 הבינלאומי.
          </li>
          <li>
            האתר מספק מבנה סמנטי עבור טכנולוגיות מסייעות ותמיכה בדפוס השימוש
            המקובל להפעלה עם מקלדת.
          </li>
          <li>
            האתר מותאם לתצוגה בדפדפנים הנפוצים ולשימוש מלא בטלפונים סלולריים.
          </li>
        </ul>
      </section>

      <section style={{marginBottom: "2rem"}}>
        <h2 style={{fontSize: "1.5rem", marginBottom: "0.5rem"}}>
          שימוש בתוסף הנגישות Enable
        </h2>
        <p>
          באתר זה מוטמע תוסף הנגישות של חברת Enable (בכתובת{" "}
          <a
            href="https://my.enable.co.il"
            target="_blank"
            rel="noopener noreferrer"
            style={{color: "#0056b3"}}
          >
            https://my.enable.co.il
          </a>
          ), המאפשר לאתר לעמוד בדרישות הנגישות בצורה מיטבית.
        </p>
        <p>
          לפתיחת תפריט הנגישות יש ללחוץ על כפתור/סמל הנגישות המופיע בפינת המסך.
        </p>
        <p>התוסף מאפשר, בין היתר:</p>
        <ul style={{paddingRight: "20px", listStyleType: "disc"}}>
          <li>הגדלה והקטנה של הגופן באתר.</li>
          <li>שינוי ניגודיות צבעים (ניגודיות גבוהה, היפוך צבעים, מונוכרום).</li>
          <li>הדגשת קישורים וכותרות להקלת הניווט.</li>
          <li>עצירת אנימציות ותנועה באתר למניעת סחרחורות והיסחים.</li>
          <li>
            ניווט באתר באמצעות המקלדת בלבד (באמצעות מקשי Tab, Enter וחיצים).
          </li>
          <li>התאמה ושיפור קריאות עבור קוראי מסך.</li>
        </ul>
      </section>

      <section style={{marginBottom: "2rem"}}>
        <h2 style={{fontSize: "1.5rem", marginBottom: "0.5rem"}}>
          תוכן גולשים וצד שלישי (בתי העסק)
        </h2>
        <p>
          מערכת iMenu מספקת פלטפורמה דיגיטלית ותשתית טכנולוגית נגישה ליצירת
          תפריטים. עם זאת, התוכן הספציפי המוצג בתפריטי המסעדות השונות (לרבות
          שמות המנות, התיאורים, המחירים ותמונות המנות) מוזן, מנוהל ומועלה באופן
          בלעדי ועצמאי על ידי בתי העסק עצמם.
        </p>
        <p>
          האחריות על נגישות התוכן המוזן (כגון חלופות טקסטואליות לתמונות - Alt
          Text, ככל שנדרש) חלה על בתי העסק. אנו מעודדים את לקוחותינו להזין תוכן
          נגיש וברור.
        </p>
      </section>

      <section style={{marginBottom: "2rem"}}>
        <h2 style={{fontSize: "1.5rem", marginBottom: "0.5rem"}}>
          הסדרי נגישות פיזיים
        </h2>
        <p>
          מערכת iMenu הינה פלטפורמה דיגיטלית ואינטרנטית המספקת את שירותיה באופן
          מקוון. לעסק אין משרדים עם קבלת קהל פיזית, ולכן לא חלות חובות של הנגשת
          מבנה.
        </p>
      </section>

      <section style={{marginBottom: "2rem"}}>
        <h2 style={{fontSize: "1.5rem", marginBottom: "0.5rem"}}>
          יצירת קשר ומשוב
        </h2>
        <p>
          אנו מקבלים בברכה משוב ממשתמשינו וממשיכים במאמצים לשפר את נגישות
          המערכת. אם נתקלתם בבעיית נגישות באתר המערכת, או אם אתם זקוקים לעזרה
          טכנית, נשמח לעמוד לרשותכם.
        </p>
        <p>
          כדי שנוכל לטפל בבעיה בצורה היעילה ביותר, אנא פנו אלינו וציינו את תיאור
          הבעיה, הקישור לעמוד שבו נתקלתם בה, וסוג הדפדפן שבו השתמשתם.
        </p>
        <div
          style={{
            marginTop: "1rem",
            padding: "15px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <strong>פרטי יצירת קשר עם רכז הנגישות:</strong>
          <ul
            style={{
              paddingRight: "20px",
              listStyleType: "none",
              marginTop: "0.5rem",
            }}
          >
            <li>
              <strong>דוא"ל:</strong>{" "}
              <a href="mailto:dorfrant@gmail.com" style={{color: "#0056b3"}}>
                imenuservice@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </section>

      <footer
        style={{
          marginTop: "3rem",
          paddingTop: "1rem",
          borderTop: "1px solid #eee",
          fontSize: "0.9rem",
          color: "#666",
        }}
      >
        <strong>תאריך עדכון אחרון של הצהרת הנגישות:</strong> 29 במרץ 2026.
      </footer>
    </div>
  );
};

export default Accessibility;
