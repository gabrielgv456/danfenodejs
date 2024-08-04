//@ts-check

import express from 'express'
import router from './routes/routes.js'

const app = express()

app.use(express.json())
app.use(router)

const port = 8090

app.listen(port, () => console.log('Server running on port ' + port))