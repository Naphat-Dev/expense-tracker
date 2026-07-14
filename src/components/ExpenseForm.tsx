// @ts-nocheck
import { useState } from 'react'
import { CATEGORIES } from '../types/expense'
import { todayISO } from '../utils/format'

const INITIAL_FORM = {
  type: 'expense',
  amount: '',
  date: todayISO(),
  category: CATEGORIES[0],
  note: '',
}
// ข้อมูลของปุ่มเลือกประเภท
const EXPENSE_TYPE_OPTIONS = [
  { value: 'income', label: 'รายรับ', activeColorClass: 'bg-sage text-white' },
  { value: 'expense', label: 'รายจ่าย', activeColorClass: 'bg-clay text-white' },
]

const INACTIVE_COLOR_CLASS = 'bg-line/60 text-ink/70 hover:bg-line'

function ExpenseForm(props) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [err, setErr] = useState(null)

  const updateField = (fieldName, value) => {
    setForm((prevForm) => ({ ...prevForm, [fieldName]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const amount = Number(form.amount)
    if (!form.amount || isNaN(amount) || amount <= 0) {
      setErr('ใส่จำนวนเงินที่มากกว่า 0')
      return
    }

    if (!form.date) {
      setErr('กรุณาเลือกวันที่')
      return
    }

    const newdata = ({
      type: form.type,
      amount: amount,
      date: form.date,
      category: form.category,
      note: form.note.trim(),
    })
    // console.log(form)
    props.addExpense(newdata);

    setForm({ date: form.date, ...INITIAL_FORM })
    setErr(null)
  }

  const handleChange = (e) => {
    let value = e.target.value

    // ตัดเลข 0 นำหน้าออก แต่เก็บกรณี "0" เดี่ยวๆ หรือ "0.xx" ไว้
    value = value.replace(/^0+(?=\d)/, '')

    updateField('amount', value)

  }

  return (
    <div>
      <form onSubmit={handleSubmit} className='space-y-4 rounded-2xl border border-line bg-white/60 p-5'>
        <div className='flex gap-2'>
          {EXPENSE_TYPE_OPTIONS.map((option) => {
            const isActive = form.type === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateField('type', option.value)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${isActive ? option.activeColorClass : INACTIVE_COLOR_CLASS
                  }`}
              >
                {option.label}
              </button>
            )
          })}

        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-ink/70' htmlFor="expense-amount">จำนวนเงิน</label>
            <input
              className='w-full rounded-lg border border-line px-2 py-1 outline-none focus:border-sage'
              placeholder='0.00'
              inputMode='decimal'
              type="number"
              id="expense-amount"
              min="0"
              step="0.01"
              required
              value={form.amount}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-ink/70' htmlFor="expense-date">วันที่</label>
            <input
              className='w-full rounded-lg border border-line px-2 py-1 outline-none focus:border-sage'
              type="date"
              id="expense-date"
              value={form.date}
              onChange={(e) => updateField('date', e.target.value)}
              required
            />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-sm text-ink/70' htmlFor="expense-category">หมวดหมู่</label>
          <select
            className='w-full rounded-lg border border-line px-2 py-1 outline-none focus:border-sage'
            id="expense-category"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-sm text-ink/70' htmlFor="expense-note">โน็ต(ถ้ามี)</label>
          <input
            className='w-full rounded-lg border border-line px-2 py-1 outline-none focus:border-sage'
            id="expense-note"
            placeholder="เช่น ข้าวเที่ยงกับทีม"
            value={form.note}
            onChange={(e) => updateField('note', e.target.value)}
          />
        </div>

        {err && <p className='text-red-500'>{err}</p>}
        <button type="submit" className='w-full rounded-lg px-4 py-2 bg-black hover:bg-black/90 text-white mt-2'>
          บันทึกรายการ
        </button>
      </form>
    </div>
  )
}

export default ExpenseForm
