### 资源模块

<br />

#### 1. asset/resource

生成单独的文件，并导出URL（资源路径）

```js
output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    clean: true,
    assetModuleFilename: 'images/[contenthash][ext]'
},

module: {
    rules: [
        {
            test: /\.png$/,
            type: 'asset/resource',
            generator: { // 优先级高于assetModuleFilename
             	filename: 'images/test[ext]'
        	}
      	}
    ]
}
```

<br />

#### 2. asset/inline

资源转换为data Url

```js
module: {
  rules: [
    {
      test: /\.svg$/,
      type: 'asset/inline',
    },
  ]
}
```

<br />

#### 3. asset/source

导出资源的源代码

```js
module: {
  rules: [
    {
      test: /\.txt$/,
      type: 'asset/source'
    }
  ]
}
```

<br />

#### 4. asset

通用资源类型，在导出一个data URL 和发送一个单独的文件之间自动选择。

```js
module: {
  rules: [
    {
      test: /\.jpg$/,
      type: 'asset', // 在resource和inline之间自动选择，默认大小8kb
      parser: {
        dataUrlCondition: {
          maxSize: 4 * 1024 * 1024 // 4M
        }
      }
    }
  ]
}
```

<br />

#### 5. parser

使用 [自定义 parser](https://webpack.docschina.org/configuration/module/#ruleparserparse) 替代特定的 webpack loader，可以将任何 `toml`、`yaml` 或 `json5` 文件作为 JSON 模块导入。

```js
const path = require('node:path')
const json5 = require('json5')
const toml = require('toml')
const yaml = require('yamljs')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      },
      {
        test: /\.toml$/i,
        type: 'json',
        parser: {
          parse: toml.parse,
        },
      },
      {
        test: /\.yaml$/i,
        type: 'json',
        parser: {
          parse: yaml.parse,
        },
      },
      {
        test: /\.json5$/i,
        type: 'json',
        parser: {
          parse: json5.parse,
        },
      },
    ],
  }
}
```

<br />

<br />

### loaders

模块 loader 可以链式调用。链中的每个 loader 都将对资源进行转换。链会逆序执行。第一个 loader 将其结果（被转换后的资源）传递给下一个 loader，依此类推。最后，webpack 期望链中的最后的 loader 返回 JavaScript。

<br />

#### 1. css-loader

应保证 loader 的先后顺序：`'style-loader'` 在前，而 `'css-loader'` 在后。如果不遵守此约定，webpack 可能会抛出错误。

这使你可以在依赖于此样式的 js 文件中 `import './style.css'`。现在，在此模块执行过程中，含有 CSS 字符串的 `<style>` 标签，将被插入到 html 文件的 `<head>` 中。

```js
module: {
  rules: [
    {
      test: /\.css/,
      use: 'css-loader'
    }
  ]
}
```

<br />

#### 2. 加载image图像

```css
.test {
  background-image: url("/assets/1.svg");
}

element.classList.add('test')
```

<br />

#### 3. 加载fonts字体

使用 `Asset Modules` 可以接收并加载任何文件，然后将其输出到构建目录。

```css
@font-face {
  font-family: 'webfont';
  src: url('/assets/webfont.ttf') format('truetype');
}

.icon {
  font-family: 'webfont', sans-serif;
  font-size: 20px;
}

```

```js
module: {
  rules: [
    {
      test: /\.(woff|woff2|eot|ttf|otf)/,
      type: 'asset/resource'
    }
  ]
}
```

<br />

#### 4. 加载数据

加载其他文件，如：JSON、CSV、TSV和XML。JSON默认内置支持，CSV、TSV要使用`csv-loader`，XML要使用 `xml-loader`。

```js
// pnpm add csv-loader xml-loader -D

module: {
  rules: [
    // 加载XML
    {
      test: /\.xml$/i,
      use: 'xml-loader'
    },
    // 加载CSV|TSV
    {
      test: /\.(csv|tsv)$/i,
      use: 'csv-loader'
    }
  ]
}
```

::: warning 注意

只有在使用 JSON 模块默认导出时会没有警告。

:::

```js
// 没有警告
import data from './data.json';

// 显示警告，规范不允许这样做。
import { foo } from './data.json';
自定义 JSON 模块 parser
```

<br />

#### 5. babel-loader

编译 ES6 代码成 ES5等低版本代码。

`babel-loader` ：在 `webpack` 里应用 `babel` 解析 ES6的桥梁

`@babel/core` ：babel 核心模块

`@babel/preset-env`：babel预设，一组babel插件的集合

```js
// pnpm add babel-loader @babel/core @babel/preset-env -D

module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
}
```

<br />

#### 6. regeneratorRuntime 插件

`regeneratorRuntime` 是 `webpack` 打包生成的全局辅助函数，由 `babel` 生成，用于兼容 `async/await` 的语法。

```js
// pnpm add @babel/runtime @babel/plugin-transform-runtime -D

module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            [
              '@babel/plugin-transform-runtime'
            ]
          ]
        }
      }
    }
  ]
}
```

<br />

<br />

### plugins

<br />

#### 1. html-webpack-plugin

简化了 HTML 文件的创建来为您的 webpack 包提供服务。 这对于在文件名中包含哈希值的 webpack 捆绑包特别有用，该哈希值会更改每次编译。 你可以让插件为你生成一个 HTML 文件，使用 lodash 模板提供你自己的模板，或者使用你自己的加载器。

```js
// pnpm add html-webpack-plugin -D

const HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [
  new HtmlWebpackPlugin({
    template: './index.html',
    filename: 'app.html',
    inject: 'body'
  })
]
```

<br />

#### 2. mini-css-extract-plugin

抽离css，该插件将 CSS 提取到单独的文件中。 它为每个包含 CSS 的 JS 文件创建一个 CSS 文件。 它支持 CSS 和 SourceMaps 的按需加载。

```js
// pnpm add mini-css-extract-plugin -D

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

plugins: [
  new MiniCssExtractPlugin({
    filename: 'styles/[contenthash].css'
  })
]
```

<br />

#### 3. css-minimizer-webpack-plugin

压缩css，这个插件使用 cssnano 来优化和缩小你的 CSS。 就像 optimize-css-assets-webpack-plugin 但使用查询字符串对源映射和资产更准确，允许缓存并在并行模式下工作。

```js
// pnpm add css-minimizer-webpack-plugin -D

const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')

optimization: {
  minimizer: [
    new CssMinimizerWebpackPlugin()
  ]
}
```

<br />

#### 4. terser-webpack-plugin

js代码压缩插件，生产环境压缩，开发环境不压缩。

```js
// pnpm add terser-webpack-plugin -D

const TerserWebpackPlugin = require('terser-webpack-plugin')

optimization: {
  minimizer: [
    new CssMinimizerWebpackPlugin(), // 压缩css
    new TerserWebpackPlugin() // 压缩js
  ]
}
```

<br />

<br />

### 代码分离

1. 入口起点：使用 `entry` 配置手动地分离代码，缺点多入口配置，共享的文件在每个包里面分别重复打包。
2. 防止重复：使用 `Entry dependencies` 或者 `SplitChunksPlugin` 去重合分离代码。
3. 动态导入：通过模块的内联函数调用来分离代码。

::: warning 注意

如果我们要在一个 HTML 页面上使用多个入口时，还需设置 `optimization.runtimeChunk: 'single'`

:::

<br />

#### 1. 入口起点

```js
// 多入口共享文件重复打包了
entry: [
    index: './src/index.ts',
    another: './src/another-module.js'
],
output: {
    filename: '[name].bundle.js'
}
```

<br />

#### 2. 防止重复

**入口依赖**

```js
entry: {
    index: {
        import: './src/index.ts',
        dependOn: 'shared'
    },
    another: {
        import: './src/another-module.js',
        dependOn: 'shared'
    },
    shared: 'lodash' // 如果有lodash模板就抽离成公共的shared chunk
}
```

<br />

**split-chunk-plugin**

此插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。

```js
entry: [
    index: './src/index.ts',
    another: './src/another-module.js'
],
optimization: {
    splitChunks: {
        chunks: 'all' // 代码分割，将公共模块抽离到单独的文件里
    }
}
```

<br />

#### 3. 懒加载

```js
// 魔法注释
import(/* webpackChunkName: 'math' */'./math.js').then(({ add }) => {
  console.log(add(4, 5))
})
```

<br />

#### 4. 预获取/预加载模块

`webpack v4.6.0+` 增加了对预获取和预加载的支持。

在声明 `import` 时，使用下面这些内置指令，可以让 `webpack` 输出 "resource hint（资源提示）"，来告知浏览器：

- prefetch(预获取)：将来某些导航下可能需要的资源。这会生成 `<link rel="prefetch" href="XX-chunk.js">` 并追加到页面头部，指示着浏览器在闲置时间预取 `xx-chunk.js` 文件。
- preload(预加载)：当前导航下可能需要的资源。

```js
// 预获取
import(/* webpackChunkName: 'math', webpackPrefetch: true */'./math').then(({ add }) => {
  console.log(add(4, 5))
})

// 预加载--类似懒加载
import(/* webpackChunkName: 'math', webpackPreload: true */'./math').then(({ add }) => {
  console.log(add(4, 5))
})
```

与 prefetch 指令相比，preload 指令有许多不同之处：

- preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
- preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
- preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。
- 浏览器支持程度不同。

<br />

<br />

### 缓存

<br />

#### 1. 输出文件的文件名

```js
output: {
  filename: '[name].[contenthash].js'
}
```

<br />

#### 2. 缓存第三方库

将第三方库(library)提取到单独的 `vendor chunk` 文件中，是比较推荐的做法，这是因为，它们很少像本地文件那样频繁修改。因此通过实现以上步骤，利用 `client` 的长效缓存机制，命中缓存来消除请求，并减少向 `server` 获取资源，同时还能保证 `client` 代码和 `server` 代码版本一致。

```js
{
    optimization: {
        moduleIds: 'deterministic',
      	runtimeChunk: 'single',
        splitChunks: {
          // 缓存第三方库
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all' // 对所有chunk做处理
            }
          }
        }
    }
}
```

<br />

#### 3. 将所有js文件放到一个文件夹中

```js
output: {
  filename: 'scripts/[name].[contenthash].js'
}
```

<br />

<br />

### 创建并暴露library

<br />

```js
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'xxx.js',
    library: {
      name: 'xx',
      type: 'umd'
    }
  }
}
```

**外部化依赖**

```js
module.exports = {
  externals: {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '-'
    }
  }
}
```

这意味着你的 library 需要一个名为 `lodash` 的依赖，这个依赖在library使用者环境中必须存在且可用。

<br />

<br />

### 拆分开发环境和生产环境

<br />

#### 1. 公共路径

`publicPath` 配置选项在各种场景中都非常有用，你可以通过它来指定应用程序中所有资源的基础路径。

- **基于环境设置**

  ```js
  output: {
    publicPath: 'http://localhost:8080/'
  }
  ```

<br />

#### 2. 环境变量

```js
module.exports = (env) => {
  console.log('env:', env) // { WEBPACK_BUNDLE: true, WEBPACK_BUILD: true, production: true }

  return {
    mode: env.production ? 'production' : 'development',
  }
}
```

<br />

#### 3. 拆分配置文件

`config` 文件夹下新增 `dev.js` & `prod.js`

<br />

#### 4. npm 脚本

```json
"scripts": {
    "dev": "webpack serve -c ./config/dev.js",
    "build": "webpack -c ./config/prod.js"
  }
```

去掉生产环境打包体积太大警告

```js
performance: {
  hints: false
}
```

<br />

#### 5. 提取公共配置

将开发部分和生产环境配置文件中重复的代码单独提取到一个文件里。创建 `webpack.config.common.js`

```js
const path = require('node:path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const json5 = require('json5')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const toml = require('toml')
const yaml = require('yaml')

module.exports = {
  entry: {
    main: './src/main.js',
    another: './src/another.js'
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    clean: true,
    assetModuleFilename: 'images/[contenthash][ext]',
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'app.html',
      inject: 'body'
    }),

    new MiniCssExtractPlugin({
      filename: 'styles/[contenthash].css'
    })
  ],

  module: {
    rules: [
      {
        test: /\.png$/,
        type: 'asset/resource',
        generator: { // 优先级高于assetModuleFilename
          filename: 'images/test[ext]'
        }
      },
      {
        test: /\.svg$/,
        type: 'asset/inline',
      },
      {
        test: /\.txt$/,
        type: 'asset/source'
      },
      {
        test: /\.jpg$/,
        type: 'asset', // 在resource和inline之间自动选择，默认大小8kb
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 * 1024
          }
        }
      },
      // 加载css/less
      {
        test: /\.(css|less)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
      // 加载字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)/,
        type: 'asset/resource'
      },
      // 加载XML
      {
        test: /\.xml$/i,
        use: 'xml-loader'
      },
      // 加载CSV|TSV
      {
        test: /\.(csv|tsv)$/i,
        use: 'csv-loader'
      },
      // 加载toml
      {
        test: /\.toml$/i,
        type: 'json',
        parser: {
          parse: toml.parse
        }
      },
      // 加载yaml
      {
        test: /\.yaml$/i,
        type: 'json',
        parser: {
          parse: yaml.parse
        }
      },
      // 加载json5
      {
        test: /\.json5$/i,
        type: 'json',
        parser: {
          parse: json5.parse
        }
      },
      // babel编译ES6
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-runtime'
              ]
            ]
          }
        }
      }
    ]
  },

  optimization: {
    // 代码分割，公共模块拆分
    splitChunks: {
      // chunks: 'all',
      // 缓存第三方库
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all' // 对所有chunk做处理
        }
      }
    }
  }
}
```

```js
// pnpm add webpack-merge -D

// 合并配置
const { merge } = require('webpack-merge')

const commonConfig = require('./common')
const devConfig = require('./dev')
const prodConfig = require('./prod')

module.exports = (env) => {
  switch (true) {
    case env.development:
      return merge(commonConfig, devConfig)

    case env.production:
      return merge(commonConfig, prodConfig)

    default:
      return new Error('未找到对应的配置文件')
  }
}
```

<br />

#### 6. source-map

| 模式                                   | 解释                                                                                                      |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| eval（开发环境默认）                   | 每个module会封装到 eval 里包裹起来执行，并且会在末尾追加注释 // @sourceURL                                |
| source-map                             | 生成一个 SourceMap 文件                                                                                   |
| hidden-source-map                      | 和source-map一样，但不会在 bundle 末尾追加注释                                                            |
| inline-source-map                      | 生成一个DataUrl 形式的 SourceMap 文件                                                                     |
| eval-source-map                        | 每个 module 会通过 eval() 来执行，并且生成一个DataURL 形式的 SourceMap                                    |
| cheap-source-map                       | 生成一个没有列信息（column-mappings）的 SourceMap 文件，不包含 loader 的SourceMap（譬如babel的SourceMap） |
| cheap-module-source-map (开发环境推荐) | 生成一个没有列信息（column-mappings）的 SourceMap 文件，同时 loader 的SourceMap 也被简化为只包含对应行的  |

要注意的是，生产环境我们一般不会开启 `SourceMap` 功能，主要有两点原因：

1. 通过 `bundle` 和 `sourcemap` 文件，可以反编译出源码，意味着有暴露源码的风险。
2. `sourcemap` 文件体积相对比较巨大。

##### 8. devServer

```js
devServer: {
    static: path.resolve(__dirname, './dist'),
    compress: true, // 服务端启动代码压缩
    port: 3000,
    host: '0.0.0.0', // 设置局域网主机可访问
    // 响应头
    headers: {
      'X-Access-Token': 'abc123'
    },
    // http2: true, // 是否开启http2
    // 代理
    proxy: {
      '/api': 'http://localhost:9000'
    },
    // 代替路由404
    historyApiFallback: true
  }
```

##### 9. 模块热替换与热加载

> 模块热替换：(HMR: hot module replacement) 功能会在程序运行过程中，替换、添加或删除模块，而无需重新加载整个页面。

```js
// 热替换
devServer: {
    hoot: true
}

// 手动模块判断
if (module.hot) {
    module.hot.accept('./xxx.js', () => {
        ...
    })
}

// 热加载
devServer: {
    liveReload: true // 默认为true
}
```

##### 10. ESlint

```js
// pnpm add eslint -D
// npx eslint --init

module: {
  rules: [
    {
      test: /\.js$/,
      exclude: [/node_modules/, /dist/],
      use: ['babel-loader', 'eslint-loader']
    }
  ]
}
```

#### 8. 模块与依赖

##### 1. 模块解析

webpack 通过 `Resolvers` 实现了模块之间的依赖和引用。resolver 帮助 webpack 从每个 require/import 语句中，找到需要引入到 bundle 中的模块代码。当打包模块时，webpack 使用 enhanced-resolve 来解析文件路径。webpack 基于此进行 treeshaking。

```js
resolve: {
    // 别名
    alias: {
        '@': path.resolve(__dirname, './src')
    },
    // 默认文件类型，优先级按照数组顺序
    extensions: ['.js', '.json', '.vue']
}
```

##### 2. 外部扩展

```js
externalType: 'script'，
externals: {
    jquery: ['http://xxxxx', '$']
}
```

##### 3. 依赖图

```js
// pnpm add webpack-bundle-analyzer -D
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

plugins: [
  new BundleAnalyzerPlugin()
]
```

#### 9. 扩展功能

##### 1. PostCSS 与 CSS 模块

```js
// pnpm add autoprefixer postcss-loader postcss-nested -D

// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}

// webpack.config.js
module: {
  rules: [
    // 加载css
    {
      test: /\.css$/,
      use: ['style-loader', {
        loader: 'css-loader',
        options: {
          modules: true // 开启css模块
        }
      }, 'postcss-loader']
    }
  ]
}
```

##### 2. TypeScript

```js
// pnpm add typescript ts-loader -D
// tsc --init
// rootDir: xx
// outDir: xx

module: {
  rules: [
    {
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }
  ]
}
```

##### 3. index.html 模板配置

```js
// index.html
<title><%= htmlWebpackPlugin.options.title %></title>

plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
       title: '测试',
      inject: 'body'
    })
  ]
```

##### 4. 多页面配置

```js
plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'chanel1/index.html',
      title: '测试1',
      inject: 'body',
      chunks: ['main1', 'lodash'],
      publicPath: 'http://www.a.com'
    }),
    new HtmlWebpackPlugin({
      template: './index2.html',
      filename: 'chanel2/index2.html',
      title: '测试2',
      inject: 'body',
      chunks: ['main2', 'lodash'],
      publicPath: 'http://www.b.com'
    })
],
entry: {
    main1: {
        import: ['./src/app2.js', './src/app.js'],
        dependOn: 'lodash',
        filename: 'chanel1/[name].js'
    },
    main2: {
        import: ['./src/app3.js'],
        dependOn: 'lodash',
        filename: 'chanel2/[name].js'
    },
    lodash: {
        import: 'lodash',
        filename: 'common/[name].js'
    }
}
```

##### 5. tree-shaking

```js
optimization: {
  usedExports: true
}
```

##### 6. sideEffects

```json
// package.json

"sideEffects": ["*.css", "*.global.js"] // 只打包xx.css文件和xxx.global.js 文件
```

##### 7. PWA

```js
devServer: {
  devMiddleware: {
    writeToDisk: true
  }
}
```

1. 添加 `workbox-webpack-plugin`

2. 修改 `webpack.config.js`

   ```js
   // pnpm add workbox-webpack-plugin -D

   const WorkboxPlugin = require('workbox-webpack-plugin')

   module.exports = {
     plugins: [
       new WorkboxPlugin.GenerateSW({
         clientsClaim: true, // 启用service-worker
         skipWaiting: true
       })
     ]
   }
   ```

3. 注册 `Service Worker`

   ```js
   if ('serviceWorker' in navigator) {
     window.addEventListener('load', () => {
       navigator.serviceWorker.register('/service-worker.js')
         .then((registration) => {
           console.log('SW 注册成功：', registration)
         })
         .catch((error) => {
           console.log('SW 注册失败：', error)
         })
     })
   }
   ```

##### 8. shimming-全局预置变量

```js
plugins: [
  new webpack.ProvidePlugin({
    _: 'lodash'
  })
]
```

##### 9. 细颗粒度Shimming

```js
// pnpm add imports-loader -D

module: {
  rules: [
    {
      test: require.resolve('./src/index.ts'),
      use: 'imports-loader?wrapper=window'
    }
  ]
}

// index.ts
this.alert('hello, webpack')
```

##### 10. 全局导出 exports

```js
// pnpm add exports-loader -D

module: {
  rules: [
    {
      test: require.resolve('./src/third-global.js'),
      use: 'exports-loader?type=commonjs&exports=file,multiple|helpers.parse|parse'
    }
  ]
}

// index.ts
const { file, parse } = require('./third-global') // 给第三方模块添加导出
```

##### 11. 构建library

```js
output: {
    filename: 'mylib.js',
    library: {
        name: 'mylib',
        type: 'commonjs/moudle/umd'
    }
}
```

#### 10. 模块联邦

```js
// nav
const { ModuleFederationPlugin }  = require('webpack').container

module.exports = {
    plugins: [
        new ModuleFederationPlugin({
            name: 'nav',
            filename: 'remoteEntry.js',
            remotes: {},
            exposes: {
                './Header': './src/Header.js'
            },
            shared: {}
        })
    ]
}

// home
const { ModuleFederationPlugin }  = require('webpack').container

module.exports = {
    plugins: [
        new ModuleFederationPlugin({
            name: 'home',
            filename: 'remoteEntry.js',
            remotes: {
                nav: 'nav@http://localhost: 3003/remoteEntry.js'
            },
            exposes: {},
            shared: {}
        })
    ]
}

// home/index.ts
import('nav/Header').then(Header => {
    const div = document.createElement('div')
    div.appendChild(Header.default)
})
```

#### 11. 构建优化

1. 通用环境
   - 将依赖更新到最新
   - 将 `loader` 应用于最少数量的必要模块
   - 引导（bootstrap）：每个额外的 `loader/plugin` 都有其启动时间，尽量少的使用工具。
   -
2. 开发环境
3. 生产环境
