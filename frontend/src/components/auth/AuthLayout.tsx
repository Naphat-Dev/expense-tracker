import type { ReactNode } from 'react'

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-ink">Expense Tracker</h1>
          <h2 className="mt-1 text-2xl font-semibold text-ink">{title}</h2>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </div>
        <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}