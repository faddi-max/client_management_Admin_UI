import { FileText } from 'lucide-react'

export default function Invoices() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
          <FileText size={28} className="text-primary-600" />
          Invoices
        </h1>
        <p className="mt-1 text-sm text-neutral-500">Generate, send, and manage invoices.</p>
      </div>

      <div className="flex items-center justify-center h-64 rounded-xl border-2 border-dashed border-neutral-200 bg-white">
        <div className="text-center">
          <FileText size={40} className="mx-auto mb-3 text-neutral-300" />
          <p className="text-sm font-medium text-neutral-400">Coming soon</p>
          <p className="text-xs text-neutral-300 mt-1">This page is under construction.</p>
        </div>
      </div>
    </div>
  )
}
