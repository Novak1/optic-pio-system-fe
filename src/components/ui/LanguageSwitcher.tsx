import { useTranslation } from "../../hooks/useTranslation";

export const LanguageSwitcher = () => {
  const { changeLanguage, currentLanguage } = useTranslation();

  const languages = [
    { code: "en" as const, label: "English", flag: "🇬🇧" },
    { code: "srb" as const, label: "Srpski", flag: "🇷🇸" },
  ];

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            currentLanguage === lang.code
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
          title={lang.label}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
