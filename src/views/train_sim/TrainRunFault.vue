<template>
    <div class="main fault">
        <div class="left_new">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>操作</span>
                    <el-button style="float: right; padding: 3px 0" type="text">启动</el-button>
                </div>
                <!-- <div style="display:flex;justify-content:center">
                    <el-radio-group v-model="radio4" size="mini">
                        <el-radio label="1" border>正常运行</el-radio><br>
                        <el-radio label="2" border>单车延误（屏蔽门故障）</el-radio>
                        <el-radio label="3" border>单车降级（ATP故障）</el-radio>
                        <el-radio label="4" border>单车推出运营（PIS系统故障）</el-radio>
                        <el-radio label="5" border>多车延误（ZC故障）</el-radio>
                    </el-radio-group>
                </div> -->
                <!-- <h5>车站/区间/列车</h5> -->
                <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
                    <el-form-item label="故障">
                        <el-select v-model="formLabelAlign.fault" placeholder="请选择活动区域">
                            <el-option label="正常运行" value="0"></el-option>
                            <el-option label="单车延误（屏蔽门故障）" value="1"></el-option>
                            <el-option label="单车降级（ATP故障）" value="2"></el-option>
                            <el-option label="单车推出运营（PIS系统故障）" value="3"></el-option>
                            <el-option label="多车延误（ZC故障）" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="车次号">
                        <el-input v-model="formLabelAlign.name"></el-input>
                    </el-form-item>
                    <el-form-item label="选择车站">
                        <el-select v-model="formLabelAlign.region" placeholder="请选择活动区域">
                            <el-option label="北京西站" value="shanghai"></el-option>
                            <el-option label="北京站" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="持续时间">
                        <el-input v-model="formLabelAlign.type"></el-input>
                    </el-form-item>
                </el-form>
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

        <div class="main-right" style="padding-left:10px">
            <div style="overflow: hidden">
                <div class="drawArea"></div>
            </div>
            <div style="position: absolute; margin-top: 10px; margin-left:10px">
                <el-button type="primary"
                    size="mini"
                    style=" margin: 10px;"
                    @click="onRestLine">重置线路</el-button>
            </div>
            <div class="msgTip"
                style="visibility:hidden">
                <div v-for="(data, index) in tooltipData">
                    {{data.name}}：{{transTrainDataDisplay(data)}}
                </div>
            </div>
            <div class="info-panel">
                <div class="info"
                    v-if="currentFrame">
                    <div style="flex:1">
                        <span style="font-size:20px;font-weight:bold;color:#2fd991">列车</span>
                        <div class="train-panel">
                            <div class="model-list1"
                                v-for="(trainData, index) in currentFrame.bsTrainData">
                                <div v-for="(data, index) in getTrainInfo(trainData)">
                                    {{data.name}}：{{transTrainDataDisplay(data)}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="flex:2">
                        <span style="font-size:20px;font-weight:bold;color:#2fd991">车站</span>
                        <div class="station-panel">
                            <div class="model-list2"
                                v-for="(stationData, index) in currentFrame.bsStationStru">
                                <div v-for="(data, index) in getStationInfo(stationData)">
                                    {{data.name}}：{{data.value}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="time-axis">
                    <div class="slider">
                        <span style="margin:0 10px 0 10px;">{{formatTime(startTime)}}</span>
                        <el-slider style="flex:1"
                            :min="startTime"
                            v-model="currentTime"
                            :max="endTime"
                            :marks="marks"
                            :format-tooltip="formatTime"
                            @change="timeChange"></el-slider>
                        <span style="margin:0 10px 0 10px;">{{formatTime(endTime)}}</span>

                        <span style="margin:0 20px 0 10px;color:#2fd991;font-weight:bold">当前时间:{{formatTime(currentTime)}}</span>
                    </div>
                    <div class="handle">
                        <div class="player">
                            <el-button type="primary"
                                v-show="!timer"
                                size="small"
                                style=" margin: 10px;font-size:100%"
                                icon="icon-play"
                                circle
                                @click="onStart"></el-button>
                            <el-button type="primary"
                                v-show="timer"
                                size="small"
                                style=" margin: 10px;font-size:100%"
                                icon="icon-suspend"
                                circle
                                @click="onPause"></el-button>
                            <el-button type="primary"
                                size="small"
                                style=" margin: 10px;"
                                icon="icon-rectangle"
                                circle
                                @click="onStop"></el-button>
                            <span style="margin:0 20px 0 10px;color:#2fd991;font-weight:bold">当前倍速:{{speedRate}}</span>
                            <el-radio v-model="speedRate"
                                :label="1">x1</el-radio>
                            <el-radio v-model="speedRate"
                                :label="2">x2</el-radio>
                            <el-radio v-model="speedRate"
                                :label="4">x4</el-radio>
                            <el-radio v-model="speedRate"
                                :label="8">x8</el-radio>
                            <el-radio v-model="speedRate"
                                :label="16">x16</el-radio>
                            <el-radio v-model="speedRate"
                                :label="32">x32</el-radio>
                            <el-radio v-model="speedRate"
                                :label="64">x64</el-radio>
                            <el-radio v-model="speedRate"
                                :label="128">x128</el-radio>
                        </div>
                    </div>
                </div>
            </div>
            <div class="waring-panel"
                v-if="warningListArr && warningListArr.length>0">
                <p v-for="msg in warningListArrDisplay"
                    style="direction:ltr;">{{msg}}</p>
            </div>
        </div>
        <!-- <div class="waring-panel"
            v-if="warningList && warningList.length>0">
            <p v-for="msg in warningList">{{msg}}</p>
        </div> -->
    </div>
</template>

<script>
import * as joint from "jointjs";
import TopoPaper from "./TopoPaper";
import * as Utils from "@/utils/util";
import { getStationsObjIdProp } from "@/utils/station";
import {
    registerCallback,
    unregisterCallback,
    sendSock,
    getPackage,
} from "@/utils/ws";

export default {
    components: {},
    data() {
        return {
            radio4:'1',
            labelPosition: 'right',
            formLabelAlign: {
                fault:'正常运行',
                name: '12004',
                region: '北京西站',
                type: '20分钟'
            },
            paper: null,
            graph: null,
            g: null,
            V: null,
            joint: null,
            project: null,
            // --- 以下是新结构
            timer: null,
            direction: 0,
            tooltipData: [],
            currentFrame: null,
            stationMap: {},
            startTime: 0,
            endTime: 86400,
            currentTime: 0,
            speedRate: 1,
            marks: {},
            tick: -1,
            tickRate: 10,
            currentLine: null,
            warningList: [], // 旧结构，更改显示策略了，用warningListArr代替
            warningListArr: [],
            warningListArrDisplay: [],
            dataBuffer: [],
            packageLength: 300,
        };
    },
    created() {
        registerCallback("trainrun", this.wsCallback);
    },
    async mounted() {
        this.currentLine = sessionStorage.getItem("currentLine");
        if (this.currentLine) {
            let param = getPackage(138, {
                operaType: 2,
                lineName: this.currentLine,
            });
            sendSock(param);
            this.initJoint();
        }
    },
    methods: {
        initJoint() {
            window.joint = joint;
            this.V = joint.V;
            this.graph = new joint.dia.Graph();
            this.g = joint.g;

            let element = document.getElementsByClassName("drawArea");

            this.paper = new TopoPaper({
                el: element,
                model: this.graph,
                gridSize: 30,
                embeddingMode: true,
                width: 5000,
                height: 2000,
                background: {
                    color: "#001528",
                },
            });

            this.paper.initPaperEvent();
            this.paper.drawTopo(this.project, this.graph);
            this.paper.toolTip = this.setToolTip;
        },
        drawLine() {
            this.paper.model.clear();
            this.paper.drawTopo(this.project, this.graph);
            this.paper.toolTip = this.setToolTip;
            this.stationMap = getStationsObjIdProp(this.currentLine);
            this.paper.checkFsLinkMap(this.project);
        },
        onRestLine() {
            this.paper.reset();
        },
        onStart() {
            let mainThis = this;
            this.paper.clearTrain();
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                mainThis.getTimeRange();
                if (mainThis.currentTime > mainThis.endTime) {
                    mainThis.onStop();
                }
                // 行车
                this.trainRun();
            }, 1000);
        },
        onStop() {
            clearInterval(this.timer);
            this.timer = null;
            this.currentTime = this.startTime;
        },
        onPause() {
            clearInterval(this.timer);
            this.timer = null;
        },
        setToolTip(detail, position, show) {
            if (this.currentFrame && detail) {
                let needShow = false;
                if (detail.type == "tct.TopoTrain") {
                    let frame = this.currentFrame.bsTrainData.find((f) => {
                        return f.wTrainId == detail.tctData.tctId;
                    });
                    if (frame) {
                        this.tooltipData = [
                            {
                                name: "列车编号",
                                value: frame.wTrainId,
                            },
                            {
                                name: "列车方向",
                                value: frame.wTrainDir,
                            },
                            {
                                name: "列车速度",
                                value: frame.wV,
                            },
                            {
                                name: "列车班次",
                                value: frame.orderNum,
                            },
                            {
                                name: "乘客数量",
                                value: frame.passengerCount,
                            },
                            {
                                name: "列车满载率",
                                value: frame.loadRate00,
                            },
                        ];
                        needShow = true;
                    }
                } else if (detail.type == "tct.TopoStation") {
                    let frame = this.currentFrame.bsStationStru.find((f) => {
                        return f.wStationId == detail.tctData.tctId;
                    });
                    if (frame) {
                        this.tooltipData = [
                            {
                                name: "车站编号",
                                value: frame.wStationId,
                            },
                            {
                                name: "车站名称",
                                value: detail.tctData.name,
                            },
                            {
                                name: "乘客数量",
                                value: frame.passengerCount,
                            },
                        ];
                        needShow = true;
                    }
                }

                let dom = document.getElementsByClassName("msgTip")[0];
                if (dom) {
                    if (show && needShow) {
                        dom.style.left = position.x + 30 + "px";
                        dom.style.top = position.y + 15 + "px";
                        setTimeout(() => {
                            if (dom.style.visibility == "hidden") {
                                dom.style.visibility = "visible";
                                setTimeout(() => {
                                    dom.style.visibility = "hidden";
                                }, 3000);
                            }
                        }, 500);
                    } else {
                        dom.style.visibility = "hidden";
                    }
                }
            }
        },
        getTrainInfo(data) {
            if (!data) {
                return [];
            }
            return [
                {
                    name: "列车编号",
                    value: data.wTrainId,
                },
                {
                    name: "列车方向",
                    value: data.wTrainDir,
                },
                {
                    name: "列车速度",
                    value: data.wV,
                },
                {
                    name: "列车班次",
                    value: data.orderNum,
                },
                {
                    name: "乘客数量",
                    value: data.passengerCount,
                },
                {
                    name: "列车满载率",
                    value: data.loadRate00,
                },
            ];
        },
        getStationInfo(data) {
            console.log('--station--');
            console.log(data);
            if (!data) {
                return [];
            }
            return [
                {
                    name: "车站编号",
                    value: data.wStationId,
                },
                {
                    name: "车站名称",
                    value: this.stationMap[data.wStationId],
                },
                {
                    name: "乘客数量",
                    value: data.passengerCount,
                },
            ];
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
        timeChange(time) {
            this.currentTime = time;
            this.currentFrame = null;
            this.showInfo();
        },
        getTimeRange() {
            this.tick++;
            if (this.tick % this.tickRate == 0) {
                let p = getPackage(136, `${this.currentLine}`); // 0-86400
                console.log(p);
                sendSock(p);
            }
        },
        trainRun() {
            console.log("---run");
            if (!this.dataBuffer || this.dataBuffer.length == 0) {
                this.getRealData();
            } else {
                let findPackage = this.dataBuffer.find((p) => {
                    return p.wTime == this.currentTime;
                });

                if (!findPackage) {
                    this.getRealData(this.dataBuffer.length);
                } else {
                    this.currentFrame = findPackage;
                    this.paper.drawTrain(findPackage);
                    this.paper.updateStationColor(findPackage);
                    this.warningList = findPackage.strDeviInfo;
                    this.setInfo(findPackage);

                    this.currentTime += this.speedRate;

                    // 检查是否获取新数据
                    let index = this.dataBuffer.indexOf(findPackage);
                    if (this.dataBuffer.length - index < 4) {
                        this.getRealData(index);
                    }
                    // if (index > this.dataBuffer.length - 10 * this.speedRate) {
                    //     this.getRealData();
                    // }
                }
            }
        },
        getRealData(index) {
            if (index) {
                this.dataBuffer = this.dataBuffer.splice(0, index);
            }

            let p = getPackage(105, {
                startTime: this.currentTime,
                speedTimes: this.speedRate,
            }); // 0-86400
            sendSock(p);
        },
        transTrainDataDisplay(data) {
            let result = "";
            if (data) {
                if (data.name == "列车速度") {
                    let speed = (data.value / 1000) * 36;
                    result = parseInt(speed * 100) / 100 + " km/h";
                } else if (data.name == "列车方向") {
                    if (data.value == 0xaa) {
                        result = "下行";
                    } else if (data.value == 0x55) {
                        result = "上行";
                    } else {
                        result = "-";
                    }
                } else if (data.name == "列车满载率") {
                    result = data.value / 100 + " %";
                } else {
                    result = data.value;
                }
            }
            return result;
        },
        setInfo(data) {
            let findMsg = this.warningListArr.find((w) => {
                return w.wTime == data.wTime;
            });
            if (findMsg) {
                findMsg.list = data.strDeviInfo;
            } else {
                this.warningListArr.push({
                    wTime: data.wTime,
                    list: data.strDeviInfo,
                });
            }
            this.showInfo();
        },
        showInfo() {
            let info = [];
            if (this.warningListArr) {
                this.warningListArr.sort((a, b) => {
                    return a.wTime - b.wTime;
                });

                for (
                    let i = 0;
                    i < this.warningListArr.length &&
                    this.warningListArr[i].wTime < this.currentTime;
                    i++
                ) {
                    let data = this.warningListArr[i];
                    if (data.list) {
                        data.list.forEach((d) => {
                            info.push(`${this.formatTime(data.wTime)} ${d}`);
                        });
                    }
                }
            }
            this.warningListArrDisplay = info;
        },
        wsCallback(res) {
            if (res.msgType == 205) {
                let rundata = res.data.bsVtsDataVector;
                if (rundata.length > 0) {
                    this.dataBuffer = this.dataBuffer.concat(rundata);
                }
            } else if (res.msgType == 236) {
                let timeData = res.data;
                if (timeData) {
                    let marks = {};
                    marks[timeData.StartTime] = {
                        style: {
                            color: "#1989FA",
                        },
                        label: this.formatTime(timeData.StartTime),
                    };
                    marks[timeData.EndTime] = {
                        style: {
                            color: "#1989FA",
                        },
                        label: this.formatTime(timeData.EndTime),
                    };
                    this.marks = marks;
                }
            } else if (res.msgType == 238) {
                if (res.status != 1) {
                    this.$message({
                        message: res.msg,
                        type: "warning",
                    });
                    return;
                }
                let lineData = res.data;
                this.project = JSON.parse(lineData.strJsonData);
                this.drawLine();
            }
        },
    },
    beforeDestroy() {
        unregisterCallback("trainrun");
        this.onStop();
    },
};
</script>

<style scoped>
.fault .el-radio.is-bordered+.el-radio.is-bordered{margin-left: 0;}
.fault .el-radio--mini.is-bordered{margin-bottom: 10px;}
.fault .el-select{width: 268px;}
.main {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    height: calc(100vh - 50px);
    /* padding: 10px; */
}

.main-right {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.drawArea {
    height: 400px;
}

.setting-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 5px 0px;
    font-size: 10px;
}

.msgTip {
    width: 250px;
    background-color: #194a99;
    color: #fff;
    text-align: left;
    padding: 5px 5px 5px 10px;
    border-radius: 6px;
    position: absolute;
    z-index: 1;
    margin-top: 0px !important;
}

.info-panel {
    position: absolute;
    width: calc(100% - 20px);
    background-color: #194a9944;
    color: #fff;
    text-align: left;
    border-radius: 6px;
    z-index: 1;
    bottom: 10px !important;
    display: flex;
    flex-direction: column;
}

.time-axis {
    height: 100px;
    background-color: #194a9944;
}

.slider {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.handle {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.info {
    display: flex;
    height: 100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
}

.train-panel {
    border: rgb(47, 217, 145) 2px solid;
    border-radius: 10px;
    height: 240px;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    margin: 5px 10px 5px 0;
}

.station-panel {
    border: rgb(47, 217, 145) 2px solid;
    border-radius: 10px;
    height: 240px;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    margin: 5px 20px 5px 0;
}

/* .waring-panel {
    position: absolute;
    left: 20px;
    bottom: 420px;
}

.waring-panel p {
    color: orange;
    font-weight: bold;
    font-size: 20px;
    margin: 0px 0 0 10px;
} */

.waring-panel {
    position: absolute;
    left: 20px;
    bottom: 420px;
    height: 200px;
    min-width: 250px;
    overflow: auto;
    direction: rtl;
}

.waring-panel p {
    color: orange;
    font-weight: bold;
    font-size: 14px;
    margin: 0px 0 0 10px;
}

.model-list1 {
    background-color: #194a9999;
    color: #fff;
    text-align: left;
    padding: 5px 5px 5px 10px;
    border-radius: 6px;
    margin: 10px;
    width: 260px;
}

.model-list2 {
    background-color: #2fd99155;
    color: #fff;
    text-align: left;
    padding: 5px 5px 5px 10px;
    border-radius: 6px;
    margin: 10px;
    width: 210px;
}

.inner-header {
    height: 100%;
    width: 100%;
}

.el-input {
    flex: 1;
    height: 25px;
}

.el-input__inner {
    flex: 1;
    height: 25px;
}

.el-input >>> .el-input__inner {
    -web-kit-appearance: none;
    -moz-appearance: none;
    font-size: 1em;
    border-radius: 2;
    border: 1px solid #dcdfe6;
    color: #606266;
    height: 25px;
    padding: 0 5px;
}

.el-input >>> .el-input__inner:focus {
    -web-kit-appearance: none;
    -moz-appearance: none;
    font-size: 1em;
    border-radius: 2;
    border: 1px solid #628fe9;
    color: #606266;
    outline: 0;
    height: 25px;
    padding: 0 5px;
}

.el-select {
    flex: 1;
    height: 25px;
    width: 150px;
}

.el-select >>> .el-input__inner {
    -web-kit-appearance: none;
    -moz-appearance: none;
    font-size: 1em;
    border-radius: 2;
    border: 1px solid #dcdfe6;
    color: #606266;
    height: 35px;
    padding: 0 15px;
}

.el-select >>> .el-input__icon {
    line-height: 20px;
}

.el-select--mini {
    flex: 1;
    height: 25px;
}

.el-input >>> .el-inout__suffix {
    height: 25px;
}

.el-checkbox >>> .el-checkbox__label {
    font-size: 10px;
}

.el-table >>> td {
    padding: 3px 3px;
}

.module-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 10px;
    padding: 10px;
    border: 0px solid #666;
    background: #efefef;
    height: 100%;
    width: 380px;
    overflow-y: auto;
}

.module-inner-left {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}

.el-tabs >>> .el-tabs__new-tab {
    float: right;
    border: 1px solid #1d6dc5;
    height: 22px;
    width: 22px;
    line-height: 22px;
    margin: 12px 0 9px 10px;
    border-radius: 3px;
    text-align: center;
    font-size: 12px;
    color: #eee;
    background: rgb(64, 158, 255);
    cursor: pointer;
    -webkit-transition: all 0.15s;
    transition: all 0.15s;
}

.testclass :hover {
    fill: red;
    stroke: red;
}

.left_new{width: 400px;padding: 10px 0 0 0;}
.el-card {margin: 0 0 20px 10px;}
.el-card__body .el-radio--medium.is-bordered{padding:10px 10px 0 5px;margin:0 10px !important}

</style>

