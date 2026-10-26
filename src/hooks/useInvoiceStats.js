import { useState, useEffect, useCallback } from 'react'
import { fetchInvoiceStats } from '@/services/api/invoicesService'

export default function useInvoiceStats(externalKey = 0) {
  const [state, setState] = useState({ stats: null, loading: true, error: null })
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchInvoiceStats()
      .then((stats) => { if (!cancelled) setState({ stats, loading: false, error: null }) })
      .catch((error) => { if (!cancelled) setState((s) => ({ ...s, loading: false, error })) })
    return () => { cancelled = true }
  }, [externalKey, retryKey])

  const refetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }))
    setRetryKey((k) => k + 1)
  }, [])

  return { stats: state.stats, loading: state.loading, error: state.error, refetch }
}