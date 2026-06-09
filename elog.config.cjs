const process = require('node:process')

module.exports = {
  write: {
    'platform': 'yuque-pwd',
    'yuque': {
      token: process.env.YUQUE_TOKEN,
      login: process.env.YUQUE_LOGIN,
      repo: process.env.YUQUE_REPO,
      onlyPublic: false,
      onlyPublished: true,
      linebreak: false
    },
    'yuque-pwd': {
      username: process.env.YUQUE_USERNAME,
      password: process.env.YUQUE_PASSWORD,
      login: process.env.YUQUE_LOGIN,
      repo: process.env.YUQUE_REPO,
      onlyPublic: false,
      onlyPublished: true,
      linebreak: true
    }
  },
  deploy: {
    platform: 'local',
    local: {
      outputDir: process.env.ELOG_OUTPUT_DIR || './apps/docs/docs/src',
      filename: 'slug',
      format: 'markdown',
      catalog: true,
      formatExt: './elog.format.cjs',
      frontMatter: {
        enable: true,
        include: ['title', 'slug', 'order', 'sidebar', 'date', 'updated']
      }
    }
  },
  image: {
    enable: false
  }
}
