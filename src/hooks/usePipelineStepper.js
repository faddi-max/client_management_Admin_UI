import { useState, useCallback, useMemo } from 'react'

export default function usePipelineStepper(steps = [], initialStepId) {
  const [activeStepId, setActiveStepId] = useState(initialStepId ?? steps[0]?.id ?? null)

  const activeStep = useMemo(
    () => steps.find((s) => s.id === activeStepId) ?? null,
    [steps, activeStepId]
  )

  const selectStep = useCallback((step) => {
    setActiveStepId(step.id)
  }, [])

  return { activeStepId, activeStep, selectStep, setActiveStepId }
}
