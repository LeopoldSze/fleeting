# Git

## HEAD & master & branch

::: tip

- 当前 commit 在哪⾥，HEAD 就在哪⾥，这是⼀个永远⾃动指向当前 commit 的引⽤，所以你永远可以⽤ HEAD 来操作当前 commit
- HEAD还可以指向一个branch，通过这个branch间接的指向某个commit；当HEAD在提交时自动向前移动的时候，会像一个拖钩一样带着所指向的branch一起移动。branch只是一个引用，删除branch也只会删除这个引用，不会删除任何的commit

:::

<br />

## git config 配置

<br />

## git tag 标签

<br />

## git cherry-pick 遴选

<br />

## git stash 贮藏

- 贮藏：`git stash`
  - 参数
    - `-u`：`--include-untracked` 的简写，表示包括未跟踪的文件也一起贮藏
- 取消贮藏：`git stash pop`

<br />

## git rebase 变基

- 定义：给你的 commit 序列重新设置基础点（也就是⽗ commit）。展开来说就是，把指定的 commit 以及它所在的 commit 串，以指定的⽬标 commit 为 基础，依次重新提交⼀次
- 语法：`git rebase 目标基础点`

```bash
# merge - 把branch分支合并到master分支
git merge branch

# rebase - 先切换到branch分支，变基到master的commit，再到master合并branch分支
git checkout branch
git rebase master
git checkout master
git merge branch
```

::: warning

rebase 后的 commit 虽然内容和 rebase 之前相同，但它们已经是不同的 commits 了。 如果直接从 master 执⾏ rebase 的话，会导致本地master的commit丢失，与远程仓库commit不同步，代码push失败

:::

::: tip

- 为了避免和远端仓库发⽣冲突，⼀般不要从 master 向其他 branch 执⾏ rebase 操作。⽽如果是 master 以外的 branch 之间的 rebase（⽐如 branch1 和 branch2 之间），就不必这么多费⼀步， 直接 rebase 就好

- rebase 是站在需要被 rebase 的 commit 上进⾏操作，这点和 merge 是不同的

:::

<br />

## git reset 重置

- 定义：⽤来重置 HEAD 以及它所指向的 branch 的位置的
- 参数：
  - `--mixed`：默认。它的⾏为是：保留⼯作⽬录，并且清空暂存区。也就是说，⼯作⽬录的修改、 暂存区的内容以及由 reset 所导致的新的⽂件差异，都会被放进⼯作⽬录。简⽽⾔之，就是「把所有差异都混合（mixed）放在⼯作⽬录中」。
  - `--hard`：会在重置 HEAD 和 branch 的同时，⼯作⽬录⾥的内容会被完全重置为和 HEAD 的新位置相同的内容。换句话说， 就是未提交的修改会被全部擦掉，不管是否放进暂存区。
  - `--soft`：会在重置 HEAD 和 branch 时，保留⼯作⽬录和暂存区中的内容，并把重置 HEAD 所带来的新的差异放进暂存区。

<br />

## git checkout 签出

- 定义：签出指定的commit，所以不⽌可以切换 branch，也可以直接指定 commit 作为参数，来把 HEAD 移动到指定的 commit
- 语法：`git checkout 目标commit`

::: warning 和reset的区别

reset 在移动 HEAD 时会带着它所 指向的 branch ⼀起移动，⽽ checkout 不会。当你⽤ checkout 指向其他地⽅的时候，HEAD 和 它所指向的 branch 就⾃动脱离了。

```bash
# 只让 HEAD 和 branch 脱离⽽不移动 HEAD
git checkout --detach
```

:::

<br />

## git flow 工作流

<br />

## 操作

### 最新commit修正

- 说明：不在当前commit上增加commit，把当前commit里的内容和暂存区里的内容合并起来后创建一个新的commit，用这个新的commit把当前commit替换掉。**对最新一条commit进行修正**。
- 语法：`git commit --amend`

```bash
# 修复完成后
git add .
git commit --amend
```

<br />

### 任意commit修正

- 说明：开启交互式变基，在 rebase 的操作执⾏之前，可以指定要 rebase 的 commit 链中的每⼀个 commit 是否需要进⼀步修改。
- 语法：`git rebase -i 目标commit`

::: details git偏移符号 ^ ~

- ^：在 commit 的后⾯加⼀个或多个 ^ 号，可以把 commit 往回偏移，偏移的数量是 ^ 的数量。例如：master^ 表示 master 指向的 commit 之前的那个 commit； HEAD^^ 表示 HEAD 所指向的 commit 往 前数两个 commit
- ~：在 commit 的后⾯加上 ~ 号和⼀个数，可以把 commit 往回偏移，偏移的数量是 ~ 号后⾯的数。例如：HEAD~5 表示 HEAD 指向的 commit往前数 5 个 commit

:::

```bash
# 例如修改倒数第二个提交
git rebase -i HEAD^^

# 2. 进入编辑界面，修改默认的pick为edit
# 3. 修改commit
git add .
git commit --amend

# 4. 修改完成后继续变基过程
git rebase --continue
```

<br />

### 撤销最新提交

- 语法：`git reset --hard HEAD^`
- 说明：恢复到父commit，但是撤销的commit不会丢失

<br />

### 撤销任意提交

<br />

#### 方法一

- 说明：交互式变基
- 语法：`git rebase -i 目标commit`

```bash
# 例如撤销倒数第二个提交
git rebase -i HEAD^^

# 2. 进入编辑界面，删除对应的commit

# 3. 修改完成后继续变基过程
git rebase --continue
```

<br />

#### 方法二

- 语法：`git rebase --onto 目标commit 起点commit 终点commit`

```bash
# 以倒数第⼆个 commit 为起点（起点不包含在 rebase 序列⾥哟），branch1 为终点，rebase 到倒数第三个 commit 上
git rebase --onto HEAD^^ HEAD^ branch1
```

<br />

### 撤销分支删除

- 语法：`git reflog [分支名称]`
- 作用：查看仓库中的引用的移动记录，如果不指定引用，会显示HEAD的移动记录；切换到指定commit，然后重新签出分支即可

```bash
git reflog

# 假如现在倒数第二次提交是分支删除前的最后一次提交，签出到此commit
git checkout HEAD^^
# 在此commit上签出新分支
git checkout -b new-branch
```

::: warning

不再被引用直接或间接指向的commits会在一定时间后被Git回收，所以找回删除的branch的操作要及时

:::

<br />

### 推送远程后修改

<br />

#### 在自己的branch上

- 说明：本地内容修改完成后，冲突可以预料到，用本地强制覆盖远程
- 语法：`git push origin 对应的分支 -f`
  - -f：`--force` 缩写，忽略冲突，强制push

<br />

#### 代码已经合并

- 语法：`git revert HEAD^`
- 说明：撤销上一次提交，增加⼀个新的提交， 把之前提交的内容抹掉。它的内容和倒数第⼆个 commit 是相反的，从⽽和倒数第⼆个 commit 相互抵消，达到撤销的效果。在 revert 完成之后，把新的 commit 再 push 上去，这个 commit 的内容就被撤销了。

<br />

<img src="https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/git.png"  />

### SSH配置

```bash
# 1.查看密钥
cd ~/.ssh   // No Such File or Directory

# 2.创建ssh
ssh-keygen -t rsa -C 'XXX@XX.com'     // 一直enter，或者添加push密码

# 3.查看生成的公钥
cd ~/.ssh
ls
cat id_rsa.pub
# or C盘，`C:\Users\Admin\.ssh\id_rsa.pub`

# 4.远程仓库添加公钥，如GitHub、Gitee 、CodeUp、 Coding

# 5.验证公钥是否正常
ssh -T gitee@gitee.com       // 码云
ssh -T git@github.com	     // github
ssh -T git@e.coding.net      // coding 码市
# Are you sure you want to continue connecting (yes/no)?     yes

# 6.clone
git clone [SSH地址]
```

#### 切换配置地址

```bash
# 从ssh切换至https
git remote set-url origin [HTTPS地址]

# 从https切换至ssh
git remote set-url origin [SSH地址]

# 查看当前是ssh还是https
git remote -v
```

如切换后出现 `remote: HTTP Basic: Access denied`

```shell
# git执行以下命令输入 git账号密码即可

git config --system --unset credential.helper
```

![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/git_3.png)

<br />

### 概念

<img src="https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/git_1.png" style="zoom: 67%;" />

![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/git_2.png)

#### 1. 版本库

- 当我们使用git管理文件时，比如 `git init` 时，这个时候，会多一个 `.git` 文件，我们把这个文件称之为版本库。
- `.git文件` 另外一个作用就是它在创建的时候，会自动创建 `master` 分支，并且将 `HEAD` 指针指向 `master` 分支。

#### 2. 工作区

- 本地项目存放文件的位置
- 可以理解成图上的 `workspace`

#### 3. 暂存区

- 顾名思义就是暂时存放文件的地方，通过是通过add命令将工作区的文件添加到缓冲区
- Git的版本库里存了很多东西，其中最重要的就是称为 `stage`（或者叫 `index`）的暂存区。 还有Git为我们自动创建的第一个分支 `master`，以及指向 `master` 的一个指针叫 `HEAD`。

<br />

### 操作

#### 1. git config

```bash
# 设置全局提交用户名及邮箱
git config --global user.name
git config --global user.email

# 查看配置
git config -l
# 查看全局配置
git config --global -l
```

<br />

#### 2. git clone

克隆远程仓库到本地

<br />

#### 3. git init

初始化版本库，已存在则重新初始化

<br />

#### 4. git status

查看文件状态

<br />

#### 5. git log

查看提交日志

<br />

#### 6. git add

添加工作区文件到暂存区

```bash
# 添加某个文件到暂存区，后面可以跟多个文件，以空格区分
git add xxx xxx

# 添加当前更改的所有文件到暂存区。
git add .

# 添加所有文件
git add --all
```

<br />

#### 7. git commit

提交暂存区文件到本地仓库

```bash
# 提交暂存的更改，会新开编辑器进行编辑
git commit

# 提交暂存的更改，并记录下备注
git commit -m "you message"

# 等同于 git add . && git commit -m
git commit -am

# 对最近一次的提交的信息进行修改,此操作会修改commit的hash值
git commit --amend
```

<br />

#### 8. git pull

```bash
# 从远程仓库拉取代码并合并到本地，可简写为 git pull 等同于 git fetch && git merge
git pull <远程主机名> <远程分支名>:<本地分支名>

# 使用rebase的模式进行合并
git pull --rebase <远程主机名> <远程分支名>:<本地分支名>

# merge操作会生成一个新的节点，之前的提交分开显示。
# 而rebase操作不会生成新的节点，是将两个分支融合成一个线性的提交。
```

<br />

#### 9. git push

推送本地仓库修改到远程仓库

<br />

#### 10. git fetch

与 `git pull` 不同的是 `git fetch` 操作仅仅只会拉取远程的更改，不会自动进行 `merge` 操作。对你当前的代码没有影响

```bash
# 获取远程仓库特定分支的更新
git fetch <远程主机名> <分支名>

# 获取远程仓库所有分支的更新
git fetch --all
```

<br />

#### 11. git branch

```bash
# 新建本地分支，但不切换
git branch <branch-name>

# 查看本地分支
git branch

# 查看远程分支
git branch -r

# 查看本地和远程分支
git branch -a

# 删除本地分支
git branch -d <branch-nane>

# 强制删除本地分支
git branch -D <branch-name>

# 重新命名分支
git branch -m <old-branch-name> <new-branch-name>
```

<br />

#### 12. git merge

```bash
# 合并其他分支到当前分支
git merge XXX
```

![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/git_merge.png)

<br />

#### 13. git rebase

![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/git_rebase.png)

`rebase` 翻译为变基，他的作用和 `merge` 很相似，用于把一个分支的修改合并到当前分支上。

但是大部分情况下，`rebase` 的过程中会产生冲突的，此时，就需要手动解决冲突，然后使用 `git add` 、`git rebase --continue` 的方式来处理冲突，完成 `rebase`；如果不想要某次 `rebase` 的结果，那么需要使用 `git rebase --skip` 来跳过这次 `rebase`。

不同于 `git rebase`的是，`git merge` 在不是 `fast-forward`（快速合并）的情况下，会产生一条额外的合并记录，类似 `Merge branch 'xxx' into 'xxx'`的一条提交信息。

```bash
# 把指定分支修改合并到当前分支
git rebase <branch-name>
```

<br />

#### 14. git cherry-pick

它会获取某一个分支的单笔提交，并作为一个新的提交引入到你当前分支上。当我们需要在本地合入其他分支的提交时，如果我们不想对整个分支进行合并，而是只想将某一次提交合入到本地当前分支上，那么就要使用 `git cherry-pick` 了。

如果出现冲突，解决冲突后进行 `git add `，接着执行 `git cherry-pick --continue`。

如果需要多个 `cherry-pick` 需要同步到目标分支，可以简写为 `git cherry-pick <first-commit-id>...<last-commit-id>`，这是一个左开右闭的区间，也就时说 `first-commit-id` 提交带来的代码的改动不会被合并过去，如果需要合并过去，可以使用 `git cherry-pick <first-commit-id>^...<last-commit-id>`，它表示包含 `first-commit-id` 到 `last-commit-id` 在内的提交都会被合并过去。

```bash
# 提交指定次提交到当前分支
git cherry-pick [commit-hash]
```

<br />

#### 15. git revert

撤销某次操作，此操作不会修改原本的提交记录，而是会新增一条提交记录来抵消某次操作。

`git revert` 也可以回滚多次的提交。

语法：`git revert [commit-id1] [commit-id2] ...` 注意这是一个前开后闭区间，即不包括 `commit1` ，但包括 `commit2` 。

`git revert` 会新建一条 `commit` 信息，来撤回之前的修改。

`git reset` 会直接将提交记录退回到指定的 `commit` 上。

想使用默认的注释，可以在命令中加上 `-n` 或者 `--no-commit`，应用这个参数会让 `revert` 改动只限于程序员的本地仓库，而不自动进行 `commit`。

```bash
# 针对普通 commit
git revert <commit-id>

# 针对 merge 的 commit
git revert <commit-id> -m
```

<br />

#### 16. git stash

```bash
# 把本地的改动暂存起来
git stash

# 执行存储时，添加备注，方便查找
git stash save "message"

# 应用最近一次暂存的修改，并删除暂存的记录
git stash pop

# 应用指定一次暂存的修改，并删除暂存的记录
git stash pop stash@{$num}

# 应用某个存储,但不会把存储从存储列表中删除，默认使用第一个存储, 即stash@{0}
git stash apply

# 如果要使用其他个
git stash apply stash@{$num}

# 查看 stash 有哪些存储
git stash list

# 丢弃stash
git stash drop
git stash drop stash@{$num}

# 删除所有缓存的 stash
git stash clear

# 查看stash
git show stash@{$num}
```

<br />

#### 17. git checkout

撤回工作区的修改，就可以使用 `git checkout -- <filename>` 的命令，如果要撤回多个文件的修改，文件之间使用空格隔开.

如果说现在我们对文件进行了修改，并且已经提交到暂存区了，这部分文件我们不想要的话，那么就可以通过 `git reset <filename>` 的命令来对特定的文件进行撤销，`git reset` 会撤回所有存在暂存区的文件

```bash
# 撤回工作区
git checkout -- <filename1> <filename2> ... <filename10>

# 撤回暂存区
git reset <filename>
```

<br />

#### 18. git switch

```bash

```

<br />

#### 19. git restore

```bash

```

<br />

#### 20. git alias

```bash
# 命令
git config --global alias.<简化的字符> 原始命令

# example
git config --global alias.co checkout
git config --global alias.ci commit
git config --global alias.br branch
```

```bash
[alias]
st = status -sb
co = checkout
br = branch
mg = merge
ci = commit
ds = diff --staged
dt = difftool
mt = mergetool
last = log -1 HEAD
latest = for-each-ref --sort=-committerdate --format=\"%(committername)@%(refname:short) [%(committerdate:short)] %(contents)\"
ls = log --pretty=format:\"%C(yellow)%h %C(blue)%ad %C(red)%d %C(reset)%s %C(green)[%cn]\" --decorate --date=short
hist = log --pretty=format:\"%C(yellow)%h %C(red)%d %C(reset)%s %C(green)[%an] %C(blue)%ad\" --topo-order --graph --date=short
types = cat-file -t
dump = cat-file -p
lg = log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```

<br />

#### 21. git flow

```bash

```

### 提交规范

```bash
git commit -m <types>(<scope>?): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

**大致分为三个部分(使用空行分割)：**

1. 标题行：必填，描述主要修改类型和内容
2. 主题内容：描述为什么修改，做了什么样的修改，以及开发的思路等等
3. 页脚注释：可以写注释，BUG 号链接

**type(必须)：**

- feat: 新功能、新特性

- fix: 修改 bug

- perf: 更改代码，以提高性能

- refactor: 代码重构（重构，在不影响代码内部行为、功能下的代码修改）

- docs: 文档修改

- style: 代码格式修改, 注意不是 css 修改（例如分号修改）

- test: 测试用例新增、修改

- build: 影响项目构建或依赖项修改

- revert: 恢复上一次提交

- ci: 持续集成相关文件修改

- chore: 其他修改（不在上述类型中的修改）

- release: 发布新版本

- workflow: 工作流相关文件修改

1. （可选）scope: commit 影响的范围, 比如: route, component, utils, build...

2. subject: commit 的概述

3. body: commit 具体修改内容, 可以分为多行.

4. footer: 一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接.

```bash
# example
git commit -m "some message" # fails
git commit -m "fix: some message" # passes
```

<br />

## 参考

> 1. [Git 原理详解及实用指南](https://juejin.cn/book/6844733697996881928/section/6844733698026242056)
> 2. [Git 官方文档](https://git-scm.com/docs)
