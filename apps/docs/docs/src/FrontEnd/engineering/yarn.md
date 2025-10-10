#### 1. 安装

```shell
npm install yarn -g
```

#### 2. 查看版本号

```shell
yarn -v
```

#### 3. 安装依赖

```shell
yarn add <pkg>		            // 局部安装
yarn global add <pkg> 				// 全局安装
```

#### 4. 卸载依赖

```shell
yarn remove <pkg>						  // 局部卸载
yarn global remove <pkg>			// 全局卸载
```

#### 5. 查看已安装的依赖

```shell
yarn global list --depth=0			// 查看全局已安装的依赖
yarn list --depth=0							// 查看局部安装的依赖
```

#### 6. 依赖更新

```shell
yarn global upgrade-interactive		// 全局依赖更新
yarn upgrade-interactive					// 局部依赖更新
```
