import { useLocation } from 'react-router-dom'
import { BREADCRUMB_MAP, DEFAULT_CRUMBS } from '@/constants/breadcrumbConfig'

export function useBreadcrumb() {
  const { pathname } = useLocation()
  const crumbs = BREADCRUMB_MAP[pathname] ?? DEFAULT_CRUMBS
  return { crumbs }
}
