export function todayISO(): string {
    return new Date().toISOString().slice(0, 10)
  }

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}
  
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
  }).format(amount)
}

const THAI_AMOUNT_UNITS = [
  { value: 1e18, label: 'ล้านล้านล้าน' },
  { value: 1e15, label: 'พันล้านล้าน' },
  { value: 1e12, label: 'ล้านล้าน' },
  { value: 1e9, label: 'พันล้าน' },
  { value: 1e6, label: 'ล้าน' },
] as const

const COMPACT_CURRENCY_THRESHOLD = 1e6

export function formatCurrencyCompact(amount: number): string {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''

  if (abs < COMPACT_CURRENCY_THRESHOLD) {
    return formatCurrency(amount)
  }

  for (const unit of THAI_AMOUNT_UNITS) {
    if (abs >= unit.value) {
      const scaled = abs / unit.value
      const formatted = new Intl.NumberFormat('th-TH', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      }).format(scaled)

      return `${sign}${formatted} ${unit.label} ฿`
    }
  }

  return formatCurrency(amount)
}

export function toCents(amount: number): number {
  return Math.round(amount * 100)
}