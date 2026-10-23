import { useState, useEffect } from 'react'
import { fetchDomainAssetDetail } from '@/services/api/domainsService'

/** Loads side-panel detail for an asset id (null = panel closed). */
export default function useDomainAssetDetail(assetId) {
  const [state, setState] = useState({ id: null, detail: null, error: false })

  useEffect(() => {
    if (assetId == null) return
    let cancelled = false
    fetchDomainAssetDetail(assetId)
      .then((detail) => { if (!cancelled) setState({ id: assetId, detail, error: false }) })
      .catch(() => { if (!cancelled) setState({ id: assetId, detail: null, error: true }) })
    return () => { cancelled = true }
  }, [assetId])

  const ready = state.id === assetId
  return {
    detail: ready ? state.detail : null,
    loading: assetId != null && !ready,
    error: ready && state.error,
  }
}