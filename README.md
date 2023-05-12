## 本地开发启动文档
```npm run dev```

## 自助打包构建文档
1. 构建docker镜像,启动容器,如下:
```
docker build --build-arg ENVIRONMENT=testing -t tars-server .
docker run -v /root/tars_local_file:/tars_local_file -d -p 3002:3002 tars-server
```
* ENVIRONMENT=xxx,确保xxx对应项目中的env.xxx文件,构建的时候Dockerfile中的会将对应的env.xxx文件拷贝到容器中替换掉.env文件
* -v /root/tars_local_file:/tars_local_file,将宿主机的/root/tars_local_file目录挂载到容器的/tars_local_file目录,用于存放上传的文件,部署前确保宿主机的/root/tars_local_file目录存在
* 若要使宿主机的其他挂载目录,可以在.env中配置FILE_DIR=xxx,然后在docker run时指定-v xxx:/tars_local_file,这样就可以将宿主机的xxx目录挂载到容器的/tars_local_file目录
2. 配置宿主机nginx
```
location /api/tars/ {
    proxy_pass http://localhost:3002/api/tars/;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```
## 浙报运维部署文档
提供给运维构建Dockerfile如下:
```
FROM node:lts-alpine

# 设置工作目录
WORKDIR /app

# 安装tzdata,默认的alpine基础镜像不包含时区组件，安装后可通过TZ环境变量配置时区
RUN apk add --no-cache tzdata

# 设置时区为中国东八区，这里的配置可以被docker-compose.yml或docker run时指定的时区覆盖
ENV TZ="Asia/Shanghai"

# 拷贝并解压构建产物
COPY tars-server.tar.gz /app/
RUN tar xzvf tars-server.tar.gz && rm tars-server.tar.gz

# 暴露端口
EXPOSE 3002

CMD ["npm", "run", "prod"]
```

## TypeORM 迁移指南

### 创建迁移文件

1. 确保已经全局安装了 TypeORM CLI：

```
npm install -g typeorm
```

1. 使用 TypeORM CLI 生成一个新的迁移文件：

```
typeorm migration:create src/migration/<migration_name>
```

这将在 `src/migration` 目录下创建一个新的迁移文件，文件名格式为 `timestamp-<migration_name>.ts`。

### 编写迁移文件

迁移文件包含两个方法：`up` 和 `down`。`up` 方法用于应用数据库更改，`down` 方法用于回滚数据库更改。
```
import { MigrationInterface, QueryRunner } from 'typeorm';

export class <MigrationName> implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 在这里编写应用数据库更改的逻辑
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 在这里编写回滚数据库更改的逻辑
  }
}
```

### 执行迁移
使用以下命令执行迁移：

```
typeorm migration:run
```

在生产环境中，部署应用程序之前，请确保先执行迁移。运行 `typeorm migration:run`进行数据库更改。

### 回滚迁移

如果需要回滚迁移，可以使用以下命令：

```
typeorm migration:revert
```
