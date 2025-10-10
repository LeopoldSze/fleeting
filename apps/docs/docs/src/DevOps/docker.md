# Docker

## 安装配置

1. 安装：[官网步骤](https://docs.docker.com/engine/install/)

2. 配置仓库镜像源加速：如[阿里云](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)

   ```bash
   sudo mkdir -p /etc/docker
   sudo tee /etc/docker/daemon.json <<-'EOF'
   {
     "registry-mirrors": ["https://xxx.aliyuncs.com"]
   }
   EOF
   sudo systemctl daemon-reload
   sudo systemctl restart docker
   ```

<br />

## 镜像操作

> 名称：`镜像名:标签(版本)`

| 命令                                          | 说明                           |
| --------------------------------------------- | ------------------------------ |
| `sudo docker search xxx`                      | 检索镜像                       |
| `sudo docker pull xxx`                        | 下载镜像                       |
| `sudo docker pull xxx:tag`                    | 下载指定版本的镜像             |
| `sudo docker images`                          | 展示本地镜像列表               |
| `sudo docker rmi name/imageId...`             | 删除本地镜像                   |
| `sudo docker save -o xxx.tar xxx`             | 保存镜像到指定文件             |
| `sudo docker load -i 镜像文件地址`            | 加载镜像                       |
| `sudo docker commit -m 'msg' 镜像名 新镜像名` | 提交容器变化，打成一个新的镜像 |
| `sudo docker login`                           | 登录dockerHub                  |
| `sudo docker tag 镜像名 新镜像名`             | 重新给镜像打标签               |
| `sudo docker push 镜像名`                     | 推送镜像到远程仓库             |

<br />

## 容器操作

| 命令                                                                                     | 说明                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sudo docker ps`                                                                         | 查看运行中的容器                                                                                                                                                       |
| `sudo docker ps -a`                                                                      | 查看所有的容器                                                                                                                                                         |
| `sudo docker run name/imageId`                                                           | 运行一个新容器                                                                                                                                                         |
| `sudo docker run -d --name 容器名 -p xx:xx -v /自定义目录:/usr/share/nginx/html 镜像名 ` | 后台启动并运行一个新容器<br />`-d`：保存容器后台运行<br />`--name`：设置容器名称<br />`-p`：暴露端口<br />`-v`：针对容器内部目录做挂载或卷映射<br />`-e`：设置环境变量 |
| `sudo docker stop name/imageId`                                                          | 停止容器                                                                                                                                                               |
| `sudo docker start name/imageId`                                                         | 启动容器                                                                                                                                                               |
| `sudo docker restart name/imageId`                                                       | 重启容器                                                                                                                                                               |
| `sudo docker stats [name/imageId]`                                                       | 查看容器资源占用                                                                                                                                                       |
| `sudo docker logs name/imageId`                                                          | 查看容器日志                                                                                                                                                           |
| `sudo docker rm name/imageId`                                                            | 删除指定容器                                                                                                                                                           |
| `sudo docker rm -f name/imageId`                                                         | 强制删除指定容器                                                                                                                                                       |
| `sudo docker exec -it xxx /bin/bash`                                                     | 进入容器内部                                                                                                                                                           |
| `sudo docker update --restart=always xxx`                                                | 设置容器自启动                                                                                                                                                         |

```bash
# 创建并启动MySQL
sudo docker run -d -p 3306:3306 \
-e MYSQL_ROOT_PASSWORD=123456 \
-v mysql-data:/var/lib/mysql \
-v ./mysql.conf:/etc/mysql/conf.d \
--restart=always \
--name=mysql \
mysql:8.0

# 查看容器自启动状态
sudo docker inspect --format '{{ .HostConfig.RestartPolicy.Name }}' xxx
```

<br />

## 存储

::: info

- nginx静态资源目录：`/usr/share/nginx/html`
- nginx配置文件目录：`/etc/nginx`
- nginx卷数据目录：`/var/lib/docker/volumes/卷名/_data`

```bash
# 设置nginx静态资源目录挂载和配置文件卷映射
# 目录挂载：启动时以外部文件为准
# 卷映射：启动时以内部文件为准，防止外部没有配置文件报错
sudo docker run -d --name myNginx -p 80:80 -v ./web/nghtml:/usr/share/nginx/html -v ngconf:/etc/nginx nginx
```

:::

| 命令                             | 说明           |
| -------------------------------- | -------------- |
| `sudo docker volume ls`          | 列出所有卷映射 |
| `sudo docker volume create xxx`  | 新建卷映射     |
| `sudo docker volume inspect xxx` | 查看卷信息     |

<br />

## 网络

> docker默认docker0作为网关提供内部网络，网段 `172.17.0.x`，docker为每个容器分配唯一IP，但是IP不稳定，会换；docker0默认不支持主机域名，创建自定义网络，容器名就是稳定域名

| 命令                                       | 说明                   |
| ------------------------------------------ | ---------------------- |
| `sudo docker network ls`                   | 列出所有网络           |
| `sudo docker network create myNet`         | 创建网络               |
| `sudo docker run -d --network myNet nginx` | 创建容器并加入指定网络 |

加入自定义网络后，可以通过 `http://容器名:容器内映射端口` 访问到。

```bash
sudo docker run -d --name nginx -p 80:80 -v ./web/nginx_html:/usr/share/nginx/html -v ngconf:/etc/nginx --network szeNet nginx
```

<br />

## Compose

> 概述：批量管理容器，通过配置文件 `compose.yaml`

| 命令                                                | 说明                                                                       |
| --------------------------------------------------- | -------------------------------------------------------------------------- |
| `sudo docker compose up -d -f xx.yaml`              | 后台创建并上线容器，第一次启动<br />`-d`：后台运行<br />`-f`：指定配置文件 |
| `sudo docker compose down [--rmi all或者name] [-v]` | 下线容器<br />`--rmi`：移除对应镜像<br />`-v`：移除对应卷                  |
| `sudo docker compose start x1 x2 x3`                | 指定启动哪些容器                                                           |
| `sudo docker compose stop x1 x2 x3`                 | 指定停止哪些容器                                                           |
| `sudo docker compose scale x2=3`                    | 将某个容器扩容，如启动3份                                                  |

| 配置       | 说明           |
| ---------- | -------------- |
| `name`     | 顶级元素，名称 |
| `services` | 顶级元素，服务 |
| `networks` | 顶级元素，网路 |
| `volumes`  | 顶级元素，卷   |
| `configs`  | 顶级元素，配置 |
| `secrets`  | 顶级元素，密钥 |

<br />

```yaml
# compose.yaml

name: SzeBlog
services:
  mysql:
    image: mysql:8.0
    ports:
      - '3306:3306'
    environment:
      - MYSQL_ROOT_PASSWORD=123456
      - MYSQL_DATABASE=wordpress
    volumes:
      - mysql-data:/var/lib/mysql
      - ./mysql.cnf:/etc/mysql/conf.d/mysql.cnf
    networks:
      - blog

  wordpress:
    image: wordpress:latest
    ports:
      - '8080:80'
    environment:
      - WORDPRESS_DB_HOST=mysql
      - WORDPRESS_DB_USER=root
      - WORDPRESS_DB_PASSWORD=123456
      - WORDPRESS_DB_NAME=wordpress
    depends_on:
      - mysql
    networks:
      - blog
    volumes:
      - ./wordpress:/var/www/html

volumes:
  mysql-data:
networks:
  blog:
    driver: bridge
```

<br />

## Dockerfile

> 概述：构建自定义镜像

| 常见指令     | 作用               |
| ------------ | ------------------ |
| `FROM`       | 指定镜像基础环境   |
| `RUN`        | 运行自定义命令     |
| `CMD`        | 容器启动命令或参数 |
| `LABLE`      | 自定义标签         |
| `EXPOSE`     | 指定暴露端口       |
| `ENV`        | 环境变量           |
| `ADD`        | 添加文件到镜像     |
| `COPY`       | 复制文件到镜像     |
| `ENTRYPOINT` | 容器固定启动命令   |
| `VOLUME`     | 数据卷             |
| `USER`       | 指定用户和用户组   |
| `WORKDIR`    | 指定默认工作目录   |
| `ARG`        | 指定构建参数       |

| 命令                                         | 说明                                                                                              |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `sudo docker build -f Dockerfile -t xx:xx .` | 构建自定义镜像<br />`-t`：指定镜像名和标签<br />`-f`：指定dockerfile<br />`.`：指定目录为当前目录 |

<br />
