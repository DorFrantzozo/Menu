import sendDiscordAlert from "../utils/discordAlert.js"; // ודא שהנתיב תואם לתיקיות שלך

export const globalErrorHandler = (err, req, res, next) => {
  console.error("Global Error Caught:", err.message);

  const statusCode = err.status || err.statusCode || 500;
  const environment = process.env.NODE_ENV || "development";

  // --- תוספת מערכת הטיקטים של דיסקורד ---
  if (statusCode >= 500) {
    const errorDetails = `**Path:** \`${req.method} ${req.originalUrl}\`\n**Message:** ${err.message}\n${
      environment === "development" && err.stack 
        ? `**Stack:** \`\`\`${err.stack.substring(0, 500)}...\`\`\`` 
        : ""
    }`;

    // שולחים ברקע לערוץ ה-Errors בלי await כדי לא לעכב את הלקוח
    sendDiscordAlert(errorDetails, "🚨 תקלת שרת קריטית (500)", 15158332, "error");
  }
  // ----------------------------------------

  // In production, sanitize the error response and hide the stack trace to prevent data leakage
  if (environment === "production") {
    res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? "Internal Server Error" : err.message,
    });
  } else {
    // In development mode, return full error details for easier debugging
    res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }
};