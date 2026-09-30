import { useState, useMemo } from 'react'
import { Download, Plus } from 'lucide-react'
import Button from '@/components/common/Button'
import Toast from '@/components/common/Toast'
import ResourceList from '@/components/data/ResourceList'
import TabsWithCount from '@/components/data/TabsWithCount'
import useToast from '@/hooks/useToast'
import useResourceList from '@/hooks/useResourceList'
import { STAGES } from '@/constants/projectConfig'
import { createProject, fetchProjects } from '@/services/api/projectsService'
import ProjectStatCards from './components/ProjectStatCards'
import FeaturedProjectCard from './components/FeaturedProjectCard'
import AddProjectModal from './components/AddProjectModal'
import ProjectDrawer from './components/ProjectDrawer'
import ProjectGrid from './components/ProjectGrid'
import { getProjectColumns } from './components/projectColumns'
import useProjectStats from '../../hooks/useProjectStats'
import useProjectFacets from '../../hooks/useProjectFacets'
import useProjectFormOptions from '../../hooks/useProjectFormOptions'
import useFeaturedProject from '../../hooks/useFeaturedProject'
import useProjectDetail from '../../hooks/useProjectDetail'

const SORT_OPTIONS = [
  { value: 'deadline', label: 'Deadline' },
  { value: 'name', label: 'Project Name' },
  { value: 'value', label: 'Value' },
]

// Blocked projects get a light orange row tint (matches the design)
const rowClassName = (p) => (p.status === 'blocked' ? 'bg-orange-50/60 hover:!bg-orange-50' : '')

export default function Projects() {
  const { toast, showToast } = useToast()
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useProjectStats()
  const { facets, refetch: refetchFacets } = useProjectFacets()
  const { clients, clientsError, leads } = useProjectFormOptions()
  const { project: featured, loading: featuredLoading } = useFeaturedProject()
  const [addOpen, setAddOpen] = useState(false)
  const [viewProject, setViewProject] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false) // separate from viewProject so the exit animation can play
  const { detail, loading: detailLoading, error: detailError } = useProjectDetail(viewProject?.id ?? null)

  const list = useResourceList(fetchProjects, {
    perPage: 10,
    initialParams: { sort: 'deadline', order: 'asc', stage: 'all', status: 'all', client: 'all' },
  })

  // Lifecycle tabs: labels are static (shared vocabulary), counts arrive with the facets
  const tabs = useMemo(() => {
    const counts = Object.fromEntries((facets?.stages ?? []).map((s) => [s.value, s.count]))
    return [
      { value: 'all', label: 'All Lifecycle', count: facets?.total },
      ...STAGES.map((s) => ({ ...s, count: counts[s.value] })),
    ]
  }, [facets])

  const filters = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        options: [{ value: 'all', label: 'All statuses', count: facets?.total }, ...(facets?.statuses ?? [])],
      },
      {
        key: 'client',
        label: 'Client',
        options: [{ value: 'all', label: 'All accounts' }, ...(facets?.clients ?? [])],
      },
    ],
    [facets]
  )

  // Shared by the table and the grid so both behave identically
  const rowHandlers = useMemo(
    () => ({
      onView: (p) => { setViewProject(p); setDrawerOpen(true) },
      onQuickAction: (type, p) => showToast(`${type} — ${p.name} (not wired yet)`),
    }),
    [showToast]
  )

  // TODO(auth): pass canSeeFinance from the real permission check once roles are defined
  const columns = useMemo(() => getProjectColumns(rowHandlers), [rowHandlers])

  const handleAdd = async (values) => {
    try {
      await createProject(values)
      list.refetch()
      refetchStats()  // stat cards change when a project is added
      refetchFacets() // so do the tab and filter counts
      showToast(`${values.name.trim()} created`)
    } catch (err) {
      showToast('Could not create project')
      throw err // keeps the modal open
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Projects</h1>
          <p className="mt-1 max-w-xl text-sm text-neutral-500">
            Manage active project tracks, milestone burn rates, assigned team velocity, and delivery deadlines
            across all enterprise accounts.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Button variant="secondary" size="lg" icon={Download} onClick={() => showToast('Export CSV (not wired yet)')}>
            Export CSV
          </Button>
          <Button size="lg" icon={Plus} onClick={() => setAddOpen(true)}>
            New Project
          </Button>
        </div>
      </div>

      <ProjectStatCards stats={stats} loading={statsLoading} error={statsError} onRetry={refetchStats} />

      <FeaturedProjectCard
        project={featured}
        loading={featuredLoading}
        onSprintBoard={() => showToast('Sprint board (not wired yet)')}
      />

      <TabsWithCount
        tabs={tabs}
        value={list.params.stage}
        onChange={(stage) => list.setFilter('stage', stage)}
        ariaLabel="Filter by lifecycle stage"
      />

      <ResourceList
        list={list}
        columns={columns}
        itemLabel="projects"
        searchPlaceholder="Search projects, client…"
        filters={filters}
        sortOptions={SORT_OPTIONS}
        selectable
        rowClassName={rowClassName}
        emptyMessage="No projects match your filters."
        renderGrid={(l) => (
          <ProjectGrid
            list={l}
            onView={rowHandlers.onView}
            onQuickAction={rowHandlers.onQuickAction}
            emptyMessage="No projects match your filters."
          />
        )}
      />

      <AddProjectModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        clients={clients}
        clientsError={clientsError}
        leads={leads}
      />

      <ProjectDrawer
        project={viewProject}
        detail={detail}
        detailLoading={detailLoading}
        detailError={detailError}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAction={(type) => showToast(`${type} (not wired yet)`)}
      />
      <Toast message={toast} />
    </div>
  )
}