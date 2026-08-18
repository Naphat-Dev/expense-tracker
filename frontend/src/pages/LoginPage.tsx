import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import PasswordInput from '../components/auth/PasswordInput'
import { loginApi } from '../api/auth'

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
    <AuthLayout title="เข้าสู่ระบบ" subtitle="ยินดีต้อนรับ">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
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
            className="w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 md:rounded-xl md:px-4 md:py-3 md:text-base"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-medium text-ink/70 md:mb-2 md:text-sm">
            รหัสผ่าน
          </label>
          <PasswordInput id="password" value={password} onChange={setPassword} autoComplete="current-password" />
        </div>

        {error ? (
          <p className="rounded-md border border-line bg-surface px-3 py-2 text-xs text-clay md:px-4 md:py-3 md:text-sm">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 md:py-3 md:text-base"
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ink/60 md:mt-8 md:text-sm">
        ยังไม่มีบัญชี?{' '}
        <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
          สมัครสมาชิก
        </Link>
      </p>
    </AuthLayout>
  )
}