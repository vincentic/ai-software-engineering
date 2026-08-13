# AI Software Engineering

一个用于练习全栈开发、后端服务切换和 Vercel 部署的 Todo List 项目。

This is a Todo List project for practicing full-stack development, backend service integration, and Vercel deployment.

## 中文说明

### 项目概览

本仓库包含一个 Todo List 全栈应用：

- 前端：Next.js 16、React 19、TypeScript、Tailwind CSS
- Node.js 后端：NestJS、TypeORM、MySQL
- Java 后端：Spring Boot、MyBatis Plus、MySQL
- 部署：前端通过 Vercel 部署

线上前端：

```text
https://frontend-vincentics-projects.vercel.app
```

GitHub 仓库：

```text
https://github.com/vincentic/ai-software-engineering
```

### 目录结构

```text
todo-list-app/
├── frontend/        # Next.js 前端应用
├── backend-nodejs/  # NestJS 后端服务
├── backend-java/    # Spring Boot 后端服务
└── docs/            # 项目文档和学习记录
```

根目录的 `vercel.json` 指向 `todo-list-app/frontend`，用于在 Vercel 上构建前端。

### 主要功能

- 查看 Todo 列表
- 新增任务
- 编辑任务名称
- 查看任务详情
- 切换完成状态
- 删除任务
- 通过 Next.js API Routes 转发后端请求

### 本地运行前端

```bash
cd todo-list-app/frontend
npm install
npm run dev
```

默认本地地址：

```text
http://localhost:3001
```

### 本地运行 Node.js 后端

```bash
cd todo-list-app/backend-nodejs
npm install
npm run start:dev
```

默认后端地址：

```text
http://localhost:3000
```

### 本地运行 Java 后端

```bash
cd todo-list-app/backend-java
./mvnw spring-boot:run
```

Java 后端需要 JDK 17 和可用的 MySQL 配置。

### 环境变量

前端通过 Next.js API Routes 调用后端。可以使用 `BACKEND_URL` 配置后端服务地址：

```bash
BACKEND_URL=http://localhost:3000
```

如果没有设置 `BACKEND_URL`，默认使用：

```text
http://localhost:3000
```

在 Vercel 生产环境中，需要在项目环境变量里设置 `BACKEND_URL` 为可公开访问的后端地址。

### 测试与构建

前端：

```bash
cd todo-list-app/frontend
npm run lint
npm run build
```

Node.js 后端：

```bash
cd todo-list-app/backend-nodejs
npm run test
npm run build
```

Java 后端：

```bash
cd todo-list-app/backend-java
./mvnw test
```

### 部署

Vercel 构建配置位于根目录 `vercel.json`：

```json
{
  "buildCommand": "cd todo-list-app/frontend && npm install && npm run build",
  "outputDirectory": "todo-list-app/frontend/.next",
  "framework": "nextjs",
  "installCommand": "cd todo-list-app/frontend && npm install"
}
```

手动部署到生产环境：

```bash
npx vercel --prod
```

## English

### Overview

This repository contains a full-stack Todo List application:

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Node.js backend: NestJS, TypeORM, MySQL
- Java backend: Spring Boot, MyBatis Plus, MySQL
- Deployment: frontend deployed with Vercel

Production frontend:

```text
https://frontend-vincentics-projects.vercel.app
```

GitHub repository:

```text
https://github.com/vincentic/ai-software-engineering
```

### Project Structure

```text
todo-list-app/
├── frontend/        # Next.js frontend app
├── backend-nodejs/  # NestJS backend service
├── backend-java/    # Spring Boot backend service
└── docs/            # Project documentation and learning notes
```

The root-level `vercel.json` points Vercel to `todo-list-app/frontend` for frontend builds.

### Features

- List todos
- Add tasks
- Edit task names
- View task details
- Toggle completion status
- Delete tasks
- Proxy backend requests through Next.js API Routes

### Run the Frontend Locally

```bash
cd todo-list-app/frontend
npm install
npm run dev
```

Default local URL:

```text
http://localhost:3001
```

### Run the Node.js Backend Locally

```bash
cd todo-list-app/backend-nodejs
npm install
npm run start:dev
```

Default backend URL:

```text
http://localhost:3000
```

### Run the Java Backend Locally

```bash
cd todo-list-app/backend-java
./mvnw spring-boot:run
```

The Java backend requires JDK 17 and a working MySQL configuration.

### Environment Variables

The frontend calls backend services through Next.js API Routes. Configure the backend base URL with `BACKEND_URL`:

```bash
BACKEND_URL=http://localhost:3000
```

If `BACKEND_URL` is not set, the frontend defaults to:

```text
http://localhost:3000
```

For Vercel production, set `BACKEND_URL` in the Vercel project environment variables to the public backend URL.

### Test and Build

Frontend:

```bash
cd todo-list-app/frontend
npm run lint
npm run build
```

Node.js backend:

```bash
cd todo-list-app/backend-nodejs
npm run test
npm run build
```

Java backend:

```bash
cd todo-list-app/backend-java
./mvnw test
```

### Deployment

The Vercel build configuration is stored in the root `vercel.json`:

```json
{
  "buildCommand": "cd todo-list-app/frontend && npm install && npm run build",
  "outputDirectory": "todo-list-app/frontend/.next",
  "framework": "nextjs",
  "installCommand": "cd todo-list-app/frontend && npm install"
}
```

Manual production deployment:

```bash
npx vercel --prod
```
