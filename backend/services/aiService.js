const axios = require('axios')

const SYSTEM_PROMPT = `You are a structured AI project planning assistant.

RULES:
- You MUST ONLY ask questions related to the CURRENT STAGE.
- Do NOT ask questions from other stages.
- If user gives unrelated input, politely redirect them to the current stage.
- Ask 1-3 concise questions at a time.
- Do NOT ask for information already provided in previous stages.

STAGE DEFINITIONS:
Stage 1: Idea and Goal
Stage 2: Target Users and Use Case
Stage 3: Core Features
Stage 4: UI/UX Preferences
Stage 5: Tech Stack and Integrations

COMPLETION RULE:
- When enough information is collected, respond with:
  "This stage is complete. Click continue to move to the next stage."

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "reply": "natural chatbot message only",
  "stage_complete": true,
  "stage_summary": "structured summary of this stage",
  "stage_updates": {
    "stage1": "",
    "stage2": "",
    "stage3": "",
    "stage4": "",
    "stage5": ""
  }
}

IMPORTANT:
- NEVER include JSON inside reply
- reply must be clean human-readable text`

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

  const baseContext = `Project Title: ${project.title || ''}
Idea: ${project.blueprint?.stage1 || ''}
Users: ${project.blueprint?.stage2 || ''}
Features: ${project.blueprint?.stage3 || ''}
UI/UX: ${project.blueprint?.stage4 || ''}
Tech Stack: ${project.blueprint?.stage5 || ''}`

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
