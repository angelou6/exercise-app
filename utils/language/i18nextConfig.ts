import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../language/json/en.json";
import es from "../language/json/es.json";

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};

export default function i18nInit() {
  const languageCode = Localization.getLocales()[0]?.languageCode ?? "en";
  const normalized = languageCode.toLowerCase();
  const supported = ["en", "es"] as const;
  const lng = supported.includes(normalized as (typeof supported)[number])
    ? normalized
    : "en";

  i18n.use(initReactI18next).init({
    lng,
    fallbackLng: "en",
    resources,
    compatibilityJSON: "v4",
  });
}
