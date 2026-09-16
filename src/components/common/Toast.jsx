import { CheckCircle2 } from 'lucide-react'

export default function Toast({ message }) {
  if (!message) return null
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
      <CheckCircle2 size={16} className="shrink-0 text-primary-400" />
      {message}
    </div>
  )
}
