import {
  createProject as createProjectDoc,
  deleteProject as deleteProjectDoc,
  getProjectById as getProjectByIdDoc,
  getProjects as getProjectsDocs,
  updateProject as updateProjectDoc,
} from '../services/firestoreService'

export const TOTAL_STAGES = 6

const defaultBlueprint = {
  stage1: { status: 'in-progress', answers: [], summary: '', questionIndex: 0 },
  stage2: { status: 'pending', answers: [], summary: '', questionIndex: 0 },
  stage3: { status: 'pending', answers: [], summary: '', questionIndex: 0 },
  stage4: { status: 'pending', answers: [], summary: '', questionIndex: 0 },
  stage5: { status: 'pending', answers: [], summary: '', questionIndex: 0 },
}

const defaultOutputs = {
  brd: '',
  srs: '',
  roadmap: '',
  todo: '',
}

const defaultPrompts = {
  dev: [],
  ui: [],
  backend: [],
  deployment: [],
}

const defaultMessages = {
  stage1: [],
  stage2: [],
  stage3: [],
  stage4: [],
  stage5: [],
  stage6: [],
}

function normalizeProject(project) {
  const rawStage = project?.currentStage
  const currentStage = Number.isInteger(rawStage)
    ? Math.min(Math.max(rawStage, 1), TOTAL_STAGES)
    : 1

  const normalizedMessages = (() => {
    if (Array.isArray(project?.messages)) {
      return {
        ...defaultMessages,
        stage1: project.messages,
      }
    }

    if (project?.messages && typeof project.messages === 'object') {
      return {
        ...defaultMessages,
        ...project.messages,
      }
    }

    return { ...defaultMessages }
  })()

  const normalizeStageNode = (value, stageNumber) => {
    const base = {
      status: stageNumber === 1 ? 'in-progress' : 'pending',
      answers: [],
      summary: '',
      questionIndex: 0,
    }

    if (typeof value === 'string') {
      return {
        ...base,
        status: value.trim() ? 'completed' : base.status,
        summary: value.trim(),
      }
    }

    if (value && typeof value === 'object') {
      const answers = Array.isArray(value.answers)
        ? value.answers.filter((entry) => typeof entry === 'string' && entry.trim())
        : []
      const summary = typeof value.summary === 'string' ? value.summary.trim() : ''
      const status = typeof value.status === 'string' ? value.status : base.status
      const questionIndex = Number.isInteger(value.questionIndex) ? Math.max(value.questionIndex, 0) : base.questionIndex
      return {
        ...base,
        status,
        answers,
        summary,
        questionIndex,
      }
    }

    return base
  }

  return {
    ...project,
    id: project?.id,
    userId: project?.userId || null,
    title: (project?.title || '').trim() || 'Untitled Project',
    category: project?.category || 'Other',
    idea: project?.idea || '',
    targetUser: project?.targetUser || '',
    deadline: project?.deadline || '',
    createdAt: project?.createdAt || new Date().toISOString(),
    currentStage,
    blueprint: {
      stage1: normalizeStageNode(project?.blueprint?.stage1, 1),
      stage2: normalizeStageNode(project?.blueprint?.stage2, 2),
      stage3: normalizeStageNode(project?.blueprint?.stage3, 3),
      stage4: normalizeStageNode(project?.blueprint?.stage4, 4),
      stage5: normalizeStageNode(project?.blueprint?.stage5, 5),
    },
    outputs: {
      ...defaultOutputs,
      ...(project?.outputs || {}),
    },
    prompts: {
      ...defaultPrompts,
      ...(project?.prompts || {}),
    },
    messages: normalizedMessages,
  }
}

function isValidImportProject(project) {
  return Boolean(project && typeof project === 'object' && project.title)
}

export async function getProjects(userId) {
  const projects = await getProjectsDocs(userId)
  return projects.map(normalizeProject).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function createProject(input, userId) {
  const now = new Date().toISOString()
  const payload = normalizeProject({
    userId,
    title: input.title.trim(),
    category: input.category,
    idea: input.idea.trim(),
    targetUser: input.targetUser.trim(),
    deadline: input.deadline || '',
    createdAt: now,
    currentStage: 1,
    blueprint: { ...defaultBlueprint },
    outputs: { ...defaultOutputs },
    prompts: { ...defaultPrompts },
    messages: { ...defaultMessages },
  })

  return createProjectDoc(payload, userId)
}

export async function getProjectById(projectId, userId = null) {
  const found = await getProjectByIdDoc(projectId)
  if (!found) return null
  const normalized = normalizeProject(found)
  if (!userId) return normalized
  return normalized.userId === userId ? normalized : null
}

export async function updateProjectById(projectId, updater, userId = null) {
  const currentProject = await getProjectById(projectId, userId)
  if (!currentProject) return null

  const updated = normalizeProject(updater(currentProject))
  const { id, ...data } = updated
  await updateProjectDoc(projectId, data)
  return updated
}

export async function deleteProjectById(projectId, userId = null) {
  const target = await getProjectById(projectId, userId)
  if (!target) return false
  await deleteProjectDoc(projectId)
  return true
}

export async function exportProjectAsJson(projectId, userId = null) {
  const project = await getProjectById(projectId, userId)
  return project ? JSON.stringify(project, null, 2) : null
}

export async function importProjectFromJsonObject(jsonObject, userId) {
  if (!isValidImportProject(jsonObject)) return null

  const imported = normalizeProject({
    ...jsonObject,
    userId,
    createdAt: new Date().toISOString(),
  })

  const { id, ...data } = imported
  return createProjectDoc(data, userId)
}

export async function resetProject(projectId, mode = 'stages', userId = null) {
  return updateProjectById(projectId, (project) => {
    const resetStages = {
      ...project,
      currentStage: 1,
      blueprint: { ...defaultBlueprint },
      messages: { ...defaultMessages },
    }

    if (mode === 'all') {
      return {
        ...resetStages,
        outputs: { ...defaultOutputs },
        prompts: { ...defaultPrompts },
      }
    }

    return resetStages
  }, userId)
}
