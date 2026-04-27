import * as aiService from "../services/aiService.js";

/**
 * מעבד תמונת תפריט ומחזיר JSON מובנה לעריכה ב-Frontend
 */
export const uploadAndProcess = async (req, res) => {
  try {
    // 1. בדיקה שהקובץ הגיע (Multer שם אותו ב-req.file)
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "לא הועלתה תמונה. אנא נסה שנית.",
      });
    }

    // 2. הגדרת Timeout לבינה המלאכותית
    // אם ה-AI לא מחזיר תשובה תוך 40 שניות, נשחרר את הלקוח עם שגיאה
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI_TIMEOUT")), 40000),
    );

    // 3. שליחה לניתוח ב-Service (מרוץ בין ה-AI ל-Timeout)
    // אנחנו משתמשים ב-req.file.buffer כי הגדרת memoryStorage במולטר
    const processedData = await Promise.race([
      aiService.extractMenuFromImage(req.file.buffer, req.file.mimetype),
      timeout,
    ]);

    // 4. החזרת הנתונים המעובדים למשתמש
    // הנתונים יכללו כבר תרגום לאנגלית ולוגיקת אייקונים כפי שהגדרנו בפרומפט
    return res.status(200).json({
      success: true,
      message: "התפריט נסרק בהצלחה! נא לעבור על הנתונים ולאשר.",
      data: processedData,
    });
  } catch (error) {
    console.error("Error in aiController:", error);

    // טיפול במקרה של Timeout
    if (error.message === "AI_TIMEOUT") {
      return res.status(504).json({
        success: false,
        message: "הניתוח לוקח יותר מדי זמן. וודא שהתמונה ברורה ונסה שנית.",
      });
    }

    // שגיאות כלליות (API Key לא תקין, פורמט תמונה וכו')
    return res.status(500).json({
      success: false,
      message: "חלה שגיאה בעיבוד התפריט על ידי ה-AI.",
      error: error.message,
    });
  }
};
