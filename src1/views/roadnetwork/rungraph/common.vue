<template>
    <div class="dashboard-container">
        <rungrap ref="grap"
            :rungrapData="rungrapData" />
    </div>
</template>

<script>
import rungrap from "./lib_common_bak";
import { getStations } from "@/utils/station";
import {
    registerCallback,
    unregisterCallback,
    sendSock,
    getPackage,
} from "@/utils/ws";
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
        registerCallback("commonpage", this.wsCallback);

        let data = getPackage(103, 2);

        sendSock(data);

        this.rungrapData.multiply = this.$route.meta.type;
        let currentLine = sessionStorage.getItem("currentLine");
        this.rungrapData.station = getStations(currentLine);
        console.log(this.rungrapData.station);

        // *配置上下行线路及坐标主颜色，组件内已默认，可自定义设置
        this.rungrapData.colors = ["#5793f3", "#d14a61"];
    },
    mounted() {},
    methods: {
        getRungrapClick(params) {
            console.log(params);
        },
        drewPlan() {
            this.$refs.grap.drewPlan();
        },
        wsCallback(res) {
            var self = this;
            if (res.msgType == 203) {
                if (res.data && res.data.length > 0) {
                    window.sessionStorage.setItem(
                        "rungrap",
                        JSON.stringify(res.data[0].serveList)
                    );
                    window.sessionStorage.setItem(
                        "planRungrap",
                        JSON.stringify(res.data[1].serveList)
                    );
                    initData(res.data[0].serveList,true);
                    return;
                }
            }

            // *确认获取到运行图源数据后，将源数据挂载到浏览器本地session中，key值为rungrap。并执行运行图组件内的initData方法
            // * window.sessionStorage.setItem('rungrap',your get data
            function initData() {
                self.$nextTick(() => {
                    //self.$refs.grap.initData();
                });
            }
        },
    },
    beforeDestroy() {
        unregisterCallback("commonpage");
    },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
    height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    z-index: 99;
    min-height: 953px;
}
</style>
