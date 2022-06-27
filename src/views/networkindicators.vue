<template>
    <div class="networkindicators clearfix">
        <h2>线网指标查看</h2>
        <el-card class="box-card nobg">
            
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                prop="date"
                label="对比指标">
                </el-table-column>
                <el-table-column
                prop="name"
                label="告警数量">
                </el-table-column>
                <el-table-column
                prop="address"
                label="告警持续时长">
                </el-table-column>
                <el-table-column
                prop="address1"
                label="告警位置">
                </el-table-column>
                <el-table-column
                prop="address2"
                label="告警持续时间">
                </el-table-column>
            </el-table>
            <br/>
            <el-button type="primary" size="small">导出报告</el-button>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "networkindicators",
    data() {
        return {
            tableData: [
                {
                    date: '进站量告警',
                    name: '1',
                    address: '5min',
                    address1:'2号航站楼',
                    address2:'22:53-22:58'
                },{
                    date: '车站滞留人数告警',
                    name: '2',
                    address: '9min',
                    address1:'3号航站楼',
                    address2:'22:56-23:05'
                },{
                    date: '站台滞留超过一次告警',
                    name: '17',
                    address: '5min',
                    address1:'3号航站楼',
                    address2:'22:53-22:58'
                },{
                    date: '分方向换乘预测预警',
                    name: '1',
                    address: '3min',
                    address1:'三元桥',
                    address2:'22:53-22:56'
                },{
                    date: '区间满载率',
                    name: '1',
                    address: '5min',
                    address1:'三元桥-3号航站楼',
                    address2:'22:53-22:58'
                },{
                    date: '列车满载率告警',
                    name: '1',
                    address: '5min',
                    address1:'L1001',
                    address2:'22:53-22:58'
                }
            ]
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