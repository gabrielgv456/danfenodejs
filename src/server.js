//@ts-check

import express from 'express'
import router from './routes/routes.js'

const app = express()

app.use(express.json({ limit: '10mb' }))
app.use(router)

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true })
})

const port = Number(process.env.PORT) || 8090

app.listen(port, '0.0.0.0', () => console.log('Server running on port ' + port))
