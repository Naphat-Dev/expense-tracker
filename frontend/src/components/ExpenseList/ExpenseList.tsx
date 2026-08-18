import { useState } from 'react';
import ExpenseItem from './ExpenseItem';
import type { Expense, ExpenseDraft } from '../../types/expense';

type ExpenseListProps = {
    expenses: Expense[]
    deleteExpense: (id: string) => void
    updateExpense: (id: string, draft: ExpenseDraft) => void
  }

function ExpenseList({ expenses, deleteExpense, updateExpense }: ExpenseListProps) {
    const [editingId, setEditingId] = useState<string | null>(null);

    const expensesList = expenses;

    if (expensesList.length === 0) {
        return (
            <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center text-sm text-muted shadow-card">
                ยังไม่มีรายการ — เพิ่มรายการแรกของคุณ
            </div>
        )
    }

    return (
        <div className='mt-5 flex min-w-0 flex-col gap-3'>{expensesList.map((item) =>
            <ExpenseItem
                key={item.id}
                expenses={item}
                isEditing={editingId === item.id}
                onStartEdit={() => setEditingId(item.id)}
                onCancelEdit={() => setEditingId(null)}
                deleteExpense={deleteExpense}
                updateExpense={updateExpense}
            />)}</div>
    );
}

export default ExpenseList;
