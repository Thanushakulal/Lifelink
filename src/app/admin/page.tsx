"use client"
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { db } from '@/lib/firebase'
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { sendEmail } from '@/lib/email'

type Donor = { id: string; name: string; city: string; donate: 'blood' | 'organ' | 'both'; status?: string; phone?: string; email?: string }
type Receiver = { id: string; name: string; city: string; need: 'blood' | 'organ'; status?: string; phone?: string; email?: string }

export default function AdminPage() {
  const { t } = useTranslation()
  const [notice, setNotice] = useState<string | null>(null)
  const [donors, setDonors] = useState<Donor[]>([])
  const [receivers, setReceivers] = useState<Receiver[]>([])

  useEffect(() => {
    const dq = query(collection(db, 'donors'), orderBy('createdAt', 'desc'))
    const rq = query(collection(db, 'receivers'), orderBy('createdAt', 'desc'))
    const unsubD = onSnapshot(dq, (snap) => {
      const arr: Donor[] = []
      snap.forEach((doc) => {
        const d = doc.data() as any
        arr.push({
          id: doc.id,
          name: d.name || '',
          city: d.city || '',
          donate: d.donate || 'blood',
          status: d.status || 'pending',
          phone: d.phone,
          email: d.email,
        })
      })
      setDonors(arr)
    })
    const unsubR = onSnapshot(rq, (snap) => {
      const arr: Receiver[] = []
      snap.forEach((doc) => {
        const r = doc.data() as any
        arr.push({
          id: doc.id,
          name: r.name || '',
          city: r.city || '',
          need: r.need || 'blood',
          status: r.status || 'pending',
          phone: r.phone,
          email: r.email,
        })
      })
      setReceivers(arr)
    })
    return () => { unsubD(); unsubR() }
  }, [])
  const sendAlert = () => {
    setNotice(t('alert_sent'))
    setTimeout(() => setNotice(null), 2000)
  }
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">🏥 {t('admin_title')}</h1>
        <button className="btn btn-primary" onClick={sendAlert}>{t('send_urgent_alert')}</button>
      </div>
      {notice && <div className="card p-4 bg-emerald-50 border-emerald-300">{notice}</div>}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <h3 className="text-xl font-bold mb-2">{t('pending_donors')}</h3>
          <ul className="space-y-2">
            {donors.map((d, i) => (
              <li key={i} className="flex items-center justify-between p-3 rounded bg-white/70">
                <div>
                  <p className="font-semibold">{d.name} – {d.city}</p>
                  <p className="text-sm opacity-70">{t(d.donate)} • <span className="px-2 py-0.5 rounded bg-slate-100">{d.status}</span></p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-accent"
                    onClick={async () => {
                      await updateDoc(doc(db, 'donors', d.id), { status: 'approved' })
                      if (d.email) {
                        await sendEmail({
                          form: 'donor',
                          name: d.name,
                          email: d.email,
                          city: d.city,
                          donate: d.donate,
                          subject: `Your donation registration is approved`,
                          registrant_heading: 'Registration Approved',
                          staff_heading: 'Approval Notice',
                          direct_to_email: d.email,
                          message: 'Thank you for registering as a donor. Our team has approved your registration.'
                        })
                      }
                    }}
                  >
                    {t('approve')}
                  </button>
                  <button className="btn btn-primary" onClick={() => updateDoc(doc(db, 'donors', d.id), { status: 'rejected' })}>{t('reject')}</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-4">
          <h3 className="text-xl font-bold mb-2">{t('receiver_requests')}</h3>
          <ul className="space-y-2">
            {receivers.map((r, i) => (
              <li key={i} className="flex items-center justify-between p-3 rounded bg-white/70">
                <div>
                  <p className="font-semibold">{r.name} – {r.city}</p>
                  <p className="text-sm opacity-70">{t(r.need)} • <span className="px-2 py-0.5 rounded bg-slate-100">{r.status}</span></p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-accent"
                    onClick={async () => {
                      await updateDoc(doc(db, 'receivers', r.id), { status: 'assigned' })
                      if (r.email) {
                        await sendEmail({
                          form: 'receiver',
                          name: r.name,
                          email: r.email,
                          city: r.city,
                          need: r.need,
                          subject: `Your request has been assigned`,
                          registrant_heading: 'Request Assigned',
                          staff_heading: 'Assignment Notice',
                          direct_to_email: r.email,
                          message: 'Your request has been assigned. Our team will contact you shortly.'
                        })
                      }
                    }}
                  >
                    {t('assign')}
                  </button>
                  <button className="btn btn-primary" onClick={() => updateDoc(doc(db, 'receivers', r.id), { status: 'done' })}>{t('mark_done')}</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
