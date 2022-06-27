<template>
    <div class="window">
        <div class="header">
            <Header ref="headerPanel"
                class="inner-header"
                :title="title"
                v-on:ontest="funcTest"
                v-on:onExportProjectFile="onExportProjectFile"
                v-on:onImportProjectFile="fileSelectorOpen('读取项目')"
                v-on:onImportComponent="fileSelectorOpen('加载组件')"
                v-on:onExportProjectToPng="funcExportProjectToPng"
                v-on:onSaveAsComponent="onSaveAsComponent"
                v-on:onClearCache="funcClearCache"
                v-on:onNewProject="dialogVisibleSetProject = true"
                v-on:onSetGrade="dialogVisibleSetGrade = true"
                v-on:onSetLimit="dialogVisibleSetLimit = true"
                v-on:onSetLimitByUser="dialogVisibleSetLimitByUser = true"
                v-on:onSetPoint="dialogVisibleSetPoint = true"
                v-on:onSetEnterRoute="dialogVisibleSetEnterRoute = true"
                v-on:onSetRunParam="onSetRunParam"
                v-on:onStartTest="onStartTest"
                v-on:onExportComponent="onExportComponent"
                v-on:onDataTest="onDataTest" />
            <!-- 隐藏的file处理 -->
            <input style="display: none"
                type="file"
                id="fileSelector"
                @change="selectFileFinish" />
        </div>
        <div class="container">
            <div class="leftpanel">
                <ProjectInfo :project="project"
                    v-if="project.selectedCell == null"
                    v-on:paperSet="paperSet" />
                <CellInfo v-if="project.selectedCell"
                    :cell="project.selectedCell"
                    :maxV="maxV"
                    v-on:onDirectionChange="onDirectionChange"
                    v-on:onUpdateCellLayout="onUpdateCellLayout"
                    v-on:siliyMockStopAreaIdChange="onSiliyMockStopAreaIdChange"
                    v-on:onSetComponentKmOffset="onSetComponentKmOffset" />
            </div>
            <div class="drawarea">
                <div class="canvasArea"
                    @drop="drop"
                    @dragover="allowDrop($event)"></div>
                <ContextMenu v-if="project.contextMenuVisible"
                    :menus="project.contextMenu"
                    :project="project"
                    v-on:clickMenu="onContextMenuClick" />
                <div class="station-list"
                    v-if="stationList && stationList.length>0">
                    <img class="img-line16"
                        style="height:80px;width:1710px"
                        src="../../assets/basie/line16-1.png">
                    <img class="img-line16"
                        style="top:80px;height:80px;width:1685px"
                        src="../../assets/basie/line16-2.png">
                    <div class="station-list-panel">
                        <div class="station-block"
                            :style="{ width:  s.width/2 + 'px',top:s.id>15?80+'px':0,left:s.x/2-(parseInt((s.id-1)/15)*1710)+'px'}"
                            @click="location(s.name)"
                            v-for="s in stationList"></div>
                    </div>
                </div>
            </div>
        </div>

        <DialogSaveComponent :dialogFormVisible="dialogVisibleSaveComponent"
            v-on:cancelAction="funcSaveComponentCancel"
            v-on:okAction="funcSaveComponentOk" />
        <DialogSetGrade ref="dGrad"
            :gradeInfo="project.gradeInfo"
            :dialogFormVisible="dialogVisibleSetGrade"
            v-on:cancelAction="dialogVisibleSetGrade = false"
            v-on:okAction="funcSetGradeOk" />
        <DialogSetLimit ref="dLimit"
            :limitInfo="project.limitInfo"
            :maxV="maxV"
            :dialogFormVisible="dialogVisibleSetLimit"
            v-on:cancelAction="dialogVisibleSetLimit = false"
            v-on:okAction="funcSetLimitOk" />
        <DialogSetLimitByUser :limitInfoByUser="project.limitInfoByUser"
            :dialogFormVisible="dialogVisibleSetLimitByUser"
            v-on:cancelAction="dialogVisibleSetLimitByUser = false"
            v-on:okAction="funcSetLimitByUserOk" />
        <DialogSelectComponent :dialogFormVisible="dialogVisibleSelectComponent"
            v-on:cancelAction="dialogVisibleSelectComponent = false"
            v-on:okAction="funcSelectComponentOk" />
        <DialogSetEnterRoute :enterRouteInfo="rawEnterRoute"
            :dialogFormVisible="dialogVisibleSetEnterRoute"
            v-on:cancelAction="dialogVisibleSetEnterRoute = false"
            v-on:okAction="funcSetEnterRouteOk" />
        <DialogSetPoint :dialogFormVisible="dialogVisibleSetPoint"
            v-on:cancelAction="dialogVisibleSetPoint = false"
            v-on:okAction="funcSetPointOk" />
        <DialogSetProject :dialogFormVisible="dialogVisibleSetProject"
            v-on:cancelAction="dialogVisibleSetProject = false"
            v-on:okAction="funcSetProjectOk"
            v-on:dropAction="funcSetProjectDrop" />
    </div>
</template>

<script>
import {
    registerCallback,
    unregisterCallback,
    sendSock,
    getPackage,
} from "@/utils/ws";
import XLSX from "xlsx";
import * as joint from "jointjs";
import Paper from "@/views/lines/LinePaper";

import Header from "./controls/Header";
import ProjectInfo from "./controls/ProjectInfo";
import CellInfo from "./controls/CellInfo";
import ContextMenu from "./controls/ContextMenu";
import DialogSaveComponent from "./controls/DialogSaveComponent";
import DialogSetGrade from "./controls/DialogSetGrade";
import DialogSetLimit from "./controls/DialogSetLimit";
import DialogSetLimitByUser from "./controls/DialogSetLimitByUser";
import DialogSelectComponent from "./controls/DialogSelectComponent";
import DialogSetEnterRoute from "./controls/DialogSetEnterRoute";
import DialogSetPoint from "./controls/DialogSetPoint";
import DialogSetProject from "./controls/DialogSetProject";

import fileSaveHelper from "@/utils/fileSaveHelper";
import * as Utils from "@/utils/util";

import PaperUtil from "./model/PaperUtil";

import * as ProjectData from "./model/ProjectData";
import _ from "lodash";

import ComponentUtil from "./model/ComponentUtil";
import * as ConfigStation from "./config_station";

export default {
    components: {
        Header,
        ProjectInfo,
        CellInfo,
        ContextMenu,
        DialogSaveComponent,
        DialogSetGrade,
        DialogSetLimit,
        DialogSelectComponent,
        DialogSetLimitByUser,
        DialogSetEnterRoute,
        DialogSetPoint,
        DialogSetProject,
    },
    data() {
        return {
            title: "",
            project: {
                projectName: "未命名线路",
                projectId: Utils.getUUID(),
                projectDescription: "",
                paperInfo: {
                    backgroundColor: "#304156",
                    mainLineColor: "#001528",
                    subLineColor: "#1f2d3d",
                    showGrid: true,
                    translate: {
                        tx: 0,
                        ty: 0,
                    },
                    scale: 1,
                },
                assistInfo: {
                    showCoordinate: false,
                    showMiniMap: false,
                    locked: false,
                },
                teams: [],
                selectedCell: null,
                contextMenuEvt: null,
                contextMenuVisible: false,
                contextMenuCell: null,
                gradeInfo: { uniformGradeValue: 0, useUniform: true, data: [] },
                limitInfo: {
                    uniformLimitValue: 85,
                    platFormV: 60,
                    useUniform: true,
                    data: [],
                },
                limitInfoByUser: { data: [] },
            },
            rawGrade: [],
            rawGradeSend: [],
            rawLimit: [],
            rawLimitSend: [],
            rawStationLimit: [],
            rawEnterRoute: [],
            rawEnterRouteSend: [],
            dialogVisibleSaveComponent: false,
            dialogVisibleSetGrade: false,
            dialogVisibleSetLimit: false,
            dialogVisibleSetLimitByUser: false,
            dialogVisibleSelectComponent: false,
            dialogVisibleSetEnterRoute: false,
            dialogVisibleSetPoint: false,
            dialogVisibleSetProject: false,
            selectFileFunc: "读取项目",
            currentLine: null,
            trainType: "",
            maxV: 80,
            stationList: [],
            lineBaseData: {},
        };
    },
    created() {
        registerCallback("linedesign", this.wsCallback);
    },
    methods: {
        drop(e) {
            let bicon = e.dataTransfer.getData("ComponentData");
            let component = e.dataTransfer.getData("ComplexComponentData");
            if (bicon) {
                bicon = JSON.parse(bicon);
                this.paper.drawElement(bicon, e);
            } else if (component) {
                component = JSON.parse(component);
                this.paper.drawComponent(component, e);
            }
        },
        allowDrop(ev) {
            ev.preventDefault();
        },
        initJoint() {
            window.joint = joint;
            this.V = joint.V;
            this.graph = new joint.dia.Graph();
            this.g = joint.g;

            let element = document.getElementsByClassName("canvasArea");

            this.paper = new Paper({
                el: element,
                model: this.graph,
                gridSize: 30,
                embeddingMode: true,
                drawGrid: {
                    name: "doubleMesh",
                    args: [
                        {
                            color: this.project.paperInfo.mainLineColor,
                            thickness: 1,
                        },
                        {
                            color: this.project.paperInfo.subLineColor,
                            scaleFactor: 5,
                            thickness: 3,
                        },
                    ],
                },
                width: 5000,
                height: 2000,
                background: {
                    color: this.project.paperInfo.backgroundColor,
                },
            });
            this.paper.project = this.project;
            this.paper.initPaperEvent();
        },
        funcTest() {
            this.$message({
                message: `该功能待实现...`,
                type: "info",
            });
        },
        onExportProjectFile() {
            let jsonData = this.paper.getJsonData();
            jsonData.projectName = jsonData.projectName
                ? jsonData.projectName
                : "未命名线路";

            fileSaveHelper.saveAsJson(jsonData, jsonData.projectName);
        },
        funcExportProjectToPng() {
            let paperSize = this.paper.getContentBBox();
            paperSize.x = (paperSize.x + this.paper.translate().tx) / 2;
            paperSize.y = (paperSize.y + this.paper.translate().ty) / 2;
            saveSvgAsPng(
                this.paper.svg.childNodes[1],
                `${this.project.projectName}.png`,
                {
                    left: paperSize.x,
                    top: paperSize.y,
                    width: paperSize.width,
                    height: paperSize.height,
                    backgroundColor: this.project.paperInfo.backgroundColor,
                }
            );
        },
        funcClearCache() {
            let mainThis = this;
            this.$confirm(
                "确定清除所有localStorage内容?\n模板数据将被清空!",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    localStorage.clear();
                    mainThis.$refs.headerPanel.getComponents();
                    this.$message({
                        type: "success",
                        message: "清除 localStorage 成功!",
                    });
                })
                .catch((e) => {
                    this.$message({
                        type: "warning",
                        message: "已取消",
                    });
                });
        },
        onSaveAsComponent() {
            let mainThis = this;
            let paperSize = this.paper.getContentBBox();
            this.paper.clearVirtualPort();
            let component = this.paper.getStationComponentData(
                {},
                paperSize.x,
                paperSize.y
            );
            component.logicData = PaperUtil.makeLogicData(this.paper);
            this.project.logicData = component.logicData;
            paperSize.x = (paperSize.x + this.paper.translate().tx) / 2;
            paperSize.y = (paperSize.y + this.paper.translate().ty) / 2;
            svgAsPngUri(
                this.paper.svg.childNodes[1],
                {
                    backgroundColor: "#304156",
                    left: paperSize.x,
                    top: paperSize.y,
                    width: 100,
                    height: 68,
                },
                async (uri) => {
                    this.paper.drawLink();
                    let paperSize = this.paper.getContentBBox();
                    paperSize.x = (paperSize.x + this.paper.translate().tx) / 2;
                    paperSize.y = (paperSize.y + this.paper.translate().ty) / 2;
                    saveSvgAsPng(
                        this.paper.svg.childNodes[1],
                        `${component.name}.png`,
                        {
                            left: paperSize.x,
                            top: paperSize.y,
                            width: paperSize.width,
                            height: paperSize.height,
                            backgroundColor:
                                this.project.paperInfo.backgroundColor,
                        }
                    );

                    // 设置缩略图
                    component.thumbnail = uri;
                    if (component.logicData.links) {
                        component.logicData.links.forEach((link) => {
                            link.startCell = null;
                            link.endCell = null;
                        });
                    }
                    // 当前正在保存的组件
                    mainThis.currentComponent = component;
                }
            );

            this.dialogVisibleSaveComponent = true;
        },
        funcSaveComponentCancel() {
            this.dialogVisibleSaveComponent = false;
            this.paper.clearLink();
        },
        funcSaveComponentOk(formData) {
            this.dialogVisibleSaveComponent = false;
            if (this.currentComponent) {
                this.currentComponent.name = formData.name;
                this.currentComponent.desc = formData.desc;
                this.currentComponent.InterLocking = formData.InterLocking;
                this.currentComponent.RouteInfo = formData.RouteInfo;
                // 存储
                let components = localStorage.getItem("train_run_components");
                if (!components) {
                    components = [];
                } else {
                    components = JSON.parse(components);
                }
                components.push(this.currentComponent);
                this.paper.clearLink();
                localStorage.setItem(
                    "train_run_components",
                    JSON.stringify(components)
                );
                this.$refs.headerPanel.getComponents();
                this.$message({
                    message: "组件已保存",
                    type: "success",
                });
            }
        },
        funcSetGradeOk(gradeData) {
            this.dialogVisibleSetGrade = false;
            this.project.gradeInfo = _.cloneDeep(gradeData);
            let rateInfo = this.paper.getKmGridRate();

            this.rawGrade = Utils.getRawGrade(
                this.project.gradeInfo,
                rateInfo.minKm,
                rateInfo.maxKm
            );
            this.project.gradeInfo.data = this.rawGrade[0].concat(
                this.rawGrade[1]
            );
            this.rawGradeSend = Utils.getRawGradeCanSend(this.rawGrade);
            this.paper.drawGrade(this.rawGrade);
        },
        funcSetLimitOk(limitData) {
            this.dialogVisibleSetLimit = false;
            this.project.limitInfo = _.cloneDeep(limitData);
            let rateInfo = this.paper.getKmGridRate();
            this.rawLimit = Utils.checkLimitData(
                this.project.limitInfo,
                rateInfo.minKm,
                rateInfo.maxKm
            );

            let tmp = this.rawLimit[0].concat(this.rawLimit[1]);
            this.project.limitInfo.data = tmp;
            this.rawLimitSend = this.paper.filterRawLimit(
                this.rawLimit,
                this.project.limitInfo
            );

            this.paper.drawLimit(this.rawLimit);
        },
        funcSetLimitByUserOk(limits) {
            this.dialogVisibleSetLimitByUser = false;
            this.project.limitInfoByUser = _.cloneDeep(limits);
            this.rawLimitByUser = Utils.getRawLimitByUser(
                this.project.limitInfoByUser
            );
        },
        funcSelectComponentOk(c) {
            this.dialogVisibleSelectComponent = false;
            if (c) {
                this.paper.changeStation(c);
            }
        },
        funcSetPointOk(pointTypeNum) {
            this.paper.setAllPointType(pointTypeNum);
            this.dialogVisibleSetPoint = false;
        },
        funcSetEnterRouteOk(enterRouteData) {
            this.dialogVisibleSetEnterRoute = false;
            this.rawEnterRoute = _.cloneDeep(enterRouteData);
            this.rawEnterRouteSend = Utils.getRawEnterRouteSend(
                this.rawEnterRoute
            );
        },
        funcSetProjectOk() {
            this.onExportProjectFile();
            this.paper.model.clear();
            let np = ProjectData.getProjectData();
            this.paper.project = np;
            this.project = np;
            this.dialogVisibleSetProject = false;
        },
        funcSetProjectDrop() {
            this.paper.model.clear();
            let np = ProjectData.getProjectData();
            this.paper.project = np;
            this.project = np;
            this.dialogVisibleSetProject = false;
        },
        fileSelectorOpen(act) {
            this.selectFileFunc = act;
            $("#fileSelector").click();
        },
        selectFileFinish(evt) {
            // 保存到缓存的变量
            let localName = null;
            let localData = null;

            // 读文件
            let mainThis = this;
            const files = evt.target.files;
            this.project.selectedCell = null; // 读取文件必须取消选中
            if (files && files.length > 0) {
                const file = files[0];
                localName = file.name;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        localData = e.target.result;
                        if (mainThis.selectFileFunc == "读取项目") {
                            let json = JSON.parse(e.target.result);
                            mainThis.paper.loadJsonData(json);
                            mainThis.$message({
                                message: "读取文件成功",
                                type: "success",
                            });

                            if (json.gradeInfo) {
                                let rateInfo = mainThis.paper.getKmGridRate();
                                mainThis.rawGrade = Utils.getRawGrade(
                                    json.gradeInfo,
                                    rateInfo.minKm,
                                    rateInfo.maxKm
                                );
                                mainThis.rawGradeSend =
                                    Utils.getRawGradeCanSend(mainThis.rawGrade);
                            }
                            if (json.limitInfo) {
                                let rateInfo = mainThis.paper.getKmGridRate();
                                mainThis.rawLimit = Utils.checkLimitData(
                                    json.limitInfo,
                                    rateInfo.minKm,
                                    rateInfo.maxKm
                                );
                                mainThis.rawLimitSend =
                                    mainThis.paper.filterRawLimit(
                                        mainThis.rawLimit,
                                        json.limitInfo
                                    );
                            }

                            try {
                                localStorage.clear();
                                localStorage.setItem(
                                    `${mainThis.currentLine}-json`,
                                    localData
                                );
                            } catch (err) {
                                console.log(err);
                            }
                            json.selectedCell = null;
                            json.contextMenuVisible = false;
                            mainThis.project = json;
                        } else if (mainThis.selectFileFunc == "加载组件") {
                            let json = JSON.parse(e.target.result);
                            let components = localStorage.getItem(
                                "train_run_components"
                            );
                            if (!components) {
                                components = [];
                            } else {
                                components = JSON.parse(components);
                            }

                            components = components.concat(json);
                            localStorage.setItem(
                                "train_run_components",
                                JSON.stringify(components)
                            );
                            mainThis.$refs.headerPanel.getComponents();
                            mainThis.$message({
                                message: "组件读取成功",
                                type: "success",
                            });
                        } else if (mainThis.selectFileFunc == "FS同步") {
                            let fsData = {};

                            let data = e.target.result;
                            let workbook = XLSX.read(data, { type: "binary" });

                            function _getRows(str) {
                                let rows = [];
                                let rowStrs = str.split("\n");
                                for (let i = 0; i < rowStrs.length; i++) {
                                    let row = rowStrs[i];
                                    let items = row.split(",");
                                    if (
                                        items.length > 2 &&
                                        items[0].length == 0 &&
                                        items[1].length == 0
                                    ) {
                                        break;
                                    } else {
                                        rows.push(items);
                                    }
                                }
                                return rows;
                            }

                            let name = workbook.SheetNames[0];
                            let sheedData = XLSX.utils.sheet_to_csv(
                                workbook.Sheets[name]
                            );
                            let rows = _getRows(sheedData);
                            fsData.fslinks = [];
                            for (let i = 1; i < rows.length - 1; i++) {
                                fsData.fslinks.push({
                                    link: Number(rows[i][0]),
                                    fslink: Number(rows[i][1]),
                                    realLength: Number(rows[i][2]),
                                });
                            }

                            name = workbook.SheetNames[1];
                            sheedData = XLSX.utils.sheet_to_csv(
                                workbook.Sheets[name]
                            );
                            rows = _getRows(sheedData);
                            fsData.grades = [];
                            for (let i = 1; i < rows.length - 1; i++) {
                                fsData.grades.push({
                                    start: Number(rows[i][1]),
                                    startOffset: Number(rows[i][2]),
                                    end: Number(rows[i][3]),
                                    endOffset: Number(rows[i][4]),
                                    grade: Number(rows[i][5]),
                                    dir: Number(rows[i][6]),
                                    r: Number(rows[i][7]),
                                });
                            }

                            name = workbook.SheetNames[2];
                            sheedData = XLSX.utils.sheet_to_csv(
                                workbook.Sheets[name]
                            );
                            rows = _getRows(sheedData);
                            fsData.limits = [];
                            for (let i = 1; i < rows.length - 1; i++) {
                                fsData.limits.push({
                                    link: Number(rows[i][1]),
                                    start: Number(rows[i][2]),
                                    end: Number(rows[i][3]),
                                    limit: Number(rows[i][4]),
                                });
                            }
                            PaperUtil.makeGlobalMapData(mainThis.paper);
                            mainThis.paper.updateKmFromFS(fsData);
                        }
                    } catch (err) {
                        mainThis.$message({
                            message: "读取文件失败",
                            type: "error",
                        });
                        console.log(err);
                    }
                    evt.target.value = null;
                };
                if (mainThis.selectFileFunc != "FS同步") {
                    reader.readAsText(file);
                } else {
                    reader.readAsBinaryString(file);
                }
            } else {
                this.$message({
                    message: "读取文件过程中发生一点小问题",
                    type: "warning",
                });
            }
        },
        onDataTest(key) {
            if (key == "link+") {
                PaperUtil.makeGlobalMapData(this.paper);
                return;
            } else if (key == "drawLink") {
                this.paper.drawLink();
            } else if (key == "clearLink") {
                this.paper.clearLink();
            } else if (key == "fsSetting") {
                this.fileSelectorOpen("FS同步");
            } else if (key == "test") {
                let cells = this.paper.model.getElements();
                let findCell = cells.find((item) => {
                    return (
                        item.attributes.type == "tct.Bumper" &&
                        item.attributes.tctData.tctId == 1
                    );
                });
                console.log(findCell.attributes.tctData.km);
            }
        },
        onSetRunParam() {
            let param1 = getPackage(111, this.lineBaseData.basicData);
            console.log("111---");
            console.log(param1);
            if (this.lineBaseData.basicData) {
                sendSock(param1);
            }
            let param3 = getPackage(112, this.lineBaseData.signalData);
            if (this.lineBaseData.signalData) {
                sendSock(param3);
            }

            let param2 = getPackage(113, this.lineBaseData.trainFeatureData);
            if (this.lineBaseData.trainFeatureData) {
                sendSock(param2);
            }

            let param4 = getPackage(114, this.lineBaseData.operateData);
            if (this.lineBaseData.operateData) {
                sendSock(param4);
            }

            let saveParam = getPackage(138, {
                operaType: 1,
                lineName: this.currentLine,
                strJsonData: JSON.stringify(this.paper.getJsonData()),
            });

            sendSock(saveParam);

            let dsuLineData = PaperUtil.makeGlobalMapData(this.paper);

            dsuLineData = fileSaveHelper.transDataV2(dsuLineData);
            dsuLineData.gradeCmData = this.rawGradeSend;
            dsuLineData.lsCmData = this.rawLimitSend;
            dsuLineData.lsBizCmData = this.rawLimitByUser;
            dsuLineData.routeData = this.rawEnterRouteSend;
            dsuLineData.LineName = this.currentLine; // 0430新增
            console.log("--- send 110 data ---");
            console.log(dsuLineData);

            sessionStorage.setItem("cfgLineJson", 1);
            let param = getPackage(110, dsuLineData);
            sendSock(param);
        },
        onStartTest() {
            let data = {
                lineName: this.currentLine,
                trainRunGraphName: "车底时刻表.xls", // 列车运行图名称--暂定为：“运行图车底时刻表.xls”
                passengerDataName: "7号线OD数据2期（假设）.xls", // 客流数据名称--暂定为：“7号线OD数据2期（假设）.xls”
                dataSource: 1, // [待确认是否这样填写] 运行数据来源 1--前端 0--后端
                runHour: "4" /*  运行时长 单位为小时,能力分析跑车暂定为4*/,
                runType: 0x01, //  这个属性是否这样填写
            };
            let simuParam = getPackage(107, data);
            console.log("--- simulate param ----");
            console.log(simuParam);
            sendSock(simuParam);
        },
        onExportComponent() {
            let components = localStorage.getItem("train_run_components");
            if (!components) {
                components = [];
            } else {
                components = JSON.parse(components);
            }
            fileSaveHelper.saveAsJson(components, `组件列表`);
        },
        paperSet() {
            let type = arguments[0];
            if (type == "scale") {
                this.paper.scalePaper(arguments[1]);
            } else if (type == "background") {
                this.paper.updateBackground();
            } else if (type == "grid") {
                this.paper.updateGrid();
            } else if (type == "translate") {
                this.paper.translatePaper(
                    arguments[1],
                    arguments[2],
                    arguments[3]
                );
            }
        },
        onDirectionChange(cell) {
            this.paper.updateDirection(cell);
        },
        onUpdateCellLayout(cell) {
            this.paper.updateCellLayout(cell);
            if (cell.attributes.type == "tct.Station") {
                if (cell.attributes.drawData.stationComponentId) {
                    let findC = this.project.components.find((c) => {
                        return (
                            cell.attributes.drawData.stationComponentId == c.id
                        );
                    });
                    if (findC) {
                        ComponentUtil.updateStopAreaName(
                            cell.attributes.tctData.name,
                            findC,
                            this.paper
                        );
                    }
                }
            }
        },
        onSiliyMockStopAreaIdChange(cell) {
            this.paper.siliyMockStopAreaIdChange(cell);
        },
        onSetComponentKmOffset(cid, value) {
            this.paper.setComponentKmOffset(cid, value);
        },
        onContextMenuClick(menu) {
            this.paper.action(menu);
            if (menu == "更换站型") {
                this.dialogVisibleSelectComponent = true;
            } else if (menu == "删除车站") {
                this.paper.removeStation();
            } else if (menu == "编辑坡度") {
                if (this.$refs.dGrad) {
                    this.$refs.dGrad.setHId(
                        this.project.contextMenuCell.model.attributes.tctData
                    );
                }
                this.dialogVisibleSetGrade = true;
            } else if (menu == "编辑限速") {
                if (this.$refs.dLimit) {
                    this.$refs.dLimit.setHId(
                        this.project.contextMenuCell.model.attributes.tctData
                    );
                }
                this.dialogVisibleSetLimit = true;
            }
        },
        location(s) {
            this.paper.location(s);
        },
        getLineBaseData() {
            let param = getPackage(115, this.currentLine);
            sendSock(param);

            param = getPackage(116, this.currentLine);
            sendSock(param);

            param = getPackage(118, this.currentLine);
            sendSock(param);
        },
        wsCallback(res) {
            if (res.msgType == 238) {
                console.log(res);
                let lineData = res.data;
                this.$message({
                    message: res.msg,
                    type: res.status == 1 ? "success" : "warning",
                });
                if (res.status != 1) {
                    return;
                }

                let needLoad = false;
                if (lineData.strJsonData) {
                    console.log("load line from server");
                    this.cacheData = JSON.parse(lineData.strJsonData);
                    needLoad = true;
                    this.hasFirstLoad = true;
                } else if (this.cacheData && !this.hasFirstLoad) {
                    console.log("load line from cache");
                    needLoad = true;
                    this.firstLoad = true;
                }

                if (needLoad) {
                    this.paper.loadJsonData(this.cacheData);
                    if (this.cacheData.gradeInfo) {
                        let rateInfo = this.paper.getKmGridRate();
                        this.rawGrade = Utils.getRawGrade(
                            this.cacheData.gradeInfo,
                            rateInfo.minKm,
                            rateInfo.maxKm
                        );
                        this.rawGradeSend = Utils.getRawGradeCanSend(
                            this.rawGrade
                        );
                    } else {
                        this.cacheData.gradeInfo =
                            ProjectData.getProjectData().gradeInfo;
                    }
                    if (this.cacheData.limitInfo) {
                        let rateInfo = this.paper.getKmGridRate();
                        this.rawLimit = Utils.checkLimitData(
                            this.cacheData.limitInfo,
                            rateInfo.minKm,
                            rateInfo.maxKm
                        );
                        this.rawLimitSend = this.paper.filterRawLimit(
                            this.rawLimit,
                            this.cacheData.limitInfo
                        );
                    } else {
                        this.cacheData.limitInfo =
                            ProjectData.getProjectData().limitInfo;
                    }
                    if (this.cacheData.limitInfoByUser) {
                        this.rawLimitByUser = Utils.getRawLimitByUser(
                            this.cacheData.limitInfoByUser
                        );
                    } else {
                        this.cacheData.limitInfoByUser =
                            ProjectData.getProjectData().limitInfoByUser;
                    }
                    this.cacheData.selectedCell = null;
                    this.cacheData.contextMenuVisible = false;
                    this.project = this.cacheData;
                }
            } else if (res.msgType == 210) {
                sessionStorage.setItem("cfgLineJson", 1);
                this.$message({
                    message: res.msg,
                    type: res.status == 1 ? "success" : "warning",
                });
            } else if (res.msgType == 215) {
                console.log("215---");
                console.log(res);
                this.lineBaseData.basicData = res.data;
                if (this.lineBaseData.basicData) {
                    // 获取速度等级
                    let find =
                        this.lineBaseData.basicData.BasicData.BasicData.find(
                            (item) => {
                                return item.Define == "速度等级";
                            }
                        );
                    if (find) {
                        this.maxV = Number(find.data);
                    }

                    // 缓存车型
                    let find1 =
                        this.lineBaseData.basicData.BasicData.BasicData.find(
                            (item) => {
                                return item.Define == "车辆选型";
                            }
                        );
                    let find2 =
                        this.lineBaseData.basicData.BasicData.BasicData.find(
                            (item) => {
                                return item.Define == "列车编组";
                            }
                        );
                    if (find1 && find1) {
                        this.trainType = find2.data + find1.data;
                        let key = `${this.currentLine}-trainType`;
                        sessionStorage.setItem(key, this.trainType);
                    }

                    // 解决车型undefined问题
                    let name = this.currentLine + this.trainType;
                    let param = getPackage(117, name);
                    sendSock(param);
                }
            } else if (res.msgType == 216) {
                this.lineBaseData.signalData = res.data;
            } else if (res.msgType == 207) {
                // todo nothing
            } else if (res.msgType == 218) {
                this.lineBaseData.operateData = res.data;
            } else if (res.msgType == 217) {
                this.lineBaseData.trainFeatureData = res.data;
            }

            if (res.msgType) {
                console.log(res);
            }
        },
        getStationList() {
            this.stationList = [];
            if (this.currentLine == "北京轨道交通16号线") {
                this.stationList = ConfigStation.c16;
            }
        },
    },
    mounted() {
        this.initJoint();
        this.currentLine = sessionStorage.getItem("currentLine");
        this.trainType = sessionStorage.getItem(
            `${this.currentLine}-trainType`
        );
        if (this.currentLine) {
            let strData = localStorage.getItem(this.currentLine + "-json");
            if (strData) {
                this.cacheData = JSON.parse(strData);
            }

            let param = getPackage(138, {
                operaType: 2,
                lineName: this.currentLine,
            });
            sendSock(param);
        }
        this.getLineBaseData();
        this.getStationList();
    },
    beforeDestroy() {
        unregisterCallback("linedesign");
    },
};
</script>

<style scoped>
.window {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    padding: 0 10px;
}

.header {
    border-width: 0px 0px 1px 0px;
    border-color: #ccc;
    border-style: solid;
    padding: 0px 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}

.container {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 100%;
}

.leftpanel {
    width: 230px;
    padding-right: 10px;
    height: 100%;
}

.drawarea {
    flex: 1;
    overflow: hidden;
    position: relative;
    height: calc(100vh - 100px);
}

.draw-canvas {
    height: 100%;
    background: #11e1;
}

.inner-header {
    height: 100%;
    width: 100%;
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
    width: 150px;
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

.el-select >>> .el-input__icon {
    line-height: 20px;
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

.el-table >>> td {
    padding: 3px 3px;
}

.module-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 10px;
    margin: 0 50px 20px 0;
    border: 0px solid #666;
    background: #efefef;
    height: 100%;
    min-width: 300px;
}

.module-panel-middle {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 10px;
    margin: 0 50px 20px 0;
    border: 0px solid #666;
    background: #efefef;
    height: 100%;
    min-width: 500px;
}

.module-panel-right {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    padding: 10px;
    margin: 0 50px 20px 0;
    border: 0px solid #666;
    background: #efefef;
    height: 100%;
    min-width: 300px;
}

.module-inner-left {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}

.station-list {
    background: #0a2039;
    height: 180px;
    width: 100%;
    position: absolute;
    bottom: 0px;
    overflow-x: auto;
    overflow-y: hidden;
}

.station-list-panel {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.img-line16 {
    position: absolute;
    left: 0px;
}

.station-block {
    position: absolute;
    height: 80px;
    width: 100px;
    border: 0px #0780e8 solid;
    text-align: center;
    padding-top: 10px;
    font-weight: bold;
    background: #ccc0;
}

.station-block:hover {
    cursor: pointer;
    background: #ccc1;
}

.station-block:active {
    cursor: pointer;
    background: #0d77d311;
}
</style>