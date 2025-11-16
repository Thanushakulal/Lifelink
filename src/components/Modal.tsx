"use client"
export default function Modal({ open, title, message, onClose }: { open: boolean, title: string, message: string, onClose: () => void }) {
  if (!open) return null
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="mb-4">{message}</p>
        <button onClick={onClose} className="btn btn-primary">Close</button>
      </div>
    </div>
  )
}
