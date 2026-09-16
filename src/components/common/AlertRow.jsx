function badgeVariantClass(variant) {
  const base = 'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide'
  const map = {
    danger: `${base} bg-orange-100 text-orange-600`,
    neutral: `${base} bg-neutral-100 text-neutral-500`,
    warning: `${base} bg-amber-100 text-amber-600`,
  }
  return map[variant] || map.neutral
}

export default function AlertRow({ icon: Icon, iconColor = 'text-orange-500', title, badge, description, actions = [] }) {
  return (
    <div className="rounded-lg border border-neutral-100 bg-neutral-100 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon size={16} className={iconColor} />
          <p className="text-sm font-semibold text-neutral-900">{title}</p>
        </div>
        {badge && <span className={badgeVariantClass(badge.variant)}>{badge.label}</span>}
      </div>
      <p className="mt-1.5 text-xs text-neutral-500">{description}</p>
      {actions.length > 0 && (
        <div className="mt-3 flex items-center gap-2">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className={
                a.variant === 'primary'
                  ? 'inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition-transform hover:bg-primary-700 active:scale-[0.96] cursor-pointer'
                  : 'inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-transform hover:bg-neutral-50 active:scale-[0.96] cursor-pointer'
              }
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}