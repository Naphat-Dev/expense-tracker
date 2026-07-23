export type ExpenseType = 
    | 'income'
    | 'expense'


export type Category =
    | 'อาหาร'
    | 'เดินทาง'
    | 'ที่พัก'
    | 'บันเทิง'
    | 'สุขภาพ'
    | 'เงินเดือน'
    | 'อื่นๆ'


export interface IExpense {
    type: ExpenseType
    amount: number
    date: string
    category: Category
    note: string
}