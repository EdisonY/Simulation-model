<template>
    <div class="index main">
        <!-- <svg id="subway" xmlns="http://www.w3.org/2000/svg" version="1.1"></svg> -->
        <div class="choseline">
            <img src="../assets/basie/Jietu20220615-171440.jpeg" />
        </div>
        <!-- <div class="project">
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
        </div> -->
        <div class="mainB">        
        <div class="inputDiv">
            <input type="text"
                v-model="addName"
                class="input"
                placeholder="项目名称/地点/线路" />
            <span @click="add()">新建项目</span>
            <p>例如：北京1号线</p>
        </div>

        <div class="mainBottom">
            <el-table :data="tableData"
                height="440"
                style="width: 100%;"
                :default-sort="{prop: 'date', order: 'descending'}"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 1)">
                <el-table-column prop="index"
                    label="索引"
                    align="center"
                    sortable>
                </el-table-column>
                <el-table-column prop="name"
                    label="名称"
                    align="center"
                    sortable>
                </el-table-column>
                <el-table-column prop="c_time"
                    label="创建时间"
                    align="center"
                    sortable>
                </el-table-column>
                <el-table-column prop="change_time"
                    label="更改时间"
                    align="center"
                    sortable>
                </el-table-column>
                <el-table-column align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <i class="el-icon-edit-outline"
                            @click="jump(scope.row)"></i>
                        <i class="el-icon-document-copy"
                            @click="add(scope.row)"></i>
                        <i class="el-icon-delete"
                            @click="del(scope)"></i>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        </div>
        <p>@2020 交控科技 京ICP备08007677号 城市轨道交通列车通信与运行控制国家工程实验室</p>
    </div>
</template>

<script>
var tctSubway = null
import { registerCallback,unregisterCallback, sendSock, getPackage } from "@/utils/ws";
export default {
    name: "index",
    components: {},
    data() {
        return {
            lineList: [],
            curName: "北京轨道交通燕房线",
            curName1: "北京燕房线",
            hasGetData: false,
            addName: "",
            city: "北京市",
            line: "7号线",
            activeNames: ["1", "2", "3"],
            options: {},
            tableData: [
                // {
                //     index: 1,
                //     name: "北京7号线",
                //     c_time: "2020/12/01",
                //     change_time: "2020/12/01",
                // },
                // {
                //     index: 2,
                //     name: "北京28号线",
                //     c_time: "2020/12/29",
                //     change_time: "2020/12/29",
                // },
                {
                    index: 1,
                    name: "北京轨道交通11号线",
                    c_time: "2021/04/07",
                    change_time: "2021/04/07",
                },{
                    index: 2,
                    name: "北京轨道交通燕房线",
                    c_time: "2021/04/07",
                    change_time: "2021/04/07",
                },
            ],
            loading: false,
        };
    },
    created() {
        registerCallback("chooseLine2", this.wsCallbackOK);
        if (sessionStorage.getItem("table")) {
            this.tableData = JSON.parse(sessionStorage.getItem("table"));
        }
    },
    mounted() {
        let wsdata = getPackage(130, null);
        sendSock(wsdata);
        // window.choseLine = this.choseLine;
        // tctSubway = new tct_subway({
        //     tmpId: 'subway',
        //     fullload:false
        // })
        // this.$message({
        //     message: '点击线路名称进入项目',
        //     type: 'warning',
        //     duration:4000
        // });
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
            console.log(this.curName);
            window.sessionStorage.setItem("currentLine", this.curName);
            this.$store.commit("setCurrentLine", this.curName);
            this.$router.push({ path: "emergency/trainrun" || "emergency/trainrun" });
            // this.$router.push({ path: "line" || "line" });
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
                        path: "emergency/trainrun" || "emergency/trainrun",
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
        choseLine(info){
            this.$confirm('进入地铁' + info + '号线？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.jump()
            }).catch(() => {
                      
            });
        },
        formatter(row, column) {
            return row.address;
        },
        del(cow) {
            var self = this;
            var wsdata = {
                msgId: 1,
                msgType: 129,
                requestId: "12345678",
                session: this.$getCurrentDate(),
                timestamp: this.$getCurrentDate(),
                data: {
                    operationType: "",
                    oldLineName: "",
                    newLineName: "",
                },
            };
            wsdata.data.operationType = 3;
            wsdata.data.oldLineName = this.tableData[cow.$index].name;

            this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.loading = true;
                    this.ws.sendSock(wsdata, (res) => {
                        if (res.data && res.msgType == 229) {
                            if (res.data.Status == 1) {
                                self.loading = false;
                                self.tableData.splice(cow.$index, 1);
                                window.sessionStorage.setItem(
                                    "table",
                                    JSON.stringify(this.tableData)
                                );
                                self.$message({
                                    type: "success",
                                    message: "删除成功!",
                                });
                            } else {
                                self.$message({
                                    type: "info",
                                    message: res.data.strStatus,
                                });
                                self.loading = false;
                            }
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        add(cow) {
            var self = this;
            var date = new Date();
            var wsdata = {
                msgId: 1,
                msgType: 129,
                requestId: "12345678",
                session: this.$getCurrentDate(),
                timestamp: this.$getCurrentDate(),
                data: {
                    operationType: "",
                    oldLineName: "",
                    newLineName: "",
                },
            };

            this.loading = true;

            if (cow) {
                wsdata.data.operationType = 2;
                wsdata.data.oldLineName = cow.name;

                this.$prompt("请输入新线路名称", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                    inputPattern: /\S/,
                    inputErrorMessage: "格式不正确",
                })
                    .then(({ value }) => {
                        wsdata.data.newLineName = value;
                        setAjax(value);
                        this.$message({
                            type: "success",
                            message: "你的新线路是: " + value,
                        });
                    })
                    .catch(() => {
                        self.loading = false;
                        this.$message({
                            type: "info",
                            message: "取消复制",
                        });
                    });
            } else {
                wsdata.data.operationType = 1;
                wsdata.data.oldLineName = "";
                wsdata.data.newLineName = this.addName;
                setAjax();
            }
            function setAjax(value) {
                self.ws.sendSock(wsdata, (res) => {
                    if (res.data && res.msgType == 229) {
                        if (res.data.Status == 1) {
                            if (cow) {
                                self.tableData.push({
                                    index: self.tableData.length + 1,
                                    name: value,
                                    c_time: date.toLocaleDateString(),
                                    change_time: date.toLocaleDateString(),
                                });
                            } else {
                                if (self.addName != "") {
                                    self.tableData.push({
                                        index: self.tableData.length + 1,
                                        name: self.addName,
                                        c_time: date.toLocaleDateString(),
                                        change_time: date.toLocaleDateString(),
                                    });
                                }
                            }
                            self.loading = false;
                            window.sessionStorage.setItem(
                                "table",
                                JSON.stringify(self.tableData)
                            );
                        } else {
                            self.$message({
                                type: "info",
                                message: res.data.strStatus,
                            });
                            self.loading = false;
                        }
                    }
                });
            }
        },
        jump(data) {
            window.sessionStorage.setItem("currentLine", data.name);
            this.$store.commit("setCurrentLine", data.name);
            this.$router.push({ path: "emergency/trainrun" || "emergency/trainrun" });
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
    color: #000;
    /* background: url(../assets/basie/loginbg.jpg) no-repeat center center;
    background-size: 100% 100%;
    position: relative;
    animation: myfirst 30s linear infinite;
    margin-right: auto;
    margin-left: auto; */
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
    color: #000;
}

.project {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 40vh;
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
#subway{width: 100%;height:100vh;}

.main{background: #e6ecf2;}
.main .inputDiv {
    width: 1022px;
    margin: 0 auto;
    padding: 20px 0;
}
.main .inputDiv .input {
    width: 700px;
    height: 64px;
    background: url(../assets/basie/input.jpg) no-repeat 15px center #fff;
    border-radius: 32px;
    display: inline-block;
    font-size: 30px;
    padding: 0 20px 0 50px;
}
.main .inputDiv span {
    width: 280px;
    height: 64px;
    line-height: 64px;
    border-radius: 32px;
    background: #0780e8;
    color: #fff;
    font-size: 30px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
}
.main .inputDiv p {
    color: #ccc;
    font-size: 12px;
    padding: 10px 0 0 40px;
}
.mainB{height: 40vh;overflow: hidden;}

.choseline{height: 60vh;margin: 0 auto;display: block;width: 100%;text-align: center;background: #fff;}
.choseline img{height: 60vh;}
</style>
