import { Bell } from 'lucide-react'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import AlertRow from '@/components/common/AlertRow'

export default function AttentionCenter({ requiredCount, description, alerts = [] }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-orange-500" />
          <h2 className="text-sm font-bold text-neutral-900">Attention Center</h2>
        </div>
        <Badge variant="warning">{requiredCount} Required</Badge>
      </div>
      <p className="text-xs text-neutral-400 mb-4">{description}</p>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <AlertRow key={alert.id} {...alert} />
        ))}
      </div>
    </Card>
  )
}
