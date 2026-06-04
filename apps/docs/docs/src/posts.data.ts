import { createContentLoader } from 'vitepress'

export interface BlogFrontmatter {
  title?: string
  date?: string | number | Date
  tags?: string[] | string
  pinned?: boolean
  description?: string
}

export interface BlogPost {
  title: string
  url: string
  timestamp: number
  tags: string[]
  pinned: boolean
  date?: string
  description?: string
}

function toTimestamp(input: BlogFrontmatter['date']): number {
  if (!input)
    return 0

  if (typeof input === 'number')
    return input

  const date = input instanceof Date ? input : new Date(input)
  const ts = date.getTime()
  return Number.isFinite(ts) ? ts : 0
}

function normalizeTags(tags: BlogFrontmatter['tags']): string[] {
  if (!tags)
    return []
  if (Array.isArray(tags))
    return tags.map(v => String(v).trim()).filter(Boolean)
  return String(tags).split(',').map(v => v.trim()).filter(Boolean)
}

export default createContentLoader('posts/**/*.md', {
  includeSrc: false,
  transform(raw) {
    const mapped: BlogPost[] = raw
      .map(({ url, frontmatter }) => {
        const fm = (frontmatter ?? {}) as BlogFrontmatter
        const title = (fm.title ?? '').toString().trim()
        const timestamp = toTimestamp(fm.date)
        const tags = normalizeTags(fm.tags)
        const pinned = Boolean(fm.pinned)
        const description = (fm.description ?? '').toString().trim()

        const post: BlogPost = {
          title,
          url,
          timestamp,
          tags,
          pinned
        }

        if (timestamp)
          post.date = new Date(timestamp).toISOString().slice(0, 10)

        if (description)
          post.description = description

        return post
      })
      .filter(post => post.title && post.url)

    mapped.sort((a, b) => {
      if (a.pinned !== b.pinned)
        return a.pinned ? -1 : 1
      return b.timestamp - a.timestamp
    })

    return mapped
  }
})
