export default function ProgressBar({ segments = [] }) {
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
        {segments.map((s) => (
          <div key={s.label} style={{ width: `${s.percent}%`, backgroundColor: s.color }} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-xs">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="font-semibold text-neutral-800">{s.label}:</span>
            <span className="font-medium text-neutral-500">
              ${s.value.toLocaleString()} ({s.percent}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}