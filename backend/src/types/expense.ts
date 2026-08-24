export type ExpenseType = 
    | 'income'
    | 'expense'


export type Category =
    | 'food'
    | 'travel'
    | 'accommodation'
    | 'entertainment'
    | 'health'
    | 'shopping'
    | 'salary'
    | 'other'



export interface IExpense {
    type: ExpenseType
    amount: number
    date: string
    category: Category
    note: string
}

// mapping สำหรับแสดงผลเป็นภาษาไทย — ใช้ทั้ง backend (ถ้าต้อง render) และ frontend
export const CATEGORY_LABELS: Record<Category, string> = {
    food: 'อาหาร',
    travel: 'เดินทาง',
    accommodation: 'ที่พัก',
    entertainment: 'บันเทิง',
    health: 'สุขภาพ',
    shopping: 'ช้อปปิ้ง',
    salary: 'เงินเดือน',
    other: 'อื่นๆ',
}

