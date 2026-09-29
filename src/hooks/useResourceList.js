import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Server-driven list state. The UI never filters/sorts/paginates locally:
 * it only changes `params`, and the fetcher (mock or API) does the work.
 *
 * @param {(params) => Promise<{ items: any[], meta: { total: number, page: number, perPage: number } }>} fetcher
 *        MUST be a stable reference (module-level function).
 * @param {{ perPage?: number, initialParams?: object, debounceMs?: number }} [options]
 */
export default function useResourceList(fetcher, { perPage = 10, initialParams = {}, debounceMs = 300 } = {}) {
  const [params, setParams] = useState({ page: 1, perPage, search: '', ...initialParams })
  const [searchInput, setSearchInput] = useState('')
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, perPage })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const requestId = useRef(0)

  // Load — ignores responses from outdated requests
  const load = useCallback(async () => {
    const id = ++requestId.current
    setLoading(true)
    setError(null)
    try {
      const res = await fetcher(params)
      if (id !== requestId.current) return
      setItems(res.items)
      setMeta(res.meta)
      // Page went out of range (e.g. last row deleted) → step back
      if (res.items.length === 0 && res.meta.total > 0 && params.page > 1) {
        setParams((p) => ({ ...p, page: Math.ceil(res.meta.total / p.perPage) }))
      }
    } catch (err) {
      if (id === requestId.current) setError(err)
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }, [fetcher, params])

  useEffect(() => {
    load()
  }, [load])

  // Debounce search → params
  useEffect(() => {
    if (searchInput === params.search) return
    const t = setTimeout(() => setParams((p) => ({ ...p, search: searchInput, page: 1 })), debounceMs)
    return () => clearTimeout(t)
  }, [searchInput, params.search, debounceMs])

  // Selection is per result set
  useEffect(() => {
    setSelectedIds([])
  }, [params])

  const setPage = useCallback((page) => setParams((p) => ({ ...p, page })), [])
  const setPerPage = useCallback((n) => setParams((p) => ({ ...p, perPage: n, page: 1 })), [])
  const setFilter = useCallback((key, value) => setParams((p) => ({ ...p, [key]: value, page: 1 })), [])
  const setSort = useCallback((sort, order) => setParams((p) => ({ ...p, sort, order, page: 1 })), [])

  return {
    params, items, meta, loading, error,
    searchInput, setSearchInput,
    selectedIds, setSelectedIds,
    setPage, setPerPage, setFilter, setSort,
    refetch: load,
  }
}