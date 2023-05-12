FROM node:lts-alpine

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

WORKDIR /app

# 安装tzdata,默认的alpine基础镜像不包含时区组件，安装后可通过TZ环境变量配置时区
RUN apk add --no-cache tzdata

# 设置时区为中国东八区，这里的配置可以被docker-compose.yml或docker run时指定的时区覆盖
ENV TZ="Asia/Shanghai"

# 如果各公司有自己的私有源，可以替换registry地址,如使用官方源注释下一行
RUN npm config set registry https://registry.npm.taobao.org

# 构建项目
COPY . .
RUN npm install
RUN npm run build

# 删除开发期依赖
RUN rm -rf src node_modules package-lock.json

# 安装生产环境依赖
RUN npm install --production

# 如果端口更换，这边可以更新一下
EXPOSE 3002

CMD ["npm", "run", "prod"]
