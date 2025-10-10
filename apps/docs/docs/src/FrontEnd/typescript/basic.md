# TypeScript

## 类型系统

### 基本类型

JavaScript 语言（注意，不是 TypeScript）将值分成8种类型：

- boolean
- string
- number
- bigint
- symbol
- object
- undefined
- null

TypeScript 继承了 JavaScript 的类型设计，以上8种类型可以看作 TypeScript 的基本类型。

注意，上面所有类型的名称都是小写字母，首字母大写的 `Number`、`String`、`Boolean` 等在 JavaScript 语言中都是内置对象，而不是类型名称。

另外，undefined 和 null 既可以作为值，也可以作为类型，取决于在哪里使用它们。

这8种基本类型是 TypeScript 类型系统的基础，复杂类型由它们组合而成。

<br />

#### boolean

> 定义：`boolean` 类型只包含 `true` 和 `false` 两个布尔值

```typescript
const x:boolean = true;
const y:boolean = false;
```

<br />

#### string

> 定义：`string` 类型包含所有字符串

```typescript
const x:string = 'hello';
const y:string = `${x} world`;
```

<br />

#### number

> 定义：`number` 类型包含所有整数和浮点数

`TypeScript` 里的所有数字都是浮点数。 这些浮点数的类型是 `number`。 除了支持十进制和十六进制字面量，`TypeScript` 还支持 `ECMAScript 2015` 中引入的二进制和八进制字面量。

```typescript
const decLiteral: number = 6;
const hexLiteral: number = 0xf00d;
const binaryLiteral: number = 0b1010;
const octalLiteral: number = 0o744;
```

<br />

#### bigint

> 定义：`bigint` 类型包含所有的大整数
>
> 注意：与 `number` 类型不兼容

```typescript
const x:bigint = 123n;
const y:bigint = 0xffffn;
```

::: warning

bigint 类型是 ES2020 标准引入的。如果使用这个类型，TypeScript 编译的目标 JavaScript 版本不能低于 ES2020（即编译参数`target`不低于`es2020`）

:::

<br />

#### symbol

> 定义：`symbol` 类型包含所有的 Symbol 值

```typescript
const x:symbol = Symbol();
```

<br />

#### null & undefined

> 定义：`undefined` 类型只包含一个值 `undefined`，表示未定义（即还未给出定义，以后可能会有定义）。`null` 类型也只包含一个值 `null`，表示为空（即此处没有值）。

```typescript
let u: undefined = undefined;
const n: null = null;
```

::: warning

- 默认情况下 `null` 和 `undefined` 是所有类型的子类型，可以把 `null` 和 `undefined` 赋值给其他类型的变量
- 如果没有声明类型的变量，被赋值为 `undefined `或 `null`，在关闭编译设置 `noImplicitAny` 和 `strictNullChecks` 时，它们的类型会被推断为 `any`
- 打开编译设置 `strictNullChecks` 以后，赋值为 `undefined` 的变量会被推断为 `undefined` 类型，赋值为 `null` 的变量会被推断为 `null` 类型，这两种值也不能互相赋值了，只能赋值给自身，或者 `any` 类型和 `unknown` 类型的变量

:::

---

### 包装对象类型

JavaScript 的8种类型之中，`undefined` 和 `null` 其实是两个特殊值，`object` 属于复合类型，剩下的五种属于原始类型（primitive value），代表最基本的、不可再分的值：

- boolean
- string
- number
- bigint
- symbol

上面这五种原始类型的值，都有对应的包装对象（wrapper object）。所谓“包装对象”，指的是这些值在需要时，会自动产生的对象。

五种包装对象之中，symbol 类型和 bigint 类型无法直接获取它们的包装对象（即`Symbol()`和`BigInt()`不能作为构造函数使用），但是剩下三种可以：

- `Boolean()`
- `String()`
- `Number()`

以上三个构造函数，执行后可以直接获取某个原始类型值的包装对象。

::: tip

`String()` 只有当作构造函数使用时（即带有 `new` 命令调用），才会返回包装对象。如果当作普通函数使用（不带有 `new` 命令），返回就是一个普通字符串。其他两个构造函数 `Number()` 和 `Boolean()` 也是如此。

:::

由于包装对象的存在，导致每一个原始类型的值都有包装对象和字面量两种情况。为了区分这两种情况，TypeScript 对五种原始类型分别提供了大写和小写两种类型：

- Boolean 和 boolean
- String 和 string
- Number 和 number
- BigInt 和 bigint
- Symbol 和 symbol

其中，大写类型同时包含包装对象和字面量两种情况，小写类型只包含字面量，不包含包装对象。

```typescript
const s1:String = 'hello'; // 正确
const s2:String = new String('hello'); // 正确

const s3:string = 'hello'; // 正确
const s4:string = new String('hello'); // 报错
```

::: tip

建议只使用小写类型，不使用大写类型。因为绝大部分使用原始类型的场合，都是使用字面量，不使用包装对象。而且，TypeScript 把很多内置方法的参数，定义成小写类型，使用大写类型会报错

:::

---

### Object & object

TypeScript 的对象类型也有大写 `Object` 和小写 `object` 两种：

- 大写的`Object`类型代表 JavaScript 语言里面的广义对象。所有可以转成对象的值，都是`Object`类型，这囊括了几乎所有的值。空对象 `{}` 是 `Object` 类型的简写形式，所以使用 `Object` 时常常用空对象代替

  ```typescript
  let obj:Object;
  // let obj:{}; // 正确

  obj = true;
  obj = 'hi';
  obj = 1;
  obj = { foo: 123 };
  obj = [1, 2];
  obj = (a:number) => a + 1;

  obj = undefined; // 报错
  obj = null; // 报错
  ```

- 小写的 `object` 类型代表 JavaScript 里面的狭义对象，即可以用字面量表示的对象，只包含对象、数组和函数，不包括原始类型的值

  ```typescript
  let obj:object;

  obj = { foo: 123 };
  obj = [1, 2];
  obj = (a:number) => a + 1;
  obj = true; // 报错
  obj = 'hi'; // 报错
  obj = 1; // 报错
  ```

::: tip

大多数时候，我们使用对象类型，只希望包含真正的对象，不希望包含原始类型。所以，建议总是使用小写类型`object`，不使用大写类型`Object`。

注意，无论是大写的`Object`类型，还是小写的`object`类型，都只包含 JavaScript 内置对象原生的属性和方法，用户自定义的属性和方法都不存在于这两个类型之中

:::

---

### 值类型

> 定义：TypeScript 规定，单个值也是一种类型，称为“值类型”

只包含单个值的值类型，用处不大。实际开发中，往往将多个值结合，作为联合类型使用。

```typescript
// x 的类型是 "https"
const x = 'https';

// y 的类型是 string
const y:string = 'https';
```

---

### 联合类型

> 定义：联合类型（union types）指的是多个类型组成的一个新类型，使用符号`|`表示。

联合类型 `A|B` 表示，任何一个类型只要属于`A`或`B`，就属于联合类型 `A|B`，联合类型的第一个成员前面，也可以加上竖杠`|`，这样便于多行书写。

```typescript
let setting:true|false;

let gender:'male'|'female';

let rainbowColor:'赤'|'橙'|'黄'|'绿'|'青'|'蓝'|'紫';

let x:
  | 'one'
  | 'two'
  | 'three'
  | 'four';
```

---

### 交叉类型

> 定义：交叉类型（intersection types）指的多个类型组成的一个新类型，使用符号`&`表示。

交叉类型 `A&B` 表示，任何一个类型必须同时属于`A`和`B`，才属于交叉类型 `A&B`，即交叉类型同时满足`A`和`B`的特征。

交叉类型的主要用途是表示对象的合成，常常用来为对象类型添加新属性：

```typescript
let obj:
  { foo: string } &
  { bar: string };

obj = {
  foo: 'hello',
  bar: 'world'
};

type A = { foo: number };

type B = A & { bar: number };
```

---

### typeof 运算符

- JavaScript 语言中，typeof 运算符是一个一元运算符，返回一个字符串，代表操作数的类型

  ```js
  typeof undefined // "undefined"
  typeof true // "boolean"
  typeof 1337 // "number"
  typeof 'foo' // "string"
  typeof {} // "object"
  typeof Number.parseInt // "function"
  typeof Symbol() // "symbol"
  typeof 127n // "bigint"
  ```

- TypeScript 将 `typeof` 运算符移植到了类型运算，它的操作数依然是一个值，但是返回的不是字符串，而是该值的 TypeScript 类型。这种用法的`typeof`返回的是 TypeScript 类型，所以只能用在类型运算之中（即跟类型相关的代码之中），不能用在值运算，而且命令的参数不能是类型

---

### 数组

```typescript
// 方式1: 可以在元素类型后面接上 []，表示由此类型元素组成的一个数组
let list: number[] = [1, 2, 3];

// 方式2: 使用数组泛型，Array<元素类型>：
let list: Array<number> = [1, 2, 3];

// 只读数组
const arr1: readonly number[] = [1, 2, 3];
const arr2: Readonly<number[]> = [1, 2, 3];
const arr3: ReadonlyArray<number> = [1, 2, 3];
const arr4 = [1, 2, 3] as const;
```

<br />

### tuple 元祖

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。越界访问会报错。

```typescript
// Declare a tuple type
let x: [string, number];

// Initialize it
x = ['hello', 10]; // OK

// Initialize it incorrectly
x = [10, 'hello']; // Error
```

- **元祖类型解构赋值**

```typescript
const info: [number, string] = [18, 'sze']
const [id, name] = info // id = 18, name = 'sze'
```

- **元祖类型可选参数**：问号只能用于元组的尾部成员，也就是说，所有可选成员必须在必选成员之后。

```typescript
type Point = [number, number?, number?];

const x: Point = [10]; // 一维坐标点
const xy: Point = [10, 20]; // 二维坐标点
const xyz: Point = [10, 20, 10]; // 三维坐标点

console.log(x.length); // 1
console.log(xy.length); // 2
console.log(xyz.length); // 3
```

- **元祖类型剩余参数**

```typescript
type RestTupleType = [number, ...string[]];
let restTuple: RestTupleType = [666, "Semlinker", "Kakuqo", "Lolo"];
console.log(restTuple[0]); // 666
console.log(restTuple[1]); // "Semlinker"
```

- **只读的元祖类型**

```typescript
const point: readonly [number, number] = [10, 20];
const point2: Readonly<[number, number]> = [1, 2];

// Cannot assign to '0' because it is a read-only property.
point[0] = 1;
// Property 'push' does not exist on type 'readonly [number, number]'.
point.push(0);
// Property 'pop' does not exist on type 'readonly [number, number]'.
point.pop();
// Property 'splice' does not exist on type 'readonly [number, number]'.
point.splice(1, 1);
```

<br />

### enum 枚举

```typescript
enum Color {Red, Green, Blue}

let c: Color = Color.Green;
// 默认情况下，从0开始为元素编号, 也可以手动的指定成员的数值
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;
```

<br />

### any

不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。

```typescript
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)
```

<br />

### void

表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 `void`。

声明一个 `void` 类型的变量没有什么大用，因为你只能为它赋予 `undefined` 和 `null`

```typescript
let unusable: void = undefined
```

<br />

### never

`never` 类型表示的是那些永不存在的值的类型。 例如，`never` 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 `never` 类型，当它们被永不为真的类型保护所约束时。

`never` 类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 `never` 的子类型或可以赋值给 `never` 类型（除了 `never` 本身之外）。 即使 `any` 也不可以赋值给 `never`。

```typescript
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}
```

<br />

### unknown

any 类型 = 万能类型 + 放弃类型检查，其中「万能类型」是我们想要的，能不能只要这个部分，而不要「放弃类型检查」这个危险的行为呢？当然！考虑到 any 类型的危险性，TypeScript 中还提供了一个功能类似的家伙：unknown 类型，用于表示万能类型的同时，保留类型检查。

`unknown`与`any`的最大区别是： 任何类型的值可以赋值给`any`，同时`any`类型的值也可以赋值给任何类型。`unknown` 任何类型的值都可以赋值给它，但它只能赋值给`unknown`和`any`。

::: tip

any 类型和 unknown 类型都能提供万能类型的作用，但不同之处在于，使用 any 类型后就丧失了类型检查的保护，可以对变量进行任意操作。而使用 unknown 类型时，虽然我们每进行一次操作都需要进行类型断言，断言到当前我们预期的类型，但这却能实现类型信息反向补全的功能，为最终我们的具体类型埋下伏笔。虽然 any 类型的使用过程中也可以通过类型断言保障，但毕竟缺少了类型告警，我们很容易就忽略掉了。

:::

<br />

## type

### 类型断言

类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。

```typescript
// 第一种：“尖括号”语法
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;

// 第二种：as 语法
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

两种形式是等价的。 至于使用哪个大多数情况下是凭个人喜好；然而，当你在 TypeScript 里使用 JSX 时，只有 `as` 语法断言是被允许的。

**非空断言**

在上下文中当类型检查器无法断定类型时，一个新的后缀表达式操作符 `!` 可以用于断言操作对象是非 null 和非 undefined 类型。**具体而言，x! 将从 x 值域中排除 null 和 undefined 。**

```typescript
let mayNullOrUndefinedOrString: null | undefined | string;
mayNullOrUndefinedOrString!.toString(); // ok
mayNullOrUndefinedOrString.toString(); // ts(2531)
```

**确定断言赋值**

允许在实例属性和变量声明后面放置一个 `!` 号，从而告诉 TypeScript 该属性会被明确地赋值。

```typescript
let x!: number;
initialize();
console.log(2 * x); // Ok

function initialize() {
  x = 10;
}
```

通过 `let x!: number;` 确定赋值断言，TypeScript 编译器就会知道该属性会被明确地赋值。

**字面量类型**

目前，TypeScript 支持 3 种字面量类型：字符串字面量类型、数字字面量类型、布尔字面量类型，对应的字符串字面量、数字字面量、布尔字面量分别拥有与其值一样的字面量类型。

```typescript
interface Config {
    size: 'small' | 'big';
    isEnable:  true | false;
    margin: 0 | 2 | 4;
}
```

在上述代码中，我们限定了 size 属性为字符串字面量类型 'small' | 'big'，isEnable 属性为布尔字面量类型 true | false（布尔字面量只包含 true 和 false，true | false 的组合跟直接使用 boolean 没有区别），margin 属性为数字字面量类型 0 | 2 | 4。

总结：

- 联合类型可以被断言为其中一个类型
- 父类可以被断言为子类
- 任何类型都可以被断言为 any
- any 可以被断言为任何类型
- 要使得 `A` 能够被断言为 `B`，只需要 `A` 兼容 `B` 或 `B` 兼容 `A` 即可

<br />

#### 类型拓宽

`let` 声明类型会拓宽，`const` 声明类型会收缩

<br />

#### 类型收缩

```typescript
// const 断言收缩

let t1 = <const>[1, 2, 'sze'] // type is readonly [1, 2, "sze"]
```

<br />

#### 联合类型

类型 A 和类型 B 联合后的类型是同时接受 A 和 B 值的类型

```typescript
let num: 1 | 2 = 1;
type EventNames = 'click' | 'scroll' | 'mousemove';
```

<br />

#### 类型别名

给类型重新命名，常用于联合类型

```typescript
type Message = string | string[];
let greet = (message: Message) => {
  // ...
};
```

<br />

#### 交叉类型

交叉类型是将多个类型合并为一个类型。 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。

交叉类型真正的用武之地就是将多个接口类型合并成一个类型，从而实现等同接口继承的效果，也就是所谓的合并接口类型。

```typescript
  type IntersectionType = { id: number; name: string; } & { age: number };
  const mixed: IntersectionType = {
    id: 1,
    name: 'name',
    age: 18
  }
```

如果同名属性的类型不兼容，比如上面示例中两个接口类型同名的 name 属性类型一个是 number，另一个是 string，合并后，name 属性的类型就是 number 和 string 两个原子类型的交叉类型，即 never。

```typescript
  type IntersectionTypeConfict = { id: number; name: string; }
  & { age: number; name: number; };
  const mixedConflict: IntersectionTypeConfict = {
    id: 1,
    name: 2, // ts(2322) 错误，'number' 类型不能赋给 'never' 类型
    age: 2
  };
```

在混入多个类型时，若存在相同的成员，且成员类型为非基本数据类型，那么是可以成功合并。

```typescript
interface A {
  x:{d:true},
}
interface B {
  x:{e:string},
}
interface C {
  x:{f:number},
}
type ABC = A & B & C
let abc:ABC = {
  x:{
    d:true,
    e:'',
    f:666
  }
}
```

<br />

### 函数

#### 函数声明

```typescript
function fuc1(x: number, y: number): number {
  return x + y
}
```

<br />

#### 函数表达式

```typescript
const func2: (x: number, y: number) => number = function (a: number, b: number): number {
  return a + b
}
```

::: warning 注意

注意不要混淆了 TypeScript 中的 `=>` 和 ES6 中的 `=>`。

在 TypeScript 的类型定义中，`=>` 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。

:::

<br />

#### 函数类型接口

```typescript
// 函数类型接口
interface IFunc {
  (x: string, y: string): string
}

let myFunc: IFunc;
myFunc = function(x: string, y: string) {
    return x + y;
}
```

采用函数表达式或者接口定义函数的方式时，对等号左侧进行类型限制，可以保证以后对函数名赋值时保证参数个数、参数类型、返回值类型不变。

<br />

#### 可选参数

```typescript
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
```

::: warning 注意

可选参数后面不允许再出现必需参数

:::

<br />

#### 参数默认值

```typescript
function buildName(firstName: string, lastName: string = 'Cat') {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
```

在 ES6 中，我们允许给函数的参数添加默认值，**TypeScript 会将添加了默认值的参数识别为可选参数**。此时就不受「可选参数必须接在必需参数后面」的限制了。

<br />

#### 剩余参数

```typescript
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}
let a = [];
push(a, 1, 2, 3);
```

::: warning 注意

剩余参数只能是最后一个参数

:::

<br />

#### 函数重载

由于 JavaScript 是一个动态语言，我们通常会使用不同类型的参数来调用同一个函数，该函数会根据不同的参数而返回不同的类型的调用结果：

```typescript
type Types = number | string
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: string, b: number): string;
function add(a: number, b: string): string;
function add(a: Types, b: Types): Types {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}
const result = add('Semlinker', ' Kakuqo');
result.split(' ');
```

在标注了每一种可能的重载的方式以后，在最后那个实际实现的函数类型标注里，我们需要标注各个参数类型和返回值类型，使用上面所有重载可能出现的类型组成的联合类型。但实际上这最后一个函数类型标注并不会被调用方看到，在匹配到对应的调用时，我们就能够获取到与参数组合完全匹配的提示与类型保障。
虽然类型层面做了重载，但好像函数内部还是需要自己通过朴素的 if else 判断当前是哪个参数组合...，这是因为，TypeScript 中的函数重载还是属于伪重载，它只能在类型层面帮你实现重载的效果，而实际的逻辑运行，由于 JavaScript 不支持，它也就束手无策了。真正的函数重载应该是直接定义多个同名的函数，这些函数的内部逻辑是仅服务一套参数组合的。
<br />

### 类

#### ES5 类的继承

1. 对象冒充继承（可以继承构造函数的属性和方法， 不能继承原型链上面的属性和方法）

   ```js
   function A(name, age) {
     this.name = name
     this.age = age
     this.run = function () { // 实例方法
       console.log(`${this.name}在运动`)
     }
   }
   A.prototype.sex = '男'
   A.prototype.work = function () { // 原型方法
     console.log(`${this.name}在工作`)
   }
   A.getInfo = function () { // 静态方法
     console.log('我是静态方法')
   }

   function A1() {
     A.call(this) // 对象冒充实现继承
   }
   const a = new A1()
   a.run()
   ```

2. 原型链继承（可以继承构造函数里的属性和方法，也可以继承原型链上面的属性和方法）

   缺点：实例化子类的时候无法给父类传参

   ```js
   A1.prototype = new A()
   const a = new A1()
   a.work()
   ```

3. 原型链+构造函数的组合继承模式

   ```js
   function A1(name, age) {
     A.call(this, name, age) // 对象冒充继承  实例化子类可以给父类传参
   }
   const a = new A1()
   ```

4. 原型链+构造函数的组合继承模式（第二种写法）

   ```js
   function A1(name, age) {
     A.call(this, name, age) // 对象冒充继承  实例化子类可以给父类传参
   }
   A.prototype = A1.prototype
   ```

<br />

#### TS中的类

```typescript
// TS中的类
class B{
  name: string; // 属性，前面省略了public关键词

  constructor(name: string) { // 构造函数，实例化类的时候触发的方法
    this.name = name;
  }

  run(): void {
    console.log(this.name + '在运动');
  }
}

const b = new B('张三');
b.run(); // 张三在运动

// 类的getter、setter
class Xiaojiejie {
  constructor(private age: number) {}
  get getAge() {
   return this.age;
  }
  set setAge(age: number) {
   this.age = age;
  }
}

const xiedajiao = new Xiaojiejie(28);
xiedajiao.setAge = 5;
console.log('x:', xiedajiao.getAge); // 5
```

<br />

#### TS中的继承

```typescript
// 先调用子类，再找父类
class C {
public name: string;
constructor(name: string) {
  this.name = name;
  }
   run(): void {
    console.log(this.name + '在运动');
  }
}

class C1 extends C{
constructor(name: string) {
  super(name); // 调用父类的构造函数
 }
}
const c = new C1('李四');
c.run();
```

```typescript
// 访问类型
public: 类的内部和外部都可以访问
protected: 只能类的内部和子类访问
private：只能类的内部访问
```

<br />

#### 类的静态属性、静态方法

```javascript
// ES5
class Person {
    this.run = function () {}
}
Person.name = '哈哈哈'; // 静态方法
Person.work = function () {} // 静态方法

// 调用
console.log(Person.name);
Person.work();
```

```typescript
// TS
class Person {
    run() {}
    work() {}
    age: number = 20; // 类属性
    static name: string = 'test'; // 静态属性
    static print() { // 静态方法
        console.log(Person.name)
    }
}

// 调用
Person.print();
```

::: warning 注意

静态方法只能访问静态属性，不能访问类属性

:::

<br />

#### 多态

父类定义一个方法不去实现，让继承它的子类去实现，每一个子类有不同的表现。多态属于继承。

```typescript
class Animal { // 父类
 name: string;
 constructor(name: string) {
   this.name = name;
}

 eat(): void {
     console.log('吃的方法');
 }
}

class Dog extends Animal{ // 子类1
 constructor(name: string) {
   super(name);
 }

 eat(): string {
   return this.name + '吃肉';
 }
}

class Cat extends Animal{ // 子类2
 constructor(name: string) {
   super(name);
 }

 eat(): string {
   return this.name + '吃鱼';
 }
}
```

<br />

#### 抽象类

是提供其他类继承的基类， 不能直接被实例化。

用abstract关键字定义抽象类和抽象方法，抽象类中的抽象方法不包含具体实现并且在派生类中实现。

抽象类必须包含抽象方法，继承的子类必须实现抽象方法，其他方法可以不实现

抽象类和抽象方法用来定义标准。

```typescript
abstract class Girl_2 {
  abstract skill(): void;
}

class Waiter_1 extends Girl_2{
  skill() {
    console.log('我会端茶倒水');
  }
}
class Teacher_2 extends Girl_2{
  skill() {
    console.log('我会基本按摩');
  }
}
class SkillTeacher extends Girl_2{
  skill() {
    console.log('我会全身SPA按摩');
  }
}
```

Class 还有一个不那么常用的使用方式，即作为工具方法的命名空间。如图片地址、配置信息这样的常量，也可以使用 Class + 静态成员来定义。

<br />

### 接口

#### 可选属性

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}
```

<br />

#### 只读属性

```typescript
interface Point {
    readonly x: number;
    readonly y: number;
}
```

TypeScript 具有 `ReadonlyArray<T>` 类型，它与 `Array<T>` 相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改。

```typescript
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```

上面代码的最后一行，可以看到就算把整个 `ReadonlyArray` 赋值到一个普通数组也是不可以的。 但是你可以用类型断言重写。

```typescript
a = ro as number[];
```

<br />

#### 索引属性

```typescript
interface Person {
  name: string; // 必须是any的子类型
  age: number; // 必须是any的子类型
  [propName: string]: any;
}
```

::: warning 注意
**一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集**

:::

<br />

#### 函数类型

为了使用接口表示函数类型，我们需要给接口定义一个调用签名。 它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
}
```

<br />

#### 绕开额外属性检查

1. 鸭式辨型法：不直接写对象，可以重新赋值，只要包含接口定义属性可以通过检查。

2. 类型断言

   ```typescript
   interface Props {
     name: string;
     age: number;
     money?: number;
   }

   let p: Props = {
     name: "兔神",
     age: 25,
     money: -100000,
     girl: false
   } as Props; // OK
   ```

3. 索引签名

   ```typescript
   interface Props {
     name: string;
     age: number;
     money?: number;
     [key: string]: any;
   }

   let p: Props = {
     name: "兔神",
     age: 25,
     money: -100000,
     girl: false
   }; // OK
   ```

4. 描述类数组
   ```typescript
   // 内置类型
   interface IArguments {
       [index: number]: any;
       length: number;
       callee: Function;
   }
   ```

<br />

<br />

### 类型与接口的区别

实际上，在大多数的情况下使用接口类型和类型别名的效果等价，但是在某些特定的场景下这两者还是存在很大区别。

<br />

#### Objects/Functions

```typescript
// interface
interface Point {
  x: number;
  y: number;
}

interface SetPoint {
  (x: number, y: number): void;
}

// type
type Point = {
  x: number;
  y: number;
};

type SetPoint = (x: number, y: number) => void;
```

<br />

#### other types

与接口不同，类型别名还可以用于其他类型，如基本类型（原始值）、联合类型、元组。

```typescript
// primitive
type Name = string;

// object
type PartialPointX = { x: number; };
type PartialPointY = { y: number; };

// union
type PartialPoint = PartialPointX | PartialPointY;

// tuple
type Data = [number, string];

// dom
let div = document.createElement('div');
type B = typeof div;
```

<br />

#### 接口可以多次定义合并，类型不行

与类型别名不同，接口可以定义多次，会被自动合并为单个接口。

```typescript
interface Point { x: number; }
interface Point { y: number; }
const point: Point = { x: 1, y: 2 };
```

![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/ts-3.png)

<br />

#### 扩展

两者的扩展方式不同，但并不互斥。接口可以扩展类型别名，同理，类型别名也可以扩展接口。

接口的扩展就是继承，通过 `extends` 来实现。类型别名的扩展就是交叉类型，通过 `&` 来实现。

<br />

##### 1. 接口扩展接口

```typescript
interface PointX {
    x: number
}

interface Point extends PointX {
    y: number
}
```

<br />

##### 2. 类型扩展类型

```typescript
type PointX = {
    x: number
}

type Point = PointX & {
    y: number
}
```

<br />

##### 3. 接口扩展类型

```typescript
type PointX = {
    x: number
}
interface Point extends PointX {
    y: number
}
```

<br />

##### 4. 类型扩展接口

```typescript
interface PointX {
    x: number
}
type Point = PointX & {
    y: number
}
```

<br />

<br />

### 泛型

**泛型就是解决类、接口、方法的复用性，以及对不特定数据类型的支持**

![https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/ts-1.png](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/ts-1.png)

<br />

#### 泛型约束

常见的操作泛型参数属性报错，需要扩展泛型属性

```typescript
interface Sizeable {
  size: number;
}
function trace<T extends Sizeable>(arg: T): T {
  console.log(arg.size);
  return arg;
}
```

<br />

#### 泛型工具类型

##### 1. typeof

typeof 的主要用途是在类型上下文中获取变量或者属性的类型。

```typescript
interface Person {
  name: string;
  age: number;
}
const sem: Person = { name: "semlinker", age: 30 };
type Sem = typeof sem; // type Sem = Person

// 获取对象类型
const Message = {
  name: "jimmy",
  age: 18,
  address: {
    province: '四川',
    city: '成都'
  }
}
type message = typeof Message;
```

此外，`typeof` 操作符除了可以获取对象的结构类型之外，它也可以用来获取函数对象的类型。

```typescript
function toArray(x: number): Array<number> {
  return [x];
}
type Func = typeof toArray; // -> (x: number) => number[]
```

<br />

##### 2. keyof

该操作符可以用于获取某种类型的所有键，其返回类型是联合类型。

```typescript
interface Person {
  name: string;
  age: number;
}

type K1 = keyof Person; // "name" | "age"
type K2 = keyof Person[]; // "length" | "toString" | "pop" | "push" | "concat" | "join"
type K3 = keyof { [x: string]: Person };  // string | number
```

```typescript
function prop<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
```

在以上代码中，我们使用了 TypeScript 的泛型和泛型约束。**首先定义了 T 类型并使用 `extends` 关键字约束该类型必须是 object 类型的子类型，然后使用 `keyof` 操作符获取 T 类型的所有键，其返回类型是联合类型，最后利用 `extends` 关键字约束 K 类型必须为 `keyof T` 联合类型的子类型。**

<br />

##### 3. in

用来遍历枚举类型。通常用于联合类型。

```typescript
type Keys = "a" | "b" | "c"

type Obj =  {
  [p in Keys]: any
} // -> { a: any, b: any, c: any }
```

<br />

##### 4. infer

在条件类型语句中，可以用 `infer` 声明一个类型变量并且对它进行使用。

```typescript
type ReturnType<T> = T extends (
  ...args: any[]
) => infer R ? R : any;
```

以上代码中 `infer R` 就是声明一个变量来承载传入函数签名的返回值类型，简单说就是用它取到函数返回值的类型方便之后使用。

<br />

##### 5. extends

有时候我们定义的泛型不想过于灵活或者说想继承某些类等，可以通过 extends 关键字添加泛型约束。

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

<br />

##### 6. 索引类型

```typescript
function getValues<T, K extends keyof T>(person: T, keys: K[]): T[K][] {
  return keys.map(key => person[key]);
}

interface Person {
    name: string;
    age: number;
}

const person: Person = {
    name: 'musion',
    age: 35
}

getValues(person, ['name']) // ['musion']
getValues(person, ['gender']) // 报错：
// Argument of Type '"gender"[]' is not assignable to parameter of type '("name" | "age")[]'.
// Type "gender" is not assignable to type "name" | "age".
```

<br />

##### 7. 映射类型

根据旧的类型创建出新的类型, 我们称之为映射类型。

```typescript
interface TestInterface{
    name:string,
    age:number
}

// 我们可以通过+/-来指定添加还是删除
type OptionalTestInterface<T> = {
  [p in keyof T]+?:T[p]
}

type newTestInterface = OptionalTestInterface<TestInterface>
// type newTestInterface = {
//    name?:string,
//    age?:number
// }
```

<br />

#### 内置的工具类型

##### 1. Partial

`Partial<T>` 将类型的属性变成可选。

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

但是 `Partial<T>` 有个局限性，就是只支持处理第一层的属性。

**DeepPartial**

```typescript
type DeepPartial<T> = {
     // 如果是 object，则递归类型
    [U in keyof T]?: T[U] extends object
      ? DeepPartial<T[U]>
      : T[U]
};

type PartialedWindow = DeepPartial<T>; // 现在T上所有属性都变成了可选啦
```

<br />

##### 2. Required

Required将类型的属性变成必选。

```typescript
type Required<T> = {
    [P in keyof T]-?: T[P]
};
```

<br />

##### 3. Readonly

`Readonly<T>` 的作用是将某个类型所有属性变为只读属性，也就意味着这些属性不能被重新赋值。

```typescript
type Readonly<T> = {
 readonly [P in keyof T]: T[P];
};

// example
interface Todo {
 title: string;
}

const todo: Readonly<Todo> = {
 title: "Delete inactive users"
};

todo.title = "Hello"; // Error: cannot reassign a readonly property
```

<br />

##### 4. Pick

Pick 从某个类型中挑出一些属性出来。

```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

```typescript
// example
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

<br />

##### 5. Record

`Record<K extends keyof any, T>` 的作用是将 `K` 中所有的属性的值转化为 `T` 类型。

```typescript
type Record<K extends keyof any, T> = {
    [P in K]: T;
};

// example
interface PageInfo {
  title: string;
}

type Page = "home" | "about" | "contact";

const x: Record<Page, PageInfo> = {
  about: { title: "about" },
  contact: { title: "contact" },
  home: { title: "home" },
};
```

<br />

##### 6. ReturnType

用来得到一个函数的返回值类型。

```typescript
type ReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R ? R : any;
```

`infer`在这里用于提取函数类型的返回值类型。`ReturnType<T>` 只是将 infer R 从参数位置移动到返回值位置，因此此时 R 即是表示待推断的返回值类型。

```typescript
// example
type Func = (value: number) => string;
const foo: ReturnType<Func> = "1";
```

`ReturnType`获取到 `Func` 的返回值类型为 `string`，所以，`foo` 也就只能被赋值为字符串了。

<br />

##### 7. Exclude

`Exclude<T, U>` 的作用是将某个类型中属于另一个的类型移除掉。

获取排除后的属性

```typescript
type Exclude<T, U> = T extends U ? never : T;
```

如果 `T` 能赋值给 `U` 类型的话，那么就会返回 `never` 类型，否则返回 `T` 类型。最终实现的效果就是将 `T` 中某些属于 `U` 的类型移除掉。

```typescript
// example
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type T2 = Exclude<string | number | (() => void), Function>; // string | number
```

<br />

##### 8. Extract

`Extract<T, U>` 的作用是从 `T` 中提取出 `U`。提取公共属性。

```typescript
type Extract<T, U> = T extends U ? T : never;

// example
type T0 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T1 = Extract<string | number | (() => void), Function>; // () =>void
```

<br />

##### 9. Omit

`Omit<T, K extends keyof any>` 的作用是使用 `T` 类型中除了 `K` 类型的所有属性，来构造一个新的类型。

```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

```typescript
// example
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

<br />

##### 10. NonNullable

`NonNullable<T>` 的作用是用来过滤类型中的 `null` 及 `undefined` 类型。

```typescript
type NonNullable<T> = T extendsnull | undefined ? never : T;

// example
type T0 = NonNullable<string | number | undefined>; // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]
```

<br />

##### 11. Parameters

`Parameters<T>` 的作用是用于获得函数的参数类型组成的元组类型。

```typescript
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
? P : never;

// example
type A = Parameters<() =>void>; // []
type B = Parameters<typeof Array.isArray>; // [any]
type C = Parameters<typeof parseInt>; // [string, (number | undefined)?]
type D = Parameters<typeof Math.max>; // number[]
```

<br />

<br />

### 分布式条件类型

**联合类型中的每个类型都是相互独立的，TypeScript 对它做了特殊处理，也就是遇到字符串类型、条件类型的时候会把每个类型单独传入做计算，最后把每个类型的计算结果合并成联合类型。**

条件类型左边是联合类型的时候就会触法这种处理，叫做分布式条件类型。

::: warning

- A extends A 不是没意义，意义是取出联合类型中的单个类型放入 A
- A extends A 才是分布式条件类型， \[A\] extends \[A\] 就不是了，只有左边是单独的类型参数才可以

:::

<br />

### 类型体操

::: tip

- any 类型与任何类型的交叉都是 any，也就是 1 & any 结果是 any，可以用这个特性判断 any 类型。
- 联合类型作为类型参数出现在条件类型左侧时，会分散成单个类型传入，最后合并。
- never 作为类型参数出现在条件类型左侧时，会直接返回 never。
- any 作为类型参数出现在条件类型左侧时，会直接返回 trueType 和 falseType 的联合类型。
- 元组类型也是数组类型，但 length 是数字字面量，而数组的 length 是 number。可以用来判断元组类型。
- 函数参数处会发生逆变，可以用来实现联合类型转交叉类型。
- 可选索引的索引可能没有，那 Pick 出来的就可能是 {}，可以用来过滤可选索引，反过来也可以过滤非可选索引。
- 索引类型的索引为字符串字面量类型，而可索引签名不是，可以用这个特性过滤掉可索引签名。
- keyof 只能拿到 class 的 public 的索引，可以用来过滤出 public 的属性。
- 默认推导出来的不是字面量类型，加上 as const 可以推导出字面量类型，但带有 readonly 修饰，这样模式匹配的时候也得加上 readonly 才行。

熟悉了这些特殊的特性，配合提取、构造、递归、数组长度计数、联合分散这五种套路，就可以实现各种类型体操。

:::

::: tip 顺口溜：

- **模式匹配做提取**：就像字符串可以通过正则提取子串一样，TypeScript 的类型也可以通过匹配一个模式类型来提取部分类型到 infer 声明的局部变量中返回
- **重新构造做变换**：TypeScript 类型系统可以通过 type 声明类型变量，通过 infer 声明局部变量，类型参数在类型编程中也相当于局部变量，但是它们都不能做修改，想要对类型做变换只能构造一个新的类型，在构造的过程中做过滤和转换

- **递归复用做循环**：在 TypeScript 类型编程中，遇到数量不确定问题时，就要条件反射的想到递归，每次只处理一个类型，剩下的放到下次递归，直到满足结束条件，就处理完了所有的类型
- **数组长度做计数**：TypeScript 类型系统没有加减乘除运算符，但是可以构造不同的数组再取 length 来得到相应的结果。这样就把数值运算转为了数组类型的构造和提取

- **联合分散可简化**：TypeScript 对联合类型做了特殊处理，当遇到字符串类型或者作为类型参数出现在条件类型左边的时候，会分散成单个的类型传入做计算，最后把计算结果合并为联合类型
- **特殊特性要记清**：any 和任何类型的交叉都为 any，可以用来判断 any 类型；索引一般是 string，而可索引签名不是，可以根据这个来过滤掉可索引签名

:::

<br />

### 装饰器(实验性)

装饰器是一种特殊类型声明，它能够被附加到类声明，方法，属性或者参数上，可以修改类的行为

通俗的讲，装饰器就是一个方法，可以注入到类、方法、属性参数上来扩展类、属性、方法、参数的功能

**装饰器的写法：普通装饰器（无法传参），装饰器工厂（可以传参）**

```json
// 需开启 experimentalDecorators 属性
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
```

<br />

#### 类装饰器

类装饰器：在类声明之前被声明（紧靠着类声明）

类装饰器应用于类构造函数，可以用来监视、修改或者替换类定义

```typescript
// 类装饰器: 普通装饰器
function logClass(params: any) {
  console.log('params:', params)
  // params就是当前类
  params.prototype.apiUrl = 'xxxxx'
}
@logClass
class HttpClient {
  constructor() {}
  getData() {}
}
const http: any = new HttpClient()
console.log('http:', http.apiUrl)
// params: [Function: HttpClient]
// http: xxxxx

// 类装饰器：装饰器工厂
function logClass2(params: string) {
  return function (target: any) {
    // target就是当前类
    console.log('target:', target, params)
    target.prototype.apiUrl = params
  }
}
@logClass2('hello')
class HttpClient2 {
  constructor() {}
  getData() {}
}
const http2: any = new HttpClient2()
console.log('http:', http2.apiUrl)
// target: [Function: HttpClient2] hello
// http: hello
```

**类装饰器重载构造函数或方法**

```typescript
// 普通装饰器
function logClasss(target: any) {
  console.log('target:', target)

  return class extends target {
    apiUrl: any = '我是修改后的apiUrl'
    getData () {
      this.apiUrl += '----'
      console.log('仂:', this.apiUrl)
    }
  }
}

@logClasss
class HttpClient {
  public apiUrl: string | undefined;
  constructor () {
    this.apiUrl = '我是构造函数里面的URL'
  }
  getData() {
    console.log('url:', this.apiUrl)
  }
}
const http = new HttpClient()
http.getData()

// target: [Function: HttpClient]
// 仂: 我是修改后的apiUrl----
```

<br />

#### 属性装饰器

属性装饰器表达式在运行时当作函数被调用，传入2个参数：

1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
2. 成员的名字

```typescript
function logProperty (params: any) {
  return function (target: any, attr: any) {
    console.log('111:', target, attr)
    target[attr] =  params
  }
}
class HttpClient {
  @logProperty('Leopold')
  public apiUrl: any | undefined
  constructor () {}
  getData () {
    console.log('url:', this.apiUrl)
  }
}
const http = new HttpClient()
http.getData()
// 111: { getData: [Function (anonymous)] } apiUrl
// url: Leopold
```

<br />

#### 方法装饰器

会被应用到方法的属性描述符上 ，可以用来监视、修改或者替换方法定义。

运行时会传入下列3个参数：

1. 对于静态成员来说是类的构造函数，对于实例成员来说是类的原型对象
2. 成员的名字
3. 成员的属性描述符

```typescript
function logMethod (parmas: any) {
  return function (target: any, method: any, desc: any) {
    console.log('target:', target, method, desc)
    target.apiUrl = 'aaa'
    target.run = function () {
      console.log('run')
    }
  }
}
class HttpClient {
  public apiUrl: any | undefined
  constructor () {}
  @logMethod('Sze')
  getData () {
    console.log('url:', this.apiUrl)
  }
}
const http = new HttpClient()
http.getData()
http.run()
// target: { getData: [Function (anonymous)] }
// getData
// {
//   value: [Function (anonymous)],
//   writable: true,
//   enumerable: true,
//   configurable: true
// }

// url: aaa
// run
```

<br />

<br />

### tsconfig.json

#### 顶层配置

- files：指定要包含在程序中的文件的允许列表。如果找不到任何文件，则会发生错误。当您只有少量文件并且不需要使用 glob 来引用许多文件时，这很有用。如果您需要，请使用 `include`。`files` 里面只是入口文件，比如 `test.ts` 里面依赖一个 `rely.ts` 那么在 `files` 中不写 `rely.ts` 也不会报错

- extends：`extends` 的值是一个字符串，其中包含要继承的另一个配置文件的路径。该路径可能使用 `Node.js` 样式解析。首先加载基本文件中的配置，然后被继承配置文件中的配置覆盖。在配置文件中找到的所有相对路径都将相对于它们所在的配置文件进行解析。目前，唯一从继承中排除的顶级属性是 `reference`。

  ```json
  // example
  {
    "extends": "./configs/base",
    "files": ["main.ts", "supplemental.ts"]
  }
  ```

- include：指定要包含在程序中的文件名或模式数组。这些文件名相对于包含 `tsconfig.json` 文件的目录进行解析。

  ```json
  // example
  {
    "include": ["src/**/*", "tests/**/*"]
  }
  ```

- exclude：指定解析包含时应跳过的文件名或模式数组。

  ::: warning

  重要提示：仅排除因 `include` 设置而包含的文件的更改。

  它不是一种阻止文件被包含在代码库中的机制——它只是改变了 `include` 设置找到的内容。

​ :::

- reference：项目 `reference` 是一种将 `TypeScript` 程序构造成更小部分的方法。使用项目引用可以大大缩短构建和编辑器的交互时间，强制组件之间的逻辑分离，并以新的和改进的方式组织您的代码。
- compilerOptions：涵盖了语言应该如何工作。

::: tip

`include` 和 `exclude` 支持通配符以制作全局模式：

- \* 匹配零个或多个字符（不包括目录分隔符）
- ? 匹配任何一个字符（不包括目录分隔符）
- \*\*/ 匹配任何嵌套到任何级别的目录

:::

<br />

#### compilerOptions

```json
{
  "compilerOptions": {

    /* 基本选项 */
    "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
}

{
    /* type checking */
    allowUnreachableCode: undefined, // 无法访问的代码
    allowUnusedLabels: undefined, // 未使用的标签
    alwaysStrict: true if strict, false otherwise, // 确保您的文件在 ECMAScript 严格模式下解析，并为每个源文件发出“use strict”
    exactOptionalPropertyTypes: undefined, // 启用 exactOptionalPropertyTypes 后，TypeScript 应用更严格的规则来处理它如何处理类型或具有 ?字首

}
```

<br />

<br />

### 配置

```
tsc --init 						// 生成tsconfig.json
修改rootDir、outdir
```

**webstorm配置**

1. Add new file watcher

2. Program：`C:\XXX\tsc.cmd`

3. Arguments：`--target "esnext"`

4. Output paths to refresh：`$FileNameWithoutExtension$.js:$FileNameWithoutExtension$.js.map`

<br />

<br />

### 综合使用

功能：定义一个操作数据库的库，支持mysql，MSSQL，MongoDB

要求：MySQL、MSSQL、MongoDB功能一样，都有 add、update、delete、get方法

注意：约束统一的规范以及代码重用

解决方案：需要约束规范所以要定义接口，需要代码重用所以要用到泛型

```typescript
interface DBI<T> {
  add(info: T): boolean;
  update(info: T, id: number): boolean;
  delete(id: number): boolean;
  get(id: number): any[];
}
// 定义一个操作MySQL数据库的类    注意：要实现泛型接口，这个类也应该是一个泛型类
class MySqlDb<T> implements DBI<T> {
  add(info: T): boolean {
    console.log('add:', info)
    return true;
  }

  delete(id: number): boolean {
    console.log('delete:', id)
    return true;
  }

  get(id: number): any[] {
    return [];
  }

  update(info: T, id: number): boolean {
    console.log('update:', info, id)
    return true;
  }
}
// 定义一个操作MSSQL数据库的类
class MsSqlBd<T> implements DBI<T> {
  add(info: T): boolean {
    console.log('add:', info)
    return true;
  }

  delete(id: number): boolean {
    console.log('delete:', id)
    return true;
  }

  get(id: number): any[] {
    return [];
  }

  update(info: T, id: number): boolean {
    console.log('update:', info, id)
    return true;
  }
}

// 操作用户表 定义一个User类和数据表做映射
class User {
  usenName: string | undefined
  password: string | undefined
}
const u = new User()
u.usenName = '张三'
u.password = '123'

const mysql = new MySqlDb<User>()
mysql.add(u)
```

<br />

### doc

#### 1. 接口继承与交叉类型（Interfaces vs Intersections）

这两种方式在合并类型上看起来很相似，但实际上还是有很大的不同。最原则性的不同就是在于冲突怎么处理：

1. 使用继承的方式，如果重写类型会导致编译错误，但交叉类型不会

```typescript
// 接口继承

interface Colorful {
  color: string;
}

interface ColorfulSub extends Colorful {
  color: number
}

// Interface 'ColorfulSub' incorrectly extends interface 'Colorful'.
// Types of property 'color' are incompatible.
// Type 'number' is not assignable to type 'string'.
```

2. 交叉类型取类型的交集

<br />

#### 2. 泛型

除了泛型接口之外，我们也可以创建泛型类。注意，不可能创建泛型枚举类型和泛型命名空间。

一个类它的类型有两部分：静态部分和实例部分。泛型类仅仅对实例部分生效，所以当我们使用类的时候，注意静态成员并不能使用类型参数。

<br />

#### 3. typeof

TypeScript 有意的限制了可以使用 `typeof` 的表达式的种类。

在 TypeScript 中，只有对标识符（比如变量名）或者他们的属性使用 `typeof` 才是合法的。

<br />

#### 4. 索引访问类型

作为索引的只能是类型，这意味着你不能使用 `const` 创建一个变量引用，可以使用类型别名实现类似的重构。

注意，只有 `function`、`class` 和 `interface` 可以直接默认导出，其他的变量需要先定义出来，再默认导出。

当且仅当在以下几个场景下，我们才需要使用三斜线指令替代 `import`：

- 当我们在**书写**一个全局变量的声明文件时
- 当我们需要**依赖**一个全局变量的声明文件时

注意，三斜线指令必须放在文件的最顶端，三斜线指令的前面只允许出现单行或多行注释。

就会先识别 `package.json` 中是否存在 `types` 或 `typings` 字段。发现不存在，那么就会寻找是否存在 `index.d.ts` 文件。如果还是不存在，那么就会寻找是否存在 `lib/index.d.ts` 文件。假如说连 `lib/index.d.ts` 都不存在的话，就会被认为是一个没有提供类型声明文件的库了。

有的库为了支持导入子模块，比如 `import bar from 'foo/lib/bar'`，就需要额外再编写一个类型声明文件 `lib/bar.d.ts` 或者 `lib/bar/index.d.ts`，这与自动生成声明文件类似，一个库中同时包含了多个类型声明文件。

<br />

## 类型声明

> 语法：`declare xxx`
>
> 使用：`declare module` 通常用于为没有提供类型定义的库进行类型的补全，以及为非代码文件提供基本类型定义

::: info

- TypeScript 通过 DefinitelyTyped ，也就是 `@types/` 系列的 npm 包来为无类型定义的 JavaScript npm 包提供类型支持，这些类型定义 的 npm 包内部其实就是数个 `.d.ts` 这样的声明文件。

- 而这些声明文件主要通过 declare / namespace 的语法进行类型的描述，我们可以通过项目内额外的声明文件，来实现为非代码文件的导入，或者是全局变量添加上类型声明。

:::

### DefinitelyTyped

> 概述：`@types/` 开头的这一类 npm 包均属于，专用于为社区存在的**无类型定义的 JavaScript 库**添加类型支持，常见的有 `@types/react` `@types/lodash` 等等

::: info

如果第三方库并不是通过导出来使用，而是直接在全局注入了变量，如 CDN 引入与某些监控埋点 SDK 的引入，我们需要通过 `window.xxx` 的方式访问，而类型声明很显然并不存在。此时我们仍然可以通过类型声明，但不再是通过 `declare module` 了。

:::

<br />

### 扩展已有的类型定义

在类型声明中，如果我们直接声明一个变量，那就相当于将它声明在了全局空间中：

```typescript
// 类型声明
declare const errorReporter: (err: any) => void;

// 实际使用
errorReporter("err!");
```

想将它显式的添加到已有的 `Window` 接口中呢？在接口一节中我们其实已经了解到，如果你有多个同名接口，那么**这些接口实际上是会被合并的**，这一特性在类型声明中也是如此。因此，我们再声明一个 Window 接口即可：

```typescript
interface Window {
  userTracker: (...args: any[]) => Promise<void>;
}

window.userTracker("click!")
```

类似的，我们也可以扩展来自 `@types/` 包的类型定义：

```typescript
declare module 'fs' {
  export function bump(): void;
}

import { bump } from 'fs';
```

<br />

### 三斜线指令

> 概述：对于多个类型声明文件，如果想复用某一个已定义的类型呢，需要三斜线指令了。三斜线指令就像是声明文件中的导入语句一样，它的作用就是**声明当前的文件依赖的其他类型声明**。而这里的“其他类型声明”包括了 TS 内置类型声明（`lib.d.ts`）、三方库的类型声明以及你自己提供的类型声明文件等。

三斜线指令本质上就是一个自闭合的 XML 标签，其语法大致如下：

```typescript
/// <reference path="./other.d.ts" />
/// <reference types="node" />
/// <reference lib="dom" />
```

::: danger

三斜线指令必须被放置在文件的顶部才能生效

:::

1. 使用 path 的 reference 指令，其 path 属性的值为一个相对路径，指向你项目内的其他声明文件。而在编译时，TS 会沿着 path 指定的路径不断深入寻找，最深的那个没有其他依赖的声明文件会被最先加载。

```typescript
// @types/node 中的示例
/// <reference path="fs.d.ts" />
```

2. 使用 types 的 reference 指令，其 types 的值是一个包名，也就是你想引入的 `@types/` 声明，如上面的例子中我们实际上是在声明当前文件对 `@types/node` 的依赖。而如果你的代码文件（`.ts`）中声明了对某一个包的类型导入，那么在编译产生的声明文件（`.d.ts`）中会自动包含引用它的指令。

```typescript
/// <reference types="node" />
```

3. 使用 lib 的 reference 指令类似于 types，只不过这里 lib 导入的是 TypeScript 内置的类型声明，如下面的例子我们声明了对 `lib.dom.d.ts` 的依赖：

```typescript
// vite/client.d.ts
/// <reference lib="dom" />
```

而如果我们使用 `/// <reference lib="esnext.promise" />`，那么将依赖的就是 `lib.esnext.promise.d.ts` 文件。

这三种指令的目的都是引入当前文件所依赖的其他类型声明，只不过适用场景不同而已。

<br />

### 命名空间

> 概述：命名空间（namespace）就像一个模块文件一样，将一组强相关的逻辑收拢到一个命名空间内部。命名空间内部实际上就像是一个独立的代码文件，因此其中的变量需要导出以后，才能通过 `xx.xx` 这样的形式访问。

支持嵌套：

```typescript
export namespace VirtualCurrency {
  export class QQCoinPaySDK {}

  export namespace BlockChainCurrency {
    export class BitCoinPaySDK {}

    export class ETHPaySDK {}
  }
}

const ethPaySDK = new VirtualCurrency.BlockChainCurrency.ETHPaySDK();
```

支持在声明文件中使用：

```typescript
declare namespace Animal {
  export interface Dog {}

  export interface Cat {}
}

declare let dog: Animal.Dog;
declare let cat: Animal.Cat;
```

<br />
