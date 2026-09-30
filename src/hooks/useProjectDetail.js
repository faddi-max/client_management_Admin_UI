import { useState, useEffect } from 'react'
import { fetchProjectDetail } from '@/services/api/projectsService'

/** Loads drawer detail for a project id (null = drawer closed). */
export default function useProjectDetail(projectId) {
  const [state, setState] = useState({ id: null, detail: null, error: false })

  useEffect(() => {
    if (projectId == null) return
    let cancelled = false
    fetchProjectDetail(projectId)
      .then((detail) => { if (!cancelled) setState({ id: projectId, detail, error: false }) })
      .catch(() => { if (!cancelled) setState({ id: projectId, detail: null, error: true }) })
    return () => { cancelled = true }
  }, [projectId])

  const ready = state.id === projectId
  return {
    detail: ready ? state.detail : null,
    loading: projectId != null && !ready,
    error: ready && state.error,
  }
}