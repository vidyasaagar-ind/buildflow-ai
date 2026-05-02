import { useMemo, useState } from 'react'
import { exportMarkdownAsPDF } from '../../utils/exportPDF'
import { useToast } from '../../context/ToastContext'
import Skeleton from '../ui/Skeleton'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const docTabs = [
  { key: 'brd', label: 'BRD' },
  { key: 'srs', label: 'SRS' },
  { key: 'roadmap', label: 'Roadmap' },
  { key: 'todo', label: 'TODO' },
]

function parseSections(text) {
  if (!text || !text.trim()) return []
  return text
    .split('\n\n')
    .map((section) => section.trim())
    .filter(Boolean)
}

function isLikelyTitle(line) {
  if (!line) return false
  const normalized = line.trim()
  if (normalized.startsWith('##')) return true
  return normalized.length <= 80 && normalized === normalized.toUpperCase() && /[A-Z]/.test(normalized)
}

function parseSectionBlock(sectionText) {
  const lines = sectionText.split('\n')
  const firstLine = (lines[0] || '').trim()

  if (firstLine.startsWith('##')) {
    const title = firstLine.replace(/^##\s*/, '').trim()
    const content = lines.slice(1).join('\n').trim()
    return { title, content }
  }

  if (isLikelyTitle(firstLine)) {
    return {
      title: firstLine.replace(/^#+\s*/, '').trim(),
      content: lines.slice(1).join('\n').trim(),
    }
  }

  return { title: '', content: sectionText }
}

function safeFileNamePart(value) {
  return (value || 'project')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'project'
}

async function requestDocGeneration(type, project) {
  const response = await fetch(`${API_BASE}/api/generate-docs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, project }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Document generation failed')
  }

  return data.content
}

function OutputsPanel({ project, onProjectUpdate }) {
  const [activeDocTab, setActiveDocTab] = useState('brd')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingType, setGeneratingType] = useState('')
  const { showToast } = useToast()

  const currentContent = project.outputs?.[activeDocTab] || ''
  const parsedSections = useMemo(
    () => parseSections(currentContent).map(parseSectionBlock),
    [currentContent],
  )
  const getButtonStyle = (type) => (
    project.outputs?.[type]
      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300'
  )

  const ensureCanGenerate = () => {
    if (!project.blueprint?.stage1?.trim()) {
      showToast('Please complete initial chat before generating documents', 'error')
      return false
    }
    return true
  }

  const handleGenerate = async (type) => {
    if (!ensureCanGenerate()) return

    setIsGenerating(true)
    setGeneratingType(type)

    try {
      const content = await requestDocGeneration(type, project)
      const updated = onProjectUpdate((existing) => ({
        ...existing,
        outputs: {
          ...existing.outputs,
          [type]: content,
        },
      }))

      if (updated) {
        setActiveDocTab(type)
        showToast(`${type.toUpperCase()} generated`, 'success')
      }
    } catch (error) {
      showToast(error.message || 'Generation failed', 'error')
    } finally {
      setIsGenerating(false)
      setGeneratingType('')
    }
  }

  const handleGenerateAll = async () => {
    if (!ensureCanGenerate()) return

    setIsGenerating(true)
    setGeneratingType('all')

    try {
      const types = ['brd', 'srs', 'roadmap', 'todo']
      const generated = {}

      for (const type of types) {
        generated[type] = await requestDocGeneration(type, project)
      }

      const updated = onProjectUpdate((existing) => ({
        ...existing,
        outputs: {
          ...existing.outputs,
          ...generated,
        },
      }))

      if (updated) {
        setActiveDocTab('brd')
        showToast('All documents generated', 'success')
      }
    } catch (error) {
      showToast(error.message || 'Generation failed', 'error')
    } finally {
      setIsGenerating(false)
      setGeneratingType('')
    }
  }

  const handleCopy = async () => {
    if (!currentContent) return
    try {
      await navigator.clipboard.writeText(currentContent)
      showToast('Document copied to clipboard', 'success')
    } catch {
      showToast('Copy failed', 'error')
    }
  }

  const handleDownload = () => {
    if (!currentContent) return

    const slug = safeFileNamePart(project.title)
    const blob = new Blob([currentContent], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${slug}-${activeDocTab}.md`
    link.click()
    URL.revokeObjectURL(url)
    showToast('Markdown downloaded', 'info')
  }

  const handlePdfExport = () => {
    if (!currentContent) return

    const label = docTabs.find((tab) => tab.key === activeDocTab)?.label || 'Document'
    const ok = exportMarkdownAsPDF({
      title: `${project.title} - ${label}`,
      content: currentContent,
    })

    showToast(ok ? 'Print dialog opened for PDF export' : 'Pop-up blocked. Allow popups to export PDF.', ok ? 'success' : 'error')
  }

  const generateButtons = useMemo(
    () => [
      { key: 'brd', label: 'Generate BRD' },
      { key: 'srs', label: 'Generate SRS' },
      { key: 'roadmap', label: 'Generate Roadmap' },
      { key: 'todo', label: 'Generate TODO' },
    ],
    [],
  )

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        {generateButtons.map((btn) => (
          <button
            key={btn.key}
            type="button"
            className={`px-4 py-2 rounded-lg text-xs transition disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyle(btn.key)}`}
            disabled={isGenerating}
            onClick={() => handleGenerate(btn.key)}
          >
            {generatingType === btn.key ? 'Generating...' : btn.label}
          </button>
        ))}
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isGenerating}
          onClick={handleGenerateAll}
        >
          {generatingType === 'all' ? 'Generating...' : 'Generate All'}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 text-xs">
        {docTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveDocTab(tab.key)}
            className={`rounded-lg p-2 text-center font-medium transition-all duration-200 ${
              activeDocTab === tab.key
                ? 'scale-[1.02] bg-indigo-600 text-white dark:bg-indigo-500'
                : 'bg-slate-100 text-slate-700 hover:scale-[1.02] dark:bg-slate-800 dark:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="px-3 py-2 rounded-lg border border-slate-300 text-xs transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!currentContent || isGenerating} onClick={handleCopy}>Copy to Clipboard</button>
        <button type="button" className="px-3 py-2 rounded-lg border border-slate-300 text-xs transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!currentContent || isGenerating} onClick={handleDownload}>Download .md</button>
        <button type="button" className="px-3 py-2 rounded-lg border border-slate-300 text-xs transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!currentContent || isGenerating} onClick={handlePdfExport}>Export as PDF</button>
      </div>

      {isGenerating ? (
        <div className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {docTabs.find((tab) => tab.key === activeDocTab)?.label}
          </p>
          <div className="mt-3 max-h-[420px] space-y-3 overflow-auto pr-1">
            {parsedSections.length ? (
              parsedSections.map((section, index) => (
                <div key={`${activeDocTab}-section-${index}`} className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  {section.title ? (
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{section.title}</h3>
                  ) : null}
                  {section.content ? (
                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {section.content}
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">No generated content yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default OutputsPanel
