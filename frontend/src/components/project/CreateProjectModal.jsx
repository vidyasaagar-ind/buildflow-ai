import Card from '../ui/Card'
import ProjectForm from './ProjectForm'

function CreateProjectModal({ isOpen, onClose, onCreate }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true">
      <Card className="w-full max-w-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold">Create New Project</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Start a new planning workspace with core context.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close create project modal"
          >
            Close
          </button>
        </div>

        <ProjectForm
          onSubmit={(values) => {
            onCreate(values)
            onClose()
          }}
          onCancel={onClose}
          submitLabel="Create and Open Workspace"
        />
      </Card>
    </div>
  )
}

export default CreateProjectModal
