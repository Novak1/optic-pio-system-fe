import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "../locales/en.json";
import srbTranslations from "../locales/srb.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  srb: {
    translation: srbTranslations,
  },
};

// Get language from localStorage or default to English
const savedLanguage = localStorage.getItem("language") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
    react: {
      useSuspense: false,
    },
  });

// Save language changes to localStorage
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;
