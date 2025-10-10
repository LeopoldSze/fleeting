### HTML5有哪些新特性

1. 语义化标签：`<header>, <aside>, <nav>, <main>, <article>, <section>, <footer>`，更清晰地描述页面结构和内容含义，对SEO有利。方便其他设备解析。
2. 音视频支持：`<audio>, <video>`
3. 画布支持：`<canvas`>，开发者可以使用api在画布上绘制图形
4. 本地存储：`localStorage, sessionStorage`
5. 表单增强：新增input type：date、email、phone等表单元素和placeholder、autocomplete、autofocus属性
6. 地理位置API：`navigator.geolocation` 获取用户的地理位置信息
7. websocket：实现客户端和服务器的全双工通信
8. history API：go, forward, back, pushstate
9. web worker：在独立的后台线程中执行 JavaScript 代码，而不会阻塞主线程。
10. 拖拽API：`dragStart, drag, dragend, dragenter, dragover, dragleave, drop`

<br />

### 前端缓存的类型和区别

- 存储容量：
  - Cookie：通常限制在 4KB 左右，较小。
  - localStorage 和 sessionStorage：一般限制在 5MB 左右，可以存储较大的数据。
  - IndexedDB：可以存储更大量级的结构化数据，具体容量取决于浏览器的限制。
- 数据有效期：
  - Cookie：可以设置过期时间，可以在客户端持久存储数据，也可以设置为会话级别的临时存储，关闭浏览器后失效。
  - localStorage：存储的数据没有过期时间，除非手动删除或清除缓存。
  - sessionStorage：存储的数据在关闭浏览器标签页或浏览器会话结束后被清除。
  - IndexedDB：存储的数据不会随时间自动过期，除非通过代码手动删除。
- 数据传递：
  - Cookie：内容会在每次请求时自动携带到服务器端，用于实现状态保持和身份验证等功能。
  - localStorage、sessionStorage 和 IndexedDB：数据仅在客户端存储，不会自动发送到服务器。
- 存储方式：
  - Cookie：使用 document.cookie 属性进行读取和设置，存储为字符串。
  - localStorage 和 sessionStorage：使用 localStorage 和 sessionStorage API进行读取和设置，存储为键值对形式。
  - IndexedDB：使用 IndexedDB API 进行操作，提供了丰富的查询和事务支持。
- 同源策略：
  - 全部受浏览器的同源策略限制，只能读取同一域名下的存储数据。多个同源的窗口或标签页可以共享相同的cookie和 localStorage数据，sessionStorage数据不共享。
- 安全性：
  - Cookie：由于在每次请求中自动发送到服务器，安全性较低，容易受到 XSS（跨站脚本攻击）和 CSRF（跨站请求伪造）等攻击。
  - localStorage 和 sessionStorage，IndexedDB：仅在客户端存储，相对较安全，不容易受到服务器端攻击。

<br />

### 自定义属性是什么

自定义属性可以为元素添加额外的信息，这些信息可以用于JavaScript的操作、样式的控制或其他自定义逻辑。命名必须以`data-`开头。

css3中，可以使用 `attr()` 函数获取元素的自定义属性，通常用于 `content` 属性内容。

<br />

### src和href的区别

是HTML中用于引用外部资源的属性

1. 用途：
   - `src`：用于指定外部资源的地址，如图像、脚本、音频或视频等。它定义了需要加载的资源，并将其嵌入到当前文档中，从而影响页面的内容。
   - `href`：用于指定链接的目标地址，如超链接（`<a>` 标签）或样式表（`<link>` 标签）等。它定义了链接的目标，点击链接会进行跳转或资源的加载。
2. 对页面展示的影响：
   - `src`：资源加载过程中会阻塞页面的解析和渲染，如果资源加载失败或花费较长时间，可能会导致页面加载和渲染的延迟。
   - `href`：资源并行加载，通常不会阻塞页面的解析和展示

<br />

### iframe的优缺点有哪些

优点：

1. 灵活性：通过使用iframe，可以将其他网页嵌入到当前页面中，从而实现灵活的页面布局和设计。
2. 复用性：通过iframe，可以在多个页面中重复使用同一块内容，减少重复的代码量。
3. 跨域通信：iframe可以轻松地实现与不同域名的页面进行通信，这对于一些需要与第三方网站集成的应用程序非常有用。

缺点：

1. 安全性：由于iframe可以嵌入任何网页，其中的代码可能包含恶意内容，可能带来安全风险。
2. SEO问题：搜索引擎蜘蛛在抓取网页时，可能不会处理嵌入在iframe中的内容，这可能影响嵌入页面的搜索引擎排名。
3. 页面加载时间：每个嵌套在iframe中的网页都需要额外的网络请求和加载时间，这可能导致页面加载速度变慢。

<br />

### DOCTYPE 的作用

是HTML5中一种标准通用标记语言的文档类型声明，它的目的是**告诉浏览器（解析器）应该以什么样（html或xhtml）的文档类型定义来解析文档**，不同的渲染模式会影响浏览器对 CSS 代码甚⾄ JavaScript 脚本的解析。它必须声明在HTML⽂档的第⼀⾏。

浏览器渲染页面的两种模式（可通过 `document.compatMode` 获取）：

- **CSS1Compat：标准模式（Strick mode）** ，默认模式，浏览器使用W3C的标准解析渲染页面。在标准模式中，浏览器以其支持的最高标准呈现页面。
- **BackCompat：怪异模式(混杂模式)(Quick mode)** ，浏览器使用自己的怪异模式解析渲染页面。在怪异模式中，页面以一种比较宽松的向后兼容的方式显示。

<br />

### 常用的meta标签有哪些

`meta` 标签由 `name` 和 `content` 属性定义，**用来描述网页文档的属性**，比如网页的作者，网页描述，关键词等，除了HTTP标准固定了一些`name`作为大家使用的共识，开发者还可以自定义name。

- `charset`，用来描述HTML文档的编码类型：`<meta charset="UTF-8" >`
- `keywords`：页面关键词 `<meta name="keywords" content="关键词" />`
- `description`，页面描述 `<meta name="description" content="页面描述内容" />`
- `refresh`，页面重定向和刷新 `<meta http-equiv="refresh" content="0;url=" />`
- `viewport`，适配移动端，可以控制视口的大小和比例 `<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1">`

<br />

### head标签的作用是什么

用于定义文档的头部，它不会在浏览器中显示出来，而是包含了一些对文档的描述信息、引用的外部资源以及其他元数据。

1. title：文档标题
2. link，style，script：外部资源引入
3. 指定字符编码
4. 关键元信息，提供SEO优化
5. 引入图标favicon.ico：通过link标签和rel="icon"

<br />

### 请描述下SEO下的TDK

SEO是搜索引擎优化，指的是从自然搜索结果获得网站流量的技术和过程。

title, description, keywords

<br />

### 替换元素和非替换元素

1. 替换元素：
   - 替换元素是指其内容由外部资源决定的元素。在渲染时，浏览器会用外部资源的内容来替换元素本身的内容。
   - 常见的替换元素包括 `<img>`、`<video>`、`<audio>`、`<iframe>`、`<canvas>` 等。
   - 替换元素的特点：
     - 内容不受CSS样式的影响，其样式通常由外部资源自身定义。
     - 大小由元素本身的属性或CSS样式指定，可以在页面中占据指定的宽度和高度。
     - 可以通过JavaScript操作和控制。
2. 非替换元素：
   - 非替换元素是指其内容直接在浏览器中呈现的元素。浏览器会将元素的内容作为其子节点进行渲染。
   - 常见的非替换元素包括 `<div>`、`<p>`、`<span>`、`<h1>`~`<h6>`、`<ul>`、`<li>` 等。
   - 非替换元素的特点：
     - 内容受CSS样式的影响，可以通过CSS来改变其外观。
     - 具有自动尺寸，通常由内容的大小决定，也可以通过CSS样式指定。
     - 可以包含其他元素或文本内容，并形成更复杂的结构。
