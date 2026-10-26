import { useState, useEffect } from 'react'
import { fetchInvoiceDetail } from '@/services/api/invoicesService'

/** Loads preview detail for an invoice id (null = closed). */
export default function useInvoiceDetail(invoiceId) {
  const [state, setState] = useState({ id: null, detail: null, error: false })

  useEffect(() => {
    if (invoiceId == null) return
    let cancelled = false
    fetchInvoiceDetail(invoiceId)
      .then((detail) => { if (!cancelled) setState({ id: invoiceId, detail, error: false }) })
      .catch(() => { if (!cancelled) setState({ id: invoiceId, detail: null, error: true }) })
    return () => { cancelled = true }
  }, [invoiceId])

  const ready = state.id === invoiceId
  return {
    detail: ready ? state.detail : null,
    loading: invoiceId != null && !ready,
    error: ready && state.error,
  }
}