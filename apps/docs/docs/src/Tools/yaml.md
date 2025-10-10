# YAML

## 特点

- 大小写敏感
- 使用缩进表示层级关系
- 缩进时不允许使用Tab键，只允许使用空格。
- 缩进的空格数目不重要，只要相同层级的元素左侧对齐即可
- `#` 表示注释，从这个字符一直到行尾，都会被解析器忽略。
- 文件拓展名为 `.yaml`、`.yml`

`YAML` 支持以下几种数据结构：

- 对象：键值对的集合，又称为映射/ 哈希 / 字典
- 数组：一组按次序排列的值，又称为序列 / 列表
- 纯量：单个的、不可再分的值，可以理解为基本类型

<br />

## 语法

### 对象

对象是最核心的结构，key 值的表示方法是 `[key]: `，注意这里**冒号后面有个空格，一定不能少**。value 的值就是一个`纯量`，且默认不需要引号。

```yaml
# [key]: value
title: 标题
name: 名称
```

等同于：

```json
{
  "title": "标题",
  "name": "名称"
}
```

<br />

### 数组

数组和对象的结构差不多，区别是在 key 前用一个 `- `符号标识这个是数组项。注意这里**也有一个空格**，同样也不能少。

```yaml
- Hello
- World
```

等同于：

```json
["Hello", "World"]
```

<br />

### 纯量

纯量比较简单，对应的就是 js 的基本数据类型，支持如下：

- 字符串
- 布尔
- 数值
- `null`：用 `~` 表示
- 时间：用 `xxxx-xx-xx` 格式表示

```yaml
who: ~
date: 2025-04-14
```

等同于：

```json
{
  "who": null,
  "date": new Date("2025-04-14")
}
```

<br />

## 高级操作

### 字符串过长

在 shell 中我们常见到一些参数很多，然后特别长的命令，如果命令都写在一行的话可读性会非常差。

- 在 Linux 中可以在每行后加 `\` 符号标识换行

  ```shell
  $ docker run \
   --name my-nginx \
   -d nginx
  ```

- YAML 默认会把换行符转换成 `空格`：

  ```yaml
  cmd: docker run
    --name my-nginx
    -d nginx
  ```

  等同于：

  ```json
  {
    "cmd": "docker run --name my-nginx -d nginx"
  }
  ```

有时候，我们的需求是**保留换行符**，并不是把它转换成空格，只需要在首行加一个 `|` 符号：

```yaml
cmd: |
  docker run
  --name my-nginx
  -d nginx
```

等同于：

```json
{
  "cmd": "docker run\n--name my-nginx\n-d nginx"
}
```

<br />

### 获取配置

获取配置是指，在 YAML 文件中定义的某个配置，如何在代码（JS）里获取？JSON 是可以直接导入的，YAML 可就不行了。

<br />

#### Webpack

- 安装[loader](https://www.npmjs.com/package/yaml-loader)：

  ```bash
  pnpm add -D yaml-loader
  ```

- 配置loader：

  ```js
  // webpack.config.js
  module.exports = {
    module: {
      rules: [
        {
          test: /\.ya?ml$/,
          type: 'json', // Required by Webpack v4
          use: 'yaml-loader'
        }
      ]
    }
  }
  ```

- 使用：

  ```js
  import pack from './package.yaml'

  console.log(pack.version)
  ```

<br />

#### NodeJS

- 安装 [yaml](https://www.npmjs.com/package/yaml)：

  ```bash
  pnpm add -D yaml
  ```

- 使用：

  ```js
  import fs from 'node:fs'
  import YAML from 'yaml'

  const doc = YAML.parse(fs.readFileSync('./package.yaml', 'utf8'))
  console.log(doc.version)
  ```

<br />

### 配置项复用

配置项复用的意思是，对于定义过的配置，在后面的配置直接引用，而不是再写一遍，从而达到复用的目的。YAML 中将定义的复用项称为锚点，用`&` 标识；引用锚点则用 `*` 标识。但是锚点有个弊端，就是不能作为 `变量` 在字符串中使用。

```yaml
name: &name my_config
env: &env
  version: 1.0

compose:
  key1: *name
  key2: *env
```

等同于：

```json
{
  "name": "my_config",
  "env": { "version": 1 },
  "compose": {
    "key1": "my_config",
    "key2": {
      "version": 1
    }
  }
}
```

<br />

### 演练场

> [js-yaml](https://nodeca.github.io/js-yaml/)
