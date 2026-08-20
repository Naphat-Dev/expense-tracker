import { useMemo } from 'react'
import {
  Cell,
  Label,
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

  const topCategory = data[0]

  return (
    <ChartCard
      title="รายจ่ายตามหมวดหมู่"
      subtitle={
        totalExpense > 0
          ? `รวม ${formatCurrency(totalExpense)} · ${scopedExpenses.length} รายการ`
          : 'สัดส่วนรายจ่ายตามช่วงเวลา'
      }
      action={
        <ChartPeriodTabs
          value={period}
          onChange={onPeriodChange}
        />
      }
      empty={data.length === 0}
      emptyMessage="ยังไม่มีรายจ่ายในช่วงที่เลือก"
    >
      {/* Donut Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={64}
              outerRadius={98}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={entry.fill}
                />
              ))}

              <Label
                value="รายจ่ายทั้งหมด"
                position="center"
                dy={-12}
                className="fill-muted text-xs"
              />

              <Label
                value={formatCurrency(totalExpense)}
                position="center"
                dy={12}
                className="fill-ink text-sm font-semibold"
              />
            </Pie>

            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Category */}
      {topCategory && (
        <div className="mt-3 rounded-md border border-line bg-paper p-3">
          <p className="text-xs text-muted">
            ใช้จ่ายสูงสุด
          </p>

          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="font-medium text-ink">
              {topCategory.label}
            </p>

            <p className="text-sm text-muted">
              {formatCurrency(topCategory.amount)}
              {' · '}
              {topCategory.percent.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Category Summary */}
      <div className="mt-4 space-y-2 px-1">
        {data.map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.fill }}
              />

              <span className="truncate text-muted">
                {item.label}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="font-mono tabular-nums text-ink">
                {formatCurrency(item.amount)}
              </span>

              <span className="w-12 text-right text-xs text-muted">
                {item.percent.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}
