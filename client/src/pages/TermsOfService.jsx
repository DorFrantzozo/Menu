import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <div className="max-w-screen-lg mx-auto p-6">
        <h1 className="text-3xl font-semibold text-center  text-gray-900 mb-6">
          תנאי שימוש
        </h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            השימוש באתר
          </h2>
          <p className="text-gray-700 mb-3">
            תקנון ותנאי שימוש אלה מהווים הסכם מחייב בינך לבין האתר בנוגע לגלישה
            ושימוש באתר התפריט הדיגיטלי בכל מחשב או מכשיר תקשורת אחר.
          </p>
          <p className="text-gray-700 mb-3">
            האתר שומר את זכותו לשנות את תנאי התקנון, מעת לעת, על פי שיקול דעתו
            הבלעדי וללא הודעה מוקדמת. מועד החלת השינוי יהיה מרגע פרסומו באתר.
          </p>
          <p className="text-gray-700 mb-3">
            השימוש באתר מיועד למשתמשים מגיל 16 ומעלה. משתמשים מתחת לגיל 18
            נדרשים לקבל אישור מהורה או אפוטרופוס לפני השימוש באתר. האתר רשאי
            לבטל חשבונות של משתמשים שיתגלו כמתחת לגיל המינימלי ללא התראה מוקדמת.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            קניין רוחני
          </h2>
          <p className="text-gray-700 mb-3">
            כל זכויות היוצרים והקניין הרוחני באתר, לרבות עיצובים, תמונות, טקסטים
            וקוד, הם בבעלות האתר בלבד, אלא אם צוין אחרת במפורש.
          </p>
          <p className="text-gray-700 mb-3">
            אין להעתיק, להפיץ, להציג בפומבי, לבצע בפומבי, להעביר לציבור, לשנות,
            לעבד, ליצור יצירות נגזרות, למכור או להשכיר כל חלק מן האתר, בלא קבלת
            הסכמה בכתב ומראש מהאתר.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            פרטיות ומידע אישי
          </h2>
          <p className="text-gray-700 mb-3">האתר מכבד את פרטיות המשתמשים בו.</p>
          <p className="text-gray-700 mb-3">
            האתר עשוי לאסוף מידע לא-אישי וכללי אודות השימוש באתר, כגון מספר
            הכניסות לתפריט הדיגיטלי.
          </p>
          <p className="text-gray-700 mb-3">
            האתר עשוי לאסוף נתונים אישיים כגון שם, כתובת דוא"ל ומספר טלפון בעת
            הרשמה לאתר או שימוש בשירותים מסוימים.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            תכנים ושירותים באתר
          </h2>
          <p className="text-gray-700 mb-3">
            האתר מציג תפריטים דיגיטליים של מסעדות ובתי עסק. המידע והתכנים
            המוצגים באתר מסופקים על ידי בתי העסק עצמם והאתר אינו אחראי לדיוקם או
            אמינותם.
          </p>
          <p className="text-gray-700 mb-3">
            האתר רשאי בכל עת לשנות את מגוון התכנים והשירותים המוצגים באתר,
            להחליפם או להסירם, ללא הודעה מוקדמת.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            סוגי משתמשים וגישה לשירות
          </h2>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            משתמש חינמי
          </h3>
          <p className="text-gray-700 mb-3">
            משתמש חינמי מקבל גישה לשירות לתקופת ניסיון של 14 ימים. לאחר סיום
            תקופת הניסיון, תיסגר הגישה להצגת התפריט, ולא יהיה ניתן להציג את
            התפריט למשתמשים.
          </p>
          <p className="text-gray-700 mb-3">
            מנהל האתר שומר לעצמו את הזכות להפסיק את הגישה לשירות למשתמש חינמי,
            בכל עת ולפי שיקול דעתו, או במקרה של הפרת תנאי השימוש, ללא הודעה
            מוקדמת.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            משתמש פרמיום
          </h3>
          <p className="text-gray-700 mb-3">
            משתמש פרמיום הוא מנוי בתשלום, אשר רשאי להשתמש בשירות כל עוד הוא משלם
            את דמי המנוי החודשי.
          </p>
          <p className="text-gray-700 mb-3">
            במידה והמשתמש לא משלם את המנוי החודשי, לא תהיה לו גישה לשירות.
          </p>
          <p className="text-gray-700 mb-3">
            מנהל האתר שומר לעצמו את הזכות להפסיק את השירות למשתמש פרמיום במקרה
            בו הוא לא משלם את המנוי, או במידה ויש לו יתרת חוב.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            הגבלות השימוש
          </h2>
          <p className="text-gray-700 mb-3">
            השימוש באתר מותר אך ורק למטרות חוקיות. משתמש לא רשאי להעתיק, לפרסם,
            לשדר, להפיץ או לשנות את התכנים המוצגים באתר ללא אישור מראש ובכתב
            מהאתר.
          </p>
          <p className="text-gray-700 mb-3">
            כל פעולה שתפר את תנאי השימוש או תסכן את יציבות האתר עשויה להוביל
            לחסימתו של המשתמש ו/או להסרתו מהמנוי.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            סיום השירות
          </h2>
          <p className="text-gray-700 mb-3">
            האתר שומר לעצמו את הזכות להפסיק את השירות למשתמשים בכל עת ולפי שיקול
            דעתו, במידה והם לא עומדים בתנאי השימוש או אם ישנה פעולה שנעשית
            בניגוד לחוק.
          </p>
          <p className="text-gray-700 mb-3">
            משתמשים יכולים להפסיק את השימוש בשירות בכל עת, אך תשלום עבור מנוי
            פרמיום לא יוחזר במקרה של ביטול שירות.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            שיפוי והגבלת אחריות
          </h2>
          <p className="text-gray-700 mb-3">
            האתר לא יהיה אחראי לכל נזק ישיר, עקיף, מיוחד או תוצאתי שייגרם כתוצאה
            מהשימוש באתר או השימוש בשירותים המוצעים באתר.
          </p>
          <p className="text-gray-700 mb-3">
            המשתמש מתחייב לשפות את האתר על כל נזק שייגרם כתוצאה משימוש לא חוקי
            או בלתי מורשה בשירותי האתר.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
