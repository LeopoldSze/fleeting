# Nginx

- 正向代理：客户端向代理服务器发送请求，并指定目标服务器地址，然后由代理服务器和原始服务器通信，转交请求并获得响应，再返回给客户端。正向代理隐藏了真实的客户端，使真实客户端对服务器不可见。
- 反向代理：指以代理服务器来接收互联网上的连接请求，然后将连接请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给客户端。

## 默认配置

- `events` 和 `http` 指令驻留在主上下文中
- `server` 在 `http` 中，多个server代表多个服务
- `location` 在 `server` 中，代表多个匹配规则
- `try_files` ：按顺序检查文件是否存在，返回第一个找到的文件或文件夹(结尾加斜线表示为文件夹)

<br />

## gzip

使用gzip压缩不仅需要配置nginx，浏览器端也需要在请求头中包含 `Accept-Encoding: gzip`

```nginx
gzip on; // 默认off，是否开启gzip
gzip_types text/plain text/css ...; // 表示要采用gzip压缩的MIME文件类型
```

<br />

## websocket

```nginx
map $http_upgrade $connection_upgrade {
  default upgrade;
  '' close;
}

upstream websocket_api {
  server xxx:xxx;
}
server {
  location / {
    proxy_pass http://websocket_api;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
  }
}
```

<br />

## 负载均衡

提供以下几种分配方式：

- 轮询：默认方式，每个请求按照顺序逐一分配到不同的server。如果某个服务挂了，则被自动去除
- weight：权重分配，指定轮询概率，权重越高，被访问的概率越大
- ip_hash：每个请求按照访问IP地址的哈希结果进行分配，这样每个访客固定访问一个后端服务器，可以解决动态网页的session共享问题

```nginx
# 权重分配
http {
  upstream myserver {
    server xxx;
    server xxx;
    server xxx weight=5;
    ...
  }

  server {
    location / {
      proxy_pass http://myserver
    }
  }
}
```

<br />

## 图片防盗

由于图片链接可以跨域访问，所以图片被其他网站引用时，会增加服务器的负担。

```nginx
http {
  server {
    # 图片防盗链
    location ~* \.(jpg|jpeg|png|gif)$ {
      valid_referers none blocked server_names ~\.test\. ~\.test2\. *.qq.com;
      if ($invalid_refere) {
        return 403;
      }

      # 过滤非指定请求
      if ( $request_method !~^(GET|POST|HEAD)$ ) {
        return 403;
      }
    }

    location / {
      # IP地址访问限制
      allow xxx;
      deny all;
    }
  }
}
```

<br />

## 前端页面刷新404

```nginx
server {
  location / {
    root '静态资源根目录';
    index index.html index.html;
    try_files $uri $uri/ /index.html; # 解决刷新404
  }
}
```

<br />

## 配置反向代理

> 作用：解决跨域

```nginx
server {
  location /xxx/ { # 拦截匹配接口请求，和代理地址同样以/结尾表示移除接口前缀，否则保留接口
    # 设置代理目标
    proxy_pass https://xxxx/;
  }
}
```

如果部署的是内网服务，需要使用 `upstream` 指令定义服务器：

```nginx
upstream demo-vue {
  server: 192.168.1.2:6677
}

server {
  location / {
    proxy_pass http://demo-vue
  }
}
```

<br />

## Tomcat

### APP目录结构

> 路径：`tomcat/webapps/xxx`
>
> 目录：
>
> - `statics`：`.css、.js` 等
> - `page`：`.html` 等
> - `WEB-INF`：受保护的资源目录，不能通过浏览器之间访问
>   - `classes`：字节码根路径
>   - `lib`：jar包依赖存放路径
>   - `web.xml`：项目的配置文件

<br />

### web部署方式

- 方式1：将内容直接放入 `webapps` 中

- 方式2：将编译好的项目打成war包放在 `webapps` 目录下，Tomcat启动后会自动解压war包(其实和方式一相同)

- 方式3：可以将项目放在其他目录，在 `tomcat/conf/Catalina/localhost` 下新建 `xxx.xml`

  ```xml
  <Context path="/app" docBase="xxx/myapp"></Context> #path:资源上下文路径，docBase:项目路径
  ```

<br />

### 工程目录配置

根目录下新建Module，里面添加：

- `resoures`：`mark directory as resources root`，将配置文件打包到src根目录
- `src`：java源代码目录
- `web`：web目录，放前端文件，idea可以右键 `add framework support`(部分版本没有)
  - `WEB-INF`：包含 `lib` 文件夹，里面放项目级别的依赖jar包；`web.xml` 配置文件

打包应用：

1. 选择 `Build -> Build Artifact -> Action.Build`

<br />
