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
          <div className="mb-3 flex items-center justify-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-xs font-bold text-paper">
              ET
            </div>

            <span className="text-lg font-bold tracking-tight text-ink">
              Expense Tracker
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            {title}
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            {subtitle}
          </p>
        </div>
        <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}