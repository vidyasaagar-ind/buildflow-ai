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
            ['Stage 1: Idea and Goal', project.blueprint.stage1],
            ['Stage 2: Target Users and Use Case', project.blueprint.stage2],
            ['Stage 3: Core Features', project.blueprint.stage3],
            ['Stage 4: UI/UX Preferences', project.blueprint.stage4],
            ['Stage 5: Tech Stack and Integrations', project.blueprint.stage5],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-1 text-slate-700 dark:text-slate-200">{value || 'Not answered yet'}</p>
            </div>
          ))}
        </div>
      ) : null}

      {activeTab === 'Outputs' ? <OutputsPanel project={project} onProjectUpdate={onProjectUpdate} /> : null}

      {activeTab === 'Prompts' ? <PromptsPanel project={project} onProjectUpdate={onProjectUpdate} /> : null}
    </Card>
  )
}

export default BlueprintPanel
