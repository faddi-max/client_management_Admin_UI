import { ChevronRight } from 'lucide-react'

export default function StepperFunnel({ steps = [], activeStepId, onStepClick }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {steps.map((step, i) => {
        const isActive = step.id === activeStepId
        return (
          <div key={step.id} className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onStepClick?.(step)}
              className={
                isActive
                  ? 'flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 shadow-sm'
                  : 'flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 hover:bg-neutral-100'
              }
            >
              <span
                className={
                  isActive
                    ? 'flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold text-white'
                    : 'flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-neutral-500'
                }
              >
                {i + 1}
              </span>
              <span
                className={
                  isActive
                    ? 'text-xs font-bold uppercase tracking-wide text-white whitespace-nowrap'
                    : 'text-xs font-bold uppercase tracking-wide text-neutral-600 whitespace-nowrap'
                }
              >
                {step.label}
                {step.count != null && ` (${step.count})`}
              </span>
            </button>
            {i < steps.length - 1 && <ChevronRight size={16} className="text-neutral-300 shrink-0" />}
          </div>
        )
      })}
    </div>
  )
}