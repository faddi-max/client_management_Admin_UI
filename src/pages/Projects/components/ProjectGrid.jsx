import { cn } from '@/utils'
import ProjectCard from './ProjectCard'

export default function ProjectGrid({
  list, onView, onQuickAction, canSeeFinance = true, emptyMessage = 'No projects match your filters.',
}) {
  const { items, loading, error, refetch } = list

  if (loading && items.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-red-500">Something went wrong while loading data.</p>
        <button type="button" onClick={refetch} className="mt-2 text-xs font-semibold text-primary-600 hover:underline">
          Try again
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return <div className="py-12 text-center text-sm text-neutral-400">{emptyMessage}</div>
  }

  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3', loading && 'opacity-60 transition-opacity')}>
      {items.map((p) => (
        <ProjectCard key={p.id} project={p} onView={onView} onQuickAction={onQuickAction} canSeeFinance={canSeeFinance} />
      ))}
    </div>
  )
}