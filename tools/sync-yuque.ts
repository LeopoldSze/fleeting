import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(dirname, '..')
const configFile = 'elog.config.cjs'
const docsSrcRoot = path.join(repoRoot, 'apps', 'docs', 'docs', 'src')
const manifestPath = path.join(docsSrcRoot, '.yuque-sync-manifest.json')

const SKIP_FILES = new Set(['index.md', 'intro.md'])
const SKIP_DIR_PREFIXES = ['assets/', 'public/']

interface Manifest {
  files: string[]
}

function loadDotEnvIfPresent() {
  const envPath = path.join(repoRoot, '.env')
  if (!fs.existsSync(envPath))
    return {}

  const text = fs.readFileSync(envPath, 'utf-8')
  const lines = text.split(/\r?\n/)
  const out: Record<string, string> = {}

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#'))
      continue

    const normalized = line.startsWith('export ') ? line.slice('export '.length).trim() : line
    const eq = normalized.indexOf('=')
    if (eq <= 0)
      continue

    const key = normalized.slice(0, eq).trim()
    if (!key)
      continue

    let value = normalized.slice(eq + 1).trim()

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\'')))
      value = value.slice(1, -1)

    out[key] = value
  }

  return out
}

function isSkippedRelPath(relPosix: string) {
  if (!relPosix)
    return true
  if (SKIP_FILES.has(relPosix))
    return true
  return SKIP_DIR_PREFIXES.some(prefix => relPosix.startsWith(prefix))
}

function toPosixPath(p: string) {
  return p.split(path.sep).join('/')
}

function listFilesRecursively(root: string) {
  const results: string[] = []
  const stack: string[] = [root]

  while (stack.length) {
    const current = stack.pop()!
    const entries = fs.readdirSync(current, { withFileTypes: true })
    for (const ent of entries) {
      const abs = path.join(current, ent.name)
      if (ent.isDirectory()) {
        stack.push(abs)
        continue
      }
      if (ent.isFile())
        results.push(abs)
    }
  }

  return results
}

function ensureDirForFile(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
}

function readManifest(): Manifest {
  if (!fs.existsSync(manifestPath))
    return { files: [] }
  const raw = fs.readFileSync(manifestPath, 'utf-8')
  const parsed = JSON.parse(raw) as Partial<Manifest>
  return { files: Array.isArray(parsed.files) ? parsed.files.map(String) : [] }
}

function writeManifest(manifest: Manifest) {
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8')
}

function run(command: string, args: string[], env: NodeJS.ProcessEnv) {
  const res = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    env,
    shell: false
  })
  if (res.error)
    throw res.error
  if (res.status !== 0)
    process.exit(res.status ?? 1)
}

function main() {
  if (!fs.existsSync(docsSrcRoot))
    throw new Error(`docs src root not found: ${docsSrcRoot}`)

  const dotEnv = loadDotEnvIfPresent()

  const tempBase = path.join(repoRoot, '.tmp')
  fs.mkdirSync(tempBase, { recursive: true })

  const tempRoot = fs.mkdtempSync(path.join(tempBase, 'fleeting-yuque-'))
  const tempOutputDir = path.relative(repoRoot, tempRoot) || '.'
  const cacheFile = path.join('.tmp', 'elog.cache.yuque.json')

  const isForced = (process.env.ELOG_FORCE ?? '1') !== '0'
  const disableCache = (process.env.ELOG_DISABLE_CACHE ?? '1') !== '0'

  const elogArgs = ['exec', 'elog', 'sync', '-c', configFile, '-a', cacheFile]
  if (isForced)
    elogArgs.push('--force')
  if (disableCache)
    elogArgs.push('--disable-cache')

  run('pnpm', elogArgs, {
    ...dotEnv,
    ...process.env,
    ELOG_OUTPUT_DIR: tempOutputDir
  })

  const oldManifest = readManifest()
  const nextFiles: string[] = []

  const tempFiles = listFilesRecursively(tempRoot)
  for (const abs of tempFiles) {
    const rel = path.relative(tempRoot, abs)
    const relPosix = toPosixPath(rel)
    if (isSkippedRelPath(relPosix))
      continue

    const dest = path.join(docsSrcRoot, rel)
    ensureDirForFile(dest)
    fs.copyFileSync(abs, dest)
    nextFiles.push(relPosix)
  }

  if (nextFiles.length === 0) {
    fs.rmSync(tempRoot, { recursive: true, force: true })

    if (oldManifest.files.length > 0) {
      throw new Error(
        'Elog did not generate any files in this run. Abort to avoid deleting existing synced docs. You can retry with ELOG_FORCE=1.'
      )
    }

    writeManifest({ files: [] })
    return
  }

  const nextSet = new Set(nextFiles)
  for (const relPosix of oldManifest.files) {
    if (nextSet.has(relPosix))
      continue
    if (isSkippedRelPath(relPosix))
      continue

    const abs = path.join(docsSrcRoot, relPosix.split('/').join(path.sep))
    if (fs.existsSync(abs))
      fs.rmSync(abs, { force: true })
  }

  writeManifest({ files: nextFiles.sort() })

  fs.rmSync(tempRoot, { recursive: true, force: true })
}

main()
