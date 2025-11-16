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
  donate: z.enum(['blood','organ','both']),
  bloodGroup: z.string().optional(),
  nomineeName: z.string().optional(),
  nomineePhone: z.string().optional(),
})

type FormVals = z.infer<typeof schema>

export default function DonorPage() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMsg, setModalMsg] = useState('')
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormVals>({ resolver: zodResolver(schema) })
  const onSubmit = async (data: FormVals) => {
    // Show success immediately
    setModalTitle(t('donor_success_title'))
    setModalMsg(t('donor_success_msg'))
    setOpen(true)
    const tasks: Promise<any>[] = []
    tasks.push(
      sendEmail({
        form: 'donor',
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        donate: data.donate,
        bloodGroup: data.bloodGroup,
        nomineeName: data.nomineeName,
        nomineePhone: data.nomineePhone,
      })
    )
    tasks.push(
      addDoc(collection(db, 'donors'), {
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        donate: data.donate,
        bloodGroup: data.bloodGroup || null,
        nomineeName: data.nomineeName || null,
        nomineePhone: data.nomineePhone || null,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
    )
    Promise.allSettled(tasks).catch(() => {})
    reset()
  }
  return (
    <div className="max-w-3xl mx-auto card p-6">
      <h1 className="text-3xl font-extrabold mb-4">🩸 {t('donor_title')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">{t('full_name')}</label>
          <input className="input" {...register('name')} />
          {errors.name && <p className="text-red-600 text-sm">{t('error_generic')}</p>}
        </div>
        <div>
          <label className="label">{t('email')}</label>
          <input className="input" type="email" {...register('email')} />
          {errors.email && <p className="text-red-600 text-sm">{t('error_generic')}</p>}
        </div>
        <div>
          <label className="label">{t('phone')}</label>
          <input className="input" {...register('phone')} />
        </div>
        <div>
          <label className="label">{t('city')}</label>
          <input className="input" {...register('city')} />
        </div>
        <div className="md:col-span-2">
          <label className="label">{t('donation_pref')}</label>
          <select className="input" {...register('donate')}>
            <option value="blood">{t('blood')}</option>
            <option value="organ">{t('organ')}</option>
            <option value="both">{t('both')}</option>
          </select>
        </div>
        <div>
          <label className="label">{t('blood_group')}</label>
          <input className="input" placeholder="O+, A-, ..." {...register('bloodGroup')} />
        </div>
        <div className="md:col-span-2">
          <h3 className="font-bold mt-2">{t('nominee_section')}</h3>
        </div>
        <div>
          <label className="label">{t('nominee_name')}</label>
          <input className="input" {...register('nomineeName')} />
        </div>
        <div>
          <label className="label">{t('nominee_phone')}</label>
          <input className="input" {...register('nomineePhone')} />
        </div>
        <div className="md:col-span-2 mt-2">
          <button className="btn btn-primary">{t('submit')}</button>
        </div>
      </form>
      <Modal open={open} title={modalTitle} message={modalMsg} onClose={() => setOpen(false)} />
    </div>
  )
}
