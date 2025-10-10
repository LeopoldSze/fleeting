# 算法

## 复杂度

有一种度量算法效率的方法，在计算机科学中，称为“大O”表示法，一般按最复杂的情况来判定量级。

### 时间复杂度

计算步骤：

1. 计算程序中每条语句的执行次数，并相加，得到语句的总执行次数，即语句频度或时间频度，记为T(n)
2. 用常数1取代T(n)中的所有加法常数
3. 只保留T(n)中的最高阶项
4. 如果最高阶存在且不是1，则去掉与这个项相乘的常数

::: info 常见的数量级

时间复杂度从小到大排序为：

O(1) < O(log n) < O(n) < O(n \* log n) < O(n^2) < O(n^3) < O(2^n) < O(n!)

:::

<br />

### 空间复杂度

指算法在运行过程中临时占用存储空间大小的量度。主要包括三部分：

- 存储算法本身所占用的存储空间
- 算法的输入输出数据所占用的存储空间
- 在运行过程中临时占用的存储空间

<br />

## 排序算法

常见的排序算法分为两类：

- 比较排序：排序过程中需要比较某两个元素的大小
  - 插入排序：
    - 直接插入排序
    - 希尔排序
  - 选择排序：
    - 简单选择排序
    - 堆排序
  - 交换排序：
    - 冒泡排序
    - 快速排序
  - 归并排序
- 非比较排序：主要通过其他手段排序
  - 桶排序
  - 基数排序
  - 计数排序

<br />

### 冒泡排序

> 思路：通过重复遍历待排序的列表，比较每对相邻的元素并在必要时交换它们的位置，直到整个列表有序为止。

步骤：

1. 从第一个元素开始，比较相邻的元素。如果前一个元素比后一个元素大，就交换它们的位置。
2. 对每一对相邻元素重复上述操作，从列表的开头遍历到末尾。
3. 完成一次遍历后，最大元素被“冒泡”到了列表的末尾。
4. 每次遍历时，可以忽略掉已经排好序的元素，逐渐减少遍历的范围。
5. 重复以上步骤，直到没有更多需要交换的元素为止，排序完成。

```js
function bubbleSort(arr) {
  const n = arr.length
  let swapped // 标记是否发生了交换

  // 外循环控制遍历次数，每次遍历会把一个最大元素放到末尾
  for (let i = 0; i < n - 1; i++) {
    swapped = false // 每次开始新一轮遍历时重置swapped为false

    // 内循环比较相邻元素
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 如果前一个元素大于后一个元素，交换它们的位置
        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
        swapped = true
      }
    }

    // 如果没有交换发生，说明数组已经有序，提前结束排序
    if (!swapped) {
      break
    }
  }

  return arr
}

// 示例使用
const arr = [5, 2, 9, 1, 5, 6]
console.log('排序前:', arr)
console.log('排序后:', bubbleSort(arr))
```

<br />

### 选择排序

> 思路：通过不断选择剩余部分中的最小元素（或最大元素），并将其放到已排序部分的末尾（或开头），直到整个数组排序完成。

步骤：

1. 从未排序部分中找到最小（或最大）元素。
2. 将该最小（或最大）元素与未排序部分的第一个元素交换位置。
3. 在剩余的未排序部分重复以上步骤，直到所有元素都被排序。
4. 每次选择最小元素，使其放到正确的位置，逐渐完成排序。

```js
function selectionSort(arr) {
  const n = arr.length

  // 外层循环用于遍历每个位置
  for (let i = 0; i < n - 1; i++) {
    // 假设当前未排序部分的第一个元素是最小的
    let minIndex = i

    // 内层循环遍历未排序部分，找出最小元素
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j // 更新最小元素的索引
      }
    }

    // 如果最小元素不是当前元素，交换它们的位置
    if (minIndex !== i) {
      const temp = arr[i]
      arr[i] = arr[minIndex]
      arr[minIndex] = temp
    }
  }

  return arr
}

// 示例使用
const arr = [64, 25, 12, 22, 11]
console.log('排序前:', arr)
console.log('排序后:', selectionSort(arr))
```

<br />

### 插入排序

> 思路：通过构建一个有序序列，对未排序的部分进行插入。插入排序的核心是“将当前元素插入到已排序部分的合适位置”

步骤：

1. **从第二个元素开始**，将该元素与其前面的所有元素依次比较。

2. **如果该元素小于前一个元素**，就把前一个元素向右移一个位置。

3. 直到找到一个比当前元素小的位置，将当前元素插入到该位置。

4. 重复以上步骤，直到所有元素都被插入到正确的位置。

```js
function insertionSort(arr) {
  const n = arr.length

  // 从第二个元素开始（因为第一个元素本身已经是一个有序的部分）
  for (let i = 1; i < n; i++) {
    const current = arr[i] // 当前待插入的元素
    let j = i - 1 // j是已排序部分的最后一个元素的索引

    // 在已排序部分中从右向左找到合适的位置
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j] // 将大于current的元素右移
      j-- // 移动到前一个元素
    }

    // 将当前元素插入到合适的位置
    arr[j + 1] = current
  }
  return arr
}
```

<br />

### 希尔排序

> 思路：使用**间隔**（gap）来代替直接相邻的元素进行比较和交换，通过逐步缩小间隔（从较大的间隔开始逐步缩小到1），使得排序过程中局部数据逐渐变得有序，最终达到整体有序的效果。

步骤：

1. 初始时，选择一个较大的间隔（gap）值，将待排序数组分成若干组，每组元素之间的间隔为 gap。
2. 对每组中的元素进行插入排序。
3. 然后缩小间隔（通常是按某种规则逐步减小，如 gap = gap / 2），再对新的组进行插入排序。
4. 重复以上过程，直到间隔为1，此时希尔排序就变成了一个普通的插入排序。

```js
function shellSort(arr) {
  const n = arr.length
  let gap = Math.floor(n / 2) // 初始间隔为数组长度的一半

  // 逐步减小gap，直到gap为1
  while (gap >= 1) {
    // 对每个子序列进行插入排序
    for (let i = gap; i < n; i++) {
      const current = arr[i] // 当前元素
      let j = i

      // 将当前元素插入到对应的子序列中
      while (j >= gap && arr[j - gap] > current) {
        arr[j] = arr[j - gap] // 移动元素
        j -= gap
      }

      // 插入当前元素
      arr[j] = current
    }

    // 缩小gap，通常是gap = gap / 2
    gap = Math.floor(gap / 2)
  }

  return arr
}
```

<br />

### 归并排序

> 思路：是一种分治法（Divide and Conquer）算法，采用“分而治之”的思想，将一个大问题拆分成若干个小问题进行解决，最终合并成一个有序的结果。归并排序通过递归地将数组分割成越来越小的子数组，然后合并这些子数组，以获得有序数组。

步骤：

1. **分解**：将待排序的数组从中间分成两半。
2. **递归排序**：递归地排序两个子数组。
3. **合并**：将两个已排序的子数组合并成一个有序的数组。

```js
function mergeSort(arr) {
  // 如果数组的长度小于等于1，直接返回（递归的终止条件）
  if (arr.length <= 1) {
    return arr
  }

  // 1. 将数组分成两半
  const mid = Math.floor(arr.length / 2)
  const left = arr.slice(0, mid) // 左边部分
  const right = arr.slice(mid) // 右边部分

  // 2. 递归排序左右两部分
  const sortedLeft = mergeSort(left)
  const sortedRight = mergeSort(right)

  // 3. 合并排序后的左右两部分
  return merge(sortedLeft, sortedRight)
}

// 合并两个已排序的数组
function merge(left, right) {
  const result = []
  let i = 0; let j = 0

  // 比较左右两个数组的元素，将较小的元素放入结果数组中
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i])
      i++
    }
    else {
      result.push(right[j])
      j++
    }
  }

  // 将剩余的元素添加到结果数组中
  return result.concat(left.slice(i), right.slice(j))
}

// 示例使用
const arr = [38, 27, 43, 3, 9, 82, 10]
console.log('排序前:', arr)
console.log('排序后:', mergeSort(arr))
```

<br />

### 堆排序

> 思路：

步骤：

1.

```js

```

<br />

### 快速排序

> 思路：采用了分治法（Divide and Conquer）策略，通过选择一个"基准"（pivot）元素，并通过一趟扫描将数组分成两部分，一部分比基准小，另一部分比基准大，然后递归地对这两部分进行排序。

步骤：

1. **选择基准**：从数组中选择一个元素作为基准（通常选择第一个元素、最后一个元素或随机选择一个元素）。
2. **分区**：重新排列数组，所有比基准小的元素放在基准的左边，所有比基准大的元素放在基准的右边，返回基准的索引。
3. **递归排序**：对基准左边和右边的子数组递归地执行上述步骤。

```js
function randomQuickSort(arr) {
  if (arr.length <= 1) {
    return arr
  }

  // 随机选择基准元素
  const randomIndex = Math.floor(Math.random() * arr.length)
  const pivot = arr[randomIndex]
  const left = []
  const right = []
  const middle = []

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    }
    else if (arr[i] > pivot) {
      right.push(arr[i])
    }
    else {
      middle.push(arr[i])
    }
  }

  return [...randomQuickSort(left), ...middle, pivot, ...randomQuickSort(right)]
}
```

<br />

### 计数排序

步骤：

1. **统计频率**：首先计算数组中每个元素的出现次数，并将这个频率存储在一个新的数组中。
2. **计算元素位置**：将频率数组中的元素转换为累计和数组，使每个位置存储的是小于等于该元素的所有元素的个数。
3. **排序**：根据累计和数组的值确定每个元素在排序后数组中的位置，并依次将元素放到正确的位置上。

```js
function countingSort(arr) {
  // 1. 找到数组中最大和最小的元素，确定数组范围
  const max = Math.max(...arr)
  const min = Math.min(...arr)

  // 2. 创建一个计数数组
  const countArray = new Array(max - min + 1).fill(0) // 计数数组长度为 (max - min + 1)

  // 3. 统计数组中每个元素出现的次数
  for (let i = 0; i < arr.length; i++) {
    countArray[arr[i] - min]++ // 将元素的值减去最小值作为索引
  }

  // 4. 计算计数数组的累计和
  for (let i = 1; i < countArray.length; i++) {
    countArray[i] += countArray[i - 1]
  }

  // 5. 生成排序后的结果
  const sortedArr = Array.from({ length: arr.length })

  // 从后往前遍历原数组，保持相同元素的稳定性
  for (let i = arr.length - 1; i >= 0; i--) {
    const currentElement = arr[i]
    const index = countArray[currentElement - min] - 1 // 找到元素应该放置的位置
    sortedArr[index] = currentElement
    countArray[currentElement - min]-- // 更新计数
  }

  return sortedArr
}

// 示例使用
const arr = [4, 2, 2, 8, 3, 3, 1, 5, 7, 6]
console.log('排序前:', arr)
console.log('排序后:', countingSort(arr))
```
