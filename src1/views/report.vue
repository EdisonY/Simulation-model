<template>
    <div class="report clearfix">
        <div class="left_new">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>操作</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">暂停</el-button> -->
                </div>
                <div style="display:flex;justify-content:center">
                    <!-- <el-radio v-model="radio2" label="1" border size="medium">1倍速</el-radio>
                    <el-radio v-model="radio2" label="2" border size="medium">2倍速</el-radio>
                    <el-radio v-model="radio2" label="3" border size="medium">4倍速</el-radio>
                    <el-radio v-model="radio2" label="4" border size="medium">最高速</el-radio> -->
                    <el-button type="primary">导出报告</el-button>
                </div>
            </el-card>
            <el-card class="box-card">
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
            </el-card>
        </div>
        <div class="right_report">
            <el-card class="box-card">
                <ul>
                    <li>晚点5分钟以上列数和车次：</li>
                    <li>停运列数：</li>
                    <li>掉线列数：</li>
                    <li>通过列数及车站：</li>
                    <li>中途折返及车站：</li>
                    <li>变更车次情况：</li>
                </ul>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: "report",
    data() {
        return {
            
        };
    },
    created() {
    },
    updated() {},
    mounted() {
    },
    methods: {
        
    },
    beforeDestroy() {
    },
};
</script>

<style scoped>
.report{padding: 10px 10px 0 0;display: flex;width: 100%;}
.left_new{flex:0 0 400px;}
.el-card {margin: 0 0 20px 10px;}
.el-card__body .el-radio--medium.is-bordered{padding:10px 10px 0 5px;margin:0 10px !important}
.report .right_report{flex-shrink: 2;width: 100%;}
.report .right_report .el-card{min-height: 600px;line-height: 25px;}
</style>