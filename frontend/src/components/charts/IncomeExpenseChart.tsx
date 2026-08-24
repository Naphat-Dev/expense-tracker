import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { useState } from 'react'

import type { Expense } from '../../types/expense'

import { formatCurrency } from '../../utils/format'
import {
  getIncomeExpenseByMonthData,
  type MonthlyChartPeriod,
} from '../../utils/chartData'

type IncomeExpenseChartProps = {
  expenses: Expense[]
}

const PERIOD_OPTIONS: {
  value: MonthlyChartPeriod
  label: string
}[] = [
  {
    value: 'lastmonth',
    label: 'เดือนที่แล้ว',
  },
  {
    value: '6months',
    label: '6 เดือน',
  },
  {
    value: '1year',
    label: '1 ปี',
  },
]

export default function IncomeExpenseChart({
  expenses,
}: IncomeExpenseChartProps) {
  const [period, setPeriod] =
    useState<MonthlyChartPeriod>('6months')

  const data = getIncomeExpenseByMonthData(
    expenses,
    period
  )

  return (
    <section className="rounded-2xl border border-line bg-paper p-6 font-body">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">
            รายรับและรายจ่าย
          </h2>

          <p className="mt-1 text-sm text-muted">
            เปรียบเทียบรายรับและรายจ่ายในแต่ละเดือน
          </p>
        </div>

        <div className="flex w-full rounded-lg border border-line bg-surface p-1 sm:w-auto">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPeriod(option.value)}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm transition sm:flex-none ${
                period === option.value
                  ? 'bg-ink text-white'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke="currentColor"
              strokeDasharray="3 3"
              vertical={false}
              className="text-line"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: '#6B7280',
                fontFamily: 'Noto Sans Thai',
                fontSize: 12,
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: '#6B7280',
                fontFamily: 'Noto Sans Thai',
                fontSize: 12,
              }}
              tickFormatter={(value) =>
                formatCurrency(value)
              }
            />

            <Tooltip
              contentStyle={{
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                fontFamily: 'Noto Sans Thai',
                fontSize: '13px',
              }}
              formatter={(value, name) => [
                formatCurrency(Number(value)),
                name === 'income'
                  ? 'รายรับ'
                  : 'รายจ่าย',
              ]}
            />

            <Legend
              formatter={(value) =>
                value === 'income'
                  ? 'รายรับ'
                  : 'รายจ่าย'
              }
            />

            <Bar
              dataKey="income"
              name="income"
              fill="#1F5C45"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="expense"
              name="expense"
              fill="#8B3A3A"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}