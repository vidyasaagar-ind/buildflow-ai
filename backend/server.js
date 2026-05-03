require('dotenv').config()
const express = require('express')
const cors = require('cors')
const chatRouter = require('./routes/chat')
const generateDocsRouter = require('./routes/generateDocs')

const app = express()
const PORT = process.env.PORT || 5000

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/chat', chatRouter)
app.use('/api/generate-docs', generateDocsRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
