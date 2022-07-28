<template>
    <div class="wireset clearfix">
        <!-- <div class="left_new">
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
        </div> -->
        <div class="right_report">
            <el-card class="box-card nobg">
                <el-table
                    :data="tableData"
                    border
                    stripe>
                    <el-table-column
                    prop="tuzu"
                    align="center"
                    label="运行图组">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" size="mini">加载</el-button>
                            <el-button type="danger" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table
                    :data="tableData"
                    border
                    stripe>
                    <el-table-column
                    prop="xianlu"
                    align="center"
                    label="线路">
                    </el-table-column>
                    <el-table-column
                    prop="tuzu"
                    align="center"
                    label="运行图组">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini">查询</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table
                    :data="tableData"
                    border
                    stripe>
                    <el-table-column
                    prop="yunxing"
                    align="center"
                    label="运行图">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="操作">
                        <template slot-scope="scope">
                            <el-button type="warning" size="mini">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: "wireset",
    data() {
        return {
            tableData: [{
                tuzu: '平日',
                xianlu: '1号线',
                yunxing: '平日运行图'
            },{
                tuzu: '周末',
                xianlu: '2号线',
                yunxing: '周末运行图'
            },{
                tuzu: '节假日',
                xianlu: '3号线',
                yunxing: '节假日运行图'
            },{
                tuzu: '保障日',
                xianlu: '4号线',
                yunxing: '保障日运行图'
            },{
                tuzu: '平日',
                xianlu: '5号线',
                yunxing: '平日运行图'
            },]
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
.wireset{padding: 10px 10px 0 0;display: flex;width: 100%;}
.left_new{flex:0 0 400px;}
.el-card {margin: 0 0 20px 10px;}
.el-card__body .el-radio--medium.is-bordered{padding:10px 10px 0 5px;margin:0 10px !important}
.wireset .right_report{flex-shrink: 2;width: 100%;}
.wireset .right_report .el-card{line-height: 25px;}
.wireset .el-table--border{margin: 0 10px;}

</style>