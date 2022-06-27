<template>
    <el-tabs class="tab-main"
        value="cell-prop"
        stretch>
        <el-tab-pane :label="cell.attributes.tctData.typeName"
            name="cell-prop">
            <div class="prop-row"
                v-show="false">
                <div class="prop-name">类型</div>
                <div class="prop-value">{{ cell.attributes.tctData.typeName }}</div>
            </div>
            <div class="prop-row">
                <div class="prop-name">编号</div>
                <div class="prop-value">{{ cell.attributes.tctData.tctId }}</div>
            </div>
            <div v-if="isType(['tct.StopArea'])">
                <div class="prop-row">
                    <div class="prop-name">停车区域ID</div>
                    <el-input size="mini"
                        v-model="cell.attributes.tctData.stopAreaID"
                        @change="siliyMockStopAreaIdChange"></el-input>
                </div>
                <div class="prop-row">
                    <div class="prop-name">名称</div>
                    <el-input size="mini"
                        v-model="cell.attributes.tctData.areaName"
                        @change="updateCellLayout"></el-input>
                </div>
                <div class="prop-row">
                    <div class="prop-name">所属车站</div>
                    <el-input size="mini"
                        v-model="cell.attributes.tctData.stationName"></el-input>
                </div>
                <div class="prop-row">
                    <div class="prop-name">限速(km/h)</div>
                    <el-input size="mini"
                        v-model="cell.attributes.tctData.limit"></el-input>
                </div>
                <div class="prop-row"
                    v-if="false">
                    <div class="prop-name">停车点1编号</div>
                    <div class="prop-value">{{ cell.attributes.tctData.stop1ID }}</div>
                </div>
                <div class="prop-row">
                    <div class="prop-name">起始公里标(m)</div>
                    <el-input size="mini"
                        v-model="cell.attributes.tctData.km1"></el-input>
                    <!-- <div class="prop-value">{{ kmStrStop1 }}</div> -->
                </div>
                <div class="prop-row"
                    v-if="false">
                    <div class="prop-name">停车点2编号</div>
                    <div class="prop-value">{{ cell.attributes.tctData.stop2ID }}</div>
                </div>
                <div class="prop-row">
                    <div class="prop-name">结束公里标(m)</div>
                    <el-input size="mini"
                        v-model="cell.attributes.tctData.km2"></el-input>
                    <!-- <div class="prop-value">{{ kmStrStop2 }}</div> -->
                </div>
                <div class="prop-row">
                    <div class="prop-name">上下行</div>
                    <el-select size="mini"
                        v-model="cell.attributes.tctData.location">
                        <el-option v-for="item in locationTypes"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="prop-row">
                    <div class="prop-name">最小停站时间</div>
                    <el-input size="mini"
                        v-model="cell.attributes.tctData.minStopTime"></el-input>
                </div>
                <div class="prop-row">
                    <div class="prop-name">最大停站时间</div>
                    <el-input size="mini"
                        v-model="cell.attributes.tctData.maxStopTime"></el-input>
                </div>
                <div class="prop-row">
                    <div class="prop-name">默认停站时间</div>
                    <el-input size="mini"
                        v-model="cell.attributes.tctData.defaultStopTime"></el-input>
                </div>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_STATION_AREA"
                    @change="updateCellLayout">是否站台区域</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_REVERT_AREA"
                    @change="updateCellLayout">是否折返区域</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_TRANSFORM_AREA"
                    @change="updateCellLayout">是否转换轨区域</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_DEPOT_AREA"
                    @change="updateCellLayout">是否停车库轨区域</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_SLEEP_AREA"
                    @change="updateCellLayout">是否休眠轨区域</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_CLEAR_AREA"
                    @change="updateCellLayout">是否站台清客区域</el-checkbox>
                <div class="prop-row">
                    <div class="prop-name">折返设置</div>
                    <el-select size="mini"
                        v-model="cell.attributes.tctData.reverseType">
                        <el-option v-for="item in reverseTypes"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="prop-row">
                    <div class="prop-name">包含子停车区数量</div>
                    <el-select size="mini"
                        v-model="cell.attributes.tctData.subAreasCount"
                        @change="updateCellLayout">
                        <el-option v-for="item in subAreasCounts"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div style="border: 1px solid #ccc; margin: 0 15px"
                    v-if="cell.attributes.tctData.subAreasCount > 0">
                    <div class="prop-row"
                        v-if="
              cell.attributes.tctData.subAreas &&
              cell.attributes.tctData.subAreas.length > 0
            ">
                        <ul>
                            <li v-for="(area, index) in cell.attributes.tctData.subAreas"
                                :key="index">
                                <div class="prop-row">
                                    <div style="margin: 0 5px">{{ area.subId }}</div>
                                    <div style="margin: 0 5px">公里标(m)</div>
                                    <el-input size="mini"
                                        v-model="area.startKm"
                                        @input="updateInput($event)"></el-input>
                                    <div style="margin: 0 5px">-</div>
                                    <el-input size="mini"
                                        v-model="area.endKm"
                                        @input="updateInput($event)"></el-input>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div v-if="isType(['tct.Balise'])"
                class="prop-row">
                <div class="prop-name">应答器</div>
                <el-select size="mini"
                    v-model="cell.attributes.tctData.baliseType"
                    @change="updateCellLayout">
                    <el-option v-for="item in baliseTypes"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div v-if="isType(['tct.Signal'])"
                class="prop-row">
                <div class="prop-name">类型</div>
                <el-select size="mini"
                    v-model="cell.attributes.tctData.signalType"
                    @change="updateCellLayout">
                    <el-option v-for="item in signalTypes"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div v-if="isType(['tct.Point'])">
                <div class="prop-row">
                    <div class="prop-name">类型</div>
                    <el-select size="mini"
                        v-model="cell.attributes.tctData.pointType"
                        @change="updateCellLayout">
                        <el-option v-for="item in pointTypes"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="prop-row"
                    v-if="false">
                    <div class="prop-name">正限速</div>
                    <div class="prop-value">
                        {{ cell.attributes.tctData.mainSpeedLimit }}
                    </div>
                </div>
                <div class="prop-row">
                    <div class="prop-name">道岔限速(km/h)</div>
                    <div class="prop-value">
                        {{ cell.attributes.tctData.sideSpeedLimit }}
                    </div>
                </div>
            </div>

            <div v-if="isType(['tct.Signal'])"
                class="prop-row">
                <div class="prop-name">方向</div>
                <el-select size="mini"
                    v-model="cell.attributes.tctData.signalDirection"
                    @change="updateCellLayout">
                    <el-option v-for="item in signalDirections"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="prop-row"
                v-if="
          isType([
            'tct.Axle',
            'tct.Bumper',
            'tct.Point',
            'tct.Signal',
            'tct.Balise',
            'tct.Stop',
            'tct.Station',
            'tct.VirtualPort',
          ])">
                <div class="prop-name">公里标(m)</div>
                <!--     onkeyup="value=value.replace(/[^\d]/g,'')" -->
                <el-input size="mini"
                    v-model="cell.attributes.tctData.km"
                    @change="updateCellLayout"></el-input>
                <!-- <div class="prop-value">{{ kmStr }}</div> -->
            </div>
            <div v-if="isType(['tct.Station'])">
                <div class="prop-row">
                    <div class="prop-name">车站名称</div>
                    <el-input size="mini"
                        v-model="cell.attributes.tctData.name"
                        @change="updateCellLayout"></el-input>
                </div>
                <div class="prop-row">
                    <div class="prop-name">编组</div>
                    <el-input size="mini"
                        v-model="cell.attributes.tctData.carCount"
                        @change="updateCellLayout"></el-input>
                </div>
                <div class="prop-row">
                    <div class="prop-name">站台位置</div>
                    <el-select size="mini"
                        v-model="cell.attributes.tctData.psdLocation"
                        @change="updateCellLayout">
                        <el-option v-for="item in platformTypes"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="prop-row">
                    <div class="prop-name">端口位置</div>
                    <el-select size="mini"
                        v-model="cell.attributes.tctData.portLocation"
                        @change="updateCellLayout">
                        <el-option v-for="item in stationPortTypes"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="prop-row">
                    <div class="prop-name">垂直高度</div>
                    <el-select size="mini"
                        v-model="cell.attributes.tctData.verticalSize"
                        @change="updateCellLayout">
                        <el-option v-for="item in stationVerticalSize"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="prop-row">
                    <div class="prop-name">限速(km/h)</div>
                    <el-input size="mini"
                        v-model="cell.attributes.tctData.speedLimit"></el-input>
                </div>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.upPositiveStop"
                    @change="updateCellLayout">上行正向停车标</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.upNegativeStop"
                    @change="updateCellLayout">上行反向停车标</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.downPositiveStop"
                    @change="updateCellLayout">下行正向停车标</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.downNegativeStop"
                    @change="updateCellLayout">下行反向停车标</el-checkbox>
            </div>
            <div v-if="isType(['tct.Stop'])">
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_OPERAT_STOP_POINT"
                    @change="updateCellLayout">是否站台运营停车点</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_EXITROUTE_STOP_POINT"
                    @change="updateCellLayout">是否退出停车点</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_REVERT_STOP_POINT"
                    @change="updateCellLayout">是否折返停车点</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_SIGNAL_STOP_POINT"
                    @change="updateCellLayout">是否站外信号机停车点</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_REVERTEND_STOP_POINT"
                    @change="updateCellLayout">是否折返后停车点</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_SWITCH_STOP_POINT"
                    @change="updateCellLayout">是否转换轨停车点</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_SLEEP_AWAKE_STOP_POINT"
                    @change="updateCellLayout">是否休眠唤醒停车点</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_CLEAN_REQ_STOP_POINT"
                    @change="updateCellLayout">是否洗车请求停车点</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_CLEAN_FRONT_STOP_POINT"
                    @change="updateCellLayout">是否前端洗车停车点</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_CLEAN_END_STOP_POINT"
                    @change="updateCellLayout">是否后端洗车停车点</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_PASS_REQ_STOP_POINT"
                    @change="updateCellLayout">是否通过请求停车点</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_4GROUP_STOP_POINT"
                    @change="updateCellLayout">是否4编组停车点</el-checkbox>
                <el-checkbox class="option-row"
                    v-model="cell.attributes.tctData.props.EMAP_6GROUP_STOP_POINT"
                    @change="updateCellLayout">是否6编组停车点</el-checkbox>
            </div>

            <div v-if="isType(['tct.Grade'])">
                <div class="prop-row">
                    <div class="prop-name">坡度值(‰)</div>
                    <el-input size="mini"
                        onkeyup="value=value.replace(/[^-\d\.]/g,'')"
                        v-model="cell.attributes.tctData.gradeValue"
                        @change="updateCellLayout"></el-input>
                </div>
                <div class="prop-row">
                    <div class="prop-name">竖曲线半径(m)</div>
                    <el-input size="mini"
                        onkeyup="value=value.replace(/[^-\d\.]/g,'')"
                        v-model="cell.attributes.tctData.R"
                        @change="updateCellLayout"></el-input>
                </div>
            </div>
            <div v-if="isType(['tct.Limit'])">
                <div class="prop-row">
                    <div class="prop-name">曲线半径(m)</div>
                    <el-input size="mini"
                        onkeyup="value=value.replace(/[^-\d\.]/g,'')"
                        v-model="cell.attributes.tctData.R"
                        @change="updateCellLayout"></el-input>
                </div>
                <div class="prop-row">
                    <div class="prop-name">欠超高(mm)</div>
                    <el-input size="mini"
                        onkeyup="value=value.replace(/[^-\d\.]/g,'')"
                        v-model="cell.attributes.tctData.H"
                        @change="updateCellLayout"></el-input>
                </div>
                <div class="prop-row">
                    <div class="prop-name">限速(km/h) {{getLimit}}</div>
                </div>
            </div>
            <div v-if="isType(['tct.StationLimit'])">
                <div class="prop-row">
                    <div class="prop-name">限速值</div>
                    <el-input size="mini"
                        onkeyup="value=value.replace(/[^-\d\.]/g,'')"
                        v-model="cell.attributes.tctData.V"
                        @change="updateCellLayout"></el-input>
                </div>
            </div>

            <div class="prop-row"
                v-if="isType(['tct.Bumper', 'tct.Point', 'tct.Track'])">
                <div class="prop-name">方向</div>
                <el-select size="mini"
                    v-model="cell.attributes.tctData.direction"
                    @change="directionChange">
                    <el-option v-for="item in directions"
                        :key="item.value"
                        :label="item.name"
                        :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="prop-row"
                v-if="false">
                <div class="prop-name">(x,y)</div>
                <div class="prop-value">
                    {{ cell.attributes.position.x }},{{ cell.attributes.position.y }}
                </div>
            </div>
            <div class="prop-row"
                v-if="isType(['tct.None'])">
                <div class="prop-name">(x1,y1)</div>
                <div class="prop-value">
                    {{ cell.attributes.attrs.line.x1 }},{{
            cell.attributes.attrs.line.y1
          }}
                </div>
            </div>

            <div class="prop-row"
                v-if="isType(['tct.None'])">
                <div>(x2,y2)</div>
                <div class="prop-value">
                    {{ cell.attributes.attrs.line.x2 }},{{
            cell.attributes.attrs.line.y2
          }}
                </div>
            </div>
            <div class="prop-row"
                v-if="cell.attributes.drawData.stationComponentId && isType(['tct.Station','tct.StopArea'])">
                <div class="prop-name">车站中心公里标(m)</div>
            </div>
            <div class="prop-row"
                v-if="cell.attributes.drawData.stationComponentId && isType(['tct.Station','tct.StopArea'])">
                <!-- onkeyup="value=value.replace(/[^\d]/g,'')" -->
                <el-input size="mini"
                    v-model="componentKmOffset"></el-input>
                <el-button size="mini"
                    type="none"
                    style="height: 30px; margin-left: 5px"
                    @click="setComponentKmOffset">平移</el-button>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import BaseData from "@/views/lines/model/BaseData";
import SelectionData from "@/views/lines/model/SelectionData";
export default {
    props: ["cell", "maxV"],
    data() {
        return {
            directions: BaseData.Direction,
            ...SelectionData,
            componentKmOffset: 0,
            subAreasCounts: [
                {
                    id: 0,
                    name: 0,
                },
                {
                    id: 1,
                    name: 1,
                },
                {
                    id: 2,
                    name: 2,
                },
                {
                    id: 3,
                    name: 3,
                },
            ],
        };
    },
    computed: {
        kmStr() {
            let kmStr = "";
            let num = Number(this.cell.attributes.tctData.km);
            if (!Number.isNaN(num)) {
                let km = parseInt(parseInt(num) / 1000);
                let offset = (num % 1000).toFixed(2);
                kmStr = `K${km}+${offset}`;
            }
            return kmStr;
        },
        kmStrStop1() {
            let kmStr = "";
            let num = Number(this.cell.attributes.tctData.km1);
            if (!Number.isNaN(num)) {
                let km = parseInt(parseInt(num) / 1000);
                let offset = (num % 1000).toFixed(2);
                kmStr = `K${km}+${offset}`;
            }
            return kmStr;
        },
        kmStrStop2() {
            let kmStr = "";
            let num = Number(this.cell.attributes.tctData.km2);
            if (!Number.isNaN(num)) {
                let km = parseInt(parseInt(num) / 1000);
                let offset = (num % 1000).toFixed(2);
                kmStr = `K${km}+${offset}`;
            }
            return kmStr;
        },
        getLimit() {
            let maxH = 120;
            let maxV = Number(this.maxV);
            let H = Number(this.cell.attributes.tctData.H);
            let R = Number(this.cell.attributes.tctData.R);

            let dataV = 0;

            if (maxV > 0 && H >= 0 && R >= 0) {
                if (maxV == 80) {
                    maxV = 87;
                } else if (maxV == 100) {
                    maxV = 110;
                } else {
                    maxV += 7;
                }
                dataV = Math.sqrt((maxH + H) * Math.abs(R / 11.8));
                if (dataV > maxV) {
                    dataV = maxV;
                }
            }

            return parseInt(dataV * 100) / 100;
        },
    },
    methods: {
        setCell(outCell) {
            this.cell = outCell;
        },
        /**
         * 是否是指定类型
         */
        isType(typeArr) {
            let t = this.cell.attributes.type;
            if (typeArr && typeArr.length > 0) {
                return typeArr.indexOf(t) > -1;
            }
            return false;
        },
        directionChange() {
            this.$emit("onDirectionChange", this.cell);
        },
        updateCellLayout() {
            this.$emit("onUpdateCellLayout", this.cell);
        },
        setComponentKmOffset() {
            this.componentKmOffset = Number(this.componentKmOffset);
            if (!Number.isNaN(this.componentKmOffset)) {
                this.$emit(
                    "onSetComponentKmOffset",
                    this.cell.attributes.drawData.stationComponentId,
                    this.componentKmOffset
                );
            }
        },
        // 停车区域变化后更新到组件里
        siliyMockStopAreaIdChange(){
            this.$emit("siliyMockStopAreaIdChange", this.cell);
        },
        updateInput() {
            this.$forceUpdate();
        },
    },
};
</script>

<style scoped>
.tab-main {
    width: 100%;
    height: 100%;
}

.el-tabs {
    height: 100%;
    overflow-y: auto;
}

.prop-row {
    padding: 3px 15px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size: 10px;
}

.prop-row ul {
    list-style: none;
    list-style-type: none;
    padding-inline-start: 0px;
}

.prop-name {
    margin-right: 15px;
}

.prop-value {
    width: auto;
    color: rgb(70, 164, 241);
}

.option-row {
    padding: 10px 15px 0px 15px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.el-input {
    flex: 1;
    height: 25px;
}

.el-input__inner {
    flex: 1;
    height: 25px;
}

.el-input >>> .el-input__inner {
    -web-kit-appearance: none;
    -moz-appearance: none;
    font-size: 1em;
    border-radius: 2;
    border: 1px solid #dcdfe6;
    color: #606266;
    height: 25px;
    padding: 0 5px;
}

.el-input >>> .el-input__inner:focus {
    -web-kit-appearance: none;
    -moz-appearance: none;
    font-size: 1em;
    border-radius: 2;
    border: 1px solid #628fe9;
    color: #606266;
    outline: 0;
    height: 25px;
    padding: 0 5px;
}

.el-select {
    flex: 1;
    height: 25px;
}

.el-select >>> .el-input__inner {
    -web-kit-appearance: none;
    -moz-appearance: none;
    font-size: 1em;
    border-radius: 2;
    border: 1px solid #dcdfe6;
    color: #606266;
    height: 25px;
    padding: 0 15px;
}

.el-select--mini {
    flex: 1;
    height: 25px;
}

.el-input >>> .el-inout__suffix {
    height: 25px;
}

.el-checkbox >>> .el-checkbox__label {
    font-size: 10px;
}

.div-component {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.el-tabs >>> .el-tabs__content {
    height: calc(100vh - 155px);
    overflow-y: auto;
}
</style>
