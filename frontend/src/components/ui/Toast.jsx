import { useEffect } from 'react'

const toastStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200',
  error: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/80 dark:text-rose-200',
  info: 'border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 2600)
    return () => clearTimeout(timer)
  }, [toast.id, onClose])

  return (
    <div className={`pointer-events-auto w-80 rounded-xl border px-4 py-3 shadow-soft transition-all duration-200 ${toastStyles[toast.type] || toastStyles.info}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          type="button"
          onClick={() => onClose(toast.id)}
          className="rounded-md px-1 text-xs opacity-70 transition hover:opacity-100"
          aria-label="Dismiss toast"
        >
          x
        </button>
      </div>
    </div>
  )
}

export default Toast
