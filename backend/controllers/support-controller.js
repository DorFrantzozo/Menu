import sendDiscordAlert from "../utils/discordAlert.js";
import User from "../model/user.js";

export const openTicket = async (req, res) => {
  try {
    const { subject, message, urgency } = req.body;
    
    // req.user only contains _id and role from the JWT
    // Fetch full user details to get email, restaurantName, etc.
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!subject || !message || !urgency) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Color coding by urgency
    // Urgent: Red (15158332), Medium: Yellow (15844352), Low: Gray (9807270)
    let color = 9807270;
    if (urgency === "Urgent") color = 15158332;
    else if (urgency === "Medium") color = 15844352;

    const ticketDetails = `
**👤 משתמש:** ${user.displayName || "לא ידוע"}
**📧 אימייל:** ${user.email}
**🏠 מסעדה:** ${user.restaurantName || "לא ידוע"}
**📝 נושא:** ${subject}
**🔥 דחיפות:** ${urgency}

**💬 הודעה:**
${message}
    `;

    await sendDiscordAlert(
      ticketDetails, 
      "🎫 קריאת תמיכה חדשה", 
      color, 
      "tickets"
    );

    res.status(200).json({ message: "פנייתך התקבלה, נחזור אליך בהקדם!" });
  } catch (error) {
    console.error("Error opening support ticket:", error);
    res.status(500).json({ message: "שגיאה בפתיחת קריאת תמיכה" });
  }
};
