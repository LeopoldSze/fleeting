# MySQL

## 下载安装

1. 下载地址：[MySQL-Community](https://dev.mysql.com/downloads/mysql/) (推荐LTS版)
2. 双击安装，选择 `Custom Setup`，可以更改安装位置，然后等待安装完成
3. 通过 `MySQL Configurator` 配置，端口号默认3306，设置管理员root密码，配置Windows服务名称
4. 然后一直下一步，到 `Apply Configuration` 这一步选择 `Execute`等待执行完成，就安装成功

::: info 配置环境变量

1. 如果命令行中无法识别mysql命令，需要配置环境变量
2. 定义系统变量 `MYSQL_HOME` : `C:\App\MySQL\MySQL Server 8.4`，目录为 bin目录上一级
3. 修改系统变量 `Path`，增加 `%MYSQL_HOME%\bin`

:::

::: info win启动服务

1. 图形化方式：打开服务，找到安装时配置的MySQL服务名称，点击启动
2. 命令行方式：`net start MySQL服务名称` ，`net stop MySQL服务名称`

:::

<br />

## 命令行使用

1. 打开命令行工具
2. 连接MySQL服务：`mysql -u <username> -p`，默认连接本机3306
3. 查看版本：`select version();`
4. 退出连接：`exit;`

::: tip SQL注释

- 单行注释：`#注释内容` 或者 `-- 注释内容`
- 多行注释：`/* 注释内容 */`

:::

<br />

## 数据定义语言DDL

> 关键字：`CREATE`(创建)、`ALTER`(修改)、`DROP`(删除)

### 创建库

| 命令                                                                                               | 说明                                   |
| -------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `CREATE DATABASE 数据库名;`                                                                        | 创建数据库，使用默认的字符集和排序方式 |
| `CREATE DATABASE IF NOT EXISTS 数据库名;`                                                          | 判断并创建默认字符集库(推荐)           |
| `CREATE DATABASE 数据库名 CHARACTER SET 字符集;`<br />`CREATE DATABASE 数据库名 COLLATE 排序规则;` | 创建指定字符集库或者排序方式           |
| `CREATE DATABASE 数据库名 CHARACTER SET 字符集 COLLATE 排序规则;`                                  | 创建指定字符集库和排序规则库           |
| `SHOW VARIABLES LIKE 'CHARACTER_SET_DATABASE';`                                                    | 查询数据库字符集                       |
| `SHOW VARIABLES LIKE 'COLLATION_DATABASE';`                                                        | 查询数据库排序方式                     |

::: info MySQL8默认值

- 字符集：`utf8mb4`，是一种广泛支持各种语言字符的字符集
- 排序规则：`utf8mb4_0900_ai_ci`，是一种不区分大小写的排序规则；可选`utf8mb4_0900_as_cs`，区分大小写

:::

<br />

### 查看&使用库

| 命令                             | 说明               |
| -------------------------------- | ------------------ |
| `SHOW DATABASES;`                | 查看当前所有库     |
| `SELECT DATABASE();`             | 查看当前使用库     |
| `SHOW TABLES FROM 数据库名;`     | 查看指定库下所有表 |
| `SHOW CREATE DATABASE 数据库名;` | 查看创建库的信息   |
| `USE 数据库名;`                  | 切换库/选中库      |

<br />

### 修改&删除库

> 注意：没有修改数据库名的命令，可以先备份数据，然后新建库再添加数据

| 命令                                                             | 说明                   |
| ---------------------------------------------------------------- | ---------------------- |
| `ALTER DATABASE 数据库名 CHARACTER SET 字符集;`                  | 修改字符集             |
| `ALTER DATABASE 数据库名 COLLATE 排序方式;`                      | 修改排序方式           |
| `ALTER DATABASE 数据库名 CHARACTER SET 字符集 COLLATE 排序方式;` | 修改字符集和排序方式   |
| `DROP DATABASE 数据库名;`                                        | 直接删除库             |
| `DROP DATABASE IF EXISTS 数据库名`                               | 判断是否存在，再删除库 |

<br />

### 创建表

> 核心：指定表名、指定列名、指定列类型
>
> 可选：指定列约束、指定表配置、指定表和列的注释

```sql
CREATE TABLE [IF NOT EXISTS] 表名 (
 列名 类型 [列可选约束],
 列名 类型 [列可选约束] [COMMENT '列可选注释'],
 [列可选约束]
)[表可选约束][COMMENT '表可选注释'];

#example
CREATE TABLE IF NOT EXISTS books (
	book_name VARCHAR(20) COMMENT '图书名称',
	book_price DOUBLE(4,1) COMMENT '图书价格',
	book_num int COMMENT '图书数量'
) CHARSET = utf8mb4 COMMENT '这是一个图书表';
```

<br />

### 整型

> 标准整型：`INTEGER`(int)、`SMALLINT`
>
> MySQL整型：`TINYINT`、`MEDIUMINT`、`BIGINT`
>
> 注意：无符号=无负号，整数类型都可以添加 `UNSIGNED` 修饰符，添加以后对应列数据变成无负号类型，值从0开始

| 类型      | 存储(字节) | 最小值有符号 | 最小值无符号 | 最大值有符号 | 最大值无符号 |
| --------- | ---------- | ------------ | ------------ | ------------ | ------------ |
| TINYINT   | 1          | -128         | 0            | 127          | 255          |
| SMALLINT  | 2          | -32768       | 0            | 32767        | 65535        |
| MEDIUMINT | 3          | -8388608     | 0            | 8388607      | 16777215     |
| INT       | 4          | -2147483648  | 0            | 2147483647   | 4294967295   |
| BIGINT    | 5          | -2^63        | 0            | 2^63 - 1     | 2^64 - 1     |

<br />

### 浮点型

> 注意：从8.0.17开始，不推荐使用此非标志语法；支持 `UNSIGINED` 修饰，只保留正值范围，负值不会迁移到正值

| 类型        | 存储(字节) | M(小数+整数位数) | D(小数位数) |
| ----------- | ---------- | ---------------- | ----------- |
| FLOAT(M,D)  | 4          | M最大为24        | D最大为8    |
| DOUBLE(M,D) | 8          | M最大为53        | D最大为30   |

<br />

### 定点数

> 概述：精度更高，推荐使用，不会丢失精度

| 类型    | 存储(字节) | M(小数+整数位数) | D(小数位) |
| ------- | ---------- | ---------------- | --------- |
| DECIMAL | 动态计算   | M最大为65        | D最大为30 |

<br />

### 字符串型

> 注意：CHAR一般需要预先定义字符串长度，如果不指定M，则表示长度默认是1个字符，是固定长度，字符串小于固定长度会在尾部填充空格

| 字符串     | 特点     | 长度 | 范围                                                | 存储空间                  |
| ---------- | -------- | ---- | --------------------------------------------------- | ------------------------- |
| CHAR(M)    | 固定长度 | M    | 0 <= M <= 255                                       | M\*4个字节(utf8mb4)       |
| VARCHAR(M) | 可变长度 | M    | 一行数据最多65535字节(除了TEXT、BLOBS)，约16383字符 | (M\*4 + 1)个字节(utf8mb4) |

<br />

### 文本类型

> 概述：不需要预先定义长度，一行数据没有长度限制

| 类型       | 特点               | 长度(字符) | 存储范围(字节)       | 占用的存储空间       |
| ---------- | ------------------ | ---------- | -------------------- | -------------------- |
| TINYTEXT   | 小文本、可变长度   | L          | 0 <= x <= 255        | L + 2 个字节         |
| TEXT       | 文本、可变长度     | L          | 0 <= x <= 65535      | L + 2 个字节         |
| MEDIUMTEXT | 中等文本、可变长度 | L          | 0 <= x <= 16777215   | L + 3 个字节         |
| LONGTEXT   | 大文本、可变长度   | L          | 0 <= x <= 4294967295 | L + 4 个字节(最大4G) |

::: tip

- 短文本，固定长度使用CHAR，如：性别、手机号
- 短文本，非固定长度使用VARCHAR，如：姓名、地址
- 大文本，建议存储到文本文件，使用VARCHAR记录文件地址，不使用TEXT，直接存储大文件性能很差

:::

<br />

### 时间类型

| 类型      | 名称     | 字节 | 日期格式            | 最小值              | 最大值              |
| --------- | -------- | ---- | ------------------- | ------------------- | ------------------- |
| YEAR      | 年       | 1    | YYYY \| YY          | 1901                | 2155                |
| TIME      | 时间     | 3    | HH:mm:SS            | -838:59:59          | 838:59:59           |
| DATE      | 日期     | 3    | YYYY-MM-DD          | 1000-01-01          | 9999-12-03          |
| DATETIME  | 日期时间 | 8    | YYYY-MM-DD HH:mm:SS | 1000-01-01 00:00:00 | 9999-12-31 23:59:59 |
| TIMESTAMP | 日期时间 | 4    | YYYY-MM-DD HH:mm:SS | 1970-01-01 00:00:00 | 2038-01-19 03:14:07 |

::: tip 自动初始化和更新

- `ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
- `dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`

:::

<br />

### 修改表

| 命令                                                                          | 说明                              |
| ----------------------------------------------------------------------------- | --------------------------------- |
| `ALTER TABLE 表名 ADD 字段名 字段类型 [FIRST or AFTER 字段名];`               | 新增列                            |
| `ALTER TABLE 表名 CHANGE 原字段名 字段名 新字段类型 [FIRST or AFTER 字段名];` | 修改列名                          |
| `ALTER TABLE 表名 MODIFY 字段名 新字段类型 [FIRST or AFTER 字段名];`          | 修改列类型                        |
| `ALTER TABLE 表名 DROP 字段名;`                                               | 删除列                            |
| `ALTER TABLE 表名 RENAME [TO] 新表名;`                                        | 修改表名                          |
| `DROP TABLE [IF EXISTS] 表名 表1,表2,...;`                                    | 删除表(不可回滚)                  |
| `TRUNCATE TABLE 表名;`                                                        | 清空表数据+删除关联记录(不可回滚) |

<br />

## 数据操纵语言DML

> 概述：主要作用是插入、更新、删除，不影响表结构，影响数据库数据
>
> 关键字：`INSERT`、`UPDATE`、`DELETE`

### 插入数据

| 命令                                                           | 说明                   |
| -------------------------------------------------------------- | ---------------------- |
| `INSERT INTO 表名 VALUES(value1,value2...);`                   | 为一行所有字段插入数据 |
| `INSERT INTO 表名(列名1,列名2...) VALUES(value1,value2...);`   | 为一行指定字段插入数据 |
| `INSERT INTO 表名 VALUES(value1,value2...),(value1,value2...)` | 同时插入多行数据       |

<br />

### 修改数据

| 命令                                             | 说明                       |
| ------------------------------------------------ | -------------------------- |
| `UPDATE 表名 SET 列名 = value, 列名 = value...;` | 更新所有行数据字段         |
| `UPDATE 表名 SET 列名 = value where condition;`  | 根据条件更新对应行数据字段 |

<br />

### 删除数据

| 命令                                | 说明                     |
| ----------------------------------- | ------------------------ |
| `DELETE FROM 表名;`                 | 删除表中所有行数据       |
| `DELETE FROM 表名 WHERE CONDITION;` | 删除表中符号条件的行数据 |

<br />

## 数据查询语言DQL

| 命令                                                  | 说明                                       |
| ----------------------------------------------------- | ------------------------------------------ |
| `SELECT 列名1,列名2.. FROM 表名 WHERE CONDITION;`     | 条件查询表中的某些列                       |
| `SELECT 表名.列名, 表名.*, ... FROM 表名;`            | 查询表中的某些列(多表)                     |
| `SELECT 列名1 AS 别名1, 列名2 AS 别名2... FROM 表名;` | 查询列并别名                               |
| `SELECT 列名1 别名1，列名2 别名2... FROM 表名;`       | 查询列并别名                               |
| `SELECT DISTINCT 列名... FROM 表名;`                  | 查询列并去重重复行                         |
| `SELECT 'XX' AS 新列名, 列名... FROM 表名;`           | 查询常数，即新造了一条固定列，实际并不存在 |

### 算术运算符

> 概述：主要用于数学运算，运算表达式可以用在 SELECT 列位置或者where条件后

| 运算符     | 描述     |
| ---------- | -------- |
| `% \| MOD` | 取余     |
| `*`        | 乘法     |
| `+`        | 加法     |
| `-`        | 减法     |
| `/`        | 浮点除法 |
| `DIV`      | 整数除法 |

<br />

### 比较运算符

> 概述：结果为1、0、null，1代表true，0和null代表false

| 运算符                   | 描述                     |
| ------------------------ | ------------------------ |
| `>`                      | 大于                     |
| `>=`                     | 大于等于                 |
| `<`                      | 小于                     |
| `<=`                     | 小于等于                 |
| `<>` `!=`                | 不相等，后者非标准       |
| `=`                      | 相等，不能做NULL值比较   |
| `<=>`                    | NULL安全等于(非标准)     |
| `IS NULL`                | NULL值测试               |
| `IS NOT NULL`            | NOT NULL 值测试          |
| `BETWEEN .. AND ..`      | 是否在范围内             |
| `NOT BETWEEN .. AND ...` | 是否不在范围内           |
| `IN()`                   | 是否在一组值中           |
| `NOT IN()`               | 是否不在一组值中         |
| `LIKE`                   | 简单的匹配模式(模糊等于) |
| `NOT LIKE`               | 否定简单的匹配模式       |

<br />

### 逻辑运算符

| 运算符       | 描述     |
| ------------ | -------- |
| `AND \| &&`  | 逻辑与   |
| `NOT \| !`   | 逻辑非   |
| `OR \| \|\|` | 逻辑或   |
| `XOR`        | 逻辑异或 |

<br />

### 单行&多行函数

- 单行函数：数值函数、日期函数、字符函数、流程函数、信息函数、时间函数，对一行中的某列操作函数，返回结果是单一值
- 多行函数：聚合函数，对多行中的某列操作函数，返回结果是单一值

| 数值函数              | 用法                                                              |
| --------------------- | ----------------------------------------------------------------- | ------------------------------ |
| `ABS(X)`              | 返回绝对值                                                        |
| `SIGN(X)`             | 返回符号，正数返回1，负数返回-1，0返回0                           |
| `PI()`                | 返回圆周率的值                                                    |
| `CEIL(X)              | CEILING(X)`                                                       | 返回大于或等于某个值的最小整数 |
| `FLOOR(X)`            | 返回小于或等于某个值的最大整数                                    |
| `LEAST(E1, E2...)`    | 返回列表中的最小值                                                |
| `GREATEST(E1, E2...)` | 返回列表中的最大值                                                |
| `MOD(X, Y)`           | 返回x除以Y后的余数                                                |
| `RAND()`              | 返回0~1的随机值                                                   |
| `RAND(X)`             | 返回0~1的随机值，其中x的值用作种子值，相同的x值会产生相同的随机数 |
| `ROUND(X)`            | 返回一个对x的值进行四舍五入后，最接近x的整数                      |
| `ROUND(X, Y)`         | 返回一个对x的值进行四舍五入后最近x的值，并保留到小数点后面y位     |
| `TRUNCATE(X, Y)`      | 返回数字x截断为y位小数的结果                                      |
| `SQRT(X)`             | 返回x的平方根，当x为负数时，返回NULL                              |

| 字符函数                          | 用法                                                                                    |
| --------------------------------- | --------------------------------------------------------------------------------------- | ---------- |
| `CHAR_LENGTH(str)`                | 返回字符串的字符数，作用与 `CHARACTER_LENGTH(str)` 相同                                 |
| `LENGTH(str)`                     | 返回字符串的字节数，和字符集有关                                                        |
| `CONCAT(str1, str2...)`           | 连接多个字符串为1个字符串                                                               |
| `INSERT(str, index, len, repStr)` | 将字符串从index位置开始，len个长度的子串替换为repStr                                    |
| `REPLACE(str, a, b)`              | 用字符串b替换字符串中所有出现的字符串a                                                  |
| `UPPER(str)                       | UCASE(str)`                                                                             | 转大写字母 |
| `LOWER(str)                       | LCASE(str)`                                                                             | 转小写字母 |
| `LEFT(str, n)`                    | 返回字符串最左边的n个字符                                                               |
| `RIGHT(str, n)`                   | 返回字符串最右边的n个字符                                                               |
| `TRIM(str`)`                      | 去除字符串开头与结尾空格                                                                |
| `SUBSTR(str，index, len)`         | 从index位置开始截取len个字符，与 `SUBSTRING(str, n, len)` 、`MID(str, n, len)` 作用相同 |
| `FIND_IN_SET(str1, str2)`         | 返回str1在str2中出现的位置，str2是一个以逗号分隔的字符串                                |
| `REVERSE(str)`                    | 反转字符串                                                                              |
| `NULLIF(value1, value2)`          | 比较两个字符串，如果相等则返回NULL，否则返回value1                                      |

| 时间函数           | 用法                       |
| ------------------ | -------------------------- | -------------------------- | ---------------- |
| `CURDATE()         | CURRENT_DATE()`            | 返回当前日期，只包含年月日 |
| `CURTIME()         | CURRENT_TIME()`            | 返回当前时间，只包含时分秒 |
| `NOW()             | SYSDATE()`                 | 返回当前系统日期和时间     |
| `UTC_DATE()`       | 返回UTC日期                |
| `UTC_TIME()`       | 返回UTC时间                |
| `YEAR(date)        | MONTH(date)                | DAY(date)`                 | 返回具体的日期值 |
| `HOUR(time)        | MINUTE(time)               | SECOND(time)`              | 返回具体的时间值 |
| `MONTHNAME(date)`  | 返回月份，January。。。    |
| `DAYNAME(date)`    | 返回星期几，Monday。。。   |
| `WEEKDAY(date)`    | 返回周几，周一是0，周日是6 |
| `QUARTER(date)`    | 返回季度，1~4              |
| `WEEK(date)        | WEEKOFYEAR(date)`          | 返回一年中的第几周         |
| `DAYOFYEAR(date)`  | 返回一年中的第几天         |
| `DAYOFMONTH(date)` | 返回所在月份的第几天       |
| `DAYOFWEEK(date)`  | 返回周几，周日是7，周六是7 |

| 流程函数                                                                        | 用法                                            |
| ------------------------------------------------------------------------------- | ----------------------------------------------- |
| `IF(condition, true_value, false_value)`                                        | 条件成立时，返回true_value，否则返回false_value |
| `IFNULL(column, null_value)`                                                    | 当指定列column值为null，取null_value作为结果    |
| `CASE WHEN condition1 THEN result1... ELSE default_result END [AS alias_name]`  | 用于实现多条件判断                              |
| `CASE expr WHEN value1 THEN result1... ELSE default_result END [AS alias_name]` | 将表达式或列名，逐个与子句的值进行比较          |

| 多行函数    | 用法                         |
| ----------- | ---------------------------- | --- | ----------------------------------- | --- | ---------------------------- |
| `AVG(列名)` | 计算某一列的平均值(数值类型) |
| `SUM(列名)` | 计算某一列的和(数值类型)     |
| `MIN(列名)` | 计算某一列的最小值           |
| `MAX(列名)` | 计算某一列的最大值           |
| `COUNT(列名 | \*                           | 1)` | 列名参数统计当前列非NULL行记录；`\* |     | 1`参数统计所有列非NULL行记录 |

> 注意：多行函数不能聚合使用

<br />

### 分组查询

> 概述：先将数据行，按照某一或者多特性列进行分组，最后查询每组的特性，分组查询的结果只能是分组特性列或者聚合函数

```sql
SELECT 分组列,分组列,聚合函数...
FROM 表名
[WHERE 分组前条件]
[GROUP BY 分组列,分组列... HAVING 分组后条件]
```

<br />

### 排序查询

> 概述：按照某一或者多特性列进行数据排序，不会影响结果条数，只是改变结果排序
>
> 排序：`ASC` 为正序(默认值)，`DESC` 为倒序
>
> 注意：只有前一排序列相同，后面的排序列才会依次生效

```sql
SELECT 列,列... 函数
FROM 表名
[WHERE 条件]
[ORDER BY 排序列 ASC|DESC, 排序列 ASC|DESC...]
```

<br />

### 分页查询

> 概述：将结果，进行分页切割，按照指定的区域一段一段的展示
>
> 位置偏移量：可选，不写默认是0，表示不偏移
>
> 行数：指示返回的记录条数

```sql
SELECT 列,列.. 函数
FROM 表名
[WHERE 条件]
[LIMIT [位置偏移量,] 行数]
```

<br />

### 执行顺序

```sql
SELECT ...
FROM ...
WHERE 多表的连接条件
AND 不包含组函数的过滤条件
GROUP BY ...
HAVING 包含组函数的过滤条件
ORDER BY ... ASC | DESC
LIMIT ...
```

- 关键字顺序：`SELECT...FROM...WHERE...GROUP BY...HAVING...ORDER BY...LIMIT...`
- SELECT语句执行顺序：`FROM -> WHERE -> GROUP BY -> HAVING -> SELECT的字段 -> ORDER BY -> LIMIT`

<br />

## 数据库约束

> 概述：表级别的规定，数据的限制语法，确保表数据的准确性、可靠性、正确性
>
> 添加时机：创建表时直接添加或者创建表之后通过 `ALTER TABLE` 添加

分类：

- 域(列)级约束：只对当前列值有效果

  - `NOT NULL`：非空约束
  - `NULL` 或者不写：没有非空约束

  - `DEFAULT`：默认值约束，不能添加到唯一或者主键约束上

  - `CHECK(表达式)`：检查约束，属于表级别，不用添加到列后

- 实体(行)约束：需要对比同一表中其他行数据才有效果

  - `PRIMARY KEY`：主键约束，主键唯一且不为空约束，主键 + 主键约束会创建主键索引，提升查询效率，建议每个表都创建主键

  - `UNIQUE`：唯一约束，限制列可以为NULL，但是必须有值且唯一，一个表可以有多个列组合唯一，唯一约束名默认是列名

  - `AUTO_INCREMENT`：自增长约束，数字类型字段插入数据自增长，只能添加到主键或者唯一键列，每张表只能有一个自增长约束；设置0或NULL会自增长赋值，设置非空整型将设置此值。

```sql
# UNIQUE 约束
# 添加
create table 表名(
	列名 数据类型 unique [key],
  ...
);

create table 表名(
	列名 数据类型,
  [constraint 约束名] unique key(列名,列名...)
);

# 修改
alter table 表名 add constraint 约束名 unique(列名,列名...);

# 删除
# 查看约束
SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = '库名' AND TABLE_NAME = '表名';
# 删除约束
ALTER TABLE 表名 DROP CONSTRAINT 约束名;
```

```sql
# PRIMARY 约束
# 添加
CREATE TABLE 表名 (
	列名 数据类型 PRIMARY KEY,
  ...
);
CREATE TABLE 表名 (
	列名 数据类型,
  ...
  [constraint 约束名] PRIMARY KEY(列名,列名...)
);

# 修改
ALTER TABLE 表名 ADD PRIMARY KEY(列名,列名...);

# 删除
ALTER TABLE 表名 DROP PRIMARY KEY;
```

```sql
# AUTO_INCREMENT 约束
# 添加
CREATE TABLE 表名 (
	列名 数据类型 PRIMARY KEY AUTO_INCREMENT
);
CREATE TABLE 表名 (
	列名 数据类型 UNIQUE KEY AUTO_INCREMENT
)

# 修改
ALTER TABLE 表名 MODIFY 列名 数据类型 AUTO_INCREMENT;

# 删除
ALTER TABLE 表名 MODIFY 列名 数据类型;
```

- 引用(多表)级约束：需要对比其他表才有效果
  - `FOREIGN KEY`：参照(外键)约束，限定表中的某一列，正确引用其他表的数据值，每个表中可以包含多个外键，外键类型应该和主键类型对应，尽量命名相同；存在主外键关系时，删除主表可能因为子表引用而删除失败，可以先删除子表的引用再删除。

```sql
# 外键约束
# 添加
CREATE TABLE 主表名 (
	列名 数据类型 PRIMARY KEY
);
CREATE TABLE 子表名 (
	列名 数据类型 PRIMARY KEY,
  [CONSTRAINT <外键约束名>] FOREIGN KEY (外键) REFERENCES 主表名 (主键) [ON UPDATE XX] [ON DELETE XX]
);

# 修改
ALTER TABLE 子表名 ADD [CONSTRAINT 约束名] FOREIGN KEY (外键) REFERENCES 主表名 (主键) [ON UPDATE XX] [ON DELETE XX];

# 删除
# 第一步先查看约束名和删除外键约束
SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = '数据库名' AND TABLE_NAME = '表名';
ALTER TABLE 子表名 DROP FOREIGN KEY 外键约束名;

# 第二步查看索引名和删除索引，只能手动删除
SHOW INDEX FROM 表名;
ALTER TABLE 子表名 DROP INDEX 索引名;
```

| 约束等级      | 说明                                                                                 |
| ------------- | ------------------------------------------------------------------------------------ |
| `CASCADE`     | 在主表上update \| delete时，同步操作子表的匹配记录                                   |
| `SET NULL`    | 在主表上update \| delete时，将子表的匹配记录列设为null，但是子表的外键列不能设为null |
| `NO ACTION`   | 如果子表有匹配的记录，不允许对主表对应主键进行update \| delete操作                   |
| `RESTRICT`    | 同 `NO ACTION`，都是立即检查外键约束                                                 |
| `SET DEFAULT` | 主表有变更时，子表将外键列设置成一个默认的值，但是 `Innodb` 不能识别                 |

::: tip

最好使用：`ON UPDATE CASCADE ON DELETE RESTRICT`

:::

<br />

## 多表查询

> 概述：将多张表数据利用多表查询语法合并成单张虚拟表，分为水平合并语法和垂直合并语法

### 垂直合并

> 要求：只要求合并的结果集之间的列数和对应列的类型相同，不要求有主外键

| 语法        | 说明                     |
| ----------- | ------------------------ |
| `UNION`     | 合并记录同时去掉重复数据 |
| `UNION ALL` | 合并记录，不去掉重复数据 |

<br />

### 水平合并

> 内连接要求：两个表必须有关系(主外键)，需要判断主外键相等

| 语法                                                                                     | 说明             |
| ---------------------------------------------------------------------------------------- | ---------------- |
| `SELECT * FROM 表1 [INNER] JOIN 表2 ON 表1.主键 = 表2.外键 INNER JOIN..ON... WHERE ...;` | 标准语法内连接   |
| `SELECT * FROM 表1, 表2 WHERE 表1.主键 = 表2.外键 AND \| OR ...;`                        | 非标准语法内连接 |
| `SELECT * FROM 表1 LEFT \| RIGHT [OUTER] JOIN 表2 ON 表1.主键 = 表2.外键;`               | 外连接           |
| `SELECT * FROM 表1 NATURAL [LEFT \| RIGHT] JOIN 表2;`                                    | 自然连接         |

<br />

> 外连接：与内连接不同的是，外连接会返回所有符合条件的行，同时还会返回未匹配的行，分为左外连接(LEFT JOIN)和右外连接(RIGHT JOIN)

| 语法                                                                              | 说明     |
| --------------------------------------------------------------------------------- | -------- |
| `SELECT * FROM 表1 LEFT [OUTER] JOIN 表2 ON 表1.主键 = 表2.外键 LEFT JOIN ...;`   | 左外连接 |
| `SELECT * FROM 表1 RIGHT [OUTER] JOIN 表2 ON 表1.主键 = 表2.外键 RIGHT JOIN ...;` | 右外连接 |

::: info 内外连接区别

内连接只满足匹配条件的行数，两个表必须存在且主外键相等才会返回，外连接可以通过左和右指定一个逻辑主表，逻辑主表数据一定能查到

建议将分析的逻辑主表放在最左的第一个位置，那么本次查询必然全部是是左外连接。

:::

```sql
# 多表查询关键字顺序
SELECT ...
FROM ...
LEFT | RIGHT JOIN 表名 ON ...
LEFT | RIGHT JOIN 表名 ON ...
WHERE AND
GROUP BY ...
HAVING ...
ORDER BY...
LIMIT ...
```

> 自然连接：是一种内连接和外连接的升级版，会自动找到两个表中相同的列名判定相等，可以省略 `ON 主= 外` 的语法，但是除了主外键其他列名相同，也会自动判定相等，不准确。

| 语法                                        | 说明         |
| ------------------------------------------- | ------------ |
| `SELECT * FROM 表1 NATURAL JOIN 表2;`       | 自然内连接   |
| `SELECT * FROM 表1 NATURAL LEFT JOIN 表2;`  | 自然左外连接 |
| `SELECT * FROM 表2 NATURAL RIGHT JOIN 表2;` | 自然右外连接 |

> 自连接：将自身表作为虚拟表多次查询，多用于一行数据引用关联

<br />

### 子查询(嵌套)

> 概述：子查询是指在SQL中嵌套另一个完整的SELECT查询语句，这个嵌套的查询通常被称为子查询或内部查询。
>
> 标量子查询：子查询返回单行单列，这个值通常用于条件判断、过滤或者作为SELECT查询的一部分
>
> 行子子查询：子查询返回一行多列，通常用于更新或插入数据，作为另一个整体来比较
>
> 列子子查询：子查询返回一列多行，通常用于 `IN、ANY、ALL` 等条件中，或者作为其他查询的条件
>
> 表子子查询：子查询返回多行多列，通常不能用于查询条件，用于连接或联合查询中的虚拟表

<br />

## 数据库事务

> 概述：一套操作数据命令的有序集合，一个不可分割的工作单位。事务中单个命令不会立即改变数据库数据，当内部全部命令执行成功，统一更新数据；当有任一命令失败，可以进行状态回滚。
>
> 作用：为数据库操作序列提供了一个从失败中恢复到正常状态的方法；当多个应用程序在并发访问数据库时，防止彼此的操作互相干扰。

::: info 事务ACID特性

- 原子性(Atomicity)：原子性是指事务是一个不可分割的工作单位，事务中的操作要么都发生，要么都不发生
- 一致性(Consistency)：事务内部的操作的状态前后一致，成功都成功，失败都失败，避免部分成功出现错误数据
- 隔离性(Isolation)：一个事务的执行不能被其他事务干扰，即一个事务内部的操作及使用的数据对并发的其他事务是隔离的，并发执行的各个事务之间不能相互干扰
- 持久性(Durability)：指一个事务一旦被提交，它对数据库中数据的改变是永久性的，接下来的其他操作和数据库故障不应该对其有任何影响

:::

<br />

### 事务操作

MySQL默认情况下是自动提交事务，默认每一条语句都是一个独立的事务，一旦成功就提交，语句报错失败就回滚。

DDL不支持事务，只对操作数据语句有效。

- 手动提交模式

  ```sql
  # 开启手动提交事务模式，即取消自动提交事务
  SET AUTOCOMMIT = FALSE;
  # OR
  SET AUTOCOMMIT = 0;

  # 恢复自动提交模式
  SET AUTOCOMMIT = TRUE;
  # OR
  SET AUTOCOMMIT = 1;

  # 修改后提交
  COMMIT;

  # 回滚
  ROLLBACK;

  # 查看是否自动提交
  SHOW VARIABLES LIKE 'AUTOCOMMIT';
  ```

- 自动提交模式下开启独立事务

  ```sql
  # 也可以在自动提交模式下，开启一个事务
  START TRANSACTION;

  # 添加多个SQL命令
  ...

  # 提交或回滚
  COMMIT;
  # OR
  ROLLBACK;
  ```

<br />

### 隔离性

| 隔离级别(由弱到强) | 概述                   | 脏读 | 不可重复读 | 幻读       |
| ------------------ | ---------------------- | ---- | ---------- | ---------- |
| `read-uncommitted` | 读未提交事务数据       | 是   | 是         | 是         |
| `read-committed`   | 读已提交事务数据oracle | 否   | 是         | 是         |
| `repeatable-read`  | 可重复读MySQL          | 否   | 是         | 是(小概率) |
| `serializable`     | 串行化和序列化         | 否   | 否         | 否         |

- 脏读：一个事务读取了另一个事务未提交的数据，真的错误
- 不可重复读：一个事务读取了另一个事务提交的修改数据，不会造成数据错误，只是不符合一致性原则
- 幻读：一个事务读取了另一个事务提交的插入和删除数据，不会造成数据错误，只是不符合一致性原则

```sql
# 修改隔离级别
SET TRANSACTION_ISOLATION = '隔离级别';

# 查看隔离级别
SELECT @@TRANSACTION_ISOLATION;
```

<br />

## 用户权限

> 概述：主要包括创建用户、赋予权限、回收权限、删除用户

```sql
# 创建用户
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
# localhost表示用户可以连接到服务器的本地主机，%表示允许来自任何主机的连接

# 赋予权限
GRANT ALL PRIVILEGES ON 数据库名.表名 TO 'username'@'localhost';

# 撤销权限
REVOKE ALL PRIVILEGES ON 数据库名.表名 FROM ’username'@'xxx';

# 查看权限
SHOW GRANTS FOR 'username'@'xxx';
# 查看有用户列表
SELECT USER, HOST FROM MYSQL.USER;

# 删除用户
DROP USER '用户名';
```

<br />

## 数据备份和还原

> 注意：需在未连接mysql状态下执行命令

```sql
# 备份单库单表
mysqldump -u username -pxx 数据库名 表名 > backup.sql

# 备份单库和多表
mysqldump -u username -pxx 数据库名 表名1 表名2... > backup.sql

# 备份单库所有表
mysqldump -u username -pxx 数据库名 > backup.sql

# 全量恢复还原数据
mysql -u username -pxx 数据库名 < backup.sql;
```

<br />

### Binlog日志

> 概述：MySQL的二进制日志记录，记录数据库所有的增删改查操作，可以利用日志文件实现：误删数据恢复、增量复制、主从同步等
>
> 配置文件地址：`xx\my.ini`

```ini
# 开启配置(默认开启)
[mysqld]
log-bin=mysql-bin
datadir=C:/App/MySQL/MySQL Server 8.4/Data
```

```sql
# 清空日志文件
RESET MASTER; # 8.4.3报错，未找到

# 重启新的日志文件
FLUSH LOGS;
```

<br />
