import Card from '../ui/Card'
import OutputsPanel from './OutputsPanel'
import PromptsPanel from './PromptsPanel'

function BlueprintPanel({ project, activeTab, onTabChange, onProjectUpdate }) {
  const tabs = ['Blueprint', 'Outputs', 'Prompts']

  return (
    <Card>
      <h3 className="font-semibold">Output Panel</h3>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`rounded-lg p-2 text-center font-medium transition ${
              activeTab === tab
                ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Blueprint' ? (
        <div className="mt-4 space-y-3 text-sm">
          {[
            ['stage1', 'Stage 1: Idea and Goal'],
            ['stage2', 'Stage 2: Target Users and Use Case'],
            ['stage3', 'Stage 3: Core Features'],
            ['stage4', 'Stage 4: UI/UX Preferences'],
            ['stage5', 'Stage 5: Tech Stack and Integrations'],
          ].map(([key, label]) => {
            const stageNode = project.blueprint?.[key] || {}
            const status = stageNode.status || 'pending'
            const summary = stageNode.summary || ''
            const answerCount = Array.isArray(stageNode.answers) ? stageNode.answers.length : 0
            const statusLabel = status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In Progress' : 'Pending'

            return (
            <div key={label} className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  status === 'completed'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : status === 'in-progress'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
                }`}>
                  {statusLabel}
                </span>
              </div>
              <p className="mt-1 text-slate-700 dark:text-slate-200">{summary || 'Not answered yet'}</p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Answers saved: {answerCount}</p>
            </div>
            )
          })}
        </div>
      ) : null}

      {activeTab === 'Outputs' ? <OutputsPanel project={project} onProjectUpdate={onProjectUpdate} /> : null}

      {activeTab === 'Prompts' ? <PromptsPanel project={project} onProjectUpdate={onProjectUpdate} /> : null}
    </Card>
  )
}

export default BlueprintPanel
