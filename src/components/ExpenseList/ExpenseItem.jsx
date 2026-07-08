import React from 'react';
import { formatDate, formatCurrency } from '../../utils/format';


function ExpenseItem({ expenses }) {

    const { id, type, amount, date, category, note } = expenses;

    return (
        <div className="divide-y divide-line rounded-2xl border border-line bg-white/60 px-6 py-4">
            <div className='flex justify-between items-center'>
                <div className='flex flex-col'>
                    <div className="flex items-center gap-2 text-sm font-medium text-ink">
                        {category}
                        {note && <div className="text-sm font-medium text-ink">· {note}</div>}
                    </div>
                    <div className="text-sm font-medium text-ink">{formatDate(date)}</div>
                </div>
                <div className={`text-sm font-mono font-medium text-ink text-center ${type === 'income' ? 'text-sage' : 'text-red-400' } `}
                >{type === 'income' ? '+' : '-'}{formatCurrency(amount)}</div>
            </div>

        </div>
    );
}

export default ExpenseItem;
