import type { TrendPoint } from '../lib/analytics'

interface Props {
  data: TrendPoint[]
}

const W = 400
const H = 120
const PAD = { top: 12, right: 16, bottom: 24, left: 28 }

export function TrendChart({ data }: Props) {
  if (data.length === 0 || data.every((p) => p.count === 0)) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-[--color-ink]/40">
        No activity in the last 30 days.
      </div>
    )
  }

  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const maxCount = Math.max(...data.map((p) => p.count), 1)

  const pts = data.map((p, i) => ({
    x: PAD.left + (i / (data.length - 1)) * plotW,
    y: PAD.top + plotH - (p.count / maxCount) * plotH,
    ...p,
  }))

  const linePath = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')

  const fillPath =
    linePath +
    ` L ${pts[pts.length - 1].x.toFixed(1)} ${(PAD.top + plotH).toFixed(1)}` +
    ` L ${pts[0].x.toFixed(1)} ${(PAD.top + plotH).toFixed(1)} Z`

  const labelInterval = Math.ceil(data.length / 6)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      aria-label="Items checked off over the last 30 days"
      role="img"
    >
      {/* y-axis gridlines */}
      {[0, 0.5, 1].map((frac) => {
        const y = PAD.top + plotH - frac * plotH
        return (
          <g key={frac}>
            <line
              x1={PAD.left}
              x2={PAD.left + plotW}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 4}
              y={y + 3}
              textAnchor="end"
              fontSize={8}
              fill="currentColor"
              opacity={0.4}
            >
              {Math.round(frac * maxCount)}
            </text>
          </g>
        )
      })}

      {/* fill area */}
      <path d={fillPath} fill="var(--color-accent)" opacity={0.12} />

      {/* line */}
      <path
        d={linePath}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* dots for non-zero days */}
      {pts
        .filter((p) => p.count > 0)
        .map((p) => (
          <circle key={p.date} cx={p.x} cy={p.y} r={3} fill="var(--color-accent)" />
        ))}

      {/* x-axis date labels */}
      {pts
        .filter((_, i) => i % labelInterval === 0 || i === pts.length - 1)
        .map((p) => (
          <text
            key={p.date}
            x={p.x}
            y={H - 4}
            textAnchor="middle"
            fontSize={8}
            fill="currentColor"
            opacity={0.4}
          >
            {p.date.slice(5)}
          </text>
        ))}
    </svg>
  )
}
