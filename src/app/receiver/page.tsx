"use client"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Modal from '@/components/Modal'
import { useTranslation } from 'react-i18next'
import { sendEmail } from '@/lib/email'
import { db } from '@/lib/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  city: z.string().min(2),
  need: z.enum(['blood','organ']),
  details: z.string().min(5),
})

type FormVals = z.infer<typeof schema>

export default function ReceiverPage() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMsg, setModalMsg] = useState('')
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormVals>({ resolver: zodResolver(schema) })
  const onSubmit = async (data: FormVals) => {
    // Show success immediately
    setModalTitle(t('receiver_success_title'))
    setModalMsg(t('receiver_success_msg'))
    setOpen(true)
    const tasks: Promise<any>[] = []
    tasks.push(
      sendEmail({
        form: 'receiver',
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        need: data.need,
        details: data.details,
      })
    )
    tasks.push(
      addDoc(collection(db, 'receivers'), {
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        need: data.need,
        details: data.details,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
    )
    Promise.allSettled(tasks).catch(() => {})
    reset()
  }
  return (
    <div className="max-w-3xl mx-auto card p-6">
      <h1 className="text-3xl font-extrabold mb-4">❤️ {t('receiver_title')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('full_name')}</label>
            <input className="input" {...register('name')} />
          </div>
          <div>
            <label className="label">{t('email')}</label>
            <input className="input" type="email" {...register('email')} />
          </div>
          <div>
            <label className="label">{t('phone')}</label>
            <input className="input" {...register('phone')} />
          </div>
          <div>
            <label className="label">{t('city')}</label>
            <input className="input" {...register('city')} />
          </div>
          <div>
            <label className="label">{t('need')}</label>
            <select className="input" {...register('need')}>
              <option value="blood">{t('blood')}</option>
              <option value="organ">{t('organ')}</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">{t('details')}</label>
            <textarea className="input" rows={4} {...register('details')} />
          </div>
          <div className="md:col-span-2 mt-2">
            <button className="btn btn-accent">{t('request_now')}</button>
          </div>
        </form>
        <Modal open={open} title={modalTitle} message={modalMsg} onClose={() => setOpen(false)} />
    </div>
  )
}
