<template>
    <el-dialog title="选择车站"
        :visible.sync="innerVisible"
        :close-on-click-modal="modalClose"
        width="60%">
        <div class="main">
            <div class="complex-panel">
                <div class="complex-component-list"
                    @click="select()">
                    <ul>
                        <li draggable="true"
                            @dragstart="dragComponent($event, component)"
                            v-for="(component, index) in tctComponents"
                            :key="index"
                            :title="component.name">
                            <div :class="
                  complexSelect && complexSelect.id == component.id
                    ? 'component-selected'
                    : 'component-unselected'
                ">
                                <img :src="component.thumbnail"
                                    @click.stop="select(component)" />
                                <div class="component-name">{{ component.name }}</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="footer">
                <div class="btn-handle">
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
export default {
    props: ["dialogFormVisible"],
    data() {
        return {
            modalClose: false,
            tctComponents: [],
            complexSelect: null,
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
            this.$emit(action, this.complexSelect);
        },
        select(component) {
            this.complexSelect = component;
        },
    },
    watch: {
        gradeInfo: function () {
            this.current = _.cloneDeep(this.gradeInfo);
        },
    },
    mounted() {
        this.complexSelect = null;
        let components = localStorage.getItem("train_run_components");
        if (!components) {
            components = [];
        } else {
            components = JSON.parse(components);
        }
        this.tctComponents = components;
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
    justify-content: flex-end;
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

.complex-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 400px;
}

.complex-component-list {
    flex: 1;
    overflow-y: auto;
}

.complex-component-list ul {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    list-style-type: none;
    padding-inline-start: 15px;
}

.complex-component-list img {
    width: 100px;
    height: 62px;
    background: #222222;
}

.component-selected {
    margin: 3px;
    padding: 3px;
    background: #409eff;
}

.component-unselected {
    margin: 3px;
    padding: 3px;
}
</style>