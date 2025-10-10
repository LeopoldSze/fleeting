# Markdown

## 介绍

1. Markdown 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。
2. Markdown 编写的文档可以导出 HTML 、Word、图像、PDF、Epub 等多种格式的文档。
3. Markdown 编写的文档后缀为 **.md**, **.markdown**。

::: info

本文后续快捷键使用 [Typora](https://typora.io/) 编辑器

:::

## 语法

### 标题

- 语法：`#`
- 说明：#数量 对应 h1~h6
- 快捷键：`ctrl + [1-6]`

```markdown
# 一级标题

## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题

```

<img src="../assets/markdown/markdown-1.png" alt="标题展示" title="标题展示" style="zoom:80%;" />

<br />

### 段落

- 语法：普通文本输入
- 快捷键：`Ctrl + 0`

```markdown
段落
```

<br />

### 文本

- 斜体
  - 语法：`*斜体文本*`或 `_斜体文本_`
  - 快捷键：`ctrl + i`
- 粗体
  - 语法：`**粗体文本**` 或 `__粗体文本__`
  - 快捷键：`ctrl + b`
- 粗斜体
  - 语法：`***粗斜体文本***` 或 `___粗斜体文本___`
  - 快捷键：`ctrl + i + b`

```markdown
_斜体文本_
_斜体文本_
**粗体文本**
**粗体文本**
**_粗斜体文本_**
**_粗斜体文本_**

```

_这是斜体_

**这是粗体**

**_这是粗斜体_**

<br />

### 分割线

- 语法：在一行中用三个以上的星号、减号、底线来建立一个分隔线，行内不能有其他东西。你也可以在星号或是减号中间插入空格。

```markdown
---

---

---

---

---

---

---

```

---

<br />

### 删除线

- 语法：`~~删除文本~~`
- 快捷键：`alt + shift + 5`

```markdown
~~test~~
```

~~这是删除线~~

<br />

### 下划线

- 语法：通过 HTML 的 `<u>` 标签来实现
- 快捷键：`ctrl + u`

```markdown
<u>带下划线文本</u>
```

<u>这是下划线</u>

<br />

### 无序列表

- 语法：星号(\*)、加号(+)或是减号(-)作为列表标记，后面添加一个空格，然后再填写内容
- 快捷键：`ctrl + shift + ]`

```markdown
- 第一项
- 第二项
- 第三项

* 第一项
* 第二项
* 第三项

- 第一项
- 第二项
- 第三项

```

- 第一项
- 第二项
- 第三项

<br />

### 有序列表

- 语法：使用数字并加上 . 号，后面添加一个空格，再填写内容。
- 快捷键：`ctrl + shift + [`

```markdown
1. 第一项
2. 第二项
3. 第三项

```

1. 第一项
2. 第二项
3. 第三项

<br />

### 列表嵌套

- 语法：列表嵌套只需在子列表中的选项前面添加四个空格或者使用有序列表或无序列表语法即可。
- 快捷键：`tab`

```markdown
1. 第一项：
   - 第一项嵌套的第一个元素
   - 第一项嵌套的第二个元素
2. 第二项：
   - 第二项嵌套的第一个元素
   - 第二项嵌套的第二个元素

```

- 第一项

  - 第一项的子项
    - 第一项的子项的子项

- 第二项
  - 第二项的子项
    - 第二项的子项的子项

1. test
   1. test
      1. test
      2. test2

<br />

### 区块及嵌套

- 语法：在段落开头使用 > 符号，后面添加一个空格，再填写内容。
- 快捷键：`ctrl + shift + q`

```markdown
> 最外层
>
> > 第一层嵌套
> >
> > > 第二次嵌套

```

> 最外层
>
> > 第一次嵌套
> >
> > > 第二次嵌套

::: details 搭配使用

> 区块中使用列表
>
> 1. 第一项
> 2. 第二项
>
> - 无序第一项
> - 无序第二项

- 第一项

  > 第一项的区块
  >
  > 第一项的区块

- 第二项

  > 第二项的区块
  >
  > 第二项的区块

:::

<br />

### 代码

- 语法：``包裹
- 快捷键：ctrl + shift + `

```markdown
`JavaScript` 函数
```

`JavaScript`函数

<br />

### 代码区块

- 语法：使用 `4 个空格` 或者 `一个制表符（Tab 键）` 或者 ```[语言名称]。
- 快捷键：`ctrl + shift + k`

```javascript
window.onload = function () {
    alert('hello, world');
});
```

<br />

### 链接

- 语法：`[链接名称](链接地址)` 或者 `<链接地址>`
- 快捷键：`ctrl + k`

```markdown
[链接名称](链接地址)
<链接地址>

```

这是一个链接[百度](https://www.baidu.com)

<https://www.baidu.com>

<br />

### 高级链接

可以通过变量来设置一个链接，变量赋值在文档末尾进行

```
这个链接用 1 作为网址变量 [Google][1]
这个链接用 runoob 作为网址变量 [Runoob][runoob]
然后在文档的结尾为变量赋值（网址）

[1]: http://www.google.com/
[runoob]: http://www.runoob.com/
```

这个链接用 1 作为网址变量 [Google][1]
这个链接用 runoob 作为网址变量 [Runoob][runoob]
然后在文档的结尾为变量赋值（网址）

[1]: http://www.google.com/
[runoob]: http://www.runoob.com/

<br />

### 图片

- 语法：`![alt 属性文本](图片地址)` 或者 `![alt 属性文本](图片地址 "可选标题")`
- 说明：开头一个感叹号 !，接着一个方括号，里面放上图片的替代文字，接着一个普通括号，里面放上图片的网址，最后还可以用引号包住并加上选择性的 'title' 属性的文字。
- 快捷键：`ctrl + shift + i`

```markdown
![RUNOOB 图标](http://static.runoob.com/images/runoob-logo.png '这是菜鸟图标')
```

![RUNOOB 图标](http://static.runoob.com/images/runoob-logo.png '这是菜鸟图标')

<br />

### 表格

- 语法：使用 `| ` 来分隔不同的单元格，使用 ` -` 来分隔表头和其他行。
- 快捷键：`ctrl + t`

```
|  表头   | 表头  |																					Ctrl+T
|  ----  | ----  |
| 单元格  | 单元格 |
| 单元格  | 单元格 |
```

| 表头   | 表头   |
| ------ | ------ |
| 单元格 | 单元格 |
| 单元格 | 单元格 |

<br />

### 脚注

- 语法：`[^要注明的文本]: 描述`

```markdown
[^脚注]: 脚注描述
```

[^这是脚注]: 这是脚注的描述

<br />

### 高级技巧

1. 不在 Markdown 涵盖范围之内的标签，都可以直接在文档里面用 HTML 撰写
   - 目前支持的 HTML 元素有：`<kbd> <b> <i> <em> <sup> <sub> <br />`等。
2. 使用反斜杠转义特殊字符，支持以下符号前面加上反斜杠来帮助插入普通的符号：
   - 反斜线：\
   - 反引号：`
   - 星号：\*
   - 下划线：\_
   - 花括号：{}
   - 方括号：[]
   - 小括号：()
   - 井号：#
   - 加号：+
   - 减号：-
   - 英文句点：.
   - 感叹号：!

<br />

### 公式

- 语法：使用两个美元符 $$ 包裹 `TeX` 或 `LaTeX` 格式的数学公式来实现。

```markdown
$$
\mathbf{V}_1 \times \mathbf{V}_2 =  \begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
\frac{\partial X}{\partial u} &  \frac{\partial Y}{\partial u} & 0 \\
\frac{\partial X}{\partial v} &  \frac{\partial Y}{\partial v} & 0 \\
\end{vmatrix}
${$tep1}{\style{visibility:hidden}{(x+1)(x+1)}}
$$

```

$$
\mathbf{V}_1 \times \mathbf{V}_2 =  \begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
\frac{\partial X}{\partial u} &  \frac{\partial Y}{\partial u} & 0 \\
\frac{\partial X}{\partial v} &  \frac{\partial Y}{\partial v} & 0 \\
\end{vmatrix}
${$tep1}{\style{visibility:hidden}{(x+1)(x+1)}}
$$

<br />

## 参考

> [菜鸟教程-Markdown教程](https://www.runoob.com/markdown/md-tutorial.html)
>
> [typora入门：全网最全教程](https://www.cnblogs.com/hider/p/11614688.html)
>
> [Typora极简教程](https://www.jianshu.com/p/a6a6a22e9393)
