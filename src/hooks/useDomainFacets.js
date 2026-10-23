import { useState, useEffect, useCallback } from 'react'
import { fetchDomainFacets } from '@/services/api/domainsService'

/** Tab counts + Client / Provider filter options. Keeps the old facets while refetching. */
export default function useDomainFacets() {
  const [state, setState] = useState({ facets: null, error: null })
  const [reloadKey, setReloadKey] = useState(0)

  // setState only runs in promise callbacks, never in the effect body
  useEffect(() => {
    let cancelled = false
    fetchDomainFacets()
      .then((facets) => { if (!cancelled) setState({ facets, error: null }) })
      .catch((error) => { if (!cancelled) setState((s) => ({ ...s, error })) })
    return () => { cancelled = true }
  }, [reloadKey])

  const refetch = useCallback(() => setReloadKey((k) => k + 1), [])

  return { facets: state.facets, error: state.error, refetch }
}