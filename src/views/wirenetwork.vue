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


                <!-- 开启热力图
                <el-switch
                    v-model="hotMap"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="hot">
                </el-switch>
                <br/>
                <br/> -->


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
                <!-- 实时仿真 -->
                列车位置
                <el-switch
                    v-model="realtime"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="realtimeSimulation">
                </el-switch>
                <br/>
                <br/>
                <!-- 线路状态
                <el-switch
                    v-model="lineState"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="lineStateChange">
                </el-switch>
                <br/>
                <br/>
                列车晚点状态
                <el-switch
                    v-model="lateState"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="lateStateChange">
                </el-switch>
                <br/>
                <br/> -->

                <!-- 历史回放
                <el-switch
                    v-model="historyrealtime"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
                <div class="wirenetElement" v-if="historyrealtime">
                    <el-time-picker
                        is-range
                        arrow-control
                        v-model="value2"
                        :clearable=false
                        :disabled="historyState != 0"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        width="200px"
                        placeholder="选择时间范围">
                    </el-time-picker>
                    <el-select v-model="speed" :disabled="historyState != 0" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <br/>
                    {{historyState}}
                    <el-button type="success" size="small" class="qidong" @click="historySimulation()" v-if="historyState == 0">启动</el-button>
                    <el-button type="warning" size="small" class="qidong" @click="pauseHistory()" v-if="historyState == 1">暂停</el-button>
                    <el-button type="success" size="small" class="qidong" @click="unpauseHistory()" v-if="historyState == 2">播放</el-button>
                    <el-button type="danger" size="small" class="qidong" @click="resetHistoryState()" v-if="historyState == 1 || historyState == 2">重置</el-button>
                </div> -->
                <!-- <br/>
                <br/> -->
                <!-- 集群：
                <router-link to="/emergency1/marshalling">
                    <el-button type="primary" size="mini">编辑</el-button>
                </router-link>
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
                <br/> -->
                <el-button type="primary" size="small" @click="dialogVisible = true">选择运行图</el-button>
                <el-button type="success" size="small" v-if="choseGap" @click="sim">开始仿真</el-button>
            </el-card>
        </div>
        <div class="Line" v-loading="loading">
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
        <div class="lineState">
            <ul>
                <li class="title_p"><span>颜色</span>状态</li>
                <li><span><i class="lv1"></i></span>正常</li>
                <li><span><i class="lv2"></i></span>未开通</li>
                <li><span><i class="lv3"></i></span>降级运行-拉大间隔</li>
                <li><span><i class="lv4"></i></span>停运</li>
            </ul>
        </div>
        <div class="time">{{time}}</div>
        <div class="history" style="display:none;">
            <i class="el-icon-video-play" @click="unpauseHistory()" v-if="!historyState"></i>
            <i class="el-icon-video-pause" @click="pauseHistory()" v-if="historyState"></i>
            <el-slider v-model="historyTime" :format-tooltip="formatTooltip" @change="changeTime()"></el-slider>
        </div>

        <el-dialog
        title="选择方案"
        :append-to-body="true"
        :visible.sync="dialogVisible"
        width="40%">
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="name"
                    align="center"
                    label="运行图/开行方案名称">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="success" size="mini" @click="choseGap = true, dialogVisible = false,choseGapData = scope.row.name">加载</el-button>
                    </template>
                    </el-table-column>
                </el-table>
        </el-dialog>

    </div>
</template>

<script>
var tctSubway = null
var realtimeOut = null
var fullRealt = 0
var historyOut = null
var historyNum = 0
var startTime = 0
var endTime = 0
var passengerMain = null

export default {
    name: 'wirenetwork',
    data () {
        return {
            loading:false,
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
            lineState:false,
            lateState:false,
            historyrealtime:false,
            historyState:0, //0 准备第一次启动 1 回放中 2 暂停
            historyTime:'',
            checkboxGroup:[],
            tmp:{
                hotMap:false,
                fullload:false,
                passenger:false,
                realtime:false,
                alarm:false,
            },
            time:'',
            value2:[new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
            options: [{
                value: '1',
                label: '1 X'
                },{
                value: '2',
                label: '2 X'
                },{
                value: '4',
                label: '4 X'
                },{
                value: '8',
                label: '8 X'
                }, 
            ],
            speed:'1',
            step:0,
            goneTime:'',
            timeZone:0,
            dialogVisible:false,
            zkDialog:false,
            tableData: [],
            choseGapData:'',
            choseGap:false,
            leftShow:true,
            legendShow:true,
            li:[{
                lb:'1号线',
                chose:false,
                color:'#C23A30',
                label:'1',
                lbx: "783",
                lby: "840"
            },{
                lb:'2号线',
                chose:false,
                color:'#006098',
                label:'2',
                lbx: "960",
                lby: "740"
            },{
                lb:'4号线大兴线',
                chose:false,
                color:'#008E9C',
                label:'4',
                lbx:"666",
                lby:"816"
            },{
                lb:'5号线',
                chose:false,
                color:'#A6217F',
                label:'5',
                lbx:"1065",
                lby:"620"
            },{
                lb:'6号线',
                chose:false,
                color:'#D29700',
                label:'6',
                lbx:"1134",
                lby:"728"
            },{
                lb:'7号线',
                chose:false,
                color:'#f6c582',
                label:'7',
                lbx:"1110",
                lby:"867"
            },{
                lb:'8号线',
                chose:false,
                color:'#009B6B',
                label:'8',
                lbx:"875",
                lby:"720"
            },{
                lb:'9号线',
                chose:false,
                color:'#8FC31F',
                label:'9',
                lbx:"590",
                lby:"840"
            },{
                lb:'10号线',
                chose:false,
                color:'#009BC0',
                label:'10',
                lbx:"885",
                lby:"760"
            },{
                lb:'11号线',
                chose:false,
                color:'#ed796b',
                label:'11',
                lbx:"370",
                lby:"800"
            },{
                lb:'13号线',
                chose:false,
                color:'#F9E700',
                label:'13',
                lbx:"960",
                lby:"520"
            },{
                lb:'14号线',
                chose:false,
                color:'#D5A7A1',
                label:'14',
                lbx:"850",
                lby:"580"
            },{
                lb:'15号线',
                chose:false,
                color:'#5B2C68',
                label:'15',
                lbx:"1274",
                lby:"380"
            },{
                lb:'16号线',
                chose:false,
                color:'#76A32E',
                label:'16',
                lbx:"500",
                lby:"300"
            },{
                lb:'17号线',
                chose:false,
                color:'#00a9a9',
                label:'17',
                lbx:"1255",
                lby:"1050"
            },{
                lb:'19号线',
                chose:false,
                color:'#d6abc1',
                label:'19',
                lbx:"800",
                lby:"790"
            },{
                lb:'房山线',
                chose:false,
                color:'#E46022',
                label:'95',
                lbx:"390",
                lby:"1100"
            },{
                lb:'昌平线',
                chose:false,
                color:'#DE82B2',
                label:'94',
                lbx:"770",
                lby:"300"
            },{
                lb:'亦庄线',
                chose:false,
                color:'#E40077',
                label:'96',
                lbx:"1225",
                lby:"1050"
            },{
                lb:'燕房线',
                chose:false,
                color:'#E46022',
                label:'92',
                lbx:"390",
                lby:"1100"
            },{
                lb:'S1线',
                chose:false,
                color:'#B35A20',
                label:'91',
                lbx:"370",
                lby:"800"
            },{
                lb:'西郊线',
                chose:false,
                color:'#E50619',
                label:'89',
                lbx:"380",
                lby:"560"
            },{
                lb:'首都机场线',
                chose:false,
                color:'#A29BBB',
                label:'98',
                lbx:"1360",
                lby:"530"
            },{
                lb:'大兴机场线',
                chose:false,
                color:'#004A9F',
                label:'88',
                lbx:"860",
                lby:"1200"
            },{
                lb:'亦庄T1线',
                chose:false,
                color:'#e5061b',
                label:'79',
                lbx:"1100",
                lby:"1100"
            }],
            alarm:false
        }
    },
    created () {
        var self = this
        this.$api.get('/api/ntms/graph/list').then(res => {             
            for (let index = 0; index < res.graph.length; index++) {
                self.tableData.push({})
                self.tableData[index].xuhao = index + 1
                self.tableData[index].name = res.graph[index]
            }
        })

        this.$api.get('/api/ntms/query/stationControl/' + self.realtimeFormat()).then(res => {             
            console.log(res);
        })

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

        $('.szk').click(function(){
            alert(1111)
        })


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

            tctSubway.openFullLoad(false)

            // console.log(tctSubway.getPosition('草桥'));
         
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
        window.handleClickFun= this.handleClickFun;
        window.handleClickZKFun= this.handleClickZKFun;
    },
    methods:{
        realtimeFormat(){
            var time = new Date()
            // return (time.getHours() - 2) * 3600 + time.getMinutes() * 60 + time.getSeconds()
            return 6 * 3600 + time.getMinutes() * 60 + time.getSeconds()
        },
        formatTooltip(val){
            //2h 120m 7200s
            function secTotime(s){
                var t = '';
                if(s > -1){
                    var hour = Math.floor(s/3600)
                    var min = Math.floor(s/60) % 60
                    var sec = s % 60
                    if(hour < 10) {
                        t = '0'+ hour + ":"
                    } else { 
                        t = hour + ":"
                    } 
                    if(min < 10){
                        t += "0"
                    } 
                    t += min + ":"
                    if(sec < 10){
                        t += "0"
                    } 
                    t += sec.toFixed(0)
                } 
                return t
            }
            return secTotime(parseInt(this.timeZone * (val / 100)) + startTime);
        },
        hot(){
            var self = this
            this.clearAll()
            if(this.hotMap){
                setTimeout(() => {
                    $('.heatmap').show()
                    for (let index = 0; index < HeatMapStation.length; index++) {
                        tctSubway.drewHeatmap(tctSubway.getPosition(HeatMapStation[index].station),HeatMapStation[index].value)
                    }
                    self.clusterWatch()
                }, 200);
            }
        },
        full(){
            var self = this
            this.clearAll()
            if(this.fullload){
                tctSubway.openFullLoad(true)
                tctSubway.showLess2()

                function getFull(){
                    self.$api.get('/api/ntms/query/train/' + self.realtimeFormat()).then(res => { 
                        for (let index = 0; index < res.trains.length; index++) {
                            if(res.trains[index].position.split('-').length > 1){
                                tctSubway.loadRateMultiply(
                                    tctSubway.codeStation(res.trains[index].position.split('-')[0]),
                                    tctSubway.codeStation(res.trains[index].position.split('-')[1]),
                                    res.trains[index].loadRate,                                
                                )
                            }
                        }
                    })
                    fullRealt = setTimeout(getFull,30000)
                }
                getFull()
            }else{
                tctSubway.resetMultiply()
                clearTimeout(fullRealt)
            }
        },
        passengerflow(){
            this.clearAll()
            var self = this
            if(this.passenger){
                $('#normal,#stationPoint').css('opacity','0.2')
                tctSubway.showLess()
                this.clusterWatch()
                $('.passenger').show()
                
                function getPassenger(){
                        self.$api.get('/api/ntms/query/station/' + self.realtimeFormat()).then(res => { 
                            $('#Passengerflow').empty()
                            var lv = 0
                            for (let index = 0; index < res.stations.length; index++) {
                                if(res.stations[index].loadRate < 30){
                                    lv = 0
                                }else if(res.stations[index].loadRate >= 30 && res.stations[index].loadRate < 60){
                                    lv = 1
                                }else if(res.stations[index].loadRate >= 60 && res.stations[index].loadRate < 90){
                                    lv = 2
                                }else if(res.stations[index].loadRate >= 90){
                                    lv = 3
                                }
                                if(tctSubway.codeStation(res.stations[index].stationID).name){
                                    tctSubway.stopNormail(tctSubway.getPosition(tctSubway.codeStation(res.stations[index].stationID).name),lv)
                                }
                            }
                            self.$api.get('/api/ntms/query/stationControl/' + self.realtimeFormat()).then(res => { 
                                
                                for (let index = 0; index < res.length; index++) {
                                    for (let i = 0; i < res[index].controlList.length; i++) {
                                        tctSubway.drewAlarm(tctSubway.getPosition(tctSubway.codeStation(res[index].stationCode).name),res[index].controlList[i])
                                    }
                                }
                            })
                        })
                    passengerMain = setTimeout(getPassenger,60000)
                }
                getPassenger()
            }else{
                $('#Passengerflow').empty()
                clearTimeout(passengerMain)
            }
        },
        stationAlarm(){
            this.clearAll()
            if(this.alarm){
                $('#normal,#stationPoint').css('opacity','0.2')
                tctSubway.showLess()
                this.clusterWatch()
                $('.alarm').show()
                tctSubway.drewStationAlarm(tctSubway.getPosition('西直门'),14)
            }else{
                this.clearAll()
            }
        },
        clusterWatch(){
            if(this.checkboxGroup.length == 0) {
                $('#subway .cluster').show()
                $('#subway').removeClass('clusterTrue')
                return false;
            }
            $('#subway').addClass('clusterTrue')
            $('#subway .cluster').hide()
            for (let index = 0; index < this.checkboxGroup.length; index++) {
                $('#subway .cluster.' + this.checkboxGroup[index]).show()
            }

        },
        historySimulation(time){

            tctSubway.openFullLoad(true)
            $('.time').show()
            $('.wirenetwork .fullLoadBtn').hide()
            $('#fullLoad,#stationPoint').css('opacity','0.4')

            startTime = this.value2[0].getHours() * 3600 + this.value2[0].getMinutes() * 60 + this.value2[0].getSeconds()
            endTime = this.value2[1].getHours() * 3600 + this.value2[1].getMinutes() * 60 + this.value2[1].getSeconds()

            this.historyTime = 0
            this.timeZone = endTime - startTime
            this.historyState = 1
            
            $('.time').show()            

            this.step = 100 / this.timeZone * this.speed

            this.HistoryComply()
        },
        pauseHistory(){
            tctSubway.pause()
            this.historyState = 2
            clearTimeout(historyOut)
        },
        unpauseHistory(){
            var self = this
            tctSubway.unpause()
            this.historyState = 1
            this.HistoryComply()
        },
        HistoryComply(){
            var self = this
            function history() {
                historyNum++
                self.historyTime += self.step
                
                self.goneTime = self.formatTooltip(self.historyTime)
                const hisTime = startTime + self.speed * historyNum
                historyOut = setTimeout(history,1000)

                // if(historyNum % 5 == 0 || historyNum == 1){
                var tmpNumber = 0
                self.$api.get('/api/ntms/query/train/' + hisTime).then(res => { 
                    $('#alarm,#stop').empty()
                    for (let index = 0; index < res.trains.length; index++) {
                        if(res.trains[index].position.split('-').length > 1){
                            //测试截取片段
                            // if(tmpNumber > 10) return false
                            //测试截取片段
                            // console.log(res.trains[index]);
                            tctSubway.drewRunning(
                                tctSubway.codeStation(res.trains[index].position.split('-')[0]),
                                tctSubway.codeStation(res.trains[index].position.split('-')[1]),
                                '' + res.trains[index].line + res.trains[index].tripNo,
                                res.trains[index].locRate,
                                res.trains[index].arriveSeconds,
                                res.trains[index].direction,                                    
                            )
                        }else{
                            if(tmpNumber == 0){
                                tctSubway.clearStop()
                            }
                            tctSubway.drewStop(
                                tctSubway.codeStation(res.trains[index].position),
                                '' + res.trains[index].line + res.trains[index].tripNo,
                                res.trains[index].line,
                            )
                            tmpNumber++
                        }
                    }
                })
                // }


            }
            history()
        },
        resetHistoryState(){
            historyNum = 0
            this.historyState = 0
            this.historyTime = 0
            this.goneTime = ''
            $('#alarm,#stop').empty()
            clearTimeout(historyOut)
        },
        changeTime(){
            console.log(this.historyTime/this.step+startTime);
            $('#alarm,#stop').empty()
            var time = this.historyTime / this.step + startTime
            this.$api.get('/api/ntms/query/train/' + time).then(res => { 
                for (let index = 0; index < res.trains.length; index++) {
                    if(res.trains[index].position.split('-').length > 1){
                        tctSubway.drewRunning(
                            tctSubway.codeStation(res.trains[index].position.split('-')[0]),
                            tctSubway.codeStation(res.trains[index].position.split('-')[1]),
                            res.trains[index].tripNo,
                            res.trains[index].locRate,
                            res.trains[index].arriveSeconds,
                            res.trains[index].direction,                                    
                        )
                    }
                }
            })
        },
        realtimeSimulation(){
            this.clearAll()
            var self = this
            // realtimeNum = 0
            
            if(this.realtime){
                
                this.fullload = false

                tctSubway.openFullLoad(true)
                // tctSubway.showLess()

                $('.time').show()
                $('.wirenetwork .fullLoadBtn').hide()
            
                $('#fullLoad,#stationPoint').css('opacity','0.4')

                function getDateSim(){
                    var tmpNumber = 0
                    
                    self.$api.get('/api/ntms/query/train/' + self.realtimeFormat()).then(res => { 
                        $('#alarm,#stop').empty()
                        for (let index = 0; index < res.trains.length; index++) {
                            if(res.trains[index].position.split('-').length > 1){
                                //测试截取片段
                                // if(tmpNumber > 10) return false
                                //测试截取片段
                                // console.log(res.trains[index]);
                                tctSubway.drewRunning(
                                    tctSubway.codeStation(res.trains[index].position.split('-')[0]),
                                    tctSubway.codeStation(res.trains[index].position.split('-')[1]),
                                    '' + res.trains[index].line + res.trains[index].tripNo,
                                    res.trains[index].locRate,
                                    res.trains[index].arriveSeconds,
                                    res.trains[index].direction,                                    
                                )
                            }else{
                                if(tmpNumber == 0){
                                    tctSubway.clearStop()
                                }
                                tctSubway.drewStop(
                                    tctSubway.codeStation(res.trains[index].position),
                                    '' + res.trains[index].line + res.trains[index].tripNo,
                                    res.trains[index].line,
                                )
                                tmpNumber++
                            }
                        }
                        self.clearCluster()
                        
                    })

                    // realtimeNum++
                    // if(realtimeNum < RealTime.length){
                    //     realtimeOut = setTimeout(getDateSim,10000)
                    // }else{
                    //     console.log('结束仿真');
                    // }
                    realtimeOut = setTimeout(getDateSim,10000)
                }
                getDateSim()
            }else{
                clearTimeout(realtimeOut)
            }
        },
        lineStateChange(){
            this.clearAll()
            if(this.lineState){
                $('.lineState').show()
            }
        },
        lateStateChange(){
            this.clearAll()
            if(this.lateState){
                $('.lateState').show()
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
            if(num == 7){
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
                }else if(self.lineState){
                    self.tmp.lineState = true
                }else if(self.lateState){
                    self.tmp.lateState = true
                }else if(self.alarm){
                    self.tmp.alarm = true
                }
            }

            $('#HeatMap').empty()
            $('.heatmap').hide()

            $('#normal,#stationPoint').css('opacity','1')
            $('#Passengerflow').empty()
            $('#stop').empty()
            $('.passenger').hide()

            $('#fullLoad').css('opacity','1')
            $('#alarm').empty()

            $('.lineState').hide()

            $('.lateState').show()
            
            $('.time').hide()
            $('#alarMain').empty()
            $('.alarm').hide()
            
            tctSubway.openFullLoad(false)

            tctSubway.showNormal()

            clearTimeout(realtimeOut)

            tctSubway.resetMultiply()
            
            historyNum = 0
            this.historyState = 0
            this.historyTime = 0
            this.goneTime = ''
            clearTimeout(historyOut)
            
        },
        clearCluster(){
            var num = 0
            for (let index = 0; index < this.li.length; index++) {
                if(this.li[index].chose){
                    console.log(this.li[index]);
                    $('#subway .cluster').hide()
                    $('#subway .cluster.' + this.li[index].label).show()
                }
            }
        },
        sim(){
            
            this.$api.post('/api/ntms/graph/sim',this.choseGapData).then(res => {             
                switch (res.status) {
                    case 0:
                        this.$message.error('启动失败');
                    break;
                    case 1:
                        this.$message({
                            message: '启动成功',
                            type: 'success'
                        });
                    break;
                    case 2:
                        this.$message.error('未找到运行图');
                    break;
                    case 3:
                        this.$message('已在运行');
                    break;
                
                }
            })
        },
        handleClickFun(info){
            this.$confirm('点击确定将带您进入 ' + (info.stationName ? info.stationName : info.sdata) + ' 站相关页面', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '正在跳转...'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '用户取消操作!'
                });          
            });
        },
        handleClickZKFun(info){
            this.zkDialog = true
        },
        choseLineInLegend(item){
            if(item.chose){
                $('#subway .cluster').show()
                $('#subway').removeClass('clusterTrue')
                tctSubway._resize()
            }else{
                for (let index = 0; index < this.li.length; index++) {
                    this.li[index].chose = false
                }
                $('#subway').addClass('clusterTrue')
                $('#subway .cluster').hide()
                $('#subway .cluster.' + item.label).show()
                tctSubway._getCenterLine(item)
            }
            item.chose = !item.chose
        }
    }
}
</script>
<style scoped>
.wirenetwork{padding: 10px;background:#000;height:calc(100vh - 60px);overflow: hidden;position: relative;}
/* #subway{width: 100%;height:calc(100vh - 76px);} */
.Line{width:100%;height:100%;z-index: 2;}
#subway{width: 3000px;height:3000px;}
#ddd{width: 200px;height: 200px;position: fixed;right: 0;top: 0;}

.wirenetwork .left_new{flex:0 0 400px;position: absolute;left:0;top: 10px;z-index: 3;}
.wirenetwork .el-card {margin: 0 0 10px 10px;}
.wirenetwork .el-card__body .el-radio--medium.is-bordered{padding:10px 10px 0 5px;margin:0 10px !important}

.heatmap{position: fixed;right: 10px;bottom:10px;width: 50px;height: 100px;background-image:linear-gradient(rgb(255 0 0),rgb(255 254 0),rgb(9 255 0),rgb(0 201 255));;text-align: center;font-weight: bold;display: none;}
.heatmap .down{position: absolute;bottom: 0;left: 50%;transform: translate(-50%,0);}

.passenger,.lineState,.alarm{position: fixed;right: 20px;top:80px;color: #fff;display: none;}
.passenger li,.lineState li,.alarm li{height: 26px;line-height: 26px;text-align: center;margin-bottom: 5px;}
.passenger .title_p,.lineState .title_p,.alarm .title_p{font-weight: bold;}
.passenger li span,.lineState li span,.alarm li span{width: 60px;display: inline-block;float: left;height: 26px;line-height: 26px;}
.passenger li span i{width: 20px;height: 20px;border: 4px solid #fff;border-radius: 10px;display: inline-block;}
.passenger li span img,.alarm li span img{width: 20px;height: 26px;}
.passenger li span .lv1{border-color:#56fcf0}
.passenger li span .lv2{border-color:#facb10}
.passenger li span .lv3{border-color:#f56911}
.passenger li span .lv4{border-color:#f42419}
.lineState li span i{width: 30px;height: 4px;display: inline-block;vertical-align: middle;}
.lineState li span .lv1{background:#5bfc56}
.lineState li span .lv2{background:#a4a795}
.lineState li span .lv3{background:#f9d74e}
.lineState li span .lv4{background:#b43737}

#HeatMap{width: 100vw;height: 100vh;position: fixed !important;z-index: 2;display: none;}

.cluster{margin: 10px 0 0 0;}
.cluster label{margin: 0 0 10px 0;color: #fff;}
.time{position: fixed;right: 20px;top:80px;z-index: 3;color:#fff;font-size:40px;border:2px solid #fff;padding:0 10px;border-radius: 2px;width: 176px;text-align: center;font-family: 'lcdd';height: 50px;line-height: 46px;display: none;background: #000;}
.qidong{margin-top: 10px;}
.history{position: absolute;bottom: 20px;z-index: 3;width: 80%;color: #fff;left: 50%;transform: translate(-50%,0);}
.history:after{width: 100%;height: 100%;content: '';display: block;position: absolute;left:-20px;top: -10px;z-index: 1;background: #000;opacity: 0.6;border-radius: 8px;padding: 10px;box-sizing: content-box;border: 2px solid #fff;}
.history i{display: inline-block;width: 38px;height: 38px;font-size: 38px;cursor: pointer;float: left;vertical-align: middle;position: relative;z-index: 2;}
.history .el-slider{width: calc(100% - 130px);float: right;vertical-align: middle;margin-right:15px;z-index: 2;position: relative;}
.history strong{height: 38px;line-height: 38px;display: inline-block;float: left;margin-left: 10px;color: #fff;position: relative;z-index: 2;}

.wirenetElement{padding: 10px 0 0 0;}
.wirenetElement .el-range-editor.el-input__inner{width: 200px;vertical-align: middle;}
.wirenetElement .el-select{width: 80px;vertical-align: middle;}

.left_new .leftBtn,.legend .leftBtn{width: 2em;display: block; cursor: pointer;padding: 6px 4px;background: #1f2d3d;box-sizing: content-box;text-align: center;border:1px solid #fff;position: absolute;top: 1px;height: 28px;left:10px;border-radius: 4px;animation: all linear .3s;}
.left_new .openleftBtn{left: auto;border: none;right: 2px;}

.wirenetwork .legend{position: absolute;right: 20px;bottom: 20px;min-height: 40px;}
.wirenetwork .legend .el-card{margin: 0;}
.wirenetwork .legend ul{width: 524px;font-size: 14px;}
.wirenetwork .legend ul li{display: inline-block;width:100px;cursor: pointer;line-height: 22px;vertical-align: middle;padding: 0 0 0 4px;user-select:none;}
.wirenetwork .legend ul li:hover,.wirenetwork .legend ul .active{background: #546b88;}
.wirenetwork .legend ul li i{display: inline-block;width: 8px;height: 8px;vertical-align: middle;margin: 0 4px 0 0;}
.legend .leftBtn{width: 2em;top:0;left:auto;right:2px;bottom: 10px;}
.legend .leftBtn i{font-size: 14px;color: #fff;}
.legend .leftBtn.openleftBtn{border: none;top:1px}
.leftBtn:hover{background: #273a50;}

.szk{width: 100%;}

</style>
