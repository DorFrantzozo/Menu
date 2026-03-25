// backend/utils/discordAlert.js

const sendDiscordAlert = async (message, title = "🔔 התראה", color = 3447003, type = "activity") => {
  // כאן הקוד מחפש בדיוק את השמות מה-ENV
  const webhookUrl = type === "error" 
    ? process.env.DISCORD_ERRORS_WEBHOOK_URL 
    : type === "tickets"
    ? process.env.DISCORD_TICKET_WEBHOOK_URL
    : process.env.DISCORD_ACTIVITY_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("Discord Webhook URL is missing in .env");
    return;
  }

  try {
    // אנחנו משתמשים ב-fetch המובנה של Node כדי לא להתקין ספריות מיותרות
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: title,
          description: message,
          color: color, 
          timestamp: new Date().toISOString()
        }]
      })
    });
  } catch (error) {
    console.error("Failed to send Discord alert:", error);
  }
};

export default sendDiscordAlert;