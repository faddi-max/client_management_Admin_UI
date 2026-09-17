import { Waypoints } from 'lucide-react'
import Card from '@/components/common/Card'
import StepperFunnel from '@/components/common/StepperFunnel'
import usePipelineStepper from '@/hooks/usePipelineStepper'

export default function DeliveryFunnel({
  title = 'Standard Delivery & Lifecycle Funnel',
  pipelineVersion,
  steps = [],
  initialActiveStepId,
  activeStepId,
  onStepClick,
}) {
  const internal = usePipelineStepper(steps, initialActiveStepId)
  const isControlled = activeStepId !== undefined && onStepClick !== undefined
  const currentStepId = isControlled ? activeStepId : internal.activeStepId
  const handleStepClick = isControlled ? onStepClick : internal.selectStep

  return (
    <Card>
      <div className="flex items-start sm:items-center justify-between mb-4 flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Waypoints size={16} className="text-primary-600" />
          <h2 className="text-sm font-bold text-neutral-900 truncate">{title}</h2>
          {pipelineVersion && <span className="hidden sm:inline text-xs text-neutral-400 shrink-0">{pipelineVersion}</span>}
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
          Click phase to filter tasks
        </span>
      </div>
      <StepperFunnel steps={steps} activeStepId={currentStepId} onStepClick={handleStepClick} />
    </Card>
  )
}
