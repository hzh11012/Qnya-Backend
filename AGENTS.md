# AGENTS.md

给 AI 编码代理（Claude Code、pi、Cursor 等）的项目上下文。改动前请先读完本文件。

## 项目概览

Qnya 管理后台：动漫流媒体平台的管理端 SPA（React 19 + Vite + TS + Tailwind v4 + TanStack Query/Table + zustand）。配套仓库：用户端 `../Qnya-Frontend`、后端 API `../Qnya`。

- **技术栈**：React 19、react-router-dom 7（createBrowserRouter 数据路由）、@tanstack/react-query v5 + react-table v8 + react-virtual、zustand（immer/devtools）、react-hook-form + zod、axios、sonner、lucide-react
- **编译**：vite 中启用 `reactCompilerPreset()`，eslint 与用户端同一套 react-hooks 规则（purity 强制）
- **会话**：cookie session（httpOnly + withCredentials + xsrf 自动回传），JS 侧零 token 存储

## 常用命令

```bash
pnpm dev        # vite（端口 5900，/api 代理到 127.0.0.1:3000）
pnpm gen:api    # 从后端 dev server 拉 /api/docs/json 生成 src/types/api.d.ts
pnpm lint       # eslint
pnpm build      # tsc -b && vite build
```

- **改完代码的完成标准**：`npx tsc -b && npx eslint src` 0 error（仅 `theme-provider.tsx` 有 1 个历史 react-refresh warning，可忽略）
- **`gen:api` 前置**：后端 dev server 必须在跑（且非 production，Swagger 才注册）；后端改接口后先在 `../Qnya` 跑 `pnpm openapi:export` 并启动其后端
- **dev 代理注意**：代理需配合后端 set-cookie 的 domain（cookie domain 对不上时登录态静默失败）

## 架构

```
src/
├── apis/                # 按领域请求函数；类型经 src/types/helpers.ts 的
│                        #   ApiData/ApiBody/ApiQuery 从 api.d.ts 派生
├── types/api.d.ts       # openapi-typescript 自动生成，勿手改
├── components/custom/
│   ├── auth/            # AuthProvider（401 事件监听）+ RequireAuth/RedirectIfAuthenticated
│   ├── data-table/      # DataTable 全家桶 + createTablePage/createFormDialog 工厂
│   └── sidebar/
├── hooks/               # create-table-page（表格页标准）、use-auth-init、use-options…
├── lib/request.ts       # axios 封装：响应解包 { code, message, data }、401 派发
│                        #   'auth:unauthorized' 事件、showSuccessToast/showErrorToast 开关
├── pages/               # 每页 = index.tsx + columns.tsx + row-actions.tsx + 表单/schema
├── routes.tsx           # 路由树由 links.ts 派生（单一数据源，新页面只挂 lazy）
└── store/               # auth（zustand）+ base（表格 store 工厂）
```

## 硬性约定

1. **表格页一律走 `createTablePage` 工厂**（`src/hooks/create-table-page.ts`）：store 工厂 + useQuery + 卸载清理三件套已收敛；`columnFilters` 是筛选唯一真相源（用 `filterValues` 取值，不双写进 store）；空页自动回退上一页的逻辑在工厂里，勿在页面重复实现
2. **新增/编辑弹窗一律走 `createFormDialog` 工厂**：泛型全推断（调用点不要写显式类型参数）；表单组件 props 必含 `{ form, onSubmit }`（`InjectedFormProps`），额外 props 经 `formProps` 传入
3. **行必须有稳定 `id`**：`DataTable` 用 `getRowId: row => String(row.id)` 生成行 key；外部数据源无 id 时（resources/torrents）在 `getPageData` 里补（resources 用 magnet，torrents 用 name+createdAt），并让 columns 类型对齐 `XxxRow` 别名
4. **react-compiler purity**（与用户端同规则）：渲染期禁 `Date.now()`/`Math.random()`；effect 里禁直接 setState（派生数据渲染期算）
5. **API 层**：新接口先在 `../Qnya` 声明 zod schema → `openapi:export` → `gen:api`，然后 `apis/*.ts` 用 `ApiData/ApiBody/ApiQuery` helper 派生类型，不手写接口形状
6. **认证**：前端角色判断只是 UX（登录时校验 `role === 'admin'`），权限权威在后端 RBAC；401 由 `request.ts` 统一派发事件，**不要在业务代码里自行处理 401**
7. **登出必须清缓存**：`app-sidebar.tsx` 登出 mutation 的 `onSettled` 里 `setUser(null)` + `queryClient.clear()`（换账号不残留上一会话数据）
8. **路由**：页面路径加进 `src/links.ts` 并挂 lazy，路由树自动生成；`redirect` 参数已有开放重定向防护（仅站内相对路径），勿绕过

## 与后端的契约

- 后端仓库 `../Qnya`（见其 AGENTS.md）；响应包装 `{ code, message, data }`，request 层已解包
- axios `paramsSerializer: { indexes: null }`——数组参数序列化为重复 key（axios 默认 `a[]=1` Fastify 不认），**不要移除**

## Git

- 远端 `github.com/hzh11012/Qnya-Backend.git`（master 直推）；此仓库不打版本 tag（版本号以用户端为准）
