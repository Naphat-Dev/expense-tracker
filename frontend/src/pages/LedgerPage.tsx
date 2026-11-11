import { useEffect, useMemo, useState } from 'react'
import type { Expense, ExpenseDraft, ExpenseSummary } from '../types/expense'
import ExpenseForm from '../components/ExpenseForm'
import SummaryCards from '../components/SummaryCards'
import ExpenseList from '../components/ExpenseList/ExpenseList'
import ExpenseFilters from '../components/ExpenseFilters'
import type { ExpenseFiltersState } from '../types/filter'
import { logout } from '../api/auth'
import {
    createExpense,
    deleteExpenseApi,
    fetchExpensesByFilter,
    updateExpenseApi,
} from '../api/expenses'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { fetchProfile } from '../api/profile'
import ProfileDropdown from '../components/ProfileDropdown'
import ExpenseByCategoryChart from '../components/charts/ExpenseByCategoryChart'
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart'
import MobileNavbar from '../components/MobileNavbar'




const DEFAULT_FILTERS: ExpenseFiltersState = {
    search: '',
    type: 'all',
    category: 'all',
    timeRange: 'all',
    selectedMonth: '',
    startDate: '',
    endDate: '',
    sort: 'date-desc',
}

const CHART_FILTERS: ExpenseFiltersState = {
    search: '',
    type: 'all',
    category: 'all',
    timeRange: 'all',
    selectedMonth: '',
    startDate: '',
    endDate: '',
    sort: 'date-asc',
}

function App() {
    const [expenses, setExpense] = useState<Expense[]>([])
    const [chartExpenses, setChartExpenses] = useState<Expense[]>([])
    const [filters, setFilters] = useState(DEFAULT_FILTERS)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [isLoadingExpenses, setIsLoadingExpenses] = useState(true)
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

    const hasActiveFilters =
        filters.search.trim().length > 0 ||
        filters.type !== 'all' ||
        filters.category !== 'all' ||
        filters.timeRange !== 'all' ||
        filters.sort !== 'date-desc'

    useEffect(() => {
        let cancelled = false
        setIsLoadingExpenses(true)
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
                } finally {
                    if (!cancelled) setIsLoadingExpenses(false)
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

        logout()
        navigate('/login')
    }

    const handleMobileNavigation = (id: string) => {
        const element = document.getElementById(id)

        if (!element) return

        // ถ้าเป็น section ที่พับอยู่ ให้เปิดก่อน
        if (element instanceof HTMLDetailsElement) {
            element.open = true
        }

        // รอให้ DOM ขยายก่อนแล้วค่อย scroll
        requestAnimationFrame(() => {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        })
    }


    return (
        <div className='min-h-screen overflow-x-hidden bg-paper px-4 pb-24 pt-6 sm:px-8 sm:py-10'>
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
                <p role="alert" className="mx-auto mb-4 max-w-6xl rounded-md border border-line bg-surface px-4 py-3 text-sm text-clay">
                    {loadError} — ตรวจว่า backend รันอยู่ (port 3000) และ MongoDB เชื่อมต่อได้
                </p>
            ) : null}

            <main className="mx-auto w-full min-w-0 max-w-6xl">

                {/* ==================== MOBILE ==================== */}
                <div className="space-y-4 lg:hidden">

                    {/* Summary */}
                    <div id="summary" className="scroll-mt-4">
                        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted">
                            ภาพรวมการเงิน
                        </p>
                        <SummaryCards
                            income={summary.income}
                            expense={summary.expense}
                            balance={summary.balance}
                            isLoading={isLoadingExpenses}
                            isError={Boolean(loadError)}
                        />
                    </div>

                    {/* Add Expense - Collapsible */}
                    <details id="add" className="scroll-mt-4 rounded-card border border-line bg-surface shadow-card">
                        <summary className="flex min-h-14 cursor-pointer items-center gap-3 px-4 py-2 text-sm font-semibold text-ink">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-xl leading-none text-primary-dark">+</span>
                            <span>เพิ่มรายการ</span>
                            <span className="ml-auto hidden text-xs font-normal text-muted sm:inline">บันทึกรายรับหรือรายจ่าย</span>
                        </summary>

                        <div className="border-t border-line p-4">
                            <ExpenseForm addExpense={addExpense} />
                        </div>
                    </details>

                    {/* Filters */}
                    <div id="filters" className="scroll-mt-4">
                        <ExpenseFilters
                            filters={filters}
                            setFilters={setFilters}
                            DEFAULT_FILTERS={DEFAULT_FILTERS}
                        />
                    </div>

                    <div id="expenses" className="scroll-mt-4">
                        <ExpenseList
                            expenses={expenses}
                            deleteExpense={deleteExpense}
                            updateExpense={updateExpense}
                            isLoading={isLoadingExpenses}
                            isError={Boolean(loadError)}
                            emptyMessage={loadError ? '' : hasActiveFilters
                                ? 'ไม่พบรายการที่ตรงกับตัวกรอง ลองปรับคำค้นหาหรือช่วงเวลา'
                                : 'ยังไม่มีรายการ — เพิ่มรายการแรกของคุณ'}
                        />
                    </div>

                    {/* Charts - Collapsible */}
                    <details id="charts" className="scroll-mt-4 rounded-card border border-line bg-surface shadow-card"
                        onToggle={(e) => {
                            const details = e.currentTarget

                            if (!details.open) return

                            requestAnimationFrame(() => {
                                details.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start',
                                })
                            })
                        }}>
                        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-ink">
                            ดูสถิติและกราฟ
                        </summary>

                        <div className="space-y-4 border-t border-line">
                            <IncomeExpenseChart expenses={chartExpenses} />

                            <ExpenseByCategoryChart expenses={chartExpenses} />
                        </div>
                    </details>
                    <MobileNavbar
                        onNavigate={handleMobileNavigation}
                    />
                </div>


                {/* ==================== DESKTOP ==================== */}
                <div className="hidden space-y-6 lg:block">

                    <section aria-label="ภาพรวมการเงิน">
                        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted">
                            ภาพรวมการเงิน
                        </p>
                        <SummaryCards
                            income={summary.income}
                            expense={summary.expense}
                            balance={summary.balance}
                            isLoading={isLoadingExpenses}
                            isError={Boolean(loadError)}
                        />
                    </section>

                    <IncomeExpenseChart expenses={chartExpenses} />

                    <div className="grid gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">

                        {/* Sidebar */}
                        <aside className="min-w-0 space-y-4 lg:sticky lg:top-6 lg:self-start">

                            <ExpenseForm addExpense={addExpense} />

                            <ExpenseByCategoryChart expenses={chartExpenses} />

                        </aside>

                        {/* Main content */}
                        <section className="min-w-0 space-y-4">

                            <ExpenseFilters
                                filters={filters}
                                setFilters={setFilters}
                                DEFAULT_FILTERS={DEFAULT_FILTERS}
                            />

                            <ExpenseList
                                expenses={expenses}
                                deleteExpense={deleteExpense}
                                updateExpense={updateExpense}
                                isLoading={isLoadingExpenses}
                                isError={Boolean(loadError)}
                                emptyMessage={loadError ? '' : hasActiveFilters
                                    ? 'ไม่พบรายการที่ตรงกับตัวกรอง ลองปรับคำค้นหาหรือช่วงเวลา'
                                    : 'ยังไม่มีรายการ — เพิ่มรายการแรกของคุณ'}
                            />

                        </section>

                    </div>

                </div>

            </main>
        </div>

    )

}

export default App
