import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CreateProjectModal from '../components/project/CreateProjectModal'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Skeleton from '../components/ui/Skeleton'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { createProject, deleteProjectById, getProjects, TOTAL_STAGES } from '../utils/projectStorage'

function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    const loadProjects = async () => {
      if (!user) {
        setProjects([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const loaded = await getProjects(user.uid)
        setProjects(loaded || [])
      } catch (err) {
        console.error('Error loading projects:', err)
        if (err?.code === 'permission-denied') {
          alert('Permission error. Check Firebase rules.')
        }
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [user])

  const totalProjects = projects.length

  const handleCreate = async (values) => {
    const project = await createProject(values, user.uid)
    setProjects(await getProjects(user.uid))
    showToast('Project created successfully', 'success')
    navigate(`/workspace/${project.id}`)
  }

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm('Are you sure you want to delete this project?')
    if (!confirmed) return

    const ok = await deleteProjectById(projectId, user.uid)
    if (!ok) {
      showToast('Could not delete project', 'error')
      return
    }

    setProjects(await getProjects(user.uid))
    showToast('Project deleted', 'success')
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Welcome back, Planner</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Track projects and generate structured outputs.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/create-project">
            <Button type="button" variant="secondary">Open Create Project Page</Button>
          </Link>
          <Button type="button" onClick={() => setIsCreateModalOpen(true)}>Create New Project</Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">Total Projects</p>
          <p className="mt-2 text-xl font-semibold">{totalProjects}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Current Focus</p>
          <p className="mt-2 text-xl font-semibold">Stage-based Planning</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Generated Outputs</p>
          <p className="mt-2 text-xl font-semibold">0</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Prompt Packs</p>
          <p className="mt-2 text-xl font-semibold">0</p>
        </Card>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Your Projects</h3>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-32 rounded-xl bg-gray-200 animate-pulse dark:bg-gray-700" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-slate-300 bg-white text-center dark:border-slate-700 dark:bg-slate-900">
            <h4 className="text-2xl font-semibold">No Projects Yet</h4>
            <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">
              Start building your first AI-powered project.
            </p>
            <Button type="button" onClick={() => navigate('/create-project')}>
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id}>
                <h4 className="font-semibold">{project.title}</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.category}</p>
                <p className="mt-1 text-xs text-slate-500">Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                <p className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                  Stage {project.currentStage} / {TOTAL_STAGES} Completed
                </p>
                <div className="mt-4 flex gap-2">
                  <Button
                    type="button"
                    onClick={() => navigate(`/workspace/${project.id}`)}
                  >
                    Open Workspace
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => handleDelete(project.id)}>Delete</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}

export default DashboardPage
