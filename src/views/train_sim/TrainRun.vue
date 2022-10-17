<template>
    <div class="main"
        v-loading="loading">
        <div class="left_new shiji" style="height:fit-content;display:none">
            <el-tabs style="flex:1;margin:0 10px 10px 0;background:#304156;max-height: 380px;overflow:auto;"
                type="border-card"
                v-model="activeName">
                <el-tab-pane label="倍速" 
                    name="倍速">

                    <div style="display:flex;justify-content:center;max-height:100px">
                        <el-select v-model="sim_speed" size="medium" style="flex:1;max-width:150px;">
                            <el-option :value="1" label="倍速x1"></el-option>
                            <el-option :value="2" label="倍速x2"></el-option>  
                            <el-option :value="4" label="倍速x4"></el-option>
                            <el-option :value="8" label="倍速x8"></el-option>  
                            <el-option :value="16" label="倍速x16"></el-option>
                            <el-option :value="32" label="倍速x32"></el-option>
                            <el-option :value="64" label="倍速x64"></el-option> 
                            <el-option :value="100" label="最大倍速"></el-option>   
                        </el-select>
                        <el-button style="margin-left:20px" type="primary"
                        size="medium" @click="changeSimSpeed">设置</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="列车"
                    name="列车">
                    <div style="height:67vh;display:flex;flex-direction:column;justify-content:flex-start;">
                        <el-form>
                            <el-form-item label="车组号"
                                label-width="75px">
                                <el-input style="width:160px"
                                    value="140C"></el-input>
                                <el-button type="primary"
                                    style="width:110px"
                                    size="mini">修改运行</el-button>
                            </el-form-item>
                            <el-form-item label="车次号"
                                label-width="75px">
                                <template>
                                    <div>
                                        <el-radio v-model="diao2"
                                            label="d1">
                                            <el-input value="12001"
                                                style="width:135px"></el-input>
                                            <el-button type="primary"
                                                style="width:110px"
                                                size="mini">查询车次号</el-button>
                                        </el-radio>
                                    </div>
                                    <el-radio v-model="diao2"
                                        label="d2">头码车</el-radio>
                                </template>
                            </el-form-item>
                            <el-form-item label="起始站台"
                                label-width="75px">
                                <el-input style="width:160px"
                                    value="北安河上行"></el-input>
                            </el-form-item>
                            <el-form-item label="终点站台"
                                label-width="75px">
                                <el-input style="width:160px"
                                    value="稻香湖上行"></el-input>
                            </el-form-item>
                            <el-form-item label="发车时间"
                                label-width="75px">
                                <el-input style="width:160px"
                                    value="12:25:03"></el-input>
                            </el-form-item>
                        </el-form>
                        <el-table style="flex:1;height:100%;overflow-y: auto;"
                            border
                            :data="diao3">
                            <el-table-column prop="d1"
                                label="站台名称">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.d1"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="d2"
                                label="站停时间">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.d2"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="命令">
                                <template slot-scope="scope">
                                    <el-checkbox-group v-model="scope.row.d3">
                                        <el-checkbox label="跳停"></el-checkbox>
                                        <el-checkbox label="扣车"></el-checkbox>
                                        <el-checkbox label="清客"></el-checkbox>
                                        <el-checkbox label="回库"></el-checkbox>
                                    </el-checkbox-group>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                </el-tab-pane>
                <el-tab-pane label="站台"
                    name="站台">
                    <el-form>
                        <el-form-item label="站台编号">
                            <el-input style="width:180px"
                                value="23"></el-input>
                        </el-form-item>
                        <el-form-item label="站台名称">
                            <el-input style="width:180px"
                                value="温阳路上行站台"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-checkbox-group v-model="diao1">
                        <el-checkbox label="跳停"></el-checkbox>
                        <el-checkbox label="扣车"></el-checkbox>
                        <el-checkbox label="清客"></el-checkbox>
                        <!-- <el-checkbox label="下线"></el-checkbox> -->

                    </el-checkbox-group>

                    <el-button type="primary"
                        size="mini"
                        style="float:right;margin:20px">下发命令</el-button>
                </el-tab-pane>
            </el-tabs>

            <Msg ref="msg"
                :trainrun="true" />
        </div>
        <div class="main-right">
            <div style="overflow: hidden">
                <div class="drawArea"></div>
            </div>
        </div>

        <div style="position: absolute; margin-top: 10px; margin-left:430px">
            <el-button v-show="!setTmpLimit"
                type="primary"
                size="mini"
                style=" margin: 10px;"
                @click="onRestLine">重置线路</el-button>
            <el-button v-show="!setTmpLimit"
                type="primary"
                size="mini"
                style=" margin: 10px;"
                @click="scaleVisible=true">比例缩放</el-button>
            <el-radio-group v-show="!setTmpLimit"
                v-model="runmode"
                size="mini"
                style=" margin: 10px;"
                >
                 <!-- @change="onStart" -->
                <el-radio-button label="实时模式"></el-radio-button>
                <el-radio-button label="历史模式"></el-radio-button>
            </el-radio-group>
            <el-button v-show="!setTmpLimit"
                type="primary"
                size="mini"
                style=" margin: 10px;"
                @click="changeLimitMode(true)">设置临时限速</el-button>

            <el-button v-show="setTmpLimit"
                type="danger"
                size="mini"
                style=" margin: 10px;"
                @click="changeLimitMode(false)">取消设置</el-button>

            <el-button v-show="setTmpLimit"
                type="success"
                size="mini"
                style=" margin: 10px;"
                @click="prepareApplyLimit">应用临时限速</el-button>
        </div>

        <span style="cursor:default; position: absolute; padding:0 10px; margin-left:1200px;background:#409EFF;color:white;font-weight:bold;font-size:50px">{{formatTime(currentTime)}}</span>

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
                            <p style="color:#fc0000"
                                v-if="trainData.abnormal">{{trainData.abnormal}}</p>
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
            <div class="time-axis"
                v-if="runmode==='历史模式'">
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

        <!-- <div class="waring-panel"
            v-if="warningList && warningList.length>0">
            <p v-for="msg in warningList">{{msg}}</p>
        </div> -->
        <div class="waring-panel"
            v-if="warningListArr && warningListArr.length>0">
            <p v-for="msg in warningListArrDisplay"
                style="direction:ltr;">{{msg}}</p>
        </div>

        <el-dialog title="设置线路缩放"
            :visible.sync="scaleVisible"
            width="30%">
            <el-form label-width="80px">
                <span>根据需要,设置水平和垂直方向的缩放比例。有效值是大于0的数值</span>
                <el-form-item label="水平(X)">
                    <el-input v-model="scaleX"
                        placeholder="水平缩放值"></el-input>
                </el-form-item>
                <el-form-item label="垂直(Y)">
                    <el-input v-model="scaleY"
                        placeholder="垂直缩放值"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer"
                class="dialog-footer">
                <el-button @click="scaleVisible = false">取 消</el-button>
                <el-button type="primary"
                    @click="onScalePaper">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="设置临时限速"
            :visible.sync="limitVisible"
            width="60%">
            <el-table height="600"
                border
                :data="needSendTmpLimit">
                <el-table-column prop="id"
                    label="id">
                </el-table-column>
                <el-table-column prop="link"
                    label="link"
                    width="180">
                </el-table-column>
                <el-table-column prop="headOfst"
                    label="headOfst">
                    <template slot-scope="scope">
                        <el-input type="number"
                            v-model="scope.row.headOfst"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="tailOfst"
                    label="tailOfst">
                    <template slot-scope="scope">
                        <el-input type="number"
                            v-model="scope.row.tailOfst"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="limitSpd"
                    label="临时限速">
                    <template slot-scope="scope">
                        <el-input type="number"
                            v-model="scope.row.limitSpd"></el-input>
                    </template>
                </el-table-column>
                <el-table-column width="80"
                    label="移除限速">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.remove"></el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer"
                class="dialog-footer">
                <el-button @click="limitVisible = false">取 消</el-button>
                <el-button type="primary"
                    @click="applyLimit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import * as joint from "jointjs";
import TopoPaper from "./TopoPaper";
import { getStationsObjIdProp } from "@/utils/station";
import {
    registerCallback,
    unregisterCallback,
    sendSock,
    getPackage,
} from "@/utils/ws";
import Msg from "../../components/msg.vue";

export default {
    components: { Msg },
    data() {
        return {
            runmode: "历史模式",
            loading: false,
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
            scaleVisible: false,
            scaleX: 1,
            scaleY: 1,
            sim_speed: 100,//默认仿真速度为最高速度100
            limitVisible: false,
            setTmpLimit: false, // 设置临时限速模式
            tmpLimits: [],
            needSendTmpLimit: [],
            diao1: [],
            diao2: "",
            diao3: [
                {
                    d1: "北安河上行",
                    d2: "30",
                    d3: [],
                },
                {
                    d1: "温阳路上行",
                    d2: "30",
                    d3: [],
                },
                {
                    d1: "稻香湖上行",
                    d2: "30",
                    d3: [],
                },
                {
                    d1: "...",
                    d2: "...",
                    d3: [],
                },
            ],
            activeName: "倍速",
        };
    },
    created() {
        registerCallback("trainrun",this.wsCallback);
    },
    async mounted() {
        this.currentLine = sessionStorage.getItem("currentLine");
        if (this.currentLine) {
            let param = getPackage(138, {
                operaType: 2,
                lineName: this.currentLine,
            });

            // this.loading = true; TODO
            sendSock(param);
            this.initJoint();
            let s = this.paper.scale();
            this.scaleX = s.sx;
            this.scaleY = s.sy;
            this.changeSimSpeed();
            sendSock(getPackage(307, { limitSpeed: [] }));
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
        onScalePaper() {
            if (this.paper) {
                this.scaleX = Number(this.scaleX);
                this.scaleY = Number(this.scaleY);
                if (this.scaleX > 0 && this.scaleY > 0) {
                    this.paper.scale(this.scaleX, this.scaleY);
                }
            }
        },
        onStart() {
            if (this.runmode === "实时模式") {
                let mainThis = this;
                this.paper.clearTrain();
                this.paper.clearPerson();
                clearInterval(this.timer);
                this.timer = setInterval(() => {
                    // 行车
                    this.trainRun2();
                }, 3500);
            } else if (this.runmode === "历史模式") {
                let mainThis = this;
                this.paper.clearTrain();
                this.paper.clearPerson();
                clearInterval(this.timer);
                this.timer = setInterval(() => {
                    mainThis.getTimeRange();
                    if (mainThis.currentTime > mainThis.endTime) {
                        mainThis.onStop();
                    }
                    // 行车
                    this.trainRun();
                }, 1000);
            }
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
                    this.paper.drawPerson(findPackage);
                    this.paper.updateStationColor(findPackage);
                    this.warningList = findPackage.strDeviInfo;
                    this.setInfo(findPackage);

                    this.currentTime += this.speedRate;

                    // 检查是否获取新数据
                    let index = this.dataBuffer.indexOf(findPackage);
                    if (this.dataBuffer.length - index < 2) {
                        console.log(this.dataBuffer.length);
                        this.getRealData(index);
                    }
                }
            }

            this.$refs.msg.getMessage(this.currentTime);
        },
        trainRun2() {
            let p = getPackage(105, {
                startTime: 2147483647,
                speedTimes: this.speedRate,
            }); // 0-86400
            sendSock(p);

            if (this.dataBuffer.length > 0) {
                let findPackage = this.dataBuffer[this.dataBuffer.length - 1];
                this.currentTime = findPackage.wTime;
                this.currentFrame = findPackage;
                this.paper.drawTrain(findPackage);
                this.paper.drawPerson(findPackage);
                this.paper.updateStationColor(findPackage);
                this.warningList = findPackage.strDeviInfo;
                this.setInfo(findPackage);

                this.currentTime += this.speedRate;

                // 检查是否获取新数据
                let index = this.dataBuffer.indexOf(findPackage);
                if (this.dataBuffer.length - index < 4) {
                    this.getRealData(index);
                }
            }

            this.$refs.msg.getMessage(this.currentTime);
        },
        changeSimSpeed() {
            sendSock(getPackage(142, { sim_speed: this.sim_speed }));
        },
        getRealData(index) {
            if (index) {
                this.dataBuffer.splice(0, index);
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

                let findModel = this.warningListArr.find((item) => {
                    return item.wTime == this.currentTime;
                });

                if (findModel && findModel.list) {
                    findModel.list.forEach((d) => {
                        info.push(`${this.formatTime(findModel.wTime)} ${d}`);
                    });
                }
            }
            if (info.length > 0) {
                this.warningListArrDisplay = info;
            }

            // 消息显示改为只显示当前时间的消息,2022.08016
            return;
            //let info = [];
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
        changeLimitMode(val) {
            this.setTmpLimit = val;
            this.paper.setTmpLimit = this.setTmpLimit;
            if (!val) {
                // 取消选中的Link
                this.paper.clearSetLimitLink();
            }
        },
        prepareApplyLimit() {
            let newList = this.paper.getTmpLimitFromLink();
            this.needSendTmpLimit = this.tmpLimits.concat(newList);
            this.limitVisible = true;
        },
        applyLimit() {
            let sendData = this.needSendTmpLimit.map((m) => {
                if (m.remove) {
                    m.limitSpd = 65535;
                }
                return {
                    id: parseInt(m.id),
                    link: parseInt(m.link),
                    headOfst: parseInt(m.headOfst),
                    tailOfst: parseInt(m.tailOfst),
                    limitSpd: parseInt(m.limitSpd),
                };
            });

            sendSock(getPackage(307, { limitSpeed: sendData }));
            this.paper.clearSetLimitLink();
            this.limitVisible = false;
        },
        wsCallback(res) {
            if (res.msgType == 205) {
                let rundata = res.data.bsVtsDataVector;
                if (this.runmode === "实时模式") {
                    this.dataBuffer = rundata;
                } else if (this.runmode === "历史模式") {
                    if (rundata.length > 0) {
                        this.dataBuffer = this.dataBuffer.concat(rundata);
                    }
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
                this.loading = false;
            } else if (res.msgType == 407) {
                if (res.status != 1) {
                    this.$message({
                        message: res.msg,
                        type: "warning",
                    });
                    return;
                }
                this.tmpLimits = res.data.limitSpeed;
                this.tmpLimits = this.tmpLimits.map((m) => {
                    return { ...m, remove: false };
                });
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
.main {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    height: calc(100vh - 50px);
    padding: 10px;
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
    /* width: calc(100% - 420px); */
    width: calc(100% - 20px);
    background-color: #194a9944;
    color: #fff;
    text-align: left;
    border-radius: 6px;
    z-index: 1;
    bottom: 10px !important;
    display: flex;
    right: 10px;
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

.left_new {
    width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}
.el-card {
    margin: 0;
}
.el-card__body .el-radio--medium.is-bordered {
    padding: 10px 10px 0 5px;
    margin: 0 10px !important;
}

.shiji .el-card {
    margin: 0 10px 10px 0;
}
.shiji .el-radio.is-bordered + .el-radio.is-bordered,
.shiji .el-radio--medium.is-bordered,
.shiji .el-radio.is-bordered + .el-radio.is-bordered {
    margin: 0 5px !important;
    padding: 10px 10px 0 5px;
}
</style>

