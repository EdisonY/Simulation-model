<template>
    <div class="feature clearfix">
        <el-form :model="form"
            size="mini">
            <el-form-item label="列车运行最高限制速度(千米/小时)"
                label-width='400px'>
                <el-input v-model="form.MaxLimitSpd"
                    type="number"
                    min='0'
                    max='100'
                    placeholder="km/h"></el-input>
                <p v-if="db">
                    <span style="float:left;margin-left:-100%">对比数据：</span>
                    {{tmpform.MaxLimitSpd}}
                </p>
            </el-form-item>
            <el-form-item label="坡度值(‰)"
                label-width='140px'>
                <el-input v-model="form.GradeValue"
                    type="number"
                    min='-40'
                    max='40'
                    placeholder="‰"></el-input>
                <p v-if="db">
                    {{tmpform.GradeValue}}
                </p>
            </el-form-item>
            <el-form-item label="车型"
                label-width='80px'>
                <!-- <select class="eggse" v-model="form.TrainType" placeholder="请选择">
                    <option label="6A" value='6a' key="1"></option>
                    <option label="6B" value='6b' key="2"></option>
                    <option label="8A" value='8a' key="3"></option>
                    <option label="8B" value='8b' key="4"></option>
                </select> -->
                <el-input disabled
                    v-model="form.TrainType"
                    placeholder=""></el-input>
                <p v-if="db">
                    {{tmpform.TrainType}}
                    &nbsp;
                </p>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                    @click="getData(1)">确 定</el-button>
                <p v-if="db">&nbsp;</p>
            </el-form-item>
            <el-form-item v-show="false"
                style="position:absolute;right:10px">
                <el-button type="primary"
                    @click="jumpPage(1)">返回能力计算</el-button>
            </el-form-item>
        </el-form>
        <div class="svgMain"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255, 255, 255, 1)">
            <i class="hover"></i>
            <svg id="feature"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"></svg>
        </div>

        <div class="tip">
            <ul class="line">
                <li class="li1">列车运行最高限制速度</li>
                <li class="li3">紧急制动曲线</li>
                <li class="li4">紧急制动触发曲线</li>
            </ul>
            <ul>
                <li>① 牵引切除延时过程</li>
                <li>② 紧急制动建立延时过程</li>
                <li>③ 紧急制动实施过程</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { registerCallback, unregisterCallback,sendSock, getPackage } from "@/utils/ws";
var y_bili, x_bili;
export default {
    name: "feature",
    data() {
        return {
            db: false,
            loading: false,
            form: {
                TrainType: "8B",
                MaxLimitSpd: 100,
                GradeValue: 0,
            },
            tmpform: {
                TrainType: "8B",
                MaxLimitSpd: 100,
                GradeValue: 0,
            },
            tmpx: 0,
            tmpxO: 0,
            cow: null,
        };
    },
    created() {
        registerCallback("feature", this.wsCallback);
    },
    updated() {},
    mounted() {
        this.getData();
    },
    methods: {
        getData(cow) {
            this.cow = cow;
            if (
                this.form.MaxLimitSpd != undefined &&
                this.form.GradeValue != undefined
            ) {
                this.tmpform.MaxLimitSpd = parseInt(
                    sessionStorage.getItem("MaxLimitSpd")
                );
                this.tmpform.GradeValue = parseInt(
                    sessionStorage.getItem("GradeValue")
                );
                this.tmpform.TrainType = sessionStorage.getItem("TrainType");
                this.loading = true;
                let data = getPackage(124, {
                    MaxLimitSpd: parseInt(this.form.MaxLimitSpd),
                    GradeValue: parseInt(this.form.GradeValue),
                });

                if (cow) {
                    this.db = true;
                    $("#feature").children().remove();
                    this.drewFrame();
                    this.drewDb();
                }
                sendSock(data);
            }
        },
        drewBody(cow) {
            var orginData = JSON.parse(sessionStorage.getItem("feature"));
            console.log("-------" + x_bili);
            var x, y, x1, y1;
            var self = this;
            this.generate("g", { id: "curve1" }, "feature");

            for (let index = 0; index < orginData.EBCurve.length - 1; index++) {
                self.generate(
                    "line",
                    {
                        x1:
                            (orginData.EBCurve[index].Distance / 100) * x_bili +
                            40,
                        y1: 500 - orginData.EBCurve[index].Speed * y_bili + 100,
                        x2:
                            (orginData.EBCurve[index + 1].Distance / 100) *
                                x_bili +
                            40,
                        y2:
                            500 -
                            orginData.EBCurve[index + 1].Speed * y_bili +
                            100,
                        stroke: "#3675ce",
                        "stroke-width": 3,
                        ox: orginData.EBCurve[index].Distance,
                        oy: orginData.EBCurve[index].Speed,
                    },
                    "curve1"
                );
                if (
                    orginData.EBCurve[index].Step == 1 &&
                    orginData.EBCurve[index + 1].Step == 2
                ) {
                    x =
                        ((orginData.EBCurve[index].Distance -
                            orginData.EBCurve[0].Distance) /
                            200) *
                            x_bili +
                        40;
                    y =
                        ((orginData.EBCurve[index].Speed -
                            orginData.EBCurve[0].Speed) /
                            2) *
                            y_bili +
                        120 +
                        (500 -
                            (parseInt(sessionStorage.getItem("MaxLimitSpd")) /
                                110) *
                                500);
                    x1 = orginData.EBCurve[index + 1].Distance;
                    y1 = orginData.EBCurve[index + 1].Speed;
                    self.generate(
                        "text",
                        {
                            "font-family": "微软雅黑",
                            x: x,
                            y: y,
                            fill: "#000",
                            "font-size": 24,
                        },
                        "feature",
                        "❶"
                    );
                } else if (
                    orginData.EBCurve[index].Step == 2 &&
                    orginData.EBCurve[index + 1].Step == 3
                ) {
                    x =
                        ((orginData.EBCurve[index].Distance -
                            x1 +
                            orginData.EBCurve[index].Distance) /
                            200) *
                            x_bili +
                        40;
                    y =
                        ((orginData.EBCurve[index].Speed - y1) / 2) * y_bili +
                        120 +
                        (500 -
                            (parseInt(sessionStorage.getItem("MaxLimitSpd")) /
                                110) *
                                500);
                    self.generate(
                        "text",
                        {
                            "font-family": "微软雅黑",
                            x: x,
                            y: y,
                            fill: "#000",
                            "font-size": 24,
                        },
                        "feature",
                        "❷"
                    );
                    x1 = orginData.EBCurve[index + 1].Distance;
                    y1 = orginData.EBCurve[index + 1].Speed;
                } else if (index == orginData.EBCurve.length - 2) {
                    x =
                        (((orginData.EBCurve[index].Distance - x1) / 2 + x1) /
                            100) *
                            x_bili +
                        40;
                    y =
                        (Math.abs(orginData.EBCurve[index].Speed - y1) / 2) *
                            y_bili +
                        50 +
                        (500 -
                            (parseInt(sessionStorage.getItem("MaxLimitSpd")) /
                                110) *
                                500);
                    self.generate(
                        "text",
                        {
                            "font-family": "微软雅黑",
                            x: x,
                            y: y,
                            fill: "#000",
                            "font-size": 24,
                        },
                        "feature",
                        "❸"
                    );
                }
            }

            this.generate("g", { id: "trigger1" }, "feature");
            for (
                let index = 0;
                index < orginData.EBTrigger.length - 1;
                index++
            ) {
                self.generate(
                    "line",
                    {
                        x1:
                            (orginData.EBTrigger[index].x_s / 100) * x_bili +
                            40,
                        y1: 500 - orginData.EBTrigger[index].y_v * y_bili + 100,
                        x2:
                            (orginData.EBTrigger[index + 1].x_s / 100) *
                                x_bili +
                            40,
                        y2:
                            500 -
                            orginData.EBTrigger[index + 1].y_v * y_bili +
                            100,
                        stroke: "#10b55a",
                        "stroke-width": 3,
                        ox: orginData.EBTrigger[index].x_s,
                        oy: orginData.EBTrigger[index].y_v,
                    },
                    "trigger1"
                );
            }

            this.generate(
                "line",
                {
                    x1: 40,
                    y1: 500 - orginData.MaxCurve[0].y_v * y_bili + 100,
                    x2: document.body.offsetWidth - 250,
                    y2: 500 - orginData.MaxCurve[0].y_v * y_bili + 100,
                    stroke: "#ff2603",
                    "stroke-width": 3,
                },
                "feature"
            );
            this.generate(
                "text",
                {
                    "font-family": "微软雅黑",
                    x: document.body.offsetWidth - 370,
                    y: 500 - orginData.MaxCurve[0].y_v * y_bili + 94,
                    fill: "red",
                    "font-size": 24,
                },
                "feature",
                parseInt(sessionStorage.getItem("MaxLimitSpd")) + "千米/小时"
            );

            this.generate(
                "line",
                {
                    x1: 40,
                    y1: 600,
                    x2: document.body.offsetWidth - 250,
                    y2: 600,
                    stroke: "#000",
                    "stroke-width": 3,
                    "stroke-linejoin": "round",
                    "stroke-linecap": "round",
                    lineId: "X",
                },
                "feature"
            );
            this.generate(
                "path",
                {
                    d:
                        "M" +
                        (document.body.offsetWidth - 256) +
                        ",594 L" +
                        (document.body.offsetWidth - 244) +
                        ",600 L" +
                        (document.body.offsetWidth - 256) +
                        ",606 Z",
                    fill: "#000",
                },
                "feature"
            );
            this.generate(
                "text",
                {
                    "font-family": "微软雅黑",
                    x: document.body.offsetWidth - 300,
                    y: 593,
                    fill: "#000",
                    "font-size": 24,
                },
                "feature",
                "距离"
            );
            // this.generate('text',{'font-family':'微软雅黑','x':document.body.offsetWidth - 300,'y':623,'fill':'#000','font-size':12},'feature','1400米')

            if (!cow) {
                this.tmpxO =
                    orginData.EBTrigger[orginData.EBTrigger.length - 1].x_s /
                    100;
                this.tmpx =
                    (orginData.EBTrigger[orginData.EBTrigger.length - 1].x_s /
                        100) *
                    x_bili;
                this.tmpform.MaxLimitSpd = parseInt(this.form.MaxLimitSpd);
                this.tmpform.GradeValue = parseInt(this.form.GradeValue);
                this.tmpform.TrainType = this.form.TrainType;
            }
            this.generate(
                "text",
                {
                    "font-family": "微软雅黑",
                    x:
                        (orginData.EBTrigger[orginData.EBTrigger.length - 1]
                            .x_s /
                            100) *
                            x_bili -
                        20,
                    y: 620,
                    fill: "#10b55a",
                    "font-size": 24,
                },
                "feature",
                orginData.EBTrigger[orginData.EBTrigger.length - 1].x_s / 100 +
                    "米"
            );
            this.generate(
                "text",
                {
                    "font-family": "微软雅黑",
                    x:
                        (orginData.EBCurve[orginData.EBCurve.length - 1]
                            .Distance /
                            100) *
                            x_bili +
                        40,
                    y: 620,
                    fill: "#3675ce",
                    "font-size": 24,
                },
                "feature",
                orginData.EBCurve[orginData.EBCurve.length - 1].Distance / 100 +
                    "米"
            );

            // this.generate('path',{'stroke-dasharray':'5,15','d':'M' + (orginData.EBCurve[orginData.EBCurve.length - 1].Distance / 100 * x_bili + 200) + ' 600 L' + (orginData.EBCurve[orginData.EBCurve.length - 1].Distance / 100 * x_bili + 200) + ' 20','stroke':'#000','stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round'},'feature')
            // this.generate('path',{'stroke-dasharray':'5,15','d':'M' + (orginData.SafeMargin.x_s / 100 * x_bili + 200) + ' 600 L' + (orginData.SafeMargin.x_s / 100 * x_bili + 200) + ' 20','stroke':'#000','stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round'},'feature')
            // this.generate('text',{'font-family':'微软雅黑','x':(orginData.SafeMargin.x_s / 100 * x_bili + 200),'y':620,'fill':'#000','font-size':24},'feature',(orginData.SafeMargin.x_s / 100) + '米')
            // this.generate('text',{'font-family':'微软雅黑','x':(orginData.SafeMargin.x_s / 100 * x_bili + 210),'y':42,'fill':'#000','font-size':24},'feature',(orginData.SafeMargin.x_s / 100) + '米')

            // this.generate('text',{'font-family':'微软雅黑','x':orginData.EBCurve[orginData.EBCurve.length - 1].Distance / 100 * x_bili + 200,'y':645,'fill':'#000','font-size':24},'feature','防护终点')
            this.generate(
                "circle",
                {
                    fill: "black",
                    r: 4,
                    stroke: "black",
                    "stroke-width": 1,
                    cx: (orginData.SafeMargin.x_s / 100) * x_bili + 40,
                    cy: 600,
                },
                "feature"
            );
            this.generate(
                "text",
                {
                    "font-family": "微软雅黑",
                    x: (orginData.SafeMargin.x_s / 100) * x_bili + 40,
                    y: 590,
                    fill: "#000",
                    "font-size": 24,
                },
                "feature",
                "防护终点"
            );
            // this.generate('image',{'href':'http://39.105.230.230:8080/subway/carline.png','width':158,'height':50,'x':(orginData.SafeMargin.x_s / 100 * x_bili + 202),'y':550,'style':'fill:#000000'},'feature')

            // this.generate('path',{'stroke-dasharray':'5,15','d':'M200 600 L200 20','stroke':'#000','stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round'},'feature')
            // this.generate('circle',{'fill':'black','r':4,'stroke':'black','stroke-width':1,'cx':200,'cy':600},'feature')
            // this.generate('text',{'font-family':'微软雅黑','x':193,'y':620,'fill':'#000','font-size':12},'feature','0米')
            // this.generate('text',{'font-family':'微软雅黑','x':250,'y':620,'fill':'#000','font-size':12},'feature',orginData.LocError.x_s / 100 + '米')

            // this.generate('g',{'id':'aqyl','transform':'translate(' + (orginData.EBCurve[orginData.EBCurve.length - 1].Distance / 100 * x_bili + 200) + ',500)'},'feature')
            // this.generate('path',{'d':'M0,0 L4,6 L0,12 L12,6 L0,0','fill':'#000','transform':'translate(42,0)'},'aqyl')
            // this.generate('path',{'d':'M0,0 L4,6 L0,12 L12,6 L0,0','fill':'#000','transform':'rotate(180) translate(-12,-12)'},'aqyl')
            // this.generate('line',{'x1':5,'y1':6,'x2':44,'y2':6,'stroke':'#000','stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round'},'aqyl')
            // this.generate('text',{'font-family':'微软雅黑','x':3,'y':-30,'fill':'#000','font-size':24},'aqyl','安全')
            // this.generate('text',{'font-family':'微软雅黑','x':3,'y':-6,'fill':'#000','font-size':24},'aqyl','裕量')

            // this.generate('g',{'id':'dwwc','transform':'translate(200,650)'},'feature')
            // this.generate('path',{'d':'M0,0 L4,6 L0,12 L12,6 L0,0','fill':'#2196f3','transform':'translate(' + (orginData.SafeMargin.x_s / 100 * x_bili - 4) + ',0)'},'dwwc')
            // this.generate('path',{'d':'M0,0 L4,6 L0,12 L12,6 L0,0','fill':'#2196f3','transform':'rotate(180) translate(-12,-12)'},'dwwc')
            // this.generate('line',{'x1':4,'y1':6,'x2':orginData.SafeMargin.x_s / 100 * x_bili - 2,'y2':6,'stroke':'#2196f3','stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round'},'dwwc')
            // this.generate('text',{'font-family':'微软雅黑','x':orginData.SafeMargin.x_s / 100 * x_bili / 2 - 40,'y':30,'fill':'#2196f3','font-size':24},'dwwc','两车间隔')

            $("#curve1 line,#trigger1 line").mouseleave(function () {
                $(".hover").hide();
            });

            $("#curve1 line").mouseover(function () {
                var self = this;
                console.log(this.attributes);
                $(".hover")
                    .html(
                        "列车位置:" +
                            this.attributes.ox.value / 100 +
                            "米 <br/> 制动速度:" +
                            this.attributes.oy.value / 100 +
                            "米/秒"
                    )
                    .css({
                        left: self.getBBox().x - 50,
                        top:
                            self.getBBox().y + $("#feature").offset().top - 110,
                        backgroundColor: "#3675ce",
                    })
                    .show();
                return false;
            });
            $("#trigger1 line").mouseover(function () {
                var self = this;
                $(".hover")
                    .html(
                        "列车位置:" +
                            this.attributes.ox.value / 100 +
                            "米 <br/> 制动速度:" +
                            this.attributes.oy.value / 100 +
                            "米/秒"
                    )
                    .css({
                        left: self.getBBox().x - 50,
                        top:
                            self.getBBox().y + $("#feature").offset().top - 110,
                        backgroundColor: "#10b55a",
                    })
                    .show();
                return false;
            });

            this.loading = false;
        },
        drewFrame() {
            this.generate(
                "line",
                {
                    x1: 40,
                    y1: 600,
                    x2: 40,
                    y2: 20,
                    stroke: "#000",
                    "stroke-width": 3,
                    "stroke-linejoin": "round",
                    "stroke-linecap": "round",
                    lineId: "Y",
                },
                "feature"
            );
            this.generate(
                "text",
                {
                    "font-family": "微软雅黑",
                    x: 46,
                    y: 20,
                    fill: "#000",
                    "font-size": 24,
                },
                "feature",
                "速度"
            );

            this.generate(
                "path",
                { d: "M34,20 L40,10 L46,20 Z", fill: "#000" },
                "feature"
            );
        },
        drewDb() {
            var orginData = JSON.parse(sessionStorage.getItem("feature"));
            console.log("-------" + x_bili);
            var x, y, x1, y1;
            var self = this;
            this.generate("g", { id: "curve" }, "feature");

            for (let index = 0; index < orginData.EBCurve.length - 1; index++) {
                self.generate(
                    "line",
                    {
                        "stroke-dasharray": "1,1",
                        x1:
                            (orginData.EBCurve[index].Distance / 100) * x_bili +
                            40,
                        y1: 500 - orginData.EBCurve[index].Speed * y_bili + 100,
                        x2:
                            (orginData.EBCurve[index + 1].Distance / 100) *
                                x_bili +
                            40,
                        y2:
                            500 -
                            orginData.EBCurve[index + 1].Speed * y_bili +
                            100,
                        stroke: "#75aaf5",
                        "stroke-width": 3,
                        ox: orginData.EBCurve[index].Distance,
                        oy: orginData.EBCurve[index].Speed,
                    },
                    "curve"
                );
                if (
                    orginData.EBCurve[index].Step == 1 &&
                    orginData.EBCurve[index + 1].Step == 2
                ) {
                    x =
                        ((orginData.EBCurve[index].Distance -
                            orginData.EBCurve[0].Distance) /
                            200) *
                            x_bili +
                        40;
                    y =
                        ((orginData.EBCurve[index].Speed -
                            orginData.EBCurve[0].Speed) /
                            2) *
                            y_bili +
                        120 +
                        (500 -
                            (parseInt(sessionStorage.getItem("MaxLimitSpd")) /
                                110) *
                                500);
                    x1 = orginData.EBCurve[index + 1].Distance;
                    y1 = orginData.EBCurve[index + 1].Speed;
                    self.generate(
                        "text",
                        {
                            "font-family": "微软雅黑",
                            x: x,
                            y: y,
                            fill: "#000",
                            "font-size": 24,
                        },
                        "feature",
                        "①"
                    );
                } else if (
                    orginData.EBCurve[index].Step == 2 &&
                    orginData.EBCurve[index + 1].Step == 3
                ) {
                    x =
                        ((orginData.EBCurve[index].Distance -
                            x1 +
                            orginData.EBCurve[index].Distance) /
                            200) *
                            x_bili +
                        40;
                    y =
                        ((orginData.EBCurve[index].Speed - y1) / 2) * y_bili +
                        120 +
                        (500 -
                            (parseInt(sessionStorage.getItem("MaxLimitSpd")) /
                                110) *
                                500);
                    self.generate(
                        "text",
                        {
                            "font-family": "微软雅黑",
                            x: x,
                            y: y,
                            fill: "#000",
                            "font-size": 24,
                        },
                        "feature",
                        "②"
                    );
                    x1 = orginData.EBCurve[index + 1].Distance;
                    y1 = orginData.EBCurve[index + 1].Speed;
                } else if (index == orginData.EBCurve.length - 2) {
                    x =
                        (((orginData.EBCurve[index].Distance - x1) / 2 + x1) /
                            100) *
                            x_bili +
                        40;
                    y =
                        (Math.abs(orginData.EBCurve[index].Speed - y1) / 2) *
                            y_bili +
                        50 +
                        (500 -
                            (parseInt(sessionStorage.getItem("MaxLimitSpd")) /
                                110) *
                                500);
                    self.generate(
                        "text",
                        {
                            "font-family": "微软雅黑",
                            x: x,
                            y: y,
                            fill: "#000",
                            "font-size": 24,
                        },
                        "feature",
                        "③"
                    );
                }
            }

            this.generate("g", { id: "trigger" }, "feature");
            for (
                let index = 0;
                index < orginData.EBTrigger.length - 1;
                index++
            ) {
                self.generate(
                    "line",
                    {
                        "stroke-dasharray": "1,1",
                        x1:
                            (orginData.EBTrigger[index].x_s / 100) * x_bili +
                            40,
                        y1: 500 - orginData.EBTrigger[index].y_v * y_bili + 100,
                        x2:
                            (orginData.EBTrigger[index + 1].x_s / 100) *
                                x_bili +
                            40,
                        y2:
                            500 -
                            orginData.EBTrigger[index + 1].y_v * y_bili +
                            100,
                        stroke: "#10b55a",
                        "stroke-width": 3,
                        ox: orginData.EBTrigger[index].x_s,
                        oy: orginData.EBTrigger[index].y_v,
                    },
                    "trigger"
                );
            }

            this.generate(
                "line",
                {
                    "stroke-dasharray": "5,15",
                    x1: 40,
                    y1: 500 - orginData.MaxCurve[0].y_v * y_bili + 100,
                    x2: document.body.offsetWidth - 250,
                    y2: 500 - orginData.MaxCurve[0].y_v * y_bili + 100,
                    stroke: "#ff2603",
                    "stroke-width": 3,
                },
                "feature"
            );
            this.generate(
                "text",
                {
                    "font-family": "微软雅黑",
                    x: document.body.offsetWidth - 370,
                    y: 500 - orginData.MaxCurve[0].y_v * y_bili + 94,
                    fill: "red",
                    "font-size": 24,
                },
                "feature",
                parseInt(sessionStorage.getItem("MaxLimitSpd")) + "千米/小时"
            );

            this.generate(
                "line",
                {
                    "stroke-dasharray": "5,15",
                    x1: 40,
                    y1: 600,
                    x2: document.body.offsetWidth - 250,
                    y2: 600,
                    stroke: "#000",
                    "stroke-width": 3,
                    "stroke-linejoin": "round",
                    "stroke-linecap": "round",
                    lineId: "X",
                },
                "feature"
            );
            this.generate(
                "path",
                {
                    "stroke-dasharray": "5,15",
                    d:
                        "M" +
                        (document.body.offsetWidth - 256) +
                        ",594 L" +
                        (document.body.offsetWidth - 244) +
                        ",600 L" +
                        (document.body.offsetWidth - 256) +
                        ",606 Z",
                    fill: "#000",
                },
                "feature"
            );
            this.generate(
                "text",
                {
                    "font-family": "微软雅黑",
                    x: document.body.offsetWidth - 300,
                    y: 593,
                    fill: "#000",
                    "font-size": 24,
                },
                "feature",
                "距离"
            );

            this.generate(
                "text",
                {
                    "font-family": "微软雅黑",
                    x:
                        (orginData.EBTrigger[orginData.EBTrigger.length - 1]
                            .x_s /
                            100) *
                            x_bili -
                        20,
                    y: 640,
                    fill: "#64f7a6",
                    "font-size": 24,
                },
                "feature",
                orginData.EBTrigger[orginData.EBTrigger.length - 1].x_s / 100 +
                    "米"
            );
            this.generate(
                "text",
                {
                    "font-family": "微软雅黑",
                    x:
                        (orginData.EBCurve[orginData.EBCurve.length - 1]
                            .Distance /
                            100) *
                            x_bili +
                        40,
                    y: 640,
                    fill: "#6aa1ef",
                    "font-size": 24,
                },
                "feature",
                orginData.EBCurve[orginData.EBCurve.length - 1].Distance / 100 +
                    "米"
            );

            // this.generate('text',{'font-family':'微软雅黑','x':orginData.EBCurve[orginData.EBCurve.length - 1].Distance / 100 * x_bili + 200,'y':645,'fill':'#000','font-size':24},'feature','防护终点')
            this.generate(
                "circle",
                {
                    fill: "black",
                    r: 4,
                    stroke: "black",
                    "stroke-width": 1,
                    cx: (orginData.SafeMargin.x_s / 100) * x_bili + 40,
                    cy: 600,
                },
                "feature"
            );
            this.generate(
                "text",
                {
                    "font-family": "微软雅黑",
                    x: (orginData.SafeMargin.x_s / 100) * x_bili + 40,
                    y: 590,
                    fill: "#666",
                    "font-size": 24,
                },
                "feature",
                "防护终点"
            );

            // this.loading = false

            $("#curve line,#trigger line").mouseleave(function () {
                $(".hover").hide();
            });

            $("#curve line").mouseover(function () {
                var self = this;
                console.log(this.attributes);
                $(".hover")
                    .html(
                        "列车位置:" +
                            this.attributes.ox.value / 100 +
                            "米 <br/> 制动速度:" +
                            this.attributes.oy.value / 100 +
                            "米/秒"
                    )
                    .css({
                        left: self.getBBox().x - 50,
                        top:
                            self.getBBox().y + $("#feature").offset().top - 110,
                        backgroundColor: "#6aa1ef",
                    })
                    .show();
                return false;
            });
            $("#trigger line").mouseover(function () {
                var self = this;
                $(".hover")
                    .html(
                        "列车位置:" +
                            this.attributes.ox.value / 100 +
                            "米 <br/> 制动速度:" +
                            this.attributes.oy.value / 100 +
                            "米/秒"
                    )
                    .css({
                        left: self.getBBox().x - 50,
                        top:
                            self.getBBox().y + $("#feature").offset().top - 110,
                        backgroundColor: "#64f7a6",
                    })
                    .show();
                return false;
            });
            console.log(1111);
        },
        drewBreak() {
            var orginData = JSON.parse(sessionStorage.getItem("feature"));

            console.log("-------" + x_bili);
            console.log(
                this.tmpxO,
                orginData.EBTrigger[orginData.EBTrigger.length - 1].x_s / 100
            );
            if (
                this.tmpx <
                (orginData.EBTrigger[orginData.EBTrigger.length - 1].x_s /
                    100) *
                    x_bili
            ) {
                this.generate(
                    "g",
                    {
                        id: "zdjl",
                        transform: "translate(" + (this.tmpx + 40) + ",660)",
                    },
                    "feature"
                );
            } else {
                this.generate(
                    "g",
                    {
                        id: "zdjl",
                        transform:
                            "translate(" +
                            ((orginData.EBTrigger[
                                orginData.EBTrigger.length - 1
                            ].x_s /
                                100) *
                                x_bili +
                                40) +
                            ",660)",
                    },
                    "feature"
                );
            }
            this.generate(
                "path",
                {
                    d: "M0,0 L4,6 L0,12 L12,6 L0,0",
                    fill: "#ff9800",
                    transform:
                        "translate(" +
                        (Math.abs(
                            (orginData.EBTrigger[orginData.EBTrigger.length - 1]
                                .x_s /
                                100) *
                                x_bili -
                                this.tmpx
                        ) -
                            12) +
                        ",0)",
                },
                "zdjl"
            );
            this.generate(
                "path",
                {
                    d: "M0,0 L4,6 L0,12 L12,6 L0,0",
                    fill: "#ff9800",
                    transform: "rotate(180) translate(-12,-12)",
                },
                "zdjl"
            );
            this.generate(
                "line",
                {
                    x1: 4,
                    y1: 6,
                    x2:
                        Math.abs(
                            (orginData.EBTrigger[orginData.EBTrigger.length - 1]
                                .x_s /
                                100) *
                                x_bili -
                                this.tmpx
                        ) - 5,
                    y2: 6,
                    stroke: "#ff9800",
                    "stroke-width": 3,
                    "stroke-linejoin": "round",
                    "stroke-linecap": "round",
                },
                "zdjl"
            );
            // this.generate('text',{'font-family':'微软雅黑','x':Math.abs(orginData.EBTrigger[orginData.EBTrigger.length - 1].x_s / 100 * x_bili -  this.tmpx) / 2 - 40,'y':30,'fill':'#ff9800','font-size':24},'zdjl','制动距离' + (Math.abs(this.tmpxO - (orginData.EBTrigger[orginData.EBTrigger.length - 1].x_s / 100))) + '米')
            this.generate(
                "text",
                {
                    "font-family": "微软雅黑",
                    x: 0,
                    y: 30,
                    fill: "#ff9800",
                    "font-size": 24,
                },
                "zdjl",
                "制动距离差值"
            );

            this.tmpx =
                (orginData.EBTrigger[orginData.EBTrigger.length - 1].x_s /
                    100) *
                x_bili;
        },
        generate(element, obj, tag, inner) {
            var self = this;
            var xx = 0;
            var dom = document.createElementNS(
                "http://www.w3.org/2000/svg",
                element
            );
            for (var key in obj) {
                dom.setAttribute(key, obj[key]);
            }
            if (inner) dom.innerHTML = inner;
            document.getElementById(tag).appendChild(dom);
        },
        jumpPage(index) {
            if (index == 1) {
                this.$router.push({ path: "/traincapacity/summary" });
            }
        },
        wsCallback(res) {
            if (res.data && res.msgType == 224) {
                if (this.cow) {
                    window.sessionStorage.setItem(
                        "feature",
                        JSON.stringify(res.data)
                    );
                    window.sessionStorage.setItem(
                        "MaxLimitSpd",
                        parseInt(this.form.MaxLimitSpd)
                    );
                    window.sessionStorage.setItem(
                        "GradeValue",
                        parseInt(this.form.GradeValue)
                    );
                    this.form.TrainType = res.data.TrainType;
                    this.drewBody(1);
                    this.drewBreak();
                } else {
                    window.sessionStorage.setItem(
                        "feature",
                        JSON.stringify(res.data)
                    );
                    window.sessionStorage.setItem(
                        "MaxLimitSpd",
                        parseInt(this.form.MaxLimitSpd)
                    );
                    window.sessionStorage.setItem(
                        "GradeValue",
                        parseInt(this.form.GradeValue)
                    );
                    this.form.TrainType = res.data.TrainType;

                    y_bili =
                        ((parseInt(sessionStorage.getItem("MaxLimitSpd")) /
                            110) *
                            500) /
                        res.data.MaxCurve[0].y_v;
                    x_bili =
                        (document.body.offsetWidth - 500) /
                        (res.data.SafeMargin.x_s / 100);
                    if (res.data.SafeMargin.x_s < 30000) {
                        x_bili =
                            (document.body.offsetWidth - 500) /
                            (res.data.SafeMargin.x_s / 100) /
                            2;
                    } else {
                        var _w = (document.body.offsetWidth - 500) / 2 / 1600;
                        x_bili =
                            ((document.body.offsetWidth - 500) / 2 +
                                (res.data.SafeMargin.x_s / 100 - 300) * _w) /
                            (res.data.SafeMargin.x_s / 100);
                    }

                    $("#feature").children().remove();
                    this.drewFrame();
                    this.drewBody();
                }
            }
        },
    },
    beforeDestroy() {
        unregisterCallback("feature");},
};
</script>

<style scoped>
.feature {
    width: 100%;
    height: calc(100vh - 50px);
    min-height: 968px;
}
.svgMain {
    overflow: hidden;
    width: calc(100vw - 240px);
    height: calc(100vh - 260px);
    position: relative;
    margin: 30px auto;
}
.svgMain svg {
    width: calc(100vw - 200px);
    height: calc(100vh - 260px);
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, 0);
}
.tip {
    font-size: 14px;
    width: 90%;
    margin: 0 auto;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);
}
.tip ul {
    float: left;
    margin-right: 40px;
}
.tip .line li {
    padding: 0 0 0 25px;
    position: relative;
}
.tip .line li::before {
    content: "";
    display: block;
    position: absolute;
    width: 20px;
    height: 4px;
    left: 0;
    top: 8px;
}
.tip .line .li1::before {
    background: #ff2603;
}
.tip .line .li2::before {
    background: #f18127;
}
.tip .line .li3::before {
    background: #3675ce;
}
.tip .line .li4::before {
    background: #10b55a;
}
.feature .el-form {
    padding: 20px 0;
    height: 80px;
}
.feature .el-form p {
    color: #868585;
    padding-left: 15px;
}
.feature .el-form-item {
    display: inline-block;
    margin: 0;
}
.hover {
    position: absolute;
    z-index: 9999;
    border-radius: 4px;
    background: #000;
    color: #fff;
    padding: 4px;
    font-size: 14px;
    display: none;
}
#curve line,
#trigger line {
    cursor: pointer;
}
.eggse {
    height: 40px;
    border: 1px solid #dcdfe6;
    width: 160px;
    font-size: 14px;
    color: #666;
    padding: 0 0 0 10px;
}
.eggse option {
    height: 40px;
    line-height: 40px;
}

/* .feature .el-input__inner,.feature .el-form-item__label{height: 50px !important;line-height: 50px !important;} */
</style>