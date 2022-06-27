<template>
    <div class="shiji dashboard-container edittable">
        <!-- <el-button @click="drewPlan()" style="position:absolute;z-index:99999">默认按钮</el-button> -->
        <!-- <rungrap ref="grap" :rungrapData="rungrapData" /> -->
        <div class="left-panel" style="z-index:100">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>操作</span>
                    <el-button style="float: right; padding: 3px 0" type="text">暂停</el-button>
                </div>
                <div style="display:flex;justify-content:center">
                    <el-radio v-model="radio2" label="1" border size="medium">1倍速</el-radio>
                    <el-radio v-model="radio2" label="2" border size="medium">2倍速</el-radio>
                    <el-radio v-model="radio2" label="3" border size="medium">4倍速</el-radio>
                    <el-radio v-model="radio2" label="4" border size="medium">最高速</el-radio>
                </div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>消息</span>
                </div>
                <div style="text-align:left">
                    <ul>
                        <li>打开运行图成功。。。。</li>
                        <li>运行图名称：北京轨道交通验方线</li>
                        <li>00:00:00 xx 发生紧急制动</li>
                        <li>00:00:00 - 00:02:00 扣故障区外即将进入该控区相邻车站</li>
                        <li>00:00:00 - 00:02:00 扣故障区外即将进入该控区相邻车站</li>
                        <li>00:00:00 - 00:02:00 扣故障区外即将进入该控区相邻车站</li>
                    </ul>
                </div>
            </el-card>
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
        <rungrap ref="grap" :rungrapData="rungrapData" />
    </div>
</template>

<script>
import rungrap from "./lib_common_new";
import {getStations} from '@/utils/station';

// import DiagramReal from "../../../components/DiagramRealLocal.vue";
// import testData from "../../../components/testData";
// import testStations from "../../../components/stations";

export default {
    name: "Rungrap",
    data() {
        return {
            radio2:1,
            lineName: "北京燕房线",
            currentTime: new Date().toLocaleString(),
            startTime: 0,
            endTime: 1020,
            diagramConfig: {
                stationHeight: 50,
                bottomBlockHeight: 30,
                topBlockHeight: 100,
                sideWidth: 100,
            },
            first: true,
            // stations: testStations,
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
            listRealMsg:[{
                msg:"你好",
                type:"info"
            },{
                msg:"你好",
                type:"error"
            },{
                msg:"你好",
                type:"warning"
            }]
        };
    },
    components: {
        // DiagramReal
        rungrap
    },
    computed: {
        currentTimeFormat() {
            let h = parseInt(this.currentTime / 3600);
            let m = parseInt((this.currentTime % 3600) / 60);
            let s = parseInt((this.currentTime % 3600) % 60);
            return `${parseInt(h / 10)}${h % 10}:${parseInt(m / 10)}${
                m % 10
            }:${parseInt(s / 10)}${s % 10}`;
        },
    },
    created() {
        var self = this;
        this.rungrapData = {}
        var data = {
            msgId: 1,
            msgType: 103,
            requestId: "12345678",
            session: this.$getCurrentDate(),
            timestamp: this.$getCurrentDate(),
            data: 2,
        };

        this.rungrapData.multiply = this.$route.meta.type;
        let currentLine = sessionStorage.getItem("currentLine");
        this.rungrapData.station=getStations(currentLine);
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
    },
    mounted() {
        // this.ws.registerCallback("mainPage", this.wsCallback);
        // this.sendPackage("line-info");
        // this.sendPackage("plan-diagram");
        // this.sendPackage("scheme-diagram");

        // this.getData();
    },
    methods: {
        getRungrapClick(params) {
            console.log(params);
        },
        drewPlan() {
            this.$refs.grap.drewPlan();
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
        wsCallback(data) {
            return false;
            if (data.msgType == 3003) {
                // 线路车站信息
                this.transAppInfo(JSON.parse(data.data));
            } else if (data.msgType == 3002) {
                // 计划运行图
                this.transPlanData(JSON.parse(data.data));
            } else if (data.msgType == 2002) {
                // 【现场】故障信息
                this.transFaultData(JSON.parse(data.data));
            } else if (data.msgType == 2004) {
                // 【现场】实时信息
                this.transRealtimeData(JSON.parse(data.data));
            } else if (data.msgType == 3004) {
                // 【现场】预测信息
                this.transForecastData(JSON.parse(data.data));
            } else if (data.msgType == 4001) {
                // TODO 运行指标信息
                // 暂时没有接口
            } else if (data.msgType == 4002) {
                // 【方案】计划图
                let d = JSON.parse(data.data);
                let findP = this.solutions.find((s) => {
                    return s.planNo == d.planNo;
                });

                let index = this.solutions.indexOf(findP);
                if (index == -1) {
                    this.solutions.push(d);
                    index++;
                }

                this.$nextTick(() => {
                    let component = this.$refs.PlanDiagram[index];
                    if (component) {
                        let planTripArr = [];
                        console.log(d);
                        let planServes = d.graphData.serveList;
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
                                        loadrate: parseInt(strArr[4]),
                                        laterate: parseInt(strArr[5]),
                                        late: parseInt(strArr[6]),
                                    });
                                });
                                planTripArr.push(trip);
                            });
                        });
                        component.setPlanData(planTripArr);
                    }
                });
            } else if (data.msgType == 4003) {
                // TODO 【方案】实际图
                let d = JSON.parse(data.data);
                let index = this.solutions.indexOf(d.planNo);
                if (index == -1) {
                    this.solutions.push(d.planNo);
                    index++;
                }

                this.$nextTick(() => {
                    let component = this.$refs.PlanDiagram[index];
                    if (component) {
                        let realTripArr = [];
                        console.log(d);
                        d.graphData.serveList.forEach((serve) => {
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
                                });
                                realTripArr.push(trip);
                            });
                        });
                        component.setRealData(realTripArr);
                    }
                });
            }
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
                let d = this.ws.getPackage(
                    "business.actual",
                    1002,
                    "更新运行图"
                );
                this.ws.sendSock(d);
            } else if (handle == "line-info") {
                let d = this.ws.getPackage(
                    "business.actual",
                    1003,
                    "请求线路车站信息"
                );
                this.ws.sendSock(d);
            } else if (handle == "plan-diagram") {
                let d = this.ws.getPackage(
                    "business.actual",
                    1004,
                    "请求计划运行图"
                );
                this.ws.sendSock(d);
            } else if (handle == "scheme-diagram") {
                let d = this.ws.getPackage(
                    "business.plan",
                    1005,
                    "请求方案计划图"
                );
                this.ws.sendSock(d);
            } else if (handle == "init") {
                // this.$router.go(0);
                location.reload();
            }
        },
    },
    beforeDestroy() {
        this.rungrapData = {}
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
.left-panel {
    width: 400px;
    height: calc(100% - 62px);
    float: left;
    /* left: -50px; */
}
.shiji .el-card{margin: 10px 0 0 10px;}
.shiji .el-radio.is-bordered+.el-radio.is-bordered,.shiji .el-radio--medium.is-bordered,.shiji .el-radio.is-bordered+.el-radio.is-bordered{margin:0 5px;padding: 10px 10px 0 5px;}
</style>
