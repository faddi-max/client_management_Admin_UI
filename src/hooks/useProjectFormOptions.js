import { useState, useEffect } from 'react'
import { fetchClientOptions, LEAD_OPTIONS } from '@/services/api/projectsService'

export default function useProjectFormOptions() {
  const [state, setState] = useState({ clients: [], error: false })

  // setState only runs in promise callbacks, never in the effect body
  useEffect(() => {
    let cancelled = false
    fetchClientOptions()
      .then((clients) => { if (!cancelled) setState({ clients, error: false }) })
      .catch(() => { if (!cancelled) setState({ clients: [], error: true }) })
    return () => { cancelled = true }
  }, [])

  return { clients: state.clients, clientsError: state.error, leads: LEAD_OPTIONS }
}