<template>
    <div class="operation-box">
        <div class="operation-left"
            ref="operationLeft">
            <img src="../../../assets/basie/left.png"
                v-if="showLeftDom"
                title="隐藏"
                alt="隐藏"
                class="right-img"
                @click="hideAllLeft()">
            <div class="radio-line">
                <el-radio-group v-model="radio1"
                    size="small"
                    class="radio-box">
                    <el-radio-button label="基于行车计划"></el-radio-button>
                    <el-radio-button label="基于客流"></el-radio-button>
                </el-radio-group>
            </div>
            <div class="btn-line"
                style="display: none;">
                <el-button size="small"
                    type="primary"
                    @click.native="goPage(1)"
                    plain>首末车时间</el-button>
                <el-button size="small"
                    type="primary"
                    @click.native="goPage(2)"
                    plain>运行时间及等级</el-button>
                <el-button size="small"
                    type="primary"
                    @click.native="goPage(3)"
                    plain>线路信息</el-button>
                <el-button size="small"
                    type="primary"
                    @click.native="goPage(4)"
                    plain>交路设计</el-button>
                <el-button size="small"
                    type="primary"
                    @click.native="goPage(5)"
                    plain>段场收发车限制</el-button>
                <el-button size="small"
                    type="primary"
                    @click.native="goPage(6)"
                    plain>运用列车数限制</el-button>
                <el-button size="small"
                    type="primary"
                    @click.native="goPage(7)"
                    plain>通行能力限制</el-button>
                <el-button size="small"
                    type="primary"
                    @click.native="goPage(8)"
                    plain>施工天窗限制</el-button>
                <el-button size="small"
                    type="primary"
                    @click.native="goPage(9)"
                    plain>其它相关限制</el-button>
            </div>
            <div class="select-line">
                <el-select v-model="departureStationValue"
                    placeholder="请选择"
                    size="small">
                    <el-option v-for="item in departureStationOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="table-line">
                <el-table border
                    :data="tableData"
                    style="width: 100%;"
                    max-height="700">
                    <el-table-column prop="startTime"
                        label="起始时间"
                        align="center"
                        min-width="120">
                        <template slot-scope="scope">
                            <span v-if="!edit">{{scope.row.startTime}}</span>
                            <el-time-picker v-model="scope.row.startTime"
                                value-format="HH:mm:ss"
                                :clearable=false
                                v-if="edit"
                                placeholder="选择时间">
                            </el-time-picker>
                        </template>
                    </el-table-column>
                    <el-table-column prop="endTime"
                        label="终止时间"
                        align="center"
                        min-width="120">
                        <template slot-scope="scope">
                            <span v-if="!edit">{{scope.row.endTime}}</span>
                            <el-time-picker v-model="scope.row.endTime"
                                value-format="HH:mm:ss"
                                :clearable=false
                                v-if="edit"
                                placeholder="选择时间">
                            </el-time-picker>
                        </template>
                    </el-table-column>
                    <el-table-column prop="trainRunNum1"
                        align="center"
                        label="上行列车开行数量"
                        min-width="120">
                        <template slot-scope="scope">
                            <span v-if="!edit">{{scope.row.trainRunNum1}}</span>
                            <el-input v-model="scope.row.trainRunNum1"
                                v-if="edit"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="runLevel1"
                        align="center"
                        label="上行运行等级"
                        min-width="120">
                        <template slot-scope="scope">
                            <span v-if="!edit">{{scope.row.runLevel1}}</span>
                            <el-input v-model="scope.row.runLevel1"
                                v-if="edit"></el-input>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="dir1" align="center" label="上行方向" min-width="120">
                        <template slot-scope="scope">
                            <span v-if="!edit">{{scope.row.dir1}}</span>
                            <el-input v-model="scope.row.dir1" v-if="edit"></el-input>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="trainRunNum0"
                        align="center"
                        label="下行列车开行数量"
                        min-width="120">
                        <template slot-scope="scope">
                            <span v-if="!edit">{{scope.row.trainRunNum0}}</span>
                            <el-input v-model="scope.row.trainRunNum0"
                                v-if="edit"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="runLevel0"
                        align="center"
                        label="下行列车等级"
                        min-width="120">
                        <template slot-scope="scope">
                            <span v-if="!edit">{{scope.row.runLevel0}}</span>
                            <el-input v-model="scope.row.runLevel0"
                                v-if="edit"></el-input>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="dir0" align="center" label="下行方向" min-width="120">
                        <template slot-scope="scope">
                            <span v-if="!edit">{{scope.row.dir0}}</span>
                            <el-input v-model="scope.row.dir0" v-if="edit"></el-input>
                        </template>
                    </el-table-column> -->
                    <el-table-column align="center"
                        label="操作"
                        min-width="120"
                        v-if="deleteData">
                        <template slot-scope="scope">
                            <el-button type="danger"
                                icon="el-icon-delete"
                                circle
                                @click="deleteTableData(scope)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="btn-line-2">
                <el-button type="primary"
                    size="small"
                    @click="addTable()">添加条数</el-button>
                <el-button type="success"
                    size="small"
                    @click="resetRungrap()">铺画</el-button>
            </div>
        </div>
        <div class="operation-middle"
            ref="operationMiddle">
            <img src="../../../assets/basie/left.png"
                title="显示"
                alt="显示"
                v-if="!showLeftDom"
                class="left-img"
                @click="showleft">
            <img src="../../../assets/basie/right.png"
                title="显示1"
                alt="显示1"
                v-if="showLeftDom"
                class="left-img"
                @click="hideLeft">
            <!-- <img src="../../../assets/basie/right.png" title="显示" alt="显示" v-if="!showRightDom" class="right-img"
                @click="hideLeft"> -->
            <h3>列车运行图</h3>
            <div class="img-container">
                <!-- <img src="../../../assets/basie/linePic.jpg" /> -->
                <rungrap ref="grap"
                    :rungrap-data="rungrapData" />
            </div>
            <div class="btn-line-3">
                <el-button type="primary"
                    size="small">保存</el-button>
                <el-button type="primary"
                    size="small">常规指标</el-button>
                <el-button type="primary"
                    size="small">导出运营图</el-button>
                <el-button type="primary"
                    size="small">生成时刻表</el-button>
                <el-button type="primary"
                    size="small">运行仿真</el-button>
                <el-button type="primary"
                    size="small">生成系统文件</el-button>
            </div>
        </div>
        <!-- 列车车次详情 -->
        <div class="operation-right"
            ref="operationRight">
            <div style="padding:20px;">
                <img src="../../../assets/basie/right.png"
                    title="隐藏"
                    alt="隐藏"
                    v-if="showRightDom"
                    class="right-img"
                    @click="hideRight">
                <p class="train-text">车次号：{{paramsData.tripNo}}</p>
                <div class="table-line">
                    <el-table border
                        :data="paramsData.list"
                        style="width: 100%;">
                        <el-table-column prop="number"
                            label="车站识别号"
                            align="center"
                            width="130 ">
                        </el-table-column>
                        <el-table-column prop="stationId"
                            align="center"
                            label="车站名">
                        </el-table-column>
                        <el-table-column prop="arriveTime"
                            align="center"
                            label="到点">
                        </el-table-column>
                        <el-table-column prop="departTime"
                            align="center"
                            label="发点">
                        </el-table-column>
                        <el-table-column prop="stationTrack"
                            align="center"
                            label="股道号">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import rungrap from "./lib_common";
import { getStations } from "@/utils/station";
import {
    registerCallback,
    unregisterCallback,
    sendSock,
    getPackage,
} from "@/utils/ws";
export default {
    name: "operation",
    data() {
        return {
            hackReset: true,
            wuyong: 0,
            num: 0,
            edit: true,
            deleteData: true,
            paramsData: {},
            rungrapData: {},
            radio1: "基于行车计划",
            showRightDom: false, // 是否显现右侧内容
            showLeftDom: false, // 是否显现左侧内容
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
                },
            ],
        };
    },
    components: {
        rungrap,
    },
    created() {
        registerCallback("operation", this.wsCallback);
        var self = this;

        // 是否显示客流情况
        this.rungrapData.multiply = this.$route.meta.type;

        let currentLine = sessionStorage.getItem("currentLine");
        self.rungrapData.station = getStations(currentLine);

        // *配置上下行线路及坐标主颜色，组件内已默认，可自定义设置
        this.rungrapData.colors = ["#5793f3", "#d14a61"];
    },
    beforeDestroy() {
        unregisterCallback("operation");
    },
    methods: {
        goPage(num) {
            this.$router.push({
                name: "trainNumber",
                params: {
                    page: num,
                },
            });
            this.$router.push({});
        },
        hideAllLeft() {
            let leftDom = this.$refs.operationLeft;
            // let middleDom = this.$refs.operationMiddle
            // middleDom.style.opacity = 1
            // middleDom.style.flex = 2
            // middleDom.style.padding = '20px'
            leftDom.style.flex = 0;
            leftDom.style.opacity = 0;
            this.showLeftDom = false;
        },
        hideLeft() {
            let leftDom = this.$refs.operationLeft;
            let middleDom = this.$refs.operationMiddle;
            middleDom.style.opacity = 1;
            middleDom.style.flex = 2;
            middleDom.style.padding = "20px";
            leftDom.style.flex = 1;
            leftDom.style.opacity = 1;
            this.showLeftDom = false;
        },
        showleft() {
            let leftDom = this.$refs.operationLeft;
            let middleDom = this.$refs.operationMiddle;
            middleDom.style.opacity = 1;
            middleDom.style.flex = 1;
            leftDom.style.flex = 0;
            leftDom.style.opacity = 0;
            this.showLeftDom = true;
            this.showRightDom = false;
        },
        hideRight() {
            let rightDom = this.$refs.operationRight;
            rightDom.style.flex = "0";
            rightDom.style.opacity = "0";
            this.showRightDom = false;
        },
        showRight() {
            let rightDom = this.$refs.operationRight;
            rightDom.style.flex = "1";
            rightDom.style.opacity = "1";
            let middleDom = this.$refs.operationMiddle;
            middleDom.style.opacity = 1;
            middleDom.style.flex = 2;
            this.showRightDom = true;
        },
        getRungrapClick(params) {
            this.showRight();
            this.hideAllLeft();
            this.showLeftDom = true;
            this.paramsData = params;
        },
        addTable() {
            this.tableData.push({
                startTime: "00:00:00",
                endTime: "00:00:00",
                trainRunNum1: 10,
                runLevel1: 1,
                dir1: 80,
                trainRunNum0: 10,
                runLevel0: 1,
                dir0: 170,
            });
            this.deleteData = true;
        },
        deleteTableData(params) {
            this.tableData.splice(params.$index, 1);
            if (this.tableData.length <= 1) {
                this.deleteData = false;
            }
        },
        resetRungrap() {
            var self = this;
            let data = {};
            data.routingTrainRunNums = [];
            data.routingTrainRunNums[0] = {};
            data.routingTrainRunNums[0].routingId = 1;
            data.routingTrainRunNums[0].trainRunNums = [];

            self.hideLeft();
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
                        changeData[index][key] = returnTime(
                            changeData[index][key]
                        );
                    }
                }
            }
            data.routingTrainRunNums[0].trainRunNums = changeData;

            console.log("send 702");
            let param = getPackage(702, data);
            sendSock(param);
        },
        wsCallback(res) {
            let self = this;
            if (res.msgType == 802) {
                console.log("--802");
                console.log(res);
                if (res.data) {
                    this.wuyong++;
                    this.hackReset = false;
                    self.$nextTick(() => {
                        self.hackReset = true;
                        setTimeout(() => {
                            self.$refs.grap.initData(res.data.serveList);
                        }, 500);
                    });
                    return;
                }
            }
        },
    },
};
</script>

<style lang="scss">
.operation-box {
    font-size: 12px;
    display: flex;

    .operation-left {
        flex: 1;
        transition: all 0.5s;
        overflow: hidden;
        height: calc(100vh - 50px);
        background-color: #fff;
        position: relative;

        .right-img {
            position: absolute;
            top: 0;
            right: 0px;
            width: 20px;
            cursor: pointer;
        }
    }

    .operation-right {
        flex: 0;
        transition: all 0.5s;
        overflow: hidden;
        background-color: #fff;
        height: 100px;
        height: calc(100vh - 50px);
        box-sizing: border-box;
        position: relative;

        .table-line {
            width: 100% !important;
            height: calc(100vh - 120px);
            overflow-y: auto;
        }

        .right-img {
            position: absolute;
            top: 0;
            left: 0px;
            width: 20px;
            cursor: pointer;
        }

        .train-text {
            line-height: 30px;
            color: #575d6c;
        }
    }

    .operation-middle {
        flex: 0;
        opacity: 0;
        transition: all 0.5s;
        overflow: hidden;
        background-color: #f2f2f2;
        height: 100px;
        height: calc(100vh - 50px);
        padding: 20px 0;
        box-sizing: border-box;
        position: relative;

        .right-img {
            position: absolute;
            top: 0;
            right: 0px;
            width: 20px;
            cursor: pointer;
        }

        .left-img {
            position: absolute;
            top: 0;
            left: 0px;
            width: 20px;
            cursor: pointer;
        }

        h3 {
            line-height: 30px;
            font-size: 18px;
            padding-bottom: 10px;
            font-weight: bold;
            color: #575d6c;
        }

        .btn-line-3 {
            text-align: center;

            .el-button {
                width: 130px;
                margin-top: 10px;
                margin-right: 10px;
                margin-left: 10px;
            }
        }

        .img-container {
            height: calc(100vh - 160px);
            background-color: #fff;
        }
    }

    .radio-line {
        text-align: center;
        padding: 20px 0;
    }

    .select-line {
        width: 94%;
        margin: 0 auto 20px;
    }

    .btn-line {
        padding: 10px 0px;
        text-align: center;

        .el-button {
            width: 29%;
            margin-left: 4px;
            margin-right: 4px;
            margin-bottom: 10px;
        }
    }

    .btn-line-2 {
        width: 94%;
        padding: 20px 0;
        margin: 0 auto;
        text-align: right;

        // .el-button {
        //     width: 140px;
        // }
    }

    .table-line {
        width: 94%;
        margin: 0 auto;

        .cell {
            font-size: 12px;
            padding: 0 !important;
        }

        th {
            background-color: #f8f8f8;
        }
    }

    .radio-box {
        width: 90%;

        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
            background-color: #526ecc;
            border-color: #526ecc;
            -webkit-box-shadow: -1px 0 0 0 #526ecc;
            box-shadow: -1px 0 0 0 #526ecc;
        }

        .el-radio-button {
            width: 50%;
        }

        .el-radio-button__inner {
            width: 100%;
        }

        .el-radio-button:last-child .el-radio-button__inner {
            border-radius: 0 20px 20px 0;
        }

        .el-radio-button:first-child .el-radio-button__inner {
            border-radius: 20px 0px 0px 20px;
        }
    }

    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
        width: auto;
    }
    .el-input--prefix .el-input__inner {
        padding-right: 5px;
    }
    .el-input {
        padding: 0 5px;
    }
}

.img-container {
    overflow-x: auto;
}

// .all {
//     min-height: 970px !important;
// }
.operation-box .table-line .cell {
    font-size: 14px;
}
.table-line .el-input__inner {
    border: none;
}
</style>