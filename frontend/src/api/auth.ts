// src/api/auth.ts
import { z } from 'zod'
import { apiFetch, jsonBody, setToken, clearToken } from './http'

// ---------- Schemas ----------

const AuthUserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
})

const AuthResponseSchema = z.object({
  token: z.string(),
  user: AuthUserSchema,
})

export type AuthUser = z.infer<typeof AuthUserSchema>

// ---------- Payloads ----------

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

// ---------- Public API ----------

export async function loginApi(payload: LoginPayload): Promise<AuthUser> {
  const data = await apiFetch<unknown>('/api/auth/login', {
    method: 'POST',
    ...jsonBody(payload),
  })
  const parsed = AuthResponseSchema.parse(data)
  setToken(parsed.token)
  return parsed.user
}

export async function registerApi(payload: RegisterPayload): Promise<AuthUser> {
  const data = await apiFetch<unknown>('/api/auth/register', {
    method: 'POST',
    ...jsonBody(payload),
  })
  const parsed = AuthResponseSchema.parse(data)
  setToken(parsed.token)
  return parsed.user
}

export function logout(): void {
  clearToken()
}

export { isAuthenticated } from './http'