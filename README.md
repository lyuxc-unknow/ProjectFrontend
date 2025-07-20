# WebSide 项目

这是一个基于 Vue 3 + TypeScript + Element Plus 的前端项目。

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - JavaScript的超集，提供类型安全
- **Element Plus** - Vue 3的UI组件库
- **Vue Router** - Vue.js官方路由管理器
- **Axios** - HTTP客户端
- **Vite** - 现代前端构建工具

## 项目结构

```
src/
├── components/          # Vue组件
│   ├── file/           # 文件管理相关组件
│   ├── Dashboard.vue   # 仪表盘组件
│   ├── Files.vue       # 文件管理主组件
│   ├── Login.vue       # 登录组件
│   └── Settings.vue    # 设置组件
├── router/             # 路由配置
│   └── index.ts        # 路由定义
├── App.vue             # 根组件
└── main.ts             # 应用入口
```

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run type-check
```

## TypeScript 特性

项目已完全转换为 TypeScript，包括：

- 所有 Vue 组件都使用 `<script setup lang="ts">`
- 完整的类型定义和接口
- 严格的类型检查
- 智能代码提示和错误检测

## 主要功能

- 用户登录认证
- 文件上传下载
- 系统设置
- 仪表盘数据展示

## 开发说明

1. 确保安装了 Node.js 和 npm
2. 克隆项目并安装依赖
3. 启动开发服务器
4. 访问 http://localhost:5173

项目已成功从 JavaScript 转换为 TypeScript，提供了更好的开发体验和代码质量保证。
