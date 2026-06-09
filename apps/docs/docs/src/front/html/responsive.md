---
title: 移动端适配
date: '2026-06-09 08:46:05'
updated: '2026-06-09 10:43:45'
slug: responsive
order: 4
---
## 1. 百分比
在 `CSS` 中盒子的宽度可以设置为一个百分比值，表示根据父级宽度的百分比来计算宽度。因此我们可以通过百分比的方式让一个盒子在任何设备中宽度占比都是一样的。

:::warning
利用百分比布局，不是所有情况都根据父级宽度来进行计算，例如：

+ **[max/min-]height、top、bottom 等：** 取决于父级高度的百分比
+ **transform: translate()、background-size 等：** 取决于自身宽度的百分比

所以百分比布局的适配方案相对标准不统一，在开发时很容易造成意外的问题，这种方案往往需要配合其他适配方案一起使用。

:::

  


## 2. viewport适配
由于在不同的设备上，`CSS` 像素是不一样的。例如 `iPhone 6/7/8` 为 `375px`，而 `iPhone 6/7/8 Plus` 为 `414px`。那么，我们可以通过设置 `viewport` 的缩放，来使页面显示正常。这种适配方案的**原理就是把所有机型的 CSS 像索（设备宽度）设置成一致的**。

```javascript
(function () {
  const view = document.querySelector('meta[name="viewport"]')
  const targetWidth = 375
  // 获取设备宽度
  const curWidth = document.documentElement.clientWidth
  const targetScale = curWidth / targetWidth
  view.content = `initial-scale=${targetScale},user-scalable=no,minimum-scale=${targetScale},maximum-scale=${targetScale}`
})()
```

这种适配方案也有其本身的缺点，主要有三点：

+ 在设置宽度时，要把宽度设置成一个固定值，那么所有手机看上去都是同样的大小，没有分别，不太好。厂商特意做出各种大小的手机，还要弄成一样，那买大屏机有什么意义。
+ 算出的值在一些有小数的情况下可能会出现误差(可忽略)，因为设备独立像素不能有小数。
+ 对设计稿的测量存在问题。

  


## 3. rem
> 原理：把设备宽度都分成相同的若干份，然后再计算元素宽度所占的份数。
>

```javascript
(function (doc, win) {
  // 设计稿宽度（根据实际设计稿调整）
  const designWidth = 750
  // 基准值（1rem = 16px）
  const baseSize = 16

  // 获取根元素
  const docEl = doc.documentElement

  // 调整根元素 font-size 的函数
  function setRem() {
    // 当前窗口宽度
    const clientWidth = docEl.clientWidth || win.innerWidth
    if (!clientWidth)
      return

    // 根据窗口宽度动态计算 font-size
    const remSize = (clientWidth / designWidth) * baseSize
    docEl.style.fontSize = `${remSize}px`
  }

  // 初始化
  setRem()

  // 监听窗口大小变化，重新设置 rem
  win.addEventListener('resize', setRem)
  win.addEventListener('pageshow', (e) => {
    if (e.persisted)
      setRem()
  })
})(document, window)
```

  


## 4. 媒体查询
> 作用：通过 `@media 规则` 结合 `6 个查询参数` 来拦截设备的浏览器特性（如显示类型、视窗高度、视窗宽度、横竖屏等），藉此可以为不同的特性应用不同的样式代码（相当于为不同的设备应用了不同的 CSS 样式）。
>
> 解决：媒体查询只解决了「为不同特性的浏览器视窗使用不同的样式代码」的问题
>

| 参数名称 | 描述 |
| --- | --- |
| `min-width` | 当视窗宽度大于或等于指定值时，@media 规则下的样式将被应用 |
| `max-width` | 当视窗宽度大于或等于指定值时，@media 规则下的样式将被应用 |
| `min-height` | 当视窗高度小于或等于指定值时，@media 规则下的样式将被应用 |
| `max-height` | 当视窗高度大于或等于指定值时，@media 规则下的样式将被应用 |
| `orientation=portrait` | 当竖屏时，@media 规则下的样式将被应用 |
| `orientation=landscape` | 当横屏时，@media 规则下的样式将被应用 |


```css
@media (max-width: 640px) {
  ...
}
```

  


## 5. vw&rem
> 作用：让页面元素的尺寸能够依据浏览器视窗尺寸变化而平滑变化。
>

### 方法一：仅适用vw
利用 Sass 函数将设计稿元素尺寸的像素单位转换为 vw 单位

```sass
// iPhone 6尺寸作为设计稿基准
$vw_base: 375;
@function vw($px) {
  @return ($px / $vm_base) * 100vw;
}

// 所有单位全部采用vw计算
.mod_nav {
  background-color: #fff;

  &_list {
    display: flex;
    padding: vw(15) vw(10) vw(10); // 内间距

    &_item {
      flex: 1;
      text-align: center;
      font-size: vw(10); // 字体大小

      &_logo {
        display: block;
        margin: 0 auto;
        width: vw(40); // 宽度
        height: vw(40); // 高度

        img {
          display: block;
          margin: 0 auto;
          max-width: 100%;
        }
      }

      &_name {
        margin-top: vw(2);
      }
    }
  }
}

```

  


### 方法二：vw + rem + 媒体查询
rem 弹性布局的核心在于根据视窗大小变化动态改变根元素的字体大小，可以通过以下步骤来进行优化：

1. 给根元素的字体大小设置随着视窗变化而变化的 vw 单位，这样就可以实现动态改变其大小
2. 其他元素的文本字号大小、布局高宽、间距、留白都使用 rem 单位
3. 限制根元素字体大小的最大最小值，配合 body 加上最大宽度和最小宽度，实现布局宽度的最大最小限制

```sass
// rem 单位换算：定为 75px 只是方便运算，750px-75px、640-64px、1080px-108px，如此类推
$vw_fontsize: 75; // iPhone 6尺寸的根元素大小基准值
@function rem($px) {
  @return ($px / $vw_fontsize) * 1rem;
}

// 根元素大小使用 vw 单位
$vw_design: 750;
html {
  font-size: ($vw_fontsize / ($vw_design / 2)) * 100vw;
  // 同时，通过Media Queries 限制根元素最大最小值
  @media screen and (min-width: 320px) {
    font-size: 64px;
  }
  @media screen and (max-width: 540px) {
    font-size: 108px;
  }
}
// body 也增加最大最小宽度限制，避免默认100%宽度的 block 元素跟随 body 而过大过小
body {
  max-width: 540px;
  min-width: 320px;
}

```

  


> 参考：
>
> [大厂 H5 开发实战手册](https://www.kancloud.cn/lancao/book-h5/917291)
>

