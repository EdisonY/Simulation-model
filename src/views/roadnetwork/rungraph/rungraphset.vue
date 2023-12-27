<template>
  <div class="dashboard-container edittable">
    <!-- <el-button @click="drewPlan()" style="position:absolute;z-index:99999">默认按钮</el-button> -->
    <!-- <rungrap ref="grap" :rungrapData="rungrapData" /> -->
    <div class="left-panel">
      <el-tabs type="border-card" style="margin: 10px 0 0 10px">
        <el-tab-pane label="选择运行图">
          <el-button type="primary" size="small" @click="importRungraph">上传</el-button>
          <el-button type="primary" size="small" @click="startStop(1)">{{
            buttonText
          }}</el-button>

          <br />
          <br />
          <el-table :data="tableData3" style="width: 100%">
            <el-table-column prop="date" label="图号"> </el-table-column>
            <el-table-column prop="name" label="备注"> </el-table-column>
            <el-table-column prop="data" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="drawAllData"
                  >打开</el-button
                >
                <el-button type="danger" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="输入开行方案">
          <div class="btn-line-2" style="margin-bottom: 20px">
            <el-button type="primary" size="small" @click="addTable()"
              >添加条数</el-button
            >
            <el-button type="success" size="small" @click="drawgraph" style="width: 80px"
              >提交设置</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="startStop(2)"
              style="width: 80px"
              >{{ buttonText }}</el-button
            >
          </div>
          <div class="select-line" style="margin-bottom: 20px">
            <div class="select-item" style="margin-bottom: 10px">
              图号：<el-input
                placeholder="图号"
                size="mini"
                type="value"
                v-model="graphID"
              ></el-input>
            </div>
            <div class="select-item" style="margin-bottom: 10px">
              备注：<el-input placeholder="备注" size="mini" v-model="address">
              </el-input>
            </div>
            <el-checkbox
              v-model="runGraphOrPassengerGraph"
              style="color: white; display: block; margin: 10px 5px"
              >简易时刻表</el-checkbox
            >
          </div>
          <!-- <div class="table-line" style="padding-bottom: 10px">
            <el-table border :data="tableData4" style="width: 100%" max-height="700">
              <el-table-column
                label="起始时间"
                align="center"
                min-width="120"
                width="150"
              >
                <template slot-scope="scope">
                  <el-time-picker
                    v-model="scope.row.startTime"
                    style="width: 120px"
                    placeholder="选择时间"
                  >
                  </el-time-picker>
                </template>
              </el-table-column>
              <el-table-column label="终止时间" align="center"  width="150"min-width="120">
                <template slot-scope="scope">
                  <el-time-picker
                    v-model="scope.row.endTime"
                    style="width: 120px"
                    placeholder="选择时间"
                  >
                  </el-time-picker>
                </template>
              </el-table-column>
              <el-table-column label="交路方式" align="center"  width="150" min-width="120">
                <template slot-scope="scope">
                 
                </template>
              </el-table-column>

              <el-table-column
                prop="trainRunNum1"
                align="center"
                label="上行列车开行数量"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span v-if="!edit">{{ scope.row.trainRunNum1 }}</span>
                  <el-input v-model="scope.row.trainRunNum1" v-if="edit"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="runLevel1"
                align="center"
                label="上行运行等级"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span v-if="!edit">{{ scope.row.runLevel1 }}</span>
                  <el-input v-model="scope.row.runLevel1" v-if="edit"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="trainRunNum0"
                align="center"
                label="下行列车开行数量"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span v-if="!edit">{{ scope.row.trainRunNum0 }}</span>
                  <el-input v-model="scope.row.trainRunNum0" v-if="edit"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="runLevel0"
                align="center"
                label="下行列车等级"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span v-if="!edit">{{ scope.row.runLevel0 }}</span>
                  <el-input v-model="scope.row.runLevel0" v-if="edit"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="chexing" align="center" label="车型" min-width="120">
                <template slot-scope="scope">
                  <span v-if="!edit">{{ scope.row.chexing }}</span>
                  <el-input v-model="scope.row.chexing" v-if="edit"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="操作"
                min-width="120"
                v-if="deleteData"
              >
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="deleteTableData(scope)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div> -->
          <div class="table-line drawTable" style="padding-bottom: 10px">
            <table class="selfTable">
              <tr class="thead">
                <th colspan="1" style="width: 260px">起止时间</th>
                <th style="width: 160px">交路方式</th>
                <!-- <th style="width: 160px">跳停车站</th> -->
                <th>编组信息</th>
                <th>上行开行列数</th>
                <th>下行开行列数</th>
                <th>操作</th>
              </tr>
              <tbody v-for="(item, index1) in tableData4" :key="item.label">
                <tr v-for="(items, index) in item.crossRouteList">
                  <td
                    v-if="index == 0 && item.crossRouteList.length >= 1"
                    :rowspan="item.crossRouteList.length"
                  >
                    <el-time-picker
                      style="width: 120px"
                      v-model="item.startTime"
                      placeholder="起始时间"
                      label="起始时间"
                      :clearable="false"
                    >
                    </el-time-picker
                    >-
                    <el-time-picker
                      style="width: 120px"
                      v-model="item.endTime"
                      placeholder="结束时间"
                      :clearable="false"
                    >
                    </el-time-picker>
                  </td>
                  <td>
                    <el-select v-model="items.tmpRout" placeholder="请选择">
                      <el-option
                        v-for="item in tmpRoute"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </td>
                  <!-- <td>
                    <el-select
                      v-model="items.stopOrNotList1"
                      placeholder="请选择"
                      multiple
                    >
                      <el-option
                        v-for="items in stations"
                        :key="items.stationId"
                        :label="items.stationName"
                        :value="items.stationId"
                      >
                      </el-option>
                    </el-select>
                  </td> -->
                  <td>
                    <el-input v-model="items.trainTypeGroup" style="width: 60px">
                    </el-input>
                  </td>
                  <td>
                    <el-input v-model="items.trainRunNum1" style="width: 60px">
                    </el-input>
                  </td>
                  <td>
                    <el-input v-model="items.trainRunNum0" style="width: 60px">
                    </el-input>
                  </td>
                  <td>
                    <el-tooltip content="添加交路">
                      <el-button
                        icon="el-icon-plus"
                        @click="addTableData(index1, index)"
                        size="mini"
                        style="width: fit-content"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除当前交路">
                      <el-button
                        v-if="deleteData"
                        type="danger"
                        icon="el-icon-delete"
                        @click="deleteTableData(index1, index)"
                        size="mini"
                        style="width: fit-content"
                      ></el-button>
                    </el-tooltip>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="修改运行图">
                    <ul>
                        <li>表号：001</li>
                        <li>车次号：1231</li>
                        <li>列车运行方向：上行</li>
                    </ul>
                    <ul>
                        <li>编组数量：<span>4</span></li>
                        <li>车型：<span>A</span></li>
                        <li>定员：<span>1000</span></li>
                        <li>是否载客车次：<span>是</span></li>
                    </ul>
                    <el-table
                    :data="tableData1"
                    style="width: 100%">
                    <el-table-column
                        prop="date"
                        label="车站名称">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="进站时间">
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="出站时间">
                    </el-table-column>
                    <el-table-column
                        prop="shi"
                        label="是否折返">
                    </el-table-column>
                    </el-table>
                    <p style="text-align:right;padding:20px 0">
                        <el-button type="danger" size="small">删除车次</el-button>
                        <el-button type="primary" size="small">新建车次</el-button>
                    </p>
                </el-tab-pane> -->
      </el-tabs>
      <!-- <el-card class="box-card" style="margin: 10px 0 0 10px">
        <div slot="header" class="clearfix">
          <span>消息</span>
        </div>
        <div style="text-align: left">
          <ul>
            <li>打开运行图成功。。。。</li>
            <li>运行图名称：北京轨道交通验方线</li>
            <li>00:00:00 xx 发生紧急制动</li>
            <li>00:00:00 - 00:02:00 扣故障区外即将进入该控区相邻车站</li>
            <li>00:00:00 - 00:02:00 扣故障区外即将进入该控区相邻车站</li>
            <li>00:00:00 - 00:02:00 扣故障区外即将进入该控区相邻车站</li>
          </ul>
        </div>
      </el-card> -->
      <!-- {{rungrapData}} -->
      <!-- <div class="waring-panel"
                v-if="warningList && warningList.length>0">
                <p v-for="(msg,index) in warningList" :key="index">{{msg}}</p>
            </div> -->
    </div>
    <!-- <DiagramReal :first="first"
                :maxTime="currentTime"
                :forcastTime="forcastTime"
                :stations="stations"
                :diagramConfig="diagramConfig"
                :planData="planData"
                :realData="realData"
                :forecastData="forecastData"
                :uuid="`real0`"
                :autoMode="autoMode"
                :diagramName="lineName +` 实际运行图`"
                style="height:calc(100vh - 50px);width:calc(100% - 400px)" /> -->
    <div>
      <rungrap ref="grap" :rungrapData="rungrapData" @isRunning="isRunning" />
    </div>
  </div>
</template>

<script>
import rungrap from "./lib_common_new";
import { getStations } from "@/utils/station";

// import DiagramReal from "../../../components/DiagramRealLocal.vue";
// import testData from "../../../components/testData";
import testStations from "../../../components/stations";

export default {
  name: "Rungrap",
  data() {
    return {
      caculateFlag: false, //开行方案计算标志
      buttonText: "启动",
      runGraphOrPassengerGraph: false, //客流方式
      graphID: this.getDefaultGraphID(),
      address: "",
      lineName: "",
      currentTime: new Date().toLocaleString(),
      startTime: 0,
      endTime: 1020,
      diagramConfig: {
        stationHeight: 50,
        bottomBlockHeight: 30,
        topBlockHeight: 100,
        sideWidth: 100,
      },
      edit: true,
      deleteData: true,
      first: true,
      stations: testStations,
      planData: null,
      realData: null,
      forecastData: null,
      solutions: ["方案一", "方案二", "方案三", "方案四", "方案五"],
      listServeAndTrip: [
        {
          serve: 112,
          trip: 1123,
        },
        {
          serve: 112,
          trip: 1123,
        },
        {
          serve: 112,
          trip: 1123,
        },
        {
          serve: 112,
          trip: 1123,
        },
        {
          serve: 112,
          trip: 1123,
        },
      ],
      listRealMsg: [
        {
          msg: "你好",
          type: "info",
        },
        {
          msg: "你好",
          type: "error",
        },
        {
          msg: "你好",
          type: "warning",
        },
      ],
      tableData3: [
        {
          date: "PR2205",
          name: "",
        },
        {
          date: "TS2205",
          name: "",
        },
        {
          date: "PR2002",
          name: "",
        },
        {
          date: "TS2002",
          name: "",
        },
      ],
      tableData1: [
        {
          date: "科技园",
          name: "13:00:00",
          address: "13:02:00",
          shi: "否",
        },
        {
          date: "科技园",
          name: "13:00:00",
          address: "13:02:00",
          shi: "否",
        },
      ],
      options: [
        {
          value: "选项5",
          label: "交路AB",
        },
      ],
      value: "选项5",
      tableData2: [
        {
          number: "012231",
          stationName: "新宫车辆段",
          arrive: "5:10:20",
          depart: "5:13:24",
          stationTrack: "T0932",
        },
        {
          number: "012231",
          stationName: "新宫车辆段",
          arrive: "5:10:20",
          depart: "5:13:24",
          stationTrack: "T0932",
        },
        {
          number: "012231",
          stationName: "新宫车辆段",
          arrive: "5:10:20",
          depart: "5:13:24",
          stationTrack: "T0932",
        },
        {
          number: "012231",
          stationName: "新宫车辆段",
          arrive: "5:10:20",
          depart: "5:13:24",
          stationTrack: "T0932",
        },
        {
          number: "012231",
          stationName: "新宫车辆段",
          arrive: "5:10:20",
          depart: "5:13:24",
          stationTrack: "T0932",
        },
        {
          number: "012231",
          stationName: "新宫车辆段",
          arrive: "5:10:20",
          depart: "5:13:24",
          stationTrack: "T0932",
        },
      ],
      departureStationOptions: [
        {
          value: "1",
          label: "车站1",
        },
        {
          value: "2",
          label: "车站2",
        },
      ],
      departureStationValue: "1",
      tableData: [
        {
          startTime: "05:00:00",
          endTime: "06:00:00",
          trainRunNum1: 10,
          runLevel1: 1,
          dir1: 80,
          trainRunNum0: 10,
          runLevel0: 1,
          dir0: 170,
          chexing: "6b",
        },
        {
          startTime: "06:00:00",
          endTime: "07:00:00",
          trainRunNum1: 10,
          runLevel1: 1,
          dir1: 80,
          trainRunNum0: 10,
          runLevel0: 1,
          dir0: 170,
          chexing: "6b",
        },
        {
          startTime: "07:00:00",
          endTime: "08:00:00",
          trainRunNum1: 10,
          runLevel1: 1,
          dir1: 80,
          trainRunNum0: 10,
          runLevel0: 1,
          dir0: 170,
          chexing: "6b",
        },
        {
          startTime: "08:00:00",
          endTime: "09:00:00",
          trainRunNum1: 10,
          runLevel1: 1,
          dir1: 80,
          trainRunNum0: 10,
          runLevel0: 1,
          dir0: 170,
          chexing: "6b",
        },
        {
          startTime: "09:00:00",
          endTime: "10:00:00",
          trainRunNum1: 10,
          runLevel1: 1,
          dir1: 80,
          trainRunNum0: 10,
          runLevel0: 1,
          dir0: 170,
          chexing: "6b",
        },
        {
          startTime: "10:00:00",
          endTime: "11:00:00",
          trainRunNum1: 10,
          runLevel1: 1,
          dir1: 80,
          trainRunNum0: 10,
          runLevel0: 1,
          dir0: 170,
          chexing: "6b",
        },
        {
          startTime: "11:00:00",
          endTime: "12:00:00",
          trainRunNum1: 10,
          runLevel1: 1,
          dir1: 80,
          trainRunNum0: 10,
          runLevel0: 1,
          dir0: 170,
          chexing: "6b",
        },
      ],
      tableData4: [
        {
          startTime: 18000,
          endTime: 25200,
          crossRouteCount: 1,
          crossRouteList: [
            {
              crossRouteId: 1,
              trainTypeGroup: "6B",
              lineWayId: 37,
              tmpRout: 0,
              startStationId: 2101,
              endStationId: 2103,
              trainRunNum1: 10,
              trainRunNum0: 10,
              stopOrNotList: [
                {
                  stationId: 2101,
                  stopOrNot: true,
                },
                {
                  stationId: 2102,
                  stopOrNot: true,
                },
                {
                  stationId: 2103,
                  stopOrNot: true,
                },
                {
                  stationId: 2104,
                  stopOrNot: false,
                },
              ],
              stopOrNotList1: [2104],
            },
          ],
        },
        {
          startTime: 25200,
          endTime: 32400,
          crossRouteCount: 2,
          crossRouteList: [
            {
              crossRouteId: 1,
              trainTypeGroup: "6B",
              lineWayId: 37,
              tmpRout: 0,
              startStationId: 2101,
              endStationId: 2103,
              trainRunNum1: 10,
              trainRunNum0: 10,
              stopOrNotList: [
                {
                  stationId: 2101,
                  stopOrNot: true,
                },
                {
                  stationId: 2102,
                  stopOrNot: true,
                },
                {
                  stationId: 2103,
                  stopOrNot: true,
                },
                {
                  stationId: 2104,
                  stopOrNot: false,
                },
              ],
              stopOrNotList1: [2104],
            },
            // {
            //   crossRouteId: 2,
            //   trainTypeGroup: "6B",
            //   lineWayId: 65526,
            //   tmpRout: 1,
            //   startStationId: 2104,
            //   endStationId: 2101,
            //   trainRunNum1: 20,
            //   trainRunNum0: 20,
            //   stopOrNotList: [
            //     {
            //       stationId: 2103,
            //       stopOrNot: false,
            //     },
            //     {
            //       stationId: 2104,
            //       stopOrNot: true,
            //     },
            //     {
            //       stationId: 2102,
            //       stopOrNot: true,
            //     },
            //     {
            //       stationId: 2101,
            //       stopOrNot: true,
            //     },
            //   ],
            //   stopOrNotList1: [2103],
            // },
          ],
        },
        {
          startTime: 32400,
          endTime: 61200,
          crossRouteCount: 2,
          crossRouteList: [
            {
              crossRouteId: 1,
              trainTypeGroup: "6B",
              lineWayId: 11,
              tmpRout: 0,
              startStationId: 2101,
              endStationId: 2103,
              trainRunNum1: 10,
              trainRunNum0: 10,
              stopOrNotList: [
                {
                  stationId: 2101,
                  stopOrNot: true,
                },
                {
                  stationId: 2102,
                  stopOrNot: true,
                },
                {
                  stationId: 2103,
                  stopOrNot: true,
                },
                {
                  stationId: 2104,
                  stopOrNot: false,
                },
              ],
              stopOrNotList1: [2104],
            },
            // {
            //   crossRouteId: 2,
            //   trainTypeGroup: "6B",
            //   lineWayId: 65526,
            //   tmpRout: 1,
            //   startStationId: 2104,
            //   endStationId: 2101,
            //   trainRunNum1: 20,
            //   trainRunNum0: 20,
            //   stopOrNotList: [
            //     {
            //       stationId: 2103,
            //       stopOrNot: false,
            //     },
            //     {
            //       stationId: 2104,
            //       stopOrNot: true,
            //     },
            //     {
            //       stationId: 2102,
            //       stopOrNot: true,
            //     },
            //     {
            //       stationId: 2101,
            //       stopOrNot: true,
            //     },
            //   ],
            //   stopOrNotList1: [2103],
            // },
          ],
        },
        {
          startTime: 61200,
          endTime: 68400,
          crossRouteCount: 2,
          crossRouteList: [
            {
              crossRouteId: 1,
              trainTypeGroup: "6B",
              lineWayId: 37,
              tmpRout: 0,
              startStationId: 2101,
              endStationId: 2103,
              trainRunNum1: 10,
              trainRunNum0: 10,
              stopOrNotList: [
                {
                  stationId: 2101,
                  stopOrNot: true,
                },
                {
                  stationId: 2102,
                  stopOrNot: true,
                },
                {
                  stationId: 2103,
                  stopOrNot: true,
                },
                {
                  stationId: 2104,
                  stopOrNot: false,
                },
              ],
              stopOrNotList1: [2104],
            },
            // {
            //   crossRouteId: 2,
            //   trainTypeGroup: "6B",
            //   lineWayId: 65526,
            //   tmpRout: 1,
            //   startStationId: 2104,
            //   endStationId: 2101,
            //   trainRunNum1: 20,
            //   trainRunNum0: 20,
            //   stopOrNotList: [
            //     {
            //       stationId: 2103,
            //       stopOrNot: false,
            //     },
            //     {
            //       stationId: 2104,
            //       stopOrNot: true,
            //     },
            //     {
            //       stationId: 2102,
            //       stopOrNot: true,
            //     },
            //     {
            //       stationId: 2101,
            //       stopOrNot: true,
            //     },
            //   ],
            //   stopOrNotList1: [2103],
            // },
          ],
        },
        {
          startTime: 68400,
          endTime: 79200,
          crossRouteCount: 2,
          crossRouteList: [
            {
              crossRouteId: 1,
              trainTypeGroup: "6B",
              lineWayId: 37,
              tmpRout: 0,
              startStationId: 2101,
              endStationId: 2103,

              trainRunNum1: 10,
              trainRunNum0: 10,
              stopOrNotList: [
                {
                  stationId: 2101,
                  stopOrNot: true,
                },
                {
                  stationId: 2102,
                  stopOrNot: true,
                },
                {
                  stationId: 2103,
                  stopOrNot: true,
                },
                {
                  stationId: 2104,
                  stopOrNot: false,
                },
              ],
              stopOrNotList1: [2104],
            },
            // {
            //   crossRouteId: 2,
            //   trainTypeGroup: "6B",
            //   lineWayId: 65526,
            //   tmpRout: 1,
            //   startStationId: 2104,
            //   endStationId: 2101,
            //   trainRunNum1: 20,
            //   trainRunNum0: 20,
            //   stopOrNotList: [
            //     {
            //       stationId: 2103,
            //       stopOrNot: false,
            //     },
            //     {
            //       stationId: 2104,
            //       stopOrNot: true,
            //     },
            //     {
            //       stationId: 2102,
            //       stopOrNot: true,
            //     },
            //     {
            //       stationId: 2101,
            //       stopOrNot: true,
            //     },
            //   ],
            //   stopOrNotList1: [2103],
            // },
          ],
        },
      ],
      tmp: [],
      stations: JSON.parse(localStorage.getItem("stations")),
      tmpRoute: JSON.parse(localStorage.getItem("tmpRoute")),
      tmpRouteOption:[
        {
        name:"北京轨道交通燕房线",
        opt:[
                {
                    value: 0,
                    label: "燕山-阎村东",
                    startStation: 2105,
                    endStation: 2104,
                },
                {
                    value: 1,
                    label: "阎村-阎村东",
                    startStation: 2104,
                    endStation: 2104,
                },
                {
                    value: 2,
                    label: "燕山-星城",
                    startStation: 2105,
                    endStation: 2103,
                },
            ]   
      },
      {
        name:"北京轨道交通燕房线场段",
        opt:[
                {
                    value: 0,
                    label: "燕山-阎村东",
                    startStation: 2105,
                    endStation: 2104,
                },
                {
                    value: 1,
                    label: "阎村-阎村东",
                    startStation: 2104,
                    endStation: 2104,
                },
                {
                    value: 2,
                    label: "燕山-星城",
                    startStation: 2105,
                    endStation: 2103,
                },
            ]   
      },
      {
        name:"北京轨道交通19号线",
        opt:[
                {
                    value: 0,
                    label: "新宫-牡丹园",
                    startStation: 2105,
                    endStation: 2104,
                },
                {
                    value: 1,
                    label: "新宫-太平桥",
                    startStation: 2104,
                    endStation: 2104,
                },
                {
                    value: 2,
                    label: "平安里-牡丹园",
                    startStation: 2105,
                    endStation: 2103,
                },
            ]
      },
    ]
    };
  },
  components: {
    // DiagramReal
    rungrap,
  },
  computed: {
    currentTimeFormat() {
      let h = parseInt(this.currentTime / 3600);
      let m = parseInt((this.currentTime % 3600) / 60);
      let s = parseInt((this.currentTime % 3600) % 60);
      return `${parseInt(h / 10)}${h % 10}:${parseInt(m / 10)}${m % 10}:${parseInt(
        s / 10
      )}${s % 10}`;
    },
  },
  created() {
    this.ws.registerCallback("mainPage11", this.wsCallback);
    var self = this;
    this.rungrapData = {};
    var data = {
      msgId: 1,
      msgType: 103,
      requestId: "12345678",
      session: this.$getCurrentDate(),
      timestamp: this.$getCurrentDate(),
      data: 2,
    };

    this.rungrapData.multiply = this.$route.meta.type;
    // this.rungrapData.multiply = false;
    let currentLine = sessionStorage.getItem("currentLine");
    //更新交路选项
    let tmpOpt=this.tmpRouteOption.find((item)=>{
      return item.name==currentLine
    })
    if(tmpOpt)
    {
      this.tmpRoute=tmpOpt.opt;
    }
    //更新线路车站
    console.log(currentLine);
    this.rungrapData.station = getStations(currentLine);
    console.log(this.rungrapData);

    // *配置上下行线路及坐标主颜色，组件内已默认，可自定义设置
    this.rungrapData.colors = ["#5793f3", "#d14a61"];

    // *确认获取到运行图源数据后，将源数据挂载到浏览器本地session中，key值为rungrap。并执行运行图组件内的initData方法
    // * window.sessionStorage.setItem('rungrap',your get data
    function initData() {
      self.$nextTick(() => {
        self.$refs.grap.initData();
      });
    }
    //时间数据转化
    this.tableData4.forEach((item) => {
      if (typeof item.startTime != "object") {
        let ss = new Date("2022/9/16," + this.formatTime(item.startTime));
        let ee = new Date("2022/9/16," + this.formatTime(item.endTime));
        item.startTime = ss;
        item.endTime = ee;
      }
    });
  },
  mounted() {
    // this.sendPackage("line-info");
    // this.sendPackage("plan-diagram");
    // this.sendPackage("scheme-diagram");
    // this.getData();
    //获取后端运行状态，设置按钮功能
    this.getServerState();
  },
  methods: {
    /**
     * 获取后端运行状态，设置启动按钮状态
     */
    getServerState() {
      let lineName = this.$refs.grap.currentLine;
      3; //查询运行状态
      let param = this.ws.getPackage(137, {
        lineName: lineName,
        operaType: 3,
      });
      console.log("send 137 package type-3");
      this.ws.sendSock(param);
    },
    /**
     *
     * @param {} isRunning 仿真运行标志
     */
    isRunning(isRunning) {
      this.buttonText = isRunning == true ? "停止" : "启动";
    },
    formatTime(time) {
      let hour = parseInt(time / 3600)
        .toString()
        .padStart(2, "0");
      let minute = parseInt((time % 3600) / 60)
        .toString()
        .padStart(2, "0");
      let second = parseInt(time % 60)
        .toString()
        .padStart(2, "0");
      return `${hour}:${minute}:${second}`;
    },
    /**
     * 将时间转换成秒
     * @param {Date} date
     */
    transTime(date) {
      // console.log(date);
      var HH = date.getHours();
      let mm = date.getMinutes();
      let ss = date.getSeconds();
      let sum = HH * 3600 + mm * 60 + ss;
      // console.log(date + "=" + sum + "s");
      return sum;
    },
    getRungrapClick(params) {
      console.log(params);
    },
    drewPlan() {
      this.$refs.grap.drewPlan();
    },
    addTable() {
      const temp = {
        startTime: 25200,
        endTime: 32400,
        crossRouteCount: 2,
        crossRouteList: [
          {
            crossRouteId: 1,
            trainTypeGroup: "6B",
            lineWayId: 37,
            tmpRout: 0,
            startStationId: 2101,
            endStationId: 2103,
            trainRunNum1: 10,
            trainRunNum0: 10,
            stopOrNotList: [
              {
                stationId: 2101,
                stopOrNot: true,
              },
              {
                stationId: 2102,
                stopOrNot: true,
              },
              {
                stationId: 2103,
                stopOrNot: true,
              },
              {
                stationId: 2104,
                stopOrNot: false,
              },
            ],
            stopOrNotList1: [2104],
          },
          {
            crossRouteId: 2,
            trainTypeGroup: "6B",
            lineWayId: 65526,
            tmpRout: 1,
            startStationId: 2104,
            endStationId: 2101,
            trainRunNum1: 10,
            trainRunNum0: 10,
            stopOrNotList: [
              {
                stationId: 2103,
                stopOrNot: false,
              },
              {
                stationId: 2104,
                stopOrNot: true,
              },
              {
                stationId: 2102,
                stopOrNot: true,
              },
              {
                stationId: 2101,
                stopOrNot: true,
              },
            ],
            stopOrNotList1: [2103],
          },
        ],
      };
      this.tableData4.push(temp);
      this.deleteData = true;
    },
    deleteTableData(index1, index) {
      this.tableData4[index1].crossRouteList.splice(index, 1);

      if (this.tableData4.length <= 1) {
        this.deleteData = false;
      } else {
        this.deleteData = true;
      }
    },
    addTableData(index1, index) {
      const tempdata = {
        crossRouteId: 1,
        trainTypeGroup: "6B",
        lineWayId: 37,
        tmpRout: 0,
        startStationId: 2101,
        endStationId: 2103,
        trainRunNum1: 10,
        trainRunNum0: 10,
        stopOrNotList: [
          {
            stationId: 2101,
            stopOrNot: true,
          },
          {
            stationId: 2102,
            stopOrNot: true,
          },
          {
            stationId: 2103,
            stopOrNot: true,
          },
          {
            stationId: 2104,
            stopOrNot: true,
          },
        ],
        stopOrNotList1: [],
      };
      this.tableData4[index1].crossRouteList.splice(index + 1, 0, tempdata);
    },
    resetRungrap() {
      var self = this;
      let data = {};
      data.routingTrainRunNums = [];
      data.routingTrainRunNums[0] = {};
      data.routingTrainRunNums[0].routingId = 1;
      data.routingTrainRunNums[0].trainRunNums = [];

      // self.hideLeft();
      var changeData = JSON.parse(JSON.stringify(this.tableData));
      function returnTime(data) {
        var str = data.split(":");
        for (let index = 0; index < str.length; index++) {
          str[index] = Number(str[index]);
        }
        return str[0] * 3600 + str[1] * 60 + str[2];
      }
      for (let index = 0; index < changeData.length; index++) {
        for (const key in changeData[index]) {
          if (key != "startTime" && key != "endTime") {
            changeData[index][key] = Number(changeData[index][key]);
          } else {
            changeData[index][key] = returnTime(changeData[index][key]);
          }
        }
      }
      data.routingTrainRunNums[0].trainRunNums = changeData;
      console.log("send 702");
      let param = this.ws.getPackage(702, data);
      this.ws.sendSock(param);
    },
    getData() {
      let planTripArr = [];
      let planServes = testData[0].serveList;
      planServes.forEach((serve) => {
        serve.tripList.forEach((tripItem) => {
          let trip = {
            serveNo: serve.serveNo,
            tripNo: tripItem.tripNo,
            data: [],
            dir: tripItem.runDir,
          };
          tripItem.pathListStr.forEach((str) => {
            let strArr = str.split(",");
            trip.data.push({
              sid: parseInt(strArr[0]),
              arrive: parseInt(strArr[1]),
              depart: parseInt(strArr[2]),
            });
          });
          planTripArr.push(trip);
        });
      });

      let realTripArr = [];
      let realServes = testData[1].serveList;
      realServes.forEach((serve) => {
        serve.tripList.forEach((tripItem) => {
          let trip = {
            serveNo: serve.serveNo,
            tripNo: tripItem.tripNo,
            data: [],
            dir: tripItem.runDir,
          };
          tripItem.pathListStr.forEach((str) => {
            let strArr = str.split(",");
            trip.data.push({
              sid: parseInt(strArr[0]),
              arrive: parseInt(strArr[1]),
              depart: parseInt(strArr[2]),
              late: parseInt(strArr[3]),
            });
          });
          realTripArr.push(trip);
        });
      });

      let forecastTripArr = [];
      let forecastServes = testData[2].serveList;
      forecastServes.forEach((serve) => {
        serve.tripList.forEach((tripItem) => {
          let trip = {
            serveNo: serve.serveNo,
            tripNo: tripItem.tripNo,
            data: [],
            dir: tripItem.runDir,
          };
          tripItem.pathListStr.forEach((str) => {
            let strArr = str.split(",");
            trip.data.push({
              sid: parseInt(strArr[0]),
              arrive: parseInt(strArr[1]),
              depart: parseInt(strArr[2]),
              late: parseInt(strArr[3]),
            });
          });
          forecastTripArr.push(trip);
        });
      });

      this.planData = planTripArr;
      this.realData = realTripArr;
      this.forecastData = forecastTripArr;
    },

    _setMsg(msg, type = "normal") {
      if (this.listRealMsg.length >= 100) {
        this.listRealMsg = [];
      }
      this.listRealMsg.unshift({
        time: this.$getCurrentDate(),
        msg: msg,
        type: type,
      });
    },
    wsCallback(res) {
      //802回调
      if (res.msgType == 802) {
        console.log("receive 802 data");
        this.$message({ type: "success", message: "收到开始方案数据,计算完成" });
        this.caculateFlag=false;
        if (res.data.length > 0) {
          // console.log('802进程')
          this.$refs.grap.clearChartData();
          let planData = res.data[0].serveList;
          // let realData = res.data[1].serveList;
          this.$refs.grap.initData(planData, false);
          // this.$refs.grap.initData(realData, true);
          this.$refs.grap.cacheData = {
            planData,
            // realData,
          };
        } else {
          // console.log('未进入802进程')
        }
      }
      return;
    },
    transAppInfo(d) {
      this._setMsg(`收到 [${d.lineName}] 数据。`);
      this.lineName = d.lineName;
      this.stations = d.vecStation;
    },
    transPlanData(d) {
      this._setMsg(`收到计划运行图 [${d.graphId}] 信息。`);
      let planTripArr = [];
      let planServes = d.serveList;
      planServes.forEach((serve) => {
        serve.tripList.forEach((tripItem) => {
          let trip = {
            serveNo: serve.serveNo,
            tripNo: tripItem.tripNo,
            data: [],
            dir: tripItem.runDir,
          };
          tripItem.pathListStr.forEach((str) => {
            let strArr = str.split(",");
            trip.data.push({
              sid: parseInt(strArr[0]),
              arrive: parseInt(strArr[1]),
              depart: parseInt(strArr[2]),
            });
          });
          planTripArr.push(trip);
        });
      });
      this.planData = planTripArr;
    },
    transFaultData(d) {
      this._setMsg(d.strFaultMsg, "fault");
    },
    transRealtimeData(d) {
      this._setMsg(`收到实时运行图 [${d.graphId}] 信息。`);
      let realTripArr = [];
      let forecastServes = d.serveList;
      forecastServes.forEach((serve) => {
        serve.tripList.forEach((tripItem) => {
          let trip = {
            serveNo: serve.serveNo,
            tripNo: tripItem.tripNo,
            data: [],
            dir: tripItem.runDir,
          };
          tripItem.pathListStr.forEach((str) => {
            let strArr = str.split(",");
            trip.data.push({
              sid: parseInt(strArr[0]),
              arrive: parseInt(strArr[1]),
              depart: parseInt(strArr[2]),
              loadrate: parseInt(strArr[4]),
              laterate: parseInt(strArr[5]),
              late: parseInt(strArr[6]),
            });
            this.currentTime =
              this.currentTime > parseInt(strArr[2])
                ? this.currentTime
                : parseInt(strArr[2]);
          });
          realTripArr.push(trip);
        });
      });
      this.realData = realTripArr;
    },
    transForecastData(d) {
      this._setMsg(`收到预测 [${d.graphId}] 信息。`);
      let forecastTripArr = [];
      let realServes = d.serveList;
      this.forcastTime = -2;
      realServes.forEach((serve) => {
        serve.tripList.forEach((tripItem) => {
          let trip = {
            serveNo: serve.serveNo,
            tripNo: tripItem.tripNo,
            data: [],
            dir: tripItem.runDir,
          };
          tripItem.pathListStr.forEach((str) => {
            let strArr = str.split(",");
            trip.data.push({
              sid: parseInt(strArr[0]),
              arrive: parseInt(strArr[1]),
              depart: parseInt(strArr[2]),
              loadrate: parseInt(strArr[4]),
              laterate: parseInt(strArr[5]),
              late: parseInt(strArr[6]),
            });

            this.forcastTime =
              this.forcastTime > parseInt(strArr[2])
                ? this.forcastTime
                : parseInt(strArr[2]);
          });
          forecastTripArr.push(trip);
        });
      });
      this.forecastData = forecastTripArr;
    },
    sendPackage(handle) {
      if (handle == "stop") {
        let d = this.ws.getPackage("business.plan", 1001, "停止推演");
        this.ws.sendSock(d);
        console.log(d);
      } else if (handle == "select-scheme") {
        let d = this.ws.getPackage("business.actual", 1002, "更新运行图");
        this.ws.sendSock(d);
      } else if (handle == "line-info") {
        let d = this.ws.getPackage("business.actual", 1003, "请求线路车站信息");
        this.ws.sendSock(d);
      } else if (handle == "plan-diagram") {
        let d = this.ws.getPackage("business.actual", 1004, "请求计划运行图");
        this.ws.sendSock(d);
      } else if (handle == "scheme-diagram") {
        let d = this.ws.getPackage("business.plan", 1005, "请求方案计划图");
        this.ws.sendSock(d);
      } else if (handle == "init") {
        // this.$router.go(0);
        location.reload();
      }
    },
    //运行图内置功能外移至父组件
    importRungraph() {
      this.$refs.grap.importRungraph();
    },
    /**
     * 启动仿真
     * @param {*} funcFlag 1-137 2-147 
     */
    startStop(funcFlag) {
      if (this.caculateFlag) {
        this.$message({
          type: "warning",
          message: "开行方案计算中,请在开行方案计算完成后重试",
        });
      }
      this.$refs.grap.startStop(funcFlag);
    },
    drawAllData() {
      this.$refs.grap.drawAllData();
      this.$message({
        type: "success",
        message: "数据加载中",
      });
    },
    /**
     * 铺画开行方案702接口
     */
    drawgraph() {
      if(this.caculateFlag)
      {
        this.$message({type:"warning",message:"开行方案计算中，请稍后重试"});
        return;
      }
      var tempData = [];

      this.tableData4.forEach((item) => {
        let a = [];
        item.crossRouteList.forEach((item2) => {
          let l1 = 0,
            l2 = 0;
          if (item2.tmpRout == 0) {
            l1 = 1;
            l2 = 2;
          } else if (item2.tmpRout == 1) {
            l1 = 3;
            l2 = 4;
          } else if (item2.tmpRout == 2) {
            l1 = 5;
            l2 = 6;
          }
          a.push({
            trainTypeGroup: item2.trainTypeGroup,
            lineway1: l1,
            trainRunNum1: Number(item2.trainRunNum1),
            runLevel1: 1,
            dir1: 85,
            lineway0: l2,
            trainRunNum0: Number(item2.trainRunNum0),
            runLevel0: 1,
            dir0: 170,
          });
        });
        tempData.push({
          startTime: this.transTime(item.startTime),
          endTime: this.transTime(item.endTime),
          trainRunNums: a,
        });
      });
      console.log(tempData);
      let tempData2 = {
        Caption: "1",
        remarks: this.address,
        lineId: 11,
        runGraphOrPassengerGraph: this.runGraphOrPassengerGraph == true ? 2 : 1,
        mRoutingTrainRunNums: tempData,
      };
      console.log("702接口参数");
      console.log(tempData2);
      var tepdata = this.ws.getPackage(702, tempData2);
      this.ws.sendSock(tepdata);
      this.caculateFlag=true;
      this.$message({ type: "success", message: "数据已发送请等待开行方案计算" });
    },
    /**
     * 设置图号默认值
     */
    getDefaultGraphID() {
      var time = new Date();
      let Y = time.getFullYear().toString().slice(-2);
      let M = (time.getMonth() + 1).toString().padStart(2, "0");
      let result = "PR" + Y + M;
      // this.graphID=result;
      return result;
    },
  },
  beforeDestroy() {
    this.ws.unregisterCallback("mainPage11");
    this.rungrapData = {};
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  z-index: 99;
  min-height: 890px;
}
.select-line {
  //   align: center;
  margin: auto;
  .el-input {
    width: 35%;
  }
}
.left-panel {
  width: 400px;
  height: calc(100% - 62px);
  float: left;
  z-index: 100;
  position: relative;
  /* left: -50px; */
}

.selfTable {
  width: 880px;
  border-left: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  border-spacing: 0;
  color: #606266;
  background: #fff;
}
.selfTable tr {
  line-height: 40px;
}
.selfTable tr:hover,
.selfTable .thead {
  background-color: #f5f7fa;
}
.selfTable tr td,
.selfTable tr th {
  border-right: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
  text-align: center;
  position: relative;
}

.drawTable {
  overflow-x: auto;
}
</style>
