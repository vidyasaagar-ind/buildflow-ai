const express = require('express')
const { callAI } = require('../services/aiService')

const router = express.Router()

const stageTemplates = {
  stage1: [
    'What is the primary goal of this project?',
    'What problem does it solve?',
    'What outcome should users achieve?',
    'What makes this project unique?',
    'What are the success criteria?',
  ],
  stage2: [
    'Who are the main users?',
    'What is the primary user workflow?',
    'What problems do users face today?',
    'Which actions should users perform most often?',
    'What devices will they use?',
  ],
  stage3: [
    'What features are essential?',
    'Which feature is highest priority?',
    'Are authentication and user roles needed?',
    'Should there be notifications or dashboards?',
    'Are there AI capabilities?',
  ],
  stage4: [
    'What design style do you prefer?',
    'Do you want light and dark themes?',
    'What pages or screens are needed?',
    'Which websites inspire the design?',
    'Is mobile responsiveness required?',
  ],
  stage5: [
    'Preferred frontend framework?',
    'Preferred backend technology?',
    'Preferred database?',
    'Third-party APIs or integrations?',
    'Hosting and deployment platform?',
  ],
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeInteger(value, fallback = 0) {
  return Number.isInteger(value) ? value : fallback
}

function normalizeBoolean(value) {
  return typeof value === 'boolean' ? value : false
}

function parseAiJson(raw) {
  if (typeof raw !== 'string') return null
  try {
    return JSON.parse(raw)
  } catch {
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) return null
    try {
      return JSON.parse(match[0])
    } catch {
      return null
    }
  }
}

function stageLabel(stageNumber) {
  const labels = {
    1: 'Idea & Goal',
    2: 'Target Users & Use Cases',
    3: 'Core Features',
    4: 'UI/UX',
    5: 'Tech Stack & Integrations',
  }
  return labels[stageNumber] || 'Unknown Stage'
}

function getStageNode(blueprint, stageKey) {
  const node = blueprint?.[stageKey]
  if (!node || typeof node !== 'object') {
    return { status: stageKey === 'stage1' ? 'in-progress' : 'pending', answers: [], summary: '', questionIndex: 0 }
  }
  return {
    status: normalizeString(node.status) || (stageKey === 'stage1' ? 'in-progress' : 'pending'),
    answers: Array.isArray(node.answers) ? node.answers.filter((entry) => normalizeString(entry)) : [],
    summary: normalizeString(node.summary),
    questionIndex: Number.isInteger(node.questionIndex) ? node.questionIndex : 0,
  }
}

function getPreviousSummaries(blueprint, stageNumber) {
  const lines = []
  for (let i = 1; i < stageNumber; i += 1) {
    const key = `stage${i}`
    const node = getStageNode(blueprint, key)
    if (node.summary) lines.push(`${key}: ${node.summary}`)
  }
  return lines.length ? lines.join('\n') : 'None yet.'
}

function normalizeStageUpdates(input, stageKey, summaryFallback = '') {
  const base = { stage1: '', stage2: '', stage3: '', stage4: '', stage5: '' }
  if (!input || typeof input !== 'object') {
    if (summaryFallback) base[stageKey] = summaryFallback
    return base
  }
  const out = {
    stage1: normalizeString(input.stage1),
    stage2: normalizeString(input.stage2),
    stage3: normalizeString(input.stage3),
    stage4: normalizeString(input.stage4),
    stage5: normalizeString(input.stage5),
  }
  if (summaryFallback && !out[stageKey]) out[stageKey] = summaryFallback
  return out
}

async function rewriteTemplateQuestion({
  templateQuestion,
  projectContext,
  stageNumber,
  questionIndex,
  previousSummaries,
  stageAnswers,
}) {
  const stageGuard = {
    1: 'Only ask about goals, problem, outcomes, uniqueness, success criteria. Do NOT ask UI, tech stack, deployment, or integrations.',
    2: 'Only ask about users, workflows, pain points, frequent actions, and devices. Do NOT ask UI style, tech stack, or deployment.',
    3: 'Only ask about features, priorities, auth, dashboards/notifications, and AI capabilities. Do NOT ask UI style or hosting.',
    4: 'Only ask about design style, themes, pages/screens, inspiration, accessibility/responsiveness. Do NOT ask backend/database/deployment.',
    5: 'Only ask about frontend/backend/database/APIs/hosting/auth-storage choices. Do NOT ask basic goal or UI inspiration.',
  }[stageNumber] || 'Stay strictly within current stage scope.'

  const prompt = `Rewrite this template into ONE project-specific question.

Template Question:
${templateQuestion}

Project Title: ${normalizeString(projectContext?.title)}
Category: ${normalizeString(projectContext?.category)}
Detailed Idea: ${normalizeString(projectContext?.idea)}
Target Users: ${normalizeString(projectContext?.targetUser)}
Deadline: ${normalizeString(projectContext?.deadline)}
Current Stage: Stage ${stageNumber} - ${stageLabel(stageNumber)}
Question Index: ${questionIndex}
Previous Blueprint Memory:
${previousSummaries}
Current Stage Answers:
${stageAnswers.length ? stageAnswers.map((a, i) => `${i + 1}. ${a}`).join('\n') : 'None yet.'}

Rules:
- Ask only one concise professional question.
- Make it specific to the project details.
- Do not ask obvious details already present in project context.
- Do not repeat answered information.
- ${stageGuard}
- Return ONLY JSON:
{"reply":"..."}
`

  const raw = await callAI([
    { role: 'system', content: 'You rewrite template questions into highly contextual project-specific questions. Output valid JSON only.' },
    { role: 'user', content: prompt },
  ])
  const parsed = parseAiJson(raw)
  const reply = normalizeString(parsed?.reply)
  return reply || templateQuestion
}

async function summarizeStage({
  stageNumber,
  projectContext,
  answers,
  previousSummaries,
}) {
  const prompt = `Create a concise structured summary for Stage ${stageNumber} (${stageLabel(stageNumber)}).

Project Title: ${normalizeString(projectContext?.title)}
Category: ${normalizeString(projectContext?.category)}
Detailed Idea: ${normalizeString(projectContext?.idea)}
Target Users: ${normalizeString(projectContext?.targetUser)}
Deadline: ${normalizeString(projectContext?.deadline)}
Previous Blueprint Memory:
${previousSummaries}

Collected Stage Answers:
${answers.map((answer, idx) => `${idx + 1}. ${answer}`).join('\n')}

Return ONLY JSON:
{
  "reply": "This stage is complete. Click continue to move to the next stage.",
  "stage_summary": "short structured summary"
}`

  const raw = await callAI([
    { role: 'system', content: 'You summarize collected stage answers into a concise planning summary. Output valid JSON only.' },
    { role: 'user', content: prompt },
  ])
  const parsed = parseAiJson(raw)
  return {
    reply: normalizeString(parsed?.reply) || 'This stage is complete. Click continue to move to the next stage.',
    summary: normalizeString(parsed?.stage_summary) || answers.join(' ').slice(0, 350),
  }
}

router.post('/', async (req, res) => {
  try {
    const {
      currentStage = 1,
      questionIndex = 0,
      messages = [],
      blueprint = {},
      projectContext = {},
    } = req.body || {}

    const stageNumber = Number(currentStage) || 1
    const stageKey = `stage${stageNumber}`

    if (stageNumber === 6) {
      return res.json({
        reply: 'Planning completed successfully.',
        question_complete: true,
        stage_complete: true,
        stage_summary: '',
        saved_answer: '',
        next_question_index: 0,
        stage_updates: {},
        stageComplete: true,
        summary: '',
        extracted: {},
      })
    }

    const stageNode = getStageNode(blueprint, stageKey)
    const templates = stageTemplates[stageKey] || []
    const previousSummaries = getPreviousSummaries(blueprint, stageNumber)
    const latestUserMessage = [...(messages || [])]
      .reverse()
      .find((message) => message?.role === 'user' && normalizeString(message?.content))
    const latestAnswer = normalizeString(latestUserMessage?.content)
    const isInitial = !latestAnswer && (!Array.isArray(messages) || messages.length === 0)

    if (isInitial) {
      const idx = Math.min(Math.max(stageNode.questionIndex, 0), Math.max(templates.length - 1, 0))
      const templateQuestion = templates[idx] || 'Please describe your requirements for this stage.'
      const rewritten = await rewriteTemplateQuestion({
        templateQuestion,
        projectContext,
        stageNumber,
        questionIndex: idx,
        previousSummaries,
        stageAnswers: stageNode.answers,
      })

      return res.json({
        reply: rewritten,
        question_complete: false,
        stage_complete: false,
        stage_summary: stageNode.summary || '',
        saved_answer: '',
        next_question_index: idx,
        stage_updates: {},
        stageComplete: false,
        summary: stageNode.summary || '',
        extracted: {},
      })
    }

    if (!latestAnswer) {
      return res.json({
        reply: 'Please share your answer so I can continue this stage.',
        question_complete: false,
        stage_complete: false,
        stage_summary: stageNode.summary || '',
        saved_answer: '',
        next_question_index: stageNode.questionIndex,
        stage_updates: {},
        stageComplete: false,
        summary: stageNode.summary || '',
        extracted: {},
      })
    }

    const answers = [...stageNode.answers, latestAnswer]
    const stageComplete = answers.length >= 5

    if (stageComplete) {
      const summarized = await summarizeStage({
        stageNumber,
        projectContext,
        answers,
        previousSummaries,
      })
      const stageUpdates = normalizeStageUpdates({}, stageKey, summarized.summary)
      return res.json({
        reply: summarized.reply,
        question_complete: true,
        stage_complete: true,
        stage_summary: summarized.summary,
        saved_answer: latestAnswer,
        next_question_index: 5,
        stage_updates: stageUpdates,
        stageComplete: true,
        summary: summarized.summary,
        extracted: stageUpdates,
      })
    }

    const nextIndex = Math.min(normalizeInteger(questionIndex, stageNode.questionIndex) + 1, templates.length - 1)
    const templateQuestion = templates[nextIndex] || 'Please provide more details for this stage.'
    const rewritten = await rewriteTemplateQuestion({
      templateQuestion,
      projectContext,
      stageNumber,
      questionIndex: nextIndex,
      previousSummaries,
      stageAnswers: answers,
    })

    return res.json({
      reply: rewritten,
      question_complete: true,
      stage_complete: false,
      stage_summary: stageNode.summary || '',
      saved_answer: latestAnswer,
      next_question_index: nextIndex,
      stage_updates: {},
      stageComplete: false,
      summary: stageNode.summary || '',
      extracted: {},
    })
  } catch (error) {
    return res.status(500).json({
      error: 'CHAT_ROUTE_ERROR',
      message: error.message || 'Chat request failed',
    })
  }
})

module.exports = router
