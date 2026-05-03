import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const language = i18n.language || "es";

  return (
    <div className="language-switcher">
      <button
        type="button"
        className={language === "es" ? "lang-btn active" : "lang-btn"}
        onClick={() => i18n.changeLanguage("es")}
      >
        Español
      </button>
      <button
        type="button"
        className={language === "en" ? "lang-btn active" : "lang-btn"}
        onClick={() => i18n.changeLanguage("en")}
      >
        English
      </button>
    </div>
  );
}
