"use client";

import { useMemo } from "react";
import ar from "../messages/ar.json";
import en from "../messages/en.json";
import fr from "../messages/fr.json";

const messages = {
  ar,
  en,
  fr,
};

export function useClientDictionary(locale: string) {
  const dict = useMemo(() => {
    return messages[locale as keyof typeof messages] || messages["fr"];
  }, [locale]);

  const t = (key: string): string => {
    const keys = key.split(".");
    let result: any = dict;

    for (const k of keys) {
      result = result?.[k];
    }

    return result || key;
  };

  return { t, dict };
}
