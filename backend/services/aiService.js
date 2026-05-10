const axios = require('axios')

const SYSTEM_PROMPT = `You are a structured AI project planning assistant.

STRICT RULES:
- You MUST respond ONLY in valid JSON.
- DO NOT include markdown, explanations, or text outside JSON.
- DO NOT wrap JSON in \`\`\` or any formatting.
- Output MUST be directly parsable using JSON.parse().

STAGE RULES:
- Ask ONLY questions for the current stage.
- If user goes off-topic, redirect them politely.

COMPLETION RULE:
- When enough info is collected:
  'stage_complete': true

RESPONSE FORMAT (STRICT):
{
  "reply": "Your natural chatbot message",
  "question_complete": false,
  "stage_complete": false,
  "stage_summary": "Short structured summary",
  "saved_answer": "",
  "next_question_index": 0,
  "stage_updates": {
    "stage1": "",
    "stage2": "",
    "stage3": "",
    "stage4": "",
    "stage5": ""
  }
}

IMPORTANT:
- reply must be clean text
- Ask one question at a time
- Questions must be contextual to title/category/idea/target users/deadline
- NEVER include JSON inside reply
- NEVER break JSON format`

function ensureApiKey() {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey || apiKey === 'your_key_here') {
    throw new Error('OpenRouter API key is missing. Set OPENROUTER_API_KEY in backend/.env')
  }
  return apiKey
}

async function callOpenRouter(messages, temperature = 0.3) {
  const apiKey = ensureApiKey()

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'openai/gpt-3.5-turbo',
      messages,
      temperature,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 45000,
    },
  )

  return response?.data?.choices?.[0]?.message?.content?.trim() || ''
}

async function callAI(messages) {
  const output = await callOpenRouter(messages, 0.3)
  return output || '{"reply":"I could not generate a response right now.","stage_complete":false,"stage_summary":"","stage_updates":{"stage1":"","stage2":"","stage3":"","stage4":"","stage5":""}}'
}

function buildDocPrompt(type, project) {
  const docType = type.toUpperCase()
  const stageText = (stageValue) => {
    if (typeof stageValue === 'string') return stageValue
    if (!stageValue || typeof stageValue !== 'object') return ''
    const answers = Array.isArray(stageValue.answers) ? stageValue.answers.filter((entry) => typeof entry === 'string' && entry.trim()) : []
    const summary = typeof stageValue.summary === 'string' ? stageValue.summary.trim() : ''
    return [summary, ...answers].filter(Boolean).join('\n')
  }

  const baseContext = `Project Title: ${project.title || ''}
Category: ${project.category || ''}
Detailed Idea: ${project.idea || ''}
Target Users: ${project.targetUser || ''}
Deadline: ${project.deadline || ''}
Idea: ${stageText(project.blueprint?.stage1)}
Users: ${stageText(project.blueprint?.stage2)}
Features: ${stageText(project.blueprint?.stage3)}
UI/UX: ${stageText(project.blueprint?.stage4)}
Tech Stack: ${stageText(project.blueprint?.stage5)}`

  const typeInstructionMap = {
    brd: 'Generate a complete Business Requirements Document with business context, scope, objectives, user groups, requirements, success criteria, and risks.',
    srs: 'Generate a complete Software Requirements Specification with functional requirements, non-functional requirements, modules, user roles, and constraints.',
    roadmap: 'Generate a practical development roadmap with phases, timeline assumptions, milestones, and deliverables.',
    todo: 'Generate a detailed actionable TODO list grouped by frontend, backend, database, testing, and deployment tasks.',
  }

  return `You are a software project planning assistant.

Generate a detailed ${docType} document based on:

${baseContext}

Rules:
- Do NOT use placeholders
- Do NOT say "to be defined"
- Generate complete and realistic content
- Keep it structured with headings
- Output in clean markdown format

Additional instruction:
${typeInstructionMap[type] || ''}`
}

async function generateDocument(type, project) {
  const prompt = buildDocPrompt(type, project)
  const content = await callOpenRouter([{ role: 'user', content: prompt }], 0.4)

  if (!content) {
    throw new Error('Document generation failed')
  }

  return content
}

module.exports = { callAI, SYSTEM_PROMPT, generateDocument }
