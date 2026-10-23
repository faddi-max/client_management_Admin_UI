import { useState, useEffect, useCallback } from 'react'
import { fetchDomainsOverview } from '@/services/api/domainsService'

/** Header sync info + stat cards, loaded together. Keeps old data while refetching. */
export default function useDomainsOverview() {
  const [state, setState] = useState({ overview: null, loading: true, error: null })
  const [reloadKey, setReloadKey] = useState(0)

  // setState only runs in promise callbacks, never in the effect body
  useEffect(() => {
    let cancelled = false
    fetchDomainsOverview()
      .then((overview) => { if (!cancelled) setState({ overview, loading: false, error: null }) })
      .catch((error) => { if (!cancelled) setState((s) => ({ ...s, loading: false, error })) })
    return () => { cancelled = true }
  }, [reloadKey])

  const refetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }))
    setReloadKey((k) => k + 1)
  }, [])

  return {
    sync: state.overview?.sync ?? null,
    stats: state.overview?.stats ?? null,
    loading: state.loading,
    error: state.error,
    refetch,
  }
}