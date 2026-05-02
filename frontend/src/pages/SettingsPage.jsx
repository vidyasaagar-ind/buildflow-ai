import { useEffect, useState } from 'react'
import { updateProfile } from 'firebase/auth'
import ThemeToggle from '../components/ui/ThemeToggle'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { auth } from '../firebase'
import { getUserSettings, saveUserSettings } from '../services/firestoreService'

function SettingsPage() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      if (user) {
        const storedSettings = await getUserSettings(user.uid)
        setName(storedSettings?.name || user.displayName || '')
        setEmail(storedSettings?.email || user.email || '')
        setRole(storedSettings?.role || '')
      } else {
        setName('')
        setEmail('')
        setRole('')
      }
    }
    loadSettings()
  }, [user])

  const handleUpdateProfile = async (event) => {
    event.preventDefault()
    if (!auth.currentUser) {
      showToast('No authenticated user found', 'error')
      return
    }

    setIsSaving(true)
    try {
      await updateProfile(auth.currentUser, {
        displayName: name.trim(),
      })
      await saveUserSettings(auth.currentUser.uid, {
        name: name.trim(),
        email,
        role,
        preferences: {
          themeStorage: 'browser-preference',
        },
      })
      showToast('Profile updated successfully', 'success')
    } catch (error) {
      showToast(error.message || 'Failed to update profile', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      showToast('Logged out successfully', 'info')
    } catch (error) {
      showToast(error.message || 'Logout failed', 'error')
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <header>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Manage your profile details and account preferences.</p>
      </header>

      <section className="space-y-6">
        <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900">
          <h3 className="text-lg font-semibold">Account Settings</h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block text-slate-600 dark:text-slate-300">Full Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50"
                placeholder="Enter your full name"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-slate-600 dark:text-slate-300">Email</span>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-slate-600 dark:text-slate-300">Your Role</span>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50"
              >
                <option value="">Select your role</option>
                <option value="Student">Student</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Developer">Developer</option>
                <option value="Small Business Owner">Small Business Owner</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900">
          <h3 className="text-lg font-semibold">Preferences</h3>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark mode.</p>
            </div>
            <ThemeToggle />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">More preferences coming soon.</p>
        </div>

        <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900">
          <h3 className="text-lg font-semibold">Data and Storage</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Your projects are securely stored and synced with your account.
          </p>
        </div>

        <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900">
          <h3 className="text-lg font-semibold">Account Actions</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">Sign out from your current session.</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white transition-all duration-200 hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </section>
    </div>
  )
}

export default SettingsPage
