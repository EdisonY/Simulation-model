<template>
    <el-dialog title="设置进路"
        :visible.sync="innerVisible"
        :close-on-click-modal="modalClose"
        width="80%">
        <div class="main">
            <el-table ref="table"
                :data="current"
                height="400"
                max-height="400"
                style="width: 100%">
                <el-table-column label="编号"
                    width="130">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.routeID"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="进路性质"
                    width="130">
                    <template slot-scope="scope">
                        <el-select size="mini"
                            v-model="scope.row.routeType">
                            <el-option v-for="item in routeTypes"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="始端信号机"
                    width="130">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.startSignalId"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="终端信号机"
                    width="120">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.endSignalId"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="保护计轴区段1始端计轴"
                    width="120">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.startProtectAxleId1"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="保护计轴区段1终端计轴"
                    width="120">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.endProtectAxleId1"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="保护计轴区段2始端计轴"
                    width="120">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.startProtectAxleId2"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="保护计轴区段2终端计轴"
                    width="120">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.endProtectAxleId2"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="保护计轴区段3始端计轴"
                    width="140">
                    <template slot-scope="scope">
                         <el-input size="mini"
                            v-model="scope.row.startProtectAxleId3"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="保护计轴区段3终端计轴"
                    width="120">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.endProtectAxleId3"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="保护计轴区段4始端计轴"
                    width="140">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.startProtectAxleId4"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="保护计轴区段4终端计轴"
                    width="120">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.endProtectAxleId4"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="保护计轴区段5始端计轴"
                    width="140">
                    <template slot-scope="scope">
                         <el-input size="mini"
                            v-model="scope.row.startProtectAxleId5"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="保护计轴区段5终端计轴"
                    width="120">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.endProtectAxleId5"></el-input>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="footer">
                <div class="btn-handle">
                    <el-button type="success"
                        size="mini"
                        @click="addItem">添 加</el-button>
                    <el-button type="success"
                        size="mini"
                        @click="fileSelectorOpen">导 入</el-button>
                    <el-button type="warning"
                        size="mini"
                        @click="updateData">更 新</el-button>
                    <el-button type="danger"
                        size="mini"
                        @click="clearData">清 空</el-button>
                    <el-button type="text"
                        size="mini"
                        @click="downLoadTemplate">下载导入模板</el-button>
                </div>

                <div class="btn-handle">
                    <el-button size="mini"
                        @click="dialogAction('cancelAction')">取 消</el-button>
                    <el-button type="primary"
                        size="mini"
                        @click="dialogAction('okAction')">确 定</el-button>
                </div>
                <!-- 隐藏的file处理 -->
                <input style="display: none"
                    type="file"
                    id="limitSelector"
                    @change="importItem" />
            </div>
        </div>
    </el-dialog>
</template>

<script>
import _ from "lodash";
import FileSaveHelper from "@/utils/fileSaveHelper";
import XLSX from "xlsx";

export default {
    props: ["enterRouteInfo", "dialogFormVisible"],
    data() {
        return {
            modalClose: false,
            current: _.cloneDeep(this.enterRouteInfo),
            routeTypes: [
                {
                    name: "通过",
                    value: 1,
                },
                {
                    name: "折返",
                    value: 2,
                },
            ],
            pointStatus: [
                {
                    name: "定位",
                    value: 1,
                },
                {
                    name: "反位",
                    value: 2,
                },
            ],
        };
    },
    computed: {
        innerVisible: {
            get: function () {
                return this.dialogFormVisible;
            },
            set: function (newValue) {
                if (!newValue) {
                    this.dialogAction("cancelAction");
                }
            },
        },
    },
    methods: {
        dialogAction(action) {
            if (action == "cancelAction") {
                this.current = _.cloneDeep(this.enterRoteInfo);
            } else {
                this.updateData();
            }
            this.$emit(action, this.current);
        },
        handleDelete(a, b) {
            let index = this.current.indexOf(b);
            if (index > -1) {
                this.current.splice(index, 1);
            }
        },
        addItem() {
            let item = {
                routeID: this.current.length + 1,
                routeType: 1,
                startSignalId: 65535,
                endSignalId: 65535,
                startProtectAxleId1: 65535,
                endProtectAxleId1: 65535,
                startProtectAxleId2: 65535,
                endProtectAxleId2: 65535,
                startProtectAxleId3: 65535,
                endProtectAxleId3: 65535,
                startProtectAxleId4: 65535,
                endProtectAxleId4: 65535,
                startProtectAxleId5: 65535,
                endProtectAxleId5: 65535
            };
            this.current.push(item);
            let that = this;
            // TODO 此处不是一个好的方法，但是找不到合适的事件或者回调解决
            setTimeout(() => {
                that.$refs.table.bodyWrapper.scrollTop =
                    that.$refs.table.bodyWrapper.scrollHeight;
            }, 0);
        },
        importItem(evt) {
            let mainThis = this;
            const files = evt.target.files;
            if (files && files.length > 0) {
                const file = files[0];
                const reader = new FileReader();
                reader.readAsBinaryString(file);
                reader.onload = (e) => {
                    try {
                        let data = e.target.result;
                        let workbook = XLSX.read(data, { type: "binary" });
                        let name = workbook.SheetNames[0];
                        let str = XLSX.utils.sheet_to_csv(
                            workbook.Sheets[name]
                        );
                        let rows = this._getRows(str);

                        let arr = [];

                        for (let i = 1; i < rows.length - 1; i++) {
                            arr.push({
                                routeID: Number(rows[i][0]),
                                routeType: Number(rows[i][1]),
                                startSignalId: Number(rows[i][2]),
                                endSignalId: Number(rows[i][3]),
                                startProtectAxleId1: Number(rows[i][4]),
                                endProtectAxleId1: Number(rows[i][5]),
                                startProtectAxleId2: Number(rows[i][6]),
                                endProtectAxleId2: Number(rows[i][7]),
                                startProtectAxleId3: Number(rows[i][8]),
                                endProtectAxleId3: Number(rows[i][9]),
                                startProtectAxleId4: Number(rows[i][10]),
                                endProtectAxleId4: Number(rows[i][11]),
                                startProtectAxleId5: Number(rows[i][12]),
                                endProtectAxleId5: Number(rows[i][13])
                            });
                        }
                        mainThis.current = arr;
                        mainThis.updateData();
                    } catch (err) {
                        this.$message({
                            message: "读取文件失败",
                            type: "error",
                        });
                        console.log(err);
                    }
                    evt.target.value = null;
                };
            } else {
                this.$message({
                    message: "读取文件过程中发生一点小问题",
                    type: "warning",
                });
            }
        },
        _getRows(str) {
            let rows = [];
            let rowStrs = str.split("\n");
            for (let i = 0; i < rowStrs.length; i++) {
                let row = rowStrs[i];
                let items = row.split(",");
                if (
                    items.length > 2 &&
                    items[0].length == 0 &&
                    items[1].length == 0
                ) {
                    break;
                } else {
                    rows.push(items);
                }
            }
            return rows;
        },
        downLoadTemplate() {
            FileSaveHelper.downloadSetEnterRouteTemplate();
        },
        updateData() {
            this.current.sort((a, b) => {
                return a.startSignalId - b.startSignalId;
            });
        },
        clearData() {
            let mainThis = this;
            this.$confirm("将清除所有已设置的进路, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    mainThis.current = [];
                })
                .catch(() => {});
        },
        fileSelectorOpen() {
            $("#limitSelector").click();
        },
    },
    watch: {
        limitInfo: function () {
            this.current = _.cloneDeep(this.enterRoteInfo);
            if (!this.current) {
                this.current = [];
            }
        },
    },
};
</script>

<style scoped>
el-dialog {
    width: 80hv;
    height: 60hv;
}

.footer {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    justify-items: center;
}

.btn-handle {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
</style>