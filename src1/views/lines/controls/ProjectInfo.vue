<template>
    <el-tabs class="tab-main"
        value="base-info"
        stretch>
        <el-tab-pane label="线路信息"
            name="base-info">
            <div>
                <div class="prop-multi-row"
                    v-show="false">
                    <span class="span-prop-name"
                        style="width:100%">线路名称</span>
                    <el-input size="mini"
                        v-model="project.projectName"
                        placeholder="请输入线路名称"></el-input>
                </div>
                <div class="prop-multi-row"
                    v-show="false">
                    <span class="span-prop-name"
                        style="width:100%">线路描述</span>
                    <el-input size="mini"
                        v-model="project.projectDescription"
                        type="textarea"
                        :rows="4"
                        resize="none"
                        placeholder="线路描述信息"></el-input>
                </div>
                <!-- <el-divider class="horizon-line"></el-divider> -->

                <div class="prop-row">
                    <span class="span-prop-name">视图</span>
                    <el-button type="text"
                        icon="el-icon-minus"
                        size="small"
                        @click="paperSet('scale',project.paperInfo.scale - 0.1)"></el-button>
                    &nbsp&nbsp{{ parseInt(project.paperInfo.scale * 100) }}%
                    <el-button type="text"
                        icon="el-icon-plus"
                        size="small"
                        @click="paperSet('scale',project.paperInfo.scale + 0.1)"></el-button>
                    <el-button size="mini"
                        class="btn-reset"
                        type="text"
                        @click="paperSet('scale',1)">重置</el-button>
                </div>
                <div class="prop-row">
                    <span class="span-prop-name">背景</span>
                    <div class="block1"
                        :style="{'background-color': project.paperInfo.backgroundColor }"></div>
                    <el-color-picker v-model="project.paperInfo.backgroundColor"
                        @change="paperSet('background')"
                        size="mini"></el-color-picker>
                </div>

                <div class="prop-row">
                    <span class="span-prop-name">主线</span>
                    <div class="block1"
                        :style="{'background-color': project.paperInfo.subLineColor }"></div>
                    <el-color-picker v-model="project.paperInfo.subLineColor"
                        @change="paperSet('grid')"
                        size="mini"
                        :disabled="!project.paperInfo.showGrid"></el-color-picker>
                </div>
                <div class="prop-row">
                    <span class="span-prop-name">辅线</span>
                    <div class="block1"
                        :style="{'background-color': project.paperInfo.mainLineColor }"></div>
                    <el-color-picker v-model="project.paperInfo.mainLineColor"
                        @change="paperSet('grid')"
                        size="mini"
                        :disabled="!project.paperInfo.showGrid"></el-color-picker>
                </div>
                <el-switch class="prop-row"
                    v-model="project.paperInfo.showGrid"
                    style="margin-top:5px"
                    inactive-text="显示网格"
                    @change="paperSet('grid')"></el-switch>
                <el-switch class="prop-row"
                    v-model="project.assistInfo.locked"
                    style="margin-top:10px"
                    inactive-text="锁定画布"></el-switch>
                <!--     
                        active-color="#ff4949"
                    inactive-color="#13ce66"
                    active-text-color="#ff4949"
                    inactive-text-color="#13ce66"
                    -->
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
export default {
    props: ["project"],
    data() {
        return {};
    },
    methods: {
        paperSet() {
            this.$emit("paperSet", ...arguments);
        },
    },
    mounted() {},
};
</script>

<style scoped>
.block1 {
    width: 100px;
    height: 20px;
    margin-right: 10px;
}

.block2 {
    width: 100px;
    height: 8px;
    margin-right: 10px;
}

.block3 {
    width: 100px;
    height: 3px;
    margin-right: 10px;
}

.tab-main {
    width: 100%;
}

.span-prop-name {
    width: 50px;
    display: flex;
    justify-content: flex-start;
    font-size: 13px;
}

.span-prop-value {
    display: flex;
    justify-content: flex-start;
    color: #999;
    width: 100%;
    font-size: 13px;
}

.btn-reset {
    margin-left: 30px;
}

.prop-row {
    padding: 3px 15px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.prop-multi-row {
    padding: 5px 15px;
}

el-input {
    flex: 1;
}

.horizon-line {
    background: #409eff;
    margin: 30px 0 10px 0;
}

.el-tabs >>> .el-tabs__content {
    height: calc(100vh - 165px);
    overflow-y: auto;
}
</style>