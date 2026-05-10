const express = require('express')
const { generateDocument } = require('../services/aiService')

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { project, type } = req.body || {}

    if (!project || typeof project !== 'object') {
      return res.status(400).json({ success: false, message: 'Project payload is required' })
    }

    if (!type || !['brd', 'srs', 'roadmap', 'todo'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Valid document type is required' })
    }

    const requiredStages = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5']
    const hasStageData = (stageValue) => {
      if (typeof stageValue === 'string') return Boolean(stageValue.trim())
      if (!stageValue || typeof stageValue !== 'object') return false
      const summary = typeof stageValue.summary === 'string' ? stageValue.summary.trim() : ''
      const answers = Array.isArray(stageValue.answers)
        ? stageValue.answers.filter((entry) => typeof entry === 'string' && entry.trim())
        : []
      return Boolean(summary || answers.length)
    }
    const missing = requiredStages.filter((stageKey) => !hasStageData(project?.blueprint?.[stageKey]))
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Please complete all planning stages before generating documents. Missing: ${missing.join(', ')}`,
      })
    }

    const content = await generateDocument(type, project)

    return res.json({ success: true, content })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Document generation failed' })
  }
})

module.exports = router
