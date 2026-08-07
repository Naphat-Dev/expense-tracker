// src/api/http.ts
const API_BASE = import.meta.env.VITE_API_URL ?? ''
const DEFAULT_TIMEOUT_MS = 10_000
const TOKEN_KEY = 'token'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// ---------- Token storage ----------

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

// ---------- Response parsing ----------

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message =
      typeof body?.message === 'string' ? body.message : res.statusText

    // token หมดอายุ/ไม่ถูกต้อง -> เคลียร์ทิ้งกันค้าง
    if (res.status === 401) {
      clearToken()
    }

    throw new ApiError(message || `Request failed (${res.status})`, res.status)
  }

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

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const token = getToken()

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        ...(options.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    return await parseResponse<T>(res)
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timed out', 0)
    }
    if (err instanceof ApiError) {
      throw err
    }
    throw new ApiError(err instanceof Error ? err.message : 'Unknown error', 0)
  } finally {
    clearTimeout(timeoutId)
  }
}

export function jsonBody(payload: unknown): RequestInit {
  return {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }
}