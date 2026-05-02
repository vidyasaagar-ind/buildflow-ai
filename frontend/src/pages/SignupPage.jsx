import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLogo from '../components/ui/AppLogo'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const { showToast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      await signup(email, password, name.trim())
      showToast('Account created successfully', 'success')
      navigate('/dashboard')
    } catch (error) {
      showToast(error.message || 'Signup failed', 'error')
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
        <h1 className="text-2xl font-semibold">Join BuildFlow AI</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Create your BuildFlow AI account to start structured planning.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-800"
            placeholder="Full Name"
          />
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
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-800"
            placeholder="Confirm Password"
          />
          <Button className="w-full" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Account'}</Button>
        </form>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Already have an account? <Link className="text-brand-600" to="/login">Log in</Link></p>
      </Card>
    </div>
  )
}

export default SignupPage
