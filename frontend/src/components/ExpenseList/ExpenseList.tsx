import { useEffect, useState } from 'react'
import ExpenseItem from './ExpenseItem'
import type { Expense, ExpenseDraft } from '../../types/expense'

type ExpenseListProps = {
    expenses: Expense[]
    deleteExpense: (id: string) => void
    updateExpense: (id: string, draft: ExpenseDraft) => void
}

function ExpenseList({
    expenses,
    deleteExpense,
    updateExpense,
}: ExpenseListProps) {

    const [editingId, setEditingId] = useState<string | null>(null)
    const [showAll, setShowAll] = useState(false)
    const [showScrollTop, setShowScrollTop] = useState(false)

    // แสดงปุ่มกลับด้านบนเมื่อ scroll ลงเกิน 300px
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300)
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // แสดง 11 รายการแรก หรือแสดงทั้งหมด
    const expensesList = showAll
        ? expenses
        : expenses.slice(0, 11)

    // กรณีไม่มีรายการ
    if (expensesList.length === 0) {
        return (
            <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center text-sm text-muted shadow-card">
                ยังไม่มีรายการ — เพิ่มรายการแรกของคุณ
            </div>
        )
    }

    return (
        <div className="mt-5">

            {/* Expense List */}
            <div className="flex min-w-0 flex-col gap-3">
                {expensesList.map((item) => (
                    <ExpenseItem
                        key={item.id}
                        expenses={item}
                        isEditing={editingId === item.id}
                        onStartEdit={() => setEditingId(item.id)}
                        onCancelEdit={() => setEditingId(null)}
                        deleteExpense={deleteExpense}
                        updateExpense={updateExpense}
                    />
                ))}
            </div>

            {/* Show All / Hide */}
            {expenses.length > 11 && (
                <div className="mt-5 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setShowAll((prev) => !prev)}
                        className="rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper"
                    >
                        {showAll
                            ? 'ซ่อนรายการ'
                            : 'แสดงทั้งหมด'}
                    </button>
                </div>
            )}

            {/* Scroll To Top */}
            {showScrollTop && (
                <button
                    type="button"
                    onClick={() =>
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                        })
                    }
                    className="fixed bottom-20 sm:bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-line bg-surface p-3 text-ink shadow-elevated transition hover:bg-paper"
                    aria-label="กลับด้านบน"
                >
                    ↑
                </button>
            )}

        </div>
    )
}

export default ExpenseList