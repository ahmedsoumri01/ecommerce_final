"use client"

import { useRouter } from "next/router"
import ar from "../messages/ar.json"
import en from "../messages/en.json"
import fr from "../messages/fr.json"

const messages = {
  ar,
  en,
  fr,
}

export function useTranslations() {
  const { locale } = useRouter()
  const t = (key: string) => {
    const keys = key.split(".")
    let value: any = messages[locale as keyof typeof messages]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  return { t, locale }
}

export const getStaticTranslations = (locale: string) => {
  const t = (key: string) => {
    const keys = key.split(".")
    let value: any = messages[locale as keyof typeof messages]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  return { t, locale }
}
