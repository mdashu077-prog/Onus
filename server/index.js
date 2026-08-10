import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dbFile = join(__dirname, 'db.json')
const adapter = new JSONFile(dbFile)
const db = new Low(adapter, { users: [] })

async function initDb() {
  await db.read()
  db.data ||= { users: [] }
  await db.write()
}

function sanitizeUser(user) {
  const { passwordHash, ...rest } = user
  return rest
}

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' })
  }

  await db.read()
  const existing = db.data.users.find((user) => user.email.toLowerCase() === email.toLowerCase())
  if (existing) {
    return res.status(409).json({ message: 'Email is already registered.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const newUser = {
    id: db.data.users.length + 1,
    name,
    email,
    role,
    passwordHash,
    createdAt: new Date().toISOString(),
  }

  db.data.users.push(newUser)
  await db.write()

  return res.status(201).json({ user: sanitizeUser(newUser) })
})

app.post('/api/login', async (req, res) => {
  const { email, password, role } = req.body

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password and role are required.' })
  }

  await db.read()
  const user = db.data.users.find((item) => item.email.toLowerCase() === email.toLowerCase())
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' })
  }

  if (user.role !== role) {
    return res.status(403).json({ message: `Please login as ${user.role}.` })
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials.' })
  }

  return res.json({ user: sanitizeUser(user) })
})

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Onus server running on http://localhost:${PORT}`)
  })
}).catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
