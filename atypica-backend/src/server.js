import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { nanoid } from 'nanoid'

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// Simple storage for demo purposes
const upload = multer({ storage: multer.memoryStorage() })
const jobs = new Map() // jobId -> { status, progress, level, filename, interval }

const forum = {
  topics: [
    {
      id: nanoid(),
      title: 'Exemplo de atividade multimodal para Frações',
      content: 'Use peças de LEGO e imagens para representar frações antes da simbologia. Inclua áudio explicativo.',
      level: 'fundamental',
      likes: 3,
      tags: ['matemática', 'multimodal', 'DUA'],
      comments: [
        { author: 'Ana', text: 'Funcionou muito bem com minha turma!' }
      ],
      createdAt: Date.now() - 1000 * 60 * 60
    }
  ]
}

// Helpers
function startJobProgress(jobId) {
  const ref = jobs.get(jobId)
  if (!ref) return
  ref.interval = setInterval(() => {
    const job = jobs.get(jobId)
    if (!job) return clearInterval(ref.interval)
    job.progress = Math.min(100, job.progress + Math.floor(Math.random() * 20) + 5)
    if (job.progress >= 100) {
      job.status = 'completed'
      clearInterval(job.interval)
    }
  }, 1200)
}

// Routes
app.get('/', (_req, res) => {
  res.json({ ok: true, name: 'Atypica backend (mock)' })
})

app.post('/api/upload', upload.single('file'), (req, res) => {
  const level = req.body.level || 'fundamental'
  const filename = req.file?.originalname || 'arquivo.pdf'
  const jobId = nanoid()
  jobs.set(jobId, { status: 'in_queue', progress: 0, level, filename })
  // kick off simulated analysis
  startJobProgress(jobId)
  res.json({ jobId })
})

app.get('/api/status/:jobId', (req, res) => {
  const job = jobs.get(req.params.jobId)
  if (!job) return res.status(404).json({ error: 'job not found' })
  res.json({ status: job.status, progress: job.progress })
})

app.get('/api/suggestions/:jobId', (req, res) => {
  const job = jobs.get(req.params.jobId)
  if (!job) return res.status(404).json({ error: 'job not found' })
  const items = [
    {
      category: 'linguagem',
      title: 'Simplificar instruções',
      description: 'Reduza frases longas e evite termos ambíguos para favorecer clareza.',
      original: 'Os discentes deverão proceder à resolução dos itens subsequentes considerando as normativas...',
      suggested: 'Resolva as questões a seguir. Dica: leia o enunciado com atenção. Se tiver dúvida, marque e volte depois.',
      level: 'yellow'
    },
    {
      category: 'exemplos',
      title: 'Adicionar exemplos variados',
      description: 'Inclua exemplos numéricos e visuais para diferentes estilos de aprendizagem.',
      original: '3/4 + 1/2 = ?',
      suggested: '3/4 + 1/2 = ? Exemplo: use uma pizza dividida em 4 e outra em 2. Pinte as fatias para somar visualmente.',
      level: 'green'
    },
    {
      category: 'multimodal',
      title: 'Inserir alternativa em áudio',
      description: 'Forneça versão em áudio do enunciado e dos passos de resolução.',
      original: 'Leia o texto e responda às questões 1 a 5.',
      suggested: 'Inclua um ícone de áudio que lê o texto automaticamente. Forneça transcrição.',
      level: 'yellow'
    }
  ]
  res.json({ jobId: req.params.jobId, level: job.level, filename: job.filename, items })
})

// Forum
app.get('/api/forum', (_req, res) => {
  res.json({ topics: forum.topics })
})

app.post('/api/forum', (req, res) => {
  const { title, content, level = 'fundamental', tags = [] } = req.body || {}
  if (!title || !content) return res.status(400).json({ error: 'title and content required' })
  const topic = { id: nanoid(), title, content, level, tags, likes: 0, comments: [], createdAt: Date.now() }
  forum.topics.unshift(topic)
  res.json({ ok: true, topic })
})

app.post('/api/forum/:id/like', (req, res) => {
  const t = forum.topics.find(x => x.id === req.params.id)
  if (!t) return res.status(404).json({ error: 'topic not found' })
  t.likes++
  res.json({ ok: true, likes: t.likes })
})

app.post('/api/forum/:id/comments', (req, res) => {
  const t = forum.topics.find(x => x.id === req.params.id)
  if (!t) return res.status(404).json({ error: 'topic not found' })
  const { text } = req.body || {}
  if (!text) return res.status(400).json({ error: 'text required' })
  t.comments.push({ author: 'Você', text })
  res.json({ ok: true })
})

app.listen(port, () => {
  console.log(`Atypica backend listening on http://localhost:${port}`)
})
