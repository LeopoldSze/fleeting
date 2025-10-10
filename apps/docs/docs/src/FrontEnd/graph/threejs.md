# ThreeJS

## 环境配置

### 静态资源服务器

```html
<script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@<version>/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@<version>/examples/jsm/"
    }
  }
</script>
<script type="module" src="xxx.js"></script>

```

```js
// xxx.js 使用THREE
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
```

<br />

### 工程化配置

1. 安装依赖：`pnpm add three`

2. 引入使用

   ```js
   import * as THREE from 'three'
   import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
   ```

<br />

## 基础语法

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { mesh } from './xxx'

// 创建画布
const canvas = document.getElementById('canvas')
// 创建画布大小
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const scene = new THREE.Scene()
scene.add(mesh)

// 创建并添加环境光
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8)
directionalLight.position.set(400, 200, 300)
scene.add(directionalLight)

// 创建并添加透视相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000)
camera.position.set(293, 223, 185)
scene.add(camera)

// 创建轨道控制器
const controls = new OrbitControls(camera, canvas)

// 创建辅助坐标轴
const axesHelper = new THREE.AxesHelper(300)
scene.add(axesHelper)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)

// 创建性能监控器
const stats = new Stats()
document.body.appendChild(stats.domElement)

// 逐帧渲染
function render() {
  stats.update()
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
render()

// 监听窗口变化
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
```
