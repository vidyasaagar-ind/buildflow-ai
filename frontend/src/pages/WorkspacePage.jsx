import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BlueprintPanel from '../components/workspace/BlueprintPanel'
import StageChatPanel from '../components/workspace/StageChatPanel'
import StageNavigator from '../components/workspace/StageNavigator'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Skeleton from '../components/ui/Skeleton'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getUserSettings } from '../services/firestoreService'
import { getProjectById, TOTAL_STAGES, updateProjectById } from '../utils/projectStorage'

const BASE_URL = import.meta.env.VITE_BACKEND_URL

const stages = [
  { key: 'stage1', title: 'Idea and Goal' },
  { key: 'stage2', title: 'Target Users and Use Case' },
  { key: 'stage3', title: 'Core Features' },
  { key: 'stage4', title: 'UI/UX Preferences' },
  { key: 'stage5', title: 'Tech Stack and Integrations' },
  { key: 'stage6', title: 'Output Generation' },
]

function getStageMessages(messages, stageNumber) {
  return messages?.[`stage${stageNumber}`] || []
}

function WorkspacePage() {
  const { projectId } = useParams()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Blueprint')
  const [project, setProject] = useState(null)
  const [selectedStage, setSelectedStage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isThinking, setIsThinking] = useState(false)
  const [draftAnswer, setDraftAnswer] = useState('')
  const [userRole, setUserRole] = useState('')
  const [stageCompletionMap, setStageCompletionMap] = useState({})
  const { showToast } = useToast()

  useEffect(() => {
    if (!project?.completedStages || !Array.isArray(project.completedStages)) return
    const map = {}
    project.completedStages.forEach((stageNo) => {
      map[`stage${stageNo}`] = true
    })
    setStageCompletionMap(map)
  }, [project?.id, project?.completedStages])

  useEffect(() => {
    if (!user) return
    const loadProject = async () => {
      setIsLoading(true)
      const loadedProject = await getProjectById(projectId, user.uid)
      setProject(loadedProject)
      setIsLoading(false)
    }
    loadProject()
  }, [projectId, user])

  useEffect(() => {
    if (!user) return
    const loadRole = async () => {
      const settings = await getUserSettings(user.uid)
      setUserRole(settings?.role || '')
    }
    loadRole()
  }, [user])

  const progressStage = Math.min(Math.max(project?.currentStage ?? 1, 1), TOTAL_STAGES)
  const currentStage = Math.min(Math.max(selectedStage ?? progressStage, 1), TOTAL_STAGES)
  const currentStageMeta = useMemo(() => stages[currentStage - 1], [currentStage])
  const currentStageKey = `stage${currentStage}`

  const handleProjectUpdate = async (updater) => {
    if (!project?.id) return null
    const updated = await updateProjectById(project.id, updater, user.uid)
    if (updated) setProject(updated)
    return updated
  }

  const getStageNode = (blueprint, stageNumber) => {
    const stageKey = `stage${stageNumber}`
    const fallbackStatus = stageNumber === 1 ? 'in-progress' : 'pending'
    const node = blueprint?.[stageKey]
    if (!node || typeof node !== 'object') {
      return { status: fallbackStatus, answers: [], summary: '', questionIndex: 0 }
    }
    return {
      status: typeof node.status === 'string' ? node.status : fallbackStatus,
      answers: Array.isArray(node.answers) ? node.answers : [],
      summary: typeof node.summary === 'string' ? node.summary : '',
      questionIndex: Number.isInteger(node.questionIndex) ? node.questionIndex : 0,
    }
  }

  const ensureStageInitialized = async (stageNumber, baseProject = project) => {
    if (!baseProject || stageNumber > 5) return
    const stageKey = `stage${stageNumber}`
    const existingMessages = getStageMessages(baseProject.messages, stageNumber)
    if (existingMessages.length) return

    const stageNode = getStageNode(baseProject.blueprint, stageNumber)
    let response = {}
    try {
      response = await callChatApi(baseProject, [], stageNumber)
    } catch (error) {
      response = { reply: 'Please share more details for this stage.', next_question_index: stageNode.questionIndex }
    }
    const assistantMessage = { role: 'assistant', content: response.reply || 'Please share details for this stage.' }

    await handleProjectUpdate((existing) => ({
      ...existing,
      blueprint: {
        ...existing.blueprint,
        [stageKey]: {
          ...getStageNode(existing.blueprint, stageNumber),
          questionIndex: Number.isInteger(response.next_question_index) ? response.next_question_index : stageNode.questionIndex,
          status: stageNumber === 1 && getStageNode(existing.blueprint, stageNumber).status === 'pending'
            ? 'in-progress'
            : getStageNode(existing.blueprint, stageNumber).status,
        },
      },
      messages: {
        ...existing.messages,
        [stageKey]: [assistantMessage],
      },
    }))
  }

  const callChatApi = async (projectData, outgoingMessages, stageNumber) => {
    if (!BASE_URL) {
      throw new Error('Backend URL is not configured. Set VITE_BACKEND_URL in frontend environment.')
    }

    const payload = {
      projectId: projectData.id,
      currentStage: stageNumber,
      blueprint: {
        stage1: projectData.blueprint.stage1,
        stage2: projectData.blueprint.stage2,
        stage3: projectData.blueprint.stage3,
        stage4: projectData.blueprint.stage4,
        stage5: projectData.blueprint.stage5,
      },
      questionIndex: getStageNode(projectData.blueprint, stageNumber).questionIndex,
      projectSummary: {
        title: projectData.title,
        idea: projectData.idea,
      },
      role: userRole,
      previousStagesData: {
        stage1: projectData.blueprint.stage1,
        stage2: projectData.blueprint.stage2,
        stage3: projectData.blueprint.stage3,
        stage4: projectData.blueprint.stage4,
        stage5: projectData.blueprint.stage5,
      },
      projectContext: {
        title: projectData.title,
        category: projectData.category,
        idea: projectData.idea,
        targetUser: projectData.targetUser,
        deadline: projectData.deadline,
        stage1: projectData.blueprint.stage1,
        stage2: projectData.blueprint.stage2,
        stage3: projectData.blueprint.stage3,
        stage4: projectData.blueprint.stage4,
        stage5: projectData.blueprint.stage5,
      },
      messages: outgoingMessages.slice(-6).map((msg) => ({ role: msg.role, content: msg.content })),
    }

    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.message || 'Backend is unavailable. Please check your backend URL and deployment status.')
    }

    return response.json()
  }

  useEffect(() => {
    if (!project) return
    ensureStageInitialized(currentStage, project)
  }, [project?.id, currentStage])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
        <div className="grid gap-4 xl:grid-cols-[250px_1fr_340px]">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-semibold">Project not found</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">This workspace could not find your project in local storage.</p>
        <Link to="/dashboard" className="mt-4 inline-block">
          <Button type="button">Back to Dashboard</Button>
        </Link>
      </Card>
    )
  }

  const stageMessages = getStageMessages(project.messages, currentStage)
  const lastAssistantMessage = [...stageMessages].reverse().find((message) => message.role === 'assistant')
  const stageCompleteFromApi = Boolean(stageCompletionMap[currentStageKey])
  const isStageComplete = currentStage <= 5
    ? stageCompleteFromApi || getStageNode(project.blueprint, currentStage).status === 'completed'
    : false
  const completedStages = Array.isArray(project.completedStages) ? project.completedStages : []
  const isPreviewMode = currentStage !== progressStage

  const handleSendMessage = async () => {
    if (!draftAnswer.trim() || isThinking) return
    if (currentStage === 6) return

    if (completedStages.includes(currentStage)) {
      const infoMessage = { role: 'assistant', content: 'We have enough information. Move to next stage.' }
      await handleProjectUpdate((existing) => ({
        ...existing,
        messages: {
          ...existing.messages,
          [currentStageKey]: [...getStageMessages(existing.messages, currentStage), infoMessage],
        },
      }))
      showToast('Stage already completed', 'info')
      return
    }

    const userMessage = { role: 'user', content: draftAnswer.trim() }
    const outgoing = [...stageMessages, userMessage]

    await handleProjectUpdate((existing) => ({
      ...existing,
      messages: {
        ...existing.messages,
        [currentStageKey]: outgoing,
      },
    }))

    setDraftAnswer('')
    setIsThinking(true)

    try {
      const response = await callChatApi(project, outgoing, currentStage)
      await handleProjectUpdate((prev) => {
        const updated = {
          ...prev,
          blueprint: { ...prev.blueprint },
        }
        const currentNode = getStageNode(prev.blueprint, currentStage)
        const savedAnswer = (response.saved_answer || userMessage.content || '').trim()
        const nextAnswers = savedAnswer
          ? [...currentNode.answers, savedAnswer]
          : [...currentNode.answers]
        const extractedSummary = response.extracted?.[currentStageKey] || ''
        const nextSummary = (response.stage_summary || response.summary || extractedSummary || '').trim()
        const nextQuestionIndex = Number.isInteger(response.next_question_index)
          ? response.next_question_index
          : currentNode.questionIndex
        const stageCompleteNow = Boolean(response.stage_complete ?? response.stageComplete)

        updated.blueprint[currentStageKey] = {
          ...currentNode,
          answers: nextAnswers,
          questionIndex: nextQuestionIndex,
          summary: nextSummary || currentNode.summary,
          status: stageCompleteNow ? 'completed' : 'in-progress',
        }

        const existingCompleted = Array.isArray(prev.completedStages) ? [...prev.completedStages] : []
        const nextCompleted = stageCompleteNow && !existingCompleted.includes(currentStage)
          ? [...existingCompleted, currentStage]
          : existingCompleted
        const completionMessage = stageCompleteNow
          ? [{ role: 'assistant', content: "Great, we have enough information for this stage. Let's move to the next stage." }]
          : []

        return {
          ...updated,
          completedStages: nextCompleted,
          messages: {
            ...prev.messages,
            [currentStageKey]: [
              ...outgoing,
              { role: 'assistant', content: response.reply },
              ...completionMessage,
            ],
          },
        }
      })
      setStageCompletionMap((prev) => ({ ...prev, [currentStageKey]: Boolean(response.stageComplete) }))
      showToast('AI response received', 'success')
    } catch (error) {
      showToast(error.message || 'AI chat failed', 'error')
    } finally {
      setIsThinking(false)
    }
  }

  const handleContinue = async () => {
    const nextStage = Math.min(progressStage + 1, TOTAL_STAGES)
    const updated = await handleProjectUpdate((existing) => ({
      ...existing,
      currentStage: nextStage,
      blueprint: nextStage <= 5
        ? {
            ...existing.blueprint,
            [`stage${nextStage}`]: {
              ...getStageNode(existing.blueprint, nextStage),
              status: getStageNode(existing.blueprint, nextStage).status === 'pending'
                ? 'in-progress'
                : getStageNode(existing.blueprint, nextStage).status,
            },
          }
        : existing.blueprint,
      messages: {
        ...existing.messages,
        [`stage${nextStage}`]: existing.messages?.[`stage${nextStage}`] || [],
      },
    }))

    if (updated) {
      setProject(updated)
      setSelectedStage(nextStage)
      setDraftAnswer('')
      showToast(nextStage <= TOTAL_STAGES ? `Moved to Stage ${nextStage}` : 'Already at final stage', 'info')
      ensureStageInitialized(nextStage, updated)
    }
  }

  const handleStageClick = async (stageNumber) => {
    setSelectedStage(stageNumber)
    setDraftAnswer('')
    if (!getStageMessages(project.messages, stageNumber).length) {
      const updated = await handleProjectUpdate((existing) => ({
        ...existing,
        messages: {
          ...existing.messages,
          [`stage${stageNumber}`]: existing.messages?.[`stage${stageNumber}`] || [],
        },
      }))
      if (updated) ensureStageInitialized(stageNumber, updated)
    }
  }

  const progressPct = Math.round((progressStage / TOTAL_STAGES) * 100)

  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold">{project.title}</h2>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-200">
            {project.category}
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Stage {progressStage} of {TOTAL_STAGES} ({progressPct}%)</p>
        <div className="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-2 rounded-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-500" style={{ width: `${progressPct}%` }} />
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[250px_1fr_340px]">
        <StageNavigator stages={stages} currentStage={currentStage} onStageClick={handleStageClick} />
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">AI</div>
            <div>
              <p className="text-sm font-semibold">BuildFlow Chatbot</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">AI Planning Assistant</p>
            </div>
          </div>

          <StageChatPanel
            stage={currentStageMeta}
            stageIndex={currentStage}
            totalStages={TOTAL_STAGES}
            answer={draftAnswer}
            messages={stageMessages}
            isThinking={isThinking}
            isStageComplete={isStageComplete}
            isPreviewMode={isPreviewMode}
            onAnswerChange={setDraftAnswer}
            onSend={handleSendMessage}
            onContinue={handleContinue}
            onOpenOutputs={() => setActiveTab('Outputs')}
            onOpenPrompts={() => setActiveTab('Prompts')}
          />
        </div>

        <BlueprintPanel
          project={project}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onProjectUpdate={handleProjectUpdate}
        />
      </div>
    </div>
  )
}

export default WorkspacePage
