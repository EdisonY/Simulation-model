<template>
    <div class="basedata-box">
        <div class="table-container">
            <h3 class="table-title"
                id="page1"
                name="page1">
                {{ dataTypeTitle }}

                <el-button size="small"
                    type="primary"
                    style="width:220px"
                    @click="saveData(false)">保存</el-button>
            </h3>
            <div class="tables-column">
                <el-table border
                    :data="tableData"
                    height="calc(100vh - 150px)"
                    style="width: 100%;flex:1;margin-left-5px;"
                    :cell-style="valueRowStyle"
                    :header-cell-style="{'font-size':'16px','color':'#555','font-weight':'bold','background':'#ddd'}">
                    <!-- 限制只输入数字 -->
                    <!--  oninput="value=value.replace(/[^\d]/g,'')"  -->
                    <!-- 限制只输入数字，包括小数 -->
                    <!-- oninput="value=value.replace(/[^0-9.]/g,'')" -->
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
                        label="数据">
                        <template slot-scope="scope">
                            <el-input size="small"
                                v-model="scope.row.data"
                                v-on:focus="onSelectText"
                                v-if="scope.row.JudgeType < 2"></el-input>
                            <el-select size="mini"
                                v-model="scope.row.data"
                                v-if="scope.row.JudgeType == 2">
                                <el-option v-for="item in scope.row.options"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.name">
                                </el-option>
                            </el-select>
                            <el-popover :ref="'popover-'+scope.row.id"
                                v-if="scope.row.JudgeType == 32 || scope.row.JudgeType == 33"
                                placement="left"
                                width="400"
                                style="max-height:300px"
                                trigger="click">
                                <el-table border
                                    :data="scope.row.data"
                                    max-height="300">
                                    <el-table-column prop="No"
                                        label="编号"
                                        align="center"></el-table-column>
                                    <el-table-column prop="stationName"
                                        label="车站"
                                        align="center"></el-table-column>
                                    <el-table-column prop="stopTime"
                                        label="停站时间(s)"
                                        align="center"></el-table-column>
                                </el-table>
                                <el-button slot="reference"
                                    :v-popover="'popover-'+scope.row.id">停站时间</el-button>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit"
                        label="单位">
                        <template slot-scope="scope">
                            <span>{{ scope.row.unit }}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="ps"
                        label="备注">
                        <template slot-scope="scope">
                            <span>{{ scope.row.ps }}</span>
                        </template>
                    </el-table-column> -->
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
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
            active: false,
            dataTypeTitle: this.$route.meta.title,
            tableData: [],
            currentLine: null,
        };
    },
    methods: {
        saveData: function () {
            if (this.tableData) {
                this.tableData.forEach((item) => {
                    if (item.JudgeType < 32) {
                        if (item.CR != 1) {
                            item.data = parseInt(item.data) * item.CR;
                        }
                        item.data = item.data.toString();
                        item.oldData = item.oldData.toString();
                        item.olderData = item.olderData.toString();
                        item.No = parseInt(item.No);
                    }
                });
            }

            var self = this;
            let sendData = _.cloneDeep(this.tableData);
            let invalid = false;
            if (sendData && sendData.length > 0) {
                sendData.forEach((s) => {
                    delete s.oldData;
                    delete s.olderData;
                    delete s.options;

                    if (s.JudgeType == 1 && s.scope) {
                        let value = Number(s.data);
                        let arr = s.scope.split("|");
                        if (arr && arr.length > 1) {
                            let min = Number(arr[0]);
                            let max = Number(arr[1]);
                            if (!(value >= min && value <= max)) {
                                invalid = true;
                            }
                        }
                    }
                });
            }

            if (invalid) {
                self.$message({
                    message: "部分值超出范围，清检查",
                    type: "warning",
                });
                return;
            }

            let up = {},
                down = {};
            if (this.tableData && this.tableData.length > 0) {
                this.tableData.forEach((item) => {
                    if (item.JudgeType < 32) {
                        item.oldData = item.data;
                        let tmp = item.data;
                        item.data = 0;
                        item.data = tmp;
                        // 以上操作时触发样式颜色更新
                    } else if (item.JudgeType == 32) {
                        up = {
                            No: item.No,
                            Define: item.Define,
                            stationStopTime: item.data,
                            unit: item.unit,
                            CR: item.CR,
                            ps: item.ps,
                        };
                    } else if (item.JudgeType == 33) {
                        down = {
                            No: item.No,
                            Define: item.Define,
                            stationStopTime: item.data,
                            unit: item.unit,
                            CR: item.CR,
                            ps: item.ps,
                        };
                    }
                });
            }

            let save_data_param = getPackage(111, {
                BasicData: {
                    BasicData: sendData.filter((item) => {
                        return item.JudgeType != 32 && item.JudgeType != 33;
                    }),
                    upLineStationStopTime: up,
                    downLineStationStopTime: down,
                },
                name: this.currentLine,
            });
            alert(4);
            console.log("--- send 111 data ----");
            console.log(save_data_param);
            alert(4);
            sendSock(save_data_param);
        },
        getData: function () {
            let param = getPackage(115, this.currentLine);
            sendSock(param);
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
        updateTrainType(a) {
            let row9 = this.tableData.find((item) => {
                return item.Define == "列车编组";
            });
            let row8 = this.tableData.find((item) => {
                return item.Define == "车辆选型";
            });
            let str = `${row9.data}${row8.data}`;

            // 缓存存储选择的车型
            let trainTypeKey =
                sessionStorage.getItem("currentLine") + "-trainType";
            sessionStorage.setItem(trainTypeKey, str);
        },
        valueRowStyle({ row, column, rowIndex, columnIndex }) {
            if (Number(row.JudgeType) == 32 || Number(row.JudgeType) == 33) {
                return;
            }
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
        wsCallbackOK(res) {
            if (!this.active) {
                return;
            }
            console.log(`callback ${res.msgType}`);
            console.log(res);
            if (res.msgType == 211) {
                this.updateTrainType();
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
            } else if (res.msgType == 215) {
                this.tableData = res.data.BasicData.BasicData;
                // CR处理
                if (this.tableData) {
                    this.tableData.forEach((item) => {
                        if (item.CR != 1) {
                            item.data = parseInt(item.data) / item.CR;
                        }
                        item.data = item.data.toString();
                        item.olderData = item.data;
                        item.oldData = item.data;

                        if (item.JudgeType == 2) {
                            item.options = [];
                            if (item.scope) {
                                let arr = item.scope.split("|");
                                if (arr && arr.length > 0) {
                                    let index = 1;
                                    arr.forEach((a) => {
                                        item.options.push({
                                            id: index++,
                                            name: a,
                                        });
                                    });
                                }
                            }
                        }
                    });
                    // 缓存车型
                    let find1 = this.tableData.find((item) => {
                        return item.Define == "车辆选型";
                    });
                    let find2 = this.tableData.find((item) => {
                        return item.Define == "列车编组";
                    });

                    if (find1 && find1) {
                        this.trainType = find2.data + find1.data;
                        let key = `${this.currentLine}-trainType`;
                        sessionStorage.setItem(key, this.trainType);
                    }

                    // 停站时间数据处理
                    if (res.data.BasicData.upLineStationStopTime) {
                        let s = res.data.BasicData.upLineStationStopTime;
                        this.tableData.push({
                            No: s.No,
                            Define: s.Define,
                            data: s.stationStopTime,
                            unit: s.unit,
                            CR: s.CR,
                            ps: s.ps,
                            JudgeType: 32,
                        });
                    }

                    if (res.data.BasicData.downLineStationStopTime) {
                        let s = res.data.BasicData.downLineStationStopTime;
                        this.tableData.push({
                            No: s.No,
                            Define: s.Define,
                            data: s.stationStopTime,
                            unit: s.unit,
                            CR: s.CR,
                            ps: s.ps,
                            JudgeType: 33,
                        });
                    }

                    console.log(this.tableData);
                }
            }
        },
    },
    mounted() {
        this.currentLine = sessionStorage.getItem("currentLine");
        this.getData();
        this.active = true;
    },
    created() {
        registerCallback("basedata", this.wsCallbackOK);
    },
    beforeDestroy() {
        this.active = false;
        unregisterCallback("basedata");
    },
};
</script>

<style  lang="scss" scoped>
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
    flex-direction: row;
    justify-content: space-between;
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

.mini-title {
    color: rgb(64, 158, 255);
}
</style>
