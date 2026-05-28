import { Buffer } from 'node:buffer'
import { promises as fs } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import process from 'node:process'

const PORT = process.env.PORT ? Number(process.env.PORT) : 3030

type AnyObj = Record<string, any>

interface StoredEvent {
  time: number
  data: AnyObj
}

const events: StoredEvent[] = []

const ROOT = path.resolve(__dirname, '..')
const DATA_DIR = path.join(ROOT, 'data')
const EVENTS_FILE = path.join(DATA_DIR, 'events.json')
const PUBLIC_DIR = path.join(ROOT, 'public')
const SDK_IIFE_JS = path.resolve(__dirname, '../../dist/index.js')

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(EVENTS_FILE)
  }
  catch {
    await fs.writeFile(EVENTS_FILE, '[]', 'utf-8')
  }
}

async function loadEvents() {
  await ensureDataFile()
  const txt = await fs.readFile(EVENTS_FILE, 'utf-8')
  try {
    const arr = JSON.parse(txt)
    events.splice(0, events.length, ...(Array.isArray(arr) ? arr : []))
  }
  catch {
    // 文件损坏时重置
    events.splice(0, events.length)
    await saveEvents()
  }
}

async function saveEvents() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  const json = JSON.stringify(events, null, 2)
  await fs.writeFile(EVENTS_FILE, json, 'utf-8')
}

function send(res: import('node:http').ServerResponse, status: number, body: string, headers: AnyObj = {}) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...headers })
  res.end(body)
}

function sendJson(res: import('node:http').ServerResponse, status: number, data: AnyObj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(data))
}

async function serveFile(res: import('node:http').ServerResponse, filePath: string, contentType = 'text/html; charset=utf-8') {
  try {
    const data = await fs.readFile(filePath)
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(data)
  }
  catch {
    send(res, 404, 'Not Found')
  }
}

async function handleTrack(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) {
  const chunks: Buffer[] = []
  req.on('data', c => chunks.push(Buffer.from(c)))
  req.on('end', async () => {
    const raw = Buffer.concat(chunks).toString('utf-8')
    let data: AnyObj
    try {
      data = JSON.parse(raw)
    }
    catch {
      data = { parseError: true, raw }
    }
    events.push({ time: Date.now(), data })
    if (events.length > 1000)
      events.shift()
    await saveEvents()
    console.log('[track]', JSON.stringify(data))
    res.writeHead(204)
    res.end()
  })
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`)
  try {
    if (req.method === 'GET' && url.pathname === '/') {
      return serveFile(res, path.join(PUBLIC_DIR, 'index.html'), 'text/html; charset=utf-8')
    }

    if (req.method === 'GET' && url.pathname === '/dist/index.js') {
      return serveFile(res, SDK_IIFE_JS, 'application/javascript; charset=utf-8')
    }

    if (req.method === 'GET' && url.pathname === '/__events') {
      return sendJson(res, 200, { count: events.length, events })
    }

    if (req.method === 'GET' && url.pathname === '/__events/download') {
      await ensureDataFile()
      const data = await fs.readFile(EVENTS_FILE)
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': 'attachment; filename="events.json"' })
      return res.end(data)
    }

    if (req.method === 'POST' && url.pathname === '/__events/reset') {
      events.splice(0, events.length)
      await saveEvents()
      res.writeHead(204)
      return res.end()
    }

    if (req.method === 'POST' && url.pathname === '/track') {
      return handleTrack(req, res)
    }

    if (req.method === 'GET' && url.pathname === '/not-found.png') {
      return send(res, 404, 'Not Found')
    }

    return send(res, 404, 'Not Found')
  }
  catch (err: any) {
    console.error('Server error:', err)
    return send(res, 500, 'Internal Server Error')
  }
})

loadEvents()
  .catch(e => console.warn('Load events error:', e))
  .finally(() => {
    server.listen(PORT, () => {
      const url = `http://localhost:${PORT}/`
      console.log(`Test server listening at ${url}`)
    })
  })
