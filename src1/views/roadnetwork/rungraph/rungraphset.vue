<template>
    <div class="dashboard-container">
        <!-- <el-button @click="drewPlan()" style="position:absolute;z-index:99999">默认按钮</el-button> -->
        <rungrap ref="grap"
            :rungrapData="rungrapData" />
    </div>
</template>

<script>
import rungrap from "./lib_common_new";
import {getStations} from '@/utils/station';
export default {
    name: "Rungrap",
    data() {
        return {
            rungrapData: {},
        };
    },
    components: {
        rungrap,
    },
    created() {
        var self = this;
        this.rungrapData = {}
        var data = {
            msgId: 1,
            msgType: 103,
            requestId: "12345678",
            session: this.$getCurrentDate(),
            timestamp: this.$getCurrentDate(),
            data: 2,
        };

        this.rungrapData.multiply = this.$route.meta.type;
        let currentLine = sessionStorage.getItem("currentLine");
        this.rungrapData.station=getStations(currentLine);
        console.log(this.rungrapData);
      
        // *配置上下行线路及坐标主颜色，组件内已默认，可自定义设置
        this.rungrapData.colors = ["#5793f3", "#d14a61"];

        // *确认获取到运行图源数据后，将源数据挂载到浏览器本地session中，key值为rungrap。并执行运行图组件内的initData方法
        // * window.sessionStorage.setItem('rungrap',your get data
        function initData() {
            self.$nextTick(() => {
                self.$refs.grap.initData();
            });
        }
    },
    mounted() {},
    methods: {
        getRungrapClick(params) {
            console.log(params);
        },
        drewPlan() {
            this.$refs.grap.drewPlan();
        },
    },
    beforeDestroy() {
        this.rungrapData = {}
    },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
    height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    z-index: 99;
    min-height: 890px;
}
</style>
