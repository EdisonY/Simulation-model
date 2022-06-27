<template>
    <div class="main">
        <div class="panel">
            <div class="drawArea"></div>
        </div>

        <div class="menu">
            <el-button type="primary"
                size="mini"
                @click="reset">重置</el-button>
            <el-button type="primary"
                size="mini"
                @click="getData">刷新</el-button>
            <el-button type="primary"
                size="mini"
                v-show="showTestBtn"
                @click="getTestData">测试</el-button>
            <div style="margin:5px 5px 0 15px;color:#EEE">宽度系数</div>
            <el-input size="mini"
                style="width:100px"
                v-model="xRate"></el-input>
            <div style="margin:5px 5px 0 15px;color:#EEE">高度系数</div>
            <el-input size="mini"
                style="width:100px"
                v-model="yRate"></el-input>
            <span style="color:white;margin:5px 0 0 20px"
                v-show="this.summaryMode == 1">列车间隔时间: {{trainSuccession/1000}}s</span>
        </div>

        <el-button size="mini"
            v-show="false"
            style="position: absolute; margin-top: 10px; right: 20px"
            @click="jumpPage(1)">去往牵引计算曲线&gt;&gt;</el-button>

        <div class="msgTip"
            style="visibility:visible">
            <div v-for="(data, index) in tooltipData">
                {{data.name}}：{{(data.name=='车站' || data.name=='分区')?(data.value):(parseInt(data.value)/1000+'s')}}
            </div>
        </div>
    </div>
</template>

<script>
import * as joint from "jointjs";
import UICPaper from "./UICPaper";
import * as Utils from "@/utils/util";
import testData1 from "./uic1";
import testData2 from "./uic2";
import {
    registerCallback,
    unregisterCallback,
    sendSock,
    getPackage,
} from "@/utils/ws";

export default {
    data() {
        return {
            paper: null,
            graph: null,
            g: null,
            V: null,
            joint: null,
            tooltipData: [],
            data: [],
            xRate: 0.005,
            yRate: 1,
            project: null,
            summaryMode: 0,
            trainSuccession: 0,
            currentLine: null,
            showTestBtn: false,
            uicDataMode1: null,
            uicDataMode2: null,
        };
    },
    created() {
        registerCallback("UIC", this.wsCallback);
    },
    beforeDestroy() {
        unregisterCallback("UIC");
    },
    async mounted() {
        this.showTestBtn = this.$route.query.show;
        this.summaryMode = parseInt(sessionStorage.getItem("summaryMode"));
        this.summaryMode = this.summaryMode > 0 ? this.summaryMode : 1;

        this.initJoint();

        if (this.summaryMode == 1) {
            this.uicDataMode1 = sessionStorage.getItem("uicDataMode1");
            if (this.uicDataMode1) {
                this.uicDataMode1 = JSON.parse(this.uicDataMode1);
                this.data = this.uicDataMode1;
                this.trainSuccession = this.uicDataMode1.trainSuccession;
                this.paper.drawUIC1(
                    this.data,
                    this.graph,
                    this.xRate,
                    this.yRate
                );
            }
        } else {
            this.uicDataMode2 = sessionStorage.getItem("uicDataMode2");
            if (this.uicDataMode2) {
                this.uicDataMode2 = JSON.parse(this.uicDataMode2);
                this.data = this.uicDataMode2;
                this.paper.drawUIC2(
                    this.data,
                    this.graph,
                    this.xRate,
                    this.yRate
                );
            }
        }

        this.currentLine = sessionStorage.getItem("currentLine");
        if (this.currentLine) {
            this.project = localStorage.getItem(this.currentLine + "-json");
            if (this.project) {
                this.project = JSON.parse(this.project);
            }
        }

        this.getData();
    },
    methods: {
        initJoint() {
            window.joint = joint;
            this.V = joint.V;
            this.graph = new joint.dia.Graph();
            this.g = joint.g;

            let element = document.getElementsByClassName("drawArea");

            this.paper = new UICPaper({
                el: element,
                model: this.graph,
                embeddingMode: true,
                width: 5000,
                height: 2000,
                background: {
                    color: "#001528",
                },
            });
            this.paper.initPaperEvent();
            this.paper.toolTip = this.setToolTip;
            this.paper.project = this.project;
        },
        onRestLine() {
            this.paper.reset();
        },
        setToolTip(detail, position, show) {
            this.tooltipData = [];
            if (
                detail.TimeNames &&
                detail.TimeValues &&
                detail.TimeNames.length == detail.TimeValues.length
            ) {
                for (let i = 0; i < detail.TimeNames.length; i++) {
                    this.tooltipData.push({
                        name: detail.TimeNames[i],
                        value: detail.TimeValues[i],
                    });
                }
            }
        },
        reset() {
            this.paper.reset();
        },
        getData() {
            let mainThis = this;
            if (this.summaryMode == 1) {
                let needSend = getPackage(132, null);
                sendSock(needSend);
            } else if (this.summaryMode == 2) {
                let needSend = getPackage(134, null);
                sendSock(needSend);
            } else {
                this.$message({
                    message: "泳道图数据模式不明：" + this.summaryMode,
                    type: "warning",
                });
            }
        },
        getTestData() {
            if (this.summaryMode == 1) {
                this.data = testData1.data;
                this.trainSuccession = testData1.data.trainSuccession;
                this.paper.drawUIC1(
                    this.data,
                    this.graph,
                    this.xRate,
                    this.yRate
                );
            } else if (this.summaryMode == 2) {
                this.data = testData2.data;
                this.paper.drawUIC2(
                    this.data,
                    this.graph,
                    this.xRate,
                    this.yRate
                );
            } else {
                this.$message({
                    message: "泳道图数据模式不明：" + this.summaryMode,
                    type: "warning",
                });
            }
        },
        jumpPage(index) {
            if (index == 1) {
                this.$router.push({ path: "/traincapacity/analysis" });
            }
        },
        wsCallback(res) {
            if (res.msgType == 232) {
                this.data = res.data;
                this.trainSuccession = res.data.trainSuccession;
                this.paper.drawUIC1(
                    this.data,
                    this.graph,
                    this.xRate,
                    this.yRate
                );

                sessionStorage.setItem(
                    "uicDataMode1",
                    JSON.stringify(this.data)
                );
            } else if (res.msgType == 234) {
                this.data = res.data;
                this.paper.drawUIC2(
                    this.data,
                    this.graph,
                    this.xRate,
                    this.yRate
                );
                sessionStorage.setItem(
                    "uicDataMode2",
                    JSON.stringify(this.data)
                );
            }
        },
    },
};
</script>

<style scoped>
.main {
    height: calc(100vh - 58px);
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.panel {
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.menu {
    position: absolute;
    display: flex;
    padding: 10px;
    background: #001528;
}

.msgTip {
    width: 280px;
    height: 200px;
    overflow: auto;
    background-color: #194a9955;
    color: #fff;
    text-align: left;
    padding: 5px 5px 5px 10px;
    border-radius: 6px;
    position: absolute;
    z-index: 1;
    margin-top: 0px !important;
    right: 20px;
    bottom: 15px;
}
</style>

