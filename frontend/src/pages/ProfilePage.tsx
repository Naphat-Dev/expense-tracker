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
            <div className="min-h-screen bg-gray-100 px-4 py-10 sm:px-8">
                <p className="mx-auto max-w-2xl rounded-lg border border-clay/40 bg-white px-4 py-3 text-sm text-clay">
                    {loadError}
                </p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 px-4 py-10 sm:px-8">
                <div className="mx-auto max-w-2xl animate-pulse space-y-6">
                    <div className="h-8 w-40 rounded bg-gray-200" />
                    <div className="h-32 rounded-lg bg-gray-200" />
                    <div className="h-56 rounded-lg bg-gray-200" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10 sm:px-8">
            <header className="mx-auto mb-6 flex max-w-2xl items-center gap-3">
                <button
                    onClick={() => navigate('/')}
                    aria-label="กลับหน้าแรก"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink transition hover:bg-gray-50"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-sage">Settings</p>
                    <h1 className="font-display text-2xl font-semibold text-ink">บัญชีของฉัน</h1>
                </div>
            </header>

            <div className="mx-auto max-w-2xl">
                {/* Tab bar */}
                <div className="mb-6 flex gap-1 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`px-4 py-2.5 text-sm font-medium transition ${
                            activeTab === 'general'
                                ? 'border-b-2 border-sage text-ink'
                                : 'border-b-2 border-transparent text-ink/50 hover:text-ink'
                        }`}
                    >
                        ทั่วไป
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`px-4 py-2.5 text-sm font-medium transition ${
                            activeTab === 'security'
                                ? 'border-b-2 border-sage text-ink'
                                : 'border-b-2 border-transparent text-ink/50 hover:text-ink'
                        }`}
                    >
                        ความปลอดภัย
                    </button>
                </div>

                {activeTab === 'general' ? (
                    <section className="rounded-lg border border-gray-200 bg-white">
                        <div className="border-b border-gray-100 px-6 py-4">
                            <h2 className="font-display text-base font-semibold text-ink">ข้อมูลส่วนตัว</h2>
                            <p className="mt-0.5 text-sm text-ink/50">ข้อมูลนี้จะแสดงในระบบของคุณ</p>
                        </div>

                        <div className="flex items-center gap-4 px-6 py-6">
                            <InitialAvatar name={user.name} size="lg" />

                            <div className="min-w-0 flex-1">
                                <p className="mb-1.5 text-xs font-medium text-ink/50">ชื่อที่แสดง</p>
                                {isEditingName ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            value={nameDraft}
                                            onChange={(e) => setNameDraft(e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleSaveName}
                                            disabled={!hasNameChanged || isSavingName}
                                            aria-label="บันทึกชื่อ"
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sage text-white transition hover:bg-sage/90 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditingName(false)
                                                setNameDraft(user.name)
                                            }}
                                            aria-label="ยกเลิก"
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink/50 transition hover:bg-gray-50"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-display text-lg font-semibold text-ink">{user.name}</h3>
                                        <button
                                            onClick={() => setIsEditingName(true)}
                                            aria-label="แก้ไขชื่อ"
                                            className="flex h-6 w-6 items-center justify-center rounded text-ink/40 transition hover:bg-gray-50 hover:text-sage"
                                        >
                                            <Pencil size={13} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                            <div>
                                <p className="text-xs font-medium text-ink/50">อีเมล</p>
                                <p className="mt-0.5 text-sm text-ink">{user.email}</p>
                            </div>
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-ink/50">
                                ผูกกับบัญชี
                            </span>
                        </div>
                    </section>
                ) : (
                    <section className="rounded-lg border border-gray-200 bg-white">
                        <div className="border-b border-gray-100 px-6 py-4">
                            <h2 className="font-display text-base font-semibold text-ink">เปลี่ยนรหัสผ่าน</h2>
                            <p className="mt-0.5 text-sm text-ink/50">
                                ใช้รหัสผ่านที่คาดเดายาก และไม่ซ้ำกับที่อื่น
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 px-6 py-6">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-ink/60">รหัสผ่านเดิม</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                                        aria-label={showCurrentPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
                                    >
                                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-ink/60">รหัสผ่านใหม่</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword((prev) => !prev)}
                                        aria-label={showNewPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
                                    >
                                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <p
                                    className={`mt-1.5 flex items-center gap-1 text-xs ${
                                        newPassword.length === 0
                                            ? 'text-ink/40'
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
                                <label className="mb-1.5 block text-xs font-medium text-ink/60">
                                    ยืนยันรหัสผ่านใหม่
                                </label>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage"
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
                                className="mt-2 self-start rounded-lg bg-clay px-4 py-2 text-sm font-medium text-white transition hover:bg-clay/90 disabled:cursor-not-allowed disabled:opacity-40"
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