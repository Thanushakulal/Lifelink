"use client"
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function Hero() {
  const { t } = useTranslation()
  return (
    <section className="text-center py-16">
      <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="text-4xl md:text-6xl font-extrabold text-primary-800 drop-shadow">
        {t('hero_title')} ❤️💉
      </motion.h1>
      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} className="mt-4 text-lg md:text-2xl max-w-3xl mx-auto">
        {t('hero_sub')}
      </motion.p>
      <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
        <Link href="/donor" className="btn btn-primary">🩸 {t('cta_donor')}</Link>
        <Link href="/receiver" className="btn btn-accent">❤️ {t('cta_receiver')}</Link>
        <Link href="/admin" className="btn btn-primary bg-gradient-to-r from-primary-500 to-pink-500">🏥 {t('cta_admin')}</Link>
      </div>
    </section>
  )
}
