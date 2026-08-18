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
          <p className="text-xs font-medium uppercase tracking-widest text-muted">Ledger</p>
          <h1 className="mt-1 text-3xl font-semibold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </div>
        <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}