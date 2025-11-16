"use client"
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="mt-16 border-t border-white/40 bg-white/60 backdrop-blur">
      <div className="container py-6 text-sm flex items-center justify-between">
        <p>© {new Date().getFullYear()} LifeLink ❤️💉🌍</p>
        <p className="opacity-80">{t('footer_made_with')}</p>
      </div>
    </footer>
  )
}
