# 问题解决

## 1. github ssh

> 问题：github.com port 22: Connection timed out

解决：

1. **SSH 配置**：确保 SSH 配置是正确的，可以通过在终端运行 `ssh -T git@github.com` 来测试 SSH 连接。如果配置有误，需要重新设置 SSH 密钥

2. **更改 SSH 端口**：GitHub 支持通过端口 443 进行 SSH 连接。如果端口 22 被网络阻止，可以尝试更改端口。编辑 SSH 配置文件（通常在 `~/.ssh/config`），添加以下内容：

   ```
   Host github.com
     Hostname ssh.github.com
     Port 443
   ```

3. **防火墙和代理设置**：检查防火墙或代理设置，确保它们没有阻止端口 22。在一些公司或教育机构的网络中，端口 22 可能会被阻止

4. **使用 HTTPS 而非 SSH**：如果 SSH 连接问题无法解决，可以考虑使用 HTTPS 克隆和推送到 GitHub。HTTPS 不依赖于 SSH 端口

<br />

## 2. 路径别名alias警告，跳转失败

- 针对TS项目：**修改tsconfig.json**

  ```json
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"]
      }
    }
  }
  ```

- 针对js项目：**新增jsconfig.json**

  > 配置参考：[中文文档](https://juejin.cn/post/6930549887402672135?searchId=202403071106328CD4BEF24C76CD789A7F)

  ```json
  // jsconfig.json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"]
      }
    }
  }
  ```

<br />

## 3. commitlint.config.js:1

> 问题：commitlint.config.js:1 SyntaxError: Invalid or unexpected token
>
> 原因：因为用 echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js 这条命令生成的 commitlint.config.js 文件不是 utf8 格式的

解决：**将文件转成 utf8 格式的**

<br />

## 4. CJS 代码中引入 ESM 模块异常

1. 方案一：将自己的项目改为ESM方案，对ts项目，将 `tsconfig.json` 中的 `"module": "CommonJS"` 改为 `"module": "ESNext"` 即可；对js项目，将 `package.json` 中的 `type` 改为 `module`。

   ::: warning CJS 迁移至 ESM逻辑变动：

   主要有：

   - `require` 转向 `import` 的写法，不能再使用 `require`，会报错
   - `__dirname` 与 `__filename` 修改为使用 `import.meta.url` 兼容
   - ESM 模块加载相对路径文件时，需改为为包含后缀的完成路径

   :::

   ::: tip ESM 兼容 `__dirname/__filename` 示例：

   ```js
   import { basename, dirname } from 'node:path'
   import { fileURLToPath } from 'node:url'

   const _dirname = typeof __dirname !== 'undefined'
     ? __dirname
     : dirname(fileURLToPath(import.meta.url))

   const _filename = typeof __filename !== 'undefined'
     ? __filename
     : basename(fileURLToPath(import.meta.url))
   ```

   :::

2. 方案二：保持使用依赖包最后一个支持CJS方案的旧版本：该方案原则上可以，许多开源库也是这么做的。但存在一个潜在的安全问题是这类包都不能得到更新，如果它们及其间接依赖的包被暴露出安全问题，则这些安全隐患则无法得到修复。

3. 使用 `await import(xxx)` 方式：NodeJs 的 `CommonJS` 方案支持使用 `import(...)` 动态导入方式

   ```js
   // ESM import
   import boxen from 'boxen'
   
   // 修改为动态导入方式
   const { default: boxen } = await import('boxen')
   ```

 但是由于 tsc 编译输出为 `CommonJS` 的结果时，实际上会将动态导入全部编译为 `require(...)` 方式。

4. 使用 `eval("import(...)") `方式：基于上面的动态导入方案，只需要避免 tsc 编译即可解决问题。利用 `eval` 的动态编译特性，可以使用如下示例方法实现。示例：

   ```js
   import type Boxen from 'boxen';
   
   const tips = '...';
   const { default: boxen } = await (eval(`import('boxen')`) as Promise<{ default: typeof Boxen }>);
   console.log(boxen(defaultTemplate));
   ```

   实测基于 `eval` 的动态编译方案可解决此类问题，暂作为简单的临时解决方案。

::: tip

最符合社区标准发展的长期可选方案仍是方案一

:::

> 参考：[4种解决方案](https://lzw.me/a/error-err_require_esm-require-of-es-module.html)

<br />

## 5. el-scrollbar 重置滚动条高度

```vue
this.$refs.[NAME].wrap.scrollTop = 0;
```

<br />

## 6. el-scrollbar 无法滚动

```vue
// 高度改变 无法滚动，添加key值
<el-scrollbar :key="Math.random()"></el-scrollbar>
```

<br />

## 7. resolve dependency tree

> 问题：ERESOLVE unable to resolve dependency tree
>
> 原因：依赖项中存在无法解决的冲突，`npm@7` 现在尝试安装它们，而`npm@6`没有

解决：`npm install --legacy-peer-deps`

<br />

## 8. Inline JavaScript is not enabled

> 问题：Inline JavaScript is not enabled. Is it set in your options?
>
> 原因： `Webpack` 关于 `Less-loader` 的配置默认值不合适引发的，所以，需要重新修改配置。

Vue-cli 因为没有暴露 `webpack.config.js` 文件，需要通过自己创建的 `vue.config.js` 文件来添加自定义配置项。

<br />

## 9. loading chunk failed

> 问题：vue Loading chunk {n} failed
>
> 原因：报错来自于webpack进行code spilt之后某些bundle文件lazy loading失败，根本原因未知

解决：前端路由错误拦截，失败时重新渲染页面

```js
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})
```

> 参考：[Vue项目中出现Loading chunk {n} failed问题的解决方法](https://segmentfault.com/a/1190000016382323)

<br />

## 10. webpack polyfills error

> 原因：BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default. This is no longer the case. Verify if you need this module and configure a polyfill for it

解决：

1. 安装依赖

   ```bash
   yarn add node-polyfill-webpack-plugin
   # or
   npm install node-polyfill-webpack-plugin
   ```

2. 配置 `webpack plugins`

   ```js
   // vue.config.js
   
   const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
   
   module.exports = {
     configureWebpack: {
       plugins: [new NodePolyfillPlugin()]
     }
   }
   ```

<br />

## 11. Android Studio虚拟机设置网络

> 参考：[文章](https://www.cnblogs.com/ministep/p/17479118.html)

<br />
