import React, { useState } from 'react';
import { formatDate, formatCurrencyCompact } from '../../utils/format';
import { LucideEdit, LucideTrash } from 'lucide-react';
import { CATEGORIES, CATEGORY_LABELS } from '../../types/expense';
import type { Expense, ExpenseDraft } from '../../types/expense';


type ExpenseItemProps = {
    expenses: Expense
    isEditing: boolean
    onStartEdit: () => void
    onCancelEdit: () => void
    deleteExpense: (id: string) => void
    updateExpense: (id: string, draft: ExpenseDraft) => void
}

const FIELD_CLASS =
    'min-w-0 rounded border border-line bg-white px-2 py-1 text-sm outline-none focus:border-sage';


function ExpenseItem({ expenses, isEditing, onStartEdit, onCancelEdit, deleteExpense, updateExpense }: ExpenseItemProps) {

    const { id, type, amount, date, category, note } = expenses;

    // รวมทุก field ที่แก้ไขได้ไว้ใน object เดียว
    const [draft, setDraft] = useState<ExpenseDraft>({ category, note, amount, date, type })

    const updateField = (
        fieldName: keyof ExpenseDraft, 
        value: ExpenseDraft[keyof ExpenseDraft]) => {
        setDraft((prev) => ({ ...prev, [fieldName]: value }))
    }

    const editHandler = () => {
        setDraft({ category, note, amount, date, type })
        onStartEdit();
    };

    const saveHandler = () => {
        updateExpense(id, draft)
        onCancelEdit()
    }

    const amountHandler = (
        e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value

        // ตัดเลข 0 นำหน้าออก แต่เก็บกรณี "0" เดี่ยวๆ หรือ "0.xx" ไว้
        value = value.replace(/^0+(?=\d)/, '')

        // ตรวจสอบว่า value เป็นตัวเลขหรือไม่
        if (!/^\d*\.?\d{0,2}$/.test(value)) return

        updateField('amount', value)
    }

    if (isEditing) {
        return (
            <div className="divide-y divide-line rounded-2xl border border-line bg-white/60 px-6 py-4">
                <div className='flex justify-between items-center'>
                    <div className='flex flex-col'>
                        <div className="flex items-center gap-2 text-sm font-medium text-ink">
                            <select
                                name="category"
                                id="category"
                                value={draft.category}
                                onChange={(e) => updateField('category', e.target.value)}
                                className={`${FIELD_CLASS} w-full`}>

                                {CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {CATEGORY_LABELS[category]}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={draft.note}
                                onChange={(e) => updateField('note', e.target.value)}
                                className={`${FIELD_CLASS} w-full`}
                                placeholder='โน้ต (รายละเอียด)'
                                />

                        </div>
                        <div className="text-sm font-medium text-ink/50">
                            <input
                                type="date"
                                value={draft.date}
                                onChange={(e) => updateField('date', e.target.value)}
                                className={`${FIELD_CLASS} mt-1`}/>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className={`text-sm font-mono font-medium text-center ${type === 'income' ? 'text-sage' : 'text-clay'} `}>
                            {type === 'income' ? '+' : '-'}
                            <input
                                type="text"
                                value={draft.amount}
                                onChange={amountHandler} 
                                className={`${FIELD_CLASS} w-20`}/>
                        </div>
                        <select
                            name="type"
                            id="type"
                            value={draft.type}
                            onChange={(e) => updateField('type', e.target.value)}
                            className={`${FIELD_CLASS} w-20`}>
                            <option value="expense">รายจ่าย</option>
                            <option value="income">รายรับ</option>
                        </select>
                        <button onClick={saveHandler} className="text-ink/30 transition hover:text-ink">Save</button>
                        <button onClick={onCancelEdit} className="text-ink/30 transition hover:text-ink">Cancel</button>
                    </div>
                </div>

            </div>
        );
    }

    return (
        <div className="divide-y divide-line rounded-2xl border border-line bg-white/60 px-6 py-4">
            <div className='flex justify-between items-center'>
                <div className='flex flex-col'>
                    <div className="flex items-center gap-2 text-sm font-medium text-ink">
                        {CATEGORY_LABELS[category]}
                        {note && <div className="text-sm font-medium text-ink">· {note}</div>}
                    </div>
                    <div className="text-sm font-medium text-ink/50">{formatDate(date)}</div>
                </div>
                <div className='flex items-center gap-3'>
                    <div className={`text-sm font-mono font-medium text-center ${type === 'income' ? 'text-sage' : 'text-clay'} `}>
                        {type === 'income' ? '+' : '-'}{formatCurrencyCompact(amount)}
                    </div>
                    <button onClick={editHandler} className="text-ink/30 transition hover:text-ink"><LucideEdit /></button>
                    <button onClick={() => deleteExpense(id)} className="text-ink/30 transition hover:text-clay"><LucideTrash /></button>
                </div>
            </div>

        </div>
    );
}

export default ExpenseItem;
