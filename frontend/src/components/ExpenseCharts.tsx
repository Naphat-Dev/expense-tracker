import { useState } from 'react'
import type { Expense } from '../types/expense'
import type { ChartPeriod } from '../utils/chartData'
import ExpenseByCategoryChart from './charts/ExpenseByCategoryChart'

type ExpenseChartsProps = {
  expenses: Expense[]
}

export default function ExpenseCharts({ expenses }: ExpenseChartsProps) {
  const [period, setPeriod] = useState<ChartPeriod>('7days')

  return (
    <ExpenseByCategoryChart
      expenses={expenses}
      period={period}
      onPeriodChange={setPeriod}
    />
  )
}
