<template>
    <div class="app-page"
        id="app">
        <router-view />
        <div class="toolbar"
            @click="centerDialogVisible=true">
            <div>系统 {{version}}</div>
        </div>

        <el-dialog title="服务设置"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <p class="version">版本: {{version}}</p>
            <el-form>
                <el-form-item label="服务名称" >
                    <el-input v-model="serverName"></el-input>
                </el-form-item>
                <el-form-item label="服务地址">
                    <el-input v-model="serverIP"></el-input>
                </el-form-item>
                <el-form-item label="前端名称">
                    <el-input v-model="appName"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer"
                class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary"
                    @click="refreshSetting">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Vue from "vue";
import { setInstance, loadAppData, saveAppData } from "@/utils/appCache";
import { initWebSocket, close } from "@/utils/ws";
import config from "../package.json";

export default {
    name: "App",
    components: {},
    data() {
        return {
            serverIP: WS,
            centerDialogVisible: false,
            version: config.version,
            serverName: SERVER_NAME,
            appName: APP_NAME,
        };
    },
    async created() {
        setInstance(this);
        window.addEventListener("load", () => {
            console.log("load");
            loadAppData();
            let data = sessionStorage.getItem("currentLine");
            this.$store.commit("setCurrentLine", data);
        });
        window.addEventListener("beforeunload", () => {
            console.log("unload");
            saveAppData();
        });
        localStorage.setItem(
            "tmpRoute",
            JSON.stringify([
                {
                    value: 0,
                    label: "燕山-阎村东",
                    startStation: 2105,
                    endStation: 2104,
                },
                {
                    value: 1,
                    label: "燕山-星城",
                    startStation: 2104,
                    endStation: 2105,
                },
                {
                    value: 1,
                    label: "阎村-阎村东",
                    startStation: 2104,
                    endStation: 2105,
                }
            ])
        );
        localStorage.setItem(
            "stations",
            JSON.stringify([
                {
                    stationId: 2101,
                    stationName: "东直门",
                    nextId: 2102,
                    major: true,
                },
                {
                    stationId: 2102,
                    stationName: "三元桥",
                    nextId: 2103,
                    major: true,
                },
                {
                    stationId: 2103,
                    stationName: "T3航站楼",
                    nextId: 2104,
                    major: false,
                },
                {
                    stationId: 2104,
                    stationName: "T2航站楼",
                    nextId: 0,
                    major: false,
                },
                {
                    stationId: 2105,
                    stationName: "北新桥",
                    nextId: 2101,
                    major: false,
                },
            ])
        );
        localStorage.setItem(
            "routeconfig",
            JSON.stringify([
                {
                    configId: 1,
                    routes: [
                        {
                            crossRouteId: 1,
                            lineWayId: 37,
                            direction: "上行",
                            startStation: 2105,
                            endStation: 2104,
                            skipStations: [2101, 2102, 2103, 2104, 2105, 0],
                            trainTypes: ["4L"],
                        },
                        {
                            crossRouteId: 1,
                            lineWayId: 65526,
                            direction: "下行",
                            startStation: 2104,
                            endStation: 2105,
                            skipStations: [2104, 2102, 2101, 2105, 0],
                            trainTypes: ["4L"],
                        },
                    ],
                    ratios: ["1:1"],
                },
            ])
        );
        initWebSocket();
    },
    methods: {
        refreshSetting() {
            this.centerDialogVisible = false;
            SERVER_NAME = this.serverName;
            APP_NAME = this.appName;
            WS = this.serverIP;
            close();
            setTimeout(() => {
                initWebSocket();
            }, 500);
        },
    },
};
</script>

<style>
html body {
    font-family: "Microsoft YaHei" !important;
    background: #fff;
}
body,
html {
    height: 100%;
    font-size: 100px;
}
.clearfix:after {
    content: " ";
    display: block;
    clear: both;
    height: 0;
}
.fl {
    float: left;
}
.fr {
    float: right;
}
* {
    margin: 0;
    padding: 0;
}
fieldset,
img,
input {
    border: 0;
    background: none;
}
address,
caption,
cite,
code,
dfn,
em,
i,
optgroup,
strong,
th,
var {
    font-style: normal;
    font-weight: 400;
}
h1,
h2,
h3,
h4,
h5,
h6 {
    font-size: 100%;
    font-weight: 400;
}
button,
input,
optgroup,
option,
select,
textarea {
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
    *font-size: 100%;
}
body {
    line-height: 1.5;
    font-size: 0.14rem;
}
li,
ol,
ul {
    list-style: none;
}
a {
    text-decoration: none;
}
a:focus,
input:focus,
button:focus {
    outline: none;
}

.BMap_cpyCtrl,
.anchorBL {
    display: none;
}
#app .mobile.hideSidebar .sidebar-container {
    transform: none;
    width: auto !important;
}

.test-panel {
    position: absolute;
    right: 20px;
    top: 120px;
}

.app-page {
    position: relative;
}

.toolbar {
    opacity: 0;
    position: fixed;
    cursor: pointer;
    right: 0;
    bottom: 0;
    z-index: 999;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    color: #fff;
    background: #555;
    line-height: 30px;
    padding: 0 10px;
}
.toolbar:hover {
    opacity: 1;
}

.version {
    color: rgb(58, 150, 226);
    margin-bottom: 10px;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
}
</style>