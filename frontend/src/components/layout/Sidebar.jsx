import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import AppLogo from '../ui/AppLogo'

const navItems = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 11 12 4l9 7" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="5" rx="2" />
        <rect x="13" y="10" width="8" height="11" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
      </svg>
    ),
  },
  {
    to: '/create-project',
    label: 'Create Project',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    ),
  },
  {
    to: '/how-to-use',
    label: 'How To Use',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h10" />
      </svg>
    ),
  },
  {
    to: '/about',
    label: 'About',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 16v-4" />
        <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M10.3 2.5 9.6 5a7.5 7.5 0 0 0-1.6.9L5.6 4.6 3.5 6.7 4.8 9a7.5 7.5 0 0 0-.9 1.6l-2.5.7v3l2.5.7a7.5 7.5 0 0 0 .9 1.6l-1.3 2.3 2.1 2.1 2.3-1.3a7.5 7.5 0 0 0 1.6.9l.7 2.5h3l.7-2.5a7.5 7.5 0 0 0 1.6-.9l2.3 1.3 2.1-2.1-1.3-2.3a7.5 7.5 0 0 0 .9-1.6l2.5-.7v-3l-2.5-.7a7.5 7.5 0 0 0-.9-1.6l1.3-2.3-2.1-2.1-2.3 1.3a7.5 7.5 0 0 0-1.6-.9l-.7-2.5h-3Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
]

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      showToast('Logged out', 'info')
      setMobileOpen(false)
      navigate('/login')
    } catch {
      showToast('Logout failed', 'error')
    }
  }

  return (
    <aside className={`fixed left-0 top-0 z-40 flex h-full w-72 flex-col justify-between border-r border-slate-200 bg-white p-4 transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 md:relative md:z-auto md:w-auto md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'md:w-20' : 'md:w-64'}`}>
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className={`${collapsed ? 'md:hidden' : 'block'}`}>
            <AppLogo subtitle compact />
          </div>
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className={`hidden h-10 w-10 items-center justify-center rounded-lg p-3 text-slate-600 transition-transform duration-300 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-gray-700 md:inline-flex ${collapsed ? 'rotate-90' : ''}`}
          aria-label="Toggle sidebar"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 6h16M4 12h10M4 18h16" />
          </svg>
        </button>
        </div>

      <nav className="mt-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                collapsed ? 'justify-start gap-3 md:justify-center md:gap-0' : 'justify-start gap-3'
              } ${
                isActive
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
            title={item.label}
          >
            {item.icon}
            <span className={`${collapsed ? 'block md:hidden' : 'block'} whitespace-nowrap`}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      </div>

      <div className="mt-auto border-t border-slate-200 pt-3 dark:border-slate-800">
        <button
          type="button"
          onClick={handleLogout}
          className={`w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition-all duration-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 ${collapsed ? 'px-0' : ''}`}
          title="Logout"
        >
          <span className={`${collapsed ? 'inline md:hidden' : 'inline'}`}>Logout</span>
          <span className={`${collapsed ? 'hidden md:inline-flex items-center justify-center w-full' : 'hidden'}`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
