# Maven

## 概述

Maven是一个依赖管理工具，依赖对应的jar包能够自动下载、方便、快捷又规范。通过配置依赖jar包的坐标，查找本地仓库中相应的jar包，若本地仓库没有，则统一从镜像网站或者中央仓库中下载。

使用Maven可以自动化构建、测试、打包和发布项目。

1. 依赖管理
2. 构建管理

<br />

## 安装配置

1. 下载：[官网](https://maven.apache.org/download.cgi)
2. 解压到指定文件夹
3. 添加环境变量：`MAVEN_HOME`，系统变量Path中添加 `%MAVEN_HOME%\bin`
4. 命令测试：`mvn -v`，输出版本信息即可

<br />

## 功能配置

需要修改 `maven/conf/settings.xml` 配置文件，来修改默认配置，主要修改的有三个配置：

1. 依赖本地缓存位置(本地仓库位置)

   ```xml
   # 配置本地仓库地址
   <localRepository>xxx</localRepository>
   ```

2. maven下载镜像：[阿里云镜像](https://developer.aliyun.com/mvn/guide)

   ```xml
   <mirrors>
     <mirror>
       <id>alimaven</id>
       <mirrorOf>central</mirrorOf>
       <name>阿里云公共仓库</name>
       <url>https://maven.aliyun.com/repository/public</url>
     </mirror>
   </mirrors>
   ```

3. maven选用编译项目的JDK版本

   ```xml
   <profiles>
     <profile>
       <id>jdk-17</id>
       <activation>
         <activeByDefault>true</activeByDefault>
         <jdk>17</jdk>
       </activation>
       <properties>
         <maven.compiler.source>17</maven.compiler.source>
         <maven.compiler.target>17</maven.compiler.target>
         <maven.compiler.compilerVersion>17</maven.compiler.compilerVersion>
       </properties>
     </profile>
   </profiles>
   ```

<br />

## 工程构建

### GAVP

> 概述：GAV需要在创建项目的时候指定，P有默认值；分别指 `GroupId、ArtifactId、Version、Packaging` 四个属性的缩写，前三个必要，最后的可选，主要为每个项目在Maven仓库中做一个标识。

- GroupID：`com.公司/BU.业务线.[子业务线]`，最多4级
- ArtifactID：`产品线名-模块名`
- Version：`主版本号.此版本号.修订号`
- Packaging： 指示将项目打包为什么类型的文件
  - jar(默认值)：代表普通java工程
  - war：代表java的web工程
  - pom：代表不会打包，用来做继承的父工程

```xml
<!-- 默认java maven 工程 pom.xml -->

<!-- 添加依赖 -->
<dependencies>
  <!-- https://mvnrepository.com/artifact/org.junit.jupiter/junit-jupiter-api -->
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-api</artifactId>
    <version>5.10.2</version>
    <scope>test</scope>
  </dependency>
</dependencies>
```

<br />

### 目录说明

- `pom.xml`：根目录，是Maven项目管理文件
- `src`：根目录，存放源码
  - `main`：项目主要代码
    - `java`：java源码目录
      - `com.example.xxx`
        - `controller`
        - `service`
        - `dao`
        - `model`
    - `resources`：资源目录，存放配置文件、静态资源等
      - `log4j.properties | spring-mybatis.xml | xxx`
      - `static`
        - `js | css | img`
    - `webapp`：存放web相关配置和资源
      - `WEB-INF`：存放web应用配置文件
        - `web.xml`：web应用的部署描述文件
        - `classes`：存放编译后的class文件
      - `index.html`：web应用入口页面
  - `test`：项目测试代码
    - `java`：单元测试目录
    - `resources`：测试资源目录

<br />

### 构建配置

在 `pom.xml` 中配置

1. 指定打包名

   ```xml
   <!-- 默认打包名称：artifactId + version.打包方式-->
   <build>
   	<finalName>定义打包名称</finalName>
   </build>
   ```

2. 指定打包文件：不按照maven文件结构放置的文件可能不会被打包，需要手动配置

   ```xml
   <!-- 设置需要打包的资源位置 -->
   <resources>
   	<resource>
     	<directory>xxx</directory>
       <includes>
       	<include>**/*.xml</include>
       </includes>
     </resource>
   </resources>
   ```

3. 打包插件版本过低，配置更高版本插件

   ```xml
   <build>
   	<plugins>
       <!-- java编译插件，war包和jdk17版本不匹配 -->
     	<plugin>
       	<groupId>org.apache.maven.plugins</groupId>
         <artifactId>maven-war-plugin</artifactId>
         <version>3.2.2</version>
       </plugin>
     </plugins>
   </build>
   ```

<br />

### 依赖传递

- 非 `compile` 范围进行依赖传递

- 使用 `<optional>` 配置终止传递

- 依赖冲突(传递的依赖已经存在)：当直接引用或者间接引用出现了相同的jar包时

  1. 自动短路优先原则

  2. 依赖路径长度相同时，自动声明优先原则

  3. 手动排除

     ```xml
     <dependency>
     	<groupId>xxx</groupId>
       <artifactId>xxx</artifactId>
       <version>xxx</version>
       <scope>xxx</scope>
       <!-- 使用excludes标签配置依赖的排除 -->
       <exclusions>
       	<exclusion>
         	<groupId>xxx</groupId>
           <artifactId>xxx</artifactId>
         </exclusion>
       </exclusions>
     </dependency>
     ```

<br />

### 父子工程继承

- 子工程创建方式：父工程目录上右键新建module，parent选项会自动填入，父工程可以只保留 `pom.xml`配置文件且将打包方式指定为pom，其他文件可以删除

- 子工程依赖继承：

  1. 使用 `<dependencies>` 默认会继承父工程所有依赖

  2. 可以修改父工程配置手动管理依赖继承

  ```xml
  <!-- 父工程pom.xml -->
  <dependencyManagement>
  	<dependencies>
    	<dependency>
        <groupId>xxx</groupId>
        <artifactId>xxx</artifactId>
        <version>xxx</version>
      </dependency>
    </dependencies>
  </dependencyManagement>
  ```

  ```xml
  <!-- 子工程pom.xml，只需指定GA，不需要指定V -->
  <dependencies>
    	<dependency>
        <groupId>xxx</groupId>
        <artifactId>xxx</artifactId>
      </dependency>
    </dependencies>
  ```

<br />

### 工程聚合关系

> 概述：指将多个项目组织到一个父级项目中，以便一起构建和管理，idea创建子工程时会默认聚合

```xml
<!-- pom.xml 添加 modules标签 -->
<project>
	<groupId>xxx</groupId>
  <artifactId>xxx</artifactId>
  <version>xxx</version>
  <packaging>pom</packaging>
  <modules>
  	<module>子工程路径1</module>
    <module>子工程路径2</module>
  </modules>
</project>
```

<br />
