<template>
    <el-dialog title="设置坡度"
        :visible.sync="innerVisible"
        :close-on-click-modal="modalClose"
        width="80%">
        <div class="main">
            <el-table ref="table"
                :data="current.data"
                height="400"
                max-height="400"
                :cell-style="cellStyle"
                :row-class-name="tableRowClassName"
                style="width: 100%">
                <el-table-column label="坡度编号"
                    width="120">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="起点公里标(m)"
                    width="130">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.startKm"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="终点公里标(m)"
                    width="130">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.endKm"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="坡度值(‰)"
                    width="120">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.value"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="竖曲线半径(m)"
                    width="120">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.R"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="上下行线路"
                    width="140">
                    <template slot-scope="scope">
                        <div class="direction">
                            <el-select size="mini"
                                v-model="scope.row.direction">
                                <el-option v-for="item in directions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <div style="width:80px;height: 10px;margin-left:5px"
                                v-bind:style="{background:scope.row.direction==1?'#793':'#49f'}"></div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button size="mini"
                            type="info"
                            @click="addItem(scope.$index, scope.row)">添加</el-button>
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
                        @click="updateData">重新排序</el-button>
                    <el-button type="danger"
                        size="mini"
                        @click="clearData">清 空</el-button>
                    <el-button type="text"
                        size="mini"
                        @click="downLoadTemplate">下载导入模板</el-button>
                </div>
                <div class="btn-handle">
                    <!-- <el-checkbox v-model="current.useUniform">统一限速</el-checkbox> -->
                    <span style="color:rgb(64,158,255)">统一坡度(‰)</span>
                    <el-input size="mini"
                        style="margin-left: 20px; width: 80px"
                        v-model="current.uniformGradeValue"></el-input>
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
                    id="gradeSelector"
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
    props: ["gradeInfo", "dialogFormVisible"],
    data() {
        return {
            modalClose: false,
            current: _.cloneDeep(this.gradeInfo),
            directions: [
                {
                    name: "上行",
                    value: 1,
                },
                {
                    name: "下行",
                    value: 2,
                },
            ],
            slopes: [
                {
                    name: "无坡度",
                    value: 0,
                },
                {
                    name: "上坡",
                    value: 1,
                },
                {
                    name: "下坡",
                    value: 2,
                },
            ],
            HId: null,
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
                this.current = _.cloneDeep(this.gradeInfo);
            } else {
                let check = this.updateData();
                if (!check) {
                    this.$message({
                        message: "公里标数据不合法，请检查",
                        type: "warning",
                    });
                    return;
                }
            }
            this.HId = null;
            this.$emit(action, this.current);
        },
        handleDelete(a, b) {
            let index = this.current.data.indexOf(b);
            if (index > -1) {
                this.current.data.splice(index, 1);
            }
        },
        addItem(index, row) {
            if (index > -1) {
                let item = {
                    id: index + 1,
                    startKm: 0,
                    endKm: 0,
                    direction: 1,
                    value: 0,
                    R: 0,
                };
                this.current.data.splice(index + 1, 0, item);
                for (let i = index + 1; i < this.current.data.length; i++) {
                    this.current.data[i].id += 1;
                }
            } else {
                let item = {
                    id: 0,
                    startKm: 0,
                    endKm: 0,
                    direction: 1,
                    value: 0,
                    R: 0,
                };
                this.current.data.push(item);
                let that = this;
                // TODO 此处不是一个好的方法，但是找不到合适的事件或者回调解决
                setTimeout(() => {
                    that.$refs.table.bodyWrapper.scrollTop =
                        that.$refs.table.bodyWrapper.scrollHeight;
                }, 0);
            }
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

                        let grades = [];

                        for (let i = 1; i < rows.length - 1; i++) {
                            grades.push({
                                id: rows[i][0],
                                startKm: Number(rows[i][1]),
                                endKm: Number(rows[i][2]),
                                value: Number(rows[i][3]),
                                R: Number(rows[i][4]),
                                direction: Number(rows[i][5]),
                            });
                        }
                        mainThis.current.data = grades;
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
            FileSaveHelper.downloadSetGradeTemplate();
        },
        updateData() {
            let check = true;
            this.current.data.sort((a, b) => {
                if (a.direction == b.direction) {
                    return a.startKm - b.startKm;
                } else {
                    return a.direction - b.direction;
                }
            });

            let index = 1;
            let lastElement = null;
            this.current.data.forEach((d) => {
                d.checkStartKm = false;
                d.checkEndKm = false;
                d.id = index++;
                d.innerId = d.id;
                if (
                    lastElement &&
                    lastElement.endKm > d.startKm &&
                    lastElement.direction == d.direction
                ) {
                    lastElement.checkEndKm = true;
                    d.checkStartKm = true;
                    check = false;
                }
                lastElement = d;
            });

            return check;
        },
        clearData() {
            let mainThis = this;
            this.$confirm("将清除所有已设置的坡度, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    mainThis.current.data = [];
                })
                .catch(() => {});
        },
        fileSelectorOpen() {
            $("#gradeSelector").click();
        },
        cellStyle({ row, column, rowIndex, columnIndex }) {
            if (columnIndex == 3) {
                if (row.value > 40) {
                    return "background-color:red";
                }
            } else if (columnIndex == 2) {
                if (row.checkEndKm) {
                    return "background-color:red";
                }
            } else if (columnIndex == 1) {
                if (row.checkStartKm) {
                    return "background-color:red";
                }
            }
            return;
        },
        tableRowClassName({ row, rowIndex }) {
            if (this.HId && this.HId.originData) {
                if (row.innerId == this.HId.originData.innerId) {
                    return "warning-row";
                }
            }
        },
        setHId(data) {
            this.HId = data;
            if (data && data.originData) {
                setTimeout(() => {
                    let height = this.$refs.table.bodyWrapper.scrollHeight;
                    height = (height * data.originData.innerId) / this.current.data.length-200;
                    this.$refs.table.bodyWrapper.scrollTop = height;
                }, 0);
            }
        },
    },
    watch: {
        gradeInfo: function () {
            this.current = _.cloneDeep(this.gradeInfo);
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

.direction {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
</style>

<style>
.el-table .warning-row {
    background: rgb(219, 132, 82);
}

.el-table .success-row {
    background: #f0f9eb;
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #ccc0;
}
</style>