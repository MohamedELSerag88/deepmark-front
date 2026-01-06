import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";

import translationAr from "./locales/ar/translation.json";
import translationENG from "./locales/eng/translation.json";
 
const resources = {
  en: {
    translation: translationENG,
  },
  ar: {
    translation: translationAr,
  },
 
};

const language = localStorage.getItem("web-kicks_lang");
if (!language) {
  localStorage.setItem("web-kicks_lang", "en");
}

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem("web-kicks_lang") || "en",
    fallbackLng: "en", // use en if detected lng is not available

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
