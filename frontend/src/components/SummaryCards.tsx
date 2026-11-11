import { formatCurrency, formatCurrencyCompact } from '../utils/format'


interface SummaryCardsProps {
  income: number
  expense: number
  balance: number
  isLoading?: boolean
  isError?: boolean
}

function SummaryCards({ income, expense, balance, isLoading = false, isError = false }: SummaryCardsProps) {

  const cards = [
    { label: 'รายรับ', value: income, color: 'text-sage' },
    { label: 'รายจ่าย', value: expense, color: 'text-clay' },
    {
      label: 'คงเหลือ',
      value: balance,
      color: balance >= 0 ? 'text-ink' : 'text-clay',
    },
  ] as const



  return (
    <section aria-label="สรุปการเงิน" aria-busy={isLoading} className="grid grid-cols-3 gap-2 sm:gap-4">
      {cards.map((card) => {
        const compactAmount = formatCurrencyCompact(card.value)
        const fullAmount = formatCurrency(card.value)

        return (
          <div
            key={card.label}
            className="min-w-0 rounded-card border border-line bg-surface p-3 shadow-card sm:p-5"
          >
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
              {card.label}
            </h2>

            {/* Mobile */}
            <p
              className={`mt-1 font-mono text-sm font-semibold leading-tight tabular-nums sm:hidden ${card.color}`}
              title={fullAmount}
            >
              {isLoading ? <span className="block h-5 w-24 animate-pulse rounded-full bg-line" /> : isError ? '—' : compactAmount}
            </p>

            {/* Desktop */}
            <p
              className={`mt-2 hidden font-mono text-xl font-semibold leading-tight tabular-nums sm:block ${card.color}`}
              title={fullAmount}
            >
              {isLoading ? (
                <span className="block h-6 w-32 animate-pulse rounded-full bg-line" />
              ) : isError ? '—' : card.value >= 1_000_000 ? compactAmount : fullAmount}
            </p>
          </div>
        )
      })}
    </section>
  )
}

export default SummaryCards
