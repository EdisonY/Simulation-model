<template>
    <div class="main-page">
        <div class="module-panel">
            <div class="ability-title">
                <div>交路设置</div>
            </div>
            <div class="setting-row">
                <div class="prop-name">运行方式</div>
                <el-radio style="margin-left: 15px"
                    v-model="runMode"
                    label="单程"
                    @change="abilityStationChange()">单程</el-radio>
                <el-radio v-model="runMode"
                    label="往返"
                    @change="abilityStationChange()">往返</el-radio>
                <el-radio v-model="runMode"
                    label="单折"
                    @change="abilityStationChange()">单折</el-radio>
            </div>
            <div class="setting-row"
                v-if="false">
                <div class="prop-name">起始站台</div>
                <el-select style="margin-left: 15px; width: 100%"
                    v-model="startAreaCrossReverseType"
                    placeholder="请选择">
                    <el-option v-for="item in crossTypes"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="setting-row"
                v-if="false">
                <div class="prop-name">终点站台</div>
                <el-select style="margin-left: 15px; width: 100%"
                    v-model="endAreaCrossReverseType"
                    placeholder="请选择">
                    <el-option v-for="item in crossTypes"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="setting-row">
                <el-tabs v-model="editableTabsValue"
                    type="card"
                    editable
                    @edit="handleTabsEdit"
                    @tab-click="showPath">
                    <el-tab-pane :key="item.id"
                        v-for="(item, index) in trainInfo"
                        :label="item.name"
                        :name="item.key">
                        <div class="setting-row">
                            <div class="prop-name">起始车站</div>
                            <el-select style="margin-left: 15px; width: 100%"
                                v-model="item.startArea"
                                placeholder="请选择"
                                @change="abilityStationChange(item)">
                                <el-option v-for="item in startAreaOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <!-- 新增中间折返 -->
                        <div class="setting-row"
                            v-if="runMode == '单折'">
                            <div class="prop-name">折返车站</div>
                            <el-select style="margin-left: 15px; width: 100%"
                                v-model="item.reverseArea"
                                placeholder="请选择"
                                @change="abilityStationChange(item)">
                                <el-option v-for="item in reverseAreaOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="setting-row">
                            <div class="prop-name">终点车站</div>
                            <el-select style="margin-left: 15px; width: 100%"
                                v-model="item.endArea"
                                placeholder="请选择"
                                @change="abilityStationChange(item)">
                                <el-option v-for="item in endAreaOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="setting-row">
                            <div class="prop-name">统一站停</div>
                            <el-input v-model="item.uniformStopTime"
                                style="width: 60px; margin: 0 10px 0 15px"
                                @change="onTimeChange(item)"></el-input>
                            <div style="margin-right: 10px">秒</div>
                        </div>
                        <div class="setting-row"
                            v-if="item.id!=1">
                            <div class="prop-name">与前车间隔</div>
                            <el-input v-model="item.trainInterval"
                                style="width: 60px; margin: 0 10px 0 15px"
                                @change="onTimeChange(item)"></el-input>
                            <div style="margin-right: 10px">秒</div>
                        </div>
                        <div class="setting-row">
                            <el-table ref="table"
                                :data="item.stopAreas"
                                height="400"
                                max-height="400">
                                <el-table-column label="站台名称"
                                    width="220">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.areas || scope.row.areas.length < 2">{{ scope.row.selectedArea }}</span>
                                        <el-select v-else
                                            v-model="scope.row.selectedArea"
                                            placeholder="请选择">
                                            <el-option v-for="item in scope.row.areas"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="停站时间"
                                    width="120">
                                    <template slot-scope="scope">
                                        <el-input size="mini"
                                            v-model="scope.row.stopTime"></el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="setting-row">
                            <div class="prop-name">选择车型</div>
                            <el-select style="margin-left: 15px; width: 100%"
                                v-model="item.currentTrain"
                                placeholder="请选择">
                                <el-option v-for="item in trainTypes"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.name">
                                </el-option>
                            </el-select>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <div class="ability-item-btn">
                <el-button type="primary"
                    style="width: 220px"
                    @click="onRunAbility">开始运行能力检验</el-button>
            </div>
        </div>
        <div class="main-right">
            <div class="drawArea"></div>
        </div>

        <el-button type="primary"
            size="mini"
            style="position: absolute; margin-top: 10px; margin-left: 390px"
            @click="onRestLine">重置线路</el-button>
        <el-button size="mini"
            v-show="false"
            style="position: absolute; margin-top: 10px; right: 20px"
            @click="jumpPage(1)">去往线路占用泳道图&gt;&gt;</el-button>
    </div>
</template>

<script>
import * as joint from "jointjs";
import TopoPaper from "./TopoPaper";
import * as Utils from "@/utils/util";
import {
    registerCallback,
    unregisterCallback,
    sendSock,
    getPackage,
} from "@/utils/ws";

export default {
    data() {
        return {
            paper: null,
            graph: null,
            g: null,
            V: null,
            joint: null,
            project: null,
            // --- 以下是新结构
            runMode: "单程",
            stopTimeMode: "1",
            crossTypes: [
                {
                    id: 0,
                    name: "不折返",
                },
                {
                    id: 1,
                    name: "先直进先直出",
                },
                {
                    id: 2,
                    name: "先直进先弯出",
                },
                {
                    id: 3,
                    name: "先弯进先直出",
                },
                {
                    id: 4,
                    name: "先弯进先弯出",
                },
            ],
            startAreaCrossReverseType: 0,
            endAreaCrossReverseType: 0,
            trainTypes: [
                {
                    id: 1,
                    name: "6A",
                },
                {
                    id: 2,
                    name: "6B",
                },
                {
                    id: 3,
                    name: "8A",
                },
                {
                    id: 4,
                    name: "8B",
                },
            ],
            startAreaOptions: [],
            reverseAreaOptions: [],
            endAreaOptions: [],
            direction: 0,
            trainInfo: [],
            editableTabsValue: "",
            trainLinkList: [],
            currentLine: null,
            currentTrainType: "",
        };
    },
    created() {
        registerCallback("summarycheck", this.wsCallback);
    },
    async mounted() {
        this.currentLine = sessionStorage.getItem("currentLine");
        this.currentTrainType = sessionStorage.getItem(
            `${this.currentLine}-trainType`
        );

        let param = getPackage(138, {
            operaType: 2,
            lineName: this.currentLine,
        });
        sendSock(param);
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
        },
        initOptions() {
            let optionInfo = this.paper.getRouteOptions(
                null,
                null,
                null,
                null,
                this.project && this.project.components
                    ? this.project.components
                    : [],
                this.project.cells
            );
            this.startAreaOptions = optionInfo.startAreaOptions;
            this.reverseAreaOptions = optionInfo.reverseAreaOptions;
            this.endAreaOptions = optionInfo.endAreaOptions;
            this.direction = optionInfo.direction;
        },
        handleTabsEdit(targetName, action) {
            if (action === "add") {
                let newTabName = "列车" + (this.trainInfo.length + 1);

                let aNewTrain = {
                    id: this.trainInfo.length + 1,
                    name: newTabName,
                    key: newTabName,
                    startArea: -1,
                    reverseArea: -1,
                    endArea: -1,
                    uniformStopTime: 30,
                    trainInterval: 0,
                    stopAreas: [],
                    direction: this.direction,
                    currentTrain: this.currentTrainType,
                };
                // 每次增加一个车，都复制前一个车的数据。第一列车，起始和终点车站是第一站和最后一站。
                if (this.trainInfo.length > 0) {
                    let last = this.trainInfo[this.trainInfo.length - 1];
                    aNewTrain.startArea = last.startArea;
                    aNewTrain.reverseArea = last.reverseArea;
                    aNewTrain.endArea = last.endArea;
                    aNewTrain.uniformStopTime = last.uniformStopTime;
                    aNewTrain.stopAreas = _.cloneDeep(last.stopAreas);
                    aNewTrain.direction = last.direction;
                    aNewTrain.currentTrain = last.currentTrain;
                }

                if (this.trainInfo.length > 0) {
                    aNewTrain.trainInterval =
                        this.trainInfo[this.trainInfo.length - 1].trainInterval;
                }
                this.trainInfo.push(aNewTrain);
                this.editableTabsValue = newTabName;
            }
            if (action === "remove") {
                let tabs = this.trainInfo;
                let activeName = this.editableTabsValue;
                console.log(activeName);
                console.log(targetName);
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }

                this.editableTabsValue = activeName;
                this.trainInfo = tabs.filter((tab) => tab.name !== targetName);
            }
        },
        abilityStationChange(item) {
            if (item) {
                let data = this.paper.getRouteOptions(
                    item.startArea,
                    item.reverseArea,
                    item.endArea,
                    this.runMode,
                    this.project && this.project.components
                        ? this.project.components
                        : [],
                    this.project.cells
                );
                item.stopAreas = data.stopAreas;
                item.direction = data.direction;
            } else {
                let data = this.paper.getRouteOptions(
                    null,
                    null,
                    null,
                    this.runMode,
                    this.project && this.project.components
                        ? this.project.components
                        : [],
                    this.project.cells
                );
                this.startAreaOptions = data.startAreaOptions;
                this.reverseAreaOptions = data.reverseAreaOptions;
                this.endAreaOptions = data.endAreaOptions;
                this.direction = data.direction;
            }
        },
        onTimeChange(item) {
            item.stopAreas.forEach((s) => {
                s.stopTime = Number(item.uniformStopTime);
            });
        },
        onRunAbility() {
            let param = {
                lineName: this.currentLine,
                stopTimeType: 2, // 停站时间设置类型：1=取运营时间 2=取当前数据
                runType: this.runMode == "单程" ? 1 : 2, // 能力运行类型：1=单程 2=往返
                startAreaCrossReverseType: this.startAreaCrossReverseType,
                endAreaCrossReverseType: this.endAreaCrossReverseType,
                vecTrain: [],
            };

            let vecStepTimeBetweenTrains = [],
                index = 0;
            this.trainInfo.forEach((t) => {
                let train = {
                    trainId: t.id,
                    direction: t.direction,
                    trainType: t.currentTrain,
                    returnAreaId: 0,
                    stopAreas: [],
                };

                if (this.runMode == "单折") {
                    let aid = parseInt(t.reverseArea);
                    if (aid > 0) {
                        train.returnAreaId = this._sbFunc(aid);
                    }
                } else if (this.runMode == "往返") {
                    let aid = parseInt(t.endArea);
                    if (aid > 0) {
                        train.returnAreaId = this._sbFunc(aid);
                    }
                }

                t.stopAreas.forEach((a) => {
                    train.stopAreas.push({
                        areaId: this._sbFunc(a.id),
                        time: Number(a.stopTime),
                    });
                });
                param.vecTrain.push(train);

                if (index > 0) {
                    vecStepTimeBetweenTrains.push(parseInt(t.trainInterval));
                }
                index++;
            });
            param.vecStepTimeBetweenTrains = vecStepTimeBetweenTrains;
            sessionStorage.setItem("summaryMode", 2);

            let test = { trainList: [] };
            test.trainInfo = this.trainInfo;
            test.runMode = this.runMode;
            sessionStorage.setItem("cacheAbilityCheck2", JSON.stringify(test));

            let needSend = getPackage(135, param);
            sendSock(needSend);
        },
        _sbFunc(sid) {
            if (this.project) {
                let findM = this.project.cells.find((c) => {
                    return c.tctData.tctId == sid && c.type == "tct.StopArea";
                });
                if (findM && findM.tctData.stopAreaID) {
                    return Number(findM.tctData.stopAreaID);
                }
            }
            return sid;
        },
        showPath() {
            this.paper.setPath([]);
            if (this.editableTabsValue) {
                let trainId = Number(
                    this.editableTabsValue.replace("列车", "")
                );
                if (trainId > 0 && this.trainLinkList) {
                    let pathInfo = this.trainLinkList.find((t) => {
                        return t.trainId == trainId;
                    });
                    if (pathInfo) {
                        this.paper.setPath(pathInfo.linkList);
                    }
                }
            }
        },
        onRestLine() {
            this.paper.reset();
        },
        jumpPage(index) {
            if (index == 1) {
                this.$router.push({ path: "/traincapacity/uic" });
            }
        },
        wsCallback(res) {
            if (res.msgType == 235) {
                if (res.status == 1) {
                    this.$message({
                        message: res.msg,
                        type: "success",
                    });

                    this.trainLinkList = res.data.trainList;
                    this.showPath();
                    let saveData = _.cloneDeep(res.data);
                    saveData.trainInfo = this.trainInfo;
                    saveData.runMode = this.runMode;
                    sessionStorage.setItem(
                        "cacheAbilityCheck2",
                        JSON.stringify(saveData)
                    );
                    this.trainLinkList = res.data.trainList;
                    this.showPath();
                } else {
                    this.$message({
                        message: res.msg,
                        type: "warning",
                    });
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

                this.initJoint();
                this.initOptions();
                if (this.trainInfo.length == 0) {
                    let newTabName = "列车" + (this.trainInfo.length + 1);
                    this.trainInfo.push({
                        id: this.trainInfo.length + 1,
                        name: newTabName,
                        key: newTabName,
                        startArea: -1,
                        reverseArea: -1,
                        endArea: -1,
                        uniformStopTime: 30,
                        trainInterval: 120,
                        stopAreas: [],
                        direction: this.direction,
                        currentTrain: this.currentTrainType,
                    });
                    this.editableTabsValue = newTabName;
                }

                let cacheAbilityCheck2 =
                    sessionStorage.getItem("cacheAbilityCheck2");
                if (cacheAbilityCheck2) {
                    cacheAbilityCheck2 = JSON.parse(cacheAbilityCheck2);
                    this.trainLinkList = cacheAbilityCheck2.trainList;
                    this.trainInfo = cacheAbilityCheck2.trainInfo;
                    this.runMode = cacheAbilityCheck2.runMode;
                    this.showPath();
                }
            }
        },
    },
    beforeDestroy() {
        unregisterCallback("summarycheck");
    },
};
</script>

<style scoped>
.main-page {
    height: calc(100vh - 50px);
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding: 10px;
}

.main-right {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.module-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
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

.drawArea {
    height: 400px;
}

.ability-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}

.ability-item-btn {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.ability-title {
    font-size: 20px;
    font-weight: bold;
    /* color: rgb(64, 158, 255); */
    color: #333;
    margin: 10px 0 10px 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.setting-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 5px 0px;
    font-size: 10px;
}

.report-chart {
    flex: 1;
    background: #fff;
    overflow: auto;
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
</style>

