---
title: 核心方案
date: '2026-06-09 09:03:28'
updated: '2026-06-09 10:59:43'
slug: core
---
## 网络库选型和沉淀
  


## 大文件上传
普遍方案是文件分片上传，使用BFF层承接前端业务，即保存分片文件，后端服务器只保存分片文件URL地址。



### 如何减少页面阻塞
分片上传的一个首要目标就是要尽量避免相同的分片重复上传，服务器必须要能够识别来自各个客户端的各个上传请求中，是否存在与过去分片相同的上传请求。

> 定义：文件内容一样即为相同，但是对文件内容进行二进制对比是非常耗时的，可以选择基于文件内容的hash来进行对比
>
> hash：是一直算法，可以将任何长度的数据转换为定长的数据，常见的hash算法包括MD5、SHA-1等
>

因此，客户端需要承担两件重要的事情：

1. 对文件进行分片，并计算每个分片的hash值，而计算hash是一件CPU密集型的操作，如果不加处理会长时间阻塞主线程
2. 根据所有分片的hash，计算整个文件的hash，用于判断整个文件是否上传过

 有两种方案：

1. 客户端先分片计算完所有hash后，再计算整个文件的hash，然后上传分片与服务端交互，这样进度条会先卡住一会，因为在计算分片的hash
2. 客户端计算完一个分片hash就上传，等到所有分片上传完毕再计算整个文件的hash，这样进度条不会先卡顿



### 前后端如何协调
需要建立一个标准的通信协议，完成核心交互：

1. 创建文件
2. hash校验
3. 分片上传
4. 分片合并

**创建文件协议：获取文件上传的唯一标识**

> `uploadToken`: 文件上传的唯一标识
>
> `chunkSize`：分片大小，单位字节
>

**hash校验协议：服务端告知客户端分片的具体情况**

请求参数：

> `uploadToken`：创建文件协议返回的token
>
> `uploadHashType`：`chunk | file`
>
> `uploadHash`：hash值
>

返回参数：

> `hasFile`：表示当前是否已存储对应的分片或文件
>
> `rest`：校验文件hash时特有响应字段，指示该文件还有哪些没有上传
>
> `url`：校验文件hash时特有响应字段，如果文件上传完成，表示文件的请求地址
>

**分片数据上传协议：上传具体的文件分片**

POST请求参数；

> `uploadToken`：创建文件协议返回的token
>
> `unloadChunkIndex`：此次上传的分片编号
>
> `uploadHash`：该分片的hash值
>
> `contentLength`：此次上传的字节数
>
> `contentType`：`application/octet-stream` 请求体类型为文件二进制数据
>

**分片合并协议：请求服务器完成分片合并**

返回参数：

> `url`：完整的文件地址
>



### 代码如何组织
上传SDK的搭建分为三层：

+ 上层：分为 `upload-client` 和 `upload-server`，应用于客户端和服务端
+ 中间层：`upload-core`，基于协议的API，提供协议字段的创建、读取、前后端通用工具函数等核心功能
+ 底层：上传协议，约定前后端的通信格式

`upload-core`** 中的通用函数：**

+ `EventEmitter`：统一前后端涉及到的基于各种事件的处理，使用发布订阅模式提供统一的类

```typescript
export class EventEmitter<T extends string> {
  private events: Map<T, Set<Function>>;
  constructor() {
    this.events = new Map();
  }
  
  // 注册事件
  on(event: T, listener: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(listener);
  }
  
  // 移除事件
  off(event: T, listener: Function) {
    if (!this.events.has(event)) {
      return;
      }
    this.events.get(event)!.delete(listener);
  }
  
  // 注册事件，只执行一次
  once(event: T, listener: Function) {
    const onceListener = (...args: any[]) => {
      listener(...args);
      this.off(event, onceListener);
    }
  }
  
  emit(event: T, ...args: any[]) {
    if (!this.events.has(event)) {
      return;
      }
    this.events.get(event)!.forEach((listener) => {
      listener(...args);
    });
  }
}
```

+ `TaskQueue`：支撑前后端的多任务并发执行，如前端的并发请求，后端的并发分片hash校验

```typescript
export class Task{
  fn: Function; // 任务关联的执行函数
  payload?: any; // 任务关联的其他信息
  constructor(fn: Function, payload?: any) {
    this.fn = fn;
    this.payload = payload;
  }
  
  // 执行任务
  run() {
    return this.fn(this.payload);
  }
}

// 可并发执行的任务队列
export class TaskQueue extends EventEmitter<'start' | 'pause' | 'drain'> {
  // 待执行的任务
  private tasks: Set<Task> = new Set();
  // 当前正在执行的任务数
  private currentCount = 0;
  // 任务状态
  private status: 'paused' | 'running' = 'paused';
  // 最大并发数
  private concurrency: number = 4;
  
  constructor(concurrency: number = 4) {
    super();
    this.concurrency = concurrency;
  }
  
  // 添加任务
  add(...tasks: Task[]) {
    for (const t of tasks) {
      this.tasks.add(t);
    }
  }
  
  // 添加任务并启动
  addAndStart(...tasks: Task[]) {
    this.add(...tasks);
    this.start();
  }
  
  // 启动任务
  start() {
    // 任务执行中，结束
    if (this.status === 'running') {
      return;
    }
    // 当前已无任务，触发drain事件
    if (this.tasks.size === 0) {
      this.emit('drain');
      return;
    } 
    this.stauts = 'running';
    this.emit('start');
    this.runNext();
  }
  
  // 取出第一个任务
  private taskHeadTask() {
    const task = this.tasks.values().next().value;
    if (task) {
      this.tasks.delete(task);
    }
    return task;
  }
  
  // 执行下一个任务
  private runNext() {
    // 如果整体的任务状态不是running，结束
    if (this.status !11== 'running') {
      return;
    }
    // 并发数已满，结束
    if (this.currentCount >= this.concurrency) {
      return;
    }
    // 取出第一个任务
    const task = this.taskHeadTask();
    if (!task) {
      this.status = 'paused';
      this.emit('drain');
      return;
    }
    // 执行任务，任务执行完成后，当前任务数-1，继续执行下一个任务
    this.currentCount++;
    Promise.resolve(task.run()).finally(() => {
      this.currentCount--;
      this.runNext();
    })
  }
  
  // 暂停任务
  pause() {
    this.status = 'paused';
    this.emit('pause');
  }
}
```

**上层中前端涉及的核心问题**：

1. 如何对文件分片
2. 如何控制请求

```typescript
// chunk.ts - 实现分片对象的处理

export interface Chunk {
  blob: Blob; // 分片的二进制数据
    start: number; // 分片的起始位置
  end: number; // 分片的结束位置
  hash: string; // 分片的hash值
  index: number; // 分片在文件中的索引
}

// 创建一个不带hash的分片
export function createChunk(file: File, index: number, chunkSize: number) {
  const start = index * chunkSize;
  const end = Math.min((index + 1) * chunkSize, file.size);
  const blob = file.slice(start, end);
  return {
    blob,
    start,
    end,
    hash: '',
    index
  }
}

// 计算分片的hash值
export functin calcChunkHash(chunk: Chunk): Promise<string> {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      spark.append(e.target?.result as ArrayBuffer);
      resolve(spark.end());
    };
    fileReader.readAsArrayBuffer(chunk.blob);
  });
}
```

分片方式：

+ 普通分片，遍历循环，会阻塞主线程
+ 基于多线程的分片，不会阻塞主线程
+ 基于主线程时间切片的分片，如 `requestIdleCallback`
+ 其他分片模式

考虑到通用性，必须要向上层提供不同的分片模式，同时还要允许上层自定义分片模式，因此在设计上，使用基于抽象类的模板模式来完成处理

```typescript
// chunkSplitor.ts

/**
* 分片的相关事件
* chunks：一部分分片产生了
* wholeHash：整个文件的hash计算完成
* drain：所有分片处理完成
*/
export type ChunkSplitorEvents = 'chunks' | 'wholeHash' | 'drain';

export abstract class ChunkSplitor extends EventEmitter<ChunkSplitorEvents> {
  protected chunkSize: number; // 分片大小(字节单位)
  protected file: File; // 待分片的文件
  protected hash?: string; // 整个文件的hash
  protected chunks?: Chunk[]; // 分片列表
  private handleChunkCount = 0; // 已计算hash的分片数量
  private spark = new SparkMD5(); // 计算hash的工具
  private hasSplited = false; // 是否已经分片
  
  constructor(file: File, chunckSize: number = 1024 * 1024 * 5) {
    super();
    this.file = file;
    this.chunkSize = chunkSize;
    // 获取分片数组
        const chunkCount = Math.ceil(this.file.size / this.chunkSize);
    this.chunks = new Array(chunkCount).fill(0).map((_, index) => createChunk(this.file, index, this.chunkSize));
  }
  
  split() {
    if (this.hasSplited) {
      return;
    }
    this.hasSplited = true;
    const emitter = new EventEmitter<‘chunks'>();
    const chunksHandler = (chunks: Chunk[]) {
      this.emit('chunks', chunks);
      chunks.forEach((chunk) => {
        this.spark.append(chunk.hash);
      })
      this.handleChunkCount += chunks.length;
      if (this.handleChunkCount === this.chunks.length) {
        // 计算完成
        emitter.off('chunks', chunkHandler);
        this.emit('wholeHash', this.spark.end());
        this.spark.destroy();
        this.emit('drain');
      }
    };
    emitter.on('chunks', chunksHandler);
    this.calcHash(this.chunks, emitter);
  }
  
  // 计算每个分片的hash
  abstract calcHash(chunks: Chunk[], emitter: EventEmitter<'chunks'>): void;
  
  // 分片完成后，一些需要销毁的工 作
  abstract dispose(): void;
}
```

```typescript
// MutilThreadSplitor.ts - 基于多线程的分片

export class MultiThreadSplitor extends ChunkSplitor {
  private workers: Worker[] = new Array(navigator.hardwareConcurrency || 4)
  .fill(0)
  .map(() => new Worker(new URL('./SplitWorker.ts', import.meta.url), { type: 'module' }));
  
  calcHash(chunks: Chunk[], emitter: EventEmitter<'chunks'>): void {
    const workerSize = Math.ceil(chunk.length / this.workers.length);
    for (let i = 0; i < this.workers.length; i++) {
      const worker = this.workers[i];
      const start = i * workerSize;
      const end = Math.min((i + 1) * workerSize, chunks.length);
      const workerChunks = chunks.slice(start, end);
      worker.postMessage(workerChunks);
      worker.onmessage = (e) => {
        emitter.emit('chunks', e.data);
      };
    }
  }
  
  dispose(): void {
    this.workers.forEach((worker) => worker.terminate());
  }
}

// SplitWoker.ts
onmessage = function (e) {
  const chunks = e.data as Chunk[];
  for (const chunk of chunks) {
    calcChunkHash(chunk).then((hash) => {
      chunk.hash = hash;
      postMessage([chunk]);
    })
  }
}
```

请求策略：

```typescript
export interface RequestStrategy {
  // 文件创建请求，返回token
  createFile(file: File): Promise<string>;
  // 分片上传请求
  uploadChunk(chunk: Chunk): Promise<void>;
  // 文件合并请求，返回文件URL
  mergeFile(token: string): Promise<string>;
  // hash校验请求
  patchHash<T extends 'file' | 'chunk'>(token: string, hash: string, type: T): Promise<T extends 'file' ? { hasFile: boolean } : { hasFile: boolean; rest: number[];  url: string }>;
 } 
```

请求控制：

```typescript
export class UploadController {
  private requestStrategy: RequestStrategy; // 请求策略，没有则使用默认策略
  private splitStrategy: ChunkSplitor; // 分片策略，没有则默认多线程分片
  private taskQueue: TaskQueue; // 任务队列
  
  // 初始化
  async init() {
    // 获取文件token
    this.token = await this.requestStrategy.createFile(this.file);
    // 分片事件监听
    this.splitStrategy.on('chunks', this.handleChunks.bind(this));
    this.splitStrategy.on('wholeHash', this.handleWholeHash.bind(this));
  }
  
  // 分片事件处理
  private handleChunks(chunks: Chunk[]) {
    // 分片上传任务加入队列
    chunks.forEach((chunk) => {
      this.taskQueue.addAndStart(new Task(this.uploadTask.bind(this), chunk));
    });
  }
  
  async uploadchunk(chunk: Chunk) {
    // hash校验
    const resp = await this.requestStrategy.patchHash(this.token, chunk.hash, 'chunk');
    // 文件已存在
    if (resp.hasFile) {
      return;
    }
    // 分片上传
    await this.requestStrategy.uploadChunk(chunk, this.uploadEmitter);
  }
  
  // 整体hash事件处理
  private async handleWholeHash(hash: string) {
    // hash校验
     const resp = await this.requestStrategy.patchHash(this.token, chunk.hash, 'file');
    if (resp.hasFile) {
      this.emit('end', resp.url);
      return;
    }
    // 根据resp.rest重新编排后续任务
  }
}
```



### 后端中的复杂问题
1. 如何隔离不同的文件上传？在创建文件协议中，服务器使用UUID + JWT 生成一个不可篡改的唯一编码，用于标识不同的文件上传。
2. 如何保证分片不重复？不保存重复分片，也不上传重复分片。要求分片跨文件唯一，并且永不删除。服务器并不保存合并之后的文件，仅记录文件中的分片顺序。
3. 合并分片到底做什么？合并会造成很多问题，及其耗时且数据冗余，所以服务器在合并操作时，仅做简单的处理：校验文件大小、校验文件hash、标记文件状态、生成文件访问地址
4. 访问文件怎么办服务器需要动态处理，收到对文件的请求，在数据库中找到对应的文件记录，读取文件的所有分片ID，依次找到对应的分片文件，再利用任务队列的并发控制能力，逐步产生文件读取流，利用管道直接输出到网络I/O



### 项目介绍
职责：参与项目的通用库开发

亮点：从0到1开发整个uploadSDK，为大文件上传场景提供前后端的支撑，统一了所有文件上传的开发方式，完成了从**底层协议**、到**工具类**、到**前端组件**、再到**后端中间件**的开发。在实现层面，为保证使用的灵活性，利用多种**设计模式**完成了SDK和上层应用的完全解耦，并对服务器的存储结构进行了精细的设计，保证了文件存储和传输的唯一性。



### 面试
1. 你是如何实现大文件上传的大文件上传的普遍性方案是文件分片，文件分片其实就是把整个文件上传的大事务打散为一个一个分片上传的小事务，从而降低上传失败的风险。  
整个大文件上传的实现涉及到诸多的技术细节。比如底层协议标准如何制定，协议标准决定了前后端如何交互，也就决定了前后端代码如何开发。  
除了协议之外，还涉及到前端如何进行并发控制，如何高效的分片，以及涉及到后端如何存储分片，如何高效合并分片，如何保证分片的唯一性等等等等。  
诸多的问题吧，市面上没有形成统一的解决方案，虽然公有云上的OSS有各自的实现方案，但考虑到我们的产品可能会部署到客户的私有云上，所以最稳妥的办法还是自行实现整个大文件上传。**我首先设计的是整个上传流程**  
传统的大文件上传都是在客户端先完成所有的分片，然后计算每个分片和完整的文件hash，再使用hash和服务器换取当前文件的信息。  
由于hash的计算是CPU密集型的操作，这样一来就会导致长时间的客户端阻塞，虽然可以使用WebWorker来加速hash的计算，但经过我的测试，即便是使用了多线程，某些超大文件比如上了10个G的文件，在配置不太好的客户机上计算时长可以超过30秒，这是无法接受的。  
因此，我对上传流程进行了优化，我假定大部分文件上传都是一个新文件上传，于是在流程上，我允许用户在获得文件完整hash之前直接上传分片，这样一来，几乎可以做到零延时的上传，等到文件整体hash计算出来之后，再向服务器补充hash数据。基于这样的流程，于是我设计了一套标准化的文件上传协议，主要包含四个通信标准：

**设计好协议后，接下来就需要落实到代码的实现上**  
在前端部分主要问题集中在两块：如何分片 和 如何控制请求流程  
首先是如何分片，考虑到不同的场景可能选择不同的分片模式，比如多线程分片，比如基于时间切片（类似于React Fiber）的分片，甚至是由上层应用自行定义的分片模式。  
于是在实现分片逻辑时，我使用了模版模式，利用TS的抽象类定义好分片的整体流程，具体的子类仅需实现分片hash计算即可，这样一来就可以保持极高的灵活度。  
在请求流程控制层面，由于有诸多请求需要发送，因此我开发了一套并发请求控制类以充分的利用网络带宽。  
另外，由于请求过程中需要向上层抛出各种钩子，比如进度的变化，请求状态的变化等等，对  
这一块，我使用了发布订阅模式编写了通用的EventEmitter类，这样可以在请求过程中抛出各种事件，上层应用通过监听事件完成处理。  
**当然整个系统复杂度最高的还是在后端**  
由于我们这个项目有BFF层，需要在BFF层完成文件处理，因此我还需要针对服务器编写相应代码。

服务器最大的挑战就是如何保证每个分片的唯一性，这种唯一性即包含存储的唯一性，也包含传输的唯一性。  
存储的唯一性保证了分片不会重复保存，避免了数据的冗余。  
传输的唯一性保证了分片不会重复上传，避免了通信的冗余。  
要保证分片不会重复保存，就必须让分片和文件解耦，分片是分片，文件是文件，分片独立保存，不从属于任何文件，文件独立记录，按照顺序依次指向不同分片，这样一来，哪怕出现两个不同文件拥有相同分片的场景，也不会在服务器出现重复存储的问题，因为分片是独立于文件的。

而要保证分片不会重复上传，就必须保证分片永不删除，如果在合并文件后删除了分片，就会导致下一次有相同分片上传时服务器找不到对应的分片文件，就必须重复上传，因此分片永不删除。  
最后就是合并分片的逻辑，我考虑到如果真正的把分片文件合并成一个大文件，大文件的所有数据实际上都是冗余的，而且整个合并过程极其耗时，因此我做了这样的处理。当收到合并请求时，服务器其实仅仅做一些简单的校验即可，比如文件大小、分片数量等校  
验，而不进行真正的合并，仅在数据库mongodb中更新该文件的状态并生成文件访问的url地址即可。  
等到用户真正访问文件时，我根据数据库中对应文件的分片记录，使用文件流依次读取分片数据，用流管道直接响应给客户端即可。  
这样一来整个合并效率和文件访问效率都极高，同时服务器的存储不会有任何冗余。

    1. 创建文件协议：前端请求向服务器提交文件基本信息，换取上传唯一token，后续的请求必须携带
    2. hash校验协议：前端将某个分片hash或者是整个文件hash发送给服务器，得到分片和文件  
  的状态信息
    3. 分片上传协议：前端将分片的二进制数据发送到服务器存储
    4. 分片合并协议：前端提示服务器可以完成分片合并了



## ABT在前端基建中的实践
实验具有以下特点：

1. 多个实验共存，产品可能会先后发起几十个甚至上百个实验，不同的实验有不同的分流规则，每个实验又有多个对照组
2. 实验是精确到组件的，一个实验对应到多个前端组件，一个组件不同的对照组之间的差异是灵活的
3. 实验是频繁的
4. 用户参与实验必须是无感的
5. 实验推全后只保留一个对照组



## 首屏优化
