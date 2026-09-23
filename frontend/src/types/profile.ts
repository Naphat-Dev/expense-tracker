export interface ProfileUser {
    _id: string
    name: string
    email: string
    isDemo: boolean
}

export interface ChangePasswordPayload {
    currentPassword: string
    newPassword: string
}