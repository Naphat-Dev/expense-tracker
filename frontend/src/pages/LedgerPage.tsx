import { useEffect, useMemo, useState } from 'react'
import type { Expense, ExpenseDraft, ExpenseSummary } from '../types/expense'
import ExpenseForm from '../components/ExpenseForm'
import SummaryCards from '../components/SummaryCards'
import ExpenseList from '../components/ExpenseList/ExpenseList'
import ExpenseFilters from '../components/ExpenseFilters'
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
import { fetchProfile } from '../api/profile'
import ProfileDropdown from '../components/ProfileDropdown'
import ExpenseByCategoryChart from '../components/charts/ExpenseByCategoryChart'
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart'




const DEFAULT_FILTERS: ExpenseFiltersState = {
    search: '',
    type: 'all',
    category: 'all',
    timeRange: 'all',
    sort: 'date-desc',
}

const CHART_FILTERS: ExpenseFiltersState = {
    search: '',
    type: 'all',
    category: 'all',
    timeRange: 'all',
    sort: 'date-asc',
}

function App() {
    const [expenses, setExpense] = useState<Expense[]>([])
    const [chartExpenses, setChartExpenses] = useState<Expense[]>([])
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

    useEffect(() => {
        let cancelled = false
            ; (async () => {
                try {
                    const data = await fetchExpensesByFilter(CHART_FILTERS)
                    if (!cancelled) setChartExpenses(data)
                } catch {
                    if (!cancelled) setChartExpenses([])
                }
            })()
        return () => {
            cancelled = true
        }
    }, [])

    const refreshChartExpenses = async () => {
        const data = await fetchExpensesByFilter(CHART_FILTERS)
        setChartExpenses(data)
    }

    const addExpense = async (draft: ExpenseDraft) => {
        try {
            await createExpense(draft)
            const data = await fetchExpensesByFilter(filters)
            setExpense(data)
            await refreshChartExpenses()

            Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ',
                showConfirmButton: false,
                timer: 1500,
                position: 'top',
                toast: true,
            })
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
                    await refreshChartExpenses()

                    Swal.fire({
                        icon: 'success',
                        title: 'ลบสำเร็จ',
                        showConfirmButton: false,
                        timer: 1500,
                        position: 'top',
                        toast: true,
                    })
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
            await refreshChartExpenses()

            Swal.fire({
                icon: 'success',
                title: 'แก้ไขสำเร็จ',
                showConfirmButton: false,
                timer: 1500,
                position: 'top',
                toast: true,
            })
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
        <div className='min-h-screen overflow-x-hidden bg-paper px-4 py-10 sm:px-8'>
            <header className='mx-auto mb-8 flex max-w-6xl items-center justify-between border-b border-line pb-6'>
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-[10px] font-bold text-paper">
                            ET
                        </div>

                        <span className="text-sm font-bold tracking-tight text-ink">
                            Expense Tracker
                        </span>
                    </div>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
                        บันทึกรายรับ-รายจ่าย
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <ProfileDropdown name={userName} email={userEmail} onLogout={handleLogout} />
                </div>
            </header>

            {loadError ? (
                <p className="mx-auto mb-4 max-w-6xl rounded-md border border-line bg-surface px-4 py-3 text-sm text-clay">
                    {loadError} — ตรวจว่า backend รันอยู่ (port 3000) และ MongoDB เชื่อมต่อได้
                </p>
            ) : null}

            <main className='mx-auto w-full min-w-0 max-w-6xl space-y-6'>
                <IncomeExpenseChart expenses={chartExpenses} />
                <SummaryCards income={summary.income} expense={summary.expense} balance={summary.balance} />

                <div className="grid gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">
                    <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start space-y-4">
                        <ExpenseForm addExpense={addExpense} />
                        <ExpenseByCategoryChart expenses={chartExpenses} />
                    </aside>

                    <section className="min-w-0 space-y-4">
                        <ExpenseFilters filters={filters} setFilters={setFilters} DEFAULT_FILTERS={DEFAULT_FILTERS} />
                        <ExpenseList expenses={expenses} deleteExpense={deleteExpense} updateExpense={updateExpense} />
                    </section>

                </div>
            </main>

        </div>
    )

}

export default App
