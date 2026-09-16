export default function Sparkline({ data = [], color = '#4f46e5', height = 40 }) {
  if (data.length < 2) return null
  const width = 160
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)
  const coords = data.map((v, i) => [i * stepX, height - ((v - min) / range) * height])
  const points = coords.map(([x, y]) => `${x},${y}`).join(' ')
  const [lastX, lastY] = coords[coords.length - 1]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="3.5" fill={color} />
    </svg>
  )
}