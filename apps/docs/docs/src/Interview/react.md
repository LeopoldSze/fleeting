## React16

### 如何理解react的单向数据流和vue的双向数据绑定？

React 的单向数据流

**1. 数据流动方向：**

- **单向数据流**：数据从父组件流向子组件，子组件通过 props 接收父组件的数据。
- **状态管理**：父组件通过 `setState` 更新状态，子组件无法直接修改父组件的状态，只能通过回调函数通知父组件进行更新。

**2. 数据更新机制：**

- **状态更新**：父组件状态变化时，会重新渲染子组件。
- **不可变性**：React 强调数据的不可变性，状态更新时需创建新对象或数组，而不是直接修改原数据。

**3. 优点：**

- **可预测性**：数据流动清晰，便于调试。
- **组件独立性**：组件间依赖明确，易于维护。

Vue 的双向数据绑定

**1. 数据流动方向：**

- **双向数据绑定**：数据在父组件和子组件之间双向流动，子组件可以直接修改父组件的数据。
- **v-model**：Vue 通过 `v-model` 实现表单元素与数据的双向绑定。

**2. 数据更新机制：**

- **响应式系统**：Vue 通过响应式系统自动追踪数据变化并更新视图。
- **直接修改**：子组件可以直接修改父组件传递的数据。

**3. 优点：**

- **开发便捷**：减少代码量，提升开发效率。
- **直观性**：数据与视图同步，逻辑更直观。

<br />

### props和state区别？

相同点：都是用于存储数据的，都可以触发组件的重新渲染

不同点：

- **`props`（属性）**：
  - 是组件外部传入的数据，类似于函数的参数。
  - 是只读的，组件不能直接修改 `props`。
  - 用于父组件向子组件传递数据或配置。
- **`state`（状态）**：
  - 是组件内部管理的动态数据。
  - 是可变的，组件可以通过 `setState`（类组件）或 `useState` Hook（函数组件）更新状态。
  - 用于存储组件的内部状态，如用户输入、组件是否可见等。

<br />

### 创建组件的方式？

| 组件类型          | 创建方式                          | 特点                                       |
| :---------------- | :-------------------------------- | :----------------------------------------- |
| **函数组件**      | 使用 JavaScript 函数定义          | 简洁、支持 Hooks，推荐使用                 |
| **类组件**        | 使用 ES6 类定义，继承 `Component` | 支持状态和生命周期方法，逐渐被函数组件取代 |
| **PureComponent** | 继承 `PureComponent`              | 自动浅比较 `props` 和 `state`，优化性能    |
| **高阶组件**      | 函数接收组件并返回新组件          | 用于逻辑复用                               |
| **Render Props**  | 通过 `props` 传递渲染逻辑         | 用于共享组件逻辑                           |
| **自定义 Hooks**  | 使用 Hooks 提取逻辑               | 逻辑复用，函数组件专用                     |

<br />

### 组件通信的方式？

| 方式             | 适用场景                      | 特点                                                                                          |
| :--------------- | :---------------------------- | :-------------------------------------------------------------------------------------------- |
| **Props**        | 父组件向子组件传值            | 简单易用，单向数据流，数据从父组件流向子组件                                                  |
| **回调函数**     | 子组件向父组件传值            | 父组件可以通过 `props` 传递一个回调函数给子组件，子组件调用该函数并将数据作为参数传递回父组件 |
| **状态提升**     | 兄弟组件传值                  | 状态提升到父组件                                                                              |
| **Context API**  | 跨层级组件传值                | 避免 `props` 逐层传递                                                                         |
| **Redux/MobX**   | 全局状态管理                  | 适合大型应用                                                                                  |
| **Refs**         | 直接访问子组件实例或 DOM 元素 | 适合需要直接操作子组件的情况                                                                  |
| **事件总线**     | 任意组件之间的通信            | 需要手动管理事件订阅和发布                                                                    |
| **自定义 Hooks** | 封装复杂传值逻辑              | 提高代码复用性                                                                                |

<br />

### 事件机制和原生有何不同？

**事件机制：**

- React 将所有事件委托到文档的根节点（React 17 之前是 `document`，React 17 及之后是 `root` 节点），通过事件委托机制统一管理。
- React 事件只有冒泡阶段，没有捕获阶段（React 17 之前），但 React 17 及之后支持捕获阶段

**事件对象：**

- **DOM 事件流**：
  - 事件处理函数接收的是原生事件对象（`Event`）。
  - 原生事件对象在不同浏览器中可能存在差异。
- **React 事件机制**：
  - 事件处理函数接收的是 React 封装后的合成事件（`SyntheticEvent`）。
  - 合成事件是跨浏览器一致的，提供了统一的 API。
  - 合成事件会被池化（pooled），意味着事件对象会被复用，事件回调执行完后，事件对象的属性会被清空。如果需要异步访问事件对象，需要调用 `event.persist()`。

| 特性         | DOM 事件流                   | React 事件机制                                           |
| :----------- | :--------------------------- | :------------------------------------------------------- |
| **事件绑定** | 直接绑定到 DOM 元素          | 通过 JSX 绑定，使用合成事件，并不是直接绑定到 DOM 元素上 |
| **事件对象** | 原生事件对象                 | 合成事件（跨浏览器一致）                                 |
| **事件传播** | 捕获 -> 目标 -> 冒泡         | 默认只有冒泡（React 17+ 支持捕获）                       |
| **性能优化** | 大量事件绑定可能导致性能问题 | 事件委托，性能更优                                       |
| **兼容性**   | 需要处理浏览器兼容性问题     | 跨浏览器一致                                             |

React 的事件机制通过合成事件和事件委托，提供了更高效、更一致的事件处理方式，同时减少了开发者的兼容性负担。

<br />

### 生命周期

**React 16.3 之前的生命周期**

(1) **挂载阶段（Mounting）**

- **`constructor()`**：
  - 构造函数，用于初始化状态和绑定方法。
- **`componentWillMount()`**：
  - 在组件挂载到 DOM 之前调用（即将废弃）。
- **`render()`**：
  - 渲染组件内容。
- **`componentDidMount()`**：
  - 在组件挂载到 DOM 后调用，适合进行 DOM 操作或数据请求。

(2) **更新阶段（Updating）**

- **`componentWillReceiveProps(nextProps)`**：
  - 在组件接收到新的 `props` 时调用（即将废弃）。
- **`shouldComponentUpdate(nextProps, nextState)`**：
  - 决定组件是否需要重新渲染，返回 `true` 或 `false`。
- **`componentWillUpdate(nextProps, nextState)`**：
  - 在组件重新渲染之前调用（即将废弃）。
- **`render()`**：
  - 重新渲染组件内容。
- **`componentDidUpdate(prevProps, prevState)`**：
  - 在组件重新渲染后调用，适合进行 DOM 操作或数据请求。

(3) **卸载阶段（Unmounting）**

- **`componentWillUnmount()`**：
  - 在组件卸载之前调用，适合清理定时器、取消网络请求等。

---

**React 16.3 及之后的生命周期**

React 16.3 引入了新的生命周期方法，并逐步废弃了一些旧方法。以下是新的生命周期流程：

(1) **挂载阶段（Mounting）**

- **`constructor()`**：
  - 构造函数，用于初始化状态和绑定方法。
- **`static getDerivedStateFromProps(props, state)`**：
  - 在组件创建和更新时调用，用于根据 `props` 更新 `state`。
- **`render()`**：
  - 渲染组件内容。
- **`componentDidMount()`**：
  - 在组件挂载到 DOM 后调用。

(2) **更新阶段（Updating）**

- **`static getDerivedStateFromProps(props, state)`**：
  - 在组件创建和更新时调用。
- **`shouldComponentUpdate(nextProps, nextState)`**：
  - 决定组件是否需要重新渲染。
- **`render()`**：
  - 重新渲染组件内容。
- **`getSnapshotBeforeUpdate(prevProps, prevState)`**：
  - 在 DOM 更新之前调用，用于获取 DOM 信息（如滚动位置）。
- **`componentDidUpdate(prevProps, prevState, snapshot)`**：
  - 在组件重新渲染后调用。

(3) **卸载阶段（Unmounting）**

- **`componentWillUnmount()`**：
  - 在组件卸载之前调用。

---

**React 17 及之后的生命周期**

React 17 没有引入新的生命周期方法，但完全移除了以下旧方法：

- **`componentWillMount()`**
- **`componentWillReceiveProps()`**
- **`componentWillUpdate()`**

这些方法在 React 16.3 中被标记为 `UNSAFE_`，并在 React 17 中完全移除。

| 生命周期方法                            | React 16.3 之前 | React 16.3 及之后   | React 17 及之后 |
| :-------------------------------------- | :-------------- | :------------------ | :-------------- |
| **`constructor()`**                     | ✅              | ✅                  | ✅              |
| **`componentWillMount()`**              | ✅              | ❌（标记为 UNSAFE） | ❌（移除）      |
| **`static getDerivedStateFromProps()`** | ❌              | ✅                  | ✅              |
| **`render()`**                          | ✅              | ✅                  | ✅              |
| **`componentDidMount()`**               | ✅              | ✅                  | ✅              |
| **`componentWillReceiveProps()`**       | ✅              | ❌（标记为 UNSAFE） | ❌（移除）      |
| **`shouldComponentUpdate()`**           | ✅              | ✅                  | ✅              |
| **`componentWillUpdate()`**             | ✅              | ❌（标记为 UNSAFE） | ❌（移除）      |
| **`getSnapshotBeforeUpdate()`**         | ❌              | ✅                  | ✅              |
| **`componentDidUpdate()`**              | ✅              | ✅                  | ✅              |
| **`componentWillUnmount()`**            | ✅              | ✅                  | ✅              |

<br />

### setState作用和原理？

`setState` 是 React 中用于更新组件状态（`state`）的核心方法。它不仅是更新状态的入口，还负责触发组件的重新渲染。直接传入一个对象，React 会将其与当前 `state` 合并。传入一个函数，函数的参数是上一个状态（`prevState`）和当前的 `props`，返回一个新的状态对象。如果需要基于更新后的状态执行操作，可以使用回调函数作为第二个参数。

- **更新组件的状态**：
  - `setState` 用于更新组件的 `state`，并触发组件的重新渲染。
- **异步更新**：
  - `setState` 是异步的，React 会将多个 `setState` 调用合并，以提高性能。
- **触发重新渲染**：
  - 当 `state` 更新后，React 会重新调用 `render` 方法，生成新的虚拟 DOM，并通过 Diff 算法更新真实 DOM。

<br />

### 受控组件和非受控组件区别

**受控组件**：指表单元素的值由 React 的状态（state）控制。每当用户输入时，状态会更新，组件也会重新渲染以反映最新的值。适合需要实时验证或处理的表单。

特点：

- 表单数据由 React 组件管理。
- 使用 `onChange` 事件监听输入变化，更新状态。
- 值通过 `value` 属性绑定到状态。

**非受控组件**：指表单元素的值由 DOM 自身管理，而不是通过 React 的状态。通常使用 `ref` 来获取 DOM 元素的值。适合简单表单或与非 React 代码集成。

特点：

- 表单数据由 DOM 管理。
- 使用 `ref` 获取表单元素的值。
- 适用于简单场景或集成非 React 代码。

<br />

### refs是什么？

是一种用于直接访问 DOM 元素或 React 组件实例的机制。它允许你绕过 React 的状态和 props 系统，直接操作底层 DOM 或组件实例。

作用：

- 访问 DOM 元素：直接操作 DOM，如聚焦输入框、获取元素尺寸等。
- 访问组件实例：直接调用类组件的方法或访问其属性（仅限于类组件）。
- 保存可变值：在函数组件中，`refs` 可以保存不会触发重新渲染的值。

类组件：使用 `React.createRef()` 创建 `ref`，并将其附加到 JSX 元素

函数组件：使用 `useRef` Hook 创建 `ref`，可以保存不会触发重新渲染的值

::: warning

- **避免过度使用 `refs`**：React 提倡声明式编程，优先使用状态和 props 管理组件行为。
- **函数组件不支持实例引用**：`refs` 不能直接用于函数组件，除非使用 `forwardRef`。
- **`refs` 不会触发重新渲染**：修改 `refs` 的值不会导致组件重新渲染。

:::

<br />

### 如何实现vue的keep-alive？

1. 使用 `display: none` 切换组件的显示/隐藏，组件不会被卸载，状态可以保留，但是隐藏的组件仍然会占用内存
2. 使用 `React.Portal` 和状态提升：通过 `React.Portal` 将组件渲染到 DOM 树的另一个位置，同时在父组件中保留状态，如 `ReactDOM.createPortal(<MyComponent />, document.body)`
3. 使用第三方库，如：**react-activation**、**react-keep-alive**
4. **使用 `React.memo` 和 `useMemo`**：通过 `React.memo` 和 `useMemo` 缓存组件的渲染结果，避免不必要的重新渲染。

<br />

### Diff的底层原理

**1. 同级比较（Tree Diff）**

- React 只会对比同一层级的节点，不会跨层级比较。
- 如果发现节点类型不同（例如从 `div` 变成了 `span`），React 会直接销毁整个子树并重新创建。
- 这种策略大大减少了比较的复杂度。

**2. 组件类型一致时递归比较**

- 如果节点类型相同（例如都是 `div` 或同一个组件），React 会递归比较其子节点。
- 对于组件，如果类型相同，React 会更新组件的属性（props）并触发组件的生命周期方法（如 `componentDidUpdate`）。

**3. 列表节点的 Key 优化**

- 当对比列表节点时，React 会使用 `key` 属性来识别节点的唯一性。
- 如果列表中的节点有唯一的 `key`，React 可以通过 `key` 快速定位新增、删除或移动的节点，而不是重新创建整个列表。
- 如果没有 `key`，React 会默认使用索引（index）作为 `key`，这可能导致性能问题或状态错误。

**4. 节点类型不同时直接替换**

- 如果节点类型不同（例如从 `div` 变成了 `span`），React 会直接销毁旧节点及其子树，并创建新节点。
- 这种策略虽然简单粗暴，但在实际应用中非常高效。

基本步骤：

1. **对比根节点**：
   - 如果根节点类型不同，直接销毁旧树，创建新树。
   - 如果根节点类型相同，递归对比其属性和子节点。
2. **对比子节点**：
   - 如果子节点是列表，React 会使用 `key` 来优化对比过程。
   - 如果没有 `key`，React 会按顺序对比子节点，可能导致性能问题。
3. **更新 DOM**：
   - 根据 Diff 结果，React 只会更新实际 DOM 中需要变化的部分。

<br />

### key的作用和原理

**作用**

1. **识别元素**：`key` 帮助 React 区分列表中的不同元素，确保每个元素有唯一的标识。
2. **优化渲染**：通过 `key`，React 可以更高效地更新、添加或删除元素，减少不必要的 DOM 操作。
3. **保持状态**：`key` 确保元素在重新渲染时保持正确的状态，避免状态混乱。

**原理**

- **虚拟 DOM 对比**：React 使用虚拟 DOM 进行对比，`key` 帮助 React 识别哪些元素是新的、哪些是旧的。
- **复用元素**：如果 `key` 相同，React 会复用现有元素；如果 `key` 不同，React 会创建新元素或移除旧元素。
- **提高性能**：通过 `key`，React 可以避免不必要的 DOM 操作，提升性能。

<br />

### 不同版本Diff的区别？

| React 版本 | Diff 算法        | 核心改进                                                               |
| :--------- | :--------------- | :--------------------------------------------------------------------- |
| React 15   | Stack Reconciler | 递归同步对比，依赖 `key` 优化列表更新。                                |
| React 16   | Fiber Reconciler | 引入 Fiber 架构，支持异步渲染和优先级调度，优化列表更新。              |
| React 17   | Fiber Reconciler | 渐进升级，改进事件委托和内部优化。                                     |
| React 18   | Fiber Reconciler | 引入并发渲染，支持自动批处理和过渡更新，进一步优化任务调度和列表更新。 |

<br />

### fiber及原理

React 16 引入的全新架构，旨在解决 React 在渲染大型应用时的性能问题，特别是对动画、手势等需要高优先级更新的场景的支持。Fiber 是 React 核心算法的重写，主要目标是实现**增量渲染**（Incremental Rendering），即能够将渲染工作拆分成多个小任务，并根据优先级调度这些任务。

**Fiber 节点**

- Fiber 是 React 中的一种数据结构，代表一个工作单元。
- 每个 React 元素（如组件、DOM 节点）都对应一个 Fiber 节点。
- Fiber 节点包含了组件的类型、状态、props、子节点等信息。

**双向链表结构**

- Fiber 节点之间通过链表连接，形成一个树形结构。
- 每个 Fiber 节点包含以下指针：
  - `child`：指向第一个子节点。
  - `sibling`：指向下一个兄弟节点。
  - `return`：指向父节点。
- 这种结构使得 React 可以方便地遍历和操作组件树。

**工作循环**

- React Fiber 通过一个工作循环（Work Loop）来调度任务。
- 工作循环将任务拆分为多个小任务，每次执行一个小任务后，检查是否有更高优先级的任务需要处理。
- 如果没有更高优先级的任务，继续执行当前任务；否则，中断当前任务，执行高优先级任务。

**任务优先级**

- React Fiber 引入了任务优先级的概念，优先级从高到低包括：
  - **同步任务**（Sync）：最高优先级，立即执行。
  - **用户阻塞任务**（User Blocking）：如用户输入、动画。
  - **普通任务**（Normal）：如数据更新。
  - **低优先级任务**（Low）：如预加载。
  - **空闲任务**（Idle）：最低优先级，在空闲时执行。

**时间切片（Time Slicing）**

- React Fiber 将渲染任务拆分为多个小任务，每个任务执行一段时间（通常为 5ms）。
- 如果任务执行时间过长，React 会暂停任务，将控制权交还给浏览器，避免阻塞主线程。
- 浏览器可以处理更高优先级的任务（如用户输入、动画），提高应用的响应速度。

**任务调度（Scheduling）**

- React Fiber 使用调度器（Scheduler）来管理任务的优先级。
- 调度器根据任务的优先级决定任务的执行顺序。
- 高优先级任务会打断低优先级任务的执行。

**双缓存技术（Double Buffering）**

- React 在内存中维护两棵 Fiber 树：
  - **当前树（Current Tree）**：当前显示的 UI 对应的 Fiber 树。
  - **工作树（WorkInProgress Tree）**：正在构建的新 Fiber 树。
- 当工作树构建完成后，React 会将其切换为当前树，实现无缝更新。

<br />

## React 16.8+

### 和Vue3 Diff的区别？

| 特性               | React 18                         | Vue 3                              |
| :----------------- | :------------------------------- | :--------------------------------- |
| **核心 Diff 策略** | 同级比较，递归对比，依赖 `key`   | 双端对比，静态标记，Block Tree     |
| **虚拟 DOM 结构**  | 普通 JavaScript 对象树           | 编译时优化，区分静态节点和动态节点 |
| **列表对比**       | 依赖 `key`，按顺序对比           | 双端对比，智能识别节点移动和复用   |
| **性能优化**       | 并发渲染，批量更新               | 静态提升，Block Tree               |
| **开发体验**       | 需要手动管理 `key`，支持并发渲染 | 自动优化，编译时提升性能           |

<br />

### React hooks是什么？

React Hooks 是 React 16.8 引入的特性，允许你在函数组件中使用状态（state）和其他 React 功能，而无需编写类组件。Hooks 提供了更简洁、灵活的方式来管理组件逻辑。

- `useState`：用于在函数组件中添加状态
- `useEffect`：用于处理副作用，如数据获取、订阅、手动 DOM 操作等
- `useContext`：用于访问 React 的 Context，避免多层传递 props
- `useReducer`：用于复杂状态逻辑，类似于 Redux 的 reducer
- `useCallback`：用于缓存回调函数，避免不必要的重新渲染
- `useMemo`：用于缓存计算结果，优化性能
- `useRef`：用于创建可变的引用对象，常用于访问 DOM 元素
- `useLayoutEffect`：类似于 `useEffect`，但在 DOM 更新后同步执行，适合需要直接操作 DOM 的场景

<br />

### hooks底层原理

React 使用一个**链表**（Fiber 树）来管理组件的状态和生命周期。对于函数组件，React 会在内部维护一个 **Hooks 链表**，每个 Hook 都对应链表中的一个节点。

- **Hooks 链表**：每个 Hook（如 `useState`、`useEffect`）在组件渲染时会被添加到链表中。
- **Hook 节点**：每个 Hook 节点存储了 Hook 的状态（如 `useState` 的值）以及相关的逻辑（如 `useEffect` 的副作用函数）。

基本实现：

**Dispatcher**

- React 使用一个全局的 `Dispatcher` 对象来管理 Hooks 的调用。
- 在渲染时，React 会根据当前阶段（Mount 或 Update）切换不同的 Dispatcher。

**Fiber 节点**

- 每个函数组件对应一个 Fiber 节点，Fiber 节点中存储了 Hooks 链表。
- Hooks 链表的每个节点存储了 Hook 的状态和逻辑。

**状态更新**

- 当调用 `setState` 时，React 会创建一个更新任务，并将其放入调度队列中。
- 在下次渲染时，React 会处理更新任务，并更新 Hook 节点的状态值。

总结：

1. **Hooks 链表**：React 使用链表来存储和管理 Hooks 的状态和逻辑。
2. **调用顺序**：Hooks 必须按照固定的顺序调用，以保证状态的一致性。
3. **状态存储**：`useState` 的状态值存储在 Hook 节点中，`setState` 会触发重新渲染。
4. **副作用管理**：`useEffect` 的副作用函数会被注册到 Hook 节点中，并在适当的时机执行。

<br />

### useEffect和useLayoutEffect区别

**useEffect**:

- **异步执行**：在浏览器完成绘制（DOM 更新并渲染到屏幕）之后执行。
- 不会阻塞浏览器的渲染过程，适合大多数副作用操作（如数据获取、订阅等）。

**useLayoutEffect**:

- **同步执行**：在 DOM 更新之后，但在浏览器绘制之前执行。
- 会阻塞浏览器的渲染过程，适合需要直接操作 DOM 或需要在渲染前同步更新状态的场景。

<br />

### useCallback和useMemo区别

| 特性             | `useCallback`                                                                                                                  | `useMemo`              |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------- | :--------------------- |
| **作用**         | 缓存回调函数                                                                                                                   | 缓存计算结果           |
| **返回值**       | 返回一个函数                                                                                                                   | 返回一个值             |
| **适用场景**     | 当需要将函数作为 props 传递给子组件时，使用 `useCallback` 可以避免子组件不必要的重新渲染。只有当依赖项变化时，才会重新创建函数 | 避免重复计算昂贵的逻辑 |
| **依赖项变化时** | 重新创建函数                                                                                                                   | 重新计算值             |
| **性能优化点**   | 减少函数实例的创建                                                                                                             | 减少重复计算的开销     |

<br />

### useContext和vue的provide/inject区别？

| 特性             | React 的 `useContext`           | Vue 的 `provide/inject`                 |
| :--------------- | :------------------------------ | :-------------------------------------- |
| **设计理念**     | 单向数据流，函数式思想          | 依赖注入，面向对象思想                  |
| **使用方式**     | 通过 `Provider` 和 `useContext` | 通过 `provide` 和 `inject`              |
| **数据传递范围** | 仅限于 Context 树中的组件       | 可以在任意组件之间传递数据              |
| **响应式**       | 需要手动管理状态更新            | 自动支持响应式数据                      |
| **性能优化**     | 依赖 React 的渲染机制           | 依赖 Vue 的响应式系统                   |
| **底层实现**     | 基于 Fiber 树的 Context 传递    | 基于父组件的 `_provided` 属性的依赖注入 |

<br />

### React18更新了什么？

1. **并发渲染**：提升性能和响应性。
   - **可中断渲染**：React 可以在高优先级任务（如用户输入）到来时中断当前渲染，优先处理高优先级任务。
   - **自动批处理**：React 会自动将多个状态更新批处理为一次渲染，减少不必要的渲染次数。
   - **更流畅的用户体验**：通过并发渲染，React 可以更好地处理复杂 UI 和大量数据更新，避免界面卡顿
2. **新的 Root API**：支持并发特性。
   - **`createRoot`**：创建一个支持并发渲染的根节点。
   - **`root.render`**：替换 `ReactDOM.render`，支持并发特性。
3. **自动批处理**：减少不必要的渲染。
   - **批处理范围扩大**：React 18 会在更多场景下自动批处理状态更新（如 Promise、setTimeout 等）。
   - **手动控制**：如果需要立即更新，可以使用 `flushSync`。
4. **新的 Hooks**：如 `useId`、`useSyncExternalStore` 等。
5. **Suspense 改进**：支持数据获取和 SSR。
   - **服务端渲染（SSR）支持**：Suspense 现在可以用于服务端渲染，提升 SSR 性能。
   - **流式渲染**：支持流式渲染 HTML，用户可以更快看到内容。
6. **严格模式改进**：帮助发现潜在问题。
   - **双重渲染**：在开发模式下，React 会故意渲染两次组件，以帮助发现副作用问题。
   - **警告和错误**：严格模式会检测不安全的生命周期方法和副作用。
7. **SSR 优化**：流式渲染和选择性 Hydration。
   - **流式 HTML**：支持流式传输 HTML，用户可以更快看到内容。
   - **选择性 Hydration**：React 可以优先对用户交互的部分进行 Hydration，提升用户体验。

<br />

## Redux

### redux和react-redux区别？

redux核心概念：

- **Store**：存储应用状态的容器。
- **Actions**：描述状态变化的普通对象。
- **Reducers**：纯函数，根据当前状态和 action 返回新状态。
- **Middleware**：用于扩展 Redux 的功能（如处理异步操作）。

特点：

- Redux 是框架无关的，不依赖于 React。
- 提供了可预测的状态管理机制。
- 适合管理复杂的状态逻辑。

react-redux核心功能：

- **Provider**：一个 React 组件，将 Redux Store 传递给整个应用。
- **useSelector**：一个 React Hook，用于从 Redux Store 中读取状态。
- **useDispatch**：一个 React Hook，用于派发 actions。

特点：

- 专门为 React 设计，简化了 Redux 在 React 中的使用。
- 提供了性能优化（如避免不必要的重新渲染）。
- 是 React 和 Redux 之间的桥梁。

| 特性         | Redux                    | React-Redux                        |
| :----------- | :----------------------- | :--------------------------------- |
| **用途**     | 状态管理库，框架无关     | 将 Redux 与 React 集成             |
| **核心功能** | Store、Actions、Reducers | Provider、useSelector、useDispatch |
| **依赖关系** | 不依赖 React             | 依赖 React 和 Redux                |
| **使用场景** | 任何 JavaScript 应用     | 专门用于 React 应用                |
| **性能优化** | 无                       | 提供 React 组件性能优化            |

<br />

### 类组件和函数组件中的使用方式

| 特性             | 非 Hooks（Class 组件）                             | Hooks（函数组件）                   |
| :--------------- | :------------------------------------------------- | :---------------------------------- |
| **核心 API**     | `connect`, `mapStateToProps`, `mapDispatchToProps` | `useSelector`, `useDispatch`        |
| **状态获取**     | 通过 `mapStateToProps` 映射到 `props`              | 通过 `useSelector` 直接获取状态     |
| **派发 Actions** | 通过 `mapDispatchToProps` 映射到 `props`           | 通过 `useDispatch` 直接派发 actions |
| **代码复杂度**   | 较高，需要定义映射函数                             | 较低，逻辑更集中                    |
| **性能优化**     | 通过 `connect` 自动优化                            | 通过 `useSelector` 自动优化         |
| **适用场景**     | Class 组件                                         | 函数组件                            |

<br />

## React-Router

### 工作原理

1. 用户点击 `<Link>` 或在代码中调用 `navigate`。
2. URL 发生变化。
3. React Router 监听 URL 变化，并重新匹配路由。
4. 找到匹配的路由后，渲染对应的组件。
5. 页面内容更新，但页面不会刷新。

React Router 的工作原理可以分为以下几个部分：

**1. 监听 URL 变化**

- React Router 通过 `history` 对象监听 URL 的变化。
- 当 URL 变化时，React Router 会重新匹配路由，并渲染对应的组件。

#### **2. 路由匹配**

- React Router 使用 `<Routes>` 和 `<Route>` 组件来定义路由规则。
- 当 URL 变化时，React Router 会遍历所有 `<Route>`，找到与当前 URL 匹配的路由。

#### **3. 组件渲染**

- 当找到匹配的路由时，React Router 会渲染对应的组件。
- 支持嵌套路由，父组件可以渲染子路由对应的组件。

#### **4. 导航**

- React Router 提供了 `<Link>` 组件和 `useNavigate` Hook，用于在应用内导航。
- 导航时，URL 会更新，但页面不会刷新。

**核心组件：**

**`<BrowserRouter>`**

- 使用 HTML5 的 `history` API（`pushState`、`replaceState`）来管理 URL。
- 适用于支持 HTML5 History API 的现代浏览器。

**`<HashRouter>`**

- 使用 URL 的哈希部分（`#`）来管理路由。
- 适用于不支持 HTML5 History API 的旧版浏览器。

**`<Routes>` 和 `<Route>`**

- `<Routes>` 是路由的容器，用于包裹多个 `<Route>`。
- `<Route>` 定义路由规则，指定 `path` 和对应的组件。

**`<Link>`**

- 用于在应用内导航，生成一个 `<a>` 标签。
- 点击 `<Link>` 时，URL 会更新，但页面不会刷新。

**`useNavigate`**

- 用于编程式导航，可以在代码中跳转到指定路由。

**`useParams`**

- 用于获取动态路由的参数（如 `/users/:id` 中的 `id`）。

<br />

### 如何监听路由变化？

- **`useLocation` + `useEffect`**：适用于 `react-router-dom` v5 及以上版本，推荐使用。
- **`history.listen`**：适用于 `react-router-dom` v4 及以下版本。
- **`useHistory`**：适用于 `react-router-dom` v5 及以上版本，功能与 `history.listen` 类似。
- **`useRoutes`**：适用于 `react-router-dom` v6 及以上版本，结合 `useLocation` 使用。

<br />
