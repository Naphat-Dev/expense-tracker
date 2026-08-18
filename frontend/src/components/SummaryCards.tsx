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
    <div className='grid gap-4 grid-cols-1 sm:grid-cols-3'>
      {cards.map((C) => {
        const formatted = formatCurrencyCompact(C.value)
        const fullAmount = formatCurrency(C.value)

        return (
          <div key={C.label} className="min-w-0 rounded-card border border-line bg-surface p-5 shadow-card">
            <h2 className='text-xs font-medium uppercase tracking-wide text-muted'>{C.label}</h2>
            <p
              className={`mt-2 font-mono text-base md:text-xl font-semibold tabular-nums leading-tight ${C.color}`}
              title={fullAmount}
            >
              {formatted}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default SummaryCards
