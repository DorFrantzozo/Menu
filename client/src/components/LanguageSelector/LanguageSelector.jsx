import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="border p-2 w-20  rounded"
    >
      <option value="en">English</option>
      <option value="he">עברית</option>
    </select>
  );
}
