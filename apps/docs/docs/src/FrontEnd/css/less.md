# Less

## 常规用法

### 变量

<br />

#### 值变量

- 使用方法：以 `@` 开头 定义变量，并且使用时 直接 键入 `@`名称。

- 作用：把常用的变量封装到一个文件中，这样利于代码组织维护。

```less
/* Less */
@color: #999;
@bgColor: skyblue; // 不要添加引号
@width: 50%;

#wrap {
  color: @color;
  background: @bgColor;
  width: @width;
}

/* 生成后的 CSS */
#wrap {
  color: #999;
  background: skyblue;
  width: 50%;
}

```

<br />

#### 选择器变量

设置动态选择器

```less
/* Less */
@mySelector: #wrap;
@Wrap: wrap;

@{mySelector} {
  // 变量名 必须使用大括号包裹
  color: #999;
  width: 50%;
}

.@{Wrap} {
  color: #ccc;
}

#@{Wrap} {
  color: #666;
}

/* 生成的 CSS */
#wrap {
  color: #999;
  width: 50%;
}

.wrap {
  color: #ccc;
}

#wrap {
  color: #666;
}

```

<br />

#### 属性变量

设置动态属性，减少代码量

```less
/* Less */
@borderStyle: border-style;
@Soild: solid;

#wrap {
  @{borderStyle}: @Soild; // 变量名 必须使用大括号包裹
}

/* 生成的 CSS */
#wrap {
  border-style: solid;
}

```

<br />

#### url 变量

公用变量快速替换

```less
/* Less */
@images: '../img'; // 需要加引号

body {
  background: url('@{images}/dog.png'); // 变量名 必须使用大括号包裹
}

/* 生成的 CSS */
body {
  background: url('../img/dog.png');
}

```

<br />

#### 声明组合变量

- 结构: `@name: { 属性: 值; }`

- 使用：`@name()`

```less
/* Less */
@background: {
  background: red;
};

#main {
  @background();
}

@Rules: {
  width: 200px;
  height: 200px;
  border: solid 1px red;
};

#con {
  @Rules();
}

/* 生成的 CSS */
#main {
  background: red;
}

#con {
  width: 200px;
  height: 200px;
  border: solid 1px red;
}

```

<br />

#### 变量运算

::: warning

- 加减法时，以第一个数据的单位为基准

- 乘除法时，注意单位要统一

:::

```less
/* Less */
@width: 300px;
@color: #222;

#wrap {
  width: @width - 20;
  height: @width - 20 * 5;
  margin: (@width - 20) * 5;
  color: @color * 2;
  background-color: @color + #111;
}

/* 生成的 CSS */
#wrap {
  width: 280px;
  height: 200px;
  margin: 1400px;
  color: #444;
  background-color: #333;
}

```

<br />

#### 变量作用域

就近原则

```less
/* Less */
@var: @a;
@a: 100%;

#wrap {
  width: @var;
  @a: 9%;
}

/* 生成的 CSS */
#wrap {
  width: 9%;
}

```

<br />

#### 变量定义变量

```less
/* Less */
@fnord: 'I am fnord.';
@var: 'fnord';

#wrap::after {
  content: @@var; // 将@var替换为其值 content: @fnord;
}

/* 生成的 CSS */
#wrap::after {
  content: 'I am fnord.';
}

```

<br />

#### 属性作为变量

- 语法：`$propertey`
- 版本：V3.0.0+

```less
.widget {
  color: #efefef;
  background-color: $color;
}

```

```css
// 生成的css
.widget {
  color: #efefef;
  background-color: #efefef;
}

```

::: warning

同样需要遵循变量作用域的就近原则

:::

<br />

### 嵌套

& ：代表的上一层选择器的名字

```less
/* Less */
#header {
  &::after {
    content: 'Less is more!';
  }

  .title {
    font-weight: bold;
  }

  &_content {
    // 理解方式：直接把 & 替换成 #header
    margin: 20px;
  }
}

/* 生成的 CSS */
#header::after {
  content: 'Less is more!';
}

#header .title {
  // 嵌套了
  font-weight: bold;
}

#header_content {
  // 没有嵌套！
  margin: 20px;
}

```

<br />

#### 改变选择器顺序

在继承的（父辈）选择器前加上一个选择器可能很有用。

```less
.header {
  .menu {
    border-radius: 5px;
    .no-borderradius & {
      background-image: url('images/button-background.png');
    }
  }
}

```

```css
// 生成的css
.header .menu {
  border-radius: 5px;
}
.no-borderradius .header .menu {
  background-image: url('images/button-background.png');
}

```

<br />

#### 组合爆炸

& 也可用于在逗号分隔的列表中生成各种可能的选择器排列组合。

```less
p,
a,
ul,
li {
  border-top: 2px dotted #366;

  & + & {
    border-top: 0;
  }
}

```

```css
// 生成的css
p,
a,
ul,
li {
  border-top: 2px dotted #366;
}
p + p,
p + a,
p + ul,
p + li,
a + p,
a + a,
a + ul,
a + li,
ul + p,
ul + a,
ul + ul,
ul + li,
li + p,
li + a,
li + ul,
li + li {
  border-top: 0;
}

```

<br />

### mixin 混合

<br />

#### 无参数方法

使用时 直接键入名称即可。

- `.` 与 `#` 皆可作为 方法前缀。
- 方法后写不写 `()` 看个人习惯。

```less
/* Less */
.card {
  // 等价于 .card()
  background: #f6f6f6;
  -webkit-box-shadow: 0 1px 2px rgba(151, 151, 151, 0.58);
  box-shadow: 0 1px 2px rgba(151, 151, 151, 0.58);
}

#wrap {
  .card; // 等价于.card();
}

/* 生成的 CSS */
#wrap {
  background: #f6f6f6;
  -webkit-box-shadow: 0 1px 2px rgba(151, 151, 151, 0.58);
  box-shadow: 0 1px 2px rgba(151, 151, 151, 0.58);
}

```

<br />

#### 默认参数方法

- 如果没有传参数，那么将使用默认参数
- `@arguments` 犹如 JS 中的 `arguments` ，指代的是全部参数
- 传的参数中必须带单位

```less
/* Less */
.border(@a: 10px, @b: 50px, @c: 30px, @color: #000) {
  border: solid 1px @color;
  box-shadow: @arguments; // 指代的是 全部参数
}

#main {
  .border(0px, 5px, 30px, red); // 必须带着单位
}

#wrap {
  .border(0px);
}

#content {
  .border; // 等价于 .border()
}

/* 生成的 CSS */
#main {
  border: solid 1px red;
  box-shadow: 0px, 5px, 30px, red;
}

#wrap {
  border: solid 1px #000;
  box-shadow: 0px 50px 30px #000;
}

#content {
  border: solid 1px #000;
  box-shadow: 10px 50px 30px #000;
}

```

<br />

#### 匹配模式

- 第一个参数 `left` 会找到方法中匹配程度最高的，如果匹配程度相同，将全部选择，并存在着样式覆盖替换

- 如果匹配的参数是变量，则将会匹配，如 `@_`

```less
/* Less */
.triangle(top, @width: 20px, @color: #000) {
  border-color: transparent transparent @color transparent;
}

.triangle(right, @width: 20px, @color: #000) {
  border-color: transparent @color transparent transparent;
}

.triangle(bottom, @width: 20px, @color: #000) {
  border-color: @color transparent transparent transparent;
}

.triangle(left, @width: 20px, @color: #000) {
  border-color: transparent transparent transparent @color;
}

.triangle(@_, @width: 20px, @color: #000) {
  border-style: solid;
  border-width: @width;
}

#main {
  .triangle(left, 50px, #999);
}

/* 生成的 CSS */
#main {
  border-color: transparent transparent transparent #999;
  border-style: solid;
  border-width: 50px;
}

```

<br />

#### 命名空间

- 在 CSS 中 `>` 选择器，选择的是 儿子元素，就是必须与父元素有直接血源的元素
- 在引入命令空间时，如使用 `>` 选择器，父元素不能加括号
- 不得单独使用命名空间的方法，必须先引入命名空间，才能使用其中方法
- 子方法可以使用上一层传进来的方法

```less
/* Less */
#card() {
  background: #723232;

  .d(@w: 300px) {
    width: @w;

    #a(@h: 300px) {
      height: @h; // 可以使用上一层传进来的方法
    }
  }
}

#wrap {
  #card > .d > #a(100px); // 父元素不能加 括号
}

#main {
  #card .d();
}

#con {
  // 不得单独使用命名空间的方法
  //.d() 如果前面没有引入命名空间 #card ，将会报错
  #card; // 等价于 #card();
  .d(20px); // 必须先引入 #card
}

/* 生成的 CSS */
#wrap {
  height: 100px;
}

#main {
  width: 300px;
}

#con {
  width: 20px;
}

```

<br />

#### 不定参数

`...` 扩展运算符

```less
/* Less */
.boxShadow(...) {
  box-shadow: @arguments;
}

.textShadow(@a, ...) {
  text-shadow: @arguments;
}

#main {
  .boxShadow(1px, 4px, 30px, red);
  .textShadow(1px, 4px, 30px, red);
}

/* 生成后的 CSS */
#main {
  box-shadow: 1px 4px 30px red;
  text-shadow: 1px 4px 30px red;
}

```

<br />

#### important！

```less
/* Less */
.border {
  border: solid 1px red;
  margin: 50px;
}

#main {
  .border() !important;
}

/* 生成后的 CSS */
#main {
  border: solid 1px red !important;
  margin: 50px !important;
}

```

<br />

### extend 继承

<br />

#### extend

extend 是 Less 的一个伪类，可继承所匹配声明中的全部样式。

```less
/* Less */
.animation {
  transition: all 0.3s ease-out;

  .hide {
    transform: scale(0);
  }
}

#main {
  &:extend(.animation);
}

#con {
  &:extend(.animation .hide);
}

/* 生成后的 CSS */
.animation,
#main {
  transition: all 0.3s ease-out;
}

.animation .hide,
#con {
  transform: scale(0);
}

```

<br />

#### all 全局搜索替换

```less
/* Less */
#main {
  width: 200px;
}

#main {
  &::after {
    content: 'Less is good!';
  }
}

#wrap:extend(#main all) {
}

/* 生成的 CSS */
#main,
#wrap {
  width: 200px;
}

#main::after,
#wrap::after {
  content: 'Less is good!';
}

```

::: danger 注意

1. 选择器和 `:extend()` 之间允许有空格：`pre:hover :extend(div pre)`

2. 选择器可以包含多个伪类，但是 `:extend()` 必须位于末位：`pre:hover:extend(div pre)`
3. 选择器可以多次继承：`div:hover:extend(.box):extend(.color){}` 等同于 `div:hover:extend(.box, .color) {}`
4. 如果是多元素选择器，则每个选择器都可以加 `:extend`
5. `:extend` 可以匹配嵌套选择器，和all有区别：`.title:extend(.box .bg)`
6. `:extend()` 中被继承的选择器名称不能是变量
7. `:extend()` 没有重复检测，所以不要重复定义

:::

<br />

### mixin 和 extend 的区别

相同点：

- 都可以减少代码量

不同点：

- extend 是同个选择器**共用同一个声明**，而 mixin 是使用**自己的声明**
- extend不带参数，mixin可以带参数

::: tip 使用理解

- mixin更灵活点，可以传参，可以匹配，也可以直接继承别人的样式（相对extend性能消耗会大一点）
- extend相当于复制一份别人的样式，就是对公共样式的一种封装（编译起来快，性能高）
- 如果**_复用的代码不用出现在编译后的代码_**中，使用mixin，反之使用 :extend()

:::

<br />

### import 导入

- 语法：`@import (keyword, keyword, ...) "filename"`
- 说明：
  - keyword：
    - `reference`：使用 Less 文件，但不输出该文件
    - `inline`：在输出中包含源文件，但不对其进行处理
    - `less`：将文件视为 Less 文件，无论文件扩展名是什么
    - `css`：将文件作为 CSS 文件处理，无论文件扩展名是什么
    - `once`：只包含文件一次（这是默认行为）
    - `multiple`：多次包含文件
    - `optional`：找不到文件时继续编译
  - filename：
    - 如果文件的扩展名为 .css，它将被视为 CSS 文件，@import 语句保持原样
    - 如果文件有其他扩展名，则会被视为 Less 并导入
    - 如果没有扩展名，则会添加 .less，并将其作为导入的 Less 文件

<br />

#### 省略后缀

```js
@import "main";

// 等价于
@import "main.less";
```

<br />

#### 导入位置

在标准 CSS 中，@import at-rules 必须放在所有其他类型的规则之前。但 Less 并不在乎 @import 语句放在哪里，`@import` 的位置可随意放置

```less
#main {
  font-size: 15px;
}

@import 'style';

```

<br />

#### reference

使用引入的 `Less` 文件，但是不编译它

```less
/* Less */
@import (reference) 'bootstrap.less';

#wrap:extend(.navbar all) {
}

```

<br />

#### once

@import语句的默认行为。这表明相同的文件只会被导入一次，而随后的导入文件的重复代码都不会解析。

```less
@import (once) 'foo.less';
@import (once) 'foo.less'; // this statement will be ignored

```

<br />

#### multiple

使用 `@import (multiple)` 允许导入多个同名文件。

```less
/* Less */

// file: foo.less
.a {
  color: green;
}

// file: main.less
@import (multiple) 'foo.less';
@import (multiple) 'foo.less';

/* 生成后的 CSS */
.a {
  color: green;
}
.a {
  color: green;
}

```

<br />

### 其他

<br />

#### 注释

- /\* \*/ CSS原生注释，会被编译在 CSS 文件中。

- // Less提供的一种注释，不会被编译在 CSS 文件中。

<br />

## 高级进阶

### when() & if()

在less中使用【比较运算符】或者【表达式的判断】来输入我们的值，根据不同的条件来输出不同的值。

[逻辑函数](https://lesscss.org/functions/#logical-functions)

::: tip

- 3.0版本之后使用 `if` 和 `boolean`，3.0版本之前用 `when`
- `if` 只能用在css属性值中或变量定义中

:::

<br />

### 比较运算符

- 大于`>`
- 小于`<`
- 等于`=`
- 大于等于`>=`
- 小于等于`=<`

::: warning

- （=）可用来比较【数字】、【字符串】、【标识符】等

- 其他的只能和【数字】一起使用

:::

<br />

### 逻辑运算符

<br />

#### 逻辑或

- 语法：`() or () `

- 作用：相当 JS中的 `||` ，只要有一个符合条件就会执行

  ```less
  // example
  .size(@width,@height) when (@width = 100px),(@height = 100px) {
    width: @width;
    height: @height;
  }

  ```

```

```

```

```

```

```

<br />

#### 逻辑与

- 语法：`() and ()`

- 作用：相当于 JS中的 `&&`，必须条件全部符合才会执行

  ```less
  .size(@width,@height) when (@width = 100px) and (@height = 100px) {
    width: @width;
    height: @height;
  }

  ```

````

```

```

<br />

#### 逻辑非

- 语法：`not ()`

- 作用：相当于 JS中的 `!`，条件不符合才会执行

  ```less
  .size(@width,@height) when not (@width = 100px) {
    width: @width;
    height: @height;
  }

  ```

```

```

````

<br />

### default()

- 作用：相当于 `else`，和条件表达式结合使用

```less
// 满足条件
.size(@width) when (@width > 20px) {

}

// 不满足条件
.size(@width) when (default()) {

```

<br />

### boolean()

- 作用：将一个布尔表达式存在变量，以供以后在Guard或 `if()` 中进行判断
- 参数：condition条件表达式
- 版本：3.0+

```less
@bg: rgb(10, 200, 30);
@bg-light: boolean(luma(@bg) > 50%);
div {
  background: @bg;
  color: if(@bg-light, black, white);
}

```

<br />

### 循环语句

<br />

#### 递归调用

```less
/*
混合loop-columns设了两个参数@n，@i。并且给@i设置了默认值1
第一次执行，只传了一个参数4，则@n=4，@i=默认值1
在自身调用自己，让@i自增
通过when判断，当@i<=@n时，停止执行
*/
.loop-columns(@n, @i: 1) when (@i =< @n) {
  .column-@{i} {
    width: (@i * 100% / @n);
  }
  .loop-columns(@n, (@i + 1));
}

.loop-columns(4);

```

```css
// 生成的css
.column-1 {
  width: 25%;
}
.column-2 {
  width: 50%;
}
.column-3 {
  width: 75%;
}
.column-4 {
  width: 100%;
}

```

```less
/* 批量设置边距 */
.loop(@count) when(@count < 6) {
  @newCount: @count * 10;

  .padding-@{newCount} {
    padding: (10px * @count);
  }

  .loop(@count + 1);
}
.loop(1);

```

```css
// 生成的css
.padding-10 {
  padding: 10px;
}
.padding-20 {
  padding: 20px;
}
.padding-30 {
  padding: 30px;
}
.padding-40 {
  padding: 40px;
}
.padding-50 {
  padding: 50px;
}

```

<br />

#### range() & each() 实现

- 版本：V3.9.0+

```less
each(range(4), {
  .col-@{value} {
    height: (@value * 50px);
  }
});

```

```css
// 生成的css
.col-1 {
  height: 50px;
}
.col-2 {
  height: 100px;
}
.col-3 {
  height: 150px;
}
.col-4 {
  height: 200px;
}

```

<br />

### each()

- 作用：将规则集的值绑定到列表的每个成员
- 参数：
  - list：用逗号或空格分隔的值列表
  - rules：匿名规则集/混合
- 版本：V3.7.0+

::: tip

每个列表成员可以被默认绑定 `@value`, `@key`, `@index ` 三个变量，对大部分的列表而言， `@key`和 `@index`会被定义为相同的值（比如以1开始的有序列表）。然而，也可以使用规则自定义列表中的`@key`值。

:::

```less
// 批量设置Class
@selectors: div, span, p;

each(@selectors, {
  .sel-@{value} {
    background: #cccccc;
  }
});

// 批量设置font-size
@List: {
  4: 4px;
  5: 5px;
  8: 8px;
  10: 10px;
  12: 12px;
};
each(@List, {
  .fs-@{key} {
    font-size: @value;
  }
});

// 批量设置color
@colors: {
  info: #eee;
  danger: #f00;
};

each(@colors, {
  .text-@{key}{
     color: @value;
  }
});

```

```css
// 上面所生成的对应的css
.sel-div {
  background: #cccccc;
}
.sel-span {
  background: #cccccc;
}
.sel-p {
  background: #cccccc;
}

.fs-4 {
  font-size: 4px;
}
.fs-5 {
  font-size: 5px;
}
.fs-8 {
  font-size: 8px;
}
.fs-10 {
  font-size: 10px;
}
.fs-12 {
  font-size: 12px;
}

.text-info {
  color: #eee;
}
.text-danger {
  color: #f00;
}

```

::: tip 匿名混入

`each()` 函数引入了匿名混入的概念：

- 匿名混入使用 `#()` 或 `.()` 的形式（以开头） `.` 或 `#` 就像常规的mixin一样

- `each()`函数会获取不定参数中的变量的名字并按顺序把它们赋给到 `@value`、`@key`、`@index`的value值。如果只是写了`each(@list, .(@value){})`,则`@key`和`@index`都会变成未定义

  ```less
  each(@colors,.(@v,@k,@i) {
    .text-@{k}{
      color: @v;
    }
  });
```

```

```

```

```

````

:::

<br />

### range()

- 作用：生成一个跨越一系列数值的列表
- 参数：
  - start：可选，起始值，如1或1px
  - end：端值，如5px
  - step：可选，要增加的数量
- 版本：V3.9.0+

<br />

### 合并

- 作用：合并功能允许将多个属性中的值合并到一个属性的列表中，值用 `,` 或者空格分隔开。
- 场景：合并（merge）主要应用于列表属性的整合，比如 `box-showdow`、`transfrom` 等属性。

<br />

#### 逗号分隔类

- 使用：定义mixin时，在需要合并的属性后加符号`+`；使用minxin时，在被合并的属性后也加符号`+`

```less
.shadow() {
  box-shadow+: 0 10px 10px green;
}

div {
  .shadow();
  box-shadow+: -10px 0 10px red;
}

````

```css
// 生成的css
div {
  box-shadow:
    0 10px 10px green,
    -10px 0 10px red;
}

```

<br />

#### 空格分隔类

- 使用：定义mixin时，在需要合并的属性后加符号`+_`；使用minxin时，在被合并的属性后也加符号`+_`

```less
.transform() {
  transform+_: rotate(45deg);
}

div {
  .transform();
  transform+_: scale(2);
}

```

```css
// 生成的css
div {
  transform: rotate(45deg) scale(2);
}

```

<br />

### 转义

- 作用：允许使用任意字符串作为属性或变量值，形式的内容都将按原样输出
- 语法： `~"xxx"` 或 `~'xxx'` ，携带变量：`~"xxx@{变量}xxx"`

::: warning

一般情况下不需要用到转义的，只有在代码不能被正常编译的情况下，才需要使用转义

:::

<br />

> **参考**
>
> [CSS 预处理器合集](https://juejin.cn/column/6992233701916540936)

```

```
