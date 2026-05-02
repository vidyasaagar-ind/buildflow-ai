const express = require('express')
const { callAI, SYSTEM_PROMPT } = require('../services/aiService')

const router = express.Router()

function normalizeStageUpdates(input) {
  const base = {
    stage1: '',
    stage2: '',
    stage3: '',
    stage4: '',
    stage5: '',
  }

  if (!input || typeof input !== 'object') return base

  return {
    stage1: typeof input.stage1 === 'string' ? input.stage1 : '',
    stage2: typeof input.stage2 === 'string' ? input.stage2 : '',
    stage3: typeof input.stage3 === 'string' ? input.stage3 : '',
    stage4: typeof input.stage4 === 'string' ? input.stage4 : '',
    stage5: typeof input.stage5 === 'string' ? input.stage5 : '',
  }
}

router.post('/', async (req, res) => {
  try {
    const { projectId, currentStage = 1, messages = [], projectContext = {}, role = '', blueprint = {} } = req.body || {}

    if (Number(currentStage) === 6) {
      return res.json({ reply: 'Planning complete.', extracted: {} })
    }

    const stageNumber = Number(currentStage) || 1
    const stageLimit = Math.min(Math.max(stageNumber - 1, 0), 5)
    const stageKeys = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5']
    const mergedBlueprint = {
      stage1: blueprint.stage1 || projectContext.stage1 || '',
      stage2: blueprint.stage2 || projectContext.stage2 || '',
      stage3: blueprint.stage3 || projectContext.stage3 || '',
      stage4: blueprint.stage4 || projectContext.stage4 || '',
      stage5: blueprint.stage5 || projectContext.stage5 || '',
    }

    const filteredMemory = stageKeys.reduce((acc, key, idx) => {
      const value = mergedBlueprint[key]
      if (idx < stageLimit && typeof value === 'string' && value.trim()) {
        acc[key] = value.trim()
      }
      return acc
    }, {})

    const memoryLines = [
      filteredMemory.stage1 ? `- Idea: ${filteredMemory.stage1}` : '',
      filteredMemory.stage2 ? `- Target Users: ${filteredMemory.stage2}` : '',
      filteredMemory.stage3 ? `- Features: ${filteredMemory.stage3}` : '',
      filteredMemory.stage4 ? `- UI/UX: ${filteredMemory.stage4}` : '',
      filteredMemory.stage5 ? `- Tech Stack: ${filteredMemory.stage5}` : '',
    ].filter(Boolean)

    const memoryBlock = memoryLines.length
      ? `Project Summary:\n${memoryLines.join('\n')}`
      : 'Project Summary:\n- No previous stage memory yet.'

    const contextSummary = {
      projectId: projectId || 'unknown',
      currentStage: stageNumber,
      role: role || 'unspecified',
      title: projectContext.title || '',
      idea: projectContext.idea || '',
      targetUsers: projectContext.targetUser || '',
      previous_stage_memory: filteredMemory,
    }

    const limitedMessages = Array.isArray(messages) ? messages.slice(-6) : []
    const currentStageLabel = `Stage ${stageNumber}`

    const modelMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: `User Role: ${role || 'unspecified'}` },
      { role: 'system', content: `Current Stage: ${currentStageLabel}` },
      { role: 'system', content: memoryBlock },
      { role: 'system', content: `Project Summary:\n${JSON.stringify(contextSummary)}` },
      ...limitedMessages,
    ]

    const raw = await callAI(modelMessages)

    let reply = raw
    let extracted = normalizeStageUpdates({})

    try {
      const parsed = JSON.parse(raw)
      reply = typeof parsed.reply === 'string' && parsed.reply.trim() ? parsed.reply : raw
      extracted = normalizeStageUpdates(parsed.stage_updates)
    } catch (parseError) {
      console.error('AI JSON parse failed:', parseError.message)
      extracted = normalizeStageUpdates({})
    }

    res.json({ reply, extracted })
  } catch (error) {
    res.status(500).json({
      error: 'CHAT_ROUTE_ERROR',
      message: error.message || 'Chat request failed',
    })
  }
})

module.exports = router
