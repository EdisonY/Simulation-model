<template>
    <div class="basedata-box add">
        <h3 class="table-title"
            id="page1"
            name="page1">
            {{ dataTypeTitle }}
            <el-button size="small"
                v-show="tableCompare"
                @click="tableCompare = false">返回</el-button>
            <el-button size="small"
                v-if="false"
                v-show="!tableCompare"
                style="margin: 0 0 0 10px"
                @click="tableCompare = true">数据对比</el-button>

            <!-- <el-button size="small"
                v-show="!tableCompare"
                @click="startSimulate">开始能力分析</el-button> -->
            <el-button size="small"
                v-show="false"
                style="width:150px"
                @click="jumpPage(1)">去往线路设计&gt;&gt;</el-button>
            <el-button size="small"
                v-if="!tableCompare"
                type="primary"
                style="width:220px"
                @click="saveData">保存</el-button>
        </h3>
        <div class="echart-area">
            <div class="echarts"
                ref="echarts"></div>
        </div>
        <div class="tab-group">
            <!-- Tab列表 -->
            <el-tabs type="border-card"
                style="margin-top: 10px"
                :value="defaultTab"
                @tab-click="handleClick">
                <el-tab-pane :key="item.index"
                    v-for="(item, index) in tableData"
                    :label="item.name"
                    :name="item.key"
                    style="height: 100%">
                    <div class="tables-column">
                        <div style="height: 100%">
                            <el-table border
                                :data="item.data"
                                height="calc(100vh - 400px)"
                                style="width: 100%;flex:1;margin-left-5px"
                                :cell-style="valueRowStyle"
                                :header-cell-style="{
                  'font-size': '16px',
                  color: '#555',
                  'font-weight': 'bold',
                  background: '#ddd',
                }">
                                <el-table-column prop="No"
                                    label="序号"
                                    width="90"
                                    align="center">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.No }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="Define"
                                    label="名称">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.Define }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="data"
                                    label="数据"
                                    v-if="!tableCompare">
                                    <template slot-scope="scope">
                                        <el-input size="small"
                                            v-on:focus="onSelectText"
                                            v-model="scope.row.data"
                                            v-if="scope.row.JudgeType != 2"></el-input>
                                        <el-select size="mini"
                                            v-model="scope.row.data"
                                            v-if="scope.row.JudgeType == 2">
                                            <el-option v-for="item in scope.row.options"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="data"
                                    label="编辑前数据"
                                    v-if="tableCompare">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.olderData }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="data"
                                    label="编辑后数据"
                                    v-if="tableCompare">
                                    <template slot-scope="scope">
                                        <span v-bind:style="{
                        color:
                          scope.row.oldData == scope.row.olderData
                            ? '#222'
                            : 'red',
                        fontWeight:
                          scope.row.oldData == scope.row.olderData
                            ? 'normal'
                            : 'bold',
                        fontSize:
                          scope.row.oldData == scope.row.olderData
                            ? '12px'
                            : '16px',
                      }">{{ scope.row.oldData }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="unit"
                                    label="单位">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.unit }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="ps"
                                    label="备注">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.ps }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
let _ = require("lodash");
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
            currentLine: null,
            dataTypeTitle: this.$route.meta.title,
            tableCompare: false,
            tableData: [],
            defaultTab: "",
            operateData: null,
            tempData: [],
            echart: null,
            option: {
                tooltip: {
                    trigger: "axis",
                    confine: true,
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
                    },
                },
                grid: {
                    left: "10",
                    right: "10",
                    bottom: "0",
                    top: "0",
                    containLabel: true,
                },
                xAxis: {
                    type: "value",
                    axisLabel: {
                        formatter: "{value} S",
                    },
                },
                yAxis: {
                    type: "category",
                    axisLabel: {
                        lineHeight: 20,
                        fontSize: "14",
                        interval: 0,
                    },
                    data: [],
                },
                series: [],
            },
            tabNumber: 0,
        };
    },
    methods: {
        saveData: function (showBtn) {
            if (this.tableData) {
                this.tableData.forEach((item) => {
                    item.data.forEach((d) => {
                        d.data = d.data.toString();
                        d.oldData = d.oldData.toString();
                        d.olderData = d.olderData.toString();
                        d.No = parseInt(d.No);
                    });
                });
            }

            var self = this;
            this.tableData.forEach((item) => {
                item.data.forEach((d) => {
                    d.olderData = d.oldData;
                    d.oldData = d.data;
                });
            });

            let invalid = false;
            let strProp = "";
            this.tableData.forEach((table) => {
                this.operateData[table.key] = _.cloneDeep(table.data);
                this.operateData[table.key].forEach((d) => {
                    if (d.CR != 1) {
                        d.data = parseInt(d.data) * d.CR;
                    }
                    delete d.olderData;
                    delete d.oldData;
                    delete d.options;

                    if (d.JudgeType == 1 && d.scope) {
                        let value = Number(d.data);
                        let arr = d.scope.split("|");
                        if (arr && arr.length > 1) {
                            let min = Number(arr[0]);
                            let max = Number(arr[1]);
                            if (!(value >= min && value <= max)) {
                                invalid = true;
                                strProp = d.Define;
                            }
                        }
                    }
                });
            });

            if (invalid) {
                self.$message({
                    message: `[${strProp}] 值超出范围，请检查`,
                    type: "warning",
                });
                return;
            }

            this.tableData.forEach((table) => {
                if (table && table.data) {
                    table.data.forEach((item) => {
                        // item.olderData = item.oldData;
                        item.oldData = item.data;
                        let tmp = item.data;
                        item.data = 0;
                        item.data = tmp;
                    });
                }
            });

            let save_data_param = getPackage(114, self.operateData);
            sendSock(save_data_param);
        },
        jumpPage(index) {
            if (index == 1) {
                this.$router.push({ path: "/index/line" });
            }
        },
        extractData: function () {
            let extractParam = getPackage(118, this.currentLine);
            console.log("--- extract param ----");
            console.log(extractParam);
            sendSock(extractParam);
        },
        startSimulate() {
            let cfgLineJson = sessionStorage.getItem("cfgLineJson");
            if (cfgLineJson != 1) {
                this.$message({
                    message: "请先上传线路",
                    type: "warning",
                });
                return;
            }

            let param = sessionStorage.getItem("cfgAbilityParam");
            if (!param) {
                this.$message({
                    message: "请先设置能力计算交路设置",
                    type: "warning",
                });
                return;
            }
            param = JSON.parse(param);
            param = getPackage(131, param);
            sendSock(param);
        },
        onSelectText(evt) {
            evt.currentTarget.select();
        },
        getData() {
            var self = this;

            if (this.echart != null) {
                this.echart.clear();
            } else {
                this.echart = this.$echarts.init(this.$refs.echarts);
            }
            this.option.yAxis.data = [];
            this.option.series = [];
            this.tempData = JSON.parse(sessionStorage.getItem("stoptime"));

            for (let index = 0; index < this.tempData.length; index++) {
                this.option.yAxis.data.push(this.tempData[index].stopStateName);
                for (
                    let i = 0;
                    i < this.tempData[index].vecTimeValue.length;
                    i++
                ) {
                    if (this.tempData[index].vecTimeValue[i] != 0) {
                        var dataBar = {
                            name: "",
                            type: "bar",
                            stack: "总量",
                            label: {
                                show: true,
                                position: "insideLeft",
                            },
                            data: [],
                        };
                        dataBar.name = this.tempData[index].vecTimeName[i];
                        for (let x = 0; x < index; x++) {
                            dataBar.data.push(null);
                        }
                        dataBar.data.push(
                            this.tempData[index].vecTimeValue[i] / 1000
                        );
                        this.option.series.push(dataBar);
                    }
                }
            }
            this.option.tooltip.formatter = function (
                params,
                ticket,
                callback
            ) {
                var tooltipInner = [
                    '<h2 style="font-size:16px;font-weight:bold;height:30px;line-height:30px;margin-bottom:10px;">' +
                        self.tempData[params[0].dataIndex].stopStateName +
                        ":" +
                        self.tempData[params[0].dataIndex].totalStopTime /
                            1000 +
                        "S</h2>",
                ];
                var color = "";
                for (var x in params) {
                    if (params[x].value != undefined) {
                        tooltipInner +=
                            '<span style="display:block;padding:0 5px;border-radius:3px;height:30px;line-height:30px;margin-bottom:10px;background:' +
                            params[x].color +
                            '">' +
                            params[x].seriesName +
                            ": " +
                            "<b>" +
                            params[x].value +
                            " S </b></br></span>";
                    }
                }
                return tooltipInner;
            };
            this.echart.setOption(this.option, true);

            window.addEventListener("resize", function () {
                self.echart.resize();
            });
        },
        handleClick(tab, event) {
            let data = getPackage(125, parseInt(tab.index));
            sendSock(data);
        },
        valueRowStyle({ row, column, rowIndex, columnIndex }) {
            if (columnIndex == 2) {
                if (row.data != row.oldData) {
                    // 判断合法性 黄或者红
                    if (Number(row.JudgeType) == 1 && row.scope) {
                        let value = Number(row.data);
                        let arr = row.scope.split("|");
                        if (arr && arr.length > 1) {
                            let min = Number(arr[0]);
                            let max = Number(arr[1]);
                            if (!(value >= min && value <= max)) {
                                return "background-color:red";
                            }
                        }
                    }
                    return "background-color:yellow";
                } else if (row.oldData != row.olderData) {
                    return "background-color:green";
                }
            }

            return;
        },
        wsCallback(res) {
            console.log(`callback ${res.msgType}`);
            console.log(res);
            if (res.msgType == 218) {
                this.operateData = res.data;
                this.tableData = [
                    {
                        name: "站停作业",
                        key: "StationWork",
                        data: this.operateData.OperationData.StationWork,
                    },
                    {
                        name: "站后折返",
                        key: "TurnBackA",
                        data: this.operateData.OperationData.TurnBackA,
                    },
                    {
                        name: "站前折返",
                        key: "TurnBackB",
                        data: this.operateData.OperationData.TurnBackB,
                    },
                    {
                        name: "车辆基地发车作业",
                        key: "DepartWork",
                        data: this.operateData.OperationData.DepartWork,
                    },
                ];
                this.defaultTab = "StationWork";

                // CR处理
                if (this.tableData) {
                    this.tableData.forEach((item) => {
                        item.data.forEach((d) => {
                            if (d.CR != 1) {
                                d.data = parseInt(d.data) / d.CR;
                            }
                            d.data = d.data.toString();
                            d.oldData = d.data;
                            d.olderData = d.data;
                            if (d.JudgeType == 2) {
                                d.options = [];
                                if (d.scope) {
                                    let arr = d.scope.split("|");
                                    if (arr && arr.length > 0) {
                                        let index = 1;
                                        arr.forEach((a) => {
                                            d.options.push({
                                                id: index++,
                                                name: a,
                                            });
                                        });
                                    }
                                }
                            }
                        });
                    });
                }
            } else if (res.msgType == 231) {
                if (res.status == 1) {
                    this.$message({
                        message: res.msg,
                        type: "success",
                    });
                } else {
                    this.$message({
                        message: res.msg,
                        type: "warning",
                    });
                }
            } else if (res.data && res.msgType == 225) {
                window.sessionStorage.setItem(
                    "stoptime",
                    JSON.stringify(res.data.data)
                );
                this.getData();
            }
        },
    },
    mounted() {
        this.currentLine = sessionStorage.getItem("currentLine");
        this.extractData();
    },
    created() {
        registerCallback("operation", this.wsCallback);
    },
    beforeDestroy() {
        unregisterCallback("operation");
    },
};
</script>

<style scoped lang="scss">
.basedata-box {
    position: relative;
    height: calc(100vh - 50px);
    overflow-y: hidden;
    .btn-box {
        position: fixed;
        width: 20%;
        right: 0;
        text-align: center;
        padding: 10px 0;
        top: 80px;
    }
    .table-title:before {
        content: "";
        width: 4px;
        height: 20px;
        background: #2db7f5;
        position: absolute;
        left: 0;
        top: 12px;
    }
    .table-title {
        font-size: 16px;
        padding: 10px 0 10px 10px;
        position: relative;

        .el-button {
            float: right;
            margin-left: 10px;
            width: 120px;
            margin-bottom: 4px;
        }
    }
    .el-table {
        margin-bottom: 30px;
        width: 100%;
    }
    font-size: 12px;
    padding: 20px;
    .el-table >>> .cell {
        font-size: 12px;
        padding: 0 0 0 10px !important;
        line-height: 35px;
    }
    th {
        background-color: #f8f8f8;
    }
    .line-img {
        width: 800px;
        margin-bottom: 20px;
    }
}

.tables-column {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.tab-group {
    width: 100%;
    height: 100%;
}

.el-input__inner {
    -web-kit-appearance: none;
    -moz-appearance: none;
    font-size: 1em;
    height: 2.9em;
    border-radius: 4;
    border: 0px solid #dcdfe6;
    color: #606266;
    outline: 0;
}

.el-input__inner:focus {
    -web-kit-appearance: none;
    -moz-appearance: none;
    font-size: 1em;
    height: 2.9em;
    border-radius: 4;
    border: 1px solid #628fe9;
    color: #606266;
    outline: 0;
}

.echart-area {
    width: calc(100% - 40px);
    height: 200px;
    position: absolute;
    top: 134px;
    z-index: 999;
}
.echarts {
    width: 100%;
    height: 200px;
    margin: 0 auto;
}
.el-tabs__content {
    padding-top: 215px;
}
</style>
<style>
.add .el-tabs__content {
    padding-top: 215px !important;
}
</style>
