# IndexedDB

## 特点

- **键值对储存**：内部采用对象仓库（object store）存放数据。所有类型的数据都可以直接存入，包括 JavaScript 对象。对象仓库中，数据以"键值对"的形式保存，每一个数据记录都有对应的主键，主键是独一无二的，不能有重复，否则会抛出一个错误。
- **异步**：操作时不会锁死浏览器，用户依然可以进行其他操作，这与 localStorage 形成对比，后者的操作是同步的。异步设计是为了防止大量数据的读写，拖慢网页的表现。
- **支持事务**：意味着一系列操作步骤之中，只要有一步失败，整个事务就都取消，数据库回滚到事务发生之前的状态，不存在只改写一部分数据的情况。
- **同源限制**：受到同源限制，每一个数据库对应创建它的域名。网页只能访问自身域名下的数据库，而不能访问跨域的数据库。
- **支持二进制储存**：不仅可以储存字符串，还可以储存二进制数据（ArrayBuffer 对象和 Blob 对象）。
- **储存空间大**：比 localStorage 大得多，一般来说不少于 250MB，甚至没有上限。储存在电脑中的位置为 `C:\Users\当前的登录用户\AppData\Local\Google\Chrome\User Data\Default\IndexedDB`

<br />

## 核心概念

- **IndexedDB**：是全局对象，它提供了打开、关闭数据库和创建新的数据库的方法。它还提供了检查当前浏览器是否支持 IndexedDB 的方法。
- **数据库**：IDBDatabase 对象，数据库有版本概念，同一时刻只能有一个版本，每个域名可以建多个数据库。IDBDatabase 代表着一个 IndexedDB 的数据库。它提供了创建、删除、事务和对象存储等方法。IDBDatabase 对象是由 `IndexedDB.open()` 方法返回的。
- **对象仓库**：IDBObjectStore 代表着对象存储空间，它类似于关系型数据库中的表格。对象存储空间用于存储和检索数据对象。IDBObjectStore 提供了添加、删除、更新和检索数据对象等方法。
- **索引**：IDBIndex 充当着 IDBObjectStore 的索引，它提供了对 IDBObjectStore 中数据对象的快速访问。IDBIndex 可以使用一个或多个属性来创建索引，使得数据对象可以按照这些属性进行检索。
- **事务**： IDBTransaction 对象，增删改查都需要通过事务来完成，事务对象提供了error,abord,complete三个回调方法，监听操作结果。它用于保证数据库操作的原子性和一致性。在一个事务中，可以执行多个数据库操作。如果其中任何一个操作失败，整个事务将被回滚。
- **操作请求**：IDBRequest 对象，代表了一个异步请求，用于向 IndexedDB 数据库发送一个请求，并返回相应的结果。当执行 IndexedDB 操作时，IDBRequest 对象会被创建并返回，开发者可以使用它来获取操作的结果。
- **指针**：IDBCursor 代表了一个游标，它提供了对 IDBObjectStore 中数据对象的逐个访问能力。开发者可以使用 IDBCursor 来遍历一个 IDBObjectStore 中的所有数据对象。
- **主键集合**：IDBKeyRange 对象，主键是默认建立索引的属性，可以取当前层级的某个属性，也可以指定下一层对象的属性，还可以是一个递增的整数。

<br />

## 使用

```js
// 基本变量定义
const db = null
const db_table = null
const databaseName = 'indexDB'
const version = 1
const data = [
  {
    id: 1,
    name: '张一',
    age: 1,
    email: 'zhangsan@example.com'
  },
  {
    id: 2,
    name: '张二',
    age: 2,
    email: 'zhangsan@example.com'
  },
  {
    id: 3,
    name: '张三',
    age: 3,
    email: 'zhangsan@example.com'
  },
  {
    id: 4,
    name: '张四',
    age: 4,
    email: 'zhangsan@example.com'
  }
]
```

### 1. 创建数据库 & 新建表和索引

```js
const request = window.indexedDB.open(databaseName, version)

/**
 * 数据库打开失败
 */
request.onerror = function (error) {
  console.log('indexedDB 打开失败：', error)
}

/**
 * 数据库打开成功
 */
request.onsuccess = function (res) {
  console.log('indexedDB 打开成功：', res)
  db = res.target.result
}

/*
 * 数据库升级(第一次新建库是也会触发，因为从无到有算是升级了一次)
 */
request.onupgradeneeded = function (res) {
  console.log('IndexedDB 升级成功:', res)
  db = res.target.result
  // 创建表group，配置项 keyPath：主键，也可以 autoIncrement: true 自动生成主键
  db_table = db.createObjectStore('group', { keyPath: 'id' })
  // 创建索引indexName，配置对象（说明该属性是否可以包含重复的值）
  db_table.createIndex('indexName', 'name', { unique: false })
}
```

<br />

### 2. 新增数据

- 语法：`objectStore().add()`

```js
// 新建事务
const store = db.transaction(['group'], 'readwrite').objectStore('group')
const addReq = store.add({
  id: 1,
  name: '网二',
  age: 12,
  email: 'xxxx@xxx.com'
})

addReq.onsuccess = function (res) {
  console.log('数据添加成功：', res)
}

addReq.onerror = function (error) {
  console.log('数据添加失败：', error)
}
```

```js
// 批量新增
const data = [
  { id: 2, title: 'HTML5 语义化标签', author: '前端周公子', createdAt: (new Date('2023-05-02')).valueOf() },
  { id: 3, title: 'HTML5 MathML', author: '前端周公子', createdAt: (new Date('2023-05-03')).valueOf() },
  { id: 4, title: 'HTML5 Canvas', author: '前端周公子', createdAt: (new Date('2023-05-04')).valueOf() },
]
const transaction = db.transaction(['html5_courses'], 'readwrite')
const objectStore = transaction.objectStore('html5_courses')

data.forEach((item) => {
  const request = objectStore.add(item)
  request.onsuccess = function (event) {
    console.log('数据已添加')
  }
})

transaction.oncomplete = function (event) {
  console.log('批量添加数据已完成')
  db.close()
}
```

::: warning

在 IndexedDB 中批量添加数据需要在事务中进行，并且需要在事务的 `oncomplete` 事件处理程序中关闭数据库连接。此外，由于 IndexedDB 在事务提交前不会实际写入数据，因此在批量插入大量数据时可能会影响性能。因此，建议采用分批插入的方式来避免性能问题。

:::

<br />

### 3. 读取数据

- 语法：`objectStore().get()`
- 读取全部：`objectStore().getAll()`

```js
// 新建事务
const store = db.transaction(['group']).objectStore('group')
// 获取id=1的数据
const readReq = store.get(1)

readReq.onsuccess = function (event) {
  if (event.target.result) {
    console.log('数据获取成功:', event.target.result)
  }
  else {
    console.log('未获取到数据:', event)
  }
}

readReq.onerror = function (error) {
  console.log('数据获取失败:', error)
}
```

<br />

### 4. 更新数据

- 语法：`objectStore().put()`

```js
// 新建事务
const store = db.transaction(['group'], 'readwrite').objectStore('group')
const updateReq = store.put({
  id: 1,
  name: '张三',
  age: 24,
  email: 'zhangsan@example.com'
})

updateReq.onsuccess = function (event) {
  console.log('数据更新成功:', event)
}

updateReq.onerror = function (event) {
  console.log('数据更新失败:', event)
}
```

<br />

### 5. 删除数据

- 语法：`objectStore().delete()`

```js
// 新建事务
const store = db.transaction(['group'], 'readwrite').objectStore('group')
const removeReq = store.delete(1)

removeReq.onsuccess = function (event) {
  console.log('数据删除成功:', event)
}

removeReq.onerror = function (event) {
  console.log('数据删除失败:', event)
}
```

<br />

### 6. 数据索引

索引的意义在于，可以让你搜索任意字段，也就是说从任意字段拿到数据记录。如果不建立索引，默认只能搜索主键（即从主键取值）。

- 创建索引：`objectStore.createIndex()`
- 使用索引：`objectStore().index()`

```js
const store = db.transaction(['group']).objectStore('group')
const indexReq = store.index('indexName').get('张三')

indexReq.onsuccess = function (event) {
  console.log('通过索引获取数据成功：', event.target.result)
}

indexReq.onerror = function (event) {
  console.log('通过索引获取数据失败：', event)
}
```

<br />

### 7. 遍历数据

遍历数据使用指针对象 `IDBCursor`。指针对象的 `openCursor()`方法是一个异步操作，所以要监听`success`事件。

```js
const store = db.transaction(['group']).objectStore('group')
// 获取指针对象
const cursorReq = store.openCursor()

cursorReq.onsuccess = function (event) {
  const cursor = event.target.result
  if (cursor) {
    console.log('数据遍历成功：', cursor.value)
    cursor.continue()
  }
  else {
    console.log('没有更多数据了')
  }
}

cursorReq.onerror = function (event) {
  console.log('数据遍历失败:', event)
}
```

<br />

### 8. 获取整张表数据

使用 `IDBObjectStore.getAll()` 方法

```js
const store = db.transaction(['group']).objectStore('group')
const request = store.getAll()

request.onsuccess = function (event) {
  console.log('获取全部数据成功:', event.target.result)
}

request.onerror = function (event) {
  console.log('获取全部数据失败:', event)
}
```

<br />

### 9. 条件获取数据

IDBKeyRange对象：生成一个表示范围的 `Range` 对象，有四种生成方法：

- `lowerBound`：指定范围的下限
- `upperBound`：指定范围的上限
- `bound`：指定范围的上下限
- `only`：指定范围中只有一个值

```js
const store = db.transaction(['group']).objectStore('group')
// 获取id小于2的所有数据
const request = store.getAll(IDBKeyRange.upperBound(2))

request.onsuccess = function (event) {
  console.log('indexedDB getAll:', event.target.result)
}

request.onerror = function (event) {
  console.log('indexedDB getAll:', event)
}
```

<br />

## 第三方库

- [localforage](https://localforage.github.io/localForage)

<br />

## 参考

> [前端数据存储之indexDB](https://juejin.cn/post/7025911892056997924?searchId=20240111101912A593A0EF0DB238790528)
>
> [忘记 localStorage 吧，indexedDB 才是前端存储新宠！](https://juejin.cn/post/7239259798267904059?searchId=20240111100423B4C1382A7A790F7805FD#heading-11)
