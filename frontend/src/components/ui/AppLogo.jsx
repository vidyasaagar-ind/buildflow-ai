function AppLogo({ subtitle = false, compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-xl border border-sky-200 bg-sky-50 text-xs font-bold tracking-wide text-sky-700 shadow-sm dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-200">
        AI
      </div>
      <div>
        <p className={`${compact ? 'text-base' : 'text-lg'} font-semibold leading-tight text-slate-900 dark:text-slate-100`}>
          BuildFlow AI
        </p>
        {subtitle ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">BuildFlow AI</p>
        ) : null}
      </div>
    </div>
  )
}

export default AppLogo
