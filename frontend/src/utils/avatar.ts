// ดึงตัวอักษรย่อจากชื่อ เช่น "สมชาย ใจดี" -> "สใ", "Somchai" -> "S"
export function getInitials(name: string): string {
    const trimmed = name.trim()
    if (!trimmed) return '?'

    const parts = trimmed.split(/\s+/).filter(Boolean)

    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase()
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// สีพื้นหลัง avatar ที่เข้าธีมของแอป (ปรับ hex ให้ตรง palette จริงได้)
const AVATAR_PALETTE = [
    '#8A9A7E', // sage
    '#C97C5D', // clay
    '#5B6B73', // slate
    '#B08968', // tan
    '#7A8B99', // dusty blue
    '#A6785F', // terracotta
]

// สี avatar ตามชื่อ
export function getAvatarColor(name: string): string {
  const sum = [...name].reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  )

  return AVATAR_PALETTE[sum % AVATAR_PALETTE.length]
}