"use client"
import i18n from 'i18next'
import { initReactI18next, I18nextProvider } from 'react-i18next'
import en from '@/../public/locales/en/common.json'
import kn from '@/../public/locales/kn/common.json'
import hi from '@/../public/locales/hi/common.json'
import ml from '@/../public/locales/ml/common.json'
import { useEffect, useState } from 'react'

const resources = { en: { translation: en }, kn: { translation: kn }, hi: { translation: hi }, ml: { translation: ml } }

let initialized = false

export function I18nClientProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!initialized) {
      i18n
        .use(initReactI18next)
        .init({
          resources,
          lng: typeof window !== 'undefined' ? (localStorage.getItem('ll_lang') || 'en') : 'en',
          fallbackLng: 'en',
          interpolation: { escapeValue: false },
        })
      initialized = true
    }
    setReady(true)
  }, [])

  if (!ready) return null
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

export function setLanguage(lng: 'en'|'kn'|'hi'|'ml') {
  i18n.changeLanguage(lng)
  if (typeof window !== 'undefined') localStorage.setItem('ll_lang', lng)
}
