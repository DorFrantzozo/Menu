// HorizontalCategoryStrip.jsx
export default function HorizontalCategoryStrip({
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="relative w-full overflow-x-hidden">
      {/* ה־scroller עצמו */}
      <div
        dir="rtl"
        className="
          w-full overflow-x-auto overscroll-x-contain touch-pan-x
          snap-x snap-mandatory scroll-smooth
          [-ms-overflow-style:none] [scrollbar-width:none]
        "
      >
        {/* רוחב פנימי אינטרינזי בלבד כדי לא לדחוף את ה־body */}
        <div className="flex w-max gap-4 pe-4 ps-2 py-2">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat)}
              className={`flex flex-col items-center min-w-[64px] px-4 py-3 rounded-xl transition-all snap-start shrink-0
                ${
                  selectedCategory?._id === cat._id
                    ? "bg-zinc-200 text-black"
                    : "bg-white border shadow-md text-gray-600"
                } shadow-sm`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-xs font-medium text-center">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* אופציונלי: פיידים עדינים בקצוות במובייל */}
      <div className="pointer-events-none absolute inset-y-0 start-0 w-6 bg-gradient-to-r from-white/100 to-white/0 md:hidden" />
      <div className="pointer-events-none absolute inset-y-0 end-0 w-6 bg-gradient-to-l from-white/100 to-white/0 md:hidden" />
    </div>
  );
}
