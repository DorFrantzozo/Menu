import PropTypes from "prop-types";

const OPTIONS = [
  {key: "includeDescriptions", label: "תיאורי מנות"},
  {key: "includeAllergens", label: "אייקוני אלרגנים"},
  {key: "includeContactInfo", label: "פרטי קשר"},
  {key: "includeQrCode", label: "קוד QR לתפריט הדיגיטלי"},
];

export default function ContentOptionsPanel({config, onChange}) {
  return (
    <div>
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2">תוכן להצגה</p>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map((option) => (
          <label
            key={option.key}
            className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={!!config[option.key]}
              onChange={(e) => onChange({[option.key]: e.target.checked})}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}

ContentOptionsPanel.propTypes = {
  config: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
