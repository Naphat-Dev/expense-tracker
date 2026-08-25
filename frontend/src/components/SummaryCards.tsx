import { formatCurrency, formatCurrencyCompact } from '../utils/format'


interface SummaryCardsProps {
  income: number
  expense: number
  balance: number
}

function SummaryCards({ income, expense, balance }: SummaryCardsProps) {

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
    <div className='grid grid-cols-3 gap-0 rounded-card border border-line bg-surface shadow-card sm:gap-4 sm:border-0 sm:bg-transparent sm:shadow-none'>
      {cards.map((card) => {
        const compactAmount = formatCurrencyCompact(card.value)
        const fullAmount = formatCurrency(card.value)

        return (
          <div key={card.label} className="min-w-0 rounded-card border border-line bg-surface p-5 shadow-card">
            <h2 className='text-xs font-medium uppercase tracking-wide text-muted'>{card.label}</h2>

            {/* Mobile */}
            <p
              className={`mt-1 font-mono text-base font-semibold leading-tight tabular-nums sm:hidden ${card.color}`}
              title={fullAmount}
            >
              {compactAmount}
            </p>

            {/* Desktop */}
            <p
              className={`mt-2 hidden font-mono text-xl font-semibold leading-tight tabular-nums sm:block ${card.color}`}
              title={fullAmount}
            >
              {card.value >= 1_000_000
                ? compactAmount
                : fullAmount}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default SummaryCards
