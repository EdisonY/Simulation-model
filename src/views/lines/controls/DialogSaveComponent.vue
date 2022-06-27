<template>
    <el-dialog title="组件信息"
        :visible.sync="innerVisible"
        :close-on-click-modal="modalClose">
        <div>
            <div class="prop-row">
                <div class="prop-name">名称</div>
                <el-input v-model="form.name"
                    auto-complete="off"></el-input>
            </div>
            <div class="prop-row">
                <div class="prop-name">描述</div>
                <el-input v-model="form.desc"
                    auto-complete="off"></el-input>
            </div>
            <el-tabs v-model="selectTab"
                type="card">
                <el-tab-pane label="联锁关系"
                    name="first">
                    <el-table ref="table1"
                        :data="form.InterLocking"
                        height="300"
                        max-height="300"
                        style="width: 100%">
                        <el-table-column label="折返Link"
                            width="80">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.ReverseLink"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="折返道岔"
                            width="80">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.ReversePoint"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="折返道岔状态"
                            width="105">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.ReversePointStatus"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="释放点link"
                            width="90">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.ReleasePointLnk"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column label="释放点off"
                            width="80">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.ReleasePointOff"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="释放点方向"
                            width="90">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.ReleasePointDir"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="后撤点link"
                            width="90">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.BehindPointLnk"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="后撤点off"
                            width="80">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.BehindPointOff"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="后撤点方向"
                            width="90">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.BehindPointDir"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="折返区"
                            width="120">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.ReverseAreaStr"></el-input>
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
                </el-tab-pane>
                <el-tab-pane label="正向通过"
                    name="upPass">
                    <el-table ref="table2"
                        :data="form.RouteInfo.upPass"
                        height="300"
                        max-height="300"
                        style="width: 100%">
                        <el-table-column label="关联停车区顺序"
                            width="300">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.dataStr"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="当前停车区"
                            width="120">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.id"></el-input>
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
                </el-tab-pane>
                <el-tab-pane label="正向折返"
                    name="upReverse">
                    <el-table ref="table3"
                        :data="form.RouteInfo.upReverse"
                        height="300"
                        max-height="300"
                        style="width: 100%">
                        <el-table-column label="关联停车区顺序"
                            width="300">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.dataStr"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="当前停车区"
                            width="120">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.id"></el-input>
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
                </el-tab-pane>
                <el-tab-pane label="反向通过"
                    name="downPass">
                    <el-table ref="table4"
                        :data="form.RouteInfo.downPass"
                        height="300"
                        max-height="300"
                        style="width: 100%">
                        <el-table-column label="关联停车区顺序"
                            width="300">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.dataStr"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="当前停车区"
                            width="120">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.id"></el-input>
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
                </el-tab-pane>
                <el-tab-pane label="反向折返"
                    name="downReverse">
                    <el-table ref="table5"
                        :data="form.RouteInfo.downReverse"
                        height="300"
                        max-height="300"
                        style="width: 100%">
                        <el-table-column label="关联停车区顺序"
                            width="300">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.dataStr"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="当前停车区"
                            width="120">
                            <template slot-scope="scope">
                                <el-input size="mini"
                                    v-model="scope.row.id"></el-input>
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
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="footer">
            <div class="btn-handle">
                <el-button type="success"
                    size="mini"
                    @click="addItem">添 加</el-button>
            </div>
            <div class="btn-handle">
                <el-button size="mini"
                    @click="dialogAction('cancelAction')">取 消</el-button>
                <el-button type="primary"
                    size="mini"
                    @click="dialogAction('okAction')">确 定</el-button>
            </div>
            <!-- 隐藏的file处理 -->
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: ["dialogFormVisible"],
    data() {
        return {
            modalClose: false,
            form: {
                name: "",
                desc: "",
                InterLocking: [],
                RouteInfo: {
                    upPass: [],
                    upReverse: [],
                    downPass: [],
                    downReverse: [],
                },
            },
            formLabelWidth: "80px",
            selectTab: "first",
        };
    },
    computed: {
        innerVisible: {
            // getter
            get: function () {
                return this.dialogFormVisible;
            },
            // setter
            set: function (newValue) {
                if (!newValue) {
                    this.dialogAction("cancelAction");
                }
            },
        },
    },
    methods: {
        dialogAction(action) {
            if (action == "okAction") {
                if (!this.form.name) {
                    this.$message({
                        message: "名称不能为空",
                        type: "error",
                    });
                    return;
                }
                try {
                    this.form.InterLocking.forEach((item) => {
                        item.ReverseLink = Number(item.ReverseLink);
                        item.ReversePoint = Number(item.ReversePoint);
                        item.ReversePointStatus = Number(
                            item.ReversePointStatus
                        );
                        item.ReleasePointLnk = Number(item.ReleasePointLnk);
                        item.ReleasePointOff = Number(item.ReleasePointOff);
                        item.ReleasePointDir = Number(item.ReleasePointDir);
                        item.BehindPointLnk = Number(item.BehindPointLnk);
                        item.BehindPointOff = Number(item.BehindPointOff);
                        item.BehindPointDir = Number(item.BehindPointDir);
                        item.ReverseArea = JSON.parse(item.ReverseAreaStr);
                    });
                } catch (err) {
                    this.$message({
                        message: err,
                        type: "error",
                    });
                    return;
                }

                try {
                    this.form.RouteInfo.upPass.forEach((item) => {
                        item.id = Number(item.id);
                        item.data = JSON.parse(item.dataStr);
                    });
                    this.form.RouteInfo.upReverse.forEach((item) => {
                        item.id = Number(item.id);
                        item.data = JSON.parse(item.dataStr);
                    });
                    this.form.RouteInfo.downPass.forEach((item) => {
                        item.id = Number(item.id);
                        item.data = JSON.parse(item.dataStr);
                    });
                    this.form.RouteInfo.downReverse.forEach((item) => {
                        item.id = Number(item.id);
                        item.data = JSON.parse(item.dataStr);
                    });
                } catch (err) {
                    this.$message({
                        message: err,
                        type: "error",
                    });
                    return;
                }
            }
            let resultData = _.cloneDeep(this.form);
            delete resultData.InterLocking.ReverseAreaStr;
            resultData.RouteInfo.upPass.forEach((item) => {
                delete item.dataStr;
            });
            resultData.RouteInfo.upReverse.forEach((item) => {
                delete item.dataStr;
            });
            resultData.RouteInfo.downPass.forEach((item) => {
                delete item.dataStr;
            });
            resultData.RouteInfo.downReverse.forEach((item) => {
                delete item.dataStr;
            });

            this.$emit(action, resultData);
            this.form = {
                name: "",
                desc: "",
                InterLocking: [],
                RouteInfo: {
                    upPass: [],
                    upReverse: [],
                    downPass: [],
                    downReverse: [],
                },
            };
        },
        handleDelete(a, b) {
            if (this.selectTab == "first") {
                let index = this.form.InterLocking.indexOf(b);
                if (index > -1) {
                    this.form.InterLocking.splice(index, 1);
                }
            } else if (this.selectTab == "upPass") {
                let index = this.form.RouteInfo.upPass.indexOf(b);
                if (index > -1) {
                    this.form.RouteInfo.upPass.splice(index, 1);
                }
            } else if (this.selectTab == "upReverse") {
                let index = this.form.RouteInfo.upReverse.indexOf(b);
                if (index > -1) {
                    this.form.RouteInfo.upReverse.splice(index, 1);
                }
            } else if (this.selectTab == "downPass") {
                let index = this.form.RouteInfo.downPass.indexOf(b);
                if (index > -1) {
                    this.form.RouteInfo.downPass.splice(index, 1);
                }
            } else if (this.selectTab == "downReverse") {
                let index = this.form.RouteInfo.downReverse.indexOf(b);
                if (index > -1) {
                    this.form.RouteInfo.downReverse.splice(index, 1);
                }
            }
        },
        addItem() {
            if (this.selectTab == "first") {
                this._addItem1();
            } else if (this.selectTab == "upPass") {
                this._addItem2();
            } else if (this.selectTab == "upReverse") {
                this._addItem3();
            } else if (this.selectTab == "downPass") {
                this._addItem4();
            } else if (this.selectTab == "downReverse") {
                this._addItem5();
            }
        },
        _addItem1() {
            let item = {
                ReverseLink: 0,
                ReversePoint: 0,
                ReversePointStatus: 0,
                ReleasePointLnk: 0,
                ReleasePointOff: 0,
                ReleasePointDir: 0,
                BehindPointLnk: 0,
                BehindPointOff: 0,
                BehindPointDir: 0,
                ReverseAreaStr: "",
                ReverseArea: [],
            };
            this.form.InterLocking.push(item);
            let that = this;

            // TODO 此处不是一个好的方法，但是找不到合适的事件或者回调解决
            setTimeout(() => {
                that.$refs.table1.bodyWrapper.scrollTop =
                    that.$refs.table1.bodyWrapper.scrollHeight;
            }, 0);
        },
        _addItem2() {
            let item = {
                dataStr: "",
                data: [],
                id: 0,
            };
            this.form.RouteInfo.upPass.push(item);
            let that = this;

            // TODO 此处不是一个好的方法，但是找不到合适的事件或者回调解决
            setTimeout(() => {
                that.$refs.table2.bodyWrapper.scrollTop =
                    that.$refs.table2.bodyWrapper.scrollHeight;
            }, 0);
        },
        _addItem3() {
            let item = {
                dataStr: "",
                data: [],
                id: 0,
            };
            this.form.RouteInfo.upReverse.push(item);
            let that = this;

            // TODO 此处不是一个好的方法，但是找不到合适的事件或者回调解决
            setTimeout(() => {
                that.$refs.table3.bodyWrapper.scrollTop =
                    that.$refs.table3.bodyWrapper.scrollHeight;
            }, 0);
        },
        _addItem4() {
            let item = {
                dataStr: "",
                data: [],
                id: 0,
            };
            this.form.RouteInfo.downPass.push(item);
            let that = this;

            // TODO 此处不是一个好的方法，但是找不到合适的事件或者回调解决
            setTimeout(() => {
                that.$refs.table4.bodyWrapper.scrollTop =
                    that.$refs.table4.bodyWrapper.scrollHeight;
            }, 0);
        },
        _addItem5() {
            let item = {
                dataStr: "",
                data: [],
                id: 0,
            };
            this.form.RouteInfo.downReverse.push(item);
            let that = this;

            // TODO 此处不是一个好的方法，但是找不到合适的事件或者回调解决
            setTimeout(() => {
                that.$refs.table5.bodyWrapper.scrollTop =
                    that.$refs.table5.bodyWrapper.scrollHeight;
            }, 0);
        },
    },
};
</script>

<style scoped>
.prop-row {
    padding: 3px 15px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size: 10px;
}

.prop-name {
    margin-right: 15px;
}

.prop-value {
    width: auto;
    color: rgb(70, 164, 241);
}

.option-row {
    padding: 10px 15px 0px 15px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
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
}

.el-select >>> .el-input__inner {
    -web-kit-appearance: none;
    -moz-appearance: none;
    font-size: 1em;
    border-radius: 2;
    border: 1px solid #dcdfe6;
    color: #606266;
    height: 25px;
    padding: 0 15px;
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