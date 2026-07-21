export type ExpenseType = 'all' | 'income' | 'expense'

export interface ExpenseFiltersState {
    search: string
    type: ExpenseType
    category: string
    timeRange: string
    sort: string
  }
  
