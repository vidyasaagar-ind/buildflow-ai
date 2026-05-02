import { Link, useNavigate } from 'react-router-dom'
import AppLogo from '../components/ui/AppLogo'
import ThemeToggle from '../components/ui/ThemeToggle'
import { useAuth } from '../context/AuthContext'

const featureCards = [
  {
    title: 'Guided AI Chat',
    description: 'Get focused clarification questions that keep planning structured from day one.',
  },
  {
    title: 'Structured Project Planning',
    description: 'Convert raw ideas into stage-based blueprint data you can actually build from.',
  },
  {
    title: 'Document Generation',
    description: 'Generate BRD, SRS, roadmap, and TODO documents from your planning flow.',
  },
  {
    title: 'Prompt-Based Development',
    description: 'Create practical prompts for coding agents and ship with better execution clarity.',
  },
]

const howItWorks = [
  {
    title: 'Describe your idea',
    description: 'Start with your project concept, users, and outcome in a few lines.',
  },
  {
    title: 'Answer guided questions',
    description: 'Refine scope through structured stage conversations.',
  },
  {
    title: 'Get complete project plan',
    description: 'Receive documents and prompts aligned to implementation.',
  },
]

function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleStartPlanning = () => {
    navigate(user ? '/create-project' : '/login')
  }

  const handleViewDashboard = () => {
    navigate(user ? '/dashboard' : '/login')
  }

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-7xl flex items-center justify-between py-4">
              <AppLogo />
              <div className="flex items-center gap-4 text-sm">
                <Link className="text-slate-600 transition-all duration-200 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white" to="/about">About</Link>
                <Link className="text-slate-600 transition-all duration-200 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white" to="/how-to-use">How to Use</Link>
                {!user ? (
                  <Link className="rounded-lg border border-slate-300 px-4 py-2 font-medium transition-all duration-200 hover:scale-105 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" to="/login">
                    Login
                  </Link>
                ) : (
                  <Link className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-indigo-700" to="/dashboard">
                    Dashboard
                  </Link>
                )}
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        <section className="w-full py-16">
          <div className="w-full px-6 md:px-12 lg:px-20">
            <div className="w-full flex justify-center">
              <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-5xl font-bold leading-tight">Plan Your Project with AI - The Right Way</h1>
                  <p className="mt-4 text-base md:text-lg text-gray-500 dark:text-slate-300">
                    Turn your idea into a complete project with structured guidance, documents, and AI-powered prompts.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={handleStartPlanning}
                      className="rounded-lg bg-indigo-600 px-6 py-3 text-white transition-all duration-200 hover:scale-105 hover:bg-indigo-700"
                    >
                      Start Planning
                    </button>
                    <button
                      type="button"
                      onClick={handleViewDashboard}
                      className="rounded-lg border border-slate-300 px-6 py-3 transition-all duration-200 hover:scale-105 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                    >
                      View Dashboard
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="grid gap-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Assistant</p>
                      <p className="mt-1">What problem does your project solve, and who benefits most?</p>
                    </div>
                    <div className="ml-8 rounded-lg bg-indigo-600 p-3 text-sm text-white">
                      A planning assistant for students and freelancers who need full project docs before coding.
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Outputs</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <span className="rounded border border-slate-300 px-2 py-1 dark:border-slate-600">BRD</span>
                        <span className="rounded border border-slate-300 px-2 py-1 dark:border-slate-600">SRS</span>
                        <span className="rounded border border-slate-300 px-2 py-1 dark:border-slate-600">Roadmap</span>
                        <span className="rounded border border-slate-300 px-2 py-1 dark:border-slate-600">Prompt Pack</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-8">
          <p className="text-center text-sm text-slate-400">Built for Students, Freelancers, and Builders</p>
        </section>

        <section className="w-full py-16">
          <div className="w-full px-6 md:px-12 lg:px-20">
            <div className="w-full flex justify-center">
              <div className="w-full max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {featureCards.map((item) => (
                    <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:shadow-lg dark:border-slate-800 dark:bg-gray-900">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16">
          <div className="w-full px-6 md:px-12 lg:px-20">
            <div className="w-full flex justify-center">
              <div className="w-full max-w-7xl">
                <h2 className="text-2xl font-semibold text-center">How It Works</h2>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  {howItWorks.map((step, index) => (
                    <div key={step.title} className="rounded-xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:shadow-lg dark:border-slate-800 dark:bg-gray-900">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <h3 className="mt-4 font-semibold">{step.title}</h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16">
          <div className="w-full px-6 md:px-12 lg:px-20">
            <div className="w-full flex justify-center">
              <div className="w-full max-w-7xl text-center">
                <h2 className="text-3xl md:text-5xl font-bold">Start Building Smarter Today</h2>
                <p className="mx-auto mt-3 max-w-xl text-base md:text-lg text-gray-500 dark:text-slate-300">
                  Plan faster, reduce confusion, and move into development with clear direction.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="button"
                    onClick={handleStartPlanning}
                    className="rounded-lg bg-indigo-600 px-6 py-3 text-white transition-all duration-200 hover:scale-105 hover:bg-indigo-700"
                  >
                    Create Your First Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full text-center py-6 border-t border-slate-200 text-sm text-gray-500 dark:border-slate-800 dark:text-gray-400">
        © 2026 BuildFlow AI — Designed for students, developers, and creators.
      </footer>
    </div>
  )
}

export default LandingPage
