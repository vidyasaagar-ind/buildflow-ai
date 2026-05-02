require('dotenv').config()
const express = require('express')
const cors = require('cors')
const chatRouter = require('./routes/chat')
const generateDocsRouter = require('./routes/generateDocs')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/chat', chatRouter)
app.use('/api/generate-docs', generateDocsRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
