import React from "react";
import CopyBox from "./CopyBox";

export default function ResultCard({data}) {
  const {hooks, postBody, artDirection, timingRecommendation} = data;

  // פונקציית עזר להבטחת מחרוזת עבור React
  const ensureString = (content) => {
    if (typeof content === "string") return content;
    if (typeof content === "object" && content !== null) {
      // אם יש מפתח 'body' או 'text', נשתמש בו, אחרת נדביק את כל הערכים
      if (content.body) return content.body;
      if (content.text) return content.text;
      
      return Object.entries(content)
        .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
        .join("\n\n");
    }
    return String(content || "");
  };

  return (
    <div className="space-y-6">
      {/* הוקים */}
      <div>
        <h3 className="text-pink-400 font-semibold mb-3 text-sm flex items-center gap-2">
          🎯 משפטי פתיחה לבחירתך:
        </h3>
        <div className="space-y-2">
          {hooks?.map((hook, idx) => (
            <CopyBox key={idx} text={ensureString(hook)} />
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-white/5"></div>

      {/* פוסט */}
      <div>
        <h3 className="text-pink-400 font-semibold mb-3 text-sm flex items-center gap-2">
          📝 גוף הפוסט:
        </h3>
        <CopyBox text={ensureString(postBody)} isLarge />
      </div>

      {/* המלצות שיווקיות */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-black/20 rounded-lg p-4 border border-white/5">
          <span className="block text-gray-400 text-xs mb-1">
            📸 בימוי תמונה
          </span>
          <p className="text-gray-200 text-sm leading-relaxed">
            {ensureString(artDirection)}
          </p>
        </div>

        <div className="bg-black/20 rounded-lg p-4 border border-white/5">
          <span className="block text-gray-400 text-xs mb-1">⏱️ מתי לפרסם</span>
          <p className="text-gray-200 text-sm leading-relaxed">
            {ensureString(timingRecommendation)}
          </p>
        </div>
      </div>
    </div>
  );
}
