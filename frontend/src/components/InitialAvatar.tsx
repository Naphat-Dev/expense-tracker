import { getInitials, getAvatarColor } from '../utils/avatar'

interface InitialAvatarProps {
    name: string
    size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES: Record<NonNullable<InitialAvatarProps['size']>, string> = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-base',
    lg: 'h-24 w-24 text-3xl',
}

function InitialAvatar({ name, size = 'lg' }: InitialAvatarProps) {
    const initials = getInitials(name)
    const backgroundColor = getAvatarColor(name)

    return (
        <div
            className={`flex items-center justify-center rounded-full font-display font-semibold text-white ${SIZE_CLASSES[size]}`}
            style={{ backgroundColor }}
            aria-label={`รูปโปรไฟล์ของ ${name}`}
        >
            {initials}
        </div>
    )
}

export default InitialAvatar