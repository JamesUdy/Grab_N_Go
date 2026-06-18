import { useMemo } from 'react'
import { TopBar } from '../components/TopBar'
import { MostBoughtChart } from '../components/MostBoughtChart'
import { TrendChart } from '../components/TrendChart'
import { useLists } from '../hooks/useLists'
import { useAnalytics } from '../hooks/useAnalytics'

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-2xl border border-[--color-border] bg-[--color-surface]">
      <span className="text-2xl font-black text-[--color-accent]">{value}</span>
      <span className="text-xs text-[--color-ink]/50 uppercase tracking-wider">{label}</span>
    </div>
  )
}

export default function AnalyticsPage() {
  const { lists, loading: listsLoading } = useLists()
  const listIds = useMemo(() => lists.map((l) => l.id), [lists])
  const { mostBought, categoryBreakdown, trend, totalChecked, loading } = useAnalytics(listIds)

  const isLoading = listsLoading || loading

  return (
    <div className="min-h-screen bg-[--color-bg]">
      <TopBar title="Analytics" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <span className="w-8 h-8 rounded-full border-2 border-[--color-accent] border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            {/* summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard label="Items checked off" value={totalChecked} />
              <StatCard label="Lists" value={lists.length} />
              <StatCard
                label="Top category"
                value={categoryBreakdown[0]?.category ?? '—'}
              />
            </div>

            {/* most bought */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[--color-ink]/50">
                Most bought
              </h2>
              <div className="p-4 rounded-2xl border border-[--color-border] bg-[--color-surface] text-[--color-ink]">
                <MostBoughtChart data={mostBought} />
              </div>
            </section>

            {/* activity over time */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[--color-ink]/50">
                Activity — last 30 days
              </h2>
              <div className="p-4 rounded-2xl border border-[--color-border] bg-[--color-surface] text-[--color-ink]">
                <TrendChart data={trend} />
              </div>
            </section>

            {/* category breakdown */}
            {categoryBreakdown.length > 0 && (
              <section className="flex flex-col gap-3">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[--color-ink]/50">
                  By category
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categoryBreakdown.map(({ category, count }) => (
                    <div
                      key={category}
                      className="flex items-center justify-between px-3 py-2 rounded-xl border border-[--color-border] bg-[--color-surface] text-sm"
                    >
                      <span className="text-[--color-ink]/70">{category}</span>
                      <span className="font-bold text-[--color-accent]">{count}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}
