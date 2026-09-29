import { cn, getInitials } from '@/utils'

export default function Avatar({ name = '', src, size = 26, className }) {
  const style = { width: size, height: size }
  if (src) {
    return <img src={src} alt={name} style={style} className={cn('shrink-0 rounded-full object-cover', className)} />
  }
  return (
    <span
      aria-hidden="true"
      style={{ ...style, fontSize: Math.max(9, Math.round(size * 0.38)) }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-primary-700',
        className
      )}
    >
      {getInitials(name)}
    </span>
  )
}