import React from 'react';
import ExpenseItem from './ExpenseItem';


function ExpenseList(props) {

    const expensesList = props.expenses;

    if (expensesList.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink/50">
                ยังไม่มีรายการ — เพิ่มรายการแรกของคุณ
            </div>
        )
    }

    return (
        <div className='mt-5'>{expensesList.map((item) =>
            <ExpenseItem deleteExpense={props.deleteExpense} updateExpense={props.updateExpense} key={item.id} expenses={item} />)}</div>
    );
}

export default ExpenseList;
