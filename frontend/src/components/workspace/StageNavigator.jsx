import Card from '../ui/Card'

function StageNavigator({ stages, currentStage, onStageClick }) {
  return (
    <Card>
      <h3 className="font-semibold">Stage Navigator</h3>
      <div className="mt-3 space-y-2 text-sm">
        {stages.map((stage, index) => {
          const stageNumber = index + 1
          const isActive = stageNumber === currentStage
          const isDone = stageNumber < currentStage

          return (
            <button
              key={stage.key}
              type="button"
              onClick={() => onStageClick(stageNumber)}
              className={`rounded-xl px-3 py-2 ${
                isActive
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-200'
                  : isDone
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              } w-full text-left transition-all duration-200`}
            >
              <p className="flex items-center justify-between font-medium">
                <span>Stage {stageNumber}</span>
                {isDone ? (
                  <span aria-hidden="true">✓</span>
                ) : null}
              </p>
              <p className="text-xs">{stage.title}</p>
            </button>
          )
        })}
      </div>
    </Card>
  )
}

export default StageNavigator
