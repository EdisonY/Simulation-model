<template>
    <div class="indicator"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 1)">
        <el-row>
            <el-col :span="8">
                <div class="grid-content bg-purple-left">
                    <div class="grid-main">
                        <div class="charts"
                            ref="lt"></div>
                    </div>
                    <div class="grid-main">
                        <div class="charts"
                            ref="lm"></div>
                    </div>
                    <div class="grid-main">
                        <div class="charts"
                            ref="lb"></div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple-middle">
                    <div class="grid-main">
                        <div class="charts"
                            ref="mt"></div>
                    </div>
                    <div class="grid-main">
                        <div class="charts"
                            ref="mm"
                            v-loading="mmLoading"></div>
                    </div>
                    <div class="grid-main">
                        <div class="charts"
                            ref="mb"
                            v-loading="mbLoading"></div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple-right">
                    <div class="grid-main">
                        <div class="charts"
                            ref="rt"></div>
                    </div>
                    <div class="grid-main">
                        <div class="charts"
                            ref="rm"
                            v-loading="rmLoading"></div>
                    </div>
                    <div class="grid-main">
                        <div class="charts"
                            ref="rb"
                            v-loading="rbLoading"></div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-dialog title="点击信息"
            :visible.sync="dialogVisible"
            width="30%">
            <ul>
                <li>图表名称：{{propCharts.title}}</li>
                <li>图表X轴：{{propCharts.name}}</li>
                <li>图表数值：{{propCharts.value}}</li>
                <li>数值类型：{{propCharts.unit}}</li>
                <li></li>
            </ul>
        </el-dialog>
    </div>
</template>

<script>
import {
    registerCallback,
    unregisterCallback,
    sendSock,
    getPackage,
} from "@/utils/ws";
import echarts from "echarts";
import "echarts/extension/bmap/bmap";
import * as Utils from "@/utils/util";
import testData1 from "./testData1";
import testData from "./testData";

var lt = null;
var lm = null;
var lb = null;
var mt = null;
var mm = null;
var mb = null;
var rt = null;
var rm = null;
var rb = null;
var color = ["#3398DB", "#ed7d31"];
var tooltip = {
    trigger: "axis",
    axisPointer: {
        type: "cross",
        crossStyle: {
            color: "#999",
        },
    },
};
export default {
    name: "Dashboard",
    data() {
        return {
            propCharts: {},
            dialogVisible: false,
            loading: false,
            tableData: [],
            ltoption: {
                color: color,
                title: {
                    text: "通过能力",
                    left: "center",
                    top: 5,
                },
                tooltip: tooltip,
                xAxis: {
                    type: "category",
                    data: [],
                },
                yAxis: {
                    type: "value",
                },
                series: [
                    {
                        data: [],
                        type: "bar",
                        barMaxWidth: "20%",
                        emphasis: {
                            itemStyle: {
                                barBorderWidth: 1,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: "rgba(0,0,0,0.5)",
                            },
                        },
                        showBackground: false,
                        backgroundStyle: {
                            color: "bule",
                        },
                    },
                ],
            },
            lmoption: {
                color: color,
                title: {
                    text: "运力运量匹配关系",
                    left: "center",
                    top: 5,
                },
                tooltip: tooltip,
                legend: {
                    bottom: 0,
                    data: ["断面客流量", "运能"],
                },
                xAxis: [
                    {
                        type: "category",
                        data: [],
                        axisLabel: {
                            rotate: 50,
                            fontSize: 10,
                        },
                        axisPointer: {
                            type: "shadow",
                        },
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "断面客流量",
                        // min: 0,
                        // max: 50000,
                        // interval: 10000,
                        // axisLabel: {
                        //     formatter: '{value}'
                        // }
                    },
                    {
                        type: "value",
                        name: "运能",
                        // min: 0,
                        // max: 50000,
                        // interval: 10000,
                        // axisLabel: {
                        //     formatter: '{value}'
                        // }
                    },
                ],
                series: [
                    {
                        name: "断面客流量",
                        type: "bar",
                        data: [],
                        emphasis: {
                            itemStyle: {
                                barBorderWidth: 1,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: "rgba(0,0,0,0.5)",
                            },
                        },
                    },
                    {
                        name: "运能",
                        type: "line",
                        yAxisIndex: 1,
                        data: [],
                        emphasis: {
                            itemStyle: {
                                barBorderWidth: 1,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: "rgba(0,0,0,0.5)",
                            },
                        },
                    },
                ],
            },
            lboption: {
                color: color,
                title: {
                    text: "能耗表现",
                    left: "center",
                    top: 5,
                },
                tooltip: tooltip,
                xAxis: {
                    type: "category",
                    data: [],
                },
                yAxis: {
                    type: "value",
                },
                series: [
                    {
                        data: [],
                        type: "bar",
                        barMaxWidth: "20%",
                        emphasis: {
                            itemStyle: {
                                barBorderWidth: 1,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: "rgba(0,0,0,0.5)",
                            },
                        },
                        showBackground: false,
                        backgroundStyle: {
                            color: "bule",
                        },
                    },
                ],
            },
            mtoption: {
                color: color,
                tooltip: tooltip,
                title: {
                    text: "全日进出站客流",
                    left: "center",
                    top: 5,
                },
                legend: {
                    data: ["进站", "出站"],
                    bottom: 0,
                },
                xAxis: {
                    type: "category",
                    data: [],
                    axisLabel: {
                        rotate: 50,
                        fontSize: 8,
                    },
                    axisPointer: {
                        type: "shadow",
                    },
                },
                yAxis: [
                    {
                        type: "value",
                        name: "客流",
                        min: 0,
                        axisLabel: {
                            formatter: "{value}",
                        },
                    },
                ],
                series: [
                    {
                        name: "进站",
                        type: "bar",
                        emphasis: {
                            itemStyle: {
                                barBorderWidth: 1,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: "rgba(0,0,0,0.5)",
                            },
                        },
                        data: [],
                    },
                    {
                        name: "出站",
                        type: "bar",

                        emphasis: {
                            itemStyle: {
                                barBorderWidth: 1,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: "rgba(0,0,0,0.5)",
                            },
                        },
                        data: [],
                    },
                ],
            },
            mmoption: {
                color: color,
                title: {
                    text: "高峰小时断面客流分布(7:30 - 8:30)",
                    left: "center",
                    top: 5,
                },
                tooltip: tooltip,
                legend: {
                    show: false,
                    data: ["数据1", "数据2"],
                    left: 10,
                },
                xAxis: {
                    data: [],
                    name: "",
                    axisLine: {
                        onZero: true,
                    },
                    splitLine: {
                        show: false,
                    },
                    axisLabel: {
                        rotate: 50,
                        fontSize: 8,
                    },
                    splitArea: {
                        show: false,
                    },
                },
                yAxis: {
                    inverse: true,
                    splitArea: {
                        show: false,
                    },
                },
                series: [
                    {
                        name: "数据1",
                        type: "bar",
                        stack: "one",
                        emphasis: {
                            itemStyle: {
                                barBorderWidth: 1,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: "rgba(0,0,0,0.5)",
                            },
                        },
                        data: [],
                    },
                    {
                        name: "数据2",
                        type: "bar",
                        stack: "one",
                        emphasis: {
                            itemStyle: {
                                barBorderWidth: 1,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: "rgba(0,0,0,0.5)",
                            },
                        },
                        data: [],
                    },
                ],
            },
            mboption: {
                color: ["#3398DB", "#ed7d31", "#666"],
                title: {
                    text: "牵引能耗（万度）",
                    left: "center",
                    top: 5,
                },
                tooltip: tooltip,
                legend: {
                    bottom: 0,
                    data: ["公里(车公里)", "能耗(度)", "单耗(度/车公里)"],
                },
                xAxis: [
                    {
                        type: "category",
                        data: [],
                        axisPointer: {
                            type: "shadow",
                        },
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "公里(车公里)",
                    },
                    {
                        type: "value",
                        name: "能耗(度)",
                    },
                ],
                series: [
                    {
                        name: "公里(车公里)",
                        type: "bar",
                        emphasis: {
                            itemStyle: {
                                barBorderWidth: 1,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: "rgba(0,0,0,0.5)",
                            },
                        },
                        data: [],
                    },
                    {
                        name: "能耗(度)",
                        type: "bar",
                        emphasis: {
                            itemStyle: {
                                barBorderWidth: 1,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: "rgba(0,0,0,0.5)",
                            },
                        },
                        data: [],
                    },
                    {
                        name: "单耗(度/车公里)",
                        type: "line",
                        yAxisIndex: 1,
                        data: [],
                    },
                ],
            },
            rtoption: {
                color: color,
                title: {
                    text: "乘客平均候车时间(全天.S)",
                    left: "center",
                    top: 5,
                },
                tooltip: tooltip,
                xAxis: {
                    type: "category",
                    data: [],
                    axisLabel: {
                        rotate: 50,
                        fontSize: 8,
                    },
                },
                yAxis: {
                    type: "value",
                },
                series: [
                    {
                        data: [],
                        type: "bar",
                        emphasis: {
                            itemStyle: {
                                barBorderWidth: 1,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: "rgba(0,0,0,0.5)",
                            },
                        },
                        showBackground: false,
                        backgroundStyle: {
                            color: "bule",
                        },
                    },
                ],
            },
            rboption: {
                color: color,
                title: {
                    text: "1001",
                    left: "center",
                    top: 5,
                },
                tooltip: tooltip,
                xAxis: {
                    axisLabel: {
                        rotate: 50,
                        fontSize: 10,
                    },
                    type: "category",
                    data: [],
                },
                yAxis: {
                    type: "value",
                },
                series: [
                    {
                        data: [],
                        type: "bar",
                        emphasis: {
                            itemStyle: {
                                barBorderWidth: 1,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: "rgba(0,0,0,0.5)",
                            },
                        },
                        showBackground: false,
                        backgroundStyle: {
                            color: "bule",
                        },
                    },
                ],
            },
            mmLoading: false,
            mbLoading: false,
            rbLoading: false,
            rmLoading: false,
            currentLine: "",
        };
    },
    computed: {
        opend() {
            return this.$store.state.app.sidebar.opened;
        },
    },
    watch: {
        opend(oldValue, newValue) {
            this.resize();
        },
    },
    mounted() {},
    created() {
        registerCallback("index1-1", this.wsCallback);
        this.currentLine = sessionStorage.getItem("currentLine");
        var self = this;
        let data = getPackage(106, null);

        sendSock(data, (res) => {
            // TODO
        });
        window.sessionStorage.setItem("indicator", JSON.stringify(testData));
        window.sessionStorage.setItem("MiddleTop", JSON.stringify(testData1));
        self.$nextTick(() => {
            self.initData();
        });

        var geoCoordMap = {
            1: [119.2070396626, 26.0471838188],
            2: [119.2147498638, 26.0481609598],
            3: [119.209339, 26.038355],
            4: [119.2163806469, 26.0442086921],
            5: [119.2132263691, 26.0498767809],
            6: [119.219382299, 26.0524969442],
            7: [119.2194920093, 26.0496647145],
            8: [119.2194276363, 26.0475440293],
            9: [119.225689, 26.044945],
            10: [119.215699, 26.045237],
            11: [119.2191260061, 26.0366349971],
            12: [119.212969, 26.039069],
        };
        var oneData = [
            [
                {
                    name: "1",
                },
                {
                    name: "2",
                    value: 20,
                },
            ],
            [
                {
                    name: "1",
                },
                {
                    name: "3",
                    value: 20,
                },
            ],
            [
                {
                    name: "1",
                },
                {
                    name: "4",
                    value: 20,
                },
            ],
        ];
        var planePath =
            "path://M512 0l455.111111 1024-452.835555-113.777778L56.888889 1024z";
        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var fromCoord = geoCoordMap[dataItem[0].name];
                var toCoord = geoCoordMap[dataItem[1].name];
                if (fromCoord && toCoord) {
                    res.push({
                        fromName: dataItem[0].name,
                        toName: dataItem[1].name,
                        coords: [fromCoord, toCoord],
                    });
                }
            }
            return res;
        };
        var color = ["green"];
        var series = [];
        [["1", oneData]].forEach(function (item, i) {
            series.push(
                {
                    name: item[0],
                    type: "effectScatter",
                    coordinateSystem: "bmap",
                    zlevel: 2,
                    rippleEffect: {
                        brushType: "stroke",
                    },
                    label: {
                        normal: {
                            show: true,
                            position: "right",
                            formatter: "{b}",
                        },
                    },
                    symbolSize: function (val) {
                        return val[2] / 4;
                    },
                    showEffectOn: "render",
                    itemStyle: {
                        normal: {
                            color: color[i],
                        },
                    },
                    data: [
                        {
                            name: item[0],
                            value: geoCoordMap[item[0]].concat([100]),
                        },
                    ],
                },
                {
                    name: item[0] + " Top10",
                    type: "lines",
                    coordinateSystem: "bmap",
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.7,
                        color: "#a2f3a2", //拖尾颜色
                        symbolSize: 3,
                    },
                    lineStyle: {
                        normal: {
                            color: color[i],
                            width: 0,
                            curveness: 0.2,
                        },
                    },
                    data: convertData(item[1]),
                },
                {
                    name: item[0] + " Top10",
                    type: "lines",
                    coordinateSystem: "bmap",
                    zlevel: 2,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0,
                        symbol: planePath,
                        symbolSize: 15,
                    },
                    lineStyle: {
                        normal: {
                            color: color[i],
                            width: 1,
                            opacity: 0.4,
                            curveness: 0.2,
                        },
                    },
                    data: convertData(item[1]),
                },
                {
                    name: item[0] + " Top10",
                    type: "effectScatter",
                    coordinateSystem: "bmap",
                    zlevel: 2,
                    rippleEffect: {
                        brushType: "stroke",
                    },
                    label: {
                        normal: {
                            show: true,
                            position: "right",
                            formatter: "{b}",
                        },
                    },
                    symbolSize: function (val) {
                        return val[2] / 4;
                    },
                    showEffectOn: "render",
                    itemStyle: {
                        normal: {
                            color: color[i],
                        },
                    },
                    data: item[1].map(function (dataItem) {
                        return {
                            name: dataItem[1].name,
                            value: geoCoordMap[dataItem[1].name].concat([
                                dataItem[1].value,
                            ]),
                        };
                    }),
                }
            );
        });
        var option = {
            bmap: {
                // 百度地图中心经纬度 坐标拾取器http://api.map.baidu.com/lbsapi/getpoint/index.html
                center: [119.2166696096, 26.0446365813],
                // 百度地图缩放等级，数字越大，放大越大，地图比例尺越小
                zoom: 15,
                // 是否开启拖拽缩放，可以只设置 'scale' 或者 'move'
                roam: "move",
                // mapStyle是百度地图的自定义样式，见 http://developer.baidu.com/map/custom/
                mapStyle: {
                    styleJson: [
                        {
                            featureType: "background",
                            elementType: "all",
                            stylers: {
                                color: "#fcfcfc",
                            },
                        },
                        {
                            featureType: "road",
                            elementType: "all",
                            stylers: {
                                lightness: 20,
                            },
                        },
                        {
                            featureType: "highway",
                            elementType: "geometry",
                            stylers: {
                                color: "#f49935",
                            },
                        },
                        {
                            featureType: "railway",
                            elementType: "all",
                            stylers: {
                                visibility: "off",
                            },
                        },
                        {
                            featureType: "local",
                            elementType: "labels",
                            stylers: {
                                visibility: "off",
                            },
                        },
                        {
                            featureType: "water",
                            elementType: "all",
                            stylers: {
                                color: "#d1e5ff",
                            },
                        },
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: {
                                visibility: "off",
                            },
                        },
                    ],
                },
            },
            //series是在地图上的线条等效果的配置文件，具体可以查阅文档。
            series: series,
        };
        this.rmopotion = option;
    },
    beforeDestroy() {
        unregisterCallback("index1-1");
    },
    methods: {
        resize() {
            setTimeout(() => {
                lt.resize();
                lm.resize();
                lb.resize();
                mt.resize();
                mm.resize();
                mb.resize();
                rt.resize();
                rm.resize();
                rb.resize();
            }, 300);
        },
        drawLine() {
            var self = this;
            lt = this.$echarts.init(this.$refs.lt);
            lm = this.$echarts.init(this.$refs.lm);
            lb = this.$echarts.init(this.$refs.lb);
            mt = this.$echarts.init(this.$refs.mt);
            mm = this.$echarts.init(this.$refs.mm);
            mb = this.$echarts.init(this.$refs.mb);
            rt = this.$echarts.init(this.$refs.rt);
            rm = this.$echarts.init(this.$refs.rm);
            rb = this.$echarts.init(this.$refs.rb);

            lt.setOption(this.ltoption, true);
            lm.setOption(this.lmoption, true);
            lb.setOption(this.lboption, true);
            mt.setOption(this.mtoption, true);
            mm.setOption(this.mmoption, true);
            mb.setOption(this.mboption, true);
            rt.setOption(this.rtoption, true);
            rm.setOption(this.rmopotion, true);
            rb.setOption(this.rboption, true);

            lt.on("click", function (params) {
                self.jump(params, lt, 0);
            });
            lm.on("click", function (params) {
                self.jump(params, lm, 1);
            });
            lb.on("click", function (params) {
                self.jump(params, lb, 2);
            });
            mt.on("click", function (params) {
                self.jump(params, mt, 3);
            });
            mm.on("click", function (params) {
                self.jump(params, mm, 4);
            });
            mb.on("click", function (params) {
                self.jump(params, mb, 5);
            });
            rt.on("click", function (params) {
                self.jump(params, rt, 6);
            });
            rm.on("click", function (params) {
                self.jump(params, rm, 7);
            });
            rb.on("click", function (params) {
                self.jump(params, rb, 8);
            });
            console.log(mt.getOption());

            window.addEventListener("resize", function () {
                self.resize();
            });
        },
        initData() {
            this.loading = false;
            var self = this;
            var numIn = 0;
            var numOut = 0;
            var a = 0;
            var b = 0;

            if (sessionStorage.MiddleTop) {
                var MiddleTop = JSON.parse(sessionStorage.MiddleTop);
                this.mtoption.xAxis.data = MiddleTop.vecStation;
                this.mtoption.series[0].data = MiddleTop.vecIOData[0];
                this.mtoption.series[1].data = MiddleTop.vecIOData[1];
            }

            if (sessionStorage.indicator) {
                var indicator = JSON.parse(sessionStorage.indicator);
                this.ltoption.xAxis.data = indicator.x1AblitySummary;
                this.ltoption.series[0].data = indicator.y1AblitySummary[0];

                this.rtoption.xAxis.data = indicator.xStationNames;
                this.rtoption.series[0].data =
                    indicator.y3PassengerAverageWaitingTime[0];

                this.lmoption.xAxis[0].data = indicator.x4CapacityAndVolume;
                this.lmoption.series[0].data = indicator.y4CapacityAndVolume[0];
                this.lmoption.series[1].data = indicator.y4CapacityAndVolume[1];

                this.mmoption.xAxis.data = indicator.xStationNames;
                this.mmoption.series[0].data = indicator.y5morningPeaks[0];
                this.mmoption.series[1].data = indicator.y5morningPeaks[1];

                this.lboption.xAxis.data = indicator.x7EnergySummary;
                this.lboption.series[0].data = indicator.y7EnergySummary[0];

                this.mboption.xAxis[0].data = indicator.x8EnergyTraction;
                this.mboption.series[0].data = indicator.y8EnergyTraction[0];
                this.mboption.series[1].data = indicator.y8EnergyTraction[1];
                this.mboption.series[2].data = indicator.y8EnergyTraction[2];

                this.rboption.xAxis.data = indicator.x9Speed;
                this.rboption.series[0].data = indicator.y9Speed[0];
            }
            this.drawLine();
        },
        jump(params, charts, index) {
            var self = this;
            console.log(params, charts.getOption());

            this.propCharts = {
                title: charts.getOption().title[0].text,
                name: params.name,
                value: params.value,
                unit: params.seriesName,
            };

            switch (index) {
                case 0: // 通过能力
                    // TODO：这个页面不知道干啥，也不能用
                    //self.$router.push({ path: "passtime" || "passtime" });
                    break;
                case 1: // 动力运量匹配关系
                    self.mmLoading = true;
                    setTimeout(() => {
                        self.mmoption.title.text =
                            "高峰小时断面客流分布(" + params.name + ")";
                        mm.setOption(self.mmoption, true);
                        self.mmLoading = false;
                    }, 2000);
                    break;
                case 2: // 能耗表现
                    self.mbLoading = true;
                    setTimeout(() => {
                        self.mboption.title.text = params.name;
                        mb.setOption(self.mboption, true);
                        self.mbLoading = false;
                    }, 2000);
                    break;
                case 4: // 高峰小时断面
                    self.rmLoading = true;
                    setTimeout(() => {
                        // self.rmoption.title.text = params.name
                        // rm.setOption(self.rmoption,true)
                        self.rmLoading = false;
                    }, 2000);
                    break;
                case 5: // 能耗表现二级
                    self.rbLoading = true;
                    setTimeout(() => {
                        self.rboption.title.text = params.name;
                        rb.setOption(self.rboption, true);
                        self.rbLoading = false;
                    }, 2000);
                    break;
                default:
                    self.dialogVisible = true;
                    break;
            }
        },
        wsCallback(res) {
            if (res.msgType == 206) {
                if (res.evalIndiSummary && res.evalIndiSummary != "") {
                    window.sessionStorage.setItem(
                        "indicator",
                        JSON.stringify(res.evalIndiSummary)
                    );
                    let data = getPackage(503, {
                        lineName: this.currentLine,
                    });
                    sendSock(data);
                    this.initData();
                }
            } else if (res.msgType == 603) {
                window.sessionStorage.setItem(
                    "MiddleTop",
                    JSON.stringify(res.data)
                );
                this.$nextTick(() => {
                    this.initData();
                });
            }
        },
    },
};
</script>

<style scoped>
.grid-content .grid-main:first-child {
    border-top: 1px solid #ccc;
}
.grid-content .grid-main:last-child {
    border-bottom: none;
}
.dashboard-container {
    height: calc(100vh - 50px);
    width: 100%;
    overflow-y: auto;
    padding-bottom: 50px;
    overflow-x: hidden;
}
.grid-main {
    height: calc((100vh - 50px) / 3);
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    background-image: linear-gradient(#ffffff, #dedede);
}
.charts {
    height: 100%;
    width: 100%;
}
.indicator {
    width: 100%;
    height: 100%;
}
.el-dialog ul li {
    line-height: 50px;
    font-size: 16px;
    font-weight: bold;
}
</style>

