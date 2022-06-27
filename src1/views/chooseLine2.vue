<template>
    <div class="index">

        <div class="project">
            <el-input style="width:600px;font-size:20px;"
                v-model="curName1"
                size="large"></el-input>
            <span style="color:rgb(245, 134, 134);margin:0 10px 0 -62px;z-index:100"
                v-show="hasGetData && curName && lineList.indexOf(curName)==-1">无此项目</span>
            <el-button type="primary"
                style="border-radius:0px 0 0 0px;margin-left:-4px"
                :disabled="lineList.indexOf(curName)==-1 || !hasGetData"
                @click="jump">进入项目</el-button>
            <el-button type="primary"
                style="border-radius:0 8px 8px 0"
                :disabled="lineList.indexOf(curName)>-1 || !hasGetData"
                @click="add">新建项目</el-button>
        </div>

        <img src="../assets/basie/logo.png"
            class="logo">
        <p>@2020 交控科技 京ICP备08007677号 城市轨道交通列车通信与运行控制国家工程实验室</p>
    </div>
</template>

<script>
import * as Util from "@/utils/util";
import { registerCallback,unregisterCallback, sendSock, getPackage } from "@/utils/ws";
export default {
    name: "index",
    components: {},
    data() {
        return {
            lineList: [],
            curName: "北京轨道交通16号线",
            curName1: "北京燕房线",
            hasGetData: false,
        };
    },
    created() {
        registerCallback("chooseLine2", this.wsCallbackOK);
    },
    mounted() {
        let wsdata = getPackage(130, null);
        sendSock(wsdata);
    },
    methods: {
        add() {
            let wsdata = getPackage(129, {
                operationType: 1,
                oldLineName: "",
                newLineName: this.curName,
            });
            sendSock(wsdata);
        },
        jump() {
            window.sessionStorage.setItem("currentLine", this.curName);
            this.$store.commit("setCurrentLine", this.curName);
            this.$router.push({ path: "emergency/rungraph" || "emergency/rungraph" });
        },
        wsCallbackOK(res) {
            console.log(this.$router);
            console.log(`callback ${res.msgType}`);
            console.log(res);
            if (res.msgType == 230) {
                this.hasGetData = true;
                if (res.data.data.length > 0) {
                    this.lineList = res.data.data;
                }
            } else if (res.msgType == 229) {
                if (res.Status == 1) {
                    window.sessionStorage.setItem("currentLine", this.curName);
                    this.$store.commit("setCurrentLine", this.curName);
                    this.$router.push({
                        path: "emergency/rungraph" || "emergency/rungraph",
                    });
                } else {
                    this.$message({
                        type: "info",
                        message: res.msg,
                    });
                    this.loading = false;
                }
            }
        },
    },
    beforeDestroy(){
         unregisterCallback("chooseLine2");
    }
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
$demo: rgb(223, 114, 114);
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
</style>


<style scoped>
@keyframes myfirst {
    0% {
        background-size: 100% 100%;
    }
    50% {
        background-size: 120% 120%;
    }
    100% {
        background-size: 100% 100%;
    }
}

.index {
    width: 100%;
    height: 100vh;
    background: url(../assets/basie/loginbg.jpg) no-repeat center center;
    background-size: 100% 100%;
    position: relative;
    animation: myfirst 30s linear infinite;
    margin-right: auto;
    margin-left: auto;
}

.layout {
    height: 100%;
    padding-bottom: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

.layout h2 {
    color: #fff;
    font-size: 60px;
    font-weight: bold;
    /* transform: translate(-50%, -50%); */
    transform: scale(1.15);
    text-shadow: 1px 1px 1px #000;
    text-align: center;
    margin: 20px;
}
.layout h2 span {
    display: block;
    font-size: 30px;
    font-weight: normal;
}

.index .logo {
    left: 20px;
    bottom: 20px;
    transform: translate(0, 0);
}
.index p {
    position: absolute;
    right: 40px;
    bottom: 20px;
    color: #fff;
}

.project {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: calc(100% - 120px);
}

.el-input >>> .el-input__inner {
    height: 56px;
    line-height: 56px;
    border-radius: 8px 0 0 8px;
}

.el-button {
    height: 56px;
    font-size: 20px;
    width: 160px;
    margin: 0 -2px 0 -2px;
}

.el-button--primary.is-disabled,
.el-button--primary.is-disabled:active,
.el-button--primary.is-disabled:focus,
.el-button--primary.is-disabled:hover {
    color: #fff;
    background-color: #8f9bb3;
    border-color: #8f9bb3;
}
</style>
