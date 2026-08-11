import PropTypes from "prop-types";

const OPTIONS = [
  {value: "default", label: "צבעוני"},
  {value: "bw", label: "שחור-לבן (חיסכון בדיו)"},
];

export default function ColorSchemeSelector({value, onChange}) {
  return (
    <div>
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2">סכמת צבעים</p>
      <div className="flex gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-colors ${
              value === option.value
                ? "border-primary-500 bg-primary-500/10 text-primary-dark dark:text-emerald-300"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

ColorSchemeSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
