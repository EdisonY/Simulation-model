<template>
    <el-dialog title="统一设置道岔型号"
        :visible.sync="innerVisible"
        :close-on-click-modal="modalClose">
        <div class="main">
            <el-radio v-model="current"
                label="1">9#直尖轨</el-radio>
            <el-radio v-model="current"
                label="2">9#曲尖轨</el-radio>
            <el-radio v-model="current"
                label="3">7#道岔</el-radio>
            <el-radio v-model="current"
                label="4">12#道岔</el-radio>
            <p style="color:orange">统一设置道岔型号功能目前只支持道岔型号和限速值同步更新，公里标不变化。</p>

            <div class="footer"
                <div
                class="btn-handle">
                <el-button size="mini"
                    @click="dialogAction('cancelAction')">取 消</el-button>
                <el-button type="primary"
                    size="mini"
                    @click="dialogAction('okAction')">确 定</el-button>
            </div>
        </div>
        </div>
    </el-dialog>
</template>

<script>
import _ from "lodash";

export default {
    props: ["dialogFormVisible"],
    data() {
        return {
            modalClose: false,
            current: 0,
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
            if (action == "okAction" && this.current == "0") {
                this.$message({
                    message: "请选择道岔型号",
                    type: "warning",
                });
                return;
            }
            this.$emit(action, this.current);
        },
    },
};
</script>

<style scoped>
el-dialog {
    width: 500px;
    height: 400px;
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