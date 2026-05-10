import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import Card from '../ui/Card'

function StageCompletionCard({ onOpenOutputs, onOpenPrompts }) {
  const navigate = useNavigate()

  return (
    <Card className="mx-auto mt-8 flex w-full max-w-2xl flex-col items-center p-8 text-center">
      <h3 className="text-xl font-semibold">Planning Completed Successfully</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Your project is fully structured and ready.</p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Button type="button" onClick={onOpenOutputs}>Generate BRD</Button>
        <Button type="button" variant="secondary" onClick={onOpenOutputs}>Generate SRS</Button>
        <Button type="button" variant="secondary" onClick={onOpenOutputs}>Generate Roadmap</Button>
        <Button type="button" variant="secondary" onClick={onOpenOutputs}>Generate To-Do List</Button>
        <Button type="button" variant="secondary" onClick={onOpenPrompts}>Generate Prompts</Button>
        <Button type="button" variant="secondary" onClick={onOpenOutputs}>Generate All</Button>
        <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>Go Dashboard</Button>
      </div>
    </Card>
  )
}

export default StageCompletionCard
