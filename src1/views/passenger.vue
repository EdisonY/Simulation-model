<template>
    <div class="passenger next">
        <h2>分时最大客流断面</h2>
        <div class="search">
            <el-button type="primary">客流加载</el-button>
            <p>
                <el-input placeholder="请输入内容"></el-input>
                <el-button type="success">搜索</el-button>
            </p>
        </div>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
            prop="date"
            label="日期">
            </el-table-column>
            <el-table-column
            prop="name"
            label="典型日">
            </el-table-column>
            <el-table-column
            prop="address"
            label="备注">
            </el-table-column>
        </el-table>
        <p class="text_r">
            <el-button type="success">确定</el-button>
        </p>
        <el-row>
            <el-col :span="10">
                <div class="yl">
                    <iframe frameborder="0" width="100%" height="300" src="http://172.51.216.61:8011/seabed/preview/70986fa19c404915accccfef982c9ce0"></iframe>
                </div>
            </el-col>
            <el-col :span="7">
                <div class="yl">
                    <iframe frameborder="0" width="100%" height="300" src="http://172.51.216.61:8011/seabed/preview/130263dd57a6419fb41e94a72bc14586"></iframe>
                </div>
            </el-col>
            <el-col :span="7">
                <div class="yl">
                    <iframe frameborder="0" width="100%" height="300" src="http://172.51.216.61:8011/seabed/preview/dc7cc8eeeb3b451293a227733723271e"></iframe>
                </div>
            </el-col>
        </el-row>
        

    </div>
</template>

<script>

export default {
    name: 'passenger',
    data () {
        return {
            tableData: [{
                date: '2016-05-02',
                name: '工作日',
                address: '历史使用者：张三'
                }, {
                date: '2016-05-04',
                name: '工作日',
                address: ''
                }, {
                date: '2016-05-01',
                name: '双休日',
                address: '历史使用者：张三'
                }, {
                date: '2016-05-03',
                name: '节假日',
                address: ''
            }]
        }
    },
    created () {
        
    },
    mounted () {
        
    },
    methods:{
        
    }
}
</script>
<style scoped>
.passenger{padding: 10px;}
.passenger .el-col {background: #eee;}
.passenger h2{font-size: 20px;}
.passenger .search{padding: 15px 0;}
.passenger .search p{float: right;}
.passenger .search p .el-input{display: inline-block;width: auto;}
.passenger .text_r{padding: 15px 0;text-align: right;}
</style>
