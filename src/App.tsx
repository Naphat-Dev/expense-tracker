import { useMemo, useState } from 'react'
import type { Expense, ExpenseDraft } from './types/expense'
import ExpenseForm from './components/ExpenseForm'
import SummaryCards from './components/SummaryCards'
import ExpenseList from './components/ExpenseList/ExpenseList'
import { v4 as uuid } from 'uuid'
import { toCents } from './utils/format'
import ExpenseFilters from './components/ExpenseFilters'




import './App.css'

function App() {
  const [expenses, setExpense] = useState<Expense[]>([])

  const addExpense = (draft: ExpenseDraft) => {
    const newExpense: Expense = {
      ...draft,
      id: uuid(),
    }
    setExpense([...expenses, newExpense])
    console.log(newExpense)
  }

  const deleteExpense = (id: string) => {
    setExpense(expenses.filter((e) => e.id !== id))
  }

  const updateExpense = (id: string, draft: ExpenseDraft) => {
    const updatedExpense: Expense = {
      ...draft,
      id,
    }
    setExpense(expenses.map((e) => (e.id === id ? updatedExpense : e)))
  }

  const summary = useMemo(() => {
    let incomeCents = 0
    let expenseCents = 0

    for (const e of expenses) {
      if (e.type === 'income') incomeCents += toCents(e.amount)
      else expenseCents += toCents(e.amount)
    }

    return {
      income: incomeCents / 100,
      expense: expenseCents / 100,
      balance: (incomeCents - expenseCents) / 100,
    }
  }, [expenses])


  return (
    <div className='bg-gray-100 min-h-screen px-4 py-10 sm:px-8 '>
      <header className='mx-auto mb-8 max-w-5xl'>
        <p className="font-mono text-xs uppercase tracking-widest text-sage">Ledger</p>
        <h1 className='font-display text-3xl font-semibold text-ink'>บันทึกรายรับ-รายจ่าย</h1>
      </header>

      <main className='mx-auto max-w-5xl grid gap-6 lg:grid-cols-[360px_1fr]'>
        <div>
          <ExpenseForm addExpense={addExpense} />
        </div>

        <div>
          <SummaryCards income={summary.income} expense={summary.expense} balance={summary.balance} />
          <ExpenseFilters />
          <ExpenseList expenses={expenses} deleteExpense={deleteExpense} updateExpense={updateExpense} />
        </div>
      </main>
      
    </div>
  )

}

export default App
