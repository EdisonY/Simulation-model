<template>
    <div class="app-container chose"
        v-loading="loadingAll"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 1)">
        <div class="fpMainMask"></div>
        <el-card class="box-card fpMain"
            v-loading="loading">
            <div slot="header"
                class="clearfix">
                <span>客流查询</span>
                <i class="el-icon-circle-close"
                    @click="rechose(1)"></i>
            </div>
            <div class="step step1"
                v-if="step == 0">
                <el-button type="primary"
                    plain
                    size="small"
                    @click="step2(1,'进站客流去向')">进站客流去向</el-button>
                <el-button type="primary"
                    plain
                    size="small"
                    @click="step2(2,'出站客流来源')">出站客流来源</el-button>
                <el-button type="primary"
                    plain
                    size="small"
                    @click="step2(3,'换乘客流')">换乘客流</el-button>
                <el-button type="primary"
                    plain
                    size="small"
                    @click="step2(4,'区段客流')">区段客流</el-button>
            </div>
            <div class="step step2"
                v-if="step != 0">
                <el-form ref="form"
                    :model="form"
                    label-width="80px">
                    <el-form-item label="查询类型 :">
                        <b>{{font}}</b>
                        <el-button type="info"
                            plain
                            size="small"
                            @click="rechose(0)">重新选择</el-button>
                    </el-form-item>
                    <el-form-item label="目标车站 :"
                        v-if="type != 4">
                        <b>{{form.stationName1}}</b>
                        <el-button type="info"
                            plain
                            size="small"
                            @click="rechose(1)">重新选择</el-button>
                    </el-form-item>
                    <el-form-item label="开始车站 :"
                        v-if="type == 4">
                        <b>{{form.stationName1}}</b>
                    </el-form-item>
                    <el-form-item label="结束车站 :"
                        v-if="type == 4">
                        <b>{{form.stationName2}}</b>
                    </el-form-item>
                    <el-form-item label="时间段 :">
                        <el-time-picker is-range
                            v-model="form.time"
                            value-format="HH:mm"
                            default-value="new Date()"
                            :picker-options="{
                                format:'HH:mm'
                            }"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围">
                        </el-time-picker>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary"
                            plain
                            size="small"
                            @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-tooltip class="item"
            effect="dark"
            content="清除"
            placement="top"
            v-if="show">
            <i class="el-icon-error"
                @click="rechose(1)"></i>
        </el-tooltip>

        <svg id="subway"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            style="overflow: hidden; width: 100vw; height: 100vh; "></svg>
    </div>
</template>


<script>
import {
    registerCallback,
    unregisterCallback,
    sendSock,
    getPackage,
} from "@/utils/ws";
var tctSubway = null;
export default {
    data() {
        return {
            show: false,
            loadingAll: false,
            form: {
                stationName1: "",
                stationName2: "",
                time: ["08:00", "09:00"],
            },
            font: "",
            type: 0,
            step: 0,
            loading: false,
        };
    },
    created() {
        registerCallback("Inquire", this.wsCallback);
        const s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "../../subway/subway1.js";
        document.body.appendChild(s);
    },
    mounted() {
        var self = this;
        this.$nextTick(() => {
            setTimeout(() => {
                self.init();
            }, 1000);
        });
    },
    methods: {
        init() {
            var self = this;
            tctSubway = new tct_subway({
                tmpId: "subway",
                fullload: false,
            });
            tctSubway.on("station.touch", function (info) {
                $(".fpMain,.fpMainMask").show();
                if (self.form.stationName1 != "") {
                    self.step = 1;
                    self.form.stationName2 = info.sdata;
                } else {
                    self.form.stationName1 = info.sdata;
                }
            });
            tctSubway.on("mask", function (info) {
                $(".fpMain,.fpMainMask").hide();
                self.step = 0;
                self.type = 0;
                self.form.stationName1 = "";
                self.form.stationName2 = "";
            });
        },
        step2(num, f) {
            this.font = f;
            this.step = 1;
            this.type = num;
            if (num == 4) {
                if (this.form.stationName2 == "") {
                    this.$confirm(
                        '请选择与开始车站"' +
                            this.form.stationName1 +
                            '"相对应的结束车站',
                        "提示",
                        {
                            confirmButtonText: "确定",
                            showCancelButton: false,
                            type: "warning",
                        }
                    );
                    $(".fpMain,.fpMainMask").hide();
                    tctSubway.clearFlyLine();
                }
            }
        },
        onSubmit() {
            var self = this;
            this.loading = true;
            for (let index = 0; index < this.form.time.length; index++) {
                var chunk = this.form.time[index].split(":");
                for (let i = 0; i < chunk.length; i++) {
                    if (index == 0) {
                        if (i == 0) {
                            self.form.startTime = parseInt(chunk[i]) * 60;
                        } else {
                            self.form.startTime += parseInt(chunk[i]);
                        }
                    } else {
                        if (i == 0) {
                            self.form.endTime = parseInt(chunk[i]) * 60;
                        } else {
                            self.form.endTime += parseInt(chunk[i]);
                        }
                    }
                }
            }
            this.form.queryType = this.type;

            let data = getPackage(504, this.form);
            sendSock(data);
        },
        rechose(num) {
            this.step = 0;
            this.type = 0;
            this.show = false;
            this.loading = false;
            if (num) {
                $(".fpMain,.fpMainMask").hide();
                tctSubway.clearFlyLine();
                this.form.stationName1 = "";
                this.form.stationName2 = "";
            }
        },
        wsCallback(res) {},
    },
    beforeDestroy() {
        unregisterCallback("Inquire");
    },
};
</script>

<style>
#subway {
    cursor: pointer;
}
.fpMain {
    position: fixed;
    transform: translate(-50%, -50%);
    display: none;
    left: 50%;
    top: 50%;
}
.fpMainMask {
    width: 100vw;
    height: 100vh;
    background: #000;
    opacity: 0.3;
    position: fixed;
    left: 0;
    top: 0;
    content: "";
    display: none;
}
.fpMain .el-card__header {
    font-size: 18px;
}
.step1 {
    text-align: center;
}
.el-card__header i {
    position: absolute;
    right: 20px;
    cursor: pointer;
    top: 23px;
}
.el-form-item__content .el-button--info {
    display: inline-block;
    position: absolute;
    right: 0;
    top: 4px;
}
.el-icon-error {
    font-size: 20px;
    position: fixed;
    right: 40px;
    top: 80px;
    cursor: pointer;
}
</style>

