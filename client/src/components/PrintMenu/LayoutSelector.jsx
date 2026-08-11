import PropTypes from "prop-types";

const OPTIONS = [
  {value: "premium", label: "מרווח (Premium)", hint: "קריאות מרבית, ~10-12 מנות בעמוד"},
  {value: "compact", label: "צפוף (Compact)", hint: "פחות עמודים, ~14-16 מנות בעמוד"},
];

export default function LayoutSelector({value, onChange}) {
  return (
    <div>
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2">פריסה</p>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`text-right p-3 rounded-xl border transition-colors ${
              value === option.value
                ? "border-primary-500 bg-primary-500/10 text-primary-dark dark:text-emerald-300"
                : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            <span className="block text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              {option.label}
            </span>
            <span className="block text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {option.hint}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

LayoutSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
