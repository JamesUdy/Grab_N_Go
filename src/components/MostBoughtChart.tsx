import type { MostBoughtEntry } from '../lib/analytics'

interface Props {
  data: MostBoughtEntry[]
}

const BAR_HEIGHT = 28
const GAP = 8
const LABEL_WIDTH = 120
const BAR_MAX_WIDTH = 200
const SVG_PADDING = 8

export function MostBoughtChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-[--color-ink]/40">
        No data yet — check off some items to see your top picks.
      </div>
    )
  }

  const max = data[0].count
  const svgHeight = data.length * (BAR_HEIGHT + GAP) - GAP + SVG_PADDING * 2
  const svgWidth = LABEL_WIDTH + BAR_MAX_WIDTH + 48

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width="100%"
      aria-label="Most bought items bar chart"
      role="img"
    >
      {data.map((entry, i) => {
        const y = SVG_PADDING + i * (BAR_HEIGHT + GAP)
        const barW = max > 0 ? (entry.count / max) * BAR_MAX_WIDTH : 0

        return (
          <g key={entry.name}>
            {/* label */}
            <text
              x={LABEL_WIDTH - 8}
              y={y + BAR_HEIGHT / 2 + 4}
              textAnchor="end"
              fontSize={11}
              fill="currentColor"
              opacity={0.7}
              className="select-none"
            >
              {entry.name.length > 16 ? entry.name.slice(0, 15) + '…' : entry.name}
            </text>

            {/* track */}
            <rect
              x={LABEL_WIDTH}
              y={y}
              width={BAR_MAX_WIDTH}
              height={BAR_HEIGHT}
              rx={6}
              fill="currentColor"
              opacity={0.07}
            />

            {/* filled bar */}
            <rect
              x={LABEL_WIDTH}
              y={y}
              width={barW}
              height={BAR_HEIGHT}
              rx={6}
              fill="var(--color-accent)"
              opacity={0.85}
            />

            {/* count */}
            <text
              x={LABEL_WIDTH + barW + 6}
              y={y + BAR_HEIGHT / 2 + 4}
              fontSize={11}
              fill="currentColor"
              opacity={0.6}
              className="select-none"
            >
              {entry.count}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
