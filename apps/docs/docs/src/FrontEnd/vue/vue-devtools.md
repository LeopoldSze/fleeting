**生产环境开启vue-devtools**

```js
const devtools = window.__VUE_DEVTOOLS_GLOBAL_HOOK__

// 注意全局id名称和原型链层级
const Vue = $('#app').__vue__.__proto__.__proto__.constructor

Vue.config.devtools = true

devtools.emit('init', Vue)
```
