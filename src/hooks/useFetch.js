import { useState, useEffect, useCallback } from 'react'

/**
 * Generic data-fetching hook.
 *
 * @param {() => Promise<import('axios').AxiosResponse>} fetchFn  — async function that returns an Axios response
 * @param {any[]} deps — dependency array (re-runs when these change)
 *
 * @returns {{ data, loading, error, refetch }}
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchFn()
      setData(response.data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    execute()
  }, [execute])

  return { data, loading, error, refetch: execute }
}
