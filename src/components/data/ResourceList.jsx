import { useState } from 'react'
import Card from '@/components/common/Card'
import Table from '@/components/common/DataTable'
import DataToolbar from './DataToolbar'
import Pagination from './Pagination'

/**
 * Toolbar + table + pagination, wired to a useResourceList() result.
 *
 * @param {ReturnType<typeof import('@/hooks/useResourceList').default>} list
 * @param {Array} columns                      - see components/common/Table
 * @param {Array<{ key, label, options }>} [filters]  - value is read from list.params[key]
 * @param {Array<{ value, label }>} [sortOptions]
 * @param {(list) => ReactNode} [renderGrid]   - enables the list/grid toggle
 */
export default function ResourceList({
  list,
  columns,
  itemLabel = 'items',
  searchPlaceholder = 'Search…',
  filters = [],
  sortOptions,
  selectable = false,
  renderGrid,
  emptyMessage,
}) {
  const [view, setView] = useState('list')
  const { params, meta } = list

  return (
    <div className="space-y-6">
      <DataToolbar
        search={{ value: list.searchInput, onChange: list.setSearchInput, placeholder: searchPlaceholder }}
        filters={filters.map((f) => ({
          key: f.key,
          options: f.options,
          ariaLabel: f.label,
          value: params[f.key],
          onChange: (v) => list.setFilter(f.key, v),
        }))}
        sort={
          sortOptions && {
            options: sortOptions,
            sort: params.sort,
            order: params.order,
            onChange: list.setSort,
          }
        }
        view={renderGrid && { value: view, onChange: setView }}
      />

      <Card padding="p-0" className="overflow-hidden">
        {view === 'grid' && renderGrid ? (
          <div className="p-4 sm:p-5">{renderGrid(list)}</div>
        ) : (
          <Table
            variant="soft"
            columns={columns}
            rows={list.items}
            loading={list.loading}
            error={list.error}
            onRetry={list.refetch}
            emptyMessage={emptyMessage}
            selectable={selectable}
            selectedIds={list.selectedIds}
            onSelectionChange={list.setSelectedIds}
          />
        )}
        <Pagination
          page={meta.page}
          perPage={meta.perPage}
          total={meta.total}
          onPageChange={list.setPage}
          onPerPageChange={list.setPerPage}
          itemLabel={itemLabel}
        />
      </Card>
    </div>
  )
}