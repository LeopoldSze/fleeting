nrm (npm registry manager) 是npm的镜像源管理工具。

##### 1. 安装

```bash
yarn global add nrm
```

##### 2. 查看

```bash
nrm ls                                                                          # * 为当前所用*npm
```

##### 3. 切换

```bash
nrm use taobao
# 切换taobao源
```

##### 4. 测速

```bash
nrm test taobao
```

##### 5. 增加

```bash
nrm add <registry> <url>
# reigstry为源名，url为源的路径
```

##### 6. 删除

```bash
nrm delete <registry>
```

##### 7. mirrors

```json
npm ---------- https://registry.npmjs.org/
yarn --------- https://registry.yarnpkg.com/
tencent ------ https://mirrors.cloud.tencent.com/npm/
cnpm --------- https://r.cnpmjs.org/
tb ----------- https://npm.taobao.org/mirrors/npm/
taobao ------- https://registry.npmmirror.com/
npmMirror ---- https://skimdb.npmjs.com/registry/
```
