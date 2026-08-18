import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { ArrowLeft, Check, Eye, EyeOff, Pencil, X } from 'lucide-react'
import InitialAvatar from '../components/InitialAvatar'
import { fetchProfile, updateProfileName, changePassword } from '../api/profile'
import type { ProfileUser } from '../types/profile'

type Tab = 'general' | 'security'

function ProfilePage() {
    const navigate = useNavigate()
    const [user, setUser] = useState<ProfileUser | null>(null)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<Tab>('general')

    const [isEditingName, setIsEditingName] = useState(false)
    const [nameDraft, setNameDraft] = useState('')
    const [isSavingName, setIsSavingName] = useState(false)

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [isSavingPassword, setIsSavingPassword] = useState(false)

    useEffect(() => {
        let cancelled = false
            ; (async () => {
                try {
                    setLoadError(null)
                    const data = await fetchProfile()
                    if (!cancelled) {
                        setUser(data)
                        setNameDraft(data.name)
                    }
                } catch (err) {
                    if (!cancelled) {
                        setLoadError(err instanceof Error ? err.message : 'โหลดข้อมูลไม่สำเร็จ')
                    }
                }
            })()
        return () => {
            cancelled = true
        }
    }, [])

    // ---- validation แบบ real-time สำหรับฟอร์มรหัสผ่าน ----
    const hasMinLength = newPassword.length >= 8
    const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword
    const canSubmitPassword = useMemo(
        () => currentPassword.length > 0 && hasMinLength && passwordsMatch,
        [currentPassword, hasMinLength, passwordsMatch],
    )

    const hasNameChanged = user ? nameDraft.trim() !== user.name && nameDraft.trim().length > 0 : false

    const handleSaveName = async () => {
        if (!nameDraft.trim() || isSavingName) return

        setIsSavingName(true)
        try {
            const updated = await updateProfileName(nameDraft.trim())
            setUser(updated)
            setIsEditingName(false)
            await Swal.fire({ icon: 'success', title: 'บันทึกชื่อสำเร็จ', timer: 1200, showConfirmButton: false })
        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'บันทึกไม่สำเร็จ',
                text: err instanceof Error ? err.message : 'เกิดข้อผิดพลาด',
            })
        } finally {
            setIsSavingName(false)
        }
    }

    const handleChangePassword = async () => {
        if (!canSubmitPassword || isSavingPassword) return

        setIsSavingPassword(true)
        try {
            const result = await changePassword({ currentPassword, newPassword })
            await Swal.fire({ icon: 'success', title: result.message })
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'เปลี่ยนรหัสผ่านไม่สำเร็จ',
                text: err instanceof Error ? err.message : 'เกิดข้อผิดพลาด',
            })
        } finally {
            setIsSavingPassword(false)
        }
    }

    if (loadError) {
        return (
            <div className="min-h-screen bg-paper px-4 py-10 sm:px-8">
                <p className="mx-auto max-w-2xl rounded-md border border-line bg-surface px-4 py-3 text-sm text-clay">
                    {loadError}
                </p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-paper px-4 py-10 sm:px-8">
                <div className="mx-auto max-w-2xl animate-pulse space-y-6">
                    <div className="h-8 w-40 rounded bg-line" />
                    <div className="h-32 rounded-lg bg-line" />
                    <div className="h-56 rounded-lg bg-line" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-paper px-4 py-10 sm:px-8">
            <header className="mx-auto mb-6 flex max-w-2xl items-center gap-3">
                <button
                    onClick={() => navigate('/')}
                    aria-label="กลับหน้าแรก"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink shadow-card transition hover:bg-paper"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted">Settings</p>
                    <h1 className="text-2xl font-semibold text-ink">บัญชีของฉัน</h1>
                </div>
            </header>

            <div className="mx-auto max-w-2xl">
                {/* Tab bar */}
                <div className="mb-6 flex gap-1 border-b border-line">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`px-4 py-2.5 text-sm font-medium transition ${
                            activeTab === 'general'
                                ? 'border-b-2 border-primary text-ink'
                                : 'border-b-2 border-transparent text-muted hover:text-ink'
                        }`}
                    >
                        ทั่วไป
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`px-4 py-2.5 text-sm font-medium transition ${
                            activeTab === 'security'
                                ? 'border-b-2 border-primary text-ink'
                                : 'border-b-2 border-transparent text-muted hover:text-ink'
                        }`}
                    >
                        ความปลอดภัย
                    </button>
                </div>

                {activeTab === 'general' ? (
                    <section className="rounded-card border border-line bg-surface shadow-card">
                        <div className="border-b border-line px-6 py-4">
                            <h2 className="text-base font-semibold text-ink">ข้อมูลส่วนตัว</h2>
                            <p className="mt-0.5 text-sm text-muted">ข้อมูลนี้จะแสดงในระบบของคุณ</p>
                        </div>

                        <div className="flex items-center gap-4 px-6 py-6">
                            <InitialAvatar name={user.name} size="lg" />

                            <div className="min-w-0 flex-1">
                                <p className="mb-1.5 text-xs font-medium text-muted">ชื่อที่แสดง</p>
                                {isEditingName ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            value={nameDraft}
                                            onChange={(e) => setNameDraft(e.target.value)}
                                            className="w-full rounded-lg border border-line bg-paper px-3 py-1.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleSaveName}
                                            disabled={!hasNameChanged || isSavingName}
                                            aria-label="บันทึกชื่อ"
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditingName(false)
                                                setNameDraft(user.name)
                                            }}
                                            aria-label="ยกเลิก"
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-paper"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-ink">{user.name}</h3>
                                        <button
                                            onClick={() => setIsEditingName(true)}
                                            aria-label="แก้ไขชื่อ"
                                            className="flex h-6 w-6 items-center justify-center rounded-lg text-muted transition hover:bg-paper hover:text-ink"
                                        >
                                            <Pencil size={13} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-line px-6 py-4">
                            <div>
                                <p className="text-xs font-medium text-muted">อีเมล</p>
                                <p className="mt-0.5 text-sm text-ink">{user.email}</p>
                            </div>
                            <span className="rounded-full bg-paper px-2.5 py-1 text-xs text-muted">
                                ผูกกับบัญชี
                            </span>
                        </div>
                    </section>
                ) : (
                    <section className="rounded-card border border-line bg-surface shadow-card">
                        <div className="border-b border-line px-6 py-4">
                            <h2 className="text-base font-semibold text-ink">เปลี่ยนรหัสผ่าน</h2>
                            <p className="mt-0.5 text-sm text-muted">
                                ใช้รหัสผ่านที่คาดเดายาก และไม่ซ้ำกับที่อื่น
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 px-6 py-6">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted">รหัสผ่านเดิม</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full rounded-lg border border-line bg-paper px-3 py-2 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                                        aria-label={showCurrentPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                                    >
                                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted">รหัสผ่านใหม่</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full rounded-lg border border-line bg-paper px-3 py-2 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword((prev) => !prev)}
                                        aria-label={showNewPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                                    >
                                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <p
                                    className={`mt-1.5 flex items-center gap-1 text-xs ${
                                        newPassword.length === 0
                                            ? 'text-muted'
                                            : hasMinLength
                                              ? 'text-sage'
                                              : 'text-clay'
                                    }`}
                                >
                                    {newPassword.length > 0 && hasMinLength ? <Check size={12} /> : null}
                                    อย่างน้อย 8 ตัวอักษร
                                </p>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted">
                                    ยืนยันรหัสผ่านใหม่
                                </label>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                                {confirmPassword.length > 0 ? (
                                    <p
                                        className={`mt-1.5 flex items-center gap-1 text-xs ${
                                            passwordsMatch ? 'text-sage' : 'text-clay'
                                        }`}
                                    >
                                        {passwordsMatch ? <Check size={12} /> : null}
                                        {passwordsMatch ? 'รหัสผ่านตรงกัน' : 'รหัสผ่านไม่ตรงกัน'}
                                    </p>
                                ) : null}
                            </div>

                            <button
                                onClick={handleChangePassword}
                                disabled={!canSubmitPassword || isSavingPassword}
                                className="mt-2 self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isSavingPassword ? 'กำลังบันทึก...' : 'เปลี่ยนรหัสผ่าน'}
                            </button>
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}

export default ProfilePage