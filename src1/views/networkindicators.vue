<template>
    <div class="networkindicators clearfix">
        <h2>线网指标查看</h2>
        <el-card class="box-card">
            <ul>
                <li>进站量告警:</li>
                <li>车站滞留人数告警:</li>
                <li>站台滞留超过一次告警:</li>
                <li>分方向换乘预测预警:</li>
                <li>列车在区间满载率:</li>
                <li>列车满载率告警:</li>
                <li>线路拥挤度:</li>
                <li>站台拥挤度:</li>
            </ul>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "networkindicators",
    data() {
        return {
            
        };
    },
    created() {

    },
    updated() {

    },
    mounted() {
    },
    methods: {
        
    },
    beforeDestroy() {
    },
};
</script>

<style scoped>
.networkindicators{padding: 10px;}
.networkindicators h2{font-size: 20px;padding: 0 0 15px 10px;}
.networkindicators ul li{line-height: 30px;}
</style>