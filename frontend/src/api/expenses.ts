import { z } from 'zod'
import { CATEGORIES, type Expense, type ExpenseDraft, type ExpenseSummary } from '../types/expense'
import type { ExpenseFiltersState } from '../types/filter'

const API_BASE = import.meta.env.VITE_API_URL ?? ''
const DEFAULT_TIMEOUT_MS = 10_000

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

// ---------- Error handling ----------

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message =
      typeof body?.message === 'string' ? body.message : res.statusText
    throw new ApiError(message || `Request failed (${res.status})`, res.status)
  }

  // 204 No Content หรือ body ว่าง -> ไม่ต้อง parse
  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

// ---------- Core fetch wrapper ----------

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      cache: 'no-store',
      signal: controller.signal,
    })
    return await parseResponse<T>(res)
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timed out', 0)
    }
    if (err instanceof ApiError) {
      throw err
    }
    throw new ApiError(
      err instanceof Error ? err.message : 'Unknown error',
      0,
    )
  } finally {
    clearTimeout(timeoutId)
  }
}

function jsonBody(payload: unknown): RequestInit {
  return {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
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
    ...jsonBody(draft),
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