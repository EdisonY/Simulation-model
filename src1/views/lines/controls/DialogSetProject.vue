<template>
    <el-dialog title="提示"
        width="360px"
        :visible.sync="innerVisible"
        :close-on-click-modal="modalClose">
        <div>
            <p style="font-size:110%;color:#666;margin-top:-20px;margin-bottom:20px">是否保存当前项目</p>

            <div class="footer"
                <div
                class="btn-handle">
                <el-button size="mini"
                    @click="dialogAction('cancelAction')">取 消</el-button>
                <el-button size="mini"
                    @click="dialogAction('dropAction')">放 弃</el-button>
                <el-button type="primary"
                    size="mini"
                    @click="dialogAction('okAction')">确 定</el-button>
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
            this.$emit(action);
        },
    },
};
</script>

<style scoped>

.footer {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    justify-items: center;
}

.btn-handle {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}
</style>