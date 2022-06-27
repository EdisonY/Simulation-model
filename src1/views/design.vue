<template>
    <div class="app-container design">
        <h2>北京首都机场线</h2>
        <ul>
            <li>
                <strong>运行图</strong>
                <el-select v-model="rungrapValue" placeholder="请选择">
                    <el-option
                    v-for="item in rungrapOtions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" @click="jump(1)">查看</el-button>
            </li>
            <li>
                <strong>客流</strong>
                <el-select v-model="pfbasicValue" placeholder="请选择">
                    <el-option
                    v-for="item in pfbasicOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" @click="jump(2)">查看</el-button>
            </li>
            <li>
                <strong>&nbsp;</strong>
                <el-button type="danger" @click="jump(0)">运行仿真</el-button>
            </li>
        </ul>
        <h3>当前线路简图</h3>
        <img src="../assets/basie/jiaolu.jpg" style="width:600px;" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            rungrapOtions: [{
                value: '0',
                label: '夏季平日运行图'
                }, {
                value: '1',
                label: '夏季周末运行图'
                }, {
                value: '2',
                label: '夏季节假日运行图'
            }],
            rungrapValue: '0',
            pfbasicOptions: [{
                value: '0',
                label: '2019-01-11'
                }, {
                value: '1',
                label: '2020-02-25'
                }, {
                value: '2',
                label: '2020-04-25'
            }],
            pfbasicValue: '0'
        }
    },
    computed:{

    },
    methods: {
        jump(index){
            var self = this
            switch (index) {
                case 0:
                    self.$router.push({ path: '/traincapacity/simulation' || '/traincapacity/simulation' })
                break;
                case 1:
                    self.$router.push({ path: '/program/rungraph' || '/program/rungraph' })
                break;
                case 2:
                    self.$router.push({ path: '/program/pfbasic' || '/program/pfbasic' })
                break;
                default:
                    // statements_def
                break;
            }
        }
    }
}
</script>

<style>
.design{font-size: 14px;height: calc(100vh - 50px);}
.design h2{font-size: 20px;}
.design h3{font-size: 18px;}
.design ul {padding-top: 60px;font-size: 16px;padding-bottom: 40px;}
.design ul li{padding: 0 0 40px 0;}
.design ul li strong{display: inline-block;width: 120px;text-align: right;padding-right: 10px;}
.design ul li .el-input__inner{width: 300px !important;}
</style>

