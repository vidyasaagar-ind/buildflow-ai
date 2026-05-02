import { useMemo, useState } from 'react'
import {
  generateBackendPrompts,
  generateDeploymentPrompts,
  generateDevPrompts,
  generateUIPrompts,
} from '../../utils/generatePrompts'
import { useToast } from '../../context/ToastContext'
import Skeleton from '../ui/Skeleton'

const categories = [
  { key: 'dev', label: 'Dev' },
  { key: 'ui', label: 'UI' },
  { key: 'backend', label: 'Backend' },
  { key: 'deployment', label: 'Deployment' },
]

function safeFileNamePart(value) {
  return (value || 'project')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'project'
}

function PromptsPanel({ project, onProjectUpdate }) {
  const [activeCategory, setActiveCategory] = useState('dev')
  const [isGenerating, setIsGenerating] = useState(false)
  const { showToast } = useToast()

  const categoryPrompts = project.prompts?.[activeCategory] || []
  const getButtonStyle = (type) => (
    (project.prompts?.[type] || []).length > 0
      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300'
  )

  const generateByType = (type, sourceProject = project) => {
    const generators = {
      dev: generateDevPrompts,
      ui: generateUIPrompts,
      backend: generateBackendPrompts,
      deployment: generateDeploymentPrompts,
    }

    return generators[type]?.(sourceProject) || []
  }

  const handleGenerateCategory = (type) => {
    setIsGenerating(true)
    const updated = onProjectUpdate((existing) => ({
      ...existing,
      prompts: {
        ...existing.prompts,
        [type]: generateByType(type, existing),
      },
    }))
    setIsGenerating(false)

    if (updated) {
      setActiveCategory(type)
      showToast(`${type.toUpperCase()} prompts generated`, 'success')
    }
  }

  const handleGenerateAll = () => {
    setIsGenerating(true)
    const updated = onProjectUpdate((existing) => ({
      ...existing,
      prompts: {
        ...existing.prompts,
        dev: generateByType('dev', existing),
        ui: generateByType('ui', existing),
        backend: generateByType('backend', existing),
        deployment: generateByType('deployment', existing),
      },
    }))
    setIsGenerating(false)

    if (updated) {
      setActiveCategory('dev')
      showToast('All prompt categories generated', 'success')
    }
  }

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content)
      showToast('Prompt copied to clipboard', 'success')
    } catch {
      showToast('Copy failed', 'error')
    }
  }

  const handleDownloadPrompt = (prompt, index) => {
    const slug = safeFileNamePart(project.title)
    const category = activeCategory
    const blob = new Blob([prompt.content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${slug}-${category}-task-${index + 1}.md`
    link.click()
    URL.revokeObjectURL(url)
    showToast('Prompt markdown downloaded', 'info')
  }

  const handleDownloadCategory = () => {
    const slug = safeFileNamePart(project.title)
    const merged = categoryPrompts
      .map((prompt) => `## ${prompt.title}\n\nAgent: ${prompt.agent}\n\n${prompt.content}`)
      .join('\n\n---\n\n')

    const blob = new Blob([merged || 'No prompts generated yet.'], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${slug}-${activeCategory}-prompts.md`
    link.click()
    URL.revokeObjectURL(url)
    showToast('Prompt pack downloaded', 'info')
  }

  const generateButtons = useMemo(
    () => [
      { key: 'dev', label: 'Generate Dev Prompts' },
      { key: 'ui', label: 'Generate UI Prompts' },
      { key: 'backend', label: 'Generate Backend Prompts' },
      { key: 'deployment', label: 'Generate Deployment Prompts' },
    ],
    [],
  )

  const noPromptsYet = ['dev', 'ui', 'backend', 'deployment'].every((key) => (project.prompts?.[key] || []).length === 0)

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        {generateButtons.map((btn) => (
          <button
            key={btn.key}
            type="button"
            className={`px-4 py-2 rounded-lg text-xs transition disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyle(btn.key)}`}
            onClick={() => handleGenerateCategory(btn.key)}
            disabled={isGenerating}
          >
            {btn.label}
          </button>
        ))}
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGenerateAll}
          disabled={isGenerating}
        >
          Generate All Prompts
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 p-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden dark:border-slate-700">
        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            onClick={() => setActiveCategory(category.key)}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
              activeCategory === category.key
                ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                : 'bg-gray-100 text-slate-700 hover:scale-[1.02] dark:bg-gray-800 dark:text-slate-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button type="button" className="px-3 py-2 rounded-lg border border-slate-300 text-xs transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" onClick={handleDownloadCategory}>Download .md</button>
      </div>

      {isGenerating ? (
        <div className="space-y-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      ) : noPromptsYet ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
          <p className="text-sm font-semibold">No prompts generated yet</p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Generate prompt categories to view executable task prompts here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categoryPrompts.map((prompt, index) => (
            <div key={`${prompt.title}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3 transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold">{prompt.title}</h4>
                <span className="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-200">
                  {prompt.agent === 'codex' ? 'Codex' : 'Antigravity'}
                </span>
              </div>

              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-3 font-mono text-[11px] leading-5 text-slate-100">
                {prompt.content}
              </pre>

              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="px-3 py-2 rounded-lg border border-slate-300 text-xs transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" onClick={() => handleCopy(prompt.content)}>
                  Copy
                </button>
                <button type="button" className="px-3 py-2 rounded-lg border border-slate-300 text-xs transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" onClick={() => handleDownloadPrompt(prompt, index)}>
                  Download .md
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PromptsPanel
