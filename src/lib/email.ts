import { emailService } from '@/lib/firebase'
import emailjs from '@emailjs/browser'

export type EmailPayload = Record<string, any>

export async function sendEmail(payload: EmailPayload) {
  if (emailService.provider !== 'emailjs') return
  if (!emailService.publicKey || !emailService.serviceId || !emailService.templateId) return
  try {
  emailjs.init(emailService.publicKey)
  const now = new Date()
  const enriched = {
    // original fields from forms
    ...payload,
    // helpful additions
    date: now.toLocaleString(),
    raw: JSON.stringify(payload, null, 2),
    // common aliases to fit many templates
    user_name: payload.name ?? '',
    from_name: payload.name ?? '',
    from_email: payload.email ?? '',
    reply_to: payload.email ?? '',
    phone_number: payload.phone ?? '',
    city_name: payload.city ?? '',
    subject: `LifeLink ${payload.form ?? 'form'} submission`,
    content: payload.message ?? payload.details ?? '',
  }
  // Admin or special-case: force a single send to a direct recipient (e.g., approval/assignment notices)
  if (typeof payload.direct_to_email === 'string' && payload.direct_to_email) {
    const formKey = (payload.form || '').toString().toLowerCase()
    const donor_display = formKey === 'donor' ? 'block' : 'none'
    const receiver_display = formKey === 'receiver' ? 'block' : 'none'
    const contact_display = formKey === 'contact' ? 'block' : 'none'
    const params = {
      ...enriched,
      to_email: payload.direct_to_email as string,
      to_name: enriched.from_name || enriched.user_name || 'Friend',
      recipient_role: 'registrant',
      subject: payload.subject || enriched.subject,
      staff_heading: payload.staff_heading || 'Notification',
      registrant_heading: payload.registrant_heading || 'Update from LifeLink',
      donor_display,
      receiver_display,
      contact_display,
      section_staff_display: 'none',
      section_registrant_display: 'block',
    }
    try { await emailjs.send(emailService.serviceId, emailService.templateId, params) } catch {}
    return
  }
  // Use one template and send to two recipients (staff + registrant) when applicable.
  const formKey = (payload.form || '').toString().toLowerCase()
  const donor_display = formKey === 'donor' ? 'block' : 'none'
  const receiver_display = formKey === 'receiver' ? 'block' : 'none'
  const contact_display = formKey === 'contact' ? 'block' : 'none'

  // For donor/receiver we send 2 emails if possible; others (e.g., contact) fall back to single.
  const shouldDualSend = formKey === 'donor' || formKey === 'receiver'

  if (shouldDualSend) {
    // 1) Staff notification (requires configured staffTo or template fixed recipient)
    const staff_heading = formKey === 'contact' ? 'New contact message' : `New ${formKey} has registered`
    const registrant_heading = formKey === 'contact' ? 'Thanks for contacting us' : 'Thank you for registering'
    if (emailService.staffTo) {
      const staffParams = {
        ...enriched,
        to_email: emailService.staffTo,
        to_name: 'Staff',
        recipient_role: 'staff',
        subject: `Staff alert: ${enriched.subject}`,
        staff_heading,
        registrant_heading,
        donor_display,
        receiver_display,
        contact_display,
        section_staff_display: 'block',
        section_registrant_display: 'none',
      }
      try { await emailjs.send(emailService.serviceId, emailService.templateId, staffParams) } catch {}
    } else {
      // no staffTo configured; still send once without overriding recipient (template default)
      try {
        await emailjs.send(
          emailService.serviceId,
          emailService.templateId,
          {
            ...enriched,
            recipient_role: 'staff',
            subject: `Staff alert: ${enriched.subject}`,
            staff_heading,
            registrant_heading,
            donor_display,
            receiver_display,
            contact_display,
            section_staff_display: 'block',
            section_registrant_display: 'none',
          }
        )
      } catch {}
    }

    // 2) Thank-you email to registrant (requires they provided an email)
    if (enriched.from_email) {
      const thankParams = {
        ...enriched,
        to_email: enriched.from_email,
        to_name: enriched.from_name || enriched.user_name || 'Friend',
        recipient_role: 'registrant',
        subject: (formKey === 'contact'
          ? `Thanks for contacting us — ${enriched.user_name || ''}`
          : `Thank you for registering — ${enriched.user_name || ''}`
        ).trim(),
        staff_heading,
        registrant_heading,
        donor_display,
        receiver_display,
        contact_display,
        section_staff_display: 'none',
        section_registrant_display: 'block',
      }
      try { await emailjs.send(emailService.serviceId, emailService.templateId, thankParams) } catch {}
    }
    return
  }

  // Fallback: single send using default template ID.
  // If staffTo is configured (e.g., contact form), route to staff explicitly and show staff section only.
  const singleStaffHeading = formKey === 'contact' ? 'New contact message' : `New ${formKey || 'submission'} received`
  const singleRegistrantHeading = formKey === 'contact' ? 'Thanks for contacting us' : 'Thank you for registering'
  const singleParams = emailService.staffTo
    ? {
        ...enriched,
        to_email: emailService.staffTo,
        to_name: 'Staff',
        recipient_role: 'staff',
        staff_heading: singleStaffHeading,
        registrant_heading: singleRegistrantHeading,
        donor_display,
        receiver_display,
        contact_display,
        section_staff_display: 'block',
        section_registrant_display: 'none',
      }
    : enriched
  try {
    await emailjs.send(emailService.serviceId, emailService.templateId, singleParams)
  } catch (e) {
    // Swallow to avoid propagating transient EmailJS errors to UI.
    return
  }
  } catch (e) {
    // Do not propagate errors to UI; callers treat completion as success.
    return
  }
}
