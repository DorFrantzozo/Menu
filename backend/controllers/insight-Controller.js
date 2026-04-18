import Insight from '../model/insights.js';

/**
 * מביא את כל התובנות הפעילות של בעל המסעדה המחובר
 * GET /api/insights
 */
export const getActiveInsights = async (req, res) => {
    try {
        // ההנחה כאן היא שיש לך מידלוור של אימות ששם את פרטי המשתמש ב-req.user
        const userId = req.user._id || req.user.id; 

        // אנחנו שולפים רק תובנות פעילות כדי לא להציג היסטוריה ישנה
        const insights = await Insight.find({ 
            restaurantId: userId, 
            isActive: true 
        }).sort({ createdAt: -1 }); // החדשות ביותר למעלה
        res.status(200).json(insights);
    } catch (error) {
        console.error("Error fetching insights:", error);
        res.status(500).json({ message: "שגיאה בשליפת תובנות המערכת" });
    }
};

/**
 * מסמן תובנה כלא פעילה (כאשר המשתמש לוחץ 'התעלם' או 'סגור')
 * PATCH /api/insights/:id/dismiss
 */
export const dismissInsight = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id || req.user.id;

        // מוודאים שהתובנה שייכת למשתמש שמנסה לסגור אותה
        const insight = await Insight.findOneAndUpdate(
            { _id: id, restaurantId: userId },
            { isActive: false, isDismissed: true },
            { new: true }
        );

        if (!insight) {
            return res.status(404).json({ message: "התובנה לא נמצאה" });
        }

        res.status(200).json({ message: "התובנה נסגרה בהצלחה", insight });
    } catch (error) {
        console.error("Error dismissing insight:", error);
        res.status(500).json({ message: "שגיאה בעדכון התובנה" });
    }
};