import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InitialAvatar from './InitialAvatar'

interface ProfileDropdownProps {
    name: string
    email: string
    onLogout: () => void
}

function ProfileDropdown({ name, email, onLogout }: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!isOpen) return

        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('pointerdown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('pointerdown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen])

    const goToProfile = () => {
        setIsOpen(false)
        navigate('/profile')
    }

    const handleLogoutClick = () => {
        setIsOpen(false)
        onLogout()
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="rounded-full transition hover:opacity-80"
                aria-label="เปิดเมนูโปรไฟล์"
                aria-expanded={isOpen}
            >
                <InitialAvatar name={name || '?'} size="sm" />
            </button>

            {isOpen ? (
                <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <InitialAvatar name={name || '?'} size="sm" />
                        <div className="min-w-0">
                            <p className="truncate font-display text-sm font-semibold text-ink">
                                {name || 'ผู้ใช้งาน'}
                            </p>
                            <p className="truncate text-xs text-ink/60">{email}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100" />

                    <button
                        onClick={goToProfile}
                        className="w-full px-4 py-2.5 text-left text-sm text-ink transition hover:bg-gray-50"
                    >
                        โปรไฟล์ของฉัน
                    </button>

                    <button
                        onClick={handleLogoutClick}
                        className="w-full px-4 py-2.5 text-left text-sm text-clay transition hover:bg-gray-50"
                    >
                        ออกจากระบบ
                    </button>
                </div>
            ) : null}
        </div>
    )
}

export default Profiledropdown