import './globals.css'
import type { Metadata } from 'next'
import { I18nClientProvider } from '@/lib/i18n'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'LifeLink – Blood and Organ Donation Platform',
  description: 'Connect donors and receivers. Save lives with LifeLink.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <I18nClientProvider>
          <Navbar />
          <main className="container py-8">
            {children}
          </main>
          <Footer />
        </I18nClientProvider>
      </body>
    </html>
  )
}
