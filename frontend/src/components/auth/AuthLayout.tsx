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
          <p className="font-mono text-xs uppercase tracking-widest text-sage">Ledger</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-ink/60">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}