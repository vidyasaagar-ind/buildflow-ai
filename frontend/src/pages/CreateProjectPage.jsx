import { useNavigate } from 'react-router-dom'
import ProjectForm from '../components/project/ProjectForm'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { createProject } from '../utils/projectStorage'

function CreateProjectPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const handleCreateProject = async (values) => {
    const project = await createProject({
      ...values,
      createdAt: Date.now(),
    }, user.uid)
    showToast('Project created successfully', 'success')
    navigate(`/workspace/${project.id}`)
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <header>
        <h2 className="text-2xl font-semibold">Create Project</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">Define the core idea so the assistant can prepare structured planning outputs.</p>
      </header>

      <Card>
        <ProjectForm onSubmit={handleCreateProject} submitLabel="Create and Open Workspace" />
      </Card>
    </div>
  )
}

export default CreateProjectPage
