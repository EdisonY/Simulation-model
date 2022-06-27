<template>
    <div class="dashboard-container line-details">
        <h2 class="line-details-title">线路基础</h2>
        <table class="line-details-table">
            <tr class="table-header">
                <td>折返能力</td>
                <td>区间能力</td>
                <td>首车时间</td>
                <td>末车时间</td>
                <td>线路长度</td>
            </tr>
            <tr>
                <td>287672</td>
                <td>243224</td>
                <td>05:30</td>
                <td>22:45</td>
                <td>54km</td>
            </tr>
        </table>
        <h2 class="line-details-title">车站设置</h2>
        <table class="line-details-table" style="width: 60%">
            <tr class="table-header">
                <td>车站序号</td>
                <td>车站代码</td>
                <td>车站名称</td>
            </tr>
            <tr>
                <td>01</td>
                <td>14232</td>
                <td>东直门</td>
            </tr>
            <tr>
                <td>01</td>
                <td>14232</td>
                <td>东直门</td>
            </tr>
        </table>
        <div class="position-box">
            <h2 class="line-details-title">交路设置</h2>
            <el-radio-group v-model="radio1" size="small" class="radio-box">
                <el-radio-button  label="东直门-->丰台科技园"></el-radio-button>
                <el-radio-button label="东直门-->海淀黄庄小交路"></el-radio-button>
            </el-radio-group>
        </div>

        <div class="select-box">
            <span>始发站：</span>
            <el-select v-model="departureStationValue" placeholder="请选择" size="small">
                <el-option
                        v-for="item in departureStationOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <span class="next-text">终点站：</span>
            <el-select v-model="destinationValue" placeholder="请选择" size="small">
                <el-option
                        v-for="item in destinationOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </div>
        <table class="line-details-table">
            <tr class="table-header">
                <td>车站序号</td>
                <td>车站代码</td>
                <td>车站名</td>
                <td>运营时间</td>
                <td>停站时间</td>
                <td>股道号</td>
                <td>股道编码</td>
            </tr>
            <tr>
                <td>01</td>
                <td>123</td>
                <td>东直门</td>
                <td>05:30-22:45</td>
                <td>1分钟</td>
                <td>023</td>
                <td>023</td>
            </tr>
            <tr>
                <td>02</td>
                <td>123</td>
                <td>丰台科技园</td>
                <td>05:30-22:45</td>
                <td>2分钟</td>
                <td>025</td>
                <td>12323</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "details",
        data(){
            return{
                radio1:'东直门-->丰台科技园',
                departureStationOptions: [{
                    value: '车站1',
                    label: '车站1'
                }],
                departureStationValue:'车站1',
                destinationOptions:[{
                    value: '车站2',
                    label: '车站2'
                }],
                destinationValue:'车站2'
            }
        }
    }
</script>

<style lang="scss">
    .calcH{height: calc(100vh - 50px);width: 98%;}
    .line-details{
        padding: 20px;
        font-size: 12px;
        .line-details-title{
            color: #575d6c;
            font-size: 18px;
            line-height: 30px;
            font-weight: bold;
        }
        .line-details-table{
            width: 100%;
            margin-top: 10px;
            margin-bottom: 30px;
            .table-header{
                td{
                    background: #f2f2f2;
                }
            }
            td{
                line-height: 36px;
                text-align: center;
                border: 1px solid #dbdbdb;
                color: #333;
            }
        }
        .position-box{
            position: relative;
            padding: 14px 0;
        }
        .radio-box{
            position: absolute;
            top: 14px;
            left: 100px;
            .el-radio-button__orig-radio:checked + .el-radio-button__inner{
                background-color: #526ecc;
                border-color: #526ecc;
                -webkit-box-shadow: -1px 0 0 0 #526ecc;
                box-shadow: -1px 0 0 0 #526ecc;
            }
            .el-radio-button:last-child .el-radio-button__inner{
                border-radius: 0 20px 20px 0;

            }
            .el-radio-button:first-child .el-radio-button__inner{
                border-radius: 20px 0px 0px 20px;
            }
        }
        .select-box{
            padding: 10px 0;
            span{
                margin-right: 10px;
            }
            .next-text{
                margin-left: 30px;
            }

        }
    }
</style>
