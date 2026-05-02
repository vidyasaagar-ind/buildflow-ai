import { useTheme } from '../../context/ThemeContext'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative inline-flex h-8 w-16 shrink-0 items-center rounded-full border border-slate-300 bg-slate-200 px-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
    >
      <span
        className={`absolute left-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-amber-500 shadow-sm transition-all duration-300 dark:bg-slate-950 ${
          isDark ? 'translate-x-8 text-cyan-200' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M21 13.01A9 9 0 1 1 10.99 3a7 7 0 0 0 10.01 10.01Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 15a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Zm9-6a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM6 12a1 1 0 0 1-1 1H4a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm10.95 5.54a1 1 0 0 1 0 1.41l-.7.71a1 1 0 1 1-1.41-1.42l.7-.7a1 1 0 0 1 1.41 0ZM9.16 9.17a1 1 0 0 1 0 1.41l-.7.7a1 1 0 1 1-1.41-1.41l.7-.7a1 1 0 0 1 1.41 0Zm8.5-3.12a1 1 0 0 1 0 1.41l-.7.7a1 1 0 1 1-1.41-1.41l.7-.7a1 1 0 0 1 1.41 0ZM9.16 14.83a1 1 0 0 1 0 1.41l-.7.71a1 1 0 0 1-1.41-1.42l.7-.7a1 1 0 0 1 1.41 0ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />
          </svg>
        )}
      </span>
    </button>
  )
}

export default ThemeToggle
