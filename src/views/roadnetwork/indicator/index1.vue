<template>
    <div class="indicator"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 1)">

        <!-- 指标信息 -->
        <el-row v-if="data239">
            <el-col :span="18">
                <div class="grid-content bg-purple-middle">
                    <div class="grid-main2">
                        <div class="charts"
                            ref="ex1"></div>
                    </div>
                    <div class="grid-main2 loadrate-div"
                        v-if="data239">
                        <p>高峰时段各断面客流量和运力的关系</p>
                        <p>时间区段:{{_getTimeStr(data239.CapacityVolumeRelation2.timeInterval.startTime,1000)}}-{{_getTimeStr(data239.CapacityVolumeRelation2.timeInterval.endTime,1000)}}</p>
                        <el-table :data="data239.CapacityVolumeRelation2.sectionPassenger"
                            height="400"
                            style="width: 99.5%">
                            <el-table-column label="车站区间">
                                <template slot-scope="scope">
                                    <span>{{scope.row.sectionName.sectionName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="上行运量">
                                <template slot-scope="scope">
                                    <span>{{scope.row.upPassengerVolumeCapacity.volumeValue}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="上行运力">
                                <template slot-scope="scope">
                                    <span>{{scope.row.upPassengerVolumeCapacity.capacityValue}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="下行运量">
                                <template slot-scope="scope">
                                    <span>{{scope.row.downPassengerVolumeCapacity.volumeValue}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="下行运力">
                                <template slot-scope="scope">
                                    <span>{{scope.row.downPassengerVolumeCapacity.capacityValue}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                    <div class="grid-main2 diy-div"
                        v-if="data239">
                        <p>各时段最大断面客流量和运力的关系</p>
                        <div class="item-title">
                            <span>时间区段</span>
                            <span>车站区间</span>
                            <span>上行运量</span>
                            <span>上行运力</span>
                            <span>下行运量</span>
                            <span>下行运力</span>
                        </div>
                        <div style="height: calc((100vh - 50px) / 3 * 2 -50px);overflow-y: auto;margin:5px"
                            ref="scrollDom"
                            @scroll="scroll">
                            <div :style="{height:data239.eachPeriodCapacityVolumeRelation1.length*50+'px'}">
                                <div style="position:relative;width: 100%"
                                    :style="{top:startIndex*50+'px'}">
                                    <div v-for="(item,index) in splitData"
                                        :key="index"
                                        class="item">
                                        <span>{{_getTimeStr(item.timeInterval.startTime,1000)}}-{{_getTimeStr(item.timeInterval.endTime,1000)}}</span>
                                        <span>{{item.sectionName.sectionName}}</span>
                                        <span>{{item.upEachSecCapacityVolume.y1PeakVolume}}</span>
                                        <span>{{item.upEachSecCapacityVolume.y2PeakCapacity}}</span>
                                        <span>{{item.downEachSecCapacityVolume.y1PeakVolume}}</span>
                                        <span>{{item.downEachSecCapacityVolume.y2PeakCapacity}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple-left">
                    <div v-if="data239 && data239.peakHourMaxSecLoadRate1"
                        class="grid-main2 loadrate-div">
                        <p>高峰小时最大断面满载率(%)</p>
                        <p>时间区段:{{_getTimeStr(data239.peakHourMaxSecLoadRate1.timeInterval.startTime,1000)}}-{{_getTimeStr(data239.peakHourMaxSecLoadRate1.timeInterval.endTime,1000)}}</p>
                        <div class="loadrate-div">
                            <div style="background-color:rgb(56,167,240)">
                                <p class="loadrate-p">上行区段:{{data239.peakHourMaxSecLoadRate1.upMaxSecLoadRate.sectionName.sectionName}}</p>
                                <p class="loadrate-p">满载率:{{data239.peakHourMaxSecLoadRate1.upMaxSecLoadRate.loadRate}}%</p>
                            </div>
                            <div style="background-color:rgb(56,167,240)">
                                <p class="loadrate-p">下行区段:{{data239.peakHourMaxSecLoadRate1.downMaxSecLoadRate.sectionName.sectionName}}</p>
                                <p class="loadrate-p">满载率:{{data239.peakHourMaxSecLoadRate1.downMaxSecLoadRate.loadRate}}%</p>
                            </div>
                        </div>
                    </div>
                    <div class="grid-main4"
                        id="exDiv">
                    </div>
                </div>
            </el-col>
        </el-row>

        <div v-if="data239"
            class="grid-content bg-purple-left  grid-main2">
            <div class="charts"
                ref="ex2"></div>
        </div>
        <div style="height:10px"></div>

        <el-button class="export"
            type="danger"
            size="mini"
            round
            :disabled="!data239"
            @click="exportWordFile"
            icon="el-icon-download">
            下载报告
        </el-button>
    </div>
</template>

<script>
import echarts from "echarts";
import "echarts/extension/bmap/bmap";
import * as Utils from "@/utils/util";
import { getStationsObj } from "@/utils/station";
import FileSaver from "file-saver";
import $ from "jquery";
import {
    registerCallback,
    unregisterCallback,
    sendSock,
    getPackage,
} from "@/utils/ws";

var ex1 = null;
var ex2 = null;
var color = ["#3398DB", "#ed7d31"];

export default {
    name: "Dashboard",
    data() {
        return {
            loading: false,
            currentLine: "",
            data239: null,
            stations: {},
            stationsIds: [],
            startIndex: 0,
            scrollDomHeight: 800,
        };
    },
    computed: {
        opend() {
            return this.$store.state.app.sidebar.opened;
        },
        limitCount() {
            return this.scrollDomHeight / 50 + 2;
        },
        splitData() {
            return this.data239.eachPeriodCapacityVolumeRelation1.slice(
                this.startIndex,
                this.startIndex + this.limitCount
            );
        },
    },
    watch: {
        opend(oldValue, newValue) {
            this.resize();
        },
    },
    mounted() {
        this.stations = getStationsObj(this.currentLine);
        this.stationsIds = [];
        let i = 1;
        for (let prop in this.stations) {
            this.stationsIds.push(i++);
        }
    },
    created() {
        registerCallback("abcdefg", this.wsCallback);
        this.currentLine = sessionStorage.getItem("currentLine");
        let data = getPackage(139, null);
        sendSock(data, this.wsCallback);
    },
    methods: {
        resize() {
            setTimeout(() => {
                ex1.resize();
                ex2.resize();
            }, 300);
        },
        wsCallback(res) {
            if (res.msgType == 206) {
                if (res.evalIndiSummary && res.evalIndiSummary != "") {
                    window.sessionStorage.setItem(
                        "indicator",
                        JSON.stringify(res.evalIndiSummary)
                    );
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
            } else if (res.msgType == 239) {
                console.log("--- 239 data ---");
                console.log(res);

                this.data239 = res.data;
                this.draw239data();
            }
        },
        draw239data() {
            this._drawSimpleData();
        },
        _getTimeStr(value, div = 1) {
            value /= div;
            let hour = parseInt(value / 3600);
            let minute = parseInt((value % 3600) / 60);
            let second = parseInt((value % 3600) % 60);
            return `${hour < 10 ? 0 : ""}${hour}:${
                minute < 10 ? 0 : ""
            }${minute}:${second < 10 ? 0 : ""}${second}`;
        },
        _drawSimpleData() {
            $(() => {
                $("#exDiv").empty();
                $("#exDiv")
                    // .append(
                    //     ` <div title="列车在运营线路上运载乘客时的速度">技术速度: <span>${this.data239.techSpeedResult.Speed}</span> km/h</div>`
                    // )
                    // .append(
                    //     `<div title="列车在运营线路上自起点至终点沿途不停站时间的运行速度">旅行速度:</span> ${this.data239.travelSpeedResult.Speed}</span> km/h</div>`
                    // )
                    // .append(
                    //     `<div title="列车在运营线路上运行过程中不同位置的速度（列车运行曲线）">列车运营速度:</span> ${this.data239.operateSpeedResult.Speed}</span> km/h</div>`
                    // )
                    .append(
                        `<div title="平峰时段列车全周转时间">平峰全周转时间:</span> ${this.data239.normalPeakAroundTime}</span> s</div>`
                    )
                    .append(
                        `<div title="高峰时段列车全周转时间">全峰全周转时间:</span> ${this.data239.peakAroundTime}</span> s</div>`
                    )
                    // .append(
                    //     `<div title="车站同一方向连续两辆车正常通过（不站外停车）的最小行车间隔（发车间隔）">车站通过能力:</span> ${this.data239.passingAbility}</span> min</div>`
                    // )
                    // .append(
                    //     `<div title="折返站连续俩列车正常折返（不区间停车）的最小行车间隔">折返能力:</span> ${this.data239.reverseAbility}</span> min</div>`
                    // )
                    .append(
                        `<div title="高峰时段线路单位时间内提供的全部载客运营列车的运输能力">高峰小时运力:</span> ${this.data239.peakHourCapacity}</span> 人</div>`
                    )
                    .append(
                        `<div title="全天有效换乘衔接列次数量占全天的列次数量比例">有效衔接比例:</span> ${this.data239.effectiveConnectionRatio}</span> %</div>`
                    )
                    .append(
                        `<div title="第一列列车出库时间至最后一列列车回库时间">全天运行时间:</span> ${this.data239.allDayOperatingTime}</span> h</div>`
                    )
                    .append(
                        `<div title="全天上下行方向运行列次总数（包含轧道车）">开行列次:</span> ${this.data239.allTripCount}</span> </div>`
                    )
                    .append(
                        `<div title="全天所有上线列车运行公里数（不包含在折返线、车辆段出入库线、联络线、渡线行驶的里程）">运行公里数:</span> ${parseInt(
                            this.data239.runningKilometers
                        )}</span> km</div>`
                    )
                    .append(
                        `<div title="高峰时段所需上线的车底数">最大上线列车数:</span> ${this.data239.maxOnlineTrains}</span> </div>`
                    )
                    .append(
                        `<div title="全天运行最大上线列车数占全线配属列车数比例">列车利用率:</span> ${this.data239.trainUtilization}</span> %</div>`
                    );
                // let colors = [
                //     "#5470c6",
                //     "#91cc75",
                //     "#fac858",
                //     "#ee6666",
                //     "#73c0de",
                //     "#3ba272",
                //     "#fc8452",
                //     "#9a60b4",
                //     "#ea7ccc",
                // ];
                let colors = [
                    "#5470c6",
                    "#91cc75",
                    "#fac858",
                    "#73c0de",
                    "#3ba272",
                ];
                let index = 0;
                let $divs = $("#exDiv div");
                $divs.addClass("simple");
                $divs.each(function () {
                    $(this).css(
                        "background-color",
                        colors[index++ % colors.length]
                    );
                });
                this._drawChartData();
            });
        },
        _drawChartData() {
            this._drawEx1();
            this._drawEx2();
        },
        _drawEx1() {
            ex1 = this.$echarts.init(this.$refs.ex1);
            let ex1option = {
                color: color,
                grid: {
                    left: "6%",
                    right: "3%",
                },
                title: {
                    text: "各时段最大断面满载率(%)",
                    left: "center",
                    top: 5,
                },
                tooltip: {
                    position: "top",
                },
                xAxis: {
                    type: "category",
                    data: [],
                    splitArea: {
                        show: true,
                    },
                },
                yAxis: {
                    type: "category",
                    data: this.stationsIds,

                    splitArea: {
                        show: true,
                    },
                    axisLabel: {
                        formatter: (value, index) => {
                            let r = value;
                            for (let item in this.stations) {
                                if (this.stations[item] == value) {
                                    r = item;
                                }
                            }
                            return r;
                        },
                        verticalAlign: "bottom",
                        margin: 8,
                    },
                },
                visualMap: {
                    min: 0,
                    max: 100,
                    calculable: true,
                    orient: "horizontal",
                    left: "center",
                    bottom: "0",
                },
                series: [],
            };
            if (this.data239.eachPeriodMaxSecLoadRate1) {
                let ex1s1 = {
                    name: "上行",
                    type: "heatmap",
                    stack: "up",
                    emphasis: {
                        focus: "series",
                    },
                    data: [],
                };
                let ex1s2 = {
                    name: "下行",
                    type: "heatmap",
                    stack: "down",
                    emphasis: {
                        focus: "series",
                    },
                    data: [],
                };

                let s1, s2;
                this.data239.eachPeriodMaxSecLoadRate1.forEach((item) => {
                    let timeStr = this._getTimeStr(
                        item.timeInterval.startTime,
                        1000
                    );
                    let timeStrUp = timeStr + "(上行)";
                    let timeStrDown = timeStr + "(下行)";
                    if (ex1option.xAxis.data.indexOf(timeStrUp) == -1) {
                        ex1option.xAxis.data.push(timeStrUp);
                        ex1option.xAxis.data.push(timeStrDown);
                    }
                    // 上行
                    let upStations =
                        item.upMaxSecLoadRate.sectionName.sectionName.split(
                            "-"
                        );
                    if (upStations && upStations.length == 2) {
                        s1 = this.stations[upStations[0]];
                        s2 = this.stations[upStations[1]];
                        if (s1 > 0 && s2 > 0) {
                            if (s1 > s2) {
                                let m = s1;
                                s1 = s2;
                                s2 = m;
                            }
                            for (let i = s1; i < s2; i++) {
                                ex1s1.data.push([
                                    timeStrUp,
                                    i,
                                    item.upMaxSecLoadRate.loadRate,
                                ]);
                            }
                        } else {
                            console.log("---1");
                            console.log(item);
                            console.log(upStations);
                        }
                    } else {
                        console.log("---2");
                        console.log(item);
                        console.log(upStations);
                    }

                    // 下行
                    let downStations =
                        item.downMaxSecLoadRate.sectionName.sectionName.split(
                            "-"
                        );
                    if (downStations && downStations.length == 2) {
                        s1 = this.stations[downStations[0]];
                        s2 = this.stations[downStations[1]];
                        if (s1 > 0 && s2 > 0) {
                            if (s1 > s2) {
                                let m = s1;
                                s1 = s2;
                                s2 = m;
                            }
                            for (let i = s1; i < s2; i++) {
                                ex1s2.data.push([
                                    timeStrDown,
                                    i,
                                    item.downMaxSecLoadRate.loadRate,
                                ]);
                            }
                        } else {
                            console.log("1---1");
                            console.log(item);
                            console.log(downStations);
                        }
                    } else {
                        console.log("2---2");
                        console.log(item);
                        console.log(downStations);
                    }
                });
                ex1option.series = [ex1s1, ex1s2];
            }
            ex1.setOption(ex1option, true);
        },
        _drawEx2() {
            ex2 = this.$echarts.init(this.$refs.ex2);
            let ex2option = {
                grid: {
                    left: "5%",
                },
                color: [
                    "#5470c6",
                    "#91cc75",
                    "#fac858",
                    "#ee6666",
                    "#73c0de",
                    "#3ba272",
                    "#fc8452",
                    "#9a60b4",
                    "#ea7ccc",
                ],
                title: {
                    text: "车站乘客滞留人数",
                    left: "center",
                    top: 5,
                },
                legend: {
                    type: "scroll",
                    orient: "vertical",
                    right: 30,
                    top: 60,
                    bottom: 60,
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "line",
                        crossStyle: {
                            color: "#999",
                        },
                        label: {
                            formatter: (a, b, c) => {
                                return this._getTimeStr(a.value, 1);
                            },
                        },
                    },
                },
                xAxis: {
                    type: "value",
                    min: "dataMin",
                    max: 86400,
                    splitArea: {
                        show: true,
                    },
                    axisLabel: {
                        formatter: (value, index) => {
                            let r = value;
                            r = this._getTimeStr(value, 1);
                            return r;
                        },
                    },
                },
                yAxis: {
                    type: "value",
                    min: 0,
                    max: "dataMax",
                    splitArea: {
                        show: true,
                    },
                },
                series: [],
            };
            if (this.data239.stationStrandPassengerList) {
                this.data239.stationStrandPassengerList.forEach((item) => {
                    let stationName = "-";
                    for (let prop in this.stations) {
                        if (this.stations[prop] == item.stationId) {
                            stationName = prop;
                        }
                    }

                    let serial = {
                        name: stationName,
                        type: "line",
                        data: [],
                        symbolSize: 0,
                    };

                    item.stationStrangePassList.forEach((d) => {
                        serial.data.push([
                            parseInt(d.seconds / 1000),
                            d.passengerCount,
                        ]);
                    });

                    ex2option.series.push(serial);
                });
            }
            ex2.setOption(ex2option, true);
        },
        scroll() {
            // 根据滚动的距离，估算出这个滚动位置对应的数组序列，例如滚动100px，每条40px，对应第3条
            let scrollTop = this.$refs.scrollDom.scrollTop;
            this.startIndex = Math.floor(scrollTop / 50);
        },
        _getWordData() {
            if (!this.data239) {
                return {
                    lineName: this.currentLine,
                };
            }
            let data = {
                lineName: this.currentLine,
                data1: [],
                data2time:
                    this._getTimeStr(
                        this.data239.peakHourMaxSecLoadRate1.timeInterval
                            .startTime,
                        1000
                    ) +
                    "-" +
                    this._getTimeStr(
                        this.data239.peakHourMaxSecLoadRate1.timeInterval
                            .endTime,
                        1000
                    ),
                data2upSegment:
                    this.data239.peakHourMaxSecLoadRate1.upMaxSecLoadRate
                        .sectionName.sectionName,
                data2upLoadRate:
                    this.data239.peakHourMaxSecLoadRate1.upMaxSecLoadRate
                        .loadRate,
                data2downSegment:
                    this.data239.peakHourMaxSecLoadRate1.downMaxSecLoadRate
                        .sectionName.sectionName,
                data2downLoadRate:
                    this.data239.peakHourMaxSecLoadRate1.downMaxSecLoadRate
                        .loadRate,
                data3: [],
                data4: [],
                data5: [],
                techSpeed: this.data239.techSpeedResult.Speed,
                travelSpeed: this.data239.travelSpeedResult.Speed,
                operateSpeed: this.data239.operateSpeedResult.Speed,
                normalPeakAroundTime: this.data239.normalPeakAroundTime,
                peakAroundTime: this.data239.peakAroundTime,
                passingAbility: this.data239.passingAbility,
                reverseAbility: this.data239.reverseAbility,
                peakHourCapacity: this.data239.peakHourCapacity,
                effectiveConnectionRatio: this.data239.effectiveConnectionRatio,
                allDayOperatingTime: this.data239.allDayOperatingTime,
                allTripCount: this.data239.allTripCount,
                runningKilometers: this.data239.runningKilometers.toFixed(2),
                maxOnlineTrains: this.data239.maxOnlineTrains,
                trainUtilization: this.data239.trainUtilization,
            };

            if (this.data239.eachPeriodMaxSecLoadRate1) {
                this.data239.eachPeriodMaxSecLoadRate1.forEach((d) => {
                    data.data1.push({
                        time:
                            this._getTimeStr(d.timeInterval.startTime, 1000) +
                            "-" +
                            this._getTimeStr(d.timeInterval.endTime, 1000),
                        segment: d.upMaxSecLoadRate.sectionName.sectionName,
                        loadRate: d.upMaxSecLoadRate.loadRate,
                    });
                    data.data1.push({
                        time:
                            this._getTimeStr(d.timeInterval.startTime, 1000) +
                            "-" +
                            this._getTimeStr(d.timeInterval.endTime, 1000),
                        segment: d.downMaxSecLoadRate.sectionName.sectionName,
                        loadRate: d.downMaxSecLoadRate.loadRate,
                    });
                });
            }

            if (this.data239.CapacityVolumeRelation2) {
                data.data3time =
                    this._getTimeStr(
                        this.data239.CapacityVolumeRelation2.timeInterval
                            .startTime,
                        1000
                    ) +
                    "-" +
                    this._getTimeStr(
                        this.data239.CapacityVolumeRelation2.timeInterval
                            .endTime,
                        1000
                    );
                this.data239.CapacityVolumeRelation2.sectionPassenger.forEach(
                    (d) => {
                        data.data3.push({
                            segment: d.sectionName.sectionName,
                            upVolumeValue:
                                d.upPassengerVolumeCapacity.volumeValue,
                            upCapacityValue:
                                d.upPassengerVolumeCapacity.capacityValue,
                            downVolumeValue:
                                d.downPassengerVolumeCapacity.volumeValue,
                            downCapacityValue:
                                d.downPassengerVolumeCapacity.capacityValue,
                        });
                    }
                );
            }

            if (this.data239.eachPeriodCapacityVolumeRelation1) {
                this.data239.eachPeriodCapacityVolumeRelation1.forEach((d) => {
                    data.data4.push({
                        time:
                            this._getTimeStr(d.timeInterval.startTime, 1000) +
                            "-" +
                            this._getTimeStr(d.timeInterval.endTime, 1000),
                        segment: d.sectionName.sectionName,
                        upVolumeValue: d.upEachSecCapacityVolume.y1PeakVolume,
                        upCapacityValue:
                            d.upEachSecCapacityVolume.y2PeakCapacity,
                        downVolumeValue:
                            d.downEachSecCapacityVolume.y1PeakVolume,
                        downCapacityValue:
                            d.downEachSecCapacityVolume.y2PeakCapacity,
                    });
                });
            }

            if (this.data239.stationStrandPassengerList) {
                this.data239.stationStrandPassengerList.forEach((d) => {
                    let stationName = "";
                    for (let prop in this.stations) {
                        if (this.stations[prop] == d.stationId) {
                            stationName = prop;
                        }
                    }

                    d.stationStrangePassList.forEach((item) => {
                        data.data5.push({
                            station: stationName,
                            time: item.time,
                            count: item.passengerCount,
                        });
                    });
                });
            }

            return data;
        },
        exportWordFile() {
            let _this = this;
            // 读取并获得模板文件的二进制内容
            JSZipUtils.getBinaryContent(
                "template1.docx",
                function (error, content) {
                    // input.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
                    // 抛出异常
                    if (error) {
                        console.log(error);
                        throw error;
                    }

                    // 创建一个JSZip实例，内容为模板的内容
                    let zip = new JSZip(content);
                    // 创建并加载docxtemplater实例对象
                    let doc = new window.docxtemplater().loadZip(zip);
                    // 设置模板变量的值
                    doc.setData(_this._getWordData());
                    try {
                        // 用模板变量的值替换所有模板变量
                        doc.render();
                    } catch (error) {
                        // 抛出异常
                        let e = {
                            message: error.message,
                            name: error.name,
                            stack: error.stack,
                            properties: error.properties,
                        };
                        console.log(JSON.stringify({ error: e }));
                        throw error;
                    }

                    // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
                    let out = doc.getZip().generate({
                        type: "blob",
                        mimeType:
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    });
                    // 将目标文件对象保存为目标类型的文件，并命名
                    FileSaver.saveAs(
                        out,
                        `${
                            _this.currentLine
                        }评估报告-${new Date().getTime()}.docx`
                    );
                }
            );
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
.grid-main2 {
    height: calc((100vh - 50px) / 3 * 2);
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    background-image: linear-gradient(#ffffff, #dedede);
}
.grid-main4 {
    height: calc((100vh - 50px) / 3 * 4 - 10px);
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
    overflow-y: auto;
}
.el-dialog ul li {
    line-height: 50px;
    font-size: 16px;
    font-weight: bold;
}

.loadrate-div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 1;
}

.diy-div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 1;
}

.diy-div p {
    margin: 5px;
    font-size: 18px;
    font-weight: bold;
    color: #444;
    text-align: center;
}

.loadrate-div p {
    margin: 5px;
    font-size: 18px;
    font-weight: bold;
    color: #444;
    text-align: center;
}

.loadrate-p {
    color: #333 !important;
    font-size: 24px !important;
}

.loadrate-div div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    margin: 5px;
}

.item {
    display: flex;
    flex-direction: row;
    height: 50px;
    justify-content: space-around;
    align-items: center;
    border: solid #e5e5e5;
    border-width: 0 0 1px 0;
    padding: 3px;
    color: #555;
    background-color: #fff;
}

.item-title {
    color: #999;
    margin: 5px 26px 5px 5px;
    display: flex;
    flex-direction: row;
    height: 50px;
    justify-content: space-around;
    align-items: center;
    border: solid #e5e5e5;
    border-width: 0 0 1px 0;
    padding: 3px;
    background-color: #fff;
}

.item-title span {
    flex: 1;
    text-align: left;
}

.item:hover {
    background-color: #eee;
}

.item span {
    flex: 1;
    text-align: left;
}
</style>

<style >
.simple {
    margin: 10px;
    padding: 10px;
    background-color: #eee;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    font-size: 15px;
    cursor: pointer;
    color: #222;
}

span {
    cursor: pointer;
}
.export {
    position: fixed;
    right: 60px;
    top: 10px;
    z-index: 998;
}
</style>

