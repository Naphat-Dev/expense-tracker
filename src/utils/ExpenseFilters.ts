import type { Expense } from '../types/expense'
import { todayISO } from './format'

export interface ExpenseFiltersState {
  search: string
  type: 'all' | 'income' | 'expense'
  category: string
  timeRange: string
  sort: string
}

const CATEGORY_MAP: Record<string, string> = {
  food: 'อาหาร',
  travel: 'เดินทาง',
  accommodation: 'ที่พัก',
  entertainment: 'บันเทิง',
  health: 'สุขภาพ',
  salary: 'เงินเดือน',
  other: 'อื่นๆ',
}

export function matchesSearch(expense: Expense, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  return (
    expense.category.toLowerCase().includes(q) ||
    expense.note.toLowerCase().includes(q)
  )
}

function matchesTimeRange(expense: Expense, timeRange: string): boolean {
  if (timeRange === 'all') return true

  const expenseDate = new Date(`${expense.date}T00:00:00`)
  const today = new Date(`${todayISO()}T00:00:00`)

  if (timeRange === 'today') {
    return expense.date === todayISO()
  }

  if (timeRange === '7days') {
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 6)
    return expenseDate >= sevenDaysAgo && expenseDate <= today
  }

  if (timeRange === 'thismonth') {
    return (
      expenseDate.getFullYear() === today.getFullYear() &&
      expenseDate.getMonth() === today.getMonth()
    )
  }

  if (timeRange === 'thisyear') {
    return expenseDate.getFullYear() === today.getFullYear()
  }

  return true
}

function sortExpenses(expenses: Expense[], sort: string): Expense[] {
  const sorted = [...expenses]

  switch (sort) {
    case 'date-asc':
      return sorted.sort((a, b) => a.date.localeCompare(b.date))
    case 'amount-desc':
      return sorted.sort((a, b) => b.amount - a.amount)
    case 'amount-asc':
      return sorted.sort((a, b) => a.amount - b.amount)
    case 'date-desc':
    default:
      return sorted.sort((a, b) => b.date.localeCompare(a.date))
  }
}

export function filterExpenses(
  expenses: Expense[],
  filters: ExpenseFiltersState,
): Expense[] {
  const filtered = expenses.filter((expense) => {
    if (!matchesSearch(expense, filters.search)) return false
    if (filters.type !== 'all' && expense.type !== filters.type) return false

    if (filters.category !== 'all') {
      const categoryLabel = CATEGORY_MAP[filters.category]
      if (categoryLabel && expense.category !== categoryLabel) return false
    }

    if (!matchesTimeRange(expense, filters.timeRange)) return false

    return true
  })

  return sortExpenses(filtered, filters.sort)
}
