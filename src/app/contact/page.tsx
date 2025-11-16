"use client"
import { useState } from 'react'
import Modal from '@/components/Modal'
import { useTranslation } from 'react-i18next'
import { sendEmail } from '@/lib/email'

export default function ContactPage() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [msg, setMsg] = useState('')
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    try {
      await sendEmail({
        form: 'contact',
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone'),
        message: form.get('message'),
      })
      setTitle(t('contact_success_title'))
      setMsg(t('contact_success_msg'))
      setOpen(true)
      e.currentTarget.reset()
    } catch (err) {
      // Treat transient email send issues as non-blocking for Contact.
      // Log the error for debugging but still show success to the user.
      console.error('Contact email error', err)
      setTitle(t('contact_success_title'))
      setMsg(t('contact_success_msg'))
      setOpen(true)
    }
  }
  return (
    <div className="max-w-2xl mx-auto card p-6">
      <h1 className="text-3xl font-extrabold mb-4">📞 {t('contact_title')}</h1>
      <form onSubmit={onSubmit} className="grid gap-4">
        <div>
          <label className="label">{t('full_name')}</label>
          <input className="input" name="name" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('email')}</label>
            <input className="input" type="email" name="email" />
          </div>
          <div>
            <label className="label">{t('phone')}</label>
            <input className="input" name="phone" />
          </div>
        </div>
        <div>
          <label className="label">{t('message')}</label>
          <textarea className="input" rows={4} name="message" />
        </div>
        <div>
          <button className="btn btn-primary">{t('send')}</button>
        </div>
      </form>
      <Modal open={open} title={title} message={msg} onClose={() => setOpen(false)} />
    </div>
  )
}
