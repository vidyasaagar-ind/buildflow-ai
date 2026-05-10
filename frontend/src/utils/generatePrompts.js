function valueOrFallback(value) {
  const cleaned = (value || '').trim()
  return cleaned || 'To be defined'
}

function stageText(stage) {
  if (typeof stage === 'string') return valueOrFallback(stage)
  if (!stage || typeof stage !== 'object') return 'To be defined'

  const summary = typeof stage.summary === 'string' ? stage.summary.trim() : ''
  const answers = Array.isArray(stage.answers)
    ? stage.answers.filter((entry) => typeof entry === 'string' && entry.trim())
    : []

  return valueOrFallback([summary, ...answers].filter(Boolean).join('\n'))
}

function buildContext(project) {
  return {
    title: valueOrFallback(project.title),
    category: valueOrFallback(project.category),
    targetUser: valueOrFallback(project.targetUser),
    idea: valueOrFallback(project.idea),
    features: stageText(project.blueprint?.stage3),
    uiux: stageText(project.blueprint?.stage4),
    stack: stageText(project.blueprint?.stage5),
    stage1: stageText(project.blueprint?.stage1),
    stage2: stageText(project.blueprint?.stage2),
    todo: valueOrFallback(project.outputs?.todo),
  }
}

function composePrompt({ title, agent, task, expectedOutput, stackHint, context }) {
  return {
    title,
    agent,
    content: `Title: ${title}\n\nYou are working on a project:\n\n${context.title}\n\nProject Context:\n- Category: ${context.category}\n- Target Users: ${context.targetUser}\n- Core Idea: ${context.idea}\n- Features: ${context.features}\n\nYour Task:\n${task}\n\nConstraints:\n- Use ${stackHint}\n- Follow modular structure\n- Write clean and maintainable code\n\nExpected Output:\n${expectedOutput}\n\nSelf-check:\n- Run project\n- Fix errors\n- Verify UI/logic`,
  }
}

export function generateDevPrompts(project) {
  const context = buildContext(project)
  const stackHint = context.stack === 'To be defined' ? 'React + Vite + Tailwind' : context.stack

  return [
    composePrompt({
      title: 'Task 1: Setup project foundation',
      agent: 'codex',
      task: 'Set up project folders, shared components, and base utilities for scalable feature implementation.',
      expectedOutput:
        '- Organized folder structure\n- Reusable UI primitives and layout wrappers\n- App should run with clean imports and no runtime errors',
      stackHint,
      context,
    }),
    composePrompt({
      title: 'Task 2: Implement routing and navigation flow',
      agent: 'codex',
      task: 'Implement and validate route flow across landing, auth UI, dashboard, workspace, and settings pages.',
      expectedOutput:
        '- Stable route setup\n- Navigation links for all key pages\n- Route transitions working without broken links',
      stackHint,
      context,
    }),
    composePrompt({
      title: 'Task 3: Build authentication UI screens',
      agent: 'codex',
      task: 'Build clean login and signup interfaces with validation-ready form structure (UI only).',
      expectedOutput:
        '- Login and signup screens with consistent styles\n- Reusable form field patterns\n- No real auth integration included',
      stackHint,
      context,
    }),
    composePrompt({
      title: 'Task 4: Build dashboard and workspace core',
      agent: 'antigravity',
      task: 'Implement dashboard project listing and workspace layout with stage progress visibility and local state handling.',
      expectedOutput:
        '- Dashboard cards with progress indicators\n- Workspace panel layout and stage UI\n- LocalStorage state synced to UI',
      stackHint,
      context,
    }),
    composePrompt({
      title: 'Task 5: Implement core feature modules',
      agent: 'antigravity',
      task: `Implement feature modules from planning inputs:\n${context.features}`,
      expectedOutput:
        '- Feature-specific components/services\n- Clear separation of concerns\n- End-to-end feature flow testable in app',
      stackHint,
      context,
    }),
  ]
}

export function generateUIPrompts(project) {
  const context = buildContext(project)
  const stackHint = context.stack === 'To be defined' ? 'React + Vite + Tailwind' : context.stack

  return [
    composePrompt({
      title: 'Task 1: Refine landing page hierarchy',
      agent: 'codex',
      task: 'Polish landing page visual hierarchy with a strong hero, problem framing, and clear CTA flow.',
      expectedOutput:
        '- Cohesive SaaS-style landing layout\n- Professional spacing/typography\n- Mobile and desktop responsive behavior',
      stackHint,
      context,
    }),
    composePrompt({
      title: 'Task 2: Standardize workspace UI patterns',
      agent: 'codex',
      task: 'Unify stage panel, blueprint/output/prompt panel visuals, and improve readability for long-form content.',
      expectedOutput:
        '- Consistent cards/buttons/tabs\n- Scrollable, readable panels\n- Clear stage progression cues',
      stackHint,
      context,
    }),
    composePrompt({
      title: 'Task 3: Improve responsiveness and accessibility',
      agent: 'antigravity',
      task: 'Audit key screens for responsive breakpoints, keyboard usability, and color contrast in light/dark themes.',
      expectedOutput:
        '- Responsive fixes for small/medium screens\n- Better focus states and semantic labels\n- Improved contrast compliance',
      stackHint,
      context,
    }),
    composePrompt({
      title: 'Task 4: Apply UI/UX preference customizations',
      agent: 'antigravity',
      task: `Adapt UI tone and patterns based on planning preferences:\n${context.uiux}`,
      expectedOutput:
        '- Visual style aligned with chosen direction\n- Theme elements applied consistently\n- Reusable style tokens where relevant',
      stackHint,
      context,
    }),
  ]
}

export function generateBackendPrompts(project) {
  const context = buildContext(project)
  const stackHint = context.stack === 'To be defined' ? 'React + Vite + Tailwind with planned backend stack' : context.stack

  return [
    composePrompt({
      title: 'Task 1: Define backend architecture skeleton',
      agent: 'antigravity',
      task: 'Design service modules, API versioning strategy, and directory layout for a scalable backend.',
      expectedOutput:
        '- Backend folder and module architecture\n- API route grouping strategy\n- Local run instructions for backend skeleton',
      stackHint,
      context,
    }),
    composePrompt({
      title: 'Task 2: Draft database schema',
      agent: 'antigravity',
      task: `Create a database schema draft aligned with project requirements and tasks:\n${context.todo}`,
      expectedOutput:
        '- Entity list with relationships\n- Key fields and constraints\n- Migration-ready schema plan',
      stackHint,
      context,
    }),
    composePrompt({
      title: 'Task 3: Plan authentication and authorization endpoints',
      agent: 'codex',
      task: 'Specify auth endpoints, token/session strategy, and role-access rules for primary user flows.',
      expectedOutput:
        '- Endpoint contract list\n- Validation/error response structure\n- Role-based access outline',
      stackHint,
      context,
    }),
    composePrompt({
      title: 'Task 4: Design core project APIs',
      agent: 'codex',
      task: `Design APIs for project lifecycle and planning outputs using requirements:\n${context.stage1}\n${context.stage2}`,
      expectedOutput:
        '- CRUD endpoints for projects and stages\n- Output/prompt generation endpoints\n- API docs with request/response examples',
      stackHint,
      context,
    }),
  ]
}

export function generateDeploymentPrompts(project) {
  const context = buildContext(project)
  const stackHint = context.stack === 'To be defined' ? 'React + Vite + Tailwind' : context.stack

  return [
    composePrompt({
      title: 'Task 1: Prepare production build pipeline',
      agent: 'codex',
      task: 'Set up production build commands, output validation, and pre-deployment checks.',
      expectedOutput:
        '- Working build script\n- Build artifact validation checklist\n- Clear failure handling steps',
      stackHint,
      context,
    }),
    composePrompt({
      title: 'Task 2: Configure Vercel hosting',
      agent: 'antigravity',
      task: 'Configure Vercel project settings, route handling, and deployment commands for frontend app.',
      expectedOutput:
        '- Vercel configuration file/settings\n- Correct SPA routing behavior\n- Repeatable deployment process',
      stackHint,
      context,
    }),
    composePrompt({
      title: 'Task 3: Define environment variable strategy',
      agent: 'antigravity',
      task: 'Document required environment variables for development, preview, and production environments.',
      expectedOutput:
        '- .env variable definitions\n- Safe defaults and secrets guidance\n- Environment setup instructions',
      stackHint,
      context,
    }),
    composePrompt({
      title: 'Task 4: Final release and smoke test',
      agent: 'codex',
      task: 'Create a release checklist and smoke test plan covering auth UI, workspace flow, outputs, and prompts.',
      expectedOutput:
        '- Release checklist\n- Post-deploy smoke test scenarios\n- Rollback guidance for failed releases',
      stackHint,
      context,
    }),
  ]
}
