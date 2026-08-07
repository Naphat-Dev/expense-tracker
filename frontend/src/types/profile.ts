export interface ProfileUser {
    _id: string
    name: string
    email: string
}

export interface ChangePasswordPayload {
    currentPassword: string
    newPassword: string
}