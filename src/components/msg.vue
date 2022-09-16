<template>
    <el-card class="box-card Msg">
        <div slot="header"
            class="clearfix">
            <span>消息</span>
        </div>
        <div style="text-align:left"> 
            <ul>
                <li v-for="(item,index) in msgData"
                    :key="index">
                    {{item}}
                </li>
            </ul>
        </div>
    </el-card>
</template>

<script>
import {
    registerCallback,
    unregisterCallback,
    sendSock,
    getPackage,
} from "@/utils/ws";

export default {
    name: "Msg",
    props: ["trainrun"],
    data() {
        return {
            msgData: [],
            data: [
                "打开运行图成功。。。。",
                "运行图名称：北京轨道交通验方线",
                "00:00:00 北京西站 发生紧急制动",
                "00:00:00 - 00:02:00 扣故障区外即将进入该控区相邻车站",
                "00:00:00 - 00:02:03 扣故障区外即将进入该控区相邻车站",
                "00:00:00 - 00:02:10 扣故障区外即将进入该控区相邻车站",
            ],
        };
    },
    created() {
        //MSG
        // let msgws = {
        //     msgType:144,
        //     data:'null'
        // }
        // setInterval(() => {
        //     sendSock(getPackage(144,'null'));
        // }, 1000);
    },
    mounted() {
        registerCallback("anykey", this.wsCallbackMsg);
        if (this.trainrun) {
            // 真实数据
        } else {
            this.data.forEach((i) => {
                this.msgData.push(i);
            });
        }
        // var self = this
        // setTimeout(() => {
        //     self.msgData.push(self.data[0])
        // }, 1000);
        // setTimeout(() => {
        //     self.msgData.push(self.data[1])
        // }, 4000);
        // setTimeout(() => {
        //     self.msgData.push(self.data[2])
        // }, 7000);
        // setTimeout(() => {
        //     self.msgData.push(self.data[3])
        // }, 10000);
        // setTimeout(() => {
        //     self.msgData.push(self.data[4])
        // }, 12000);
        // setTimeout(() => {
        //     self.msgData.push(self.data[5])
        // }, 17000);

    },
    methods: {
        wsCallbackMsg(data) {
            if (data.msgType == 244) {
                // this.msgData = this.msgData.concat(data.data.msg_content);
                this.msgData = data.data.msg_content;
            }
            // if (this.msgData && this.msgData.length > 50) {
            //     while (this.msgData.length > 50) {
            //         this.msgData.shift();
            //     }
            // }
        },
        getMessage(time) {
            sendSock(
                getPackage(144, {
                    begin_timestamp: 0,
                    end_timestamp: time + 5,
                    msg_type: 1,
                })
            );
        },
    },
};
</script>
<style>
.Msg ul {
    max-height: 200px;
    overflow-y: auto;
}
.Msg ul li {
    line-height: 20px;
    margin-bottom: 16px;
}
</style>

