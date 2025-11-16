"use client"
import { useTranslation } from 'react-i18next'

export default function AboutPage() {
  const { t } = useTranslation()
  return (
    <div className="prose max-w-3xl mx-auto card p-6">
      <h1 className="text-3xl font-extrabold">{t('about_title')}</h1>
      <p>{t('about_intro_1')}</p>
      <p>{t('about_intro_2')}</p>
    </div>
  )
}
