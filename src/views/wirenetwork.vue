<template>
    <div class="wirenetwork next">
        <div class="left_new" style="display:none;">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>操作</span>
                    <el-button style="float: right; padding: 3px 0" type="text">启动</el-button>
                </div>
                <el-button type="primary" size="small">导入线网客流</el-button>
                <el-button type="primary" size="small">导入运行图</el-button>
                <el-button type="success" size="small">开始仿真 / 暂停</el-button>
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
        
        <svg id="subway" xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>
    </div>
</template>

<script>
var tctSubway = null

export default {
    name: 'wirenetwork',
    data () {
        return {
            radio4:'1',
            labelPosition: 'right',
            formLabelAlign: {
                fault:'正常运行',
                name: '12004',
                region: '北京西站',
                type: '20分钟'
            }
        }
    },
    created () {
        
    },
    mounted () {
        tctSubway = new tct_subway({
            tmpId: 'subway',
            fullload:true
        })

        tctSubway.listener('loaded', function() {
            // tctSubway.showLine(self.value);

            tctSubway.stationName(1)
            tctSubway.lineName(true)


            tctSubway.stopNormail(tctSubway.getPosition('西直门'),1)
            // tctSubway.stopNormail(tctSubway.getPosition('平安里'),0)
            // tctSubway.stopNormail(tctSubway.getPosition('雍和宫'),2)

            for (let index = 0; index < 20; index++) {
                setTimeout(() => {
                    tctSubway.drewRunning(tctSubway.getPosition('北京西站'),tctSubway.getPosition('高楼金'),index * 2)
                    tctSubway.drewRunning(tctSubway.getPosition('杨庄'),tctSubway.getPosition('北海北'),index * 2)
                    tctSubway.drewRunning(tctSubway.getPosition('石厂'),tctSubway.getPosition('金安桥'),index * 2)
                    tctSubway.drewRunning(tctSubway.getPosition('张郭庄'),tctSubway.getPosition('西局'),index * 2)
                    tctSubway.drewRunning(tctSubway.getPosition('郭公庄'),tctSubway.getPosition('国家图书馆'),index * 2)
                    tctSubway.drewRunning(tctSubway.getPosition('北宫门'),tctSubway.getPosition('马家堡'),index * 2)
                    tctSubway.drewRunning(tctSubway.getPosition('积水潭'),tctSubway.getPosition('宣武门'),index * 2)
                    tctSubway.drewRunning(tctSubway.getPosition('天通苑'),tctSubway.getPosition('宋家庄'),index * 2)
                    tctSubway.drewRunning(tctSubway.getPosition('天桥'),tctSubway.getPosition('德茂'),index * 2)
                    tctSubway.drewRunning(tctSubway.getPosition('大钟寺'),tctSubway.getPosition('光熙门'),index * 2)
                    tctSubway.drewRunning(tctSubway.getPosition('陶然桥'),tctSubway.getPosition('来广营'),index * 2)
                    tctSubway.drewRunning(tctSubway.getPosition('六道口'),tctSubway.getPosition('石门'),index * 2)
                    tctSubway.drewRunning(tctSubway.getPosition('北安河'),tctSubway.getPosition('农大南路'),index * 2)
                    tctSubway.drewRunning(tctSubway.getPosition('高碑店'),tctSubway.getPosition('土桥'),index * 2)
                    tctSubway.drewRunning(tctSubway.getPosition('西红门'),tctSubway.getPosition('义和庄'),index * 2)
                    tctSubway.drewRunning(tctSubway.getPosition('苹果园'),tctSubway.getPosition('国贸'),index * 2)
                }, 1000);
                
            }
            

            // tctSubway.loadRateMultiply(tctSubway.getPosition('西直门'),tctSubway.getPosition('鼓楼大街'),Number((Math.random(1)*100).toFixed(2)))
            // tctSubway.loadRateMultiply(tctSubway.getPosition('积水潭'),tctSubway.getPosition('鼓楼大街'),Number((Math.random(1)*100).toFixed(2)))
            // tctSubway.loadRateMultiply(tctSubway.getPosition('鼓楼大街'),tctSubway.getPosition('安定门'),Number((Math.random(1)*100).toFixed(2)))
            // tctSubway.loadRateMultiply(tctSubway.getPosition('安定门'),tctSubway.getPosition('雍和宫'),Number((Math.random(1)*100).toFixed(2)))
            // tctSubway.loadRateMultiply(tctSubway.getPosition('雍和宫'),tctSubway.getPosition('东直门'),Number((Math.random(1)*100).toFixed(2)))
            // tctSubway.loadRateMultiply(tctSubway.getPosition('东直门'),tctSubway.getPosition('东四十条'),Number((Math.random(1)*100).toFixed(2)))
            // tctSubway.loadRateMultiply(tctSubway.getPosition('东四十条'),tctSubway.getPosition('朝阳门'),Number((Math.random(1)*100).toFixed(2)))
            // tctSubway.loadRateMultiply(tctSubway.getPosition('朝阳门'),tctSubway.getPosition('建国门'),Number((Math.random(1)*100).toFixed(2)))
            // tctSubway.loadRateMultiply(tctSubway.getPosition('建国门'),tctSubway.getPosition('北京站'),Number((Math.random(1)*100).toFixed(2)))
            // tctSubway.loadRateMultiply(tctSubway.getPosition('北京站'),tctSubway.getPosition('崇文门'),Number((Math.random(1)*100).toFixed(2)))

            // tctSubway.addFlyLine(tctSubway.getPosition('西直门'),[tctSubway.getPosition('积水潭'),tctSubway.getPosition('东四十条')],1)
        })
    },
    methods:{
        
    }
}
</script>
<style scoped>
.wirenetwork{padding: 10px;background:#000}
#subway{width: 100%;height:calc(100vh - 76px);}

.wirenetwork .left_new{flex:0 0 400px;position: absolute;left:0;top: 10px;}
.wirenetwork .el-card {margin: 0 0 10px 10px;}
.wirenetwork .el-card__body .el-radio--medium.is-bordered{padding:10px 10px 0 5px;margin:0 10px !important}
</style>,index
