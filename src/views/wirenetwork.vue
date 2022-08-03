<template>
    <div class="wirenetwork next">
        <div class="left_new" style="">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>操作</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">启动</el-button> -->
                </div>
                <!-- <el-button type="primary" size="small">导入线网客流</el-button>
                <el-button type="primary" size="small">导入运行图</el-button> -->
                开启热力图
                <el-switch
                    v-model="hotMap"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="hot">
                </el-switch>
                <br/>
                <br/>
                线路拥挤度
                <el-switch
                    v-model="fullload"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="full">
                </el-switch>
                <br/>
                <br/>
                进出站客流/站控措施
                <el-switch
                    v-model="passenger"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="passengerflow">
                </el-switch>
                <br/>
                <br/>
                实时仿真
                <el-switch
                    v-model="realtime"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="realtimeSimulation">
                </el-switch>
                <br/>
                <br/>
                集群：
                <div class="cluster">
                    <el-checkbox-group v-model="checkboxGroup" size="mini" @change="clusterWatch()">
                        <el-checkbox label="1" border>集群1</el-checkbox>
                        <el-checkbox label="2" border>集群2</el-checkbox>
                        <br/>
                        <el-checkbox label="6" border>集群3</el-checkbox>
                        <el-checkbox label="4" border>集群4</el-checkbox>
                        <br/>
                        <el-checkbox label="5" border>集群5</el-checkbox>
                    </el-checkbox-group>
                </div>
                
                <!-- <br/>
                <el-button type="success" size="small">开始仿真 / 暂停</el-button> -->
            </el-card>
            <!-- <el-card class="box-card">
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
            </el-card> -->
        </div>
        <div class="Line">
            <svg id="subway" xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>
        </div>
        <div class="heatmap">
            <span>1</span>
            <span class="down">0</span>
        </div>
        <div class="passenger">
            <ul>
                <li class="title_p"><span>颜色</span>进出站量/阀值</li>
                <li><span><i class="lv1"></i></span>10-29%</li>
                <li><span><i class="lv2"></i></span>30-60%</li>
                <li><span><i class="lv3"></i></span>60-90%</li>
                <li><span><i class="lv4"></i></span>>90%</li>
            </ul>
            <ul>
                <li class="title_p"><span>图标</span>站控措施</li>
                <li><span><img src="http://172.51.216.62:41005/subway/1.png" /></span>设立导流围栏</li>
                <li><span><img src="http://172.51.216.62:41005/subway/2.png" /></span>关闭部分进站闸机</li>
                <li><span><img src="http://172.51.216.62:41005/subway/3.png" /></span>CUC减缓售票速度</li>
            </ul>
        </div>
        <div class="time">{{time}}</div>
    </div>
</template>

<script>
var tctSubway = null
var mock = {
    trainInfoList:[
    {
        "lineCode": 10,
        "sectionCode": "1018-1019",
        "trainNo": "012397",
        "ciCode": "41012397",
        "sectionPercent": 16,
        "arriveSeconds": 100
    },
    {
        "lineCode": 150,
        "sectionCode": "15009-15010",
        "trainNo": "052234",
        "ciCode": "55052234",
        "sectionPercent": 16,
        "arriveSeconds": 217
    },
    {
        "lineCode": 10,
        "sectionCode": "1014-1015",
        "trainNo": "072398",
        "ciCode": "41072398",
        "sectionPercent": 100,
        "arriveSeconds": 0
    },
    {
        "lineCode": 50,
        "sectionCode": "5003-5002",
        "trainNo": "082308",
        "ciCode": "45082308",
        "sectionPercent": 95,
        "arriveSeconds": 4
    },
    {
        "lineCode": 131,
        "sectionCode": "13105-13104",
        "trainNo": "1198",
        "ciCode": "741198",
        "sectionPercent": 80,
        "arriveSeconds": 27
    },
    {
        "lineCode": 91,
        "sectionCode": "9111-9112",
        "trainNo": "1258",
        "ciCode": "751258",
        "sectionPercent": 92,
        "arriveSeconds": 13
    },
    {
        "lineCode": 130,
        "sectionCode": "13007-13008",
        "trainNo": "1283",
        "ciCode": "531283",
        "sectionPercent": 31,
        "arriveSeconds": 75
    },
    {
        "lineCode": 130,
        "sectionCode": "13005-13017",
        "trainNo": "1285",
        "ciCode": "531285",
        "sectionPercent": 33,
        "arriveSeconds": 60
    },
    {
        "lineCode": 130,
        "sectionCode": "13002-13003",
        "trainNo": "1287",
        "ciCode": "531287",
        "sectionPercent": 36,
        "arriveSeconds": 70
    },
    {
        "lineCode": 60,
        "sectionCode": "6032-6033",
        "trainNo": "1308",
        "ciCode": "461308",
        "sectionPercent": 100,
        "arriveSeconds": 0
    },
    {
        "lineCode": 60,
        "sectionCode": "6001-6030",
        "trainNo": "1309",
        "ciCode": "461309",
        "sectionPercent": 22,
        "arriveSeconds": 116
    },
    {
        "lineCode": 60,
        "sectionCode": "6006-6005",
        "trainNo": "1310",
        "ciCode": "461310",
        "sectionPercent": 9,
        "arriveSeconds": 78
    },
    {
        "lineCode": 60,
        "sectionCode": "6011-6010",
        "trainNo": "1311",
        "ciCode": "461311",
        "sectionPercent": 32,
        "arriveSeconds": 73
    },
    {
        "lineCode": 60,
        "sectionCode": "6017-6016",
        "trainNo": "1312",
        "ciCode": "461312",
        "sectionPercent": 100,
        "arriveSeconds": 0
    },
    {
        "lineCode": 10,
        "sectionCode": "1012-1010",
        "trainNo": "131402",
        "ciCode": "41131402",
        "sectionPercent": 68,
        "arriveSeconds": 71
    },
    {
        "lineCode": 80,
        "sectionCode": "8021-8020",
        "trainNo": "1479",
        "ciCode": "481479",
        "sectionPercent": 3,
        "arriveSeconds": 153
    },
    {
        "lineCode": 10,
        "sectionCode": "1003-1001",
        "trainNo": "181399",
        "ciCode": "41181399",
        "sectionPercent": 56,
        "arriveSeconds": 167
    },
    {
        "lineCode": 150,
        "sectionCode": "15012-15013",
        "trainNo": "202233",
        "ciCode": "55202233",
        "sectionPercent": 3,
        "arriveSeconds": 171
    },
    {
        "lineCode": 131,
        "sectionCode": "13110-13111",
        "trainNo": "2194",
        "ciCode": "742194",
        "sectionPercent": 56,
        "arriveSeconds": 91
    },
    {
        "lineCode": 131,
        "sectionCode": "13107-13108",
        "trainNo": "2196",
        "ciCode": "742196",
        "sectionPercent": 15,
        "arriveSeconds": 130
    },
    {
        "lineCode": 70,
        "sectionCode": "7029-7030",
        "trainNo": "2214",
        "ciCode": "472214",
        "sectionPercent": 27,
        "arriveSeconds": 91
    },
    {
        "lineCode": 70,
        "sectionCode": "7026-7027",
        "trainNo": "2215",
        "ciCode": "472215",
        "sectionPercent": 11,
        "arriveSeconds": 82
    },
    {
        "lineCode": 70,
        "sectionCode": "7023-7024",
        "trainNo": "2216",
        "ciCode": "472216",
        "sectionPercent": 100,
        "arriveSeconds": 0
    },
    {
        "lineCode": 70,
        "sectionCode": "7021-7022",
        "trainNo": "2217",
        "ciCode": "472217",
        "sectionPercent": 6,
        "arriveSeconds": 117
    },
    {
        "lineCode": 11,
        "sectionCode": "1112-1113",
        "trainNo": "2257",
        "ciCode": "772257",
        "sectionPercent": 14,
        "arriveSeconds": 73
    },
    {
        "lineCode": 11,
        "sectionCode": "1108-1109",
        "trainNo": "2258",
        "ciCode": "772258",
        "sectionPercent": 16,
        "arriveSeconds": 100
    },
    {
        "lineCode": 60,
        "sectionCode": "6018-6019",
        "trainNo": "2292",
        "ciCode": "462292",
        "sectionPercent": 90,
        "arriveSeconds": 12
    },
    {
        "lineCode": 60,
        "sectionCode": "6016-6017",
        "trainNo": "2293",
        "ciCode": "462293",
        "sectionPercent": 73,
        "arriveSeconds": 57
    },
    {
        "lineCode": 60,
        "sectionCode": "6014-6015",
        "trainNo": "2294",
        "ciCode": "462294",
        "sectionPercent": 100,
        "arriveSeconds": 0
    },
    {
        "lineCode": 60,
        "sectionCode": "6012-6013",
        "trainNo": "2295",
        "ciCode": "462295",
        "sectionPercent": 100,
        "arriveSeconds": 0
    },
    {
        "lineCode": 60,
        "sectionCode": "6010-6011",
        "trainNo": "2296",
        "ciCode": "462296",
        "sectionPercent": 75,
        "arriveSeconds": 26
    },
    {
        "lineCode": 130,
        "sectionCode": "13010-13009",
        "trainNo": "2296",
        "ciCode": "532296",
        "sectionPercent": 82,
        "arriveSeconds": 50
    },
    {
        "lineCode": 60,
        "sectionCode": "6008-6009",
        "trainNo": "2297",
        "ciCode": "462297",
        "sectionPercent": 100,
        "arriveSeconds": 0
    },
    {
        "lineCode": 130,
        "sectionCode": "13011-13010",
        "trainNo": "2297",
        "ciCode": "532297",
        "sectionPercent": 82,
        "arriveSeconds": 27
    },
    {
        "lineCode": 60,
        "sectionCode": "6006-6007",
        "trainNo": "2298",
        "ciCode": "462298",
        "sectionPercent": 67,
        "arriveSeconds": 35
    },
    {
        "lineCode": 130,
        "sectionCode": "13012-13011",
        "trainNo": "2298",
        "ciCode": "532298",
        "sectionPercent": 66,
        "arriveSeconds": 135
    },
    {
        "lineCode": 60,
        "sectionCode": "6004-6005",
        "trainNo": "2299",
        "ciCode": "462299",
        "sectionPercent": 23,
        "arriveSeconds": 92
    },
    {
        "lineCode": 40,
        "sectionCode": "4002-4001",
        "trainNo": "4403401",
        "ciCode": "444403401",
        "sectionPercent": 25,
        "arriveSeconds": 81
    },
    {
        "lineCode": 10,
        "sectionCode": "1008-1007",
        "trainNo": "461401",
        "ciCode": "41461401",
        "sectionPercent": 65,
        "arriveSeconds": 42
    },
    {
        "lineCode": 100,
        "sectionCode": "10024-10023",
        "trainNo": "501181385",
        "ciCode": "50501181385",
        "sectionPercent": 100,
        "arriveSeconds": 142
    },
    {
        "lineCode": 100,
        "sectionCode": "10023-10024",
        "trainNo": "501192393",
        "ciCode": "50501192393",
        "sectionPercent": 100,
        "arriveSeconds": 0
    },
    {
        "lineCode": 100,
        "sectionCode": "10027-10026",
        "trainNo": "501201386",
        "ciCode": "50501201386",
        "sectionPercent": 50,
        "arriveSeconds": 55
    },
    {
        "lineCode": 100,
        "sectionCode": "10020-10021",
        "trainNo": "501242394",
        "ciCode": "50501242394",
        "sectionPercent": 48,
        "arriveSeconds": 42
    },
    {
        "lineCode": 100,
        "sectionCode": "10030-10029",
        "trainNo": "501311387",
        "ciCode": "50501311387",
        "sectionPercent": 11,
        "arriveSeconds": 74
    },
    {
        "lineCode": 100,
        "sectionCode": "10016-10017",
        "trainNo": "501322395",
        "ciCode": "50501322395",
        "sectionPercent": 100,
        "arriveSeconds": 0
    },
    {
        "lineCode": 100,
        "sectionCode": "10013-10014",
        "trainNo": "501402396",
        "ciCode": "50501402396",
        "sectionPercent": 40,
        "arriveSeconds": 49
    },
    {
        "lineCode": 10,
        "sectionCode": "1020-1021",
        "trainNo": "562396",
        "ciCode": "41562396",
        "sectionPercent": 96,
        "arriveSeconds": 5
    },
    {
        "lineCode": 10,
        "sectionCode": "1005-1004",
        "trainNo": "581400",
        "ciCode": "41581400",
        "sectionPercent": 52,
        "arriveSeconds": 57
    },
    {
        "lineCode": 10,
        "sectionCode": "1010-1012",
        "trainNo": "612399",
        "ciCode": "41612399",
        "sectionPercent": 100,
        "arriveSeconds": 0
    }
    ]
}
var realtimeOut = null
var realtimeNum = 0
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
            },
            hotMap:false,
            fullload:false,
            passenger:false,
            realtime:false,
            checkboxGroup:[],
            tmp:{
                hotMap:false,
                fullload:false,
                passenger:false,
                realtime:false,
            },
            time:''
        }
    },
    created () {
        
    },
    mounted () {
        tctSubway = new tct_subway({
            tmpId: 'subway',
            fullload:false
        })

        var formatDate = function (date) {  
            var h = date.getHours();
            h=h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            var second=date.getSeconds();
            second=second < 10 ? ('0' + second) : second;
            return h + ':' + minute + ':' + second;
        };
        setInterval(() => {
            this.time = formatDate(new Date())
        },1000);

        console.log(RealTime);

        tctSubway.listener('loaded', function() {
            // tctSubway.showLine(self.value);

            //设置站台名称显示类型
            // tctSubway.stationName(1)
            //设置线路名称是否显示
            // tctSubway.lineName(true)
            //设置波形提示
            // tctSubway.stopNormail(tctSubway.getPosition('西直门'),1)
            // tctSubway.stopNormail(tctSubway.getPosition('平安里'),0)
            // tctSubway.stopNormail(tctSubway.getPosition('雍和宫'),2)

            tctSubway._generate('circle',{cx:'1142',cy:'792',r:'2',fill:"white"},'subwayMain')

            tctSubway.openFullLoad(false)

            for (let index = 0; index < mock.trainInfoList.length; index++) {
                return false
                tctSubway.drewRunning(
                    tctSubway.codeStation(mock.trainInfoList[index].sectionCode.split('-')[0]),
                    tctSubway.codeStation(mock.trainInfoList[index].sectionCode.split('-')[1]),
                    mock.trainInfoList[index].ciCode,
                    mock.trainInfoList[index].sectionPercent,
                    mock.trainInfoList[index].arriveSeconds
                )
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
        hot(){
            this.clearAll()
            if(this.hotMap){
                setTimeout(() => {
                    $('.heatmap').show()
                    for (let index = 0; index < HeatMapStation.length; index++) {
                        tctSubway.drewHeatmap(tctSubway.getPosition(HeatMapStation[index].station),HeatMapStation[index].value)
                    }
                }, 200);
            }
        },
        full(){
            this.clearAll()
            if(this.fullload){
                tctSubway.openFullLoad(true)
                tctSubway.showLess()

                tctSubway.loadRateMultiply(tctSubway.getPosition('西直门'),tctSubway.getPosition('鼓楼大街'),Number((Math.random(1)*100).toFixed(2)))
                tctSubway.loadRateMultiply(tctSubway.getPosition('积水潭'),tctSubway.getPosition('鼓楼大街'),Number((Math.random(1)*100).toFixed(2)))
                tctSubway.loadRateMultiply(tctSubway.getPosition('鼓楼大街'),tctSubway.getPosition('安定门'),Number((Math.random(1)*100).toFixed(2)))
                tctSubway.loadRateMultiply(tctSubway.getPosition('安定门'),tctSubway.getPosition('雍和宫'),Number((Math.random(1)*100).toFixed(2)))
                tctSubway.loadRateMultiply(tctSubway.getPosition('雍和宫'),tctSubway.getPosition('东直门'),Number((Math.random(1)*100).toFixed(2)))
                tctSubway.loadRateMultiply(tctSubway.getPosition('东直门'),tctSubway.getPosition('东四十条'),Number((Math.random(1)*100).toFixed(2)))
                tctSubway.loadRateMultiply(tctSubway.getPosition('东四十条'),tctSubway.getPosition('朝阳门'),Number((Math.random(1)*100).toFixed(2)))
                tctSubway.loadRateMultiply(tctSubway.getPosition('朝阳门'),tctSubway.getPosition('建国门'),Number((Math.random(1)*100).toFixed(2)))
                tctSubway.loadRateMultiply(tctSubway.getPosition('建国门'),tctSubway.getPosition('北京站'),Number((Math.random(1)*100).toFixed(2)))
                tctSubway.loadRateMultiply(tctSubway.getPosition('北京站'),tctSubway.getPosition('崇文门'),Number((Math.random(1)*100).toFixed(2)))
            }
        },
        passengerflow(){
            this.clearAll()
            if(this.passenger){
                $('#normal').css('opacity','0.4')
                tctSubway.stopNormail(tctSubway.getPosition('西直门'),1)
                tctSubway.stopNormail(tctSubway.getPosition('东直门'),0)
                tctSubway.stopNormail(tctSubway.getPosition('天安门东'),2)
                tctSubway.stopNormail(tctSubway.getPosition('白石桥南'),3)

                tctSubway.drewAlarm(tctSubway.getPosition('北海北'),1)
                tctSubway.drewAlarm(tctSubway.getPosition('前门'),2)
                tctSubway.drewAlarm(tctSubway.getPosition('南礼士路'),3)

                tctSubway.showLess()
                $('.passenger').show()
            }
        },
        clusterWatch(){
            if(this.checkboxGroup.length == 0) {
                $('#subway .cluster').show() 
                return false;
            }
            $('#subway .cluster').hide()
            for (let index = 0; index < this.checkboxGroup.length; index++) {
                $('#subway .cluster.' + this.checkboxGroup[index]).show()
            }
            // $('#HeatMap').empty()
            // $('.heatmap').hide()
            // this.hotMap = false
        },
        realtimeSimulation(){
            this.clearAll()
            realtimeNum = 0
            if(this.realtime){
                tctSubway.openFullLoad(true)
                tctSubway.showLess()
                $('.time').show()
                $('.wirenetwork .fullLoadBtn').hide()
                this.fullload = false

                $('#fullLoad').css('opacity','0.4')

                function getDateSim(){
                    for (let index = 0; index < RealTime[realtimeNum].trainInfoList.length; index++) {
                        tctSubway.drewRunning(
                            tctSubway.codeStation(RealTime[realtimeNum].trainInfoList[index].sectionCode.split('-')[0]),
                            tctSubway.codeStation(RealTime[realtimeNum].trainInfoList[index].sectionCode.split('-')[1]),
                            RealTime[realtimeNum].trainInfoList[index].ciCode,
                            RealTime[realtimeNum].trainInfoList[index].sectionPercent,
                            RealTime[realtimeNum].trainInfoList[index].arriveSeconds
                        )
                    }
                    realtimeNum++
                    if(realtimeNum < RealTime.length){
                        realtimeOut = setTimeout(getDateSim,30000)
                    }else{
                        console.log('结束仿真');
                    }
                }
                getDateSim()                
            }else{
                clearTimeout(realtimeOut)
            }
        },
        clearAll(){
            var num = 0
            var self = this
            for (const key in this.tmp) {
                if(!this.tmp[key]){
                    num++
                }
            }
            if(num == 4){
                getTrue()
            }else{
                for (const key in this.tmp) {
                    if(this.tmp[key]){
                        this[key] = false
                    }
                    this.tmp[key] = false
                }
                getTrue()
            }

            function getTrue(){
                if(self.hotMap){
                    self.tmp.hotMap = true
                }else if(self.fullload){
                    self.tmp.fullload = true
                }else if(self.passenger){
                    self.tmp.passenger = true
                }else if(self.realtime){
                    self.tmp.realtime = true
                }
            }

            $('#HeatMap').empty()
            $('.heatmap').hide()

            $('#normal').css('opacity','1')
            $('#Passengerflow').empty()
            $('.passenger').hide()

            $('#fullLoad').css('opacity','1')
            $('#alarm').empty()
            
            $('.time').hide()
            
            tctSubway.openFullLoad(false)
            tctSubway.showNormal()

            clearTimeout(realtimeOut)
            
        }
    }
}
</script>
<style scoped>
.wirenetwork{padding: 10px;background:#000;height:calc(100vh - 50px);overflow: hidden;}
/* #subway{width: 100%;height:calc(100vh - 76px);} */
#subway{width: 3000px;height:3000px;}
#ddd{width: 200px;height: 200px;position: fixed;right: 0;top: 0;}

.wirenetwork .left_new{flex:0 0 400px;position: absolute;left:0;top: 10px;z-index: 3;}
.wirenetwork .el-card {margin: 0 0 10px 10px;}
.wirenetwork .el-card__body .el-radio--medium.is-bordered{padding:10px 10px 0 5px;margin:0 10px !important}

.heatmap{position: fixed;right: 10px;bottom:10px;width: 50px;height: 100px;background-image:linear-gradient(rgb(255 0 0),rgb(255 254 0),rgb(9 255 0),rgb(0 201 255));;text-align: center;font-weight: bold;display: none;}
.heatmap .down{position: absolute;bottom: 0;left: 50%;transform: translate(-50%,0);}

.passenger{position: fixed;right: 20px;top:80px;color: #fff;display: none;}
.passenger li{height: 26px;line-height: 26px;text-align: center;margin-bottom: 5px;}
.passenger .title_p{font-weight: bold;}
.passenger li span{width: 60px;display: inline-block;float: left;height: 26px;line-height: 26px;}
.passenger li span i{width: 20px;height: 20px;border: 4px solid #fff;border-radius: 10px;display: inline-block;}
.passenger li span img{width: 20px;height: 26px;}
.passenger li span .lv1{border-color:#56fcf0}
.passenger li span .lv2{border-color:#facb10}
.passenger li span .lv3{border-color:#f56911}
.passenger li span .lv4{border-color:#f42419}

#HeatMap{width: 100vw;height: 100vh;position: fixed !important;z-index: 2;display: none;}

.cluster{margin: 10px 0 0 0;}
.cluster label{margin: 0 0 10px 0;color: #fff;}

.time{position: fixed;right: 20px;top:80px;z-index: 3;color:#fff;font-size:40px;border:2px solid #fff;padding:0 10px;border-radius: 2px;width: 176px;text-align: center;font-family: 'lcdd';height: 50px;line-height: 46px;display: none;background: #000;}
</style>
