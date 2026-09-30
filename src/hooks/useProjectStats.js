import { useState, useEffect, useCallback } from 'react'
import { fetchProjectStats } from '@/services/api/projectsService'

export default function useProjectStats() {
  const [state, setState] = useState({ stats: null, loading: true, error: null })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    fetchProjectStats()
      .then((stats) => {
        if (!cancelled) setState({ stats, loading: false, error: null })
      })
      .catch((error) => {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error }))
      })

    // Ignore results from outdated requests or after unmount
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  // Called from a click handler, so setting state here is fine
  const refetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }))
    setReloadKey((k) => k + 1)
  }, [])

  return { stats: state.stats, loading: state.loading, error: state.error, refetch }
}