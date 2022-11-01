<template>
  <div class="report clearfix">
    <!-- <div class="left_new">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>操作</span>
        </div>
        <div style="display: flex; justify-content: center">
          <el-button type="primary" size="small">导出报告</el-button>
          <el-button type="primary" size="small">保存数据</el-button>
        </div>
      </el-card>
      <Msg />
    </div> -->
    <div class="right_report">
      <el-card class="box-card nobg">
        <!-- <ul>
                      <li>晚点5分钟以上列数和车次：<span>120001（5分钟）</span></li>
                      <li>停运列数：<span>3</span></li>
                      <li>掉线列数：<span>1</span></li>
                      <li>通过列数及车站：<span>1</span></li>
                      <li>中途折返及车站：<span>0</span></li>
                      <li>变更车次情况：<span>0</span></li>
                  </ul> -->
        <table class="selfTable">
          <tr class="thead">
            <th style="width: 33%">名称</th>
            <th>指标</th>
            <th style="width: 33%">备注</th>
          </tr>
          <tbody v-for="item in tableData" :key="item.id">
            <tr v-if="item.list == undefined">
              <td rowspan="1" colspan="1">{{ item.name }}</td>
              <td rowspan="1" colspan="1">{{ item.zhibiao }}</td>
              <td rowspan="1" colspan="1">{{ item.beizhu }}</td>
            </tr>
            <tr v-if="item.list && item.id == 'stationErrorInfo'">
              <td rowspan="1" colspan="3">
                <el-button @click="onFold">{{ foldText }}</el-button>
              </td>
            </tr>
            <tr
              id="sationError"
              v-for="(items, index) in item.list"
              v-if="
                (item.list &&
                  item.id == 'stationErrorInfo' &&
                  showflag == 1 &&
                  index > 0) ||
                index == 0 ||
                index == item.list.length - 1
              "
            >
              <td :rowspan="item.list.length" colspan="1" v-if="index == 0">
                {{ item.name }}
              </td>
              <td rowspan="1" colspan="1">{{ items.zhibiao }}</td>
              <td rowspan="1" colspan="1">
                站台名称:<b>{{ items.beizhu }}</b>
                <br />
                晚点时间:<b>{{ timeTrans(items.errorValue) }} </b>
                <br />
                晚点类型:<b>{{ items.errorType }}</b>
              </td>
            </tr>
            <tr
              v-for="(items, index) in item.list"
              v-if="item.list && item.id == 'tripErrorInfo'"
            >
              <td :rowspan="item.list.length" colspan="1" v-if="index == 0">
                {{ item.name }}
              </td>
              <td rowspan="1" colspan="1">{{ items.zhibiao }}</td>
              <td rowspan="1" colspan="1">
                晚点时间:<b>{{ timeTrans(items.errorValue) }} </b>
              </td>
            </tr>
          </tbody>
        </table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { registerCallback, unregisterCallback, sendSock, getPackage } from "@/utils/ws";
var timer;
import Msg from "@/components/msg.vue";
export default {
  name: "report",
  data() {
    return {
      tableData: [
        {
          id: "onTimeRate",
          name: "正点率",
          zhibiao: "",
          beizhu: "",
        },
        {
          id: "demandRate",
          name: "兑现率",
          zhibiao: "",
          beizhu: "",
        },
        {
          //2
          id: "stopTrainNumber",
          name: "停运列次",
          zhibiao: "",
          beizhu: "",
        },
        {
          //3
          id: "clearPassengerTripNumber",
          name: "清客列次",
          zhibiao: "",
          beizhu: "",
        },
        {
          //4
          id: "offlineTripNumber",
          name: "掉线列次",
          zhibiao: "",
          beizhu: "",
        },
        {
          //5
          id: "rescuedTripNumber",
          name: "被救援列次",
          zhibiao: "",
          beizhu: "",
        },
        {
          //6
          id: "tripErrorInfo",
          name: "总晚点信息",
          list: [],
        },
        {
          //7
          id: "departErrorTripNumber",
          name: "出发晚点列车数",
          zhibiao: "",
          beizhu: "",
        },
        {
          //8
          id: "arriveErrorTripNumber",
          name: "到达晚点列车数",
          zhibiao: "",
          beizhu: "",
        },
        {
          //9
          id: "tripErrorTripNumber",
          name: "总晚点列车数",
          zhibiao: "",
          beizhu: "",
        },
        {
          //10
          id: "tripErrorTripNumber5",
          name: "晚点5-15分钟列车数",
          zhibiao: "",
          beizhu: "",
        },
        {
          //11
          id: "tripErrorTripNumber15",
          name: "晚点15-30分钟列车数",
          zhibiao: "",
          beizhu: "",
        },
        {
          //12
          id: "tripErrorTripNumber30",
          name: "晚点30-45分钟列车数",
          zhibiao: "",
          beizhu: "",
        },
        {
          //13
          id: "tripErrorTripNumber45",
          name: "晚点45分钟以上列车数",
          zhibiao: "",
          beizhu: "",
        },
        {
          //14
          id: "stationErrorInfo",
          name: "始发晚点,到达晚点信息",
          list: [],
        },
        {
          //15
          id: "operationDisruptionTime",
          name: "运营中断时间",
          zhibiao: "",
          beizhu: "",
        },
        {
          //16
          id: "faultRecoveryTime",
          name: "故障恢复时间",
          zhibiao: "",
          beizhu: "",
        },
      ],
      showflag: 0,
      foldText: "始发晚点信息详情",
    };
  },
  components: {
    Msg,
  },
  created() {
    // let msgws = {
    //     msgType:143,
    //     data:'null'
    // }
    sendSock(getPackage(143, "null"));
    timer=setInterval(() => {
      sendSock(getPackage(143, "null"));
      console.log("-----143----------")
    }, 10000);
  },
  updated() {},
  mounted() {
    registerCallback("mainPage", this.wsCallbackMsg);
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    wsCallbackMsg(data) {
      console.log(data);
      //243回调
      if (data.msgType == 243) {
        for (const key in data.data) {
          for (let index = 0; index < this.tableData.length; index++) {
            if (key == this.tableData[index].id) {
              if (key == "stationErrorInfo") {
                this.tableData[index].list = [];
                for (let i = 0; i < data.data[key].length; i++) {
                  var tmp = {};
                  tmp.zhibiao = data.data[key][i].trainTripNumber;
                  tmp.beizhu = data.data[key][i].stationName;
                  tmp.errorValue = data.data[key][i].errorValue;
                  tmp.errorType =
                    data.data[key][i].errorType == 1 ? "1-出发晚点" : "2-到达晚点";
                  this.tableData[index].list.push(tmp);
                }
              } else if (key == "tripErrorInfo") {
                this.tableData[index].list = [];
                for (let i = 0; i < data.data[key].length; i++) {
                  var tmp = {};
                  tmp.zhibiao = data.data[key][i].trainTripNumber;
                  tmp.errorValue = data.data[key][i].errorValue;
                  this.tableData[index].list.push(tmp);
                }
              } else {
                this.tableData[index].zhibiao = data.data[key];
              }
            }
          }
        }
        //正点率，兑现率保留两位小数
        this.tableData[0].zhibiao = Number(this.tableData[0].zhibiao).toFixed(2);
        this.tableData[1].zhibiao = Number(this.tableData[1].zhibiao).toFixed(2);
        //正点率备注
        if (this.tableData[14].list.length > 0) {
          let tempData = JSON.parse(JSON.stringify(this.tableData[14].list));
          tempData.sort((a, b) => {
            return Number(b.errorValue) - Number(a.errorValue);
          });
          var maxError = tempData[0];
          let maxErrorTime;
          maxErrorTime = this.timeTrans(maxError.errorValue);
          this.tableData[0].beizhu = `最大延误车次:${maxError.zhibiao};\n 最大延误时间:${maxErrorTime}`;
        }
        //增加对应列车数量:index数据范围：2-5,7-13
        for (let i = 2; i < 6; i++) {
          if (this.tableData[i].zhibiao.length > 0) {
            const temp1 = `数量:${this.tableData[i].zhibiao.length};  车次:${this.tableData[i].zhibiao}`;
            this.tableData[i].zhibiao = temp1;
          } else {
            this.tableData[i].zhibiao = 0;
          }
        }
        for (let j = 7; j < 14; j++) {
          if (this.tableData[j].zhibiao.length > 0) {
            const temp2 = `数量:${this.tableData[j].zhibiao.length}; 
            车次:${this.tableData[j].zhibiao}`;
            this.tableData[j].zhibiao = temp2;
          } else {
            this.tableData[j].zhibiao = 0;
          }
        }
        //时间格式转化 数据索引15 16
        for (let k = 15; k < 17; k++) {
          const tempTime = this.tableData[k].zhibiao;
          this.tableData[k].zhibiao = this.timeTrans(tempTime);
        }
      }
    },

    onFold() {
      if (this.showflag == 0) {
        this.showflag = 1;
        this.foldText = "收起";
      } else {
        this.showflag = 0;
        this.foldText = "始发晚点信息详情";
      }
    },
    /**
     *时间转换秒-》时分
     *@param {Number} seconds 时间S
     */
    timeTrans(seconds) {
      let maxErrorTime;
      if (seconds > 60) {
        let m = parseInt(seconds / 60);
        let s = seconds % 60;
        maxErrorTime = `${m}分${s}秒`;
        // maxErrorTime=`${m}分${s}秒(${seconds}秒)`;
      } else {
        maxErrorTime = `${seconds}秒`;
      }
      return maxErrorTime;
    },
  },
  beforeDestroy() {
    unregisterCallback("mainPage");
    clearInterval(timer);
  },
};
</script>

<style scoped>
.report {
  padding: 10px 10px 0 0;
  display: flex;
  width: 100%;
}
.left_new {
  flex: 0 0 400px;
}
.el-card {
  margin: 0 0 20px 10px;
}
.el-card__body .el-radio--medium.is-bordered {
  padding: 10px 10px 0 5px;
  margin: 0 10px !important;
}
.report .right_report {
  flex-shrink: 2;
  width: 100%;
}
.report .right_report .el-card {
  min-height: 600px;
  line-height: 25px;
}

.selfTable {
  width: 100%;
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
  padding: 0px 5px;
  position: relative;
  word-wrap:break-word;
  word-break:break-all;
}
</style>
