import { z } from 'zod'
import { CATEGORIES, type Expense, type ExpenseDraft, type ExpenseSummary } from '../types/expense'
import type { ExpenseFiltersState } from '../types/filter'
import { apiFetch, jsonBody } from './http'



// ---------- Runtime validation (zod) ----------
// npm install zod

const ExpenseApiDocSchema = z.object({
  _id: z.string(),
  type: z.enum(['income', 'expense']),
  amount: z.number(),
  date: z.string(),
  category: z.enum(CATEGORIES),
  note: z.string().optional(),
})

const SummarySchema = z.object({
  income: z.number(),
  expense: z.number(),
  balance: z.number(),
})

// ---------- Mapper ----------

function toExpense(raw: unknown): Expense {
  const doc = ExpenseApiDocSchema.parse(raw)

  if (!doc.date) {
    throw new Error(`Missing date for expense ${doc._id}`)
  }

  const date = doc.date.includes('T') ? doc.date.slice(0, 10) : doc.date

  return {
    id: doc._id,
    type: doc.type,
    amount: doc.amount,
    date,
    category: doc.category,
    note: doc.note ?? '',
  }
}


// ---------- Public API ----------





/** ดึงรายการทั้งหมด */
export async function fetchExpenses(): Promise<Expense[]> {
  const data = await apiFetch<unknown[]>('/api/expenses')
  return data.map(toExpense)
}

/** สร้างรายการใหม่ */
export async function createExpense(draft: ExpenseDraft): Promise<Expense> {
  const data = await apiFetch<unknown>('/api/expenses', {
    method: 'POST',
    ...jsonBody(draft),
  })
  return toExpense(data)
}

/** แก้ไขรายการ */
export async function updateExpenseApi(
  id: string,
  draft: ExpenseDraft,
): Promise<Expense> {
  const data = await apiFetch<unknown>(`/api/expenses/${id}`, {
    method: 'PUT',
    ...jsonBody({ ...draft, amount: Number(draft.amount) }),
  })
  return toExpense(data)
}

/** สรุปรายรับ-รายจ่ายทั้งหมด */
export async function fetchExpenseSummary(): Promise<ExpenseSummary> {
  const data = await apiFetch<unknown>('/api/expenses/summary')
  return SummarySchema.parse(data)
}

/** ดึงรายการตามเงื่อนไข */
export async function fetchExpensesByFilter(
  filters: ExpenseFiltersState,
): Promise<Expense[]> {
  const params = new URLSearchParams(
    Object.entries(filters).reduce((acc, [key, value]) => {
      acc[key] = String(value)
      return acc
    }, {} as Record<string, string>),
  )
  const data = await apiFetch<unknown[]>(`/api/expenses/filter?${params}`)
  return data.map(toExpense)
}

/** ลบรายการ */
export async function deleteExpenseApi(id: string): Promise<void> {
  await apiFetch<void>(`/api/expenses/${id}`, { method: 'DELETE' })
}