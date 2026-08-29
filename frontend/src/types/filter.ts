export type ExpenseType = 'all' | 'income' | 'expense'

export type TimeRange =
    | 'all'
    | 'today'
    | '7days'
    | 'thismonth'
    | 'month'
    | 'custom'

export interface ExpenseFiltersState {
    search: string
    type: ExpenseType
    category: string
    timeRange: TimeRange
    selectedMonth: string
    startDate: string
    endDate: string
    sort: string
  }
  
