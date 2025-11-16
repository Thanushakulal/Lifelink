export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export const emailService = {
  provider: process.env.NEXT_PUBLIC_EMAIL_PROVIDER || 'emailjs',
  publicKey: process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY || '',
  serviceId: process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID || '',
  templateId: process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID || '',
  templateIds: {
    donor: process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_DONOR || '',
    receiver: process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_RECEIVER || '',
    contact: process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_CONTACT || '',
  },
  staffTo: process.env.NEXT_PUBLIC_EMAIL_STAFF_TO || '',
  thankTemplateIds: {
    donor: process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_THANK_DONOR || '',
    receiver: process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_THANK_RECEIVER || '',
    contact: process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_THANK_CONTACT || '',
  },
}

// Firebase App + Firestore (client)
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig as any)
export const db = getFirestore(app)
