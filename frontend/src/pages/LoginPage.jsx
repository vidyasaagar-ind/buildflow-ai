import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLogo from '../components/ui/AppLogo'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await login(email, password)
      showToast('Login successful', 'success')
      navigate('/dashboard')
    } catch (error) {
      showToast(error.message || 'Login failed', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <Card className="w-full max-w-md">
        <div className="mb-5 flex justify-center">
          <AppLogo compact />
        </div>
        <h1 className="text-2xl font-semibold">Welcome to BuildFlow AI</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Sign in to BuildFlow AI and continue your planning workspace.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-800"
            placeholder="Email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-800"
            placeholder="Password"
          />
          <Button className="w-full" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Continue'}</Button>
        </form>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">New user? <Link className="text-brand-600" to="/signup">Create an account</Link></p>
      </Card>
    </div>
  )
}

export default LoginPage
