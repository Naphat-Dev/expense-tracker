export type ExpenseType = 'income' | 'expense'

export const CATEGORIES =
    [
        'อาหาร',
        'เดินทาง',
        'ที่พัก',
        'บันเทิง',
        'สุขภาพ',
        'เงินเดือน',
        'อื่นๆ',
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
