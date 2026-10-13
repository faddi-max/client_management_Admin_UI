import { useState, useEffect, useCallback } from 'react'
import { fetchCredentialsOverview, fetchCredentialFacets } from '@/services/api/credentialsService'

/**
 * Vault status + stat cards + tab/filter counts, loaded together.
 * Keeps the previous data while refetching (so cards never flash a skeleton after a reveal/add).
 */
export default function useCredentialsOverview() {
  const [state, setState] = useState({ overview: null, facets: null, loading: true, error: null })
  const [reloadKey, setReloadKey] = useState(0)

  // setState only runs in promise callbacks, never in the effect body
  useEffect(() => {
    let cancelled = false
    Promise.all([fetchCredentialsOverview(), fetchCredentialFacets()])
      .then(([overview, facets]) => { if (!cancelled) setState({ overview, facets, loading: false, error: null }) })
      .catch((error) => { if (!cancelled) setState((s) => ({ ...s, loading: false, error })) })
    return () => { cancelled = true }
  }, [reloadKey])

  const refetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }))
    setReloadKey((k) => k + 1)
  }, [])

  return {
    stats: state.overview?.stats ?? null,
    vault: state.overview?.vault ?? null,
    facets: state.facets,
    loading: state.loading,
    error: state.error,
    refetch,
  }
}