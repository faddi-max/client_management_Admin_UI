import { useState, useCallback, useRef } from 'react'

export default function useToast(duration = 2200) {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback(
    (message) => {
      setToast(message)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setToast(null), duration)
    },
    [duration]
  )

  return { toast, showToast }
}
