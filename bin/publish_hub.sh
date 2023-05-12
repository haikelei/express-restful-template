#!/bin/bash

# 从package.json中读取版本号
VERSION=$(node -p "require('./package.json').version")
echo "版本号: $VERSION"

# 构建 Docker 镜像
docker build -t tars-server . &&
echo "Docker镜像本地构建完成,开始上传"

# 打标签
TAG_NAME="haikelei/tars-server:${VERSION}-$(date '+%Y%m%d-%H%M%S')"
docker tag tars-server $TAG_NAME
echo "准备推送Docker镜像, $TAG_NAME"
docker push $TAG_NAME &&

# 同时打 latest 标签
docker tag tars-server haikelei/tars-server:latest
docker push haikelei/tars-server:latest &&

echo "Docker 镜像已上传，标签为 $TAG_NAME 和 latest"
echo "开始调用webhook"
curl -X POST http://47.98.130.100:8080/generic-webhook-trigger/invoke?token=tarsserver
echo "webhook调用结束"
