<template>
    <div class="fault clearfix">
        <div class="left_new">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>操作</span>
                    <el-button style="float: right; padding: 3px 0" type="text">启动</el-button>
                </div>
                <div style="display:flex;justify-content:center">
                    <el-radio-group v-model="radio4" size="mini">
                        <el-radio label="1" border>正常运行</el-radio><br>
                        <el-radio label="2" border>单车延误（屏蔽门故障）</el-radio>
                        <el-radio label="3" border>单车降级（ATP故障）</el-radio>
                        <el-radio label="4" border>单车推出运营（PIS系统故障）</el-radio>
                        <el-radio label="5" border>多车延误（ZC故障）</el-radio>
                    </el-radio-group>
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
                <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
                    <el-form-item label="车次号">
                        <el-input v-model="formLabelAlign.name"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间">
                        <el-input v-model="formLabelAlign.region"></el-input>
                    </el-form-item>
                    <el-form-item label="持续时间">
                        <el-input v-model="formLabelAlign.type"></el-input>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: "report",
    data() {
        return {
            radio4:'1',
            labelPosition: 'right',
            formLabelAlign: {
                name: '12004',
                region: '9：05',
                type: '20分钟'
            }
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
.fault{padding: 10px 10px 0 0;display: flex;width: 100%;}
.left_new{flex:0 0 400px;}
.el-card {margin: 0 0 20px 10px;}
.el-card__body .el-radio--medium.is-bordered{padding:10px 10px 0 5px;margin:0 10px !important}
.fault .right_report{width: 100%;flex-shrink: 2;}
.fault .right_report .el-card{min-height: 600px;line-height: 25px;}

.fault .el-radio.is-bordered+.el-radio.is-bordered{margin-left: 0;}
.fault .el-radio--mini.is-bordered{margin-bottom: 10px;}
</style>