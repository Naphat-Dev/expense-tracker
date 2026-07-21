import { useMemo, useState } from 'react'
import type { Expense, ExpenseDraft } from './types/expense'
import ExpenseForm from './components/ExpenseForm'
import SummaryCards from './components/SummaryCards'
import ExpenseList from './components/ExpenseList/ExpenseList'
import { v4 as uuid } from 'uuid'
import { toCents } from './utils/format'
import ExpenseFilters from './components/ExpenseFilters'
import { filterExpenses } from './utils/ExpenseFilters'
import type { ExpenseFiltersState } from './types/filter'
import './App.css'
import Swal from 'sweetalert2'


const DEFAULT_FILTERS: ExpenseFiltersState = {
  search: '',
  type: 'all',
  category: 'all',
  timeRange: 'all',
  sort: 'date-desc',
}

function App() {
  const [expenses, setExpense] = useState<Expense[]>([])
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const addExpense = (draft: ExpenseDraft) => {
    const newExpense: Expense = {
      ...draft,
      id: uuid(),
    }
    setExpense([...expenses, newExpense])
    console.log(newExpense)
  }

  const deleteExpense = (id: string) => {
    Swal.fire({
      title: 'คุณต้องการลบรายการนี้ใช่หรือไม่?',
      text: "คุณไม่สามารถกู้คืนได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        setExpense(expenses.filter((e) => e.id !== id))
      }
    })

  }

  const updateExpense = (id: string, draft: ExpenseDraft) => {
    const updatedExpense: Expense = {
      ...draft,
      id,
    }
    setExpense(expenses.map((e) => (e.id === id ? updatedExpense : e)))
  }

  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenses, filters)
  }, [expenses, filters])

  const summary = useMemo(() => {
    let incomeCents = 0
    let expenseCents = 0

    for (const e of filteredExpenses) {
      if (e.type === 'income') incomeCents += toCents(e.amount)
      else expenseCents += toCents(e.amount)
    }

    return {
      income: incomeCents / 100,
      expense: expenseCents / 100,
      balance: (incomeCents - expenseCents) / 100,
    }
  }, [filteredExpenses])


  return (
    <div className='bg-gray-100 min-h-screen px-4 py-10 sm:px-8 '>
      <header className='mx-auto mb-8 max-w-5xl'>
        <p className="font-mono text-xs uppercase tracking-widest text-sage">Ledger</p>
        <h1 className='font-display text-3xl font-semibold text-ink'>บันทึกรายรับ-รายจ่าย</h1>
      </header>

      <main className='mx-auto max-w-5xl w-full grid gap-6 lg:grid-cols-[360px_1fr]'>
        <div>
          <ExpenseForm addExpense={addExpense} />
        </div>

        <div>
          <SummaryCards income={summary.income} expense={summary.expense} balance={summary.balance} />
          <ExpenseFilters filters={filters} setFilters={setFilters} DEFAULT_FILTERS={DEFAULT_FILTERS} />
          <ExpenseList expenses={filteredExpenses} deleteExpense={deleteExpense} updateExpense={updateExpense} />
        </div>
      </main>

    </div>
  )

}

export default App
