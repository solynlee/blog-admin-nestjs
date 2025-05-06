# 基础镜像
FROM node:22-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install -g pnpm
RUN npm config set registry https://registry.npmmirror.com/
RUN pnpm install

# 复制项目文件
COPY . .

# 编译 TypeScript
RUN pnpm run build

# 暴露端口
EXPOSE 7768

# 启动命令
CMD ["npm", "run", "start:prod"]