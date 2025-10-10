# CSS

## 选择器及优先级

**样式优先级的规则如下（从高到低）：**

1. `!important`
2. **内联样式**：直接应用在HTML元素上的样式，通过 `style` 属性设置。内联样式具有最高优先级，会覆盖其他类型的样式规则
3. 内部和外部得到的计算样式
4. 继承得到的样式
5. 浏览器默认样式

**选择器及权重（从低到高）：**

- 通用选择器（\*）、后代选择器（空格）、子选择器（>）和相邻同胞选择器（+）为 0

- 标签选择器、伪元素选择器：1
- 类选择器、伪类选择器、属性选择器：10
- id 选择器：100
- 内联样式：1000

<br />

## 可继承属性有哪些

**1.字体系列属性**

- `font-family`：字体系列
- `font-weight`：字体的粗细
- `font-size`：字体的大小
- `font-style`：字体的风格

**2.文本系列属性**

- `text-indent`：文本缩进
- `text-align`：文本水平对齐
- `line-height`：行高
- `word-spacing`：单词之间的间距
- `letter-spacing`：中文或者字母之间的间距
- `text-transform`：控制文本大小写（uppercase、lowercase、capitalize这三个）
- `color`：文本颜色

**3.元素可见性**

- `visibility`：控制元素显示隐藏

**4.列表布局属性**

- `list-style`：列表风格，包括list-style-type、list-style-image等

**5.光标属性**

- `cursor`：光标显示为何种形态

<br />

## link和@import的区别

1. 加载时机：
   - `link` 是在页面加载过程中同时加载外部资源，不会阻塞页面的渲染。
   - `@import` 是在 CSS 文件加载过程中加载外部资源，会阻塞页面的渲染，直到 CSS 文件加载完成。
2. 使用方式：
   - `link` 使用在 HTML 的 `<head>` 部分或文档的任何位置，通过 `<link>` 元素指定外部资源的路径和属性。
   - `@import` 使用在 CSS 文件中的任何位置，通过 `@import` 规则指定外部 CSS 文件的路径。
3. 优先级：
   - `link` 的样式优先级高于 `@import`，即在样式冲突时，`link` 引入的样式会覆盖 `@import` 引入的样式。
4. 引入多个资源：
   - `link` 可以同时引入多个资源，通过多个 `<link>` 元素实现，浏览器并行加载这些资源。
   - `@import` 只能逐个引入资源，且需要在 CSS 文件中进行多个 `@import` 规则的声明，资源加载是串行的。

综上所述，`link` 更常用于引入外部资源，具有更好的浏览器兼容性和加载性能。而 `@import` 在某些情况下仍然有其特定的用途，例如在 CSS 文件中动态引入其他 CSS 文件，但需要注意其对页面渲染的阻塞影响。一般情况下，推荐使用 `link` 来引入外部样式表。

<br />

## 伪元素和伪类的区别和作用

- 伪元素用于创建虚拟子元素，可以通过选择器样式化这些虚拟子元素，而伪类则用于选择元素的特定状态或特定位置。
- 伪元素使用双冒号 `::` 表示，伪类使用单冒号 `:` 表示。
- 伪元素在文档结构中不存在，是在 CSS 渲染过程中生成的，而伪类是根据元素的状态或位置匹配元素。
- 伪元素常用于在元素的内容前后插入额外的样式化内容，而伪类常用于根据用户交互或元素状态来应用特定的样式。

<br />

## 对盒模型的理解

模型都是由四个部分组成的，分别是margin、border、padding和content。

标准盒模型和IE盒模型的区别在于设置width和height时，所对应的范围不同：

- 标准盒模型的width和height属性的范围只包含了content，
- IE盒模型的width和height属性的范围包含了border、padding和content。

可以通过修改元素的box-sizing属性来改变元素的盒模型：

- `box-sizing: content-box`表示标准盒模型（默认值）
- `box-sizing: border-box`表示IE盒模型（怪异盒模型）

<br />

## 页面隐藏元素的方法

![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/202307122136604.png)

<br />

## 浮动特点及如何清除

浮动是一种布局技术，它允许元素向左或向右浮动，并在文档流中腾出空间给其他元素。浮动元素会脱离正常的文档流，可以在水平方向上进行布局，使得其他元素可以环绕浮动元素。

特性：

1. 脱离标准文档流
2. 浮动元素会互相贴靠，宽度不够才会重起一行
3. 宽度收缩（针对块盒特别明显），设置宽度以宽度为准

清除浮动（Clear Float）是指消除浮动元素对其他元素布局产生的影响，使得后续元素恢复正常的文档流布局。没有正确清除浮动可能会导致布局错乱和元素重叠的问题。

1. **父元素设置高度**：大于浮动子元素的高度，才能关住浮动。
2. **空元素 + clear 属性**：在浮动元素后面添加一个空元素，并使用 `clear` 属性清除浮动。
3. **父元素触发BFC**：`overflow: auto` 或 `overflow: hidden`
4. **使用 clearfix 类 + 伪元素**（推荐）

<br />

## 定位的特性

一共5种：

- static：静态定位，即标准文档流
- relative：相对定位，相对自己原来的位置进行定位。不脱离标准流，相对于自己原来的位置上进行一定的偏移。
- absolute：绝对定位， 相对于离自己最近的并且定位的父级元素进行偏移。会脱离标准流，设置的margin也会失效，display属性会变为block。
- fixed：固定定位，一种特殊的绝对定位，也会脱离标准流。特点是相对于视口 进行定位。
- sticky：粘性定位，父元素的overflow必须是visible，父元素高度不能低于sticky元素高度，如果父元素没有设置定位，相对于视口进行定位，否则以父元素为参考点。需要设定四个方向的阈值之一，才能生效，否则和相对定位相同。

<br />

## 什么是BFC

BFC 是块级格式化上下文，一个元素形成了 BFC 之后，它内部元素产生的布局不会影响到外部元素，外部元素布局也不会影响到BFC 内部元素。一个 BFC 像是一个隔离区域，和其它区域互不影响。

特点：

- 内部垂直方向上，自上而下排列，和文档流的排列方式一致。
- 在 BFC 中上下相邻的两个容器的 margin 会重叠
- 计算 BFC 的高度时，浮动元素的高度也参与计算
- BFC 区域不会与浮动（float）的容器发生重叠
- BFC 是页面上的一个独立的容器，容器内部元素不会影响外部元素
- 每个元素的左 margin 值和容器的左 border 相接触

实现方法：

- html根元素
- float的值不为none，即值为left，right等
- overflow的值不为visible，即值为hidden、auto、scroll等
- display的值为inline-block、table-cell、table-caption、flex、grid、flow-root的元素

- display：table也认为可以生成BFC，其实这里的主要原因在于Table会默认生成一个匿名的table-cell，正是这个匿名的table-cell生成了BFC。

- position的值为absolute或fixed

<br />

## 什么是层叠上下文

**创建方法：**

1. html根元素本身就具有层叠上下文，称为“根层叠上下文”
2. 元素position属性为非static，并设置z-index属性为具体数值，会产生层叠上下文
3. css3中新属性也会产生层叠上下文

**css2.1层叠顺序：**（从低到高）

1. 层叠上下文background/border
2. z-index为负值
3. block块盒
4. float浮动盒子
5. inline/inline-block 盒子
6. z-index: auto / z-index: 0 / css3中不依赖z-index的层叠上下文
7. z-index为正数

**css3影响层叠上下文的属性：**

1. 父元素的display为flex/inline-flex，子元素z-index属性值不为auto的时候，子元素为层叠上下文元素
2. 元素的opacity属性值不为1
3. 元素的transform属性值不是none
4. 元素的mix-blend-mode属性值不是normal
5. 元素的filter属性值不是none
6. 元素的isolation属性值不是isolate
7. will-change指定的属性值为上面任意一个
8. 元素的-webkit-overflow-scrolling属性值为touch

**比较方法：**

1. 先看要比较的元素是否处于同一个层叠上下文中
   - 如果是，谁的层叠等级大，谁在上面（判断层叠等级大小参考层叠顺序图）
   - 如果不是，先比较所处的层叠上下文的层叠等级
2. 当两个元素层叠等级相同、层叠顺序相同时，在DOM结构中后面的元素层叠等级在前面元素之上。

<br />

## 如何实现水平、垂直、水平垂直居中

1. 水平居中：
   - 对于块级元素，可以使用 `margin: 0 auto;` 将左右外边距设置为 “auto”。
   - 对于行内元素，可以使用 `text-align: center;` 将容器的文本对齐方式设置为 “center”。
2. 垂直居中：

   - 对于单行文本或行内元素，可以使用 `line-height` 属性与 `height` 属性相等，并将 `vertical-align` 属性设置为 “middle” 来实现垂直居中。
   - 对于块级元素，可以使用 Flexbox 或 Grid 布局来实现垂直居中。

3. 水平垂直居中
   - flex布局：`display: flex; justify-content: center; align-items: center;`
   - grid布局：`display: grid; place-items: center;`
   - 绝对定位 + 负外边距（元素宽度、高度已知）
   - 绝对定位 + transform（元素宽度、高度未知）
   - table布局：

<br />

## 什么是回流

reflow 的本质就是重新计算 layout 树。

- 当进行了会影响布局树的操作后，需要重新计算布局树，会引发 layout
- 为了避免连续的多次操作导致布局树反复计算，浏览器会合并这些操作，当 JS 代码全部完成后再进行统一计算。所以，改动属性造成的 reflow 是异步完成的
- 也同样因为如此，当 JS 获取布局属性时，就可能造成无法获取到最新的布局信息。浏览器在反复权衡下，最终决定获取属性立即 reflow

**触发因素**：

- 页面首次渲染
- 浏览器窗口大小发生改变
- 元素尺寸或位置发生改变
- 元素内容变化(文字数量或图片大小等等)
- 元素字体大小变化
- 添加或删除可见的DOM元素
- 激活CSS伪类(如 `:hover` )
- 查询某些属性或调用某些方法：
  - `clientWidth、clientHeight、clientTop、clientLeft`
  - `offsetWidth、offsetHeight、offsetTop、offsetLeft`
  - `scrollWidth、scrollHeight、scrollTop、scrollLeft`
  - `scrollIntoView()、scrollIntoViewIfNeeded()`
  - `getComputedStyle()`
  - `getBoundingClientRect()`
  - `scrollTo()`

<br />

## 什么是重绘

repaint 的本质就是重新根据分层信息计算了绘制指令。

- 当改动了可见样式后，就需要重新计算，会引发 repaint。

- 由于元素的布局信息也属于可见样式，所以 reflow 一定会引起 repaint。

<br />

## 重绘与重排的区别

关键区别：

- 重绘只涉及元素的外观的改变，而重排涉及布局和几何属性的改变。
- 重绘不引起布局的重新计算和元素的重新定位，而重排需要重新计算布局和重新定位元素。
- 重绘的开销较小，重排的开销较大，频繁的重排会对性能产生负面影响。

为了提高页面的性能，应尽量减少重排和重绘的次数。以下是一些优化的建议：

- 尽量使用 CSS3 的 transforms 和 opacity 来实现动画效果，它们可以利用 GPU 加速，减少重排和重绘的开销。
- 使用 `display: none` 替代 `visibility: hidden` 来隐藏元素，避免引起不必要的重排。
- 将需要多次改变的样式属性合并为一个 CSS 类，通过修改元素的类名一次性应用这些样式，减少多次重排的发生。
- 避免频繁读取布局属性（如 offsetTop、offsetLeft 等），因为读取这些属性会强制浏览器进行重排。

<br />

## 为什么 transform 的效率高

因为 transform 既不会影响布局也不会影响绘制指令，它影响的只是渲染流程的最后一个「draw」阶段。由于 draw 阶段在合成线程中，所以 transform 的变化几乎不会影响渲染主线程。反之，渲染主线程无论如何忙碌，也不会影响 transform 的变化。

<br />

## 什么是包含块

元素的尺寸和位置，会受它的包含块所影响。对于一些属性，例如 width, height, padding, margin，绝对定位元素的偏移值（比如 position 被设置为 absolute 或 fixed），当我们对其赋予百分比值时，这些值的计算值，就是通过元素的包含块计算得来。

包含块分为两种，一种是根元素（HTML 元素）所在的包含块，被称之为初始包含块（**initial containing block**）。对于浏览器而言，初始包含块的的大小等于视口 viewport 的大小，基点在画布的原点（视口左上角）。它是作为元素绝对定位和固定定位的参照物。

另外一种是对于非根元素，对于非根元素的包含块判定就有几种不同的情况了。大致可以分为如下几种：

- 如果元素的 positiion 是 relative 或 static ，那么包含块由离它最近的块容器（block container）的内容区域（content area）的边缘建立。
- 如果 position 属性是 fixed，那么包含块由视口建立。
- 如果元素使用了 absolute 定位，则包含块由它的最近的 position 的值不是 static （也就是值为fixed、absolute、relative 或 sticky）的祖先元素的内边距区的边缘组成。
- 也可能是由满足以下条件的最近父级元素的内边距区的边缘组成的：
  - transform 或 perspective 的值不是 none
  - will-change 的值是 transform 或 perspective
  - filter 的值不是 none 或 will-change 的值是 filter(只在 Firefox 下生效).
  - contain 的值是 paint (例如: contain: paint;)

<br />

## CSS属性计算过程是什么

分为如下这么 _4_ 个步骤：

- 确定声明值
- 层叠冲突
- 使用继承
- 使用默认值

1. 第一步，是确定声明值。所谓声明值就是作者自己所书写的 CSS 样式。用户代理样式表（浏览器提供的样式表）和确定声明值没有什么冲突的，因此最终就会应用这些属性值。
2. 第二步：声明的样式规则发生了冲突。此时会进入解决层叠冲突的流程。而这一步又可以细分为下面这三个步骤：
   - 比较源的重要性，三种来源：
     - 浏览器会有一个基本的样式表来给任何网页设置默认样式。这些样式统称**用户代理样式**。
     - 网页的作者可以定义文档的样式，这是最常见的样式表，称之为**页面作者样式**。
     - 浏览器的用户，可以使用自定义样式表定制使用体验，称之为**用户样式**。
     - 对应的重要性顺序依次为：页面作者样式 > 用户样式 > 用户代理样式
   - 比较优先级：同一个源中有样式冲突
   - 比较次序：同源同权重，后面的覆盖前面的样式
3. 第三步：未确定的属性值使用继承
4. 第四步：还未确定的属性值使用默认值

<br />

## 常见的布局单位

常用的布局单位包括像素（`px`），百分比（`%`），`em`，`rem`，`vw/vh`。

**（1）像素**（`px`）是页面布局的基础，一个像素表示终端（电脑、手机、平板等）屏幕所能显示的最小的区域，像素分为两种类型：CSS像素和物理像素：

- **CSS像素**：为web开发者提供，在CSS中使用的一个抽象单位；
- **物理像素**：只与设备的硬件密度有关，任何设备的物理像素都是固定的。

**（2）百分比**（`%`），当浏览器的宽度或者高度发生变化时，通过百分比单位可以使得浏览器中的组件的宽和高随着浏览器的变化而变化，从而实现响应式的效果。一般认为子元素的百分比相对于直接父元素。

**（3）em和rem**相对于px更具灵活性，它们都是相对长度单位，它们之间的区别：**em相对于父元素字体大小，rem相对于根元素字体大小。**

**（4）vw/vh**是与视图窗口有关的单位，vw表示相对于视图窗口的宽度，vh表示相对于视图窗口高度，除了vw和vh外，还有vmin和vmax两个相关的单位。

<br />

## CSS有哪些优化方法

1. **合并和压缩CSS文件**：

   - 将多个CSS文件合并为一个文件，减少HTTP请求。
   - 使用压缩工具压缩CSS文件大小，去除空格、注释和不必要的字符。

2. **使用缩写属性和简化选择器**：

   - 使用CSS属性的缩写形式，如`margin: 0;`代替`margin-top: 0; margin-right: 0; margin-bottom: 0; margin-left: 0;`。
   - 简化选择器，避免过度嵌套和冗长的选择器，提高选择器的效率。

3. **避免使用昂贵的CSS选择器**：

   - 避免使用通用选择器（`*`）、后代选择器（`div p`）和属性选择器等会导致性能下降的选择器。
   - 选择器的层级越少，匹配速度越快。

4. **使用CSS Sprites和字体图标**：
   - 将多个小图标合并到一张大图中，通过设置`background-position`来显示特定图标，减少HTTP请求。
   - 使用字体图标（如Font Awesome、Material Icons）替代图像，可以减少图像的下载和处理时间。
5. **利用浏览器缓存**：

   - 设置适当的缓存头部（Cache Headers），让浏览器缓存CSS文件，减少后续页面加载时的网络请求。

6. **使用CSS预处理器**：

   - 使用CSS预处理器（如Sass、Less）可以帮助编写更模块化、可维护的CSS代码，并提供一些额外的功能和工具来优化CSS输出。

7. **避免使用!important和@import**：

   - 避免过度使用`!important`，它会增加样式优先级的复杂性，导致代码难以维护。

8. **减少重排和重绘**

<br />

## CSS变量有何作用

1. 提高代码的可维护性：CSS 变量允许将常用的值（如颜色、字体大小、间距等）定义为变量，然后在多个地方引用。如果需要修改这些值，只需修改变量的定义，而不需要逐个修改具体的样式。
1. 动态样式调整：CSS 变量可以在运行时通过 JavaScript 动态修改，从而实现主题切换或动态样式调整
1. 简化复杂计算：CSS 变量可以与其他 CSS 函数（如 `calc()`）结合使用，简化复杂的计算

<br />

## CSS如何配置暗黑模式

通常通过以下两种方式实现：

1. **使用 CSS 变量**：通过定义不同的变量来切换主题。

   - 使用 `:root` 定义默认的浅色模式变量。
   - 使用 `[data-theme="dark"]` 定义暗黑模式变量。
   - 通过 JavaScript 切换 `<html>` 元素的 `data-theme` 属性来动态切换主题。

2. **使用 `prefers-color-scheme` 媒体查询**：根据用户的系统偏好自动切换主题。

   - 使用 `@media (prefers-color-scheme: dark)` 媒体查询检测用户的系统主题偏好。

   - 根据用户偏好自动应用暗黑模式或浅色模式，无需JS，完全由CSS控制

<br />

## 如何保持图片宽高比

1. 使用 `aspect-ratio` 属性

```
img {
  aspect-ratio: 16 / 9; /* 设置宽高比为16:9 */
  width: 100%; /* 宽度自适应 */
  height: auto; /* 高度自动调整 */
}
```

2. 使用 `padding-top` 技巧：通过设置 `padding-top` 为百分比值，可以保持元素的宽高比。

```
.container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 宽高比 (9 / 16 * 100%) */
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持图片比例并填充容器 */
}
```

3. 使用 `object-fit` 属性：`object-fit` 属性可以控制图片在容器中的显示方式，保持宽高比。

```
img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持图片比例，完整显示图片 */
}
```

4. 使用 `max-width` 和 `max-height`：通过设置 `max-width` 和 `max-height`，可以限制图片的最大尺寸，保持宽高比。

```
img {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  width: auto;
}
```

5. 使用 `vw` 和 `vh` 单位

```
img {
  width: 50vw; /* 宽度为视口宽度的50% */
  height: 28.125vw; /* 高度为视口宽度的28.125% (16:9 宽高比) */
}
```

6. 使用 `flexbox` 或 `grid` 布局：在 `flexbox` 或 `grid` 布局中，可以通过设置容器的宽高比来保持图片的宽高比。

```
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 56.25%; /* 16:9 宽高比 */
  position: relative;
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

总结

- **`aspect-ratio`**：最简单直接的方式，但需要浏览器支持。
- **`padding-top` 技巧**：兼容性好，适用于大多数场景。
- **`object-fit`**：适合控制图片在容器中的显示方式。
- **`max-width` 和 `max-height`**：适合限制图片的最大尺寸。
- **`vw` 和 `vh` 单位**：适合响应式设计。
- **`flexbox` 或 `grid` 布局**：适合复杂布局中的宽高比控制。

<br />
