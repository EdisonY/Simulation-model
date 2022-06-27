<template>
    <div class="dashboard-container"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 1)">
        <!-- <div class="left-panel"
            :class="{'isHidden' : !openLeft}"> -->
            <!-- <svg viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                @click="openLeft = !openLeft;"
                style="text-align:right"
                :class="{'isAction' : openLeft}">
                <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z" />
            </svg> -->
            <!-- <h2><span>运行图设置</span></h2> -->
            <!-- <el-tabs type="border-card" style="margin:10px 0 0 10px">
                <el-tab-pane label="选择运行图">
                    <el-button type="primary">上传</el-button>
                    <el-button type="success">启动</el-button>
                    <el-table
                    :data="tableData"
                    style="width: 100%">
                        <el-table-column
                            prop="date"
                            label="名称">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="备注">
                        </el-table-column>
                        <el-table-column prop="data"
                            label="操作">
                            <template slot-scope="scope">
                                <el-checkbox></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="输入开行方案">
                    <el-select placeholder="请选择" v-model="value">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>                    
                    <el-table
                    :data="tableData"
                    style="width: 100%">
                        <el-table-column
                            prop="date"
                            label="名称">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="备注">
                        </el-table-column>
                        <el-table-column prop="data"
                            label="操作">
                            <template slot-scope="scope">
                                <el-checkbox></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                    <p style="text-align:right;padding:20px 0">
                        <el-button type="primary">添加条数</el-button>
                        <el-button type="success">铺画</el-button>
                    </p>
                    
                </el-tab-pane>
                <el-tab-pane label="修改运行图">
                    <ul>
                        <li>表号：001</li>
                        <li>车次号：1231</li>
                        <li>列车运行方向：上行</li>
                    </ul>
                    <ul>
                        <li>编组数量：<span>4</span></li>
                        <li>车型：<span>A</span></li>
                        <li>定员：<span>1000</span></li>
                        <li>是否载客车次：<span>是</span></li>
                    </ul>
                    <el-table
                    :data="tableData1"
                    style="width: 100%">
                    <el-table-column
                        prop="date"
                        label="车站名称">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="进站时间">
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="出站时间">
                    </el-table-column>
                    <el-table-column
                        prop="shi"
                        label="是否折返">
                    </el-table-column>
                    </el-table>
                    <p style="text-align:right;padding:20px 0">
                        <el-button type="danger">删除车次</el-button>
                        <el-button type="primary">新建车次</el-button>
                    </p>
                </el-tab-pane>
            </el-tabs> -->
            <!-- <el-card class="box-card" style="margin:10px 0 0 10px">
                <div slot="header" class="clearfix">
                    <span>消息</span>
                </div>
                <div style="text-align:left">
                    <ul>
                        <li>打开运行图成功。。。。</li>
                        <li>运行图名称：北京轨道交通验方线</li>
                        <li>00:00:00 xx 发生紧急制动</li>
                        <li>00:00:00 - 00:02:00 扣故障区外即将进入该控区相邻车站</li>
                        <li>00:00:00 - 00:02:00 扣故障区外即将进入该控区相邻车站</li>
                        <li>00:00:00 - 00:02:00 扣故障区外即将进入该控区相邻车站</li>
                    </ul>
                </div>
            </el-card> -->
            <!-- <div class="waring-panel"
                v-if="warningList && warningList.length>0">
                <p v-for="(msg,index) in warningList" :key="index">{{msg}}</p>
            </div> -->
        <!-- </div> -->
        <div class="all"
            :class="{'isMove':openLeft}">
            <div class="all1">
                <div class="calcH move1"
                    ref="aaa"
                    :class="{ 'left' : loading}"
                    style="z-index:10"></div>
                <div class="calcH move"
                    ref="1"
                    :class="{ 'left' : loading}"
                    style="z-index:9"></div>
                <div class="calcH move"
                    ref="2"
                    :class="{ 'left' : loading}"
                    style="z-index:8"></div>
                <div class="calcH move"
                    ref="3"
                    :class="{ 'left' : loading}"
                    style="z-index:7"></div>
                <div class="calcH move"
                    ref="4"
                    :class="{ 'left' : loading}"
                    style="z-index:6"></div>
                <div class="calcH move"
                    ref="5"
                    :class="{ 'left' : loading}"
                    style="z-index:5"></div>
                <div class="calcH move"
                    ref="6"
                    :class="{ 'left' : loading}"
                    style="z-index:4"></div>
                <div class="calcH move"
                    ref="7"
                    :class="{ 'left' : loading}"
                    style="z-index:3"></div>
                <div class="calcH move"
                    ref="8"
                    :class="{ 'left' : loading}"
                    style="z-index:2"></div>
                <div class="calcH move"
                    ref="9"
                    :class="{ 'left' : loading}"
                    style="z-index:1"></div>
                <div class="calcH move"
                    ref="10"
                    :class="{ 'left' : loading}"></div>
            </div>
        </div>

        <div class="tooltip"
            v-if="rungrapData.multiply">
            <el-radio v-model="loadRateMode"
                :label='true'
                style="margin:0 10px 0 10px"
                @change="changeMode">满载率</el-radio>
            <el-radio v-model="loadRateMode"
                :label="false"
                style="margin:0 10px 0 10px"
                @change="changeMode">晚点</el-radio>

            <span class="leave1 legend"
                v-show="loadRateMode">&lt;40%</span>
            <span class="leave2 legend"
                v-show="loadRateMode">&lt;60%</span>
            <span class="leave3 legend"
                v-show="loadRateMode">&lt;80%</span>
            <span class="leave4 legend"
                v-show="loadRateMode">&lt;100%</span>
            <span class="leave5 legend"
                v-show="loadRateMode">&gt;=100%</span>

            <span class="leave1 legend"
                v-show="!loadRateMode">&lt;0s</span>
            <span class="leave2 legend"
                v-show="!loadRateMode">&lt;120s</span>
            <span class="leave3 legend"
                v-show="!loadRateMode">&lt;300s</span>
            <span class="leave4 legend"
                v-show="!loadRateMode">&lt;600s</span>
            <span class="leave5 legend"
                v-show="!loadRateMode">&gt;=600s</span>

            <el-button size="mini"
                type='primary'
                @click="importRungraph">导入</el-button>
            <el-button size="mini"
                type='primary'
                @click="startStop">{{isRunning?'结束':'开始'}}</el-button>
            <el-button size="mini"
                type='primary'
                @click="drawAllData">铺画</el-button>
            <el-button size="mini"
                type='danger'
                @click="clearChartData">清除</el-button>
        </div>
        <el-dialog title="区段信息"
            :visible.sync="dialogVisible"
            width="30%">
            <ul>
                <li>车次号：{{clickData.seriesId}}</li>
                <li>站台：{{clickData.name}}</li>
                <li>时间：{{clickData.time}}</li>
                <li>满载率：{{clickData.multiply}}</li>
                <li>上下行：{{clickData.runDirect}}</li>
                <li>查看该车次此刻时间段的其他数据：</li>
                <li style="text-align:center;">
                    <el-button type="success">客流情况</el-button>
                    <el-button type="warning">指标查看</el-button>
                    <el-button type="danger">运行仿真</el-button>
                </li>
            </ul>
        </el-dialog>
        <!-- 隐藏的file处理 -->
        <input style="display: none"
            type="file"
            id="rungraphSelector"
            @change="selectFileFinish" />
    </div>
</template>

<script>
/**
 * 当前说明：20210420
 * 满载率和晚点信息分开显示，用按钮切换
 */
import * as Utils from "@/utils/util";
import {
    registerCallback,
    unregisterCallback,
    sendSock,
    getPackage,
} from "@/utils/ws";
import echarts from "echarts";
let charts = null;
let echartsAll = {
    echarts1: null,
    echarts2: null,
    echarts3: null,
    echarts4: null,
    echarts5: null,
    echarts6: null,
    echarts7: null,
    echarts8: null,
    echarts9: null,
    echarts10: null,
};
var Time = [];
var Option = {
    color: ["#5793f3", "#d14a61"],
    tooltip: {
        trigger: "axis",
        // axisPointer: {
        //     type: 'cross'
        // }
    },
    grid: {
        top: 65,
        bottom: 65,
        left: 80,
        right: 0,
    },
    xAxis: [
        {
            type: "category",
            scale: true,
            boundaryGap: false,
            axisTick: {
                alignWithLabel: true,
            },
            axisLine: {
                onZero: false,
                lineStyle: {
                    color: "#f1f1f1",
                },
            },
            splitLine: {
                show: true,
            },
            axisLabel: {
                interval: 59,
                margin: 40,
                rich: {
                    bold: {
                        fontSize: 20,
                        fontWeight: 600,
                    },
                },
            },
            data: Time,
        },
        {
            type: "category",
            boundaryGap: false,
            axisTick: {
                alignWithLabel: true,
            },
            axisLine: {
                onZero: false,
                lineStyle: {
                    color: "#f1f1f1",
                },
            },
            splitLine: {
                show: true,
            },
            axisLabel: {
                interval: 59,
                margin: 40,
                rich: {
                    bold: {
                        fontSize: 20,
                        fontWeight: 600,
                    },
                },
            },
            data: Time,
        },
    ],
    yAxis: {
        type: "category",
        scale: true,
        boundaryGap: false,
        splitLine: {
            show: true,
        },
        axisTick: {
            alignWithLabel: true,
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: "#000",
            },
        },
        data: [],
    },
    animation: false,
    series: [],
};
var lastOption = null;
var chunkOption = [];
var _start = 0;
var _end = 0;
function getTime(time) {
    let value =
        (parseInt(time.substr(0, 2)) < 4
            ? parseInt(time.substr(0, 2)) + 20
            : parseInt(time.substr(0, 2)) - 4) *
            60 *
            6 +
        parseInt(time.substr(3, 5)) * 6 +
        Math.round(parseInt(time.substr(6, 8)) / 10); // 每10秒间隔
    return value;
}
function rgbaToHex(color) {
    var values = color
        .replace(/rgba?\(/, "")
        .replace(/\)/, "")
        .replace(/[\s+]/g, "")
        .split(",");
    var a = parseFloat(values[3] || 1),
        r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
        g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
        b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);

    return (
        "#" +
        ("0" + r.toString(16)).slice(-2) +
        ("0" + g.toString(16)).slice(-2) +
        ("0" + b.toString(16)).slice(-2)
    );
}
function getColorByNumber(n) {
    let halfMax = 50;
    var one = 255 / halfMax;
    var r = 0;
    var g = 0;
    var b = 0;
    if (n < halfMax) {
        r = one * n;
        g = 255;
    }
    if (n >= halfMax) {
        g = 255 - (n - halfMax) * one < 0 ? 0 : 255 - (n - halfMax) * one;
        r = 255;
    }
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);
    return rgbaToHex("rgb(" + r + "," + g + "," + b + ")");
}
function getSimpleColor(n) {
    if (n < 0.4) {
        return "#409EFF";
    } else if (n < 0.6) {
        return "#7fff00";
    } else if (n < 0.8) {
        return "#fc0";
    } else if (n < 1) {
        return "#f00";
    } else if (n >= 1) {
        return "#750614";
    } else {
        return "#409EFF";
    }
}
function getLateTimeColor(n) {
    if (n <= 0) {
        return "#409EFF";
    } else if (n < 2 * 60) {
        return "#7fff00";
    } else if (n < 5 * 60) {
        return "#fc0";
    } else if (n < 10 * 60) {
        return "#f00";
    } else if (n >= 10 * 60) {
        return "#750614";
    } else {
        return "#409EFF";
    }
}

function getSimpleColor2(n) {
    if (n < 0.5) {
        return "#7fff0000";
    } else if (n <= 7.5) {
        return "#fc0";
    } else {
        return "#f00";
    }
}
function secondToDate(result) {
    var h =
        Math.floor(result / 3600) < 10
            ? "0" + Math.floor(result / 3600)
            : Math.floor(result / 3600);
    var m =
        Math.floor((result / 60) % 60) < 10
            ? "0" + Math.floor((result / 60) % 60)
            : Math.floor((result / 60) % 60);
    var s =
        Math.floor(result % 60) < 10
            ? "0" + Math.floor(result % 60)
            : Math.floor(result % 60);
    return (result = h + ":" + m + ":" + s);
}
export default {
    name: "Rungrap",
    data() {
        return {
            time: [],
            clickData: {},
            dialogVisible: false,
            main: [],
            loading: false,
            subStation: [],
            key: true,
            currentLine: null,
            loadRateMode: true, // 显示满载率模式
            cacheData: null,
            isRunning: false, // 当前是否运行
            openLeft: true,
            warningList: [],
            tableData: [{
                date: '工作日',
                name: '王小虎',
            }, {
                date: '工作日',
                name: '张三',
            }, {
                date: '工作日,节假日',
                name: '王小虎',
            }, {
                date: '节假日',
                name: '作者',
            }],
            tableData1:[
                {
                    date: '科技园',
                    name: '13:00:00', 
                    address:'13:02:00',
                    shi:'否'
                },{
                    date: '科技园',
                    name: '13:00:00', 
                    address:'13:02:00',
                    shi:'否'
                }
            ],
            options: [{
                value: '选项5',
                label: '交路AB'
            }],
            value:'选项5'
        };
    },
    props: ["rungrapData"],
    created() {
        registerCallback("lib_common-33", this.wsCallback);
        var hours = 4;
        var min = 0;
        var second = -10;
        this.subStation = this.rungrapData.station;

        // 计算车站Y轴实际刻度高度
        for (let index = 1; index < this.subStation.length; index++) {
            this.subStation[index][1] = this.subStation[index][1] * 10;
            this.subStation[index][1] += this.subStation[index - 1][1];
        }
        for (let index = 0; index < this.subStation.length; index++) {
            this.subStation[index][1] = this.subStation[index][1] + 3;
        }

        // 添加上下行折返轨刻度
        var stationLowTick = [];
        var stationUpTick = [];
        for (let index = 0; index < this.subStation.length; index++) {
            stationLowTick.push([
                this.subStation[index][0] - 0.3,
                this.subStation[index][1] - 3,
                "",
            ]);
            stationUpTick.push([
                this.subStation[index][0] + 0.3,
                this.subStation[index][1] + 3,
                "",
            ]);
        }
        this.subStation.push(...stationLowTick);
        this.subStation.push(...stationUpTick);
        // [注意] : 此时Y轴的刻度实际上是车站数量的3倍

        // 2.4h生成横坐标轴
        for (let index = 0; index < 8640; index++) {
            second += 10;
            if (second > 50) {
                second = 0;
                min++;
            }
            if (min > 59) {
                min = 0;
                hours++;
            }
            if (hours > 23) {
                hours = 0;
            }
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (min < 10) {
                min = "0" + min;
            }
            if (second == 0) {
                second = "0" + second;
            }
            this.time.push(hours + ":" + min + ":" + second);
            Time.push(hours + ":" + min + ":" + second);

            // 将字符串类型改为int类型
            hours = +hours;
            min = +min;
            second = +second;
        }
    },
    mounted() {
        this.currentLine = sessionStorage.getItem("currentLine");
        this.drawLine(); // 画坐标系
        // 遍历每个图表，禁用系统滚动事件
        $(".all1").each(function (index, element) {
            element.onwheel = function (event) {
                var table = $(element).parents(".all");
                var right = $(element).width() - table[0].offsetWidth;
                if (table.scrollLeft() < right && event.deltaY > 0) {
                    //禁止事件默认行为（此处禁止鼠标滚轮行为关联到"屏幕滚动条上下移动"行为）
                    event.preventDefault();
                    var left = table.scrollLeft() + 50;
                    table.scrollLeft(left);
                }
                if (table.scrollLeft() > 0 && event.deltaY < 0) {
                    //禁止事件默认行为（此处禁止鼠标滚轮行为关联到"屏幕滚动条上下移动"行为）
                    event.preventDefault();
                    var left = table.scrollLeft() - 50;
                    table.scrollLeft(left);
                }
            };
        });
        this.initAxies();
    },
    methods: {
        drawLine() {
            let self = this;

            // 初始化1+10个图表，并且初始化点击事件
            charts = this.$echarts.init(this.$refs.aaa);
            for (let index = 1; index < 11; index++) {
                echartsAll["echarts" + index] = self.$echarts.init(
                    self.$refs[index]
                );
                echartsAll["echarts" + index].on("click", this.handClick);
            }
            charts.on("click", this.handClick);

            Option.color = this.rungrapData.colors;
            Option.tooltip.formatter = function (params, ticket, callback) {
                let tooltipInner = [];
                for (var x in params) {
                    if (params[x].value != "-") {
                        if (typeof params[x].value == "number") {
                            tooltipInner +=
                                '<span style="border-radius:3px;background:' +
                                params[x].color +
                                '">车次号：' +
                                params[x].seriesName +
                                "-" +
                                self.getSiteName(Number(params[x].value)) +
                                "-" +
                                params[x].name +
                                "</br>" +
                                "</span>";
                        } else {
                            if (params[x].value != undefined) {
                                tooltipInner +=
                                    '<span style="border-radius:3px;background:' +
                                    params[x].color +
                                    '">车次号：' +
                                    params[x].seriesName +
                                    "-" +
                                    self.getSiteName(
                                        Number(params[x].value.substr(1))
                                    ) +
                                    "-" +
                                    params[x].name +
                                    "</br>" +
                                    "</span>";
                            }
                        }
                        self.clickData.time = params[x].axisValue;
                    }
                }
                return tooltipInner;
            };

            Option.xAxis[0].data = this.time;
            Option.xAxis[1].data = this.time;

            Option.xAxis[0].axisLabel.formatter = function (value, index) {
                if (value != undefined) {
                    var num = parseInt(value.replace(/[\:]/g, ""));
                    if (num % 10000 == 0) {
                        return "{bold|" + value.substr(0, 5) + "}";
                    } else {
                        return value.substr(0, 5);
                    }
                }
            };
            Option.xAxis[1].axisLabel.formatter = function (value, index) {
                if (value != undefined) {
                    var num = parseInt(value.replace(/[\:]/g, ""));
                    if (num % 10000 == 0) {
                        return "{bold|" + value.substr(0, 5) + "}";
                    } else {
                        return value.substr(0, 5);
                    }
                }
            };
            Option.yAxis.axisLabel.interval = function (value, index) {
                if (index == "") {
                    return false;
                } else {
                    return index;
                }
            };
            Option.yAxis.axisLabel.formatter = function (value, index) {
                if (value != undefined) {
                    return value;
                } else {
                    return "";
                }
            };

            Option.xAxis[0].axisLabel.color = this.rungrapData.colors[0];
            Option.xAxis[1].axisLabel.color = this.rungrapData.colors[1];

            // 设置Y轴
            Option.yAxis.data = []; //修复切换数据源后Y轴数据清空
            let totalYTick = this.subStation[this.subStation.length - 1][1];
            for (let i = 0; i < totalYTick; i++) {
                Option.yAxis.data[i] = "";
            }
            for (let i = 0; i < this.subStation.length; i++) {
                let stationName = this.subStation[i][2];
                Option.yAxis.data[this.subStation[i][1]] = stationName;
            }
        },
        initData(services, mode) {
            let self = this;
            for (let i = 0; i < services.length; i++) {
                for (let x = 0; x < services[i].tripList.length; x++) {
                    splitData(services[i].tripList[x], x);
                }
            }

            function splitData(data, nummm) {
                let timeArr = [];
                let serialData = [];
                let timeArrIndex = 0;
                let yAxisValue = -1;

                let dataColl = {
                    type: "line",
                    xAxisIndex: 1,
                    data: [],
                    hoverAnimation: false,
                    legendHoverLink: false,
                    animation: false,
                    clip: false,
                    markLine: {
                        data: [
                            [
                                {
                                    coord: [0, 0],
                                },
                                {
                                    coord: [0, 0],
                                },
                            ],
                        ],
                        label: {
                            show: true,
                            position: "insideStartBottom",
                            formatter: "",
                        },
                        silent: false,
                        symbol: "none",
                        animation: false,
                        lineStyle: {
                            type: "solid",
                            color: "#000",
                            opacity: 0,
                            z: 3,
                        },
                        z: 2,
                    },
                    lineStyle: {
                        opacity: 0,
                        color: "#05ff00",
                        width: 0,
                    },
                };

                dataColl.name = "" + data.tripNo;
                dataColl.markLine.label.formatter = "" + data.tripNo;
                dataColl.markLine.label.color = "#333";
                for (let index = 0; index < data.pathListStr.length; index++) {
                    if (!data.pathListStr[index].stationId) {
                        let pathArr = data.pathListStr[index].split(",");

                        data.pathListStr[index] = {};
                        data.pathListStr[index].stationId = parseInt(
                            pathArr[0]
                        );
                        data.pathListStr[index].arriveTime = secondToDate(
                            pathArr[1]
                        );
                        data.pathListStr[index].departTime = secondToDate(
                            pathArr[2]
                        );
                        data.pathListStr[index].loadRate00 = pathArr[4];
                        data.pathListStr[index].diviationTime = pathArr[5];
                        data.pathListStr[index].lateTime = pathArr[6];
                    }

                    // 如果数据中连续两个站id相同，则在转换轨上，需要改变位置
                    if (data.pathListStr.length > 1) {
                        if (index == 0) {
                            let next = data.pathListStr[1];
                            if (!next.stationId) {
                                let narr = next.split(",");
                                next = {};
                                next.stationId = parseInt(narr[0]);
                            }

                            let curStationId = data.pathListStr[0].stationId;
                            if (curStationId == parseInt(next.stationId)) {
                                if (data.runDir == 85) {
                                    curStationId =
                                        parseInt(next.stationId) - 0.3;
                                } else {
                                    curStationId =
                                        parseInt(next.stationId) + 0.3;
                                }
                                data.pathListStr[0].stationId = curStationId;
                            }
                        } else if (index == data.pathListStr.length - 1) {
                            var pre = data.pathListStr[index - 1];
                            if (
                                data.pathListStr[index].stationId ==
                                pre.stationId
                            ) {
                                if (data.runDir == 85) {
                                    data.pathListStr[index].stationId =
                                        pre.stationId + 0.3;
                                } else {
                                    data.pathListStr[index].stationId =
                                        pre.stationId - 0.3;
                                }
                            }
                        }
                    }

                    timeArr.push(getTime(data.pathListStr[index].arriveTime));
                    timeArr.push(getTime(data.pathListStr[index].departTime));
                }

                dataColl.addselfSecond = timeArr[1]; // 班次第一站的离站时间
                dataColl.addselfArrive = timeArr[timeArr.length - 2]; // 班次最后一站的到站时间
                dataColl.addselfEnd = timeArr[timeArr.length - 1]; // 班次最后一站的离站时间

                // 遍历班次最大时间的时刻
                for (let x = 0; x <= timeArr[timeArr.length - 1]; x++) {
                    if (x != timeArr[timeArrIndex]) {
                        if (yAxisValue != -1) {
                            serialData.push("a" + yAxisValue);
                        } else {
                            serialData.push("-");
                        }
                    } else {
                        // 查找实际Y轴坐标
                        let pathListIndex = Math.floor(timeArrIndex / 2);
                        yAxisValue = data.pathListStr[pathListIndex].stationId;
                        let findStation = self.subStation.find((s) => {
                            return s[0] == yAxisValue;
                        });
                        if (findStation) {
                            yAxisValue = findStation[1];
                        } else {
                            console.log("ERR", yAxisValue, self.subStation);
                        }

                        serialData.push(yAxisValue);

                        // 记录班次的起始时间
                        if (!dataColl.addself) {
                            dataColl.addself = x;
                        }

                        dataColl.markLine.data[timeArrIndex] = [
                            {
                                coord: [x, yAxisValue],
                            },
                        ];
                        if (timeArrIndex >= 1) {
                            let multiply =
                                data.pathListStr[pathListIndex].loadRate00 /
                                10000;
                            let diviationTime =
                                data.pathListStr[pathListIndex].diviationTime /
                                10000;
                            let lateTime =
                                data.pathListStr[pathListIndex].lateTime;

                            let color = "#333";
                            if (mode) {
                                if (self.loadRateMode) {
                                    color = getSimpleColor(multiply);
                                } else {
                                    // color = getSimpleColor(diviationTime);
                                    color = getLateTimeColor(lateTime);
                                }
                            } // TODO
                            let formatter =
                                timeArrIndex == 2 ? "" + data.tripNo : "";
                            dataColl.markLine.data[timeArrIndex - 1][1] = {
                                coord: [x, yAxisValue],
                            };
                            if (self.rungrapData.multiply) {
                                dataColl.markLine.data[timeArrIndex - 1][2] = {
                                    lineStyle: {
                                        color: color,
                                        opacity: 1,
                                        width: 1,
                                        multiply: multiply,
                                    },
                                    label: {
                                        formatter: formatter,
                                        name: data.tripNo,
                                        position: "insideStartBottom",
                                    },
                                };
                            } else {
                                dataColl.markLine.data[timeArrIndex - 1][2] = {
                                    lineStyle: {
                                        color:
                                            data.runDir == 170
                                                ? self.rungrapData.colors[0]
                                                : self.rungrapData.colors[1],
                                        opacity: 1,
                                        width: 1,
                                        multiply: multiply,
                                    },
                                    label: {
                                        formatter: "",
                                        name: data.tripNo,
                                    },
                                };
                                dataColl.markLine.data[
                                    timeArrIndex - 1
                                ][2].lineStyle.color = "#000";
                                if (nummm != 0) {
                                    dataColl.markLine.data[1][2].lineStyle.color =
                                        data.runDir == 85
                                            ? self.rungrapData.colors[0]
                                            : self.rungrapData.colors[1];
                                    if (nummm == 1) {
                                        dataColl.markLine.data[1][2].lineStyle.color =
                                            "#000";
                                    }
                                }
                            }
                        }
                        timeArrIndex++;

                        // 场段出车不停站时间相同
                        if (
                            timeArr[timeArrIndex] &&
                            x == timeArr[timeArrIndex]
                        ) {
                            x--;
                        }
                    }
                }

                dataColl.data = serialData;
                dataColl.runDirect = data.runDir == 170 ? 0 : 1;

                if (
                    dataColl.markLine.data[dataColl.markLine.data.length - 1]
                        .length == 1
                ) {
                    //防止最后一个画线不能赋值，直接删除
                    dataColl.markLine.data = dataColl.markLine.data.slice(
                        0,
                        dataColl.markLine.data.length - 1
                    );
                }
                self.main.push(dataColl);
                return;
            }

            this.$nextTick(() => {
                Option.series = this.main;
                lastOption = this.main;
                this.loading = false;
                this.chunkSeries();
            });
        },

        handClick(params) {
            var mainData = JSON.parse(sessionStorage.rungrap);
            var pushData = {};

            for (let index = 0; index < mainData.length; index++) {
                for (let i = 0; i < mainData[index].tripList.length; i++) {
                    if (
                        mainData[index].tripList[i].tripNo ==
                        params.data.label.name
                    ) {
                        pushData = mainData[index].tripList[i];
                    }
                }
            }

            pushData.endStationId =
                this.subStation[pushData.endStationId - 1][2];
            pushData.startStationId =
                this.subStation[pushData.startStationId - 1][2];
            pushData.runDir = pushData.runDir == 170 ? "下行" : "上行";
            pushData.list = [];

            for (let index = 0; index < pushData.pathListStr.length; index++) {
                var tmp = pushData.pathListStr[index].split(",");
                if (tmp[1] != 0) {
                    pushData.list.push({
                        stationId: this.subStation[parseInt(tmp[0]) - 1][2],
                        arriveTime: secondToDate(tmp[1]),
                        departTime: secondToDate(tmp[2]),
                    });
                }
            }

            this.$parent.getRungrapClick(pushData);

            return;
        },

        chunkSeries() {
            chunkOption = [];
            var self = this;
            var tmp = 840;
            _start = 0;
            _end = tmp;
            Option.xAxis[0].data = Time.slice(_start, _end);
            Option.xAxis[1].data = Time.slice(_start, _end);
            Option.yAxis.axisLabel.inside = false;
            Option.yAxis.axisLabel.align = "right";
            Option.yAxis.axisLabel.textStyle.color = "#000";
            Option.yAxis.axisLabel.margin = 8;
            for (let index = 0; index < lastOption.length; index++) {
                if (
                    lastOption[index].addself >= _start &&
                    lastOption[index].addself <= _end
                ) {
                    chunkOption.push(lastOption[index]);
                }
            }
            Option.series = chunkOption;
            charts.setOption(Option, true);

            for (let index = 1; index < 11; index++) {
                tmp = 600;
                chunkOption = [];
                _start = index * 720 - 60;
                _end = (index + 1) * 720 + 60;
                for (let index = 0; index < lastOption.length; index++) {
                    if (
                        lastOption[index].addselfSecond >= _start &&
                        lastOption[index].addselfSecond <= _end
                    ) {
                        chunkOption.push(lastOption[index]);
                    } else {
                        if (
                            lastOption[index].addselfArrive >= _start &&
                            lastOption[index].addself < _start
                        ) {
                            chunkOption.push(lastOption[index]);
                        }
                    }
                }
                Option.xAxis[0].data = Time.slice(_start, _end);
                Option.xAxis[1].data = Time.slice(_start, _end);
                Option.yAxis.axisLabel.inside = true;
                Option.yAxis.axisLabel.align = "center";
                Option.yAxis.axisLabel.textStyle.color = "#ccc";
                Option.yAxis.axisLabel.margin = 0;

                chunkOption = JSON.parse(JSON.stringify(chunkOption));

                for (let i = 0; i < chunkOption.length; i++) {
                    chunkOption[i].addself -= _start;
                    chunkOption[i].addselfArrive -= _start;
                    chunkOption[i].addselfEnd -= _start;
                    chunkOption[i].addselfSecond -= _start;
                    for (const key in chunkOption[i].data) {
                        if (chunkOption[i].data[key] != "-") {
                            chunkOption[i].data[key - _start] =
                                chunkOption[i].data[key];
                            delete chunkOption[i].data[key];
                        }
                    }
                    chunkOption[i].data = chunkOption[i].data.slice(
                        0,
                        chunkOption[i].addselfEnd
                    );
                    chunkOption[i].markLine.data.forEach((element) => {
                        element.forEach((ele) => {
                            if (ele.coord) {
                                ele.coord[0] -= _start;
                            }
                        });
                    });
                }
                self.timeSet(index, chunkOption, Time.slice(_start, _end));
            }
        },
        timeSet(index, data, xData) {
            setTimeout(() => {
                Option.series = data;
                Option.xAxis[0].data = xData;
                Option.xAxis[1].data = xData;
                echartsAll["echarts" + index].setOption(Option, true);
            }, 1000);
        },
        getSiteName(value, font) {
            var texts = [];
            var text = "";
            for (let index = 0; index < this.subStation.length; index++) {
                if (value == this.subStation[index][1]) {
                    texts.push(this.subStation[index][2]);
                    text = this.subStation[index][2];
                }
            }
            if (font) {
                return text;
            } else {
                return texts;
            }
        },
        initAxies() {
            this.initData([], false);
        },
        importRungraph() {
            $("#rungraphSelector").click();
        },
        startStop() {
            let param = getPackage(137, {
                lineName: this.currentLine,
                operaType: this.isRunning ? 2 : 1,
            });
            console.log("send 137 package");
            sendSock(param);
        },
        selectFileFinish(evt) {
            if (!this.currentLine) {
                this.$message({
                    message: "当前线路名称没找到，请重新选择线路",
                    type: "warning",
                });
                return;
            }
            // 读文件
            let mainThis = this;
            const files = evt.target.files;
            if (files && files.length > 0) {
                const file = files[0];
                this.fileData = file.name;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        let sendData = e.target.result;
                        console.log(sendData);
                        let param = getPackage(133, {
                            lineName: this.currentLine,
                            data: sendData,
                        });
                        console.log("send 133 package");
                        sendSock(param);
                    } catch (err) {
                        mainThis.$message({
                            message: "读取文件失败",
                            type: "error",
                        });
                        console.log(err);
                    }
                    evt.target.value = null;
                };
                reader.readAsText(file);
            } else {
                this.$message({
                    message: "读取文件过程中发生一点小问题",
                    type: "warning",
                });
            }
        },
        drawAllData() {
            let param = getPackage(103, 2);
            console.log("send 103 data");
            sendSock(param);
        },
        clearChartData() {
            this.main = [];
            this.initData([], false);
        },
        changeMode() {
            if (this.cacheData) {
                this.clearChartData();
                this.initData(this.cacheData.planData, false);
                this.initData(this.cacheData.realData, true);
            }
        },
        wsCallback(res) {
            if (res.msgType == 203) {
                console.log("receive 203 data");
                console.log(res);
                if (res.data && res.data.length > 0) {
                    this.clearChartData();
                    let planData = res.data[0].serveList;
                    let realData = res.data[1].serveList;
                    this.initData(planData, false);
                    this.initData(realData, true);
                    this.cacheData = {
                        planData,
                        realData,
                    };
                }
            } else if (res.msgType == 233) {
                console.log("receive 233 package");
                this.$message({
                    message: "服务已成功接收运行图",
                    type: "success",
                });
            } else if (res.msgType == 237) {
                console.log("receive 237 package");
                let infoType = res.status == 1 ? "success" : "warning";
                let msg = res.msg;
                if (res.data.operaType == 1 && res.status == 1) {
                    this.isRunning = true;
                } else if (res.data.operaType == 2 && res.status == 0) {
                    this.isRunning = false;
                } else if (res.data.operaType == 0) {
                    this.isRunning = false;
                }
                this.$message({
                    message: msg,
                    type: infoType,
                });
            }
        },
    },
    beforeDestroy() {
        unregisterCallback("lib_common-33");
        charts.clear();
        charts.dispose();
        charts = null;
        for (let index = 1; index < 11; index++) {
            echartsAll["echarts" + index].clear();
            echartsAll["echarts" + index].dispose();
            echartsAll["echarts" + index] = null;
        }
        echartsAll = {
            echarts1: null,
            echarts2: null,
            echarts3: null,
            echarts4: null,
            echarts5: null,
            echarts6: null,
            echarts7: null,
            echarts8: null,
            echarts9: null,
            echarts10: null,
        };
        Option.tooltip.formatter = {};
        Option.xAxis[0].axisLabel.formatter = {};
        Option.xAxis[1].axisLabel.formatter = {};
        Option.yAxis.axisLabel.interval = {};
        Option.yAxis.axisLabel.formatter = {};
        lastOption = null;
        chunkOption = [];
        _start = 0;
        _end = 0;
    },
};
</script>

<style>
.dashboard-container {
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 99;
}
.calcH {
    height: 100%;
    width: 1920px;
    position: relative;
    min-width: 800px;
    float: left;
}
.move {
    margin-left: -341px;
}
.move1 {
    margin-right: -132px;
}
.left {
    left: 100vw;
}
.tooltip {
    position: fixed;
    top: 70px;
    right: 0;
    height: 50px;
    line-height: 50px;
    font-size: 12px;
    z-index: 999;
}
/* .tooltip span {
    padding: 0 20px;
    position: relative;
    display: inline-block;
}
.tooltip span::after {
    content: "";
    width: 15px;
    height: 2px;
    display: block;
    position: absolute;
    left: 0;
    top: 50%;
} */

.legend {
    padding: 0 20px;
    position: relative;
    display: inline-block;
}
.legend::after {
    content: "";
    width: 15px;
    height: 2px;
    display: block;
    position: absolute;
    left: 0;
    top: 50%;
}

.tooltip .leave1::after {
    background: #409eff;
    margin-top: -2px;
    height: 6px;
}
.tooltip .leave2::after {
    background: #7fff00;
    margin-top: -2px;
    height: 6px;
}
.tooltip .leave3::after {
    /* background: #ffc100; */
    background: orange;
    margin-top: -3px;
    height: 6px;
}
.tooltip .leave4::after {
    /* background: #ff4200; */
    background: red;
    margin-top: -4px;
    height: 6px;
}
.tooltip .leave5::after {
    /* background: #ff4200; */
    background: #750614;
    margin-top: -4px;
    height: 6px;
}

.tooltip .rate1::after {
    background: #7fff0066;
    margin-top: -2px;
    height: 4px;
    box-shadow: 0px 0px 5px #7fff00;
}
.tooltip .rate2::after {
    /* background: #ffc100; */
    background: #fc08;
    margin-top: -3px;
    height: 4px;
    box-shadow: 0px 0px 5px orange;
}
.tooltip .rate3::after {
    /* background: #ff4200; */
    background: #f006;
    margin-top: -4px;
    height: 4px;
    box-shadow: 0px 0px 5px red;
}

.el-dialog ul li {
    line-height: 50px;
    font-size: 16px;
    font-weight: bold;
}
.rungrap {
    padding: 20px 0 0 20px;
    height: 40px;
}
.all {
    margin-left: 20px;
    /* width: 100%; */
    overflow-x: scroll;
    height: 100%;
    position: relative;
}
.all1 {
    width: 17580px;
    height: 100%;
    /* overflow: hidden; */
}

.isAction {
    transform: rotate(180deg);
}

.waring-panel {
    height: 100%;
    overflow: auto;
}

.left-panel {
    width: 400px;
    height: calc(100% - 62px);
    position: absolute;
    /* left: -50px; */
}
.waring-panel p {
    color: orange;
    font-weight: bold;
    font-size: 20px;
    margin: 0px 0 0 10px;
}

.left-panel h2 {
    text-align: center;
    font-size: 20px;
    padding-bottom: 10px;
    font-weight: bold;
}

.isHidden {
    left: -400px;
}
.isMove {
    margin-left: 420px;
}

.left-panel svg {
    position: absolute;
    right: -25px;
    top: 5px;
    cursor: pointer;
}

.left-panel .el-tab-pane ul{padding: 0 0 15px 0;line-height: 25px;}
.left-panel .el-tab-pane ul span{color: blue;margin-left: 5px;}
</style>