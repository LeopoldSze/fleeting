##### 1. 下载安装

[github](https://github.com/coreybutler/nvm-windows/releases) （安装路径不要出现中文和空格）

##### 2. 查看版本

```shell
nvm v
nvm --help        // 查看指令
```

##### 3. 查看安装的node版本

```shell
nvm list [available]
// 查看已经安装的所有nodejs版本, Type "available" at the end to see what can be installed.

nvm ls [available]										// 简写
```

##### 4. 安装指定版本的nodejs

```shell
nvm install 版本号 | latest						// 安装指定版本的nodejs
```

##### 5. 切换到指定版本

```shell
nvm use 版本号													// 切换到指定版本
```

##### 6. 卸载指定版本

```shell
nvm uninstall 版本号										// 卸载指定版本
```

##### 7. CLI 命令

1. `nvm arch` ：显示node是运行在32位还是64位。

2. `nvm install <version> [arch]` ：安装node， version是特定版本也可以是最新稳定版本latest。可选参数arch指定安装32位还是64位版本，默认是系统位数。可以添加--insecure绕过远程服务器的SSL。

3. `nvm list [available]` ：显示已安装的列表。可选参数available，显示可安装的所有版本。list可简化为ls。

4. `nvm on`：开启node.js版本管理。

5. `nvm off` ：关闭node.js版本管理。

6. `nvm proxy [url]` ：设置下载代理。不加可选参数url，显示当前代理。将url设置为none则移除代理。

7. `nvm node_mirror [url]` ：设置node镜像。默认是https://nodejs.org/dist/。如果不写url，则使用默认url。设置后可至安装目录settings.txt文件查看，也可直接在该文件操作。

8. `nvm npm_mirror [url]` ：设置npm镜像。https://github.com/npm/cli/archive/。如果不写url，则使用默认url。设置后可至安装目录settings.txt文件查看，也可直接在该文件操作。

9. `nvm uninstall <version>` ：卸载指定版本node。

10. `nvm use [version] [arch]` ：使用制定版本node。可指定32/64位。

11. `nvm root [path]` ：设置存储不同版本node的目录。如果未设置，默认使用当前目录。

12. `nvm version` ：显示nvm版本。version可简化为v。

13. nvm install // 安装指定版本，如：安装v6.2.0，可nvm install v6.2.0

    nvm uninstall //删除已安装的指定版本，语法与install类似

    nvm use //切换使用指定的版本node

    nvm ls //列出所有安装的版本

    nvm ls-remote //列出所以远程服务器的版本（官方node version list）

    nvm current //显示当前的版本

    nvm alias //给不同的版本号添加别名

    nvm unalias //删除已定义的别名

    nvm reinstall-packages //在当前版本node环境下，重新全局安装指定版本号的npm包
