---
title: CSS
date: '2026-06-09 08:59:43'
updated: '2026-06-09 14:50:09'
slug: css
order: 1
inSidebar: false
---
### 移动端1px
1. 移动端 `1px` 问题

```sass
.mod_grid {
  position: relative;

  &::after {
    // 实现1物理像素的下边框线
    content: '';
    position: absolute;
    z-index: 1;
    pointer-events: none;
    background-color: #ddd;
    height: 1px;
    left: 0;
    right: 0;
    top: 0;

    @media only screen and (-webkit-min-device-pixel-ratio: 2) {
      -webkit-transform: scaleY(0.5);
      -webkit-transform-origin: 50% 0%;
    }
  }
}

``
```

  


### 保持图片宽高比
> 使用 `padding` 百分比实现
>

```css
.mod_banner {
    position: relative;
    // 使用padding-top 实现宽高比为 100:750 的图片区域
    padding-top: percentage(100/750);
    height: 0;
    overflow: hidden;

    img {
        width: 100%;
        height: auto;
        position: absolute;
        left: 0;
        top: 0;
    }
}
```

  


### 全局box-sizing重置
> 避免全局重置，用于替换元素的自适应问题
>

```css
input,
textarea,
img,
video,
object {
  box-sizing: border-box;
}

```

  


### 上传框样式
> 利用border-color默认使用color色值，实现更精简的:hover效果
>

```css
.add {
  width: 80px;
  height: 80px;
  color: #ccc;
  border: 2px dashed;
}

.add::before {
  border-top: 10px solid;
}

.add::after {
  border-left: 10px solid;
}

/* hover变色 */
.add:hover {
  color: #06c;
}

```

  


### 右下方background定位
例如：需要在距离右边缘50px的位置设置一个背景图片，由于宽度不固定，无法通过设定具体数值来实现想要的效果，因为background定位是相当于左上角的，但是background背景图片是相对于padding-box定位的，因此不会把 `border-width` 计算在内。

```css
.box {
  border-right: 50px solid transparent;
  background: 100% 50%;
}

```

  


### 移动端增加点击区域大小
> 用padding可能会对background-position造成定位不准的问题，使用透明border则无此问题
>

```css
.icon-clear {
  width: 16px;
  height: 16px;
  border: 11px solid transparent;
}

```

  


### 增加选项框尺寸
> 利用 `background-clip` 控制背景显示区域
>

```css
.checkbox {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 3px solid transparent;
  box-shadow:
    inset 0 1px,
    inset -1px 0,
    inset 0 -1px,
    inset 1px 0;
  color: gray;
}

.checkbox:checked {
  color: deepskyblue;
  background: currentColor;
  background-clip: padding-box;
}

```

  


### 三角等图形绘制
> 只要是与三角形或者梯形相关的图形，都可以使用border属性来模拟
>

```css
/* 朝下的等腰直角三角形 */
div {
  width: 0;
  border: 10px solid;
  border-color: #f30 transparent transparent;
}

```

  


### border等高布局
> 元素边框高度总是和元素自身高度保持一致，因为border宽度不支持百分比值，因此至少需要一栏定宽；或者使用vw单位，近似实现百分比效果
>

```html
div class="box">
  <nav>
    <h3 class="nav">导航1</h3>

    <h3 class="nav">导航2</h3>

    <h3 class="nav">导航3</h3>

    <h3 class="nav">导航4</h3>

  </nav>

  <section></section>

</div>

```

```css
/* 导航背景区border创建 */
.box {
  border-left: 150px solid #333;
  background-color: #f0f3f9;
}
/* 清除浮动影响，不能使用overflow:hidden */
.box:after {
  content: '';
  display: block;
  clear: both;
}

/* 布局主结构 */
.box > nav {
  width: 150px;
  margin-left: -150px;
  float: left;
}
.box > section {
  overflow: hidden;
}

/* 导航列表 */
.nav {
  line-height: 40px;
  color: #fff;
}

```

  


### ex实现内联元素背景垂直居中对齐
> 借助ex就是x-height单位，直接利用默认的baseline基线对齐就可以实现背景图片和文字垂直居中，不用麻烦设置vertiacl-align: middle
>

```css
.icon {
  display: inline-block;
  width: 20px;
  height: 1ex;
  background: url(arrow.png) no-repeat center;
}

```

  


### 单行文本和多行文本并列居中排版
> 设置`<span>`元素为 `display: inline-block`，创建一个独立的“行框盒子”，行高不受前面的“幽灵空白节点”的干扰。此时再设置`<span>`元素内的多行文本居中就可以
>

```html
<div>标题<span>这里是很长很长很长很长的多行文本，需要多行文本行高合适，以实现更好的排版实现</span></div>

```

```css
div {
  line-height: 90px;
}

div span {
  display: inline-box;
  line-height: 20px;
  vertical-align: middle;
}

```

  


### 修复图片底部间隙
> 原因：“幽灵空白节点”、`line-height` 和 `vertical-align` 属性，导致半行间距存在
>

1. 图片块状化，一口气干掉“幽灵空白节点”、`line-height` 和 `vertical-align`
2. 容器 `line-height` 足够小。只要半行间距小到字母x的下边缘位置或者再往上，自然就没有了撑开底部间隙高度空间了，比如设置容器：`line-height: 0`
3. 容器 `font-size` 足够小。此方法想要生效，需要容器的 `line-height` 属性值和当前 `font-size` 相关，如 `line-height: 1.5` 或者 `line-height: 150%` 之类；否则只会让下面的间隙变得更大，因为基线位置因为字符x变小而上升了，比如设置 `font-size: 0`
4. 图片设置其他 `vertical-align` 属性值。间隙的产生原因之一就是基线对齐，所以我们设置为 `top、middle、bottom` 中的任意一个都是可以的

  


### 基于20px图标对齐处理
1. 图标高度和当前行高都是20px
2. 图标标签里面永远有字符
3. 图标CSS不使用 `overflow: hidden` 保证基线为里面字符的基线，但是要让里面的字符不可见

```css
.icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url(sprite.png) no-repeat;
  white-space: nowrap;
  letter-spacing: -1em;
  text-indent: -999em;
}
.icon::before {
  content: '\3000';
}

/* 具体图标使用 */
.icon-xxx {
  background-position: 0 -20px;
}

```

  


### 基于vertical-align属性的水平垂直居中弹框
```html
<div class="container">
  <div class="dialog"></div>

</div>

```

```css
.container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  font-size: 0;
  white-space: nowrap;
  overflow: auto;
}
.container::after {
  content: '';
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
.dialog {
  display: inline-block;
  vertical-align: middle;
  text-align: left;
  font-size: 14px;
  white-space: normal;
}

```

  


### float两栏自适应布局
```html
<div class="box">
  <img />
  <p>xxxxxxxxxxxxxxxxxxxxxxx</p>

</div>

```

```css
.box {
  overflow: hidden;
}
img {
  float: left;
  width: 60px;
  height: 60px;
}
p {
  margin-left: 70px;
}

```

  


### BFC两栏自适应布局
> 优点：更智能，不用计算 `浮动元素的宽度+间距 ` 设置间距值，直接设置浮动元素自身的间距。
>
> 普通流体元素在设置了 `overflow: hidden` 后，会自动填满容器中除了浮动元素以外的剩余空间，形成自适应布局效果。
>

```html
<div class="box">
  <img />
  <p>xxxxxxxxxxxxxxxxxxxxxxx</p>

</div>

```

```css
.box {
  overflow: hidden;
}
img {
  float: left;
  width: 60px;
  height: 60px;
  margin-right: 10px;
}
p {
  overflow: hidden;
}

```

  


### 页面滚动条不发生晃动
```css
:root {
  overflow-y: auto;
  overflow-x: hidden;
}

:root body {
  position: absolute;
}

body {
  width: 100vw;
  overflow: hidden;
}

```

  


### 自定义滚动条样式
> 支持-webkit-前缀的浏览器
>
> + 整体部分：`::-webkit-scrollbar`
> + 两端按钮：`::-webkit-scrollbar-button`
> + 外层轨道：`::-webkit-scrollbar-track`
> + 内层轨道：`::-webkit-scrollbar-track-piece`
> + 滚动滑块：`::-webkit-scrollbar-thumb`
> + 边角：`::-webkit-scrollbar-corner`
>

```css
/* 开发一般只使用下面3个属性 */

/* 血槽宽度 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/* 拖动条 */
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
}

/* 背景槽 */
::-webkit-scrollbar-track {
  background-color: #ddd;
  border-radius: 6px;
}

```

  


### 单行文字溢出...显示
```css
.text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

```

  


### 多行文本溢出...显示
> 支持-webkit-前缀浏览器
>

```css
.text-row-2 {
  display: webkit-box;
  -wekit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 设置要显示的行数 */
}

```

  


### 绝对定位元素宽度不足
> 原理：绝对定位元素默认具有“包裹性”，添加 `white-space: nowrap`，让宽度表现从“包裹性”变成“最大可用宽度”，避免一柱擎天现象。
>

```css
.box {
  position: absolute;
  white-space: nowrap;
}

```

  


### 最佳可访问性隐藏
> 需要的地方加一个类名即可
>

```css
.clip {
  position: absolute;
  clip: rect(0 0 0 0);
}

```

  


### 元素的显示和隐藏
+ 如果希望元素不可见，同时不占据空间，辅助设备无法访问，同时不渲染，可以使用 `<script>` 标签隐藏，但是不支持嵌套，此时也不会有请求

```html
<script type="text/html">
  <img src="xxx" />
  <textarea style="display: none">
        <img src='xxx'>
  </textarea
  >

</script>

```

```plain

```

```plain

```

```plain

```

可以使用 `script.innerHTML、textarea.value` 获取隐藏内容

+ 如果希望元素不可见，同时不占据空间，辅助设备无法访问，但资源有加载，DOM可访问，可以之间使用 `display: none`
+ 如果希望元素不可见，同时不占据空间，辅助设备无法访问，但显隐的时候可以有 `transition` 淡入淡出效果，可以使用：

```css
.hidden {
  position: absolute;
  visibility: hidden;
}

```

```plain

```

```

- 如果希望元素不可见，不能点击，辅助设备无法访问，但占据空间保留，则可以使用 `visibility: hidden`

- 如果希望元素不可见，不能点击，不占据空间，但键盘可访问，则可以使用 `clip` 剪裁隐藏：

  ```css
  .clip {
    position: absolute;
    clip: rect(0, 0, 0, 0);
  }

  // or

  .out {
    position: relative;
    left: -999em;
  }

  ``

  ``

  ```

- 果望元素不可见，不能点击，但占据空间，且键盘可访问，则可以使用 `relative` 和 `z-index` 负值隐藏

- 如果希望元素不可见，但可以点击，而且不占据空间，则可以使用透明度：

  ```css
  .opacity {
    position: absolute;
    opacity: 0;
    filter: Alpha(opacity=0);
  }

```

```

```

```

+ 如果希望元素不可见，但位置保留，依然可以点可以选，则直接让透明度为0：`opacity: 0`

  


### 滚动背景锁定
> 原理：移动端阻止 `touchmove` 事件的默认行为就可以；桌面端可以让根元素直接 `overflow: hideen`，但是Windows系统滚动条占据宽度，会产生页面晃动，使用等宽的透明border填充。
>

```javascript
// 锁定背景滚动
let widthBar = 17
const root = document.documentElement
if (type of window.innerWidth === 'number') {
  widthBar = window.innerWidth - root.clientWidth
}

root.style.overflow = hidden
root.style.borderRight = widthBar + 'px solid transparent'

// 放开背景锁定
root.style.overflow = ''
root.style.borderRight = ''
```

  


### font关键字属性值应用
> 场景：适配用户的系统字体
>

```css
html {
  font: menu;
}
body {
  font-size: 16px;
}

```

  


### @font-face优化
```css
@font-face {
  font-family: 'xxx';
  src: url(xxx.eot);
  src:
    local('unicode'),
    url('xxx.woff2') format('woff2'),
    url('xxx.woff') format('woff'),
    url('xxx.ttf');
}

```

  


### 问答类型缩进
> 原理：利用 text-indent 仅对第一行内联盒子内容生效
>

```css
p {
  padding-left: 3em;
  text-indent: -3em;
}

```

  


### 身份证输入及验证码输入
> 原理：理由 text-transform 使X大写
>

```css
input {
  text-transform: uppercase;
}

```

  


### 头像裁剪镂空效果
> 原理：利用 `outline` 不占据空间特性，不会对布局产生影响，实现半透明黑色遮罩，父级隐藏超出区域
>

```css
.crop {
  overflow: hidden;
}

.crop > .crop-area {
  width: 80px;
  height: 80px;
  outline: 256px solid rgba(0, 0, 0, 0.5);
  cursor: move;
}

```

  


### 底部填满屏幕的大面积色块
> 原理：利用 `outline` 不占据空间特性，不会对布局产生影响，但是和border属性不一样，无法指定方位，只会被动四周扩展，因此不仅会把下发区域填满，上方区域也会填满，需要裁剪，设置9999px是为了保证裁剪内容完整
>

```css
.footer {
  outline: 9999px solid #fff;
  clip: rect(0, 9999px, 9999px 0);
}

```

  


### 改变元素的水平呈现顺序
> 原理：利用 `direction: rtl` 改变渲染顺序，默认是 `ltr: 从左到右`，只要是内联元素，与书写流有关，都可以使用该属性
>

```css
.dialog-footer {
  direction: rtl;
}

```

  


### 文字下沉效果
> 原理：例如 `writing-mode` 设置垂直方向流，中文不会旋转，再利用 `text-indent` 实现文字缩进
>

```css
.btn {
  writing-mode: vertical-rl;
}

.btn:active {
  text-indent: 2px;
}

```

  


### 原生弹窗样式重置
> 原理：利用 all 属性和 unset 关键字
>
> 作用：保证不同浏览器渲染效果一致
>

```css
dialog {
  all: unset;
}

```

  


### 字数少居中，字数多左对齐
> 原理：包裹性收缩，内联元素使用 `display: inline-block`，块级元素使用 `display: table`
>

```css
/* 传统浏览器 */
.content {
  display: table;
  margin: auto;
}

/* 现代方法 */
.content {
  width: fit-content;
  margin: auto;
}

```

  


### 尺寸自动填充
> 原理：使用 `stretch` 关键字，可以减少 `calc()` 计算复杂度
>

```css
button {
  height: 40px;
  width: stretch;
  margin: 0 15px;
}

```

  


### 对话框左右对称
> 原理：利用 CSS 逻辑属性
>

```css
.msg-item {
  margin-inline-end: 40px;
}

.msg-item[data-self] {
  direction: rtl;
}

```

  


### 简化绝对定位铺满
> 原理：利用 CSS 逻辑属性的 inset
>

```css
.overlay {
  position: absolute;
  inset: 0;
  /* 等同于 left: 0; right: 0; top: 0; bottom: 0; */
}

```

  


### 自定义1px虚线边框
> 原理：利用 border-image 重新定义虚线边框，尺寸和虚实比例可以随意控制
>

```css
.border-dashed {
  border: 1px dashed deepskyblue;
  border-image: repeating-liner-gradient(135deg, deepskyblue, deepskyblue 5px, transparent 5px, transparent 10px) 1;
}

```

  


### 圆角渐变边框
> 原理：border-radius 属性无法改变 border-image 属性生成的图形效果
>

```css
/* 方法一：嵌套父级，设置圆角和溢出隐藏 */
.father {
  border-radius: 10px;
  overflow: hidden;
}

/* 使用 clip 裁剪 */
.clip-path {
  clip-path: inset(0 round 10px);
}

```

  


### 轮廓模拟
> 原理：利用对布局没有影响的属性实现，包括 outline、box-shadow、border-image
>

```css
.selected {
  outline: 2px solid deepskyblue;
}

.selected {
  box-shadow: 0 0 0 2px deepskyblue;
}

.selected {
  border: 0.02px solid;
  border-image: liner-grandient(deepskyblue, deepskyblue) 2 / 2px / 2px;
}

```

  


### 全局字体兼容
```css
@font-face {
  font-family: Emoji;
  src: local('Apple Color Emoji'), local('Segoe UI Emoji'), local('Segoe UI Symbol'), local('Noto Color Emoji');
  unicode-range: U+1F000-1F644, U+203C-3299;
}

body {
  font-family:
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Emoji,
    Helvetica,
    Arial,
    sans-serif;
}

```

  


### 文本最后一行两端对齐
```css
.content {
  text-align: justify;
  text-align-last: justify;
}

```

  


### 自适应波浪线效果
```css
wavy {
  display: block;
  height: 0.5em;
  white-space: nowrap;
  letter-spacing: 100vw;
  padding-top: 0.5em;
  overflow: hidden;
}
wavy::before {
  content: '\2000\2000';
  text-decoration: overline;
  text-decoration-style: wavy;
}

```

```html
<!-- 这样就有波浪线效果 -->
<wavy></wavy>

```

  


### 渐变文字
> 利用渐变+背景裁剪
>

```css
.text-gradient {
  background: liner-gradient(deepskyblue, deeppink);
  background-clip: text;
  color
}
```

  


### 非定位前序元素覆盖后序元素
> 利用 opacity 不为1的元素创建层叠上下文，升高层叠顺序
>

```css
.pre {
  opacity: 0.99;
}

```

  


### loading
> 利用 `box-shadow` 和 动画实现加载
>

```css
.loading {
  width: 4px;
  height: 4px;
  border-radius: 100%;
  color: rgba(0, 0, 0, 0.4);
  box-shadow:
    0 -10px rgba(0, 0, 0, 0.9),
    /* top */ 10px 0px,
    /* right */ 0 10px,
    /* bottom */ -10px 0 rgba(0, 0, 0, 0.7),
    /* left */ -7px -7px rgba(0, 0, 0, 0.8),
    /* left-top */ 7px -7px rgba(0, 0, 0, 1),
    /* right-top */ 7px 7px,
    /* right-bottom */ -7px 7px;
  animation: spin 1s steps(8) infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

```

### 参考
> [CSS世界原型索引](https://demo.cssworld.cn/)
>
> [CSS新世界原型索引](https://demo.cssworld.cn/new/)
>

