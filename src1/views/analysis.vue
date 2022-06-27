<template>
    <div class="analysis clearfix">
        <el-form :model="form"
            size="mini">
            <el-form-item label="开始车站"
                label-width='140px'>
                <el-select size=""
                    disabled
                    v-model="form.startStationName"
                    placeholder="请选择">
                    <el-option v-for="item in startStationOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结束车站"
                label-width='140px'>
                <el-select disabled
                    v-model="form.endStationName"
                    placeholder="请选择">
                    <el-option v-for="item in endStationOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上下行"
                label-width='140px'>
                <el-select v-model="form.dir"
                    placeholder="请选择活动区域">
                    <el-option v-for="item in selectoption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                    @click="getData()">确 定</el-button>
            </el-form-item>
            <el-form-item v-show="false"
                style="position:absolute;right:10px">
                <el-button type="primary"
                    @click="jumpPage(1)">查看制动距离分析</el-button>
            </el-form-item>
            <el-form-item v-if="savePage">
                <el-button type="danger"
                    @click="page()">保存为图片</el-button>
            </el-form-item>
        </el-form>
        <div class="main clearfix"
            v-show="showMain">
            <div class="left"
                :class="{'isHidden' : !openLeft}">
                <svg viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    @click="openLeft = !openLeft"
                    :class="{'isAction' : openLeft}">
                    <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z" />
                </svg>
                <h2><span>{{tableData[0].station}}</span>至<span>{{tableData[tableData.length - 1].station}}</span>正线<span>{{updown}}</span><br>能力分析图-移动闭塞</h2>
                <div class="img">
                    <p>1.运行交路</p>
                    <strong>
                        <span class="start">{{tableData[0].number}}{{tableData[0].station}}</span>
                        <span class="end">{{tableData[tableData.length - 1].number}}{{tableData[tableData.length - 1].station}}</span>
                    </strong>
                    <img src="../assets/basie/jiaolu.jpg"
                        alt="">
                </div>
                <div>
                    <p>2.停站时间表</p>
                    <el-table :data="tableData"
                        border
                        class="tableStop"
                        size='mini'>
                        <el-table-column prop="number"
                            label="序号"
                            width="50"
                            align='center'></el-table-column>
                        <el-table-column prop="station"
                            label="车站"
                            align='center'></el-table-column>
                        <el-table-column prop="time"
                            label="停站时间(s)"
                            align='center'></el-table-column>
                    </el-table>
                </div>
                <div>
                    <p>3.正线牵引计算结果</p>
                    <ul>
                        <li>旅行距离(m):{{gAbility.travelDis / 100}}</li>
                        <li>旅行时间(s):{{gAbility.travelTime / 1000}}</li>
                        <li>最小间隔(s):{{gAbility.minHw / 1000}}</li>
                        <li>旅行速度(KM/H):{{gAbility.travelV * 3600 / 100000}}</li>
                    </ul>
                </div>
                <div>
                    <p>4.图例说明</p>
                    <ul class="picUl">
                        <li class="li1">最大限制速度</li>
                        <li class="li2">最高允许运行速度</li>
                        <li class="li3">ATO控制速度</li>
                        <li class="li4">速度/距离运行曲线</li>
                        <li class="li5">后车车头的时间/距离运行曲线</li>
                        <li class="li6">前车尾部的时间/距离运行曲线</li>
                        <li class="li7">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                version="1.1">
                                <path d="M0 10 L20 10 L20 12 L0 12 M9 2 L9 22 L11 22 L11 2 Z"
                                    fill="#b07803" />
                            </svg>后车距安全防护点时间/距离运行曲线
                        </li>
                        <li class="li8">运行间隔曲线</li>
                    </ul>
                </div>
            </div>
            <div id="right"
                class="right"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 1)"
                :class="{'fullRight' : !openLeft,'dir' : rightClass}">
                <div class="rightMain">
                    <div class="echart"
                        id="echart"
                        :style="{'width':maxLine * (1920 - 80) + 1920 +'px'}">
                        <i class="hoveLine"
                            id="hoveLine"></i>
                        <i class="hoveLineX"
                            id="hoveLineX"></i>
                        <!-- <el-button type="info" size="small" plain @click="toggleNine()" class="nine">第9条线</el-button> -->
                        <div class="clearfix">
                            <div class="echarts move1"
                                ref="echart"
                                style="z-index:100"></div>
                            <div class="echarts move"
                                v-for="item in maxLine"
                                :id="item"
                                :key="item"
                                :ref="item"
                                :style="{'zIndex':maxLine - item}"></div>
                        </div>
                        <div class="station"
                            v-if="!loading"
                            :class="{'stationDir' : rightClass}">
                            <span v-for="(item,index) in station"
                                :key="index"
                                :style="{left : (item.x / 100)*1.02222222 + 'px' }">
                                <i>K: {{item.x / 100}}</i>
                                <strong>
                                    <sub v-if="item.runTime > 0 ">Run T. {{item.runTime / 1000}} s</sub>
                                    <b>
                                        <big></big>
                                        {{item.name}}
                                    </b>
                                    <font>Dt: {{item.stopTime / 1000}} S</font>
                                </strong>
                            </span>
                        </div>
                        <div ref="slope"
                            class="slope"
                            :style="{'width':maxLine * (1920 - 80) + 1920 +'px'}"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import html2canvas from "html2canvas";
import echarts from "echarts";
var charts = null;
var slopeCharts = null;
var lineSeting = [
    {
        color: "#e70003",
        width: 2,
    },
    {
        color: "#ac0003",
        width: 2,
    },
    {
        color: "#117aef",
        width: 1,
    },
    {
        color: "#0d00f2",
        width: 2,
    },
    {
        color: "#1eb866",
        width: 2,
    },
    {
        color: "#31a900",
        width: 2,
    },
    {
        color: "#b07803",
        width: 2,
    },
    {
        color: "#bc00d6",
        width: 2,
    },
    {
        color: "#000",
        width: 0,
    },
];
var Option = {
    grid: {
        left: 80,
        top: 10,
        right: 0,
        bottom: 60,
    },
    legend: {
        data: ["最大限制速度"],
        top: -100,
    },
    tooltip: {
        snap: true,
        trigger: "axis",
        axisPointer: {
            type: "none",
        },
        formatter: {},
    },
    xAxis: {
        scale: true,
        boundaryGap: false,
        axisTick: {
            alignWithLabel: true,
        },
        axisLine: {
            onZero: false,
            lineStyle: {
                color: "#000",
            },
        },
        splitLine: {
            show: true,
            interval: 99,
            lineStyle: {
                color: "#ccc",
                type: "dashed",
            },
        },
        axisLabel: {
            interval: 199,
        },
        inverse: false,
        data: [], //getStation()
    },
    yAxis: [
        {
            type: "category",
            position: "top",
            splitLine: {
                show: true,
                interval: 300,
                lineStyle: {
                    color: "#ccc",
                    type: "dashed",
                },
            },
            axisLabel: {
                interval: 300,
                formatter: function (value) {
                    var reg = /h(\S*)/;
                    var reg1 = /(\S*)h/;
                    return value != "0.0km/h0.0s"
                        ? "{a|" +
                              value.match(reg1)[0] +
                              "}\n" +
                              "{small|" +
                              value.match(reg)[1] +
                              "}"
                        : "";
                },
                rich: {
                    small: {
                        color: "#999",
                    },
                },
            },
            data: [],
        },
        {
            type: "category",
            position: "top",
            offset: -950,
            splitLine: {
                show: true,
                interval: 300,
                lineStyle: {
                    color: "#ccc",
                    type: "dashed",
                },
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                interval: 300,
                formatter: function (value) {
                    var reg = /h(\S*)/;
                    var reg1 = /(\S*)h/;
                    return value != "0.0km/h0.0s"
                        ? "{a|" +
                              value.match(reg1)[0] +
                              "}\n" +
                              "{small|" +
                              value.match(reg)[1] +
                              "}"
                        : "";
                },
                rich: {
                    small: {
                        color: "#999",
                    },
                },
            },
            data: [],
        },
    ],
    color: [
        "#eb3324",
        "#0021f5",
        "#ed4a3c",
        "#5f99f7",
        "#bc2fc7",
        "#43952b",
        "#43952b",
        "#000d93",
    ],
    animation: false,
    series: [],
};
var slopeOption = {
    grid: {
        left: 80,
        top: 0,
        right: 0,
        bottom: 0,
    },
    xAxis: {
        show: false,
        axisTick: {
            alignWithLabel: true,
        },
        data: [],
    },
    yAxis: {
        show: false,
        axisTick: {
            alignWithLabel: true,
        },
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    animation: false,
    series: [],
};
var chunkOption = [];
var originalData = [];
var echartsAll = {};
var multiple = [];
var multi = 0;
var num = 0;

function getKMTIME(bili) {
    var km = [];
    for (let index = 0; index < 3401; index++) {
        km.push(
            (index * bili).toFixed(1) + "km/h" + (index * 0.1).toFixed(1) + "s"
        );
    }
    return km;
}
import {
    registerCallback,
    unregisterCallback,
    sendSock,
    getPackage,
} from "@/utils/ws";
export default {
    name: "Dashboard",
    data() {
        return {
            number: 0,
            rightClass: false,
            showMain: false,
            left: 0,
            updown: "",
            tableHeight: 0,
            loading: false,
            tempData: null,
            station: [],
            tableData: [
                {
                    number: 1,
                    station: "北京西站",
                    time: 45,
                },
            ],
            gAbility: {},
            maxLine: 0,
            maxNumber: 0,
            YYY: 0,
            openLeft: false,
            form: {
                dir: "85",
                startStationName: "北京西站",
                endStationName: "达官营站",
            },
            startStationOption: [],
            endStationOption: [],
            selectoption: [
                {
                    label: "上行",
                    value: "85",
                },
                {
                    label: "下行",
                    value: "170",
                },
            ],
            savePage: false,
        };
    },
    created() {
        registerCallback("analysis", this.wsCallback);
        switch (sessionStorage.getItem("line")) {
            case "7":
                this.startStationOption = [
                    {
                        value: "北京西站",
                        label: "北京西站",
                    },
                    {
                        value: "湾子站",
                        label: "湾子站",
                    },
                    {
                        value: "达官营站",
                        label: "达官营站",
                    },
                    {
                        value: "广安门内站",
                        label: "广安门内站",
                    },
                    {
                        value: "菜市口站",
                        label: "菜市口站",
                    },
                    {
                        value: "虎坊桥站",
                        label: "虎坊桥站",
                    },
                    {
                        value: "珠市口站",
                        label: "珠市口站",
                    },
                    {
                        value: "桥湾站",
                        label: "桥湾站",
                    },
                    {
                        value: "磁器口站",
                        label: "磁器口站",
                    },
                    {
                        value: "广渠门内站",
                        label: "广渠门内站",
                    },
                    {
                        value: "广渠门外站",
                        label: "广渠门外站",
                    },
                    {
                        value: "双井站",
                        label: "双井站",
                    },
                    {
                        value: "九龙山站",
                        label: "九龙山站",
                    },
                    {
                        value: "大郊亭站",
                        label: "大郊亭站",
                    },
                    {
                        value: "百子湾站",
                        label: "百子湾站",
                    },
                    {
                        value: "化工站",
                        label: "化工站",
                    },
                    {
                        value: "南楼梓庄站",
                        label: "南楼梓庄站",
                    },
                    {
                        value: "欢乐谷景区",
                        label: "欢乐谷景区",
                    },
                    {
                        value: "垡头站",
                        label: "垡头站",
                    },
                    {
                        value: "双合站",
                        label: "双合站",
                    },
                    // ,{
                    //     value: '焦化厂站',
                    //     label: '焦化厂站'
                    // }
                    {
                        value: "黄厂村站",
                        label: "黄厂村站",
                    },
                    {
                        value: "豆各庄站",
                        label: "豆各庄站",
                    },
                    {
                        value: "黑庄户站",
                        label: "黑庄户站",
                    },
                    {
                        value: "万盛南街西口站",
                        label: "万盛南街西口站",
                    },
                    {
                        value: "云景东路站",
                        label: "云景东路站",
                    },
                    {
                        value: "小马庄站",
                        label: "小马庄站",
                    },
                    {
                        value: "高楼金站",
                        label: "高楼金站",
                    },
                    {
                        value: "施园站",
                        label: "施园站",
                    },
                    {
                        value: "环球影城站",
                        label: "环球影城站",
                    },
                ];
                this.endStationOption = this.startStationOption;
                break;
            case "16":
                this.startStationOption = [
                    {
                        value: "西苑",
                        label: "西苑",
                    },
                    {
                        value: "农大南路",
                        label: "农大南路",
                    },
                    {
                        value: "马连洼",
                        label: "马连洼",
                    },
                    {
                        value: "西北旺",
                        label: "西北旺",
                    },
                    {
                        value: "永丰南",
                        label: "永丰南",
                    },
                    {
                        value: "永丰",
                        label: "永丰",
                    },
                    {
                        value: "屯佃",
                        label: "屯佃",
                    },
                    {
                        value: "稻香湖路",
                        label: "稻香湖路",
                    },
                    {
                        value: "温阳路",
                        label: "温阳路",
                    },
                    ,
                    {
                        value: "北安河",
                        label: "北安河",
                    },
                ];
                this.endStationOption = this.startStationOption;
                break;
            case "19":
                console.log(19);
                break;
        }
        this.form.dir = sessionStorage.getItem("dir");
        this.form.startStationName = sessionStorage.getItem("startStationName");
        this.form.endStationName = sessionStorage.getItem("endStationName");
    },
    updated() {},
    mounted() {
        this.getData();
        $(".analysis .right .echart").each(function (index, element) {
            element.onwheel = function (event) {
                var table = $(element).parents(".rightMain");
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
    },
    methods: {
        getData() {
            var self = this;
            if (
                this.form.startStationName != "" &&
                this.form.endStationName != ""
            ) {
                this.dialogVisible = !this.dialogVisible;

                let data = getPackage(108, {
                    dir: 0,
                });

                self.showMain = true;
                self.loading = true;

                sendSock(data);
            }
        },
        init() {
            var self = this;
            var tooltipInner = [];
            var value = 0;
            var unit = null;
            // charts = this.$echarts.init(this.$refs.aaa,null,{renderer: 'svg'}) 中文乱码
            charts = this.$echarts.init(this.$refs.echart);
            for (let index = 1; index <= this.maxLine; index++) {
                // echartsAll['echarts' + index] = self.$echarts.init(self.$refs[index])
                echartsAll["echarts" + index] = echarts.init(
                    document.getElementById(index)
                );
            }
            Option.tooltip.formatter = function (params, ticket, callback) {
                tooltipInner = [];
                var sudu = [""];
                var zui = [];
                var houche = [
                    '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;">时间: ' +
                        "<b>" +
                        params[0].axisValue +
                        "</b></br></span>",
                ];
                var qianche = [
                    '<h2 style="display:block;margin-bottom:5px;"></br></h2>',
                ];
                var jiange = [""];
                var licheng = [
                    '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;">里程: ' +
                        "<b>" +
                        params[0].axisValue +
                        "</b></br></span>",
                ];
                var kg = false;
                for (var x in params) {
                    var color = "";
                    var type = 0;
                    switch (params[x].seriesName) {
                        case "最大限制速度":
                            color = lineSeting[0].color;
                            type = 1;
                            zui +=
                                '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                color +
                                '">' +
                                params[x].seriesName +
                                "(KM/H): " +
                                "<b>" +
                                (params[x].value * (self.YYY / 3400)).toFixed(
                                    2
                                ) +
                                "</b></br></span>";
                            break;
                        case "最高允许运行速度":
                            color = lineSeting[1].color;
                            type = 1;
                            zui +=
                                '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                color +
                                '">' +
                                params[x].seriesName +
                                "(KM/H): " +
                                "<b>" +
                                (params[x].value * (self.YYY / 3400)).toFixed(
                                    2
                                ) +
                                "</b></br></span>";
                            break;
                        case "ATO控制速度":
                            color = lineSeting[2].color;
                            type = 1;
                            sudu +=
                                '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                color +
                                '">' +
                                params[x].seriesName +
                                "(KM/H): " +
                                "<b>" +
                                (params[x].value * (self.YYY / 3400)).toFixed(
                                    2
                                ) +
                                "</b></br></span>";
                            break;
                        case "速度/距离运行曲线":
                            color = lineSeting[3].color;
                            type = 1;
                            sudu +=
                                '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                color +
                                '">列车速度(KM/H): ' +
                                "<b>" +
                                (params[x].value * (self.YYY / 3400)).toFixed(
                                    2
                                ) +
                                "</b></br></span>";
                            break;
                        case "后车车头的时间/距离运行曲线":
                            color = lineSeting[4].color;
                            type = 0;
                            // for(var xx in params){
                            //     if(params[xx].seriesName == '临时线用于前端显示数据用'){
                            //         // houche += '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' + color + '">后车车头运行距离(M): ' + '<b>' + (params[xx].value / 10).toFixed(2) +'</b></br></span>'
                            //         houche += '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' + color + '">后车车头运行距离(M): ' + '<b>' + params[0].axisValue +'</b></br></span>'
                            //     }
                            // }

                            // (550 - 70) / 3400 *params[x].data

                            // console.log((550 - 70) / 3400 *params[x].data);
                            var x = ((700 - 70) / 3400) * params[x].data;
                            $(".hoveLineX").css({ top: 110 + 640 - x });

                            break;
                        case "前车尾部的时间/距离运行曲线":
                            color = lineSeting[5].color;
                            type = 0;
                            qianche +=
                                '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                color +
                                '">前车车尾运行时间(M): ' +
                                "<b>" +
                                (params[x].value != undefined
                                    ? (params[x].value / 10).toFixed(2)
                                    : 0) +
                                "</b></br></span>";
                            break;
                        case "后车距安全防护点时间/距离运行曲线":
                            color = lineSeting[6].color;
                            type = 0;
                            kg = true;
                            for (
                                let index = 0;
                                index < self.tempData.gCurve7.data.length;
                                index++
                            ) {
                                if (
                                    params[0].dataIndex * 100 >
                                        self.tempData.gCurve7.data[index].x &&
                                    params[0].dataIndex * 100 <
                                        self.tempData.gCurve7.data[index + 1].x
                                ) {
                                    houche +=
                                        '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                        color +
                                        '">后车距安全防护点的距离(M): ' +
                                        "<b>" +
                                        (
                                            ((self.tempData.gCurve7.data[
                                                index + 1
                                            ].y -
                                                self.tempData.gCurve7.data[
                                                    index
                                                ].y) /
                                                2 +
                                                self.tempData.gCurve7.data[
                                                    index
                                                ].y) /
                                            1000
                                        ).toFixed(2) +
                                        "</b></br></span>";
                                }
                            }
                            break;
                        case "运行间隔曲线":
                            color = lineSeting[7].color;
                            type = 0;
                            jiange +=
                                '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                color +
                                '">' +
                                params[x].seriesName +
                                "(S): " +
                                "<b>" +
                                (params[x].value != undefined
                                    ? (params[x].value / 10).toFixed(2)
                                    : 0) +
                                "</b></br></span>";
                            break;
                    }
                    // if(type == 0){
                    //     if(params[x].seriesName == '后车距安全防护点时间/距离运行曲线'){
                    //         kg = true
                    //         houche += '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' + color + '">' + params[x].seriesName + ': ' + '<b>' + (params[x].value[1] / 10).toFixed(2) +' S </b></br></span>'
                    //     }else if(params[x].seriesName == '后车车头的时间/距离运行曲线'){
                    //         for(var xx in params){
                    //             if(params[xx].seriesName == '临时线用于前端显示数据用'){
                    //                 juli += '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' + color + '">' + params[x].seriesName + ': ' + '<b>' + (params[xx].value / 10).toFixed(2) +' S </b></br></span>'
                    //             }
                    //         }
                    //     }else if(params[x].seriesName == '临时线用于前端显示数据用'){
                    //     }else{
                    //         juli += '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' + color + '">' + params[x].seriesName + ': ' + '<b>' + (params[x].value != undefined ? (params[x].value / 10).toFixed(2) : 0) +' S </b></br></span>'
                    //     }
                    // }else{
                    //     sudu += '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' + color + '">' + params[x].seriesName + ': ' + '<b>' + (params[x].value * (self.YYY / 3400) ).toFixed(2) +' km/h </b></br></span>'
                    // }
                }
                if (!kg) {
                    for (
                        let index = 0;
                        index < self.tempData.gCurve7.data.length;
                        index++
                    ) {
                        if (
                            params[0].dataIndex * 100 >
                                self.tempData.gCurve7.data[index].x &&
                            params[0].dataIndex * 100 <
                                self.tempData.gCurve7.data[index + 1].x
                        ) {
                            houche +=
                                '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                lineSeting[6].color +
                                '">后车距安全防护点的距离(M): ' +
                                "<b>" +
                                (
                                    ((self.tempData.gCurve7.data[index + 1].y -
                                        self.tempData.gCurve7.data[index].y) /
                                        2 +
                                        self.tempData.gCurve7.data[index].y) /
                                    1000
                                ).toFixed(2) +
                                "</b></br></span>";
                        }
                    }
                }
                tooltipInner = licheng + zui + sudu + jiange;
                return tooltipInner;
            };
            charts.setOption(Option, true);
            charts.on("mousedown", function (params) {
                self.highlight(params);
            });
            var div1 = document.getElementById("echart");
            div1.onmousemove = function (event) {
                var event = event || window.event; //标准化事件对象
                if (event.pageX || event.pageY) {
                    document.getElementById("hoveLine").style.left =
                        event.pageX + "px";
                }
            };
        },
        hoveLine() {
            document.getElementById("hoveLine").style.display = "block";
        },
        initSlope() {
            // var self = this
            // for (let index = 1; index <= this.maxDown; index++) {
            //     echartsBottom['echartsBottom' + index] = self.$echarts.init(document.getElementById('slope' + index),null,{renderer: 'svg'});
            //     echartsBottom['echartsBottom' + index].setOption(slopeOption,true)
            // }
            slopeCharts = this.$echarts.init(this.$refs.slope, null, {
                renderer: "svg",
            });
            slopeCharts.setOption(slopeOption, true);
        },
        chunkData(item, num) {
            var self = this;
            chunkOption = [];
            item.silent = false;
            originalData.push(item);
            console.log(item);
            if (num == 8) {
                console.log(originalData);
                for (let index = 0; index < originalData.length; index++) {
                    if (
                        originalData[index].name ==
                        "后车距安全防护点时间/距离运行曲线"
                    ) {
                        for (
                            let s = 0;
                            s < originalData[index].data.length;
                            s++
                        ) {
                            if (originalData[index].data[s][1] % 50 == 0) {
                                originalData[index].markPoint.data.push({
                                    coord: [
                                        originalData[index].data[s][0],
                                        originalData[index].data[s][1],
                                    ],
                                    symbol: "path://M0 10 L20 10 L20 14 L0 14 M8 2 L8 22 L12 22 L12 2 Z",
                                    symbolKeepAspect: true,
                                    symbolSize: [10, 10],
                                    symbolOffset: [0, 0],
                                    itemStyle: {
                                        color: "#b07803",
                                    },
                                });
                            }
                        }
                    }
                }
                self.$nextTick(() => {
                    chunkOption = JSON.parse(JSON.stringify(originalData));
                    for (let index = 0; index < chunkOption.length; index++) {
                        if (
                            chunkOption[index].name ==
                            "后车距安全防护点时间/距离运行曲线"
                        ) {
                            for (
                                let i = 0;
                                i < chunkOption[index].data.length;
                                i++
                            ) {
                                if (chunkOption[index].data[i][0] > 1800) {
                                    chunkOption[index].data = chunkOption[
                                        index
                                    ].data.slice(0, i + 100);
                                    for (
                                        let x = 0;
                                        x < chunkOption[index].data.length;
                                        x++
                                    ) {
                                        if (
                                            chunkOption[index].data[x][1] >=
                                            3400
                                        ) {
                                            if (
                                                chunkOption[index].data[x][1] %
                                                    3400 ==
                                                0
                                            ) {
                                                chunkOption[index].data[x][1] =
                                                    NaN;
                                            } else {
                                                chunkOption[index].data[x][1] =
                                                    chunkOption[index].data[
                                                        x
                                                    ][1] % 3400;
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        } else {
                            chunkOption[index].data = chunkOption[
                                index
                            ].data.slice(0, 1801);
                            for (
                                let x = 0;
                                x < chunkOption[index].data.length;
                                x++
                            ) {
                                if (chunkOption[index].data[x] >= 3400) {
                                    if (
                                        chunkOption[index].data[x] % 3400 ==
                                        0
                                    ) {
                                        chunkOption[index].data[x] = NaN;
                                    } else {
                                        chunkOption[index].data[x] =
                                            chunkOption[index].data[x] % 3400;
                                    }
                                }
                            }
                        }
                    }
                    Option.series = chunkOption;
                    Option.xAxis.data = self.getStation(1).slice(0, 1801);

                    if (this.form.dir == 170 && this.maxLine > 0) {
                        echartsAll["echarts" + this.maxLine].setOption(
                            Option,
                            true
                        );
                    } else {
                        charts.setOption(Option, true);
                    }
                    console.log(Option);
                    // charts.dispatchAction({
                    //     type: 'legendSelect',
                    //     seriesIndex: 1,
                    //     name:'速度/距离运行曲线'
                    // })
                    setTimeout(() => {
                        self.otherEchart();
                    });
                });
            }
        },
        otherEchart() {
            var self = this;
            var temp = Option;
            var tempMark = [];
            var tooltipInner = [];
            var tmp = null;
            multiple = JSON.parse(JSON.stringify(originalData));
            // console.log(this.maxLine);
            for (let i = 1; i <= this.maxLine; i++) {
                tempMark = [];
                chunkOption = JSON.parse(JSON.stringify(originalData));
                for (let w = 0; w < originalData.length; w++) {
                    if (
                        originalData[w].name ==
                        "后车距安全防护点时间/距离运行曲线"
                    ) {
                        chunkOption[w].markPoint.data = [];
                    }
                }
                temp = JSON.parse(JSON.stringify(Option));
                for (let index = 0; index < chunkOption.length; index++) {
                    var max = 0;
                    if (
                        chunkOption[index].name ==
                        "后车距安全防护点时间/距离运行曲线"
                    ) {
                        var kg = false;
                        for (
                            let s = 0;
                            s < chunkOption[index].data.length;
                            s++
                        ) {
                            if (
                                chunkOption[index].data[s][0] >=
                                (i + 1) * 1800
                            ) {
                                max = s;
                                break;
                            }
                        }
                        for (
                            let s = 0;
                            s < chunkOption[index].data.length;
                            s++
                        ) {
                            if (chunkOption[index].data[s][0] >= i * 1800) {
                                chunkOption[index].data = chunkOption[
                                    index
                                ].data.slice(
                                    s - 1,
                                    max > 0 ? max + 100 : 99999
                                );
                                for (
                                    let x = 0;
                                    x < chunkOption[index].data.length;
                                    x++
                                ) {
                                    chunkOption[index].data[x][0] =
                                        chunkOption[index].data[x][0] -
                                        i * 1800;
                                    if (chunkOption[index].data[x][1] >= 3400) {
                                        if (
                                            chunkOption[index].data[x][1] %
                                                3400 ==
                                            0
                                        ) {
                                            chunkOption[index].data[x][1] = NaN;
                                        } else {
                                            chunkOption[index].data[x][1] =
                                                chunkOption[index].data[x][1] %
                                                3400;
                                        }
                                    }
                                    if (
                                        chunkOption[index].data[x][1] % 50 ==
                                        0
                                    ) {
                                        chunkOption[index].markPoint.data.push({
                                            coord: [
                                                chunkOption[index].data[x][0],
                                                chunkOption[index].data[x][1],
                                            ],
                                            symbol: "path://M0 10 L20 10 L20 14 L0 14 M8 2 L8 22 L12 22 L12 2 Z",
                                            symbolKeepAspect: true,
                                            symbolSize: [10, 10],
                                            symbolOffset: [0, 0],
                                            itemStyle: {
                                                color: "#b07803",
                                            },
                                        });
                                    }
                                }
                                kg = true;
                                break;
                            }
                        }
                        if (!kg) {
                            chunkOption[index].data = [];
                        }
                    } else {
                        chunkOption[index].data = chunkOption[index].data.slice(
                            i * 1800,
                            (i + 1) * 1800 + 1
                        );
                        for (
                            let x = 0;
                            x < chunkOption[index].data.length;
                            x++
                        ) {
                            if (chunkOption[index].data[x] >= 3400) {
                                if (chunkOption[index].data[x] % 3400 == 0) {
                                    chunkOption[index].data[x] = NaN;
                                } else {
                                    chunkOption[index].data[x] =
                                        chunkOption[index].data[x] % 3400;
                                }
                            }
                            if (
                                chunkOption[index].data[x] % 50 == 0 &&
                                chunkOption[index].name ==
                                    "后车距安全防护点时间/距离运行曲线"
                            ) {
                                chunkOption[index].markPoint.data.push({
                                    coord: [x, chunkOption[index].data[x]],
                                    symbol: "path://M0 10 L20 10 L20 14 L0 14 M8 2 L8 22 L12 22 L12 2 Z",
                                    symbolKeepAspect: true,
                                    symbolSize: [10, 10],
                                    symbolOffset: [0, 0],
                                    itemStyle: {
                                        color: "#b07803",
                                    },
                                });
                            }
                        }
                    }

                    // chunkOption[index].data = chunkOption[index].data.slice(i*1800,( i + 1 ) * 1800 + 1)
                    // for (let x = 0; x < chunkOption[index].data.length; x++) {
                    //     if(chunkOption[index].data[x] >= 3400){
                    //         if(chunkOption[index].data[x] % 3400 == 0){
                    //             chunkOption[index].data[x] = NaN
                    //         }else{
                    //             chunkOption[index].data[x] = chunkOption[index].data[x] % 3400
                    //         }
                    //     }
                    //     if(chunkOption[index].data[x] % 50 == 0 && chunkOption[index].name == '后车距安全防护点时间/距离运行曲线'){
                    //         chunkOption[index].markPoint.data.push({
                    //             coord:[x,chunkOption[index].data[x]],
                    //             symbol: "path://M0 10 L20 10 L20 14 L0 14 M8 2 L8 22 L12 22 L12 2 Z",
                    //             symbolKeepAspect: true,
                    //             symbolSize:[10, 10],
                    //             symbolOffset:[0,0],
                    //             itemStyle:{
                    //                 color:'#31751d'
                    //             }
                    //         })
                    //     }
                    // }
                }
                temp.yAxis[0].data[0] = "";
                temp.yAxis[0].axisLabel.inside = true;
                temp.yAxis[0].axisLabel.align = "left";
                temp.yAxis[0].axisLabel.margin = 10;
                temp.yAxis[0].axisLabel.formatter = function (value) {
                    var reg = /h(\S*)/;
                    var reg1 = /(\S*)h/;
                    return value != ""
                        ? "{a|" +
                              value.match(reg1)[0] +
                              "}\n" +
                              "{small|" +
                              value.match(reg)[1] +
                              "}"
                        : "";
                };
                temp.yAxis[1].data[0] = "";
                temp.yAxis[1].axisLabel.inside = true;
                temp.yAxis[1].axisLabel.align = "left";
                temp.yAxis[1].axisLabel.margin = 10;
                temp.yAxis[1].axisLabel.formatter = function (value) {
                    var reg = /h(\S*)/;
                    var reg1 = /(\S*)h/;
                    return value != ""
                        ? "{a|" +
                              value.match(reg1)[0] +
                              "}\n" +
                              "{small|" +
                              value.match(reg)[1] +
                              "}"
                        : "";
                };
                temp.tooltip.formatter = function (params, ticket, callback) {
                    tooltipInner = [];
                    var sudu = [""];
                    var zui = [];
                    var houche = [
                        '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;">时间: ' +
                            "<b>" +
                            params[0].axisValue +
                            "</b></br></span>",
                    ];
                    var qianche = [
                        '<h2 style="display:block;margin-bottom:5px;"></br></h2>',
                    ];
                    var jiange = [""];
                    var licheng = [
                        '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;">里程: ' +
                            "<b>" +
                            params[0].axisValue +
                            "</b></br></span>",
                    ];
                    var kg = false;
                    for (var x in params) {
                        var color = "";
                        var type = 0;
                        switch (params[x].seriesName) {
                            case "最大限制速度":
                                color = lineSeting[0].color;
                                type = 1;
                                zui +=
                                    '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                    color +
                                    '">' +
                                    params[x].seriesName +
                                    "(KM/H): " +
                                    "<b>" +
                                    (
                                        params[x].value *
                                        (self.YYY / 3400)
                                    ).toFixed(2) +
                                    "</b></br></span>";
                                break;
                            case "最高允许运行速度":
                                color = lineSeting[1].color;
                                type = 1;
                                zui +=
                                    '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                    color +
                                    '">' +
                                    params[x].seriesName +
                                    "(KM/H): " +
                                    "<b>" +
                                    (
                                        params[x].value *
                                        (self.YYY / 3400)
                                    ).toFixed(2) +
                                    "</b></br></span>";
                                break;
                            case "ATO控制速度":
                                color = lineSeting[2].color;
                                type = 1;
                                sudu +=
                                    '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                    color +
                                    '">' +
                                    params[x].seriesName +
                                    "(KM/H): " +
                                    "<b>" +
                                    (
                                        params[x].value *
                                        (self.YYY / 3400)
                                    ).toFixed(2) +
                                    "</b></br></span>";
                                break;
                            case "速度/距离运行曲线":
                                color = lineSeting[3].color;
                                type = 1;
                                sudu +=
                                    '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                    color +
                                    '">列车速度(KM/H): ' +
                                    "<b>" +
                                    (
                                        params[x].value *
                                        (self.YYY / 3400)
                                    ).toFixed(2) +
                                    "</b></br></span>";
                                break;
                            case "后车车头的时间/距离运行曲线":
                                color = lineSeting[4].color;
                                type = 0;
                                // for(var xx in params){
                                //     if(params[xx].seriesName == '临时线用于前端显示数据用'){
                                //         // houche += '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' + color + '">后车车头运行距离(M): ' + '<b>' + (params[xx].value / 10).toFixed(2) +'</b></br></span>'
                                //         houche += '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' + color + '">后车车头运行距离(M): ' + '<b>' + params[0].axisValue +'</b></br></span>'
                                //     }
                                // }

                                // (550 - 70) / 3400 *params[x].data

                                // console.log((550 - 70) / 3400 *params[x].data);
                                var x = ((700 - 70) / 3400) * params[x].data;
                                $(".hoveLineX").css({ top: 110 + 640 - x });

                                break;
                            case "前车尾部的时间/距离运行曲线":
                                color = lineSeting[5].color;
                                type = 0;
                                qianche +=
                                    '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                    color +
                                    '">前车车尾运行时间(M): ' +
                                    "<b>" +
                                    (params[x].value != undefined
                                        ? (params[x].value / 10).toFixed(2)
                                        : 0) +
                                    "</b></br></span>";
                                break;
                            case "后车距安全防护点时间/距离运行曲线":
                                color = lineSeting[6].color;
                                type = 0;
                                kg = true;
                                for (
                                    let index = 0;
                                    index < self.tempData.gCurve7.data.length;
                                    index++
                                ) {
                                    if (
                                        params[0].dataIndex * 100 >
                                            self.tempData.gCurve7.data[index]
                                                .x &&
                                        params[0].dataIndex * 100 <
                                            self.tempData.gCurve7.data[
                                                index + 1
                                            ].x
                                    ) {
                                        houche +=
                                            '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                            color +
                                            '">后车距安全防护点的距离(M): ' +
                                            "<b>" +
                                            (
                                                ((self.tempData.gCurve7.data[
                                                    index + 1
                                                ].y -
                                                    self.tempData.gCurve7.data[
                                                        index
                                                    ].y) /
                                                    2 +
                                                    self.tempData.gCurve7.data[
                                                        index
                                                    ].y) /
                                                1000
                                            ).toFixed(2) +
                                            "</b></br></span>";
                                    }
                                }
                                break;
                            case "运行间隔曲线":
                                color = lineSeting[7].color;
                                type = 0;
                                jiange +=
                                    '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                    color +
                                    '">' +
                                    params[x].seriesName +
                                    "(S): " +
                                    "<b>" +
                                    (params[x].value != undefined
                                        ? (params[x].value / 10).toFixed(2)
                                        : 0) +
                                    "</b></br></span>";
                                break;
                        }
                        // if(type == 0){
                        //     if(params[x].seriesName == '后车距安全防护点时间/距离运行曲线'){
                        //         kg = true
                        //         houche += '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' + color + '">' + params[x].seriesName + ': ' + '<b>' + (params[x].value[1] / 10).toFixed(2) +' S </b></br></span>'
                        //     }else if(params[x].seriesName == '后车车头的时间/距离运行曲线'){
                        //         for(var xx in params){
                        //             if(params[xx].seriesName == '临时线用于前端显示数据用'){
                        //                 juli += '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' + color + '">' + params[x].seriesName + ': ' + '<b>' + (params[xx].value / 10).toFixed(2) +' S </b></br></span>'
                        //             }
                        //         }
                        //     }else if(params[x].seriesName == '临时线用于前端显示数据用'){
                        //     }else{
                        //         juli += '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' + color + '">' + params[x].seriesName + ': ' + '<b>' + (params[x].value != undefined ? (params[x].value / 10).toFixed(2) : 0) +' S </b></br></span>'
                        //     }
                        // }else{
                        //     sudu += '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' + color + '">' + params[x].seriesName + ': ' + '<b>' + (params[x].value * (self.YYY / 3400) ).toFixed(2) +' km/h </b></br></span>'
                        // }
                    }
                    if (!kg) {
                        for (
                            let index = 0;
                            index < self.tempData.gCurve7.data.length;
                            index++
                        ) {
                            if (
                                params[0].dataIndex * 100 >
                                    self.tempData.gCurve7.data[index].x &&
                                params[0].dataIndex * 100 <
                                    self.tempData.gCurve7.data[index + 1].x
                            ) {
                                houche +=
                                    '<span style="display:block;margin-bottom:5px;padding:5px;border-radius:3px;background:' +
                                    lineSeting[6].color +
                                    '">后车距安全防护点的距离(M): ' +
                                    "<b>" +
                                    (
                                        ((self.tempData.gCurve7.data[index + 1]
                                            .y -
                                            self.tempData.gCurve7.data[index]
                                                .y) /
                                            2 +
                                            self.tempData.gCurve7.data[index]
                                                .y) /
                                        1000
                                    ).toFixed(2) +
                                    "</b></br></span>";
                            }
                        }
                    }
                    tooltipInner = licheng + zui + sudu + jiange;
                    return tooltipInner;
                };
                // temp.grid.left = 0
                temp.series = chunkOption;
                temp.xAxis.data = self
                    .getStation(1)
                    .slice(i * 1800, (i + 1) * 1800 + 1);

                if (this.form.dir == 170) {
                    if (this.maxLine - i > 0) {
                        initOtherEcharts(
                            echartsAll["echarts" + (this.maxLine - i)],
                            temp,
                            i
                        );
                    } else {
                        charts.setOption(temp, true);
                    }
                } else {
                    initOtherEcharts(echartsAll["echarts" + i], temp, i);
                }
            }
            this.loading = false;
            function initOtherEcharts(dom, data, index) {
                setTimeout(() => {
                    if (index == self.maxLine) {
                        self.savePage = true;
                    } else {
                        self.savePage = false;
                    }
                    dom.setOption(data, true);
                    // dom.on('mousedown', function (params) {
                    //     self.highlight(params)
                    // })
                }, 1500);
            }
            console.timeEnd();
        },
        getStation(tag) {
            var Station = [];
            // var Max = tag == 0 ? parseInt(this.tempData.gGrade[this.tempData.gGrade.length - 1].endX / 10000) * 100 + 200 : this.maxNumber
            var Max = this.maxNumber;
            if (tag == 0) {
                Max =
                    Math.ceil(
                        this.tempData.gGrade[this.tempData.gGrade.length - 1]
                            .endX /
                            100 /
                            1800
                    ) * 1800;
            }
            for (let index = 0; index <= Max; index++) {
                if (tag) {
                    Station.push("M" + index);
                } else {
                    Station.push(index);
                }
            }
            return Station;
        },
        highlight(params) {
            for (
                let index = 0;
                index < charts.getOption().series.length;
                index++
            ) {
                if (charts.getOption().series[index].lineStyle.width != 2) {
                    charts.setOption({
                        series: {
                            name: charts.getOption().series[index].name,
                            lineStyle: {
                                width: 2,
                                shadowBlur: 0,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                            },
                        },
                    });
                }
            }
            for (let i = 1; i <= this.maxLine; i++) {
                for (
                    let index = 0;
                    index < echartsAll["echarts" + i].getOption().series.length;
                    index++
                ) {
                    if (
                        echartsAll["echarts" + i].getOption().series[index]
                            .lineStyle.width != 2
                    ) {
                        echartsAll["echarts" + i].setOption({
                            series: {
                                name: echartsAll["echarts" + i].getOption()
                                    .series[index].name,
                                lineStyle: {
                                    width: 2,
                                    shadowBlur: 0,
                                    shadowOffsetX: 0,
                                    shadowOffsetY: 0,
                                },
                            },
                        });
                    }
                }
                echartsAll["echarts" + i].setOption({
                    series: {
                        name: params.seriesName,
                        lineStyle: {
                            width: 3,
                            shadowBlur: 6,
                            shadowOffsetX: 5,
                            shadowOffsetY: 5,
                        },
                    },
                });
            }
            charts.setOption({
                series: {
                    name: params.seriesName,
                    lineStyle: {
                        width: 3,
                        shadowBlur: 6,
                        shadowOffsetX: 5,
                        shadowOffsetY: 5,
                    },
                },
            });
        },
        toggleNine() {
            charts.dispatchAction({
                type: "legendToggleSelect",
                // 图例名称
                name: "最大限制速度",
            });
            for (let i = 1; i <= this.maxLine; i++) {
                echartsAll["echarts" + i].dispatchAction({
                    type: "legendToggleSelect",
                    // 图例名称
                    name: "最大限制速度",
                });
            }
        },
        clear() {
            charts.clear();
            for (let index = 1; index <= this.maxLine; index++) {
                echartsAll["echarts" + index].clear();
            }

            slopeCharts.clear();
            slopeCharts = null;
            Option = {
                grid: {
                    left: 80,
                    top: 30,
                    right: 0,
                },
                legend: {
                    data: ["最大限制速度"],
                    top: -100,
                },
                tooltip: {
                    snap: true,
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                    },
                    formatter: {},
                },
                xAxis: {
                    scale: true,
                    boundaryGap: false,
                    axisTick: {
                        alignWithLabel: true,
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: "#000",
                        },
                    },
                    splitLine: {
                        show: true,
                        interval: 99,
                        lineStyle: {
                            color: "yellow",
                            type: "dashed",
                        },
                    },
                    axisLabel: {
                        interval: 199,
                    },
                    inverse: false,
                    data: [], //getStation()
                },
                yAxis: [
                    {
                        type: "category",
                        position: "top",
                        splitLine: {
                            show: true,
                            interval: 300,
                            lineStyle: {
                                color: "#ccc",
                                type: "dashed",
                            },
                        },
                        axisLabel: {
                            interval: 300,
                            formatter: function (value) {
                                var reg = /h(\S*)/;
                                var reg1 = /(\S*)h/;
                                return value != "0.0km/h0.0s"
                                    ? "{a|" +
                                          value.match(reg1)[0] +
                                          "}\n" +
                                          "{small|" +
                                          value.match(reg)[1] +
                                          "}"
                                    : "";
                            },
                            rich: {
                                small: {
                                    color: "#999",
                                },
                            },
                        },
                        data: [],
                    },
                    {
                        type: "category",
                        position: "top",
                        offset: -950,
                        splitLine: {
                            show: true,
                            interval: 300,
                            lineStyle: {
                                color: "#ccc",
                                type: "dashed",
                            },
                        },
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            interval: 300,
                            formatter: function (value) {
                                var reg = /h(\S*)/;
                                var reg1 = /(\S*)h/;
                                return value != "0.0km/h0.0s"
                                    ? "{a|" +
                                          value.match(reg1)[0] +
                                          "}\n" +
                                          "{small|" +
                                          value.match(reg)[1] +
                                          "}"
                                    : "";
                            },
                            rich: {
                                small: {
                                    color: "#999",
                                },
                            },
                        },
                        data: [],
                    },
                ],
                color: [
                    "#eb3324",
                    "#0021f5",
                    "#ed4a3c",
                    "#5f99f7",
                    "#bc2fc7",
                    "#43952b",
                    "#43952b",
                    "#000d93",
                ],
                animation: false,
                series: [],
            };
            slopeOption = {
                grid: {
                    left: 80,
                    top: 0,
                    right: 0,
                },
                xAxis: {
                    show: false,
                    axisTick: {
                        alignWithLabel: true,
                    },
                    data: [],
                },
                yAxis: {
                    show: false,
                    axisTick: {
                        alignWithLabel: true,
                    },
                    data: [
                        -1, -2, -3, -4, -5, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                        11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
                    ],
                },
                animation: false,
                series: [
                    {
                        data: [10, 2, 3, 4, 5],
                        lineStyle: { opacity: 1, color: "#43952b", width: 2 },
                        type: "line",
                    },
                ],
            };
            chunkOption = [];
            originalData = [];
            this.maxLine = 0;
            this.maxNumber = 0;
            this.loading = true;
            this.tempData = null;
            this.station = [];
            this.tableData = [];
            this.gAbility = {};
        },
        page() {
            $(".rightMain").animate({ scrollLeft: 0 }, 0);
            html2canvas(document.querySelector("#right"), {
                useCORS: true, //支持图片跨域
                scale: 1, //设置放大的倍数
                width: document.getElementById("echart").scrollWidth,
                windowWidth: document.getElementById("echart").scrollWidth,
            }).then((canvas) => {
                // var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // 获取生成的图片的url
                // window.location.href= imgUri; // 下载图片

                // 绘制图片
                var img = new Image();
                img.src = canvas.toDataURL();

                var a = document.createElement("a");
                a.setAttribute("id", "download3");
                document.body.appendChild(a);
                //以下代码为下载此图片功能
                var triggerDownload = $("#download3")
                    .attr("href", canvas.toDataURL())
                    .attr("download", "牵引计算曲线.png");
                triggerDownload[0].click();
                //移除下载a标签
                document.body.removeChild(a);
            });
        },
        jumpPage(index) {
            if (index == 1) {
                this.$router.push({ path: "/traincapacity/feature" });
            }
        },
        wsCallback(res) {
            let self = this;
            if (res.data && res.msgType == 208) {
                window.sessionStorage.setItem(
                    "analysis",
                    JSON.stringify(res.data)
                );
                if (this.number != 0) {
                    this.clear();
                }
                this.rightClass = false;
                if (this.form.dir == 170) {
                    Option.xAxis.inverse = true;
                    Option.yAxis[0].position = "top";
                    Option.yAxis[1].position = "top";
                    slopeOption.xAxis.inverse = true;
                    // slopeOption.yAxis.position = 'top'
                    this.rightClass = true;
                }
                this.form.startStationName = res.data.gStations[0].name;
                this.form.endStationName =
                    res.data.gStations[res.data.gStations.length - 1].name;

                switch (res.data.allDir) {
                    case 0:
                        this.selectoption = [];
                        this.form.dir = "";
                        break;
                    case 85:
                        this.selectoption = [
                            {
                                label: "上行",
                                value: "85",
                            },
                        ];
                        this.form.dir = "85";
                        break;
                    case 170:
                        this.selectoption = [
                            {
                                label: "下行",
                                value: "170",
                            },
                        ];
                        this.form.dir = "170";
                        break;
                    case 1:
                        this.selectoption = [
                            {
                                label: "上行",
                                value: "85",
                            },
                            {
                                label: "下行",
                                value: "170",
                            },
                        ];
                        break;

                    default:
                        break;
                }
                initData();
            }

            function initData() {
                window.sessionStorage.setItem("dir", self.form.dir);
                window.sessionStorage.setItem(
                    "startStationName",
                    self.form.startStationName
                );
                window.sessionStorage.setItem(
                    "endStationName",
                    self.form.endStationName
                );
                console.time();
                self.number++;
                self.tempData = JSON.parse(sessionStorage.getItem("analysis"));
                self.left = self.tempData.startPosition * 0.49 - 80;
                self.YYY = Math.ceil((self.tempData.maxV / 100) * 3.6);
                Option.yAxis[0].data = getKMTIME(self.YYY / 3400);
                Option.yAxis[1].data = getKMTIME(self.YYY / 3400);
                self.maxLine = Math.floor(
                    self.tempData.gGrade[self.tempData.gGrade.length - 1].endX /
                        100 /
                        1800
                );
                // self.maxDown = Math.ceil(self.tempData.gGrade[self.tempData.gGrade.length - 1].endX / 100 / 10000)
                self.maxNumber =
                    Math.ceil(
                        (Math.ceil(
                            self.tempData.gGrade[
                                self.tempData.gGrade.length - 1
                            ].endX /
                                100 /
                                1000
                        ) *
                            1000) /
                            1800
                    ) *
                        1800 +
                    1;

                if (self.tempData.gDir == 85) {
                    self.updown = "上行";
                } else {
                    self.updown = "下行";
                }

                self.$nextTick(() => {
                    for (let index = 1; index <= self.maxLine; index++) {
                        echartsAll["echarts" + index] = null;
                        echartsAll["echarts" + index] = echarts.init(
                            document.getElementById(index)
                        );
                    }
                    console.log(self.maxLine);
                    self.init();
                    self.initSlope();
                });

                // for (let index = 1; index <= self.maxLine; index++) {
                //     echartsAll['echarts' + index] = self.$echarts.init(self.$refs[index])
                //     echartsAll['echarts' + index] = echarts.init(document.getElementById(index));
                // }

                self.station = self.tempData.gStations;
                self.tableHeight =
                    (self.tempData.gStations.length / 2) * 25.666;
                self.gAbility = self.tempData.gAbility;
                self.tableData = [];
                for (let i = 0; i < self.station.length; i++) {
                    self.tableData.push({
                        number: i + 1,
                        station: self.station[i].name,
                        time: self.station[i].stopTime / 1000,
                    });
                }

                console.log(self.tableData);

                for (const key in self.tempData) {
                    if (
                        self.tempData[key].constructor == Object &&
                        key != "gAbility"
                    ) {
                        mainDataAppend(self.tempData[key]);
                    }
                }
                slopeData();
            }
            function mainDataAppend(item) {
                let dataColl = {
                    name: item.name,
                    type: "line",
                    connectNulls: false,
                    data: [],
                    // hoverAnimation:false,
                    // legendHoverLink:false,
                    // animation:false,
                    // clip:true,
                    markPoint: {
                        data: [],
                        silent: true,
                        symbolKeepAspect: true,
                    },
                    lineStyle: {
                        opacity: 1,
                        width: 1,
                    },
                    progressive: 10,
                };
                let base = item.axisYType ? 27.7777 : 100;

                dataColl.lineStyle.color = lineSeting[num].color;

                switch (item.name) {
                    case "最大限制速度":
                        dataColl.lineStyle.color = lineSeting[0].color;
                        break;
                    case "最高允许运行速度":
                        dataColl.lineStyle.color = lineSeting[1].color;
                        break;
                    case "ATO控制速度":
                        dataColl.lineStyle.color = lineSeting[2].color;
                        break;
                    case "速度/距离运行曲线":
                        dataColl.lineStyle.color = lineSeting[3].color;
                        break;
                    case "后车车头的时间/距离运行曲线":
                        dataColl.lineStyle.color = lineSeting[4].color;
                        break;
                    case "前车尾部的时间/距离运行曲线":
                        dataColl.lineStyle.color = lineSeting[5].color;
                        break;
                    case "后车距安全防护点时间/距离运行曲线":
                        dataColl.lineStyle.color = lineSeting[6].color;
                        break;
                    case "运行间隔曲线":
                        dataColl.lineStyle.color = lineSeting[7].color;
                        break;
                }
                dataColl.lineStyle.width = lineSeting[num].width;

                if (item.name == "后车距安全防护点时间/距离运行曲线") {
                    for (let index = 0; index < item.data.length; index++) {
                        var X = Math.round(item.data[index].x / 100);
                        var Y = Math.round(item.data[index].y / 100);
                        dataColl.data[index] = [X, Y];
                    }
                } else {
                    for (let index = 0; index < item.data.length; index++) {
                        var X = Math.round(item.data[index].x / 100);
                        var Y = item.axisYType
                            ? item.data[index].y * 1.4
                            : Math.round(item.data[index].y / 100);
                        var i =
                            dataColl.data.length - 1 > 0
                                ? dataColl.data.length - 1
                                : 0;
                        var number = 1;
                        for (let x = dataColl.data.length; x < X; x++) {
                            let float =
                                Number(
                                    ((Y - dataColl.data[i]) / (X - i)).toFixed(
                                        2
                                    )
                                ) *
                                    number +
                                dataColl.data[i];
                            dataColl.data[x] = float;
                            number++;
                        }
                        dataColl.data[X] = Y;
                        if (item.name == "临时线用于前端显示数据用") {
                            dataColl.symbol = "none";
                            dataColl.lineStyle.opacity = 0;
                        }
                    }
                }
                num++;
                self.chunkData(dataColl, num);
            }
            function slopeData() {
                let dataColl = {
                    type: "line",
                    connectNulls: true,
                    data: [],
                    animation: true,
                    clip: false,
                    lineStyle: {
                        opacity: 1,
                        color: "#43952b",
                        width: 2,
                    },
                    markLine: {
                        animation: true,
                        animationDuration: 20,
                        silent: false,
                        symbol: "none",
                        data: [],
                        lineStyle: {
                            normal: {
                                color: "#43952b",
                                width: 2,
                                type: "solid",
                            },
                        },
                    },
                    markPoint: {
                        silent: true,
                        symbolKeepAspect: true,
                        data: [],
                    },
                };
                let markData = {
                    coord: [0, 23],
                    label: {
                        show: true,
                        formatter: "",
                        position: [-5, "250%"],
                        color: "#43952b",
                        rotate: 90,
                        // offset:[0,40],
                        textBorderColor: "transparent",
                    },
                    symbol: "path://M0 0 L0 30 L2 30 L2 0 Z",
                    symbolKeepAspect: true,
                    symbolSize: [2, 42],
                    symbolOffset: [0, "-50%"],
                    itemStyle: {
                        color: "#43952b",
                    },
                };
                let across = "path://M0 0 L200 0 L200 2 L0 2 Z";
                let vertical = "path://M0 0 L0 30 L2 30 L2 0 Z";
                if (self.tempData.gGrade[0].startX != 0) {
                    markData.coord = [0, 6];
                    // markData.label.formatter = 'K 0.00'
                    dataColl.markPoint.data.push(markData);
                    dataColl.markLine.data.push([
                        {
                            coord: [0, 20],
                        },
                        {
                            coord: [self.tempData.gGrade[0].startX / 100, 8],
                        },
                        {
                            label: {
                                show: true,
                                formatter: "0.00",
                                position: "insideMiddleBottom",
                            },
                        },
                    ]);
                }

                for (
                    let index = 0;
                    index < self.tempData.gGrade.length;
                    index++
                ) {
                    var nowCoord = self.tempData.gGrade[index].startX / 100;
                    var nowCoord1 = self.tempData.gGrade[index].endX / 100;
                    markData = JSON.parse(JSON.stringify(markData));
                    markData.coord = [nowCoord, 6];
                    // markData.label.formatter = 'K ' + (nowCoord / 2).toFixed(2)
                    markData.symbol = vertical;
                    markData.symbolSize = [2, 42];
                    markData.symbolOffset = [0, "-50%"];
                    dataColl.markPoint.data.push(markData);

                    dataColl.markLine.data.push([
                        {
                            coord: [
                                nowCoord,
                                self.tempData.gGrade[index].grade > 0 ? 6 : 9,
                            ],
                        },
                        {
                            coord: [
                                nowCoord1,
                                self.tempData.gGrade[index].grade > 0 ? 9 : 6,
                            ],
                        },
                        {
                            label: {
                                show: true,
                                formatter:
                                    "" +
                                    self.tempData.gGrade[index].grade.toFixed(
                                        2
                                    ),
                                position: "insideMiddleBottom",
                            },
                        },
                    ]);

                    markData = JSON.parse(JSON.stringify(markData));
                    markData.coord = [nowCoord1, 6];
                    // markData.label.formatter = 'K ' + (nowCoord1 / 2).toFixed(2)
                    markData.symbol = vertical;
                    markData.symbolSize = [2, 42];
                    markData.symbolOffset = [0, "-50%"];
                    dataColl.markPoint.data.push(markData);

                    if (
                        self.tempData.gGrade[index + 1] &&
                        self.tempData.gGrade[index].endX !=
                            self.tempData.gGrade[index + 1].startX
                    ) {
                        dataColl.markLine.data.push([
                            {
                                coord: [nowCoord1, 8],
                            },
                            {
                                coord: [
                                    self.tempData.gGrade[index + 1].startX /
                                        100,
                                    8,
                                ],
                            },
                            {
                                label: {
                                    show: true,
                                    formatter: "0.00",
                                    position: "insideMiddleBottom",
                                },
                            },
                        ]);
                    }
                }
                slopeOption.xAxis.data = self.getStation(0);
                slopeOption.series = dataColl;
                // slopeCharts.setOption(slopeOption,true)
                slopeBottom();
            }
            function slopeBottom() {
                let markData = {
                    coord: [0, 0],
                    label: {
                        show: true,
                        formatter: "",
                        // position:[-5.5,'-150%'],
                        position: "inside",
                        offset: [0, 55],
                        color: "#43952b",
                        rotate: 90,
                    },
                    symbol: "path://M0 0 L0 30 L2 30 L2 0 Z",
                    symbolKeepAspect: true,
                    symbolSize: [1, 1],
                    itemStyle: {
                        color: "#43952b",
                    },
                };
                if (
                    self.tempData.gGradeCurve.length > 0 &&
                    self.tempData.gGradeCurve[0].startX != 0
                ) {
                    slopeOption.series.markLine.data.push([
                        {
                            coord: [0, 2],
                        },
                        {
                            coord: [
                                self.tempData.gGradeCurve[0].startX / 100,
                                2,
                            ],
                        },
                    ]);
                    markData = JSON.parse(JSON.stringify(markData));
                    markData.coord = [0, 2];
                    // markData.label.formatter = 'K 0.000'
                    slopeOption.series.markPoint.data.push(markData);
                }
                for (let i = 0; i < self.tempData.gGradeCurve.length; i++) {
                    var coord = self.tempData.gGradeCurve[i].startX / 100;
                    var coord1 = self.tempData.gGradeCurve[i].endX / 100;
                    var wey = self.tempData.gGradeCurve[i].R > 0 ? 4 : 0;

                    slopeOption.series.markLine.data.push([
                        {
                            coord: [coord, 2],
                        },
                        {
                            coord: [coord + 5, wey],
                        },
                    ]);

                    markData = JSON.parse(JSON.stringify(markData));
                    markData.coord = [coord, 2];
                    // markData.label.formatter = 'K ' + (coord / 2).toFixed(3),
                    slopeOption.series.markPoint.data.push(markData);

                    slopeOption.series.markLine.data.push([
                        {
                            coord: [coord + 5, wey],
                        },
                        {
                            coord: [coord1 - 5, wey],
                        },
                        {
                            label: {
                                show: true,
                                formatter:
                                    "R=" +
                                    self.tempData.gGradeCurve[i].R +
                                    "\n" +
                                    "L=" +
                                    self.tempData.gGradeCurve[i].L,
                                color: "#63a0c4",
                                position:
                                    self.tempData.gGradeCurve[i].R > 0
                                        ? "insideMiddleBottom"
                                        : "insideMiddleTop",
                            },
                        },
                    ]);
                    slopeOption.series.markLine.data.push([
                        {
                            coord: [coord1 - 5, wey],
                        },
                        {
                            coord: [coord1, 2],
                        },
                    ]);

                    markData = JSON.parse(JSON.stringify(markData));
                    markData.coord = [coord1, 2];
                    // markData.label.formatter = 'K ' + (coord1 / 2).toFixed(3),
                    slopeOption.series.markPoint.data.push(markData);

                    if (
                        self.tempData.gGradeCurve[i + 1] &&
                        self.tempData.gGradeCurve[i].endX !=
                            self.tempData.gGradeCurve[i + 1].startX
                    ) {
                        slopeOption.series.markLine.data.push([
                            {
                                coord: [coord1, 2],
                            },
                            {
                                coord: [
                                    self.tempData.gGradeCurve[i + 1].startX /
                                        100,
                                    2,
                                ],
                            },
                        ]);
                    }
                }
                self.$nextTick(() => {
                    console.log(slopeOption);
                    slopeCharts.setOption(slopeOption, true);
                });
            }
        },
    },
    beforeDestroy() {
        unregisterCallback("analysis");
        charts.clear();
        charts.dispose();
        charts = null;
        for (let index = 1; index <= this.maxLine; index++) {
            echartsAll["echarts" + index].clear();
            echartsAll["echarts" + index].dispose();
            echartsAll["echarts" + index] = null;
        }
        //reset Variable
        Option = {
            grid: {
                left: 80,
                top: 30,
                right: 0,
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                },
                formatter: {},
            },
            xAxis: {
                scale: true,
                boundaryGap: false,
                axisTick: {
                    alignWithLabel: true,
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: "#000",
                    },
                },
                splitLine: {
                    show: true,
                    interval: 99,
                    lineStyle: {
                        color: "yellow",
                        type: "dashed",
                    },
                },
                axisLabel: {
                    interval: 199,
                },
                data: [], //getStation()
            },
            yAxis: {
                type: "category",
                splitLine: {
                    show: true,
                    interval: 199,
                    lineStyle: {
                        color: "yellow",
                        type: "dashed",
                    },
                },
                axisLabel: {
                    interval: 199,
                    formatter: function (value) {
                        var reg = /h(\S*)/;
                        var reg1 = /(\S*)h/;
                        return value != "0.0km/h0.0s"
                            ? "{a|" +
                                  value.match(reg1)[0] +
                                  "}\n" +
                                  "{small|" +
                                  value.match(reg)[1] +
                                  "}"
                            : "";
                    },
                    rich: {
                        small: {
                            color: "#999",
                        },
                    },
                },
                data: getKMTIME(),
            },
            color: [
                "#eb3324",
                "#0021f5",
                "#ed4a3c",
                "#5f99f7",
                "#bc2fc7",
                "#43952b",
                "#43952b",
                "#000d93",
            ],
            animation: false,
            series: [],
        };
        slopeCharts.clear();
        slopeCharts.dispose();
        slopeCharts = null;
        slopeOption = {
            grid: {
                left: 80,
                top: 0,
                right: 0,
            },
            xAxis: {
                show: false,
                axisTick: {
                    alignWithLabel: true,
                },
                data: [],
            },
            yAxis: {
                show: false,
                axisTick: {
                    alignWithLabel: true,
                },
                data: [
                    -1, -2, -3, -4, -5, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                    12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
                ],
            },
            animation: false,
            series: [
                {
                    data: [10, 2, 3, 4, 5],
                    lineStyle: { opacity: 1, color: "#43952b", width: 2 },
                    type: "line",
                },
            ],
        };
        chunkOption = [];
        originalData = [];
        this.maxLine = 0;
        this.maxNumber = 0;
        this.loading = true;
        this.tempData = null;
        this.station = [];
        this.tableData = [];
        this.gAbility = {};
    },
};
</script>

<style scoped>
.analysis.fade-transform-enter .el-loading-mask {
    display: block !important;
}
.analysis .tableStop {
    float: left;
    min-height: 100px;
}
.analysis {
    width: 100%;
    height: calc(100vh - 50px);
    min-height: 950px;
}
.analysis .el-table--mini td,
.analysis .el-table--mini th {
    padding: 0;
}
.analysis .left {
    float: left;
    width: 480px;
    height: calc(100vh - 110px);
    padding: 10px;
    font-size: 14px;
    position: relative;
    z-index: 999;
    transition: all ease 0.28s;
    left: 0;
    background: #fff;
}
.analysis .left h2 {
    text-align: center;
    font-size: 20px;
    padding-bottom: 10px;
    font-weight: bold;
}
.analysis .left img {
    width: 400px;
    height: 70px;
    display: block;
    margin: 0 auto;
}
.analysis .left p {
    font-size: 16px;
    font-weight: bold;
}
.analysis .left p,
.analysis .left div {
    padding-bottom: 5px;
}
.analysis .left .el-table div {
    padding-bottom: 0;
}
.analysis .left ul li {
    height: 35px;
    line-height: 35px;
    position: relative;
}
.analysis .left ul li svg {
    position: absolute;
    left: 10px;
    top: 9px;
}
.analysis .left .picUl li::before {
    content: "";
    width: 40px;
    height: 2px;
    vertical-align: middle;
    display: inline-block;
    margin-right: 20px;
}
.analysis .left ul .li1::before {
    background: #e70003;
}
.analysis .left ul .li2::before {
    background: #ac0003;
}
.analysis .left ul .li3::before {
    background: #117aef;
}
.analysis .left ul .li4::before {
    background: #0d00f2;
}
.analysis .left ul .li5::before {
    background: #1eb866;
}
.analysis .left ul .li6::before {
    background: #31a900;
}
.analysis .left ul .li7::before {
    background: #b07803;
}
.analysis .left ul .li8::before {
    background: #bc00d6;
}
.analysis .right {
    float: left;
    width: calc(100% - 500px);
    height: calc(100vh - 110px);
    transition: all ease 0.28s;
}
.analysis .rightMain {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    min-height: calc(100vh - 110px);
}
.analysis .right .echart {
    width: 45362px;
    position: relative;
    height: calc(100vh - 110px);
}
.analysis .right .echarts {
    width: 1920px;
    height: 700px;
    position: relative;
    float: left;
}
.move {
    margin-left: -80px;
}
.station {
    height: 80px;
    position: absolute;
    top: 641px;
    left: 80px;
    width: calc(100% - 80px);
}
.station::after {
    display: block;
    width: 100%;
    height: 2px;
    background: #205ccd;
    content: "";
    margin-top: 80px;
}
.station span {
    position: absolute;
    bottom: 0;
    height: 100px;
    color: #205ccd;
}
.station span::after {
    content: "";
    display: block;
    width: 2px;
    height: 80px;
    background: #205ccd;
    position: absolute;
    left: -2px;
    bottom: 0;
}
.station span:first-child::after {
    left: 0;
}
/* .station span i{position: absolute; left: -55px; transform: rotate(-90deg); width: 85px; height: 20px; line-height: 20px; text-align: center; top: 48px; display: block;font-size: 8px;} */
.station span i {
    position: absolute;
    left: 0;
    width: 180px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    top: 70px;
    display: block;
    font-size: 8px;
}
.station span strong {
    position: absolute;
    transform: translateX(-100%);
    top: 100px;
    display: block;
    width: max-content;
    font-weight: bold;
}
.station span strong sub {
    color: #66a254;
}
.station span b {
    display: inline-block;
    vertical-align: text-top;
    margin: 0 0 0 10px;
}
.station span b big {
    height: 10px;
    border: 2px solid #205ccd;
    border-bottom: none;
    width: 100%;
    display: block;
}
.station span font {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateX(110%);
}
.slope {
    height: 150px;
    position: absolute;
    bottom: 0;
    min-height: 150px;
    left: 0;
}
.tableStop .el-table td,
.tableStop .el-table th {
    text-align: center !important;
}
.el-table__header {
    width: 440px !important;
}
.isHidden {
    margin-left: -480px;
}
.analysis .fullRight {
    width: 100%;
}
.analysis .left svg {
    position: absolute;
    right: -20px;
    top: 0;
    cursor: pointer;
}
.isAction {
    transform: rotate(180deg);
}
.img {
    position: relative;
}
.img span {
    border: 2px solid #000;
    display: inline-block;
    padding: 0 2px;
    font-size: 12px;
}
/* .img .start{margin-right: 40px;} */
.img strong {
    position: absolute;
    left: 50%;
    bottom: 22px;
    transform: translate(-50%, 0);
    width: 400px;
    text-align: center;
}

.stationDir {
    transform: rotateZ(180deg) rotateX(180deg);
}
.stationDir span {
    transform: rotateZ(180deg) rotateX(180deg);
}
.stationDir span i {
    left: -30px;
}
.stationDir span font {
    position: static;
}
.stationDir span strong {
    transform: translateX(0);
}
.stationDir span strong sub {
    position: absolute;
    transform: translateX(-110%);
    top: 0;
    left: 0;
    line-height: 17px;
}
.stationDir span b {
    margin: 0;
}
.stationDir span::after {
    left: 0;
}

.echart:hover .hoveLine,
.echart:hover .hoveLineX {
    display: block;
}
.hoveLine {
    width: 1px;
    height: 100%;
    position: fixed;
    left: 100px;
    top: 0;
    background: #aaa;
    display: none;
    z-index: 2;
}
.hoveLineX {
    width: 100%;
    height: 2px;
    position: fixed;
    left: 0;
    top: 0;
    background: #aaa;
    display: none;
    z-index: 2;
}
#text {
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 99999999;
}
.nine {
    position: fixed;
    top: 60px;
    right: 40px;
    z-index: 2000;
}

.analysis .dir {
    margin-left: -20px;
}

.imageDiv {
    width: 100%;
    height: 200px;
    position: absolute;
    overflow: hidden;
    top: calc(100vh - 315px);
}
.imageDiv img {
    height: 200px;
    position: absolute;
    left: 0;
    top: 0;
    width: 3288.39px;
}

.el-form {
    padding: 5px 0;
    position: relative;
    z-index: 3;
    background: #fff;
}
.el-form-item {
    display: inline-block;
    margin: 0;
}

.analysis .main {
    padding: 0;
}

.analysis .el-table__body-wrapper::-webkit-scrollbar {
    width: 0;
}
</style>

