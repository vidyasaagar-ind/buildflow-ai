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

    if (!project?.blueprint?.stage1) {
      return res.status(400).json({ success: false, message: 'Please complete initial chat before generating documents' })
    }

    const content = await generateDocument(type, project)

    return res.json({ success: true, content })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Document generation failed' })
  }
})

module.exports = router
