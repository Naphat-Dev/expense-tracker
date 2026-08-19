import type { ReactNode } from 'react'

type ChartCardProps = {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  empty?: boolean
  emptyMessage?: string
}

export default function ChartCard({
  title,
  subtitle,
  action,
  children,
  empty = false,
  emptyMessage = 'ยังไม่มีข้อมูลในช่วงที่เลือก',
}: ChartCardProps) {
  return (
    <section className="rounded-card border border-line bg-surface p-5 shadow-card">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-muted">{subtitle}</p> : null}
        </div>
        {action}
      </header>

      {empty ? (
        <div className="flex h-[280px] items-center justify-center rounded-md border border-dashed border-line bg-paper px-4 text-center text-sm text-muted">
          {emptyMessage}
        </div>
      ) : (
        children
      )}
    </section>
  )
}
