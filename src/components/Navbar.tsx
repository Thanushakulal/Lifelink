"use client"
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { setLanguage } from '@/lib/i18n'
import { useState } from 'react'

const langs = [
  { code: 'en', label: 'English' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ml', label: 'മലയാളം' },
] as const

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/60 border-b border-white/50">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-primary-700 text-xl">
          <span>🌍</span>
          <span>{t('brand')}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-semibold">
          <Link href="/donor" className="hover:underline">🩸 {t('donor')}</Link>
          <Link href="/receiver" className="hover:underline">❤️ {t('receiver')}</Link>
          <Link href="/admin" className="hover:underline">🏥 {t('admin')}</Link>
          <Link href="/about" className="hover:underline">ℹ️ {t('about')}</Link>
          <Link href="/contact" className="hover:underline">📞 {t('contact')}</Link>
          <div className="relative">
            <button onClick={() => setOpen(!open)} className="btn btn-accent">🌐 {i18n.language.toUpperCase()}</button>
            {open && (
              <div className="absolute right-0 mt-2 card p-2">
                {langs.map(l => (
                  <button key={l.code} onClick={() => { setLanguage(l.code as any); setOpen(false) }} className="px-3 py-2 rounded hover:bg-slate-100 w-full text-left">
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
        <button className="md:hidden btn btn-primary" onClick={() => setOpen(o => !o)}>☰</button>
      </div>
    </header>
  )
}
