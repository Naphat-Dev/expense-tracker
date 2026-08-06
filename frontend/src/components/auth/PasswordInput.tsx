import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  placeholder = '••••••••',
}: {
  id: string
  value: string
  onChange: (v: string) => void
  autoComplete: 'current-password' | 'new-password'
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        required
        minLength={8}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line bg-paper/40 px-3 py-2.5 pr-10 text-sm text-ink outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20 md:rounded-xl md:px-4 md:py-3 md:text-base"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
        aria-label={show ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}