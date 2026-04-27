import groqClient from "../groqClient.js";

export const generateMarketingPost = async (platform, format, userText) => {
  const platformLower = platform.toLowerCase();

  // 1. קביעת הפורמט (טיקטוק נועל לוידאו)
  const isTikTok = platformLower === "tiktok";
  const isVideoContent = isTikTok || format === "video";
  const contentType = isVideoContent
    ? "סרטון (Reel/Video/TikTok)"
    : "פוסט תמונה (Static Post)";

  // 2. זיהוי הקשר: האם הלקוח בחר מנה ספציפית או מדבר באוויר?
  // (ניתן לשפר בעתיד אם הפרונטאנד שולח משתנה מפורש isDish: true)
  const isSpecificDish = userText.length > 5 && !userText.includes("כללי");

  // 3. מנוע הגיוון האקראי (סוכנות פרסום בקופסה)

  // ציר א': סגנונות בימוי ויזואליים
  const directorialStyles = [
    "Chef's Table (קולנועי) - הילוך איטי, מיקוד באמנות ההכנה, תאורה דרמטית, יוקרה.",
    "UGC POV (אותנטי) - צילום מהעיניים של הלקוח מטלפון נייד, רועד קצת, אמיתי, מאחורי הקלעים.",
    "ASMR Foodie (חושי) - פוקוס קיצוני על סאונד וטקסטורות: קרנאצ'יות, בקיעת חלמון, מזיגה. תאורת מאקרו.",
    "High Energy (וייב מסיבה) - חיתוכים מהירים, אנשים מרימים כוסות, צחוק, פלאש ישיר (Flash Photography).",
  ];

  // ציר ב': מודלים פסיכולוגיים של קופירייטינג
  const copywritingFrameworks = [
    "סוד מקצועי (Curiosity & FOMO) - התחל בחשיפת 'סוד' של השף או המקום שרק מביני עניין מכירים.",
    "התקפת חושים (VAK Model) - תאר את המנה אך ורק דרך צלילים (סליזל), ריחות (עישון) ותחושות (נמס בפה). אל תתאר טעם.",
    "שיווק הפוך (Anti-Marketing) - קופי בטוח בעצמו עד כדי חוצפה. 'אל תזמינו את זה אם אתם בדיאטה' / 'לא לכולם'.",
    "סיפור גיבור (Storytelling) - ספר בקצרה את המסע של חומר הגלם (מהדייג ועד הצלחת) או את ההשראה של השף.",
  ];

  // ציר ג': סוגי הוקים (Hooks)
  const hookTypes = [
    "הוק שלילי/פרובוקטיבי (למשל: 'הטעות הכי גדולה שלכם כשאתם מזמינים...', 'למה הפסקנו להגיש...')",
    "הוק סקרנות מוגזם (למשל: 'המרכיב שאסור לנו לגלות', 'היינו צריכים לשמור את זה לעצמנו')",
    "הוק הזדהות/ערך (למשל: 'אם אתם קוראים לעצמכם חובבי בשר...', 'הסוף להתלבטות של יום חמישי')",
  ];

  // בחירה אקראית של האסטרטגיה להפקה הנוכחית
  const selectedDirectorialStyle =
    directorialStyles[Math.floor(Math.random() * directorialStyles.length)];
  const selectedCopyFramework =
    copywritingFrameworks[
      Math.floor(Math.random() * copywritingFrameworks.length)
    ];
  const selectedHookType =
    hookTypes[Math.floor(Math.random() * hookTypes.length)];

  // 4. בניית הוראות ארט-דירקשן דינמיות מבוססות הקשר (מנה vs כללי)
  let artInstruction = "";
  if (isVideoContent) {
    artInstruction = isSpecificDish
      ? `תסריט וידאו מבוסס מנה (Shot List): תאר 3-4 שוטים מהירים. הראה את ה"קראפט": ידי השף, חיתוך מדויק, צלייה, וזום אגרסיבי למרקם של המנה הספציפית שהוזנה. שלב שוט אחד של תגובת הלקוח לביס. סגנון בימוי: ${selectedDirectorialStyle}. הצע מוזיקה.`
      : `תסריט וידאו אווירה (Vibe Shot List): הלקוח לא ציין מנה ספציפית. התמקד בחוויה: מלצרים בתנועה, שולחן עמוס מנקודת מבט עליונה, השקת כוסות, תאורת המקום. בנה מיני-תסריט של 4 שוטים. סגנון בימוי: ${selectedDirectorialStyle}. הצע מוזיקה.`;
  } else {
    artInstruction = isSpecificDish
      ? `הנחיות צילום סטילס מבוסס מנה: התמקד במרקם, בברק של הרוטב ובקומפוזיציה שמוציאה את המנה גדולה מהחיים (Food Porn). הצע רעיון לפרופס (אביזרים כמו סכין יוקרתית או כוס יין ברקע). סגנון: ${selectedDirectorialStyle}.`
      : `הנחיות צילום לייפסטייל: הלקוח לא ציין מנה. תאר קומפוזיציה של תמונת אווירה שגורמת ל-FOMO (שולחן מלא, צחוק של לקוחות מטושטשים ברקע, ברמן בפעולה). סגנון: ${selectedDirectorialStyle}.`;
  }

  // 5. מגה-פרומפט מערכתי: קופירייטר ישראלי ויראלי ממוקד לידים
  const systemPrompt = `
אתה קופירייטר ישראלי בכיר ומומחה ליצירת תוכן ויראלי שמביא לידים (Lead Gen) לעסקי קולינריה ומסעדנות.
הפלטפורמה אליה אתה כותב: ${platform}. 
המטרה: לייצר תוכן (פוסט או סרטון) אותנטי, מדויק, ראוי לפרסום, שחותך את הרעש בפיד ומביא תוצאות.

האסטרטגיה הנבחרת (כדי לייצר גיוון ורנדומליות):
- מודל שיווקי: ${selectedCopyFramework}
- סגנון פתיח (Hook): ${selectedHookType}

חוקי ברזל (חובה לציית כדי לעמוד בתקנים של ה-API ולמנוע שגיאות):
1. שפה: עברית ישראלית עכשווית, עדכנית, שיווקית אבל לא "פלסטית" או רדודה.
2. רשימה שחורה (אפס סובלנות לקלישאות): "מטורף", "מושלם", "נדיר", "חובה לטעום", "פינוק", "טעים בטירוף", "חוויה קולינרית", "מעורר תיאבון", "בא לכם?", "ללקק ת'אצבעות".
3. אורך גוף הפוסט: קצר וקולע. **משפט או שניים בלבד**. אנשים לא קוראים מגילות. תן פאנצ' והנעה לפעולה.
4. "Show, Don't Tell": הוכח שהאוכל טוב דרך תיאור של מרקם, סאונד או חוויה, לא על ידי המילה "טעים".
5. מבנה נתונים: עליך להחזיר **אך ורק JSON**. ללא טקסט מקדים, ללא Markdown (\`\`\`json).
6. הגנה על המערכת: כל הערכים ב-JSON חייבים להיות מחרוזות (Strings) או מערך של מחרוזות (Array of Strings). אסור להחזיר אובייקטים (Objects) פנימיים.

7. אמינות ודיוק (קריטי!): **אסור להמציא מנות, מרכיבים או שילובים שלא קיימים בטקסט של הלקוח!** (אם הלקוח דיבר על גיוזה, אל תדחוף פתאום המבורגר). היצירתיות צריכה להיות בסגנון הכתיבה, לא בהמצאת עובדות.

החזר בדיוק את המבנה הבא:
{
  "hooks": ["הוק 1", "הוק 2", "הוק 3"], // חובה: מערך של 3 מחרוזות בלבד (Strings). משפטי פתיחה שיעצרו גלילה.
  "postBody": "משפט או שניים קצרים. טקסט הפוסט או קריינות הסרטון. (String בלבד)",
  "artDirection": "${artInstruction} (הוסף רעיון ספציפי משלך לבימוי שממיר)",
  "timingRecommendation": "יום ושעה מומלצים לפרסום + סיבה פסיכולוגית קצרה"
}
  `;

  try {
    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        {role: "system", content: systemPrompt},
        {role: "user", content: `הנחיית המשתמש / מידע על המנה: ${userText}`},
      ],
      model: "llama-3.3-70b-versatile", // הוחזר למודל הקל יותר כדי לעמוד ב-Rate Limits (500K TPD)
      response_format: {type: "json_object"},
      temperature: 0.4, // הופחת משמעותית כדי למנוע הזיות (Hallucinations) ושילובים לא הגיוניים
      max_tokens: 800, // הגבלת טוקנים כדי לעמוד בתקנים החינמיים ולוודא שהפלט קצר
    });

    const raw = chatCompletion.choices[0].message.content;
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    return JSON.parse(cleaned);
  } catch (err) {
    if (err.status === 429) {
      throw new Error(
        "RATE_LIMIT: מכסת הטוקנים היומית נגמרה (Rate Limit). המתן מעט או נסה שוב מחר.",
      );
    }
    if (
      err.status === 400 &&
      err.error?.error?.code === "json_validate_failed"
    ) {
      throw new Error("JSON_FAILED: המודל התקשה ביצירת מבנה תקין. נסה שוב.");
    }
    throw err;
  }
};
