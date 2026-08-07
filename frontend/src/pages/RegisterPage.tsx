import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import PasswordInput from '../components/auth/PasswordInput'
import { registerApi } from '../api/auth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mismatch = confirm.length > 0 && password !== confirm

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mismatch) return
    setError(null)
    setLoading(true)
    try {
      await registerApi({ name, email, password })
      navigate('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'สมัครสมาชิกไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="สร้างบัญชีใหม่" subtitle="เริ่มบันทึกรายรับ-รายจ่ายของคุณ">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-medium text-ink/70 md:mb-2 md:text-sm">
            ชื่อ
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ชื่อของคุณ"
            className="w-full rounded-lg border border-line bg-paper/40 px-3 py-2.5 text-sm text-ink outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20 md:rounded-xl md:px-4 md:py-3 md:text-base"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-medium text-ink/70 md:mb-2 md:text-sm">
            อีเมล
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-line bg-paper/40 px-3 py-2.5 text-sm text-ink outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20 md:rounded-xl md:px-4 md:py-3 md:text-base"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-medium text-ink/70 md:mb-2 md:text-sm">
            รหัสผ่าน <span className="text-ink/40">(อย่างน้อย 8 ตัวอักษร)</span>
          </label>
          <PasswordInput id="password" value={password} onChange={setPassword} autoComplete="new-password" />
        </div>

        <div>
          <label htmlFor="confirm" className="mb-1 block text-xs font-medium text-ink/70 md:mb-2 md:text-sm">
            ยืนยันรหัสผ่าน
          </label>
          <PasswordInput id="confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" />
          {mismatch ? <p className="mt-1 text-xs text-clay md:text-sm">รหัสผ่านไม่ตรงกัน</p> : null}
        </div>

        {error ? (
          <p className="rounded-lg border border-clay/30 bg-clay/5 px-3 py-2 text-xs text-clay md:rounded-xl md:px-4 md:py-3 md:text-sm">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || mismatch}
          className="w-full rounded-lg bg-sage py-2.5 text-sm font-medium text-white transition hover:bg-sage/90 disabled:cursor-not-allowed disabled:opacity-60 md:rounded-xl md:py-3 md:text-base"
        >
          {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ink/60 md:mt-8 md:text-sm">
        มีบัญชีอยู่แล้ว?{' '}
        <Link to="/login" className="font-medium text-sage hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </AuthLayout>
  )
}