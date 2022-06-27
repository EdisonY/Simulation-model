<template>
    <div class="indicator">
        <div class="left">
            <p>正线牵引计算结果</p>
            <div style="font-weight:bold">上行:</div>
            <ul>
                <li>旅行距离(m):{{indicator.upSummary.travelDis / 100}} </li>
                <li>旅行时间(s):{{indicator.upSummary.travelTime / 1000}}</li>
                <li>最小间隔(s):{{indicator.upSummary.minHw / 1000}}</li>
                <li>旅行速度(km/h):{{indicator.upSummary.travelV * 3600 / 100000}}</li>
                <li>技术速度(km/h):{{indicator.upSummary.technicalV * 3600 / 100000}}</li>
            </ul>
            <div style="font-weight:bold;margin-top:20px">下行:</div>
            <ul>
                <li>旅行距离(m):{{indicator.downSummary.travelDis / 100}} </li>
                <li>旅行时间(s):{{indicator.downSummary.travelTime / 1000}}</li>
                <li>最小间隔(s):{{indicator.downSummary.minHw / 1000}}</li>
                <li>旅行速度(km/h):{{indicator.downSummary.travelV * 3600 / 100000}}</li>
                <li>技术速度(km/h):{{indicator.downSummary.technicalV * 3600 / 100000}}</li>
            </ul>
        </div>
        <div class="div-panel">
            <div class="calcH"
                ref="aaa"></div>
        </div>
    </div>
</template>

<script>
// import echarts from "echarts";
import * as Utils from "@/utils/util";
import echarts from "echarts";
var charts = null;
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
    name: "indicator",
    props: ["indicator"],
    data() {
        return {
            currentTime: Utils.getCurrentDate(),
            loading: true,
            tempData: [],
            echart: null,
            option: {
                color: color,
                tooltip: tooltip,
                title: {
                    text: "各站通过能力",
                    left: "center",
                    top: 5,
                },
                grid: {
                    left: 40,
                    top: 40,
                    bottom: 60,
                    right: 40,
                },
                legend: {
                    data: ["上行", "下行"],
                    bottom: 0,
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
                            padding: 0,
                        },
                        axisTick: {
                            alignWithLabel: true,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "秒",
                        min: 0,
                        interval: 100,
                        axisLabel: {
                            formatter: "{value}",
                        },
                    },
                ],
                series: [
                    {
                        name: "上行",
                        type: "bar",
                        barCategoryGap: "40%",
                        emphasis: {
                            itemStyle: {
                                barBorderWidth: 1,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: "rgba(0,0,0,0.5)",
                            },
                        },
                        barGap: "10%",
                        data: [],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true, //开启显示
                                    position: "top", //在上方显示
                                    textStyle: {
                                        //数值样式
                                        color: "black",
                                        fontSize: 10,
                                    },
                                },
                            },
                        },
                    },
                    {
                        name: "下行",
                        type: "bar",
                        barGap: "10%",
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
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true, //开启显示
                                    position: "top", //在上方显示
                                    textStyle: {
                                        //数值样式
                                        color: "black",
                                        fontSize: 10,
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        };
    },
    created() {
        this.$nextTick(() => {
            this.initData();
        });
    },
    methods: {
        resize() {
            setTimeout(() => {
                charts.resize();
            }, 300);
        },
        drawLine() {
            var self = this;
            if (charts) {
                charts.clear();
            }
            charts = this.$echarts.init(this.$refs.aaa);
            console.log(this.option);
            charts.setOption(this.option, true);
            window.addEventListener("resize", function () {
                self.resize();
            });
            this.loading = false;
        },
        initData() {
            // if(!this.indicator){
            //     return;
            // }
            var indicator = this.indicator;
            for (
                let index = 0;
                index <
                indicator.t1AblityDetail.stationPassTimeInterval100[0].length;
                index++
            ) {
                indicator.t1AblityDetail.stationPassTimeInterval100[0][index] =
                    indicator.t1AblityDetail.stationPassTimeInterval100[0][
                        index
                    ] / 100;
            }
            for (
                let index = 0;
                index <
                indicator.t1AblityDetail.stationPassTimeInterval100[1].length;
                index++
            ) {
                indicator.t1AblityDetail.stationPassTimeInterval100[1][index] =
                    indicator.t1AblityDetail.stationPassTimeInterval100[1][
                        index
                    ] / 100;
            }
            this.option.xAxis[0].data = indicator.xStationNames;
            this.option.series[0].data =
                indicator.t1AblityDetail.stationPassTimeInterval100[0];
            this.option.series[1].data =
                indicator.t1AblityDetail.stationPassTimeInterval100[1];
            this.drawLine();
        },
    },
};
</script>

<style scoped>
.left {
    float: left;
    width: 300px;
    text-align: left;
    padding: 0 0 0 20px;
}
.left p {
    font-weight: bold;
}
.left ul {
    text-align: left;
    padding: 0;
}
.left ul li {
    list-style: none;
    line-height: 40px;
}
.calcH {
    height: 100%;
    width: 800px;
    position: relative;
    opacity: 1;
    float: left;
    min-height: 200px;
}
.div-panel {
    width: 800px;
    height: 100%;
    overflow: auto;
}
</style>
