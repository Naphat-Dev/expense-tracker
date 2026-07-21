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
    { label: 'คงเหลือ', value: balance, color: balance >= 0 ? 'text-ink' : 'text-clay' },
  ] as const



  return (
    <div className='grid gap-4 grid-cols-1 sm:grid-cols-3'>
      {cards.map((C) => {
        const formatted = formatCurrencyCompact(C.value)
        const fullAmount = formatCurrency(C.value)

        return (
          <div key={C.label} className='min-w-0 rounded-2xl border border-line bg-white/60 p-5'>
            <h2 className='text-sm text-ink/70'>{C.label}</h2>
            <p
              className={`mt-1 font-mono text-base md:text-xl font-medium tabular-nums leading-tight ${C.color}`}
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
