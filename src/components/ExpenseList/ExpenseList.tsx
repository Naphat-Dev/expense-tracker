import ExpenseItem from './ExpenseItem';
import type { Expense, ExpenseDraft } from '../../types/expense';

type ExpenseListProps = {
    expenses: Expense[]
    deleteExpense: (id: string) => void
    updateExpense: (id: string, draft: ExpenseDraft) => void
  }

function ExpenseList({ expenses, deleteExpense, updateExpense }: ExpenseListProps) {

    const expensesList = expenses;

    if (expensesList.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink/50">
                ยังไม่มีรายการ — เพิ่มรายการแรกของคุณ
            </div>
        )
    }

    return (
        <div className='mt-5'>{expensesList.map((item) =>
            <ExpenseItem deleteExpense={deleteExpense} updateExpense={updateExpense} key={item.id} expenses={item} />)}</div>
    );
}

export default ExpenseList;
