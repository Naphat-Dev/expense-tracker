import { apiFetch } from './http'
import type { ChangePasswordPayload, ProfileUser } from '../types/profile'

export function fetchProfile(): Promise<ProfileUser> {
    return apiFetch<ProfileUser>('/api/profile')
}

export function updateProfileName(name: string): Promise<ProfileUser> {
    return apiFetch<ProfileUser>('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    })
}

export function changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    return apiFetch<{ message: string }>('/api/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
}