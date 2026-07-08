import { useState } from 'react'
import type { Expense, ExpenseDraft } from './types/expense'
import ExpenseForm from './components/ExpenseForm'
import SummaryCards from './components/SummaryCards'
import ExpenseList from './components/ExpenseList/ExpenseList'
import { v4 as uuid } from 'uuid'



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
          <SummaryCards />
          <ExpenseList expenses={expenses} />
        </div>
      </main>
    </div>
  )

}

export default App
