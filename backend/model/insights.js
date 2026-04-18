import mongoose from "mongoose";

const insightSchema = new mongoose.Schema({
    // שיוך למסעדה
  restaurantId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', // <--- התיקון הקריטי: מצביע למודל ה-User שלך
      required: true, 
      index: true 
  },
    
    // מזהה החוק (עוזר לנו למנוע כפילויות ולדעת איזה לוגיקה הופעלה)
    ruleId: { 
        type: String, 
        required: true,
     enum: [
        'CAT_OVERLOAD', //עומס קטגוריה
        'THIN_CAT', // קטגוריה דלילה
        'DISH_POOR_DESC', // תיאור יבש
        'DISH_NO_IMAGE', // מנה ללא תמונה
        'HIGH_VIEWS_LOW_CONVERSION', // המרה נמוכה
        'HIDDEN_GEM_DISH', // מנה נסתרת
        'GHOST_DISH', 
        'INVISIBLE_SALE_DISH'
    ]
    },

    // התוכן שיוצג למשתמש (מיוצר על ידי ה-AI)
    title: { type: String, required: true },
    message: { type: String, required: true },
    
    // לאן הכפתור ב-React אמור לקחת את המשתמש
    actionLink: { type: String }, 

    // ניהול מצבים
    isActive: { type: Boolean, default: true },
    isDismissed: { type: Boolean, default: false },
    
    // לוגיקה של "ציון בריאות" - כמה התובנה הזו דחופה (1-10)
    priority: { type: Number, default: 5 },

    // נתונים נוספים למקרה שנרצה להציג מספרים בתוך התובנה
    metaData: { type: Object } 
    
}, { timestamps: true });

// אינדקס ייחודי: מבטיח שלא תהיה יותר מתובנה פעילה אחת מאותו סוג לאותה מסעדה
// זה קריטי ל-Upsert הלילי שלנו
insightSchema.index({ restaurantId: 1, ruleId: 1, isActive: 1 }, { unique: true });

export default mongoose.models.Insight || mongoose.model("Insight", insightSchema);