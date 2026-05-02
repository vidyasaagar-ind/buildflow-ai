import Card from '../components/ui/Card'

const featureCards = [
  {
    title: 'Smart Chatbot',
    description: 'Guides users through structured clarification instead of random prompt cycles.',
  },
  {
    title: 'Blueprint System',
    description: 'Builds stage-wise project understanding for idea, users, features, UI, and stack.',
  },
  {
    title: 'Document Generator',
    description: 'Converts structured planning into BRD, SRS, roadmap, and TODO outputs.',
  },
  {
    title: 'Prompt Generator',
    description: 'Creates task-by-task prompts for coding agents like Codex and Antigravity.',
  },
]

const userGroups = [
  'Students',
  'Beginners',
  'Freelancers',
  'Small Business Owners',
]

const teamMembers = [
  {
    name: 'VIDYASAAGAR M',
    registerNumber: '23TD0091',
    role: 'Full Stack Developer & Project Lead',
  },
  {
    name: 'AJAY M',
    registerNumber: '23TD0003',
    role: 'Team Member',
  },
  {
    name: 'SHAFI AHMED F',
    registerNumber: '23TD0076',
    role: 'Team Member',
  },
]

function AboutPage() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 py-10 space-y-10">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold">About BuildFlow AI</h2>
        <p className="leading-relaxed text-gray-600 dark:text-gray-300">
          BuildFlow AI is an AI-based planning assistant that transforms raw ideas into structured project execution plans for students, beginners, freelancers, and small businesses.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-2xl font-semibold">Project Overview</h3>
        <p className="leading-relaxed text-gray-600 dark:text-gray-300">
          Instead of random prompting, BuildFlow AI uses a guided, stage-by-stage workflow that captures requirements, organizes thinking, and prepares practical planning outputs before development starts.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-2xl font-semibold">Problem We Solve</h3>
          <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
            Popular AI tools are powerful but often unstructured for project execution. Many users waste free-tier tokens, receive fragmented suggestions, and struggle to convert conversations into complete, build-ready plans.
          </p>
        </Card>
        <Card>
          <h3 className="text-2xl font-semibold">Our Solution</h3>
          <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
            BuildFlow AI provides guided chatbot planning, stage-based blueprint generation, and automatic document and prompt outputs so users can confidently move from idea to implementation.
          </p>
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Core Features</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {featureCards.map((item) => (
            <Card key={item.title}>
              <h4 className="font-semibold">{item.title}</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Who It Is For</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {userGroups.map((group) => (
            <Card key={group} className="text-center">
              <p className="text-sm font-semibold">{group}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Team</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {teamMembers.map((member) => (
            <div
              key={member.registerNumber}
              className={`rounded-xl border bg-white p-5 text-center transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 ${
                member.role.includes('Lead') ? 'scale-105 border-2 border-indigo-500 shadow-lg' : ''
              }`}
            >
              <p className="text-lg font-semibold">{member.name}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Register No: {member.registerNumber}</p>
              <p className="mt-1 text-sm text-indigo-600 dark:text-indigo-300">Role: {member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-2xl font-semibold">Vision and Future Scope</h3>
        <p className="leading-relaxed text-gray-600 dark:text-gray-300">
          We aim to improve AI extraction accuracy, strengthen stage intelligence, and evolve BuildFlow AI into a full SaaS platform with stronger collaboration and deployment assistance for real-world teams.
        </p>
      </section>
    </div>
  )
}

export default AboutPage
