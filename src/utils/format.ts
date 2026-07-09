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

export function toCents(amount: number): number {
  return Math.round(amount * 100)
}