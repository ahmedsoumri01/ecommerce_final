const dictionaries = {
  ar: () => import("./dictionaries/ar.json").then((module) => module.default),
  en: () => import("@/messages/en.json").then((module) => module.default),
  fr: () => import("@/messages/fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: keyof typeof dictionaries) =>
  dictionaries[locale]?.() ?? dictionaries.ar();
