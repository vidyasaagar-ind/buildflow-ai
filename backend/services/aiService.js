const axios = require('axios')

const SYSTEM_PROMPT = `You are an expert AI Project Planning Assistant.

Your job is to guide users step-by-step to build a complete project.

RULES:
1. Ask ONLY relevant questions based on the current stage.
2. Ask 1-3 questions at a time.
3. Be clear, short, and structured.
4. If enough information is collected, say exactly:
   "This stage is complete. Click continue to move to the next stage."
5. Never repeat the same question.
6. Use bullet points when needed.
7. Adapt questions based on user's role (student, freelancer, etc.).
8. Keep responses under 120 words.
9. Return ONLY valid JSON in the format below.
10. Do NOT ask for information already provided in previous stages.

{
  "reply": "...",
  "stage_updates": {
    "stage1": "",
    "stage2": "",
    "stage3": "",
    "stage4": "",
    "stage5": ""
  }
}`

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
  return output || '{"reply":"I could not generate a response right now.","stage_updates":{"stage1":"","stage2":"","stage3":"","stage4":"","stage5":""}}'
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
