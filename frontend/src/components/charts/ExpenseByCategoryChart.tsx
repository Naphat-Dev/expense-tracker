import { useMemo } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { Expense } from '../../types/expense'
import { formatCurrency } from '../../utils/format'
import {
  type ChartPeriod,
  filterExpensesByChartPeriod,
  getExpenseByCategoryData,
} from '../../utils/chartData'
import ChartCard from './ChartCard'
import ChartPeriodTabs from './ChartPeriodTabs'

type ExpenseByCategoryChartProps = {
  expenses: Expense[]
  period: ChartPeriod
  onPeriodChange: (period: ChartPeriod) => void
}

type PieTooltipProps = {
  active?: boolean
  payload?: Array<{
    payload: { label: string; amount: number; percent: number }
  }>
}

function PieTooltip({ active, payload }: PieTooltipProps) {
  if (!active || !payload?.length) return null

  const item = payload[0]?.payload
  if (!item) return null

  return (
    <div className="rounded-md border border-line bg-surface px-3 py-2 text-xs shadow-elevated">
      <p className="font-medium text-ink">{item.label}</p>
      <p className="mt-0.5 font-mono tabular-nums text-muted">
        {formatCurrency(item.amount)} ({item.percent.toFixed(1)}%)
      </p>
    </div>
  )
}

export default function ExpenseByCategoryChart({
  expenses,
  period,
  onPeriodChange,
}: ExpenseByCategoryChartProps) {
  const scopedExpenses = useMemo(
    () => filterExpensesByChartPeriod(expenses, period).filter((item) => item.type === 'expense'),
    [expenses, period],
  )

  const data = useMemo(
    () => getExpenseByCategoryData(scopedExpenses),
    [scopedExpenses],
  )

  const totalExpense = useMemo(
    () => scopedExpenses.reduce((sum, item) => sum + item.amount, 0),
    [scopedExpenses],
  )

  return (
    <ChartCard
      title="รายจ่ายตามหมวดหมู่"
      subtitle={
        totalExpense > 0
          ? `รวม ${formatCurrency(totalExpense)} · ${scopedExpenses.length} รายการ`
          : 'สัดส่วนรายจ่ายตามช่วงเวลา'
      }
      action={<ChartPeriodTabs value={period} onChange={onPeriodChange} />}
      empty={data.length === 0}
      emptyMessage="ยังไม่มีรายจ่ายในช่วงที่เลือก"
    >
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="label"
              cx="50%"
              cy="44%"
              innerRadius={64}
              outerRadius={98}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.category} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs text-muted">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
