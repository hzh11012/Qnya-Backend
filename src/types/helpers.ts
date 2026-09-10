import type { paths } from './api';

type HttpMethod = 'get' | 'put' | 'post' | 'delete' | 'patch';

/**
 * OpenAPI 派生类型工具
 *
 * src/types/api.d.ts 由 `pnpm gen:api` 从后端 /api/docs/json 生成，
 * 这些 helper 统一处理生成格式的固定形态：
 * - 未定义的操作索引结果含 undefined，需先 NonNullable 解包
 * - parameters 的 query/path 是可选属性，同样需要解包
 * - 响应统一为 { code, message, data } 包装，request 层已解包外壳，
 *   这里提取 data 部分
 */

/** 某操作的 query 参数 */
export type ApiQuery<
  Path extends keyof paths,
  M extends HttpMethod = 'get'
> = NonNullable<NonNullable<paths[Path][M]>['parameters']['query']>;

/** 某操作的 path 参数 */
export type ApiPath<
  Path extends keyof paths,
  M extends HttpMethod = 'get'
> = NonNullable<NonNullable<paths[Path][M]>['parameters']['path']>;

/** 某操作的 JSON 请求体 */
export type ApiBody<Path extends keyof paths, M extends HttpMethod = 'post'> =
  NonNullable<paths[Path][M]> extends {
    requestBody: { content: { 'application/json': infer B } };
  }
    ? B
    : never;

/** 某操作的响应 data（无 data 的操作结果为 never） */
export type ApiData<Path extends keyof paths, M extends HttpMethod = 'get'> =
  NonNullable<paths[Path][M]> extends {
    responses: {
      200: { content: { 'application/json': { data: infer D } } };
    };
  }
    ? D
    : never;
