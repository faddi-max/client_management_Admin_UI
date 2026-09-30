import { useState, useEffect } from 'react'
import { fetchFeaturedProject } from '@/services/api/projectsService'

/** Critical-path project shown in the card above the lifecycle tabs. */
export default function useFeaturedProject() {
  const [state, setState] = useState({ project: null, loading: true })

  useEffect(() => {
    let cancelled = false
    fetchFeaturedProject()
      .then((project) => { if (!cancelled) setState({ project, loading: false }) })
      .catch(() => { if (!cancelled) setState({ project: null, loading: false }) })
    return () => { cancelled = true }
  }, [])

  return state
}