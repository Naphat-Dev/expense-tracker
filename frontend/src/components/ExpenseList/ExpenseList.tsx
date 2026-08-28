import { useEffect, useState } from 'react'
import ExpenseItem from './ExpenseItem'
import type { Expense, ExpenseDraft } from '../../types/expense'

type ExpenseListProps = {
    expenses: Expense[]
    deleteExpense: (id: string) => void
    updateExpense: (id: string, draft: ExpenseDraft) => void
}

const ITEMS_PER_PAGE = 10;

function ExpenseList({
    expenses,
    deleteExpense,
    updateExpense,
}: ExpenseListProps) {

    const [editingId, setEditingId] = useState<string | null>(null)
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const paginatedExpenses = expenses.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    // เมื่อ filter search หรือ sort รายการ ต้อง reset หน้ากลับไปเป็น 1
    useEffect(() => {
        setCurrentPage(1)
    }, [expenses])

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


    // กรณีไม่มีรายการ
    if (paginatedExpenses.length === 0) {
        return (
            <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center text-sm text-muted shadow-card">
                ยังไม่มีรายการ — เพิ่มรายการแรกของคุณ
            </div>
        )
    }

    return (
        <div className="mt-5">
            <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold text-ink">
                    รายการทั้งหมด
                </h2>

                <span className="text-sm text-muted">
                    {expenses.length} รายการ
                </span>
            </div>
            {/* Expense List */}
            <div className="flex min-w-0 flex-col gap-3">
                {paginatedExpenses.map((item) => (
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

            {/* ฟังก์ชันเปลี่ยนหน้า */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-1.5">

                    {/* Previous */}
                    <button
                        type="button"
                        onClick={() => setCurrentPage((page) => page - 1)}
                        disabled={currentPage === 1}
                        className="shrink-0 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="หน้าก่อนหน้า"
                    >
                        ←
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1

                        // แสดงหน้าแรก
                        // หน้าปัจจุบัน ± 1
                        // หน้าสุดท้าย
                        const showPage =
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1

                        // แสดง ...
                        const showLeftEllipsis =
                            currentPage > 3 && page === 2

                        const showRightEllipsis =
                            currentPage < totalPages - 2 &&
                            page === totalPages - 1

                        if (showLeftEllipsis || showRightEllipsis) {
                            return (
                                <span
                                    key={page}
                                    className="px-2 text-sm text-muted"
                                >
                                    ...
                                </span>
                            )
                        }

                        if (!showPage) {
                            return null
                        }

                        return (
                            <button
                                type="button"
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`min-w-9 shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${currentPage === page
                                    ? 'bg-ink text-surface'
                                    : 'border border-line bg-surface text-muted hover:bg-paper hover:text-ink'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    })}

                    {/* Next */}
                    <button
                        type="button"
                        onClick={() => setCurrentPage((page) => page + 1)}
                        disabled={currentPage === totalPages}
                        className="shrink-0 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="หน้าถัดไป"
                    >
                        →
                    </button>
                </div>
            )}

            {/* กลับด้านบน */}
            {showScrollTop && (
                <button
                    type="button"
                    onClick={() =>
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                        })
                    }
                    className="fixed bottom-17 left-1/2 z-50 -translate-x-1/2 rounded-full border border-line bg-surface p-3 text-ink shadow-elevated transition hover:bg-paper sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"
                    aria-label="กลับด้านบน"
                >
                    ↑
                </button>
            )}


        </div>
    )
}

export default ExpenseList