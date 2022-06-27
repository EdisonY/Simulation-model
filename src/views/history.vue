<template>
    <div class="report clearfix">
        <div class="left_new">
            <!-- <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>操作</span>
                </div>
                <div style="display:flex;justify-content:center">
                    <el-button type="primary" size="small">导出报告</el-button>
                    <el-button type="primary" size="small">保存数据</el-button>
                </div>
            </el-card> -->
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
            <el-card class="box-card nobg">
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="xuhao"
                    align="center"
                    label="序号">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    align="center"
                    label="运行图/开行方案名称">
                    </el-table-column>
                    <el-table-column
                    prop="keliu"
                    align="center"
                    label="客流名称">
                    </el-table-column>
                    <el-table-column
                    prop="shijian"
                    align="center"
                    label="创建时间">
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
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: "report",
    data() {
        return {
            tableData: [{
            xuhao:1,
            shijian: '2022-05-02',
            keliu:'2022-05-02',
            name: '工作日',
            address: '上海市普陀区金沙江路 1518 弄'
            }, {
            xuhao:2,
            shijian: '2022-05-04',
            keliu:'2022-05-02',
            name: '工作日',
            address: '上海市普陀区金沙江路 1517 弄'
            }, {
            xuhao:3,
            shijian: '2022-05-01',
            keliu:'2022-05-02',
            name: '双休日',
            address: '上海市普陀区金沙江路 1519 弄'
            }, {
            xuhao:4,
            shijian: '2022-05-03',
            keliu:'2022-05-02',
            name: '工作日，双休日',
            address: '上海市普陀区金沙江路 1516 弄'
            }]
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