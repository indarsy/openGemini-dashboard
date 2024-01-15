// server.d.ts

import { AxiosResponse } from "axios";

declare module "@/views/cluster-information/server" {
  // 声明模块内部的类型
  export interface ModelListResponse {
    // 这里定义你 API 返回的数据结构
    MetaNodes: any[];
    DataNodes: any[];
    QueryIDInit: Object;
    // 添加其他属性
  }

  // 导出模块内的函数并指定返回类型
  export function getModelList(): Promise<ModelListResponse>;
}
