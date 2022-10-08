<template>
    <div class="trainNumber-box">
        <div class="table-container">
            <h3 class="table-title"
                id="page1"
                name="page1">
                首末班时间
                <el-button size="small"
                    v-if="!tableData1Edit"
                    @click="tableData1Edit=true">编辑</el-button>
                <el-button size="small"
                    v-if="tableData1Edit"
                    @click="tableData1Edit=false">保存</el-button>
            </h3>

            <el-table border
                :data="tableData1"
                style="width: 100%;">
                <el-table-column prop="upStation"
                    label="上行">
                    <template slot-scope="scope">
                        <span v-if="!tableData1Edit">{{scope.row.upStation}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.upStation"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="upFirstTrain"
                    label="首班车">
                    <template slot-scope="scope">
                        <span v-if="!tableData1Edit">{{scope.row.upFirstTrain}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.upFirstTrain"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="upLastTrain"
                    label="末班车">
                    <template slot-scope="scope">
                        <span v-if="!tableData1Edit">{{scope.row.upLastTrain}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.upLastTrain"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="downStation"
                    label="下行">
                    <template slot-scope="scope">
                        <span v-if="!tableData1Edit">{{scope.row.downStation}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.downStation"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="downFirstTrain"
                    label="首班车">
                    <template slot-scope="scope">
                        <span v-if="!tableData1Edit">{{scope.row.downFirstTrain}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.downFirstTrain"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="downLastTrain"
                    label="末班车">
                    <template slot-scope="scope">
                        <span v-if="!tableData1Edit">{{scope.row.downLastTrain}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.downLastTrain"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <h3 class="table-title"
                id="page2"
                name="page2">
                运行时间及等级
            </h3>
            <h3 class="table-title">
                2-1 区间运行等级
                <el-button size="small"
                    v-if="!tableData2Edit"
                    @click="tableData2Edit=true">编辑</el-button>
                <el-button size="small"
                    v-if="tableData2Edit"
                    @click="saveInfo('tableData2Edit')">保存</el-button>
            </h3>
            <el-table border
                :data="saveData.BasicData.runTimeLevelTable.runTimelevel"
                style="width: 100%;">
                <el-table-column type="index"
                    width="50">
                </el-table-column>
                <el-table-column prop="startStopArea"
                    label="车站"
                    :formatter="startStopAreaToCn"></el-table-column>
                <el-table-column prop="endStopArea"
                    label="车站"
                    :formatter="endStopAreaToCn"></el-table-column>
                <el-table-column :label="`运行时间${index+1}`"
                    :key="index"
                    v-for="(item, index) in saveData.BasicData.runTimeLevelTable.runTimelevel[0].runTimelevelRowCells">
                    <template slot-scope="scope">
                        <span v-if="!tableData2Edit">{{scope.row.runTimelevelRowCells[index].time}}</span>
                        <el-input v-else
                            size="small"
                            v-model.number="scope.row.runTimelevelRowCells[index].time"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <h3 class="table-title">
                2-2 车站站停等级
                <el-button size="small"
                    v-if="!tableData3Edit"
                    @click="tableData3Edit=true">编辑</el-button>
                <el-button size="small"
                    v-if="tableData3Edit"
                    @click="saveInfo('tableData3Edit')">保存</el-button>
            </h3>
            <el-table border
                :data="saveData.BasicData.runTimeLevelTable.stopTimelevel"
                style="width: 100%;">
                <el-table-column type="index"
                    width="50">
                </el-table-column>
                <el-table-column prop="stopAreaId"
                    :formatter="stopAreaIdToCn"
                    label="车站"></el-table-column>
                <el-table-column :label="`运行时间${index+1}`"
                    :key="index"
                    v-for="(item, index) in saveData.BasicData.runTimeLevelTable.runTimelevel[0].runTimelevelRowCells">
                    <template slot-scope="scope">
                        <span v-if="!tableData3Edit">{{scope.row.runTimelevelRowCells[index].time}}</span>
                        <el-input v-else
                            size="small"
                            v-model.number="scope.row.runTimelevelRowCells[index].time"></el-input>
                    </template>
                </el-table-column>
            </el-table>

            <h3 class="table-title">
                2-3 其它运行信息
                <el-button size="small"
                    v-if="!tableData4Edit"
                    @click="tableData4Edit=true">编辑</el-button>
                <el-button size="small"
                    v-if="tableData4Edit"
                    @click="tableData4Edit=false">保存</el-button>
            </h3>
            <el-table border
                :data="tableData4"
                style="width: 100%;">
                <el-table-column type="index"
                    width="50">
                </el-table-column>
                <el-table-column prop="stationA"
                    label="车站a"></el-table-column>
                <el-table-column prop="stationB"
                    label="车站b"></el-table-column>
                <el-table-column label="区间运行时间">
                    <template slot-scope="scope">
                        <span v-if="!tableData4Edit">{{scope.row.qujian}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.qujian"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="level1DownTime"
                    label="站停时间a">
                    <template slot-scope="scope">
                        <span v-if="!tableData4Edit">{{scope.row.stopTimeA}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.stopTimeA"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="downFirstTrain"
                    label="站停时间b">
                    <template slot-scope="scope">
                        <span v-if="!tableData4Edit">{{scope.row.stopTimeB}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.stopTimeB"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <h3 class="table-title"
                id="page3"
                name="page3">
                线路信息
                <el-button size="small"
                    v-if="!tableData5Edit"
                    @click="tableData5Edit=true">编辑</el-button>
                <el-button size="small"
                    v-if="tableData5Edit"
                    @click="tableData5Edit=false">保存</el-button>
            </h3>
            <img src="@/assets/basie/line-info.png"
                class="line-img"
                alt="">
            <el-table border
                :data="tableData5"
                style="width: 100%;">
                <el-table-column type="index"
                    width="50">
                </el-table-column>
                <el-table-column prop="currentStation"
                    label="车站a"></el-table-column>
                <el-table-column prop="nextStation"
                    label="车站b"></el-table-column>
                <el-table-column label="距离（上行）">
                    <template slot-scope="scope">
                        <span v-if="!tableData5Edit">{{scope.row.distanceUp}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.distanceUp"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="level1DownTime"
                    label="距离（下行）">
                    <template slot-scope="scope">
                        <span v-if="!tableData5Edit">{{scope.row.distanceDown}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.distanceDown"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <h3 class="table-title"
                id="page4"
                name="page4">
                交路设计（结合设定好的线路信息进行录入）
                <el-button size="small"
                    v-if="!tableData6Edit"
                    @click="tableData6Edit=true">编辑</el-button>
                <el-button size="small"
                    v-if="tableData6Edit"
                    @click="saveInfo('tableData6Edit')">保存</el-button>
            </h3>
            <el-table border
                :data="saveData.BasicData.routingTable.routingRows"
                style="width: 100%;">
                <el-table-column type="index"
                    width="50">
                </el-table-column>

                <el-table-column label="起始车站"
                    prop="startStopArea"
                    :formatter="startStopAreaToCn">

                </el-table-column>
                <el-table-column label="终到车站"
                    prop="endStopArea"
                    :formatter="endStopAreaToCn">

                </el-table-column>
                <el-table-column :label="`车站编号${index+1}`"
                    :key="index"
                    v-for="(item, index) in saveData.BasicData.routingTable.routingRows[0].routingRowCells">
                    <template slot-scope="scope">
                        <span v-if="!tableData6Edit">{{scope.row.routingRowCells[index]|stationToCn}}</span>
                        <el-input v-else
                            size="small"
                            v-model.number="scope.row.routingRowCells[index]"></el-input>
                    </template>
                </el-table-column>
                <!--                <el-table-column label="车站编号">-->
                <!--                    <template slot-scope="scope" >-->
                <!--                        <span v-if="!tableData6Edit">{{scope.row.routingRowCells}}</span>-->
                <!--                        <el-input v-else size="small" v-model="scope.row.routingRowCells"></el-input>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->
            </el-table>
            <h3 class="table-title"
                id="page5"
                name="page5">
                段场收发车限制
                <el-button size="small"
                    v-if="!tableData7Edit"
                    @click="tableData7Edit=true">编辑</el-button>
                <el-button size="small"
                    v-if="tableData7Edit"
                    @click="tableData7Edit=false">保存</el-button>
            </h3>
            <el-table border
                :data="tableData7"
                style="width: 100%;">
                <el-table-column prop="limitText"
                    label="项目"></el-table-column>
                <el-table-column label="限制参数">
                    <template slot-scope="scope">
                        <span v-if="!tableData7Edit">{{scope.row.limitValue}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.limitValue"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="remark"
                    label="备注"></el-table-column>
            </el-table>
            <h3 class="table-title"
                id="page6"
                name="page6">
                运用列车数限制
                <el-button size="small"
                    v-if="!tableData8Edit"
                    @click="tableData8Edit=true">编辑</el-button>
                <el-button size="small"
                    v-if="tableData8Edit"
                    @click="tableData8Edit=false">保存</el-button>
            </h3>
            <el-table border
                :data="tableData8"
                style="width: 100%;">
                <el-table-column prop="label"
                    label="项目"></el-table-column>
                <el-table-column label="限制参数">
                    <template slot-scope="scope">
                        <span v-if="!tableData8Edit">{{scope.row.value}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.value"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <h3 class="table-title"
                id="page7"
                name="page7">
                通行能力限制
            </h3>
            <h3 class="table-title">
                7-1 车站通行能力
                <el-button size="small"
                    v-if="!tableData9Edit"
                    @click="tableData9Edit=true">编辑</el-button>
                <el-button size="small"
                    v-if="tableData9Edit"
                    @click="tableData9Edit=false">保存</el-button>
            </h3>
            <el-table border
                :data="tableData9"
                style="width: 100%;">
                <el-table-column type="index"
                    width="50">
                </el-table-column>
                <el-table-column prop="station"
                    label="车站"></el-table-column>
                <el-table-column label="上行1">
                    <template slot-scope="scope">
                        <span v-if="!tableData9Edit">{{scope.row.up1}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.up1"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="上行3">
                    <template slot-scope="scope">
                        <span v-if="!tableData9Edit">{{scope.row.up3}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.up3"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="下行2">
                    <template slot-scope="scope">
                        <span v-if="!tableData9Edit">{{scope.row.down2}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.down2"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="下行4">
                    <template slot-scope="scope">
                        <span v-if="!tableData9Edit">{{scope.row.down4}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.down4"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <h3 class="table-title">
                7-2 区间通行能力
                <el-button size="small"
                    v-if="!tableData10Edit"
                    @click="tableData10Edit=true">编辑</el-button>
                <el-button size="small"
                    v-if="tableData10Edit"
                    @click="tableData10Edit=false">保存</el-button>
            </h3>
            <el-table border
                :data="tableData12"
                style="width: 100%;">
                <el-table-column type="index"
                    width="50">
                </el-table-column>
                <el-table-column prop="currentStation"
                    label="车站"></el-table-column>
                <el-table-column prop="nextStation"
                    label="车站"></el-table-column>
                <el-table-column label="上行">
                    <template slot-scope="scope">
                        <span v-if="!tableData10Edit">{{scope.row.up}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.up"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="下行">
                    <template slot-scope="scope">
                        <span v-if="!tableData10Edit">{{scope.row.down}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.down"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <h3 class="table-title">
                7-3 联络线通行能力
                <el-button size="small"
                    v-if="!tableData11Edit"
                    @click="tableData11Edit=true">编辑</el-button>
                <el-button size="small"
                    v-if="tableData11Edit"
                    @click="tableData11Edit=false">保存</el-button>
            </h3>
            <el-table border
                :data="tableData13"
                style="width: 100%;">
                <el-table-column type="index"
                    width="50">
                </el-table-column>

                <el-table-column label="联络线">
                    <template slot-scope="scope">
                        <span v-if="!tableData11Edit">{{scope.row.name}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.name"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="出段线">
                    <template slot-scope="scope">
                        <span v-if="!tableData11Edit">{{scope.row.value1}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.value1"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="入段线">
                    <template slot-scope="scope">
                        <span v-if="!tableData11Edit">{{scope.row.value2}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.value2"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <span v-if="!tableData11Edit">{{scope.row.remark}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.remark"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <h3 class="table-title"
                id="page8"
                name="page8">
                施工天窗限制
                <el-button size="small"
                    v-if="!tableData12Edit"
                    @click="tableData12Edit=true">编辑</el-button>
                <el-button size="small"
                    v-if="tableData12Edit"
                    @click="tableData12Edit=false">保存</el-button>
            </h3>
            <el-table border
                :data="tableData10"
                style="width: 100%;">
                <el-table-column prop="limitText"
                    label="项目"></el-table-column>
                <el-table-column label="限制参数">
                    <template slot-scope="scope">
                        <span v-if="!tableData12Edit">{{scope.row.limitValue}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.limitValue"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="remark"
                    label="备注"></el-table-column>
            </el-table>
            <h3 class="table-title"
                id="page9"
                name="page9">
                其它相关限制
                <el-button size="small"
                    v-if="!tableData13Edit"
                    @click="tableData13Edit=true">编辑</el-button>
                <el-button size="small"
                    v-if="tableData13Edit"
                    @click="tableData13Edit=false">保存</el-button>
            </h3>
            <el-table border
                :data="tableData11"
                style="width: 100%;">
                <el-table-column prop="label"
                    label="项目"></el-table-column>
                <el-table-column label="限制参数">
                    <template slot-scope="scope">
                        <span v-if="!tableData13Edit">{{scope.row.value}}</span>
                        <el-input v-else
                            size="small"
                            v-model="scope.row.value"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="remark"
                    label="备注"></el-table-column>
            </el-table>
            <el-button @click="saveInfo">保存</el-button>
        </div>
        <div class="btn-box"
            v-if="showBtnBox">
            <el-button size="small"
                :class="{'btn-active-bg':flagX===1}"
                type="primary"
                @click.native="goAnchor(1)"
                plain>首末车时间</el-button>
            <el-button size="small"
                :class="{'btn-active-bg':flagX===2}"
                type="primary"
                @click.native="goAnchor(2)"
                plain>运行时间及等级</el-button>
            <el-button size="small"
                :class="{'btn-active-bg':flagX===3}"
                type="primary"
                @click.native="goAnchor(3)"
                plain>线路信息</el-button>
            <el-button size="small"
                :class="{'btn-active-bg':flagX===4}"
                type="primary"
                @click.native="goAnchor(4)"
                plain>交路设计</el-button>
            <el-button size="small"
                :class="{'btn-active-bg':flagX===5}"
                type="primary"
                @click.native="goAnchor(5)"
                plain>段场收发车限制</el-button>
            <el-button size="small"
                :class="{'btn-active-bg':flagX===6}"
                type="primary"
                @click.native="goAnchor(6)"
                plain>运用列车数限制</el-button>
            <el-button size="small"
                :class="{'btn-active-bg':flagX===7}"
                type="primary"
                @click.native="goAnchor(7)"
                plain>通行能力限制</el-button>
            <el-button size="small"
                :class="{'btn-active-bg':flagX===8}"
                type="primary"
                @click.native="goAnchor(8)"
                plain>施工天窗限制</el-button>
            <el-button size="small"
                :class="{'btn-active-bg':flagX===9}"
                type="primary"
                @click.native="goAnchor(9)"
                plain>其它相关限制</el-button>
        </div>
    </div>
</template>

<script>
import {
    registerCallback,
    unregisterCallback,
    sendSock,
    getPackage,
} from "@/utils/ws";
let that = this;
export default {
    name: "operation",

    data() {
        return {
            showBtnBox: false,
            radio1: "基于行车计划",
            flagX: "",
            showTop: false,
            showRightDom: true, // 是否显现右侧内容
            tableData1Edit: false,
            tableData2Edit: false,
            tableData3Edit: false,
            tableData4Edit: false,
            tableData5Edit: false,
            tableData6Edit: false,
            tableData7Edit: false,
            tableData8Edit: false,
            tableData9Edit: false,
            tableData10Edit: false,
            tableData11Edit: false,
            tableData12Edit: false,
            tableData13Edit: false,
            tableData1: [
                {
                    upStation: "新宫",
                    upFirstTrain: "5:00",
                    upLastTrain: "22:00",
                    downStation: "牡丹园",
                    downFirstTrain: "5:30",
                    downLastTrain: "22:30",
                },
                {
                    upStation: "新发地",
                    upFirstTrain: "5:00",
                    upLastTrain: "22:00",
                    downStation: "北太平庄",
                    downFirstTrain: "5:30",
                    downLastTrain: "22:30",
                },
                {
                    upStation: "草桥",
                    upFirstTrain: "5:00",
                    upLastTrain: "22:00",
                    downStation: "积水潭",
                    downFirstTrain: "5:30",
                    downLastTrain: "22:30",
                },
                {
                    upStation: "右安门外",
                    upFirstTrain: "5:00",
                    upLastTrain: "22:00",
                    downStation: "平安里",
                    downFirstTrain: "5:30",
                    downLastTrain: "22:30",
                },
                {
                    upStation: "牛街",
                    upFirstTrain: "5:00",
                    upLastTrain: "22:00",
                    downStation: "金融街",
                    downFirstTrain: "5:30",
                    downLastTrain: "22:30",
                },
                {
                    upStation: "金融街",
                    upFirstTrain: "5:00",
                    upLastTrain: "22:00",
                    downStation: "牛街",
                    downFirstTrain: "5:30",
                    downLastTrain: "22:30",
                },
                {
                    upStation: "平安里",
                    upFirstTrain: "5:00",
                    upLastTrain: "22:00",
                    downStation: "右安门外",
                    downFirstTrain: "5:30",
                    downLastTrain: "22:30",
                },
                {
                    upStation: "积水潭",
                    upFirstTrain: "5:00",
                    upLastTrain: "22:00",
                    downStation: "草桥",
                    downFirstTrain: "5:30",
                    downLastTrain: "22:30",
                },
                {
                    upStation: "北太平庄",
                    upFirstTrain: "5:00",
                    upLastTrain: "22:00",
                    downStation: "新发地",
                    downFirstTrain: "5:30",
                    downLastTrain: "22:30",
                },
                {
                    upStation: "牡丹园",
                    upFirstTrain: "5:00",
                    upLastTrain: "22:00",
                    downStation: "新宫",
                    downFirstTrain: "5:30",
                    downLastTrain: "22:30",
                },
            ],
            tableData2: [{}],
            tableData3: [{}],
            tableData4: [
                {
                    stationA: "新宫1",
                    stationB: "新宫折返线1",
                    qujian: "120",
                    stopTimeA: "30",
                    stopTimeB: "34",
                },
                {
                    stationA: "新宫1",
                    stationB: "新宫折返线2",
                    qujian: "120",
                    stopTimeA: "30",
                    stopTimeB: "34",
                },
                {
                    stationA: "新宫折返线1",
                    stationB: "新宫2",
                    qujian: "120",
                    stopTimeA: "30",
                    stopTimeB: "34",
                },
                {
                    stationA: "新宫折返线2",
                    stationB: "新宫2",
                    qujian: "120",
                    stopTimeA: "30",
                    stopTimeB: "34",
                },
                {
                    stationA: "牡丹园2",
                    stationB: "牡丹园折返线",
                    qujian: "120",
                    stopTimeA: "30",
                    stopTimeB: "34",
                },
                {
                    stationA: "牡丹园折返线",
                    stationB: "牡丹园1",
                    qujian: "120",
                    stopTimeA: "30",
                    stopTimeB: "34",
                },
            ],
            tableData5: [
                {
                    currentStation: "新宫",
                    nextStation: "新发地",
                    distanceUp: "2782",
                    distanceDown: "2782",
                },
                {
                    currentStation: "新发地",
                    nextStation: "草桥",
                    distanceUp: "2782",
                    distanceDown: "2782",
                },
                {
                    currentStation: "草桥",
                    nextStation: "右安门外",
                    distanceUp: "2782",
                    distanceDown: "2782",
                },
                {
                    currentStation: "右安门外",
                    nextStation: "牛街",
                    distanceUp: "2782",
                    distanceDown: "2782",
                },
                {
                    currentStation: "牛街",
                    nextStation: "金融街",
                    distanceUp: "2782",
                    distanceDown: "2782",
                },
                {
                    currentStation: "金融街",
                    nextStation: "平安里",
                    distanceUp: "2782",
                    distanceDown: "2782",
                },
                {
                    currentStation: "平安里",
                    nextStation: "积水潭",
                    distanceUp: "2782",
                    distanceDown: "2782",
                },
                {
                    currentStation: "积水潭",
                    nextStation: "北太平庄",
                    distanceUp: "2782",
                    distanceDown: "2782",
                },
                {
                    currentStation: "北太平庄",
                    nextStation: "牡丹园",
                    distanceUp: "2782",
                    distanceDown: "2782",
                },
            ],
            tableData6: [],
            tableData7: [
                {
                    limitText: "新宫车辆段最小出车间隔",
                    limitValue: "4min",
                    remark: "4min连续出车数必须小于等于5，5分钟及以上间隔连续出车数不做限制",
                },
            ],
            tableData8: [
                {
                    label: "车辆编组类型",
                    value: "8A",
                },
                {
                    label: "列车设计载客量（人/列）",
                    value: "2136",
                },
                {
                    label: "可用最大图定上线列车数（列）",
                    value: "20",
                },
            ],
            tableData9: [
                {
                    station: "新宫",
                    up1: "85",
                    up3: "87",
                    down2: "85",
                    down4: "87",
                },
                {
                    station: "新发地",
                    up1: "85",
                    up3: "87",
                    down2: "85",
                    down4: "87",
                },
                {
                    station: "草桥",
                    up1: "85",
                    up3: "87",
                    down2: "85",
                    down4: "87",
                },
                {
                    station: "右安门外",
                    up1: "85",
                    up3: "87",
                    down2: "85",
                    down4: "87",
                },
                {
                    station: "牛街",
                    up1: "85",
                    up3: "87",
                    down2: "85",
                    down4: "87",
                },
                {
                    station: "金融街",
                    up1: "85",
                    up3: "87",
                    down2: "85",
                    down4: "87",
                },
                {
                    station: "平安里",
                    up1: "85",
                    up3: "87",
                    down2: "85",
                    down4: "87",
                },
                {
                    station: "积水潭",
                    up1: "85",
                    up3: "87",
                    down2: "85",
                    down4: "87",
                },
                {
                    station: "北太平庄",
                    up1: "85",
                    up3: "87",
                    down2: "85",
                    down4: "87",
                },
                {
                    station: "牡丹园",
                    up1: "85",
                    up3: "87",
                    down2: "85",
                    down4: "87",
                },
            ],
            tableData10: [
                {
                    limitText: "新宫车辆段施工天窗时段",
                    limitValue: "12:00-16:00",
                    remark: "不可进出列车",
                },
            ],
            tableData11: [
                {
                    label: "正线最小行车间隔",
                    value: "2min",
                    remark: "",
                },
                {
                    label: "新宫折返站最小折返间隔",
                    value: "2min",
                    remark: "",
                },
                {
                    label: "牡丹园折返站最小折返间隔",
                    value: "2min",
                    remark: "",
                },
                {
                    label: "各段供电能力",
                    value: "2min",
                    remark: "支持的最小行车间隔",
                },
                {
                    label: "平峰最小行车间隔",
                    value: "6min",
                    remark: "早晚高峰之间",
                },
                {
                    label: "全天最大行车间隔",
                    value: "10min",
                    remark: "任意时段",
                },
            ],
            tableData12: [
                {
                    currentStation: "新宫",
                    nextStation: "新发地",
                    up: "55",
                    down: "55",
                },
                {
                    currentStation: "新发地",
                    nextStation: "草桥",
                    up: "55",
                    down: "55",
                },
                {
                    currentStation: "草桥",
                    nextStation: "右安门外",
                    up: "55",
                    down: "55",
                },
                {
                    currentStation: "右安门外",
                    nextStation: "牛街",
                    up: "55",
                    down: "55",
                },
                {
                    currentStation: "牛街",
                    nextStation: "金融街",
                    up: "55",
                    down: "55",
                },
                {
                    currentStation: "金融街",
                    nextStation: "平安里",
                    up: "55",
                    down: "55",
                },
                {
                    currentStation: "平安里",
                    nextStation: "积水潭",
                    up: "55",
                    down: "55",
                },
                {
                    currentStation: "积水潭",
                    nextStation: "北太平庄",
                    up: "55",
                    down: "55",
                },
                {
                    currentStation: "北太平庄",
                    nextStation: "牡丹园",
                    up: "55",
                    down: "55",
                },
            ],
            tableData13: [
                {
                    name: "新宫",
                    value1: "102",
                    value2: "102",
                    remark: "转换轨至正线",
                },
            ],
            departureStationOptions: [
                {
                    value: "车站1",
                    label: "车站1",
                },
            ],
            departureStationValue: "车站1",
            stationCn: [
                {
                    id: 1,
                    stationName: "新宫站",
                },
                {
                    id: 2,
                    stationName: "新宫站",
                },
                {
                    id: 3,
                    stationName: "新宫站",
                },
                {
                    id: 4,
                    stationName: "新宫站",
                },
                {
                    id: 5,
                    stationName: "新宫站",
                },
                {
                    id: 6,
                    stationName: "新宫站",
                },
                {
                    id: 7,
                    stationName: "新宫站",
                },
                {
                    id: 8,
                    stationName: "新宫站",
                },
                {
                    id: 9,
                    stationName: "新发地站",
                },
                {
                    id: 10,
                    stationName: "草桥站",
                },
                {
                    id: 11,
                    stationName: "右安门外站",
                },
                {
                    id: 12,
                    stationName: "牛街站",
                },
                {
                    id: 13,
                    stationName: "金融街站",
                },
                {
                    id: 14,
                    stationName: "金融街站",
                },
                {
                    id: 16,
                    stationName: "平安里站",
                },
                {
                    id: 17,
                    stationName: "平安里站",
                },
                {
                    id: 18,
                    stationName: "积水潭站",
                },
                {
                    id: 19,
                    stationName: "北太平庄站",
                },
                {
                    id: 20,
                    stationName: "牡丹园站",
                },
                {
                    id: 21,
                    stationName: "牡丹园站",
                },
                {
                    id: 22,
                    stationName: "牡丹园站",
                },
                {
                    id: 23,
                    stationName: "牡丹园站",
                },
                {
                    id: 24,
                    stationName: "牡丹园站",
                },
                {
                    id: 25,
                    stationName: "新宫站",
                },
                {
                    id: 26,
                    stationName: "新宫站",
                },
                {
                    id: 27,
                    stationName: "新宫站",
                },
                {
                    id: 28,
                    stationName: "新宫站",
                },
                {
                    id: 29,
                    stationName: "新宫站",
                },
                {
                    id: 30,
                    stationName: "新宫站",
                },
                {
                    id: 31,
                    stationName: "新发地站",
                },
                {
                    id: 32,
                    stationName: "新发地站",
                },
                {
                    id: 33,
                    stationName: "草桥站",
                },
                {
                    id: 34,
                    stationName: "右安门外站",
                },
                {
                    id: 35,
                    stationName: "牛街站",
                },
                {
                    id: 36,
                    stationName: "金融街站",
                },
                {
                    id: 38,
                    stationName: "金融街站",
                },
                {
                    id: 39,
                    stationName: "平安里站",
                },
                {
                    id: 40,
                    stationName: "积水潭站",
                },
                {
                    id: 41,
                    stationName: "北太平庄站",
                },
                {
                    id: 42,
                    stationName: "北太平庄站",
                },
                {
                    id: 43,
                    stationName: "牡丹园站",
                },
                {
                    id: 44,
                    stationName: "牡丹园站",
                },
                {
                    id: 45,
                    stationName: "牡丹园站",
                },
            ],
            saveData: {
                name: "",
                BasicData: {
                    routingTable: {
                        routingRows: [{}],
                    },
                    runTimeLevelTable: {
                        runTimelevel: [{}],
                        stopTimelevel: [{}],
                    },
                },
            },
        };
    },
    beforeCreate: function () {
        that = this;
    },
    created(){
        registerCallback("trainNumber", this.wsCallback);
    },
    beforeDestroy() {
        unregisterCallback("trainNumber");
    },
    filters: {
        stationToCn(val) {
            let str = "";
            that.stationCn.forEach((current) => {
                if (current.id === val) {
                    str = current.stationName;
                    return;
                }
            });
            return `${str}( ${val} ）`;
        },
    },
    methods: {
        goAnchor(num) {
            this.flagX = null;
            document.getElementById("page" + num).scrollIntoView(true);
        },
        startStopAreaToCn(row, column) {
            let str = "";
            this.stationCn.forEach((current) => {
                if (current.id === row.startStopArea) {
                    str = current.stationName;
                    return;
                }
            });
            return `${str}( ${row.startStopArea} ）`;
        },
        endStopAreaToCn(row, column) {
            let str = "";
            this.stationCn.forEach((current) => {
                if (current.id === row.endStopArea) {
                    str = current.stationName;
                    return;
                }
            });
            return `${str}( ${row.endStopArea} ）`;
        },
        stopAreaIdToCn(row, column) {
            let str = "";
            this.stationCn.forEach((current) => {
                if (current.id === row.stopAreaId) {
                    str = current.stationName;
                    return;
                }
            });
            return `${str}( ${row.stopAreaId} ）`;
        },
        getInfo() {
            var data = getPackage(305);
            sendSock(data);
        },
        saveInfo(str) {
            this[str] = false;
            let _this = this;
            var data = getPackage(306, this.saveData);
            sendSock(data);
        },
        wsCallback(res) {
            if (res.msgType == 406) {
                this.$message.success("保存成功！");
                this.getInfo();
            } else if (res.msgType == 405) {
                this.saveData = res.data;
            }
        },
    },
    mounted() {
        let _this = this;
        setTimeout(function () {
            _this.showBtnBox = true;
        }, 2000);
        if (this.$route.params.page) {
            let _this = this;
            this.flagX = this.$route.params.page;
            setTimeout(function () {
                document
                    .getElementById("page" + _this.$route.params.page)
                    .scrollIntoView(true);
            });
        }
        this.getInfo();
    },
};
</script>

<style  lang="scss">
.btn-active-bg {
    background: #409eff !important;
    border-color: #409eff !important;
    color: #fff !important;
}
.trainNumber-box {
    position: relative;
    height: calc(100vh - 50px);
    overflow-y: auto;
    .table-container {
        width: 80%;
    }
    .btn-box {
        position: fixed;
        width: 20%;
        right: 0;
        text-align: center;
        padding: 10px 0;
        top: 80px;
        .el-button {
            margin: 15px auto;
            width: 150px;
            display: block;
        }
    }
    .table-title:before {
        content: "";
        width: 4px;
        height: 20px;
        background: #2db7f5;
        position: absolute;
        left: 0;
        top: 12px;
    }
    .table-title {
        font-size: 16px;
        padding: 10px 0 10px 10px;
        position: relative;

        .el-button {
            float: right;
            margin-bottom: 4px;
        }
    }
    .el-table {
        margin-bottom: 30px;
        width: 100%;
    }
    font-size: 12px;
    padding: 20px;
    .cell {
        font-size: 12px;
        padding: 0 0 0 10px !important;
    }
    th {
        background-color: #f8f8f8;
    }
    .line-img {
        width: 800px;
        margin-bottom: 20px;
    }
}
</style>
