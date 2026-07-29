import { useEffect, useMemo, useState } from 'react'
import type { Expense, ExpenseDraft } from './types/expense'
import ExpenseForm from './components/ExpenseForm'
import SummaryCards from './components/SummaryCards'
import ExpenseList from './components/ExpenseList/ExpenseList'
import { toCents } from './utils/format'
import ExpenseFilters from './components/ExpenseFilters'
import { filterExpenses } from './utils/ExpenseFilters'
import type { ExpenseFiltersState } from './types/filter'
import {
  createExpense,
  deleteExpenseApi,
  fetchExpenses,
  updateExpenseApi,
} from './api/expenses'
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
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoadError(null)
        const data = await fetchExpenses()
        if (!cancelled) setExpense(data)
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : 'โหลดข้อมูลจากเซิร์ฟเวอร์ไม่สำเร็จ',
          )
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const addExpense = async (draft: ExpenseDraft) => {
    try {
      const newExpense = await createExpense(draft)
      setExpense((prev) => [...prev, newExpense])
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'บันทึกไม่สำเร็จ',
        text: err instanceof Error ? err.message : 'เกิดข้อผิดพลาด',
      })
    }
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteExpenseApi(id)
          setExpense((prev) => prev.filter((e) => e.id !== id))
        } catch (err) {
          await Swal.fire({
            icon: 'error',
            title: 'ลบไม่สำเร็จ',
            text: err instanceof Error ? err.message : 'เกิดข้อผิดพลาด',
          })
        }
      }
    })

  }

  const updateExpense = async (id: string, draft: ExpenseDraft) => {
    try {
      const updatedExpense = await updateExpenseApi(id, draft)
      setExpense((prev) =>
        prev.map((e) => (e.id === id ? updatedExpense : e)),
      )
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'แก้ไขไม่สำเร็จ',
        text: err instanceof Error ? err.message : 'เกิดข้อผิดพลาด',
      })
    }
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

      {loadError ? (
        <p className="mx-auto mb-4 max-w-5xl rounded-lg border border-clay/40 bg-white px-4 py-3 text-sm text-clay">
          {loadError} — ตรวจว่า backend รันอยู่ (port 3000) และ MongoDB เชื่อมต่อได้
        </p>
      ) : null}

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
