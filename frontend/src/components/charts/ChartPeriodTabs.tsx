import type { ChartPeriod } from '../../utils/chartData'
import { CHART_PERIOD_OPTIONS } from '../../utils/chartData'

type ChartPeriodTabsProps = {
  value: ChartPeriod
  onChange: (period: ChartPeriod) => void
}

export default function ChartPeriodTabs({ value, onChange }: ChartPeriodTabsProps) {
  return (
    <div className="inline-flex rounded-md border border-line bg-paper p-0.5">
      {CHART_PERIOD_OPTIONS.map((option) => {
        const isActive = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded px-2.5 py-1 text-xs font-medium transition ${
              isActive ? 'bg-ink text-white' : 'text-muted hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
