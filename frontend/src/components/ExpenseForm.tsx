// @ts-nocheck
import { useState } from 'react'
import { CATEGORIES, CATEGORY_LABELS } from '../types/expense'
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
  { value: 'income', label: 'รายรับ', activeColorClass: 'border-ink bg-sage text-white' },
  { value: 'expense', label: 'รายจ่าย', activeColorClass: 'border-ink bg-clay text-white' },
]

const INACTIVE_COLOR_CLASS = 'border border-line bg-surface text-muted hover:bg-paper'

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

    setForm({ ...INITIAL_FORM, date: form.date, type: form.type })
    setErr(null)
  }

  const handleChange = (e) => {
    let value = e.target.value

    // ตัดเลข 0 นำหน้าออก แต่เก็บกรณี "0" เดี่ยวๆ หรือ "0.xx" ไว้
    value = value.replace(/^0+(?=\d)/, '')

    // ตรวจสอบว่า value เป็นตัวเลขหรือไม่
    if (!/^\d*\.?\d{0,2}$/.test(value)) return

    updateField('amount', value)

  }

  const handleClear = () => {
    setForm({ ...INITIAL_FORM })
    setErr(null)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className='space-y-4 rounded-card border border-line bg-surface p-5 shadow-card'>
        <header className='mb-4 flex flex-wrap items-start justify-between gap-3'>
          <h2 className='text-sm font-semibold text-ink'>เพิ่มรายการ</h2>
          <button onClick={handleClear} type="button" className='text-sm font-medium text-muted hover:text-ink'>ล้างฟอร์ม</button>
        </header>
        <div className='flex gap-2'>
          {EXPENSE_TYPE_OPTIONS.map((option) => {
            const isActive = form.type === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateField('type', option.value)}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition ${isActive ? option.activeColorClass : INACTIVE_COLOR_CLASS
                  }`}
              >
                {option.label}
              </button>
            )
          })}

        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-muted' htmlFor="expense-amount">จำนวนเงิน</label>
            <input
              className='w-full rounded-lg border border-line bg-paper px-2 py-1.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'
              placeholder='0.00'
              inputMode='decimal'
              type="text"
              id="expense-amount"
              min="0"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-muted' htmlFor="expense-date">วันที่</label>
            <input
              className='w-full rounded-lg border border-line bg-paper px-2 py-1.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'
              type="date"
              id="expense-date"
              value={form.date}
              onChange={(e) => updateField('date', e.target.value)}
              required
            />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium text-muted' htmlFor="expense-category">หมวดหมู่</label>
          <select
            className='w-full rounded-lg border border-line bg-paper px-2 py-1.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'
            id="expense-category"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>
            ))}
          </select>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium text-muted' htmlFor="expense-note">โน็ต(ถ้ามี)</label>
          <input
            className='w-full rounded-lg border border-line bg-paper px-2 py-1.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'
            id="expense-note"
            placeholder="เช่น ข้าวเที่ยงกับทีม"
            value={form.note}
            onChange={(e) => updateField('note', e.target.value)}
          />
        </div>

        {err && <p className='text-sm text-clay'>{err}</p>}
        <button type="submit" className='mt-2 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark'>
          บันทึกรายการ
        </button>
      </form>
    </div>
  )
}

export default ExpenseForm
