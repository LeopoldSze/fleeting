const { matterMarkdownAdapter } = require('@elog/cli')
const matter = require('gray-matter')

function normalizeSlug(input) {
  const s = (input ?? '').toString().trim()
  if (!s)
    return ''

  const normalized = s.replace(/\s+/g, '-')
  if (/^[A-Z0-9_-]+$/.test(normalized))
    return normalized.toLowerCase()

  return normalized
}

function extractUserFrontMatter(body) {
  const parsed = matter(body || '')
  if (parsed.data && Object.keys(parsed.data).length) {
    return {
      data: parsed.data || {},
      content: parsed.content || ''
    }
  }

  const text = (body ?? '').toString()
  if (!text.startsWith('---'))
    return { data: {}, content: text }

  const end = text.indexOf('---', 3)
  if (end < 0)
    return { data: {}, content: text }

  const rawBlock = text.slice(3, end).trim()
  const content = text.slice(end + 3).replace(/^\r?\n/, '')

  const data = {}
  const keyRe = /(title|slug|order|sidebar|date|updated)\s*:\s*/g
  const keys = []
  for (let match = keyRe.exec(rawBlock); match !== null; match = keyRe.exec(rawBlock))
    keys.push({ key: match[1], start: match.index + match[0].length })

  for (let i = 0; i < keys.length; i++) {
    const { key, start } = keys[i]
    const endPos = (i + 1 < keys.length) ? keys[i + 1].start - (keys[i + 1].key.length + 1) : rawBlock.length
    const valueRaw = rawBlock.slice(start, endPos).trim()
    if (key === 'order') {
      const n = Number(valueRaw)
      if (Number.isFinite(n))
        data[key] = n
    }
    else if (key === 'sidebar') {
      if (valueRaw === 'false' || valueRaw === 'true')
        data[key] = valueRaw === 'true'
    }
    else {
      data[key] = valueRaw.replace(/^['"]|['"]$/g, '').trim()
    }
  }

  return { data, content }
}

function format(doc) {
  if (doc.body) {
    doc.body = doc.body.replaceAll(':::tips', ':::tip')
    doc.body = doc.body.replaceAll(':::success', ':::tip')
  }

  const extracted = extractUserFrontMatter(doc.body || '')
  const userFM = extracted.data || {}

  const rawUrlname = doc.properties && doc.properties.urlname ? String(doc.properties.urlname).trim() : ''
  const normalizedUrlname = /^[A-Z0-9_-]+$/.test(rawUrlname) ? rawUrlname.toLowerCase() : rawUrlname

  doc.properties = {
    ...(doc.properties || {}),
    ...(normalizedUrlname ? { urlname: normalizedUrlname } : {}),
    ...userFM
  }

  if (userFM.slug)
    doc.properties.slug = normalizeSlug(userFM.slug)
  if (!doc.properties.slug)
    doc.properties.slug = normalizeSlug(doc.properties.urlname || doc.properties.title)
  if (userFM.title)
    doc.properties.title = String(userFM.title).trim()

  doc.body = extracted.content || ''

  doc.body = matterMarkdownAdapter(doc)

  const normalized = matter(doc.body || '')
  const nextData = normalized.data || {}

  const allowed = new Set(['title', 'slug', 'order', 'sidebar', 'date', 'updated'])
  Object.keys(nextData).forEach((k) => {
    if (!allowed.has(k))
      delete nextData[k]
  })

  doc.body = matter.stringify(normalized.content || '', nextData)
  return doc
}

module.exports = {
  format
}
