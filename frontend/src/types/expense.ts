export type ExpenseType = 'income' | 'expense'

export const CATEGORIES =
    [
        'food', 'travel', 'accommodation', 'entertainment', 'health', 'salary', 'other'
    ] as const

export type Category = (typeof CATEGORIES)[number]

export interface Expense {
    id: string
    type: ExpenseType
    amount: number
    date: string
    category: Category
    note: string
}

export type ExpenseDraft = Omit<Expense, 'id'>

export interface ExpenseSummary {
    income: number
    expense: number
    balance: number
}

export const CATEGORY_LABELS: Record<Category, string> = {
    food: 'อาหาร',
    travel: 'เดินทาง',
    accommodation: 'ที่พัก',
    entertainment: 'บันเทิง',
    health: 'สุขภาพ',
    salary: 'เงินเดือน',
    other: 'อื่นๆ',
}
