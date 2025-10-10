# Electron

## 工程搭建

1. 初始化 `package.json`：`pnpm init`
2. 安装依赖：`pnpm add electron nodemon -D`
3. 启动脚本：`"start": "nodemon --exec electron."`

```json
// nodemon 监控自动重启配置

{
  "ignore": [
    "node_modules",
    "dist"
  ],
  "restartable": "r",
  "watch": ["*.*"],
  "ext": "html,js,css"
}
```

<br />

## 主进程&渲染进程

1. 创建主进程窗口

   ```js
   import { BrowserWindow } from 'electron' // package.json需配置 type: module

   const win = new BrowserWindow({
     width: 800,
     height: 600
   })
   ```

2. 加载页面

   ```js
   // 加载远程页面
   win.loadURL('xxx').then()

   // 加载本地页面
   win.loadFile('pages/index.html').then()
   ```

<br />

## 完善窗口行为

> 作用：统一多平台窗口行为，抹平Mac窗口差异

```js
import { app } from 'electron'

app.on('ready', () => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

<br />

## Preload脚本

> 作用：实现主进程与渲染进程的简单通信，可以使用部分主进程的API(即node部分API)

1. 主进程配置

   ```js
   import { dirname, resolve } from 'node:path'
   import { fileURLToPath } from 'node:url'
   import { BrowserWindow } from 'electron'

   const __filename = fileURLToPath(import.meta.url)
   const __dirname = dirname(__filename)

   const win = new BrowserWindow({
     width: 800,
     height: 600,
     webPreferences: {
       preload: resolve(__dirname, 'preload.js')
     }
   })
   ```

2. 预加载进程暴露数据

   ```js
   // preload.js

   const { contextBridge } = require('electron') // 此处不使用commonjs方式导入会报错

   contextBridge.exposeInMainWorld('exposedAPI', {
     versions: process.versions
   })
   ```

3. 渲染进程获取数据，暴露的属性会挂载到window上

   ```js
   const versions = window.versions
   ```

<br />

## 进程通信

> 概述：进程间实现通信(IPC)

### 单向渲染进程至主进程

> 概述：在预加载渲染进程中使用 `ipcRenderer.send()` 发送消息，在主进程中使用 `ipcMain.on()` 接收消息
>
> 场景：常用于在web中调用主进程的API

1. 渲染进程触发：`window.exposedAPI.saveFile(text);`

2. 预加载进程发送

   ```js
   const { contextBridge, ipcRenderer } = require('electron')

   contextBridge.exposeInMainWorld('exposedAPI', {
     saveFile: text => ipcRenderer.send('file-save', text)
   })
   ```

3. 主进程接收处理

   ```js
   import fs from 'node:fs'
   import { BrowserWindow, ipcMain } from 'electron'

   function saveFile(_e, data) {
     fs.writeFileSync('D:/hello.txt', data, {
       encoding: 'utf-8'
     })
   }

   /**
    * 创建窗口
    */
   function createWindow() {
     const win = new BrowserWindow({
       width: 800,
       height: 600,
       webPreferences: {
         preload: resolve(__dirname, 'preload.js')
       }
     })
     ipcMain.on('file-save', saveFile)
     win.loadFile('pages/index.html').then()
   }
   ```

<br />

### 双向渲染进程至主进程

> 概述：在预加载渲染进程中使用 `ipcRenderer.invoke()` 发送消息，在主进程中使用 `ipcMain.handle()` 接收消息

1. 渲染进程触发事件

   ```js
   const readBtn = document.querySelector('#readBtn')
   async function read() {
     const data = await window.exposedAPI.readFile()
     alert(data)
   }
   readBtn.addEventListener('click', read)
   ```

2. 预加载进程发送

   ```js
   const { ipcRenderer } = require('electron')

   contextBridge.exposeInMainWorld('exposedAPI', {
     readFile: () => ipcRenderer.invoke('file-read')
   })
   ```

3. 主进程接收处理

   ```js
   import fs from 'node:fs'
   import { BrowserWindow, ipcMain } from 'electron'

   function readFile() {
     return fs.readFileSync('D:/hello.txt', {
       encoding: 'utf-8'
     })
   }

   /**
    * 创建窗口
    */
   function createWindow() {
     const win = new BrowserWindow({
       width: 800,
       height: 600,
       webPreferences: {
         preload: resolve(__dirname, 'preload.js')
       }
     })
     ipcMain.handle('file-read', readFile)
     win.loadFile('pages/index.html').then()
   }
   ```

<br />

### 主进程至渲染进程

> 概述：主进程使用 `win.webContents.send()` 发送消息，预加载渲染进程通过 `ipcRenderer.on()` 处理消息

<br />

## 打包应用

方式1：`electron-builder`

1. 安装依赖：`pnpm add electron-builder -D`

2. 脚本配置：

   ```json
   {
     "scripts": {
       "build": "electron-builder"
     },
     "build": {
       "appId": "com.sze.electron-demo", // 应用程序的唯一标识
       // 打包Windows平台的具体配置
       "win": {
         "icon": "./logo.ico", // 应用图标
         "target": [
           {
             "target": "nsis", // 指定使用NSIS作为安装程序格式
             "arch": ["x64"] // 生成64位安装包
           }
         ]
       },
       "nsis": {
         "oneClick": false, // 设置false，使安装程序显示安装向导页面，不是一键安装
         "perMachine": true, // 允许每台机器安装，而不是每个用户安装
         "allowToChangeInstallationDirectory": true // 允许用户在安装过程中自定义选择安装目录
       }
     }
   }
   ```

<br />
