import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout.tsx'
import PasswordInput from '../components/auth/PasswordInput.tsx'
import { loginApi } from '../api/auth.ts'
import Swal from 'sweetalert2'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await loginApi({ email, password })
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="เข้าสู่ระบบ" subtitle="ยินดีต้อนรับกลับมา">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-medium text-ink/70">
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
            className="w-full rounded-lg border border-line bg-paper/40 px-3 py-2.5 text-sm text-ink outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-medium text-ink/70">
            รหัสผ่าน
          </label>
          <PasswordInput id="password" value={password} onChange={setPassword} autoComplete="current-password" />
        </div>

        {error ? (
          <p className="rounded-lg border border-clay/30 bg-clay/5 px-3 py-2 text-xs text-clay">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-sage py-2.5 text-sm font-medium text-white transition hover:bg-sage/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ink/60">
        ยังไม่มีบัญชี?{' '}
        <Link to="/register" className="font-medium text-sage hover:underline">
          สมัครสมาชิก
        </Link>
      </p>
    </AuthLayout>
  )
}