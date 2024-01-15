<template>
    <el-card shadow="always" class="card-wrapper">
      <el-tabs type="card" v-model="activeName" class="demo-tabs" @tab-change="handleTabsChange">
        <el-tab-pane label="实例" name="first">
          <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" default-expand-all
            :header-cell-style="{ background: '#FFFFFF', color: '#606266' }">
            <el-table-column prop="address" label="地址" />
            <el-table-column prop="status" label="状态" />
            <el-table-column prop="startTime" label="启动时间" />
            <el-table-column prop="vision" label="版本" />
            <el-table-column prop="path" label="部署路径" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="主机" name="second">
          <el-table :data="tableHostData" :header-cell-style="{ background: '#FFFFFF', color: '#606266' }" style="width: 100%">
            <el-table-column prop="host" label="主机地址" />
            <el-table-column prop="cpuNum" label="CPU" />
            <el-table-column prop="cpuArch" label="CPU架构" />
            <el-table-column prop="cpuUsage" label="CPU使用率" />
            <el-table-column prop="memSize" label="物理内存" />
            <el-table-column prop="memUsage" label="内存使用率" />
            <el-table-column prop="case" label="实例" width="400" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="磁盘" name="third">
          <el-table :data="tableHostData" :header-cell-style="{ background: '#FFFFFF', color: '#606266' }" style="width: 100%">
            <el-table-column prop="host" label="主机地址" />
            <el-table-column prop="name" label="磁盘挂载点" />
            <el-table-column prop="address" label="文件系统" />
            <el-table-column prop="diskSize" label="磁盘容量" />
            <el-table-column prop="diskUsage" label="磁盘使用率" />
            <el-table-column prop="case" label="实例" width="400" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </template>
  
  
  <script lang="ts">
  import axios from "axios"
  import type { TabPaneName } from 'element-plus'
  import { getModelList } from "@/views/cluster-information/server"  
  interface tableDataItem {
    id: number
    address: string
    status: string
    startTime: string
    vision: string
    path: string
    children?: tableDataItem[]
  };
  //let caseData = {};
  
  export default {
    name: "ClusterInfo",
    data() {
      return {
        activeName: 'first',
        caseData: {} as { [key: string]: { [key: string]: number } },
        tableData: [
          {
            id: 1,
            address: 'ts-meta',
            children: [
            ],
          },
          {
            id: 2,
            address: 'ts-store',
            children: [
            ],
          },
          {
            id: 3,
            address: 'ts-sql',
            children: [
            ],
          },
        ] as unknown as tableDataItem[],
        tableHostData: [
          {
            host: '',
            cpuNum: '',
            cpuArch: '',
            cpuUsage: '',
            memSize: '',
            memUsage: '',
            case: {},
          },
        ],
        tableDiskData: [
          {
            host: '',
            cpuNum: '',
            cpuArch: '',
            diskSize: '',
            diskUsage: '',
            memUsage: '',
            case: {},
          },
        ]
      }
    },
    created() {
      this.fetchFirstData()
    },
    methods: {
      handleTabsChange(name: TabPaneName) {
        console.log(name);
        if('first' == name) {
          this.fetchFirstData();
        } else if('second' == name) {
          this.fetchSecondData();
        } else if('third' == name) {
          this.fetchThirdData();
        }
      },
      async fetchFirstData() {
        // 变量重置
        this.caseData = {};
  
        // 获取metaNodes给ts-meta
        const result = await getModelList()
        console.log(result);
        const metaNodes = result.MetaNodes;
        if (metaNodes && metaNodes.length > 0) {
          const tsMetaIndex = this.tableData.findIndex(item => item.id === 1);
          if (tsMetaIndex !== -1) {
            this.tableData[tsMetaIndex].address = 'ts-meta';
            var metaSum = 0;
            // 如果找到了ts-meta，将metaNodes添加到其children中
            const updatedChildren = metaNodes.map((metaNode: any) => {
              metaSum++;
              const host = `${this.extractIpFromValue(metaNode.Host)}`;
              if(!this.caseData[host]) {
                this.caseData[host] = {};
              }
              if(!this.caseData[host]['ts-meta']) this.caseData[host]['ts-meta'] = 0;
              this.caseData[host]['ts-meta'] += 1;
              return {
                id: metaNode.ID + 10000,
                address: metaNode.Host,
                status: metaNode.Status
              };
            });
            this.tableData[tsMetaIndex].children = updatedChildren as unknown as tableDataItem[];
            this.tableData[tsMetaIndex].address += '(' + metaSum + ')';
          } else {
            console.log("ts-meta未找到");
          }
        } else {
          console.log("MetaNodes数组为空或不存在");
        }
  
        // 获取dataNodes给ts-store
        const dataNodes = result.DataNodes;
        if (dataNodes && dataNodes.length > 0) {
          const tsDateIndex = this.tableData.findIndex(item => item.id === 2);
          var storeSum = 0;
          if (tsDateIndex !== -1) {
            this.tableData[tsDateIndex].address = 'ts-store';
            // 如果找到了ts-store，将metaNodes添加到其children中
            const updatedChildren = dataNodes.map((dataNode: any) => {
              storeSum++;
              const host = `${this.extractIpFromValue(dataNode.Host)}`;
              if(!this.caseData[host]) {
                this.caseData[host] = {};
              }
              if(!this.caseData[host]['ts-store']) this.caseData[host]['ts-store'] = 0;
              this.caseData[host]['ts-store'] += 1;
              return {
                id: dataNode.ID + 10000,
                address: dataNode.Host,
                status: dataNode.Status
              };
            });
            this.tableData[tsDateIndex].children = updatedChildren as unknown as tableDataItem[];
            this.tableData[tsDateIndex].address += '(' + storeSum + ')';
          } else {
            console.log("ts-store未找到");
          }
        } else {
          console.log("MetaNodes数组为空或不存在");
        }
  
        // 获取ts-sql的信息
        const sqlNodes = result.QueryIDInit;
        console.log(sqlNodes);
        if (sqlNodes) {
          const tsSqlIndex = this.tableData.findIndex(item => item.id === 3);
          var sqlSum = 0;
          if (tsSqlIndex !== -1) {
            this.tableData[tsSqlIndex].address = 'ts-sql';
            // 如果找到了ts-store，将metaNodes添加到其children中
            const updatedChildren = Object.entries(sqlNodes).map(([key, value]) => {
              sqlSum++;
              console.log(key);
              const host = `${this.extractIpFromValue(key)}`;
              if(!this.caseData[host]) {
                this.caseData[host] = {};
              }
              if(!this.caseData[host]['ts-sql']) this.caseData[host]['ts-sql'] = 0;
              this.caseData[host]['ts-sql'] += 1;
              return {
                id: sqlSum + 1000,
                address: key,
                status: "-",
              };
            });
            this.tableData[tsSqlIndex].children = updatedChildren as unknown as tableDataItem[];
            this.tableData[tsSqlIndex].address += '(' + sqlSum + ')';
          } else {
            console.log("ts-store未找到");
          }
        } else {
          console.log("sqlNodes数组为空或不存在");
        }
      },
      fetchSecondData() {
        // 主机地址，CPU数，CPU；利用率，物理内存，内存使用率
        const queryHost = "127.0.0.1";
        const queryPort = "8086";
        const url = "http://" + queryHost + ":" + queryPort + "/query";
        const dbName = "monitor";
        const sql = 'select last(*) from system group by host order by time desc'
        console.log(url);
        axios
          .get(url, {
            params: {
              db: dbName,
              pretty: true,
              q: sql
            }
          })
          .then((response) => {
            const results = response.data.results[0];
            this.tableHostData = results.series.map((series: any) => {
              console.log(this.caseData);
              return {
                host: series.tags.host,
                cpuNum: series.values[0][4],
                cpuArch: '',
                cpuUsage: series.values[0][5] + '%',
                memSize: (series.values[0][12] / 1024.0).toFixed(2) + 'GiB',
                memUsage: series.values[0][13] + '%',
                case: JSON.stringify(this.caseData[series.tags.host], null, 2).replace(/^{/, "").replace(/}$/, ""),
              };
            });
          })
      },
      fetchThirdData() {
        const queryHost = "127.0.0.1";
        const queryPort = "8086";
        const url = "http://" + queryHost + ":" + queryPort + "/query";
        const dbName = "monitor";
        const sql = 'select last(*) from system group by host order by time desc'
        console.log(url);
        axios
          .get(url, {
            params: {
              db: dbName,
              pretty: true,
              q: sql
            }
          })
          .then((response) => {
            const results = response.data.results[0];
            this.tableHostData = results.series.map((series: any) => {
              //console.log(series.tags.host);
              return {
                host: series.tags.host,
                diskSize: (series.values[0][6] / 1024.0).toFixed(2) + 'GiB',
                diskUsage: series.values[0][7] + '%',
                case: JSON.stringify(this.caseData[series.tags.host], null, 2).replace(/^{/, "").replace(/}$/, ""),
              };
            });
          })      
      },
      //截取ip
      extractIpFromValue(value: any) {
        // 使用分割方法截取IP地址部分
        const parts = value.split(":")
        if (parts.length >= 1) {
          return parts[0] // 返回冒号前的部分
        } else {
          return value // 如果没有冒号分隔符，返回原始值
        }
      }
    }
  }
  
  </script>
  
  <style>
  .card-wrapper {
    margin-bottom: 20px;
  
    :deep(.el-card__body) {
      padding-bottom: 2px;
    }
  }
  </style>
  