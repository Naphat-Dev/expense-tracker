import type { Expense, Category } from '../types/expense'
import {
  CATEGORIES,
  CATEGORY_LABELS,
} from '../types/expense'

// ========================================
// Expense By Category Chart
// ========================================

export type ChartPeriod =
  | '7days'
  | 'thismonth'
  | '6months'

export const CHART_PERIOD_OPTIONS: {
  value: ChartPeriod
  label: string
}[] = [
  {
    value: '7days',
    label: '7 วัน',
  },
  {
    value: 'thismonth',
    label: 'เดือนนี้',
  },
  {
    value: '6months',
    label: '6 เดือน',
  },
]

const CATEGORY_PALETTE = [
  '#1E3A5F',
  '#374151',
  '#1F5C45',
  '#4B5563',
  '#5C4A42',
  '#6B7280',
  '#8B3A3A',
  '#A15A5A',
] as const

export type CategoryExpensePoint = {
  category: Category
  label: string
  amount: number
  fill: string
  percent: number
}

// ========================================
// Monthly Income / Expense Chart
// ========================================

export type MonthlyChartPeriod =
  | 'lastmonth'
  | '6months'
  | '1year'

export const MONTHLY_CHART_PERIOD_OPTIONS: {
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

export type MonthlyIncomeExpense = {
  month: string
  income: number
  expense: number
}

// ========================================
// Date Helpers
// ========================================

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)

  return new Date(y, m - 1, d)
}

function startOfDay(d: Date): Date {
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
  )
}

function addDays(
  d: Date,
  days: number,
): Date {
  const next = new Date(d)

  next.setDate(
    next.getDate() + days,
  )

  return next
}

function isDateInRange(
  dateIso: string,
  start: Date,
  end: Date,
): boolean {
  const date = parseLocalDate(dateIso)

  return date >= start && date < end
}

// ========================================
// Expense By Category
// ========================================

export function getChartPeriodRange(
  period: ChartPeriod,
  now = new Date(),
) {
  const today = startOfDay(now)

  switch (period) {
    case '7days': {
      const start = addDays(
        today,
        -6,
      )

      return {
        start,
        end: addDays(today, 1),
      }
    }

    case 'thismonth': {
      const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      )

      const end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1,
      )

      return {
        start,
        end,
      }
    }

    case '6months': {
      const start = new Date(
        now.getFullYear(),
        now.getMonth() - 5,
        1,
      )

      const end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1,
      )

      return {
        start,
        end,
      }
    }
  }
}

export function filterExpensesByChartPeriod(
  expenses: Expense[],
  period: ChartPeriod,
): Expense[] {
  const {
    start,
    end,
  } = getChartPeriodRange(period)

  return expenses.filter(
    (item) =>
      isDateInRange(
        item.date,
        start,
        end,
      ),
  )
}

export function getExpenseByCategoryData(
  expenses: Expense[],
): CategoryExpensePoint[] {
  const totals =
    new Map<Category, number>()

  for (const item of expenses) {
    if (item.type !== 'expense') {
      continue
    }

    totals.set(
      item.category,
      (totals.get(item.category) ?? 0) +
        item.amount,
    )
  }

  const rows = CATEGORIES
    .map((category, index) => ({
      category,
      label:
        CATEGORY_LABELS[category],
      amount:
        totals.get(category) ?? 0,
      fill:
        CATEGORY_PALETTE[
          index %
            CATEGORY_PALETTE.length
        ],
    }))
    .filter(
      (item) => item.amount > 0,
    )
    .sort(
      (a, b) =>
        b.amount - a.amount,
    )

  const total = rows.reduce(
    (sum, item) =>
      sum + item.amount,
    0,
  )

  return rows.map((item) => ({
    ...item,
    percent:
      total > 0
        ? (item.amount / total) * 100
        : 0,
  }))
}

// ========================================
// Monthly Income / Expense
// ========================================

function getMonthRange(
  period: MonthlyChartPeriod,
  now = new Date(),
) {
  const currentMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  )

  switch (period) {
    case 'lastmonth':
      return {
        start: new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
        ),
        end: currentMonth,
      }

    case '6months':
      return {
        start: new Date(
          now.getFullYear(),
          now.getMonth() - 6,
          1,
        ),
        end: currentMonth,
      }

    case '1year':
      return {
        start: new Date(
          now.getFullYear(),
          now.getMonth() - 12,
          1,
        ),
        end: currentMonth,
      }
  }
}

export function getIncomeExpenseByMonthData(
  expenses: Expense[],
  period: MonthlyChartPeriod,
): MonthlyIncomeExpense[] {
  const {
    start,
    end,
  } = getMonthRange(period)

  const result: MonthlyIncomeExpense[] =
    []

  const current = new Date(start)

  while (current < end) {
    const year =
      current.getFullYear()

    const month =
      current.getMonth()

    let income = 0
    let expense = 0

    for (const item of expenses) {
      const date =
        parseLocalDate(item.date)

      if (
        date.getFullYear() !==
          year ||
        date.getMonth() !== month
      ) {
        continue
      }

      if (item.type === 'income') {
        income += item.amount
      }

      if (item.type === 'expense') {
        expense += item.amount
      }
    }

    result.push({
      month:
        new Intl.DateTimeFormat(
          'th-TH',
          {
            month: 'short',
          },
        ).format(current),

      income,
      expense,
    })

    current.setMonth(
      current.getMonth() + 1,
    )
  }

  return result
}