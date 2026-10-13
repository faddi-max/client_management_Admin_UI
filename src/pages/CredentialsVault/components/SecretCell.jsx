import { useState, useRef, useEffect, useCallback } from 'react'
import { Eye, EyeOff, Copy, Lock, Loader2 } from 'lucide-react'
import IconAction from '@/components/common/IconAction'
import { DEFAULT_REVEAL_SECONDS } from '@/constants/credentialConfig'
import { MASK } from './credentialsUi'

/**
 * Masked secret pill with explicit, audited reveal / copy.
 *
 * SECURITY:
 *  - the secret exists ONLY in this component's state, for a limited time, then it is dropped
 *  - it is never put in the list data, URL, localStorage or console
 *  - reveal/copy go through `onReveal` / `onCopy`, which hit the audited endpoints
 *
 * @param {(c) => Promise<{ value: string, expiresInSec?: number }>} onReveal  rejects on failure (parent toasts)
 * @param {(c) => Promise<void>} onCopy                                        rejects on failure (parent toasts)
 * @param {boolean} canReveal  false → shows a lock instead of the buttons (role check, see TODO(auth) in the page)
 */
export default function SecretCell({ credential, canReveal = true, onReveal, onCopy }) {
  const [secret, setSecret] = useState(null)
  const [busy, setBusy] = useState(null) // 'reveal' | 'copy' | null
  const timer = useRef(null)

  const hide = useCallback(() => {
    clearTimeout(timer.current)
    setSecret(null)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  const reveal = async () => {
    setBusy('reveal')
    try {
      const { value, expiresInSec } = await onReveal(credential)
      setSecret(value)
      clearTimeout(timer.current)
      timer.current = setTimeout(hide, (expiresInSec ?? DEFAULT_REVEAL_SECONDS) * 1000)
    } catch {
      // parent already showed the error toast
    } finally {
      setBusy(null)
    }
  }

  const copy = async () => {
    setBusy('copy')
    try {
      await onCopy(credential)
    } catch {
      // parent already showed the error toast
    } finally {
      setBusy(null)
    }
  }

  if (!canReveal) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
        <Lock size={13} /> Restricted
      </span>
    )
  }

  const revealed = secret !== null

  return (
    <div className="flex min-w-[220px] items-center justify-between gap-2 rounded-lg bg-indigo-50 py-1 pl-3 pr-1.5">
      <span
        className={
          revealed
            ? 'min-w-0 truncate font-mono text-xs text-neutral-800'
            : 'min-w-0 truncate font-mono text-[10px] tracking-[0.25em] text-neutral-400'
        }
      >
        {revealed ? secret : MASK}
      </span>
      <div className="flex shrink-0 items-center">
        {busy === 'reveal' ? (
          <Loader2 size={16} className="m-1.5 animate-spin text-neutral-400" aria-label="Revealing" />
        ) : (
          <IconAction
            icon={revealed ? EyeOff : Eye}
            label={revealed ? 'Hide secret' : 'Reveal secret'}
            onClick={revealed ? hide : reveal}
            disabled={busy !== null}
            className="text-neutral-400 hover:bg-white hover:text-neutral-700"
          />
        )}
        {busy === 'copy' ? (
          <Loader2 size={16} className="m-1.5 animate-spin text-neutral-400" aria-label="Copying" />
        ) : (
          <IconAction
            icon={Copy}
            label="Copy secret"
            onClick={copy}
            disabled={busy !== null}
            className="text-neutral-400 hover:bg-white hover:text-neutral-700"
          />
        )}
      </div>
    </div>
  )
}