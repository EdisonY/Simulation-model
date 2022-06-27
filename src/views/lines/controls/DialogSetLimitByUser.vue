<template>
    <el-dialog title="自定义限速"
        :visible.sync="innerVisible"
        :close-on-click-modal="modalClose"
        width="80%">
        <div class="main">
            <el-table ref="table"
                :data="current.data"
                height="400"
                max-height="400"
                style="width: 100%">
                <el-table-column label="起点公里标(m)"
                    width="130">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.startCm"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="终点公里标(m)"
                    width="130">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.endCm"></el-input>
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
                <el-table-column label="限速值(km/h)"
                    width="120">
                    <template slot-scope="scope">
                        <el-input size="mini"
                            v-model="scope.row.V"></el-input>
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
                        @click="updateData">重新排序</el-button>
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
                    id="limitByUserSelector"
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
    props: ["limitInfoByUser", "dialogFormVisible"],
    data() {
        return {
            modalClose: false,
            current: _.cloneDeep(this.limitInfoByUser),
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
                this.current = _.cloneDeep(this.limitInfoByUser);
            } else {
                this.updateData();
            }
            this.$emit(action, this.current);
        },
        handleDelete(a, b) {
            let index = this.current.data.indexOf(b);
            if (index > -1) {
                this.current.data.splice(index, 1);
            }
        },
        addItem() {
            let item = {
                startCm: 0,
                endCm: 0,
                direction: 1,
                H: 0,
                R: 0,
            };
            this.current.data.push(item);
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

                        let grades = [];

                        for (let i = 1; i < rows.length - 1; i++) {
                            grades.push({
                                startCm: Number(rows[i][0]),
                                endCm: Number(rows[i][1]),
                                direction: Number(rows[i][2]),
                                V: Number(rows[i][3]),
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
            FileSaveHelper.downloadSetLimitByUserTemplate();
        },
        updateData() {
            this.current.data.sort((a, b) => {
                if (a.direction == b.direction) {
                    return a.startCm - b.startCm;
                } else {
                    return a.direction - b.direction;
                }
            });
        },
        clearData() {
            let mainThis = this;
            this.$confirm("将清除所有已设置的限速, 是否继续?", "提示", {
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
            $("#limitByUserSelector").click();
        },
    },
    watch: {
        limitInfoByUser: function () {
            this.current = _.cloneDeep(this.limitInfoByUser);
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