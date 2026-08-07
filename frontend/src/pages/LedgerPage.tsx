import { useEffect, useMemo, useState } from 'react'
import type { Expense, ExpenseDraft, ExpenseSummary } from '../types/expense'
import ExpenseForm from '../components/ExpenseForm'
import SummaryCards from '../components/SummaryCards.tsx'
import ExpenseList from '../components/ExpenseList/ExpenseList.tsx'
import ExpenseFilters from '../components/ExpenseFilters.tsx'
import type { ExpenseFiltersState } from '../types/filter'
import {
    createExpense,
    deleteExpenseApi,
    fetchExpensesByFilter,
    updateExpenseApi,
} from '../api/expenses'
import '../App.css'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { fetchProfile } from '../api/profile.ts'
import ProfileDropdown from '../components/ProfileDropdown.tsx'


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
    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const navigate = useNavigate()


    useEffect(() => {
        let cancelled = false
            ; (async () => {
                try {
                    const profile = await fetchProfile()
                    if (!cancelled) setUserName(profile.name)
                    if (!cancelled) setUserEmail(profile.email)
                } catch {
                    // เงียบไว้ ไม่ให้กระทบหน้า ledger หลัก ถ้าโหลด profile ไม่สำเร็จ
                }
            })()
        return () => {
            cancelled = true
        }
    }, [])

    const summary = useMemo<ExpenseSummary>(() => {
        const income = expenses
            .filter((e) => e.type === 'income')
            .reduce((sum, e) => sum + e.amount, 0)
        const expense = expenses
            .filter((e) => e.type === 'expense')
            .reduce((sum, e) => sum + e.amount, 0)
        return { income, expense, balance: income - expense }
    }, [expenses])

    useEffect(() => {
        console.log(filters)
        let cancelled = false
            ; (async () => {
                try {
                    setLoadError(null)
                    const data = await fetchExpensesByFilter(filters)
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
    }, [filters])

    const addExpense = async (draft: ExpenseDraft) => {
        try {
            await createExpense(draft)
            const data = await fetchExpensesByFilter(filters)
            setExpense(data)
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
                    const data = await fetchExpensesByFilter(filters)
                    setExpense(data)
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
            await updateExpenseApi(id, draft)
            const data = await fetchExpensesByFilter(filters)
            setExpense(data)
        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'แก้ไขไม่สำเร็จ',
                text: err instanceof Error ? err.message : 'เกิดข้อผิดพลาด',
            })
        }
    }

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'ออกจากระบบ?',
            text: 'คุณต้องการออกจากระบบใช่หรือไม่',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ออกจากระบบ',
            cancelButtonText: 'ยกเลิก',
        })

        if (!result.isConfirmed) return

        localStorage.removeItem('token')
        navigate('/login')
    }


    return (
        <div className='min-h-screen overflow-x-hidden bg-gray-100 px-4 py-10 sm:px-8'>
            <header className='mx-auto mb-8 flex max-w-5xl items-center justify-between'>
                <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-sage">Ledger</p>
                    <h1 className='font-display text-3xl font-semibold text-ink'>
                        บันทึกรายรับ-รายจ่าย
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <ProfileDropdown name={userName} email={userEmail} onLogout={handleLogout} />
                </div>
            </header>

            {loadError ? (
                <p className="mx-auto mb-4 max-w-5xl rounded-lg border border-clay/40 bg-white px-4 py-3 text-sm text-clay">
                    {loadError} — ตรวจว่า backend รันอยู่ (port 3000) และ MongoDB เชื่อมต่อได้
                </p>
            ) : null}

            <main className='mx-auto grid w-full min-w-0 max-w-5xl gap-6 lg:grid-cols-[360px_1fr]'>
                <div className="min-w-0">
                    <ExpenseForm addExpense={addExpense} />
                </div>

                <div className="min-w-0">
                    <SummaryCards income={summary.income} expense={summary.expense} balance={summary.balance} />
                    <ExpenseFilters filters={filters} setFilters={setFilters} DEFAULT_FILTERS={DEFAULT_FILTERS} />
                    <ExpenseList expenses={expenses} deleteExpense={deleteExpense} updateExpense={updateExpense} />
                </div>
            </main>

        </div>
    )

}

export default App
