import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'cz-git'

const packages = fs.readdirSync(path.resolve('packages'))
const apps = fs.readdirSync(path.resolve('apps'))

export default defineConfig({
  extends: ['@commitlint/config-conventional'],
  prompt: {
    useEmoji: true,
    scopes: [...apps, ...packages, 'root'],
    allowCustomScopes: true,
    types: [
      { value: 'feat', name: 'feat:     新功能', emoji: '✨' },
      { value: 'fix', name: 'fix:      修复问题', emoji: '🐛' },
      { value: 'docs', name: 'docs:     文档更新', emoji: '📝' },
      { value: 'style', name: 'style:    代码格式变更', emoji: '💄' },
      { value: 'refactor', name: 'refactor: 重构', emoji: '♻️' },
      { value: 'perf', name: 'perf:     性能优化', emoji: '⚡️' },
      { value: 'test', name: 'test:     测试相关', emoji: '✅' },
      { value: 'build', name: 'build:    构建/依赖', emoji: '📦' },
      { value: 'ci', name: 'ci:       CI 配置', emoji: '🎡' },
      { value: 'chore', name: 'chore:    维护杂项', emoji: '🔧' },
      { value: 'revert', name: 'revert:   回退提交', emoji: '⏪' }
    ]
  }
})
