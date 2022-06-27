<template>
    <div class="basedata-box">
        <div class="table-container">
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
                    @click="jumpPage(1)">去往列车特性数据&gt;&gt;</el-button>
                <el-button size="small"
                    v-if="!tableCompare"
                    type="primary"
                    style="width:220px"
                    @click="saveData()">保存</el-button>

            </h3>
            <div class="tables-column">
                <el-table border
                    :data="tableData1"
                    height="calc(100vh - 150px)"
                    style="width: 100%;flex:1;margin-left-5px"
                    :cell-style="valueRowStyle"
                    :header-cell-style="{'font-size':'16px','color':'#555','font-weight':'bold','background':'#ddd'}">
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
                                v-model="scope.row.data"
                                v-on:focus="onSelectText"
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
                    scope.row.oldData == scope.row.olderData ? '#222' : 'red',
                  fontWeight:
                    scope.row.oldData == scope.row.olderData
                      ? 'normal'
                      : 'bold',
                  fontSize:
                    scope.row.oldData == scope.row.olderData ? '12px' : '16px',
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
                        label="参考数值范围">
                        <template slot-scope="scope">
                            <span>{{ scope.row.ps }}</span>
                        </template>
                    </el-table-column>
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
            dataTypeTitle: this.$route.meta.title,
            tableData1Edit: false,
            tableCompare: false,
            tableData1: [],
            signalData: null,
            currentLine: null,
        };
    },
    methods: {
        saveData: function (showBtn) {
            this.tableData1Edit = showBtn;
            if (this.tableData1) {
                this.tableData1.forEach((item) => {
                    if (item.CR != 1) {
                        item.data = parseInt(item.data) * item.CR;
                    }
                    item.data = item.data.toString();
                    item.oldData = item.oldData.toString();
                    item.olderData = item.olderData.toString();
                    item.No = parseInt(item.No);
                    // item.data = parseInt(item.data);
                });
            }

            var self = this;
            let sendData = _.cloneDeep(self.signalData);
            let invalid = false;
            let strProp = "";
            if (
                sendData &&
                sendData.SignalCtrData &&
                sendData.SignalCtrData.length > 0
            ) {
                sendData.SignalCtrData.forEach((s) => {
                    delete s.oldData;
                    delete s.olderData;
                    delete s.options;
                    if (Number(s.JudgeType) == 1 && s.scope) {
                        let value = Number(s.data);
                        let arr = s.scope.split("|");
                        if (arr && arr.length > 1) {
                            let min = Number(arr[0]);
                            let max = Number(arr[1]);
                            if (!(value >= min && value <= max)) {
                                invalid = true;
                                strProp = s.Define;
                            }
                        }
                    }
                });
            }

            if (invalid) {
                self.$message({
                    message: `[${strProp}] 值超出范围，请检查`,
                    type: "warning",
                });
                return;
            }

            if (this.tableData1 && this.tableData1.length > 0) {
                this.tableData1.forEach((item) => {
                    // item.olderData = item.oldData;
                    item.oldData = item.data;
                    let tmp = item.data;
                    item.data = 0;
                    item.data = tmp;
                });
            }

            let save_data_param = getPackage(112, sendData);
            console.log("--- save ----");
            console.log(save_data_param);
            sendSock(save_data_param);
        },
        jumpPage(index) {
            if (index == 1) {
                this.$router.push({ path: "/index/traindata" });
            }
        },
        extractData: function () {
            var self = this;
            let extractParam = getPackage(116, this.currentLine);
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

            if (res.msgType == 216) {
                this.signalData = res.data;
                this.tableData1 = res.data.SignalCtrData;
                // CR处理
                if (this.tableData1) {
                    this.tableData1.forEach((item) => {
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
            }
        },
    },
    mounted() {
        this.currentLine = sessionStorage.getItem("currentLine");
        this.extractData();
    },
    created() {
        registerCallback("signalCtrData", this.wsCallback);
    },
    beforeDestroy() {
        unregisterCallback("signalCtrData");
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
</style>
