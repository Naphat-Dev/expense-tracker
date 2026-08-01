// import type { Expense } from '../types/expense'
// import { todayISO } from './format'
// import type { ExpenseFiltersState } from '../types/filter'

// const CATEGORY_MAP: Record<string, string> = {
//   food: 'อาหาร',
//   travel: 'เดินทาง',
//   accommodation: 'ที่พัก',
//   entertainment: 'บันเทิง',
//   health: 'สุขภาพ',
//   salary: 'เงินเดือน',
//   other: 'อื่นๆ',
// }

// export function matchesSearch(expense: Expense, query: string): boolean {
//   const q = query.trim().toLowerCase()
//   if (!q) return true

//   return (
//     expense.category.toLowerCase().includes(q) ||
//     expense.note.toLowerCase().includes(q)
//   )
// }

// function matchesTimeRange(expense: Expense, timeRange: string): boolean {
//   if (timeRange === 'all') return true

//   const today = todayISO()

//   if (timeRange === 'today') {
//     return expense.date === today
//   }

//   if (timeRange === '7days') {
//     const start = new Date()
//     start.setDate(start.getDate() - 6)
//     const startISO = todayISO(start)
//     return expense.date >= startISO && expense.date <= today
//   }

//   if (timeRange === 'thismonth') {
//     const [y, m] = today.split('-')
//     return expense.date.startsWith(`${y}-${m}`)
//   }

//   if (timeRange === 'thisyear') {
//     return expense.date.startsWith(today.slice(0, 4))
//   }

//   return true
// }

// function sortExpenses(expenses: Expense[], sort: string): Expense[] {
//   const sorted = [...expenses]

//   switch (sort) {
//     case 'date-desc':
//       return sorted.sort((a, b) => b.date.localeCompare(a.date))
//     case 'amount-desc':
//       return sorted.sort((a, b) => b.amount - a.amount)
//     case 'amount-asc':
//       return sorted.sort((a, b) => a.amount - b.amount)
//     case 'date-asc':
//     default:
//       return sorted.sort((a, b) => a.date.localeCompare(b.date))
//   }
// }

// export function filterExpenses(
//   expenses: Expense[],
//   filters: ExpenseFiltersState,
// ): Expense[] {
//   const filtered = expenses.filter((expense) => {
//     if (!matchesSearch(expense, filters.search)) return false
//     if (filters.type !== 'all' && expense.type !== filters.type) return false

//     if (filters.category !== 'all') {
//       const categoryLabel = CATEGORY_MAP[filters.category]
//       if (categoryLabel && expense.category !== categoryLabel) return false
//     }

//     if (!matchesTimeRange(expense, filters.timeRange)) return false

//     return true
//   })

//   return sortExpenses(filtered, filters.sort)
// }
