"use client"
import Hero from '@/components/Hero'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-8">
      <Hero />
      <section className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-extrabold mb-2">{t('home_why_title')}</h3>
          <p>{t('home_why_text')}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-extrabold mb-2">{t('home_trusted_title')}</h3>
          <p>{t('home_trusted_text')}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-extrabold mb-2">{t('home_realtime_title')}</h3>
          <p>{t('home_realtime_text')}</p>
        </div>
      </section>
    </div>
  )
}
