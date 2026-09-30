import Avatar from './Avatar'
import { cn } from '@/utils'

/**
 * Overlapping avatars with a "+N" overflow chip.
 * @param {Array<{ id?: string, name: string, avatarUrl?: string|null }>} people
 * @param {number} [max] - avatars shown before collapsing into "+N"
 * @param {string} [chipClassName] - overrides the chip's background/text/border
 *   (default: 'bg-neutral-100 text-neutral-600')
 */
export default function AvatarStack({ people = [], max = 3, size = 28, className, chipClassName }) {
  const shown = people.slice(0, max)
  const extra = people.length - shown.length

  return (
    <div className={cn('flex items-center', className)}>
      {shown.map((p, i) => (
        <span key={p.id ?? i} title={p.name} className={cn('rounded-full ring-2 ring-white', i > 0 && '-ml-2')}>
          <Avatar name={p.name} src={p.avatarUrl} size={size} />
        </span>
      ))}
      {extra > 0 && (
        <span
          style={{ width: size, height: size }}
          className={cn(
            '-ml-2 inline-flex items-center justify-center rounded-full text-[10px] font-semibold ring-2 ring-white',
            chipClassName ?? 'bg-neutral-100 text-neutral-600'
          )}
        >
          +{extra}
        </span>
      )}
    </div>
  )
}