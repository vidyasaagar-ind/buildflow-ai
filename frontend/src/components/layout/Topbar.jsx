import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  exportProjectAsJson,
  getProjectById,
  resetProject,
} from '../../utils/projectStorage'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import ThemeToggle from '../ui/ThemeToggle'

function Topbar({ mobileOpen, setMobileOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const { user } = useAuth()
  const { showToast } = useToast()

  const isWorkspace = location.pathname.startsWith('/workspace/') || location.pathname.startsWith('/project/')
  const projectId = params.projectId
  const userEmail = user?.email || ''
  const avatarLetter = userEmail ? userEmail[0].toUpperCase() : 'U'
  const shortEmail = userEmail.length > 24 ? `${userEmail.slice(0, 24)}...` : userEmail

  const handleExportJson = async () => {
    if (!projectId || !user) return
    const json = await exportProjectAsJson(projectId, user.uid)
    if (!json) {
      showToast('Project not found for export', 'error')
      return
    }

    const project = await getProjectById(projectId, user.uid)
    const slug = (project?.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${slug || 'project'}.json`
    link.click()
    URL.revokeObjectURL(url)
    showToast('Project JSON exported', 'success')
  }

  const handleReset = async (mode) => {
    if (!projectId || !user) return
    const question = mode === 'all'
      ? 'Reset everything for this project (stages, outputs, prompts)?'
      : 'Reset stages only for this project?'

    if (!window.confirm(question)) return

    const updated = await resetProject(projectId, mode, user.uid)
    if (!updated) {
      showToast('Project reset failed', 'error')
      return
    }

    showToast(mode === 'all' ? 'Project fully reset' : 'Project stages reset', 'info')
    navigate(0)
  }

  useEffect(() => {
    const reconcileLegacyProjectRoute = async () => {
      if ((location.pathname.startsWith('/project/') || location.pathname.startsWith('/workspace/')) && projectId && user) {
        const project = await getProjectById(projectId, user.uid)
        if (!project) return
        if (location.pathname.startsWith('/project/')) {
          navigate(`/workspace/${projectId}`, { replace: true })
        }
      }
    }
    reconcileLegacyProjectRoute()
  }, [location.pathname, navigate, projectId, user])

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg p-3 text-slate-600 transition-transform duration-300 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-gray-700 md:hidden ${mobileOpen ? 'rotate-90' : ''}`}
            aria-label="Open sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
            </svg>
          </button>
          <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">Workspace</p>
          <h1 className="text-lg font-semibold">BuildFlow AI</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isWorkspace ? (
            <>
              <button type="button" onClick={handleExportJson} className="rounded-lg px-3 py-2 text-xs text-slate-700 transition-all duration-200 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Export JSON</button>
              <button type="button" onClick={() => handleReset('stages')} className="rounded-lg px-3 py-2 text-xs text-amber-700 transition-all duration-200 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/30">Reset Stages</button>
              <button type="button" onClick={() => handleReset('all')} className="rounded-lg px-3 py-2 text-xs text-rose-700 transition-all duration-200 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/30">Reset All</button>
            </>
          ) : null}

          <div className="ml-2 flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1 dark:border-slate-700">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
              {avatarLetter}
            </div>
            <p className="max-w-[160px] truncate text-xs text-slate-600 dark:text-slate-300">{shortEmail}</p>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default Topbar
