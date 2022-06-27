import BaseData from './BaseData';

import { DSU_Link, DSU_Point, DSU_StopArea, DSU_Signal, DSU_LogicSegment, DSU_Stop } from './DSUModel';

let PaperUtil = {};

/**
 * 获取全线电子地图数据
 * @param {*} paper 
 */
PaperUtil.makeGlobalMapData = (paper) => {
    paper.project.logicData = PaperUtil.makeLogicData(paper);
    updateComponentLinkMap(paper);
    paper.project.logicData.InterLocking = getInterLockingData(paper);

    let dsuLineData = {
        link: paper.project.logicData.links,
        point: paper.project.logicData.points,
        axle: paper.project.logicData.axles,
        signal: paper.project.logicData.signals,
        balise: [],
        grade: [],
        uinifyGrade: paper.project.logicData.uinifyGrade,
        staticRestrict: [],
        uinifyRestrict: paper.project.logicData.uinifyRestrict,
        axleSegment: paper.project.logicData.axleSegments,
        logicSegment: paper.project.logicData.logicSegments,
        stopPoint: paper.project.logicData.stops,
        stopArea: paper.project.logicData.stopAreas,
        station: paper.project.logicData.stations,
        InterLocking: paper.project.logicData.InterLocking,
    };

    return dsuLineData;
};

/**
 * 生成逻辑数据
 * @param {*} paper 
 */
PaperUtil.makeLogicData = (paper) => {
    let map = {}; // 返回的车站组件电子地图数据
    let data = {}; // 计算过程存储的数据

    data.lineGroup = makeLineGroup(paper);
    let tmp = makeLinkGroupAndPointLinkInfo(paper, data.lineGroup)
    map.links = getLinks(tmp.linkGroup, tmp.pointLinkInfo, paper);
    map.points = getPoints(tmp.pointLinkInfo);
    map.stopAreas = getStopAreas(tmp.stopAreaLinkInfo);
    map.stops = getStops(map.stopAreas, map.links, paper);
    map.signals = getSignals(map.links, paper);
    map.balises = [];
    map.uinifyGrade = [[1, Number(paper.project.gradeInfo.uniformGradeValue)]];
    map.uinifyRestrict = [[1, parseInt((Number(paper.project.limitInfo.uniformLimitValue) * 1000) / 36)]];
    map.axleSegments = getAxleSegments(map.links, map.points);
    map.logicSegments = getLogicSegments(map.axleSegments, map.links, paper);
    map.axles = getAxles(map.links, paper);
    map.stations = [];

    return map;
};

/**
 * 生成逻辑上的线段组,并包含所有相关元素
 * @param {*} paper 
 * @return {*} {stri}
 */
let makeLineGroup = (paper) => {

    let lineGroup = [];

    // 所有元素
    let models = paper.model.getCells();

    let tracks = models.filter(m => {
        return m.attributes.type == 'tct.Track';
    });

    let trackVisit = []; // 轨道访问记录

    let createLineSegment = (trackId) => {
        if (trackVisit.indexOf(trackId) > -1) {
            return null;
        }

        trackVisit.push(trackId);

        let track = paper.getViewById(trackId);

        let segment = {
            direction: track.model.attributes.tctData.direction.value,
            lines: [trackId],
            elements: [],
            stopAreas: [],
            start: null,
            end: null
        };

        // segment.elements = _.cloneDeep(track.model.attributes.drawData.elements);
        // segment.elements.concat(_.cloneDeep(track.model.attributes.drawData.stations));

        if (track.model.attributes.drawData.elements) {
            // 查找计轴
            let axles = track.model.attributes.drawData.elements.filter(e => {
                return e.type == 'tct.Axle';
            });
            segment.elements = _.cloneDeep(axles);

            // 查找停车区域
            let stopAreas = track.model.attributes.drawData.elements.filter(e => {
                return e.type == 'tct.StopArea';
            });
            segment.stopAreas = _.cloneDeep(stopAreas);
        }
        if (track.model.attributes.drawData.nodeOne) {
            if (track.model.attributes.drawData.nodeOne.type != 'tct.Bumper' && track.model.attributes.drawData.nodeOne.type != 'tct.Point') {
                let subSegment = createLineSegment(track.model.attributes.drawData.nodeOne.id);
                if (subSegment) {
                    segment.elements = segment.elements.concat(subSegment.elements);
                    segment.lines = segment.lines.concat(subSegment.lines);
                    segment.stopAreas = segment.stopAreas.concat(subSegment.stopAreas);
                    segment.start = subSegment.start;
                }
            } else {
                segment.start = track.model.attributes.drawData.nodeOne;
            }
        }

        if (track.model.attributes.drawData.nodeTwo) {
            if (track.model.attributes.drawData.nodeTwo.type != 'tct.Bumper' && track.model.attributes.drawData.nodeTwo.type != 'tct.Point') {
                let subSegment = createLineSegment(track.model.attributes.drawData.nodeTwo.id);
                if (subSegment) {
                    segment.elements = segment.elements.concat(subSegment.elements);
                    segment.lines = segment.lines.concat(subSegment.lines);
                    segment.stopAreas = segment.stopAreas.concat(subSegment.stopAreas);
                    segment.end = subSegment.end;
                }
            } else {
                segment.end = track.model.attributes.drawData.nodeTwo;
            }
        }

        return segment;
    };

    for (let i = 0; i < tracks.length; i++) {
        let segment = createLineSegment(tracks[i].attributes.id);
        if (!segment) {
            continue;
        }
        let cellCount = segment.elements.length;
        if (segment.start) {
            cellCount++;
        }
        if (segment.end) {
            cellCount++;
        }
        if (cellCount > 1) {
            lineGroup.push(segment);
        }
    }
    return lineGroup;
};

/**
 * 生成Link组和道岔Link信息
 * @param {*} lineGroup 
 */
let makeLinkGroupAndPointLinkInfo = (paper, lineGroup) => {
    let linkCellType = {
        'tct.Bumper': 1,/*线路终点*/
        'tct.Axle': 2,/*计轴点*/
        'tct.Point': 3,/*道岔点*/
        'tct.VirtualPort': 100,/*虚拟端口道岔点*/
        'Default': 0
    };
    let linkGroup = [];
    let pointLinkInfo = [];
    let stopAreaLinkInfo = [];

    /**
     * 设置道岔Link信息
     * @param {*} cell 
     * @param {*} link 
     * @param {*} segment 
     */
    let setPointLinkInfo = (cell, link, segment) => {
        let point = pointLinkInfo.find(p => {
            return p.id == cell.model.attributes.id;
        });

        if (!point) {
            point = {
                id: cell.model.attributes.id,
                tctId: cell.model.attributes.tctData.tctId,
                km: parseInt(Number(cell.model.attributes.tctData.km) * 100),
                angle: cell.model.attributes.angle,
                nodeLeft: cell.model.attributes.drawData.nodeLeft,
                nodeMiddle: cell.model.attributes.drawData.nodeMiddle,
                nodeRight: cell.model.attributes.drawData.nodeRight,
                linkLeft: null,
                linkMiddle: null,
                linkRight: null,
                mainSpeedLimit: 0xfff,
                sideSpeedLimit: 0xffff,
                mainLink: 0xffff,
                sideLink: 0xffff,
                combineLink: 0xffff,
                mainLinkOffset: 0xffff,
                sideLinkOffset: 0xffff,
                combineLinkOffset: 0xffff,
                relatedPoint: 0xffff,
            };
            pointLinkInfo.push(point);
        }

        for (let i = 0; i < segment.lines.length; i++) {
            if (point.nodeLeft.id == segment.lines[i]) {
                point.linkLeft = link.id;
                break;
            } else if (point.nodeMiddle.id == segment.lines[i]) {
                point.linkMiddle = link.id;
                break;
            } else if (point.nodeRight.id == segment.lines[i]) {
                point.linkRight = link.id;
                break;
            }
        }
    };

    /**
     * 设置停车区域Link信息
     * @param {*} km1 
     * @param {*} km2 
     * @param {*} segment 
     * @param {*} link 
     */
    let setStopAreaInfo = (km1, km2, segment, link) => {
        if (segment.stopAreas) {
            segment.stopAreas.forEach(sa => {
                let view = paper.getViewById(sa.id);
                if (!view) {
                    console.log('--- [WARNING] please check the data ---')
                    console.log(segment)
                    console.log(sa)
                } else {
                    // 判断停车区是否在Link区间
                    if (Number(view.model.attributes.tctData.km1) >= Number(km1) && Number(view.model.attributes.tctData.km2) <= Number(km2)) {
                        let findStopArea = stopAreaLinkInfo.find(s => {
                            return s.id == sa.id;
                        });
                        if (!findStopArea) {
                            findStopArea = {
                                id: sa.id,
                                linkId: link.id,
                                ...view.model.attributes.tctData
                            };
                            stopAreaLinkInfo.push(findStopArea);
                        }
                    }
                }
            });
        }
    };

    let globalId = 1;
    lineGroup.forEach(segment => {
        let start = null, end = null;
        let arr = [];
        if (segment.start) {
            start = paper.getViewById(segment.start.id);
            arr.push(start);
        }
        if (segment.end) {
            end = paper.getViewById(segment.end.id);
            arr.push(end);
        }

        segment.elements.forEach(e => {
            arr.push(paper.getViewById(e.id));
        });

        arr.sort((a, b) => {
            return a.model.attributes.tctData.km - b.model.attributes.tctData.km;
        });

        let linkSegment = [];
        for (let i = 0; i < arr.length - 1; i++) {
            let link = new DSU_Link();
            link.id = globalId++;           //【索引编号】
            // link.length = parseInt((arr[i + 1].model.attributes.tctData.km - arr[i].model.attributes.tctData.km) * 100);            //【Link长度（cm）】
            link.length = parseInt(arr[i + 1].model.attributes.tctData.km * 100) - parseInt(arr[i].model.attributes.tctData.km * 100);            //【Link长度（cm）】
            link.direction = segment.direction == BaseData.Direction.Up.value ? 0x55 : segment.direction == BaseData.Direction.Down.value ? 0xaa : 0xffff;  // 【线路上下行】0xaa=下行 0x55=上行
            link.startCellType = linkCellType[arr[i].model.attributes.type];    //【起点端点类型】
            link.startCellId = arr[i].model.attributes.tctData.tctId;       //【起点端点编号】
            link.startKm = Number(arr[i].model.attributes.tctData.km);

            link.endCellType = linkCellType[arr[i + 1].model.attributes.type];;      //【终点端点类型】
            link.endCellId = arr[i + 1].model.attributes.tctData.tctId;         //【终点端点编号】

            linkSegment.push(link);

            if (arr[i].model.attributes.type == 'tct.Point') {
                setPointLinkInfo(arr[i], link, segment);
            }
            if (arr[i + 1].model.attributes.type == 'tct.Point') {
                setPointLinkInfo(arr[i + 1], link, segment);
            }

            setStopAreaInfo(arr[i].model.attributes.tctData.km, arr[i + 1].model.attributes.tctData.km, segment, link);
        }
        linkGroup.push(linkSegment);
    });

    pointLinkInfo.forEach(point => {
        if (point.relatedPoint == 0xffff) {
            let findPoint = pointLinkInfo.find(p => {
                return p.id != point.id && p.nodeMiddle.id == point.nodeMiddle.id;
            });

            if (findPoint) {
                point.relatedPoint = findPoint.tctId;
                findPoint.relatedPoint = point.tctId;
            }
        }
    });

    return {
        linkGroup,
        pointLinkInfo,
        stopAreaLinkInfo
    };
};

/**
 * 获取Link信息
 * @param {*} linkGroup 
 * @param {*} pointLinkInfo 
 */
let getLinks = (linkGroup, pointLinkInfo, paper) => {
    let links = [];
    linkGroup.forEach(linkSegment => {
        for (let i = 0; i < linkSegment.length - 1; i++) {
            linkSegment[i].nextLinkNum = linkSegment[i + 1].id;
            linkSegment[i + 1].preLinkNum = linkSegment[i].id;
            links.push(linkSegment[i]);
        }
        links.push(linkSegment[linkSegment.length - 1]);
    });

    pointLinkInfo.forEach(point => {
        let linkLeft = links.find(k => {
            return k.id == point.linkLeft;
        });
        let linkMiddle = links.find(k => {
            return k.id == point.linkMiddle;
        });
        let linkRight = links.find(k => {
            return k.id == point.linkRight;
        });
        let lineLeft = paper.getViewById(point.nodeLeft.id);
        let lineMiddle = paper.getViewById(point.nodeMiddle.id);
        let lineRight = paper.getViewById(point.nodeRight.id);
        let pointCell = paper.getViewById(point.id);
        point.mainSpeedLimit = pointCell.model.attributes.tctData.mainSpeedLimit;
        point.sideSpeedLimit = pointCell.model.attributes.tctData.sideSpeedLimit;

        if (pointCell.model.attributes.tctData.pointDirection == BaseData.PointDirection.Left) {
            let y1 = lineRight.model.attr('line/y1');
            let y2 = lineRight.model.attr('line/y2');
            if (y1 > y2) {
                point.mainLink = linkMiddle.id;
                point.sideLink = linkLeft.id;
                point.combineLink = linkRight.id;
                if (point.angle == 0) {
                    linkLeft.nextLinkNum = linkRight.id;
                    linkMiddle.nextLinkNum = linkRight.id;
                    linkRight.preLinkNum = linkMiddle.id;
                    linkRight.preSideLinkNum = linkLeft.id;
                    point.mainLinkOffset = linkMiddle.length;
                    point.sideLinkOffset = linkLeft.length;
                    point.combineLinkOffset = 0;
                } else {
                    linkLeft.preLinkNum = linkRight.id;
                    linkMiddle.preLinkNum = linkRight.id;
                    linkRight.nextLinkNum = linkMiddle.id;
                    linkRight.nextSideLinkNum = linkLeft.id;
                    point.mainLinkOffset = 0;
                    point.sideLinkOffset = 0;
                    point.combineLinkOffset = linkRight.length;
                }
            } else {
                point.mainLink = linkLeft.id;
                point.sideLink = linkMiddle.id;
                point.combineLink = linkRight.id;
                if (point.angle == 0) {
                    linkLeft.nextLinkNum = linkRight.id;
                    linkMiddle.nextLinkNum = linkRight.id;
                    linkRight.preLinkNum = linkLeft.id;
                    linkRight.preSideLinkNum = linkMiddle.id;
                    point.mainLinkOffset = linkLeft.length;
                    point.sideLinkOffset = linkMiddle.length;
                    point.combineLinkOffset = 0;
                } else {
                    linkLeft.preLinkNum = linkRight.id;
                    linkMiddle.preLinkNum = linkRight.id;
                    linkRight.nextLinkNum = linkLeft.id;
                    linkRight.nextSideLinkNum = linkMiddle.id;
                    point.mainLinkOffset = 0;
                    point.sideLinkOffset = 0;
                    point.combineLinkOffset = linkRight.length;
                }
            }
        } else {
            let y1 = lineLeft.model.attr('line/y1');
            let y2 = lineLeft.model.attr('line/y2');
            if (y1 < y2) {
                point.mainLink = linkMiddle.id;
                point.sideLink = linkRight.id;
                point.combineLink = linkLeft.id;
                if (point.angle == 0) {
                    linkMiddle.preLinkNum = linkLeft.id;
                    linkRight.preLinkNum = linkLeft.id;
                    linkLeft.nextLinkNum = linkMiddle.id;
                    linkLeft.nextSideLinkNum = linkRight.id;
                    point.mainLinkOffset = 0;
                    point.sideLinkOffset = 0;
                    point.combineLinkOffset = linkLeft.length;
                } else {
                    linkMiddle.nextLinkNum = linkLeft.id;
                    linkRight.nextLinkNum = linkLeft.id;
                    linkLeft.preLinkNum = linkMiddle.id;
                    linkLeft.preSideLinkNum = linkRight.id;
                    point.mainLinkOffset = linkMiddle.length;
                    point.sideLinkOffset = linkRight.length;
                    point.combineLinkOffset = 0;
                }
            } else {
                point.mainLink = linkRight.id;
                point.sideLink = linkMiddle.id;
                point.combineLink = linkLeft.id;
                if (point.angle == 0) {
                    linkMiddle.preLinkNum = linkLeft.id;
                    linkRight.preLinkNum = linkLeft.id;
                    linkLeft.nextLinkNum = linkRight.id;
                    linkLeft.nextSideLinkNum = linkMiddle.id;
                    point.mainLinkOffset = 0;
                    point.sideLinkOffset = 0;
                    point.combineLinkOffset = linkLeft.length;
                } else {
                    linkMiddle.nextLinkNum = linkLeft.id;
                    linkRight.nextLinkNum = linkLeft.id;
                    linkLeft.preLinkNum = linkRight.id;
                    linkLeft.preSideLinkNum = linkMiddle.id;
                    point.mainLinkOffset = linkRight.length;
                    point.sideLinkOffset = linkMiddle.length;
                    point.combineLinkOffset = 0;
                }
            }
        }
    });

    return links;
};

/**
 * 获取道岔信息
 * @param {*} pointLinkInfo 
 */
let getPoints = (pointLinkInfo) => {
    let points = [];
    pointLinkInfo.forEach(info => {
        let point = new DSU_Point();
        point.id = info.tctId;                    // 【道岔编号】
        point.pointName = '道岔' + info.tctId;        // 【道岔名称】
        point.relatePointNum = info.relatedPoint;        // 【联动道岔编号】
        point.km = info.km;                    // 【道岔点公里标】
        point.linkId = info.mainLink;                // 【所处正线link编号】
        point.linkOffset = info.mainLinkOffset;            // 【所处正线link偏移量(cm)】
        point.sideLinkId = info.sideLink;            // 【所处侧线link编号】
        point.sideLinkOffset = info.sideLinkOffset;        // 【所处侧线link偏移量(cm)】
        point.confluentLinkId = info.combineLink;       // 【所处汇合link编号】
        point.confluentLinkOffset = info.combineLinkOffset;   // 【所处汇合link偏移量(cm)】
        // point.speedLimit = info.sideSpeedLimit;          // 【道岔反位静态限制速度(cm/s)】
        point.speedLimit = parseInt(info.sideSpeedLimit * 1000 / 36);          // 【道岔反位静态限制速度(cm/s)】 z
        points.push(point);
    });
    points.sort((a, b) => {
        return a.id - b.id;
    });
    return points;
};

/**
 * 获取停车区域
 * @param {*} stopAreaLinkInfo 
 */
let getStopAreas = (stopAreaLinkInfo) => {
    let stopAreas = [];
    let stationNameMap = [];
    stopAreaLinkInfo.forEach(info => {
        let stopArea = new DSU_StopArea();
        stopArea.stopAreaID = info.stopAreaID;
        stopArea.id = info.tctId;                   //【编号】
        stopArea.stationName = info.stationName;          //【所属车站名称】
        stopArea.desNum = '';               //【目的地编号】 /*新增---严广学 ATS使用 */ /*此处遗留：文档中是单字节数组*/
        stopArea.areaName = info.areaName; // 自己用
        stopArea.linkId = info.linkId;                //【站台物理范围link编号】
        stopArea.attr = 0;                  //【停车区域属性】
        stopArea.minParkTime = info.minStopTime;          //【站台最小停站时间】
        stopArea.maxParkTime = info.maxStopTime;          //【站台最大停站时间】
        stopArea.parkTime = info.defaultStopTime;             //【站台默认停站时间】
        // stopArea.screenCount = 0;           //【站台中屏蔽门数量】
        // stopArea.screenNum1 = 65535;        //【安全屏蔽门编号1】
        // stopArea.screenNum2 = 65535;        //【安全屏蔽门编号2】
        // stopArea.emergStopCount = 0;        //【站台中紧急停车按钮数量】
        // stopArea.emergStopID1 = 65535;      //【紧急停车按钮编号1】
        // stopArea.emergStopID2 = 65535;      //【紧急停车按钮编号2】
        // stopArea.stopPointCount = 0;        //【站台包含停车点数目】
        // stopArea.stopPointID1 = 65535;      //【站台包含停车点编号1】 /*20160314 根据互联互通需求修改 by guojian.hou*/
        // stopArea.stopPointID2 = 65535;      //【站台包含停车点编号2】 /*20160314 根据互联互通需求修改 by guojian.hou*/
        // stopArea.stopPointID3 = 65535;      //【站台包含停车点编号3】 /*20160314 根据互联互通需求修改 by guojian.hou*/
        // stopArea.doorOpenMode = 0;          //【站台开门方式】
        // stopArea.doorOpenTime = 0;          //【站台开门时间间隔】
        // stopArea.doorCloseMode = 0;         //【站台关门方式】
        // stopArea.doorCloseTime = 0;         //【站台关门时间间隔】
        // stopArea.parkSteadyTime = 0;        //【站台默认停稳时间】
        stopArea.location = info.location;     // 上下行信息
        stopArea.subAreasCount = info.subAreasCount >= 0 ? info.subAreasCount : 0;
        if (stationNameMap.indexOf(info.stationName) == -1) {
            stationNameMap.push(info.stationName);
        }
        stopArea.stationID = stationNameMap.indexOf(info.stationName) + 1;             //【站台所属车站编号】

        let attrValue = 0;
        if (info.props.EMAP_STATION_AREA) {
            attrValue += 0x01;
        } else if (info.props.EMAP_REVERT_AREA) {
            attrValue += 0x02;
        } else if (info.props.EMAP_TRANSFORM_AREA) {
            attrValue += 0x04;
        }
        stopArea.attr = attrValue;
        stopArea.subInfo = info.subAreas;

        stopAreas.push(stopArea);

        // --- 虚拟连挂新增的代码 ---

        if (info.subAreasCount > 1) {
            for (let i = 0; i < info.subAreasCount; i++) {
                let sub = _.cloneDeep(stopArea);
                sub.id += 50000;
                sub.id += info.subAreas[i].subId * 1000;
                sub.parentId = stopArea.id;
                sub.subAreasCount = 0;
                sub.subId = info.subAreas[i].subId;
                stopAreas.push(sub);
            }
        }
    });
    stopAreas.sort((a, b) => {
        return a.id - b.id;
    });
    return stopAreas;
}


/**
 * 获取停车点信息
 * @param {*} stopAreas 
 */
let getStops = (stopAreas, links, paper) => {
    let index = 1;
    let stops = [];

    stopAreas.forEach(area => {
        let link = links.find(k => {
            return k.id == area.linkId;
        });

        let model = paper.model.getCells().find(m => {
            return m.attributes.type == 'tct.StopArea' && m.attributes.tctData.tctId == area.id;
        });

        if (model) {
            let stop1 = new DSU_Stop();
            stop1.id = index++;           //【编号】
            stop1.attr = 0x01;       //【停车点属性】
            stop1.dir = 0xaa;           //【停车点作用方向(16进制)】
            stop1.linkId = area.linkId;        //【停车点所处线路link编号】
            stop1.linkOffset = (Number(model.attributes.tctData.km1) - link.startKm) * 100;    //【停车点link偏移量(cm)】
            stop1.stopAreaID = area.id;
            stop1.parentAreaId = 65535;
            stops.push(stop1);

            let stop2 = new DSU_Stop();
            stop2.id = index++;           //【编号】
            stop2.attr = 0x01;       //【停车点属性】
            stop2.dir = 0x55;           //【停车点作用方向(16进制)】
            stop2.linkId = area.linkId;        //【停车点所处线路link编号】
            stop2.linkOffset = (Number(model.attributes.tctData.km2) - link.startKm) * 100;    //【停车点link偏移量(cm)】
            stop2.stopAreaID = area.id;
            stop2.parentAreaId = 65535;
            stops.push(stop2);

            model.attributes.tctData.stop1ID = stop1.id;
            model.attributes.tctData.stop2ID = stop2.id;

            area.stopPointCount = 2;        //【站台包含停车点数目】
            area.stopPointID1 = stop1.id;      //【站台包含停车点编号1】 /*20160314 根据互联互通需求修改 by guojian.hou*/
            area.stopPointID2 = stop2.id;      //【站台包含停车点编号2】 /*20160314 根据互联互通需求修改 by guojian.hou*/

            // 2021.03.18 停车点属性逻辑新增
            let stopAreaReverseType = model.attributes.tctData.reverseType;
            switch (Number(stopAreaReverseType)) {
                case 1:
                    stop2.attr += 0x04;
                    stop1.attr += 0x10;
                    break;
                case 2:
                    stop1.attr += 0x04;
                    stop2.attr += 0x10;
                    break;
                case 3:
                    stop1.attr += 0x04;
                    stop1.attr += 0x10;
                    stop2.attr += 0x04;
                    stop2.attr += 0x10;
                    break;
            }
            // -- end --

            if (area.subInfo) {
                if (area.subInfo.length == 2) {
                    stop1.stopAreaID = area.id + 50000 + area.subInfo[0].subId * 1000;
                    stop1.parentAreaId = area.id;
                    stop2.stopAreaID = area.id + 50000 + area.subInfo[1].subId * 1000;
                    stop2.parentAreaId = area.id;

                    let s1 = new DSU_Stop();
                    s1.id = index++;           //【编号】
                    s1.attr = 0x01;       //【停车点属性】
                    s1.dir = 0x55;           //【停车点作用方向(16进制)】
                    s1.linkId = area.linkId;        //【停车点所处线路link编号】
                    s1.linkOffset = (Number(area.subInfo[0].endKm) - link.startKm) * 100;    //【停车点link偏移量(cm)】
                    s1.stopAreaID = area.id + 50000 + area.subInfo[0].subId * 1000;
                    s1.parentAreaId = 65535;
                    stops.push(s1);
                    let subArea = stopAreas.find(sa => {
                        return sa.id == stop1.stopAreaID;
                    });
                    if (subArea) {
                        subArea.stopPointCount = 2;        //【站台包含停车点数目】
                        subArea.stopPointID1 = stop1.id;      //【站台包含停车点编号1】 /*20160314 根据互联互通需求修改 by guojian.hou*/
                        subArea.stopPointID2 = s1.id;      //【站台包含停车点编号2】 /*20160314 根据互联互通需求修改 by guojian.hou*/
                    }

                    let s2 = new DSU_Stop();
                    s2.id = index++;           //【编号】
                    s2.attr = 0x01;       //【停车点属性】
                    s2.dir = 0xaa;           //【停车点作用方向(16进制)】
                    s2.linkId = area.linkId;        //【停车点所处线路link编号】
                    s2.linkOffset = (Number(area.subInfo[1].startKm) - link.startKm) * 100;    //【停车点link偏移量(cm)】
                    s2.stopAreaID = area.id + 50000 + area.subInfo[1].subId * 1000;
                    s2.parentAreaId = 65535;
                    stops.push(s2);
                    subArea = stopAreas.find(sa => {
                        return sa.id == stop2.stopAreaID;
                    });
                    if (subArea) {
                        subArea.stopPointCount = 2;        //【站台包含停车点数目】
                        subArea.stopPointID1 = s2.id;      //【站台包含停车点编号1】 /*20160314 根据互联互通需求修改 by guojian.hou*/
                        subArea.stopPointID2 = stop2.id;      //【站台包含停车点编号2】 /*20160314 根据互联互通需求修改 by guojian.hou*/
                    }

                } else if (area.subInfo.length == 3) {
                    stop1.stopAreaID = area.id + 50000 + area.subInfo[0].subId * 1000;
                    stop1.parentAreaId = area.id;
                    stop2.stopAreaID = area.id + 50000 + area.subInfo[2].subId * 1000;
                    stop2.parentAreaId = area.id;

                    let s1 = new DSU_Stop();
                    s1.id = index++;           //【编号】
                    s1.attr = 0x01;       //【停车点属性】
                    s1.dir = 0x55;           //【停车点作用方向(16进制)】
                    s1.linkId = area.linkId;        //【停车点所处线路link编号】
                    s1.linkOffset = (Number(area.subInfo[0].endKm) - link.startKm) * 100;    //【停车点link偏移量(cm)】
                    s1.stopAreaID = area.id + 50000 + area.subInfo[0].subId * 1000;
                    s1.parentAreaId = 65535;
                    stops.push(s1);
                    let subArea = stopAreas.find(sa => {
                        return sa.id == stop1.stopAreaID;
                    });
                    if (subArea) {
                        subArea.stopPointCount = 2;        //【站台包含停车点数目】
                        subArea.stopPointID1 = stop1.id;      //【站台包含停车点编号1】 /*20160314 根据互联互通需求修改 by guojian.hou*/
                        subArea.stopPointID2 = s1.id;      //【站台包含停车点编号2】 /*20160314 根据互联互通需求修改 by guojian.hou*/
                    }

                    let s2 = new DSU_Stop();
                    s2.id = index++;           //【编号】
                    s2.attr = 0x01;       //【停车点属性】
                    s2.dir = 0xaa;           //【停车点作用方向(16进制)】
                    s2.linkId = area.linkId;        //【停车点所处线路link编号】
                    s2.linkOffset = (Number(area.subInfo[1].startKm) - link.startKm) * 100;    //【停车点link偏移量(cm)】
                    s2.stopAreaID = area.id + 50000 + area.subInfo[1].subId;
                    s2.parentAreaId = 65535;
                    stops.push(s2);

                    let s3 = new DSU_Stop();
                    s3.id = index++;           //【编号】
                    s3.attr = 0x01;       //【停车点属性】
                    s3.dir = 0x55;           //【停车点作用方向(16进制)】
                    s3.linkId = area.linkId;        //【停车点所处线路link编号】
                    s3.linkOffset = (Number(area.subInfo[1].endKm) - link.startKm) * 100;    //【停车点link偏移量(cm)】
                    s3.stopAreaID = area.id + 50000 + area.subInfo[1].subId * 1000;
                    s3.parentAreaId = 65535;
                    stops.push(s3);
                    subArea = stopAreas.find(sa => {
                        return sa.id == (area.id + 50000 + area.subInfo[1].subId * 1000);
                    });
                    if (subArea) {
                        subArea.stopPointCount = 2;        //【站台包含停车点数目】
                        subArea.stopPointID1 = s2.id;      //【站台包含停车点编号1】 /*20160314 根据互联互通需求修改 by guojian.hou*/
                        subArea.stopPointID2 = s3.id;      //【站台包含停车点编号2】 /*20160314 根据互联互通需求修改 by guojian.hou*/
                    }

                    let s4 = new DSU_Stop();
                    s4.id = index++;           //【编号】
                    s4.attr = 0x01;       //【停车点属性】
                    s4.dir = 0xaa;           //【停车点作用方向(16进制)】
                    s4.linkId = area.linkId;        //【停车点所处线路link编号】
                    s4.linkOffset = (Number(area.subInfo[2].startKm) - link.startKm) * 100;    //【停车点link偏移量(cm)】
                    s4.stopAreaID = area.id + 50000 + area.subInfo[2].subId * 1000;
                    s4.parentAreaId = 65535;
                    stops.push(s4);
                    subArea = stopAreas.find(sa => {
                        return sa.id == stop2.stopAreaID;
                    });
                    if (subArea) {
                        subArea.stopPointCount = 2;        //【站台包含停车点数目】
                        subArea.stopPointID1 = s4.id;      //【站台包含停车点编号1】 /*20160314 根据互联互通需求修改 by guojian.hou*/
                        subArea.stopPointID2 = stop2.id;      //【站台包含停车点编号2】 /*20160314 根据互联互通需求修改 by guojian.hou*/
                    }
                }
            }
        }
    });

    return stops;
}

/**
 * 获取计轴表信息
 * @param {*} links 
 * @param {*} paper 
 */
let getAxles = (links, paper) => {
    let axles = [];

    if (!paper || !links) {
        return axles;
    }

    let models = paper.model.getCells();
    if (!models) {
        return axles;
    }

    models = models.filter(m => {
        return m.attributes.type == 'tct.Axle';
    });

    models.forEach(m => {
        let axle = {
            id: parseInt(m.attributes.tctData.tctId),
            axleName: 'JZ' + m.attributes.tctData.tctId,
            axleType: 0x01,
            km: parseInt(m.attributes.tctData.km * 100),
            axleLinkId: 65535,
            axleLinkOffset: 65535
        };

        let linkInfo = links.find(item => {
            return item.startCellType == 2 && parseInt(item.startCellId) == axle.id;
        });
        if (linkInfo) {
            axle.axleLinkId = linkInfo.id;
            axle.axleLinkOffset = 0;
            axles.push(axle);
        } else {
            linkInfo = links.find(item => {
                return item.endCellType == 2 && parseInt(item.endCellId) == axle.id;
            });
            if (linkInfo) {
                axle.axleLinkId = linkInfo.id;
                axle.axleLinkOffset = linkInfo.length;
                axles.push(axle);
            }
        }
    });

    // TODO ----- 临时加的不合理代码 -----
    models = paper.model.getCells();
    if (!models) {
        return axles;
    }

    models = models.filter(m => {
        return m.attributes.type == 'tct.Bumper';
    });

    models.forEach(m => {
        let axle = {
            id: Number(m.attributes.tctData.tctId),
            axleName: 'XN' + m.attributes.tctData.tctId,
            axleType: 0x03,
            km: Number(m.attributes.tctData.km) * 100,
            axleLinkId: 65535,
            axleLinkOffset: 65535
        };

        let linkInfo = links.find(item => {
            return item.startCellType == 1 && Number(item.startCellId) == axle.id;
        });
        if (linkInfo) {
            axle.axleLinkId = linkInfo.id;
            axle.axleLinkOffset = 0;
            axle.id += 5000; // TODO 解决后端计算id重复的问题
            axles.push(axle);
        } else {
            linkInfo = links.find(item => {
                return item.endCellType == 1 && Number(item.endCellId) == axle.id;
            });
            if (linkInfo) {
                axle.axleLinkId = linkInfo.id;
                axle.axleLinkOffset = linkInfo.length;
                axle.id += 5000; // TODO 解决后端计算id重复的问题
                axles.push(axle);
            }
        }
    });
    // ---------------------------------

    // 排序，保证最后一个id最大
    axles.sort((a, b) => {
        return a.id - b.id;
    });

    return axles;
};

/**
 * 获取计轴区段点表信息
 * @param {*} links 
 * @param {*} paper 
 */
let getAxleSegments = (links, points) => {
    let axleSegments = [];

    if (!links) {
        return axles;
    }

    let findEndLink = (startLink, links, refPoionts, refLinks) => {
        let arr = [];
        if (!startLink) {
            return arr;
        }
        refPoionts.push(startLink.endCellId);
        refLinks.push(startLink);
        if (startLink.nextLinkNum > 0 && startLink.nextLinkNum < 65535) {
            let nextLink = links.find(k => {
                return k.id == startLink.nextLinkNum;
            });
            if (nextLink) {
                let tmp = _.cloneDeep(refLinks);
                if (nextLink.endCellType == 1 || nextLink.endCellType == 2) {
                    tmp.push(nextLink);
                    arr.push({ link: nextLink, refPoionts, refLinks: tmp });
                } else {
                    let item = findEndLink(nextLink, links, _.cloneDeep(refPoionts), tmp);
                    arr.push(item[0]);
                }
            }
        }

        if (startLink.nextSideLinkNum > 0 && startLink.nextSideLinkNum < 65535) {
            let nextSideLink = links.find(k => {
                return k.id == startLink.nextSideLinkNum;
            });
            if (nextSideLink) {
                let tmp = _.cloneDeep(refLinks);
                if (nextSideLink.endCellType == 1 || nextSideLink.endCellType == 2) {
                    tmp.push(nextSideLink);
                    arr.push({ link: nextSideLink, refPoionts, refLinks: tmp });
                } else {
                    let item = findEndLink(nextSideLink, links, _.cloneDeep(refPoionts), tmp);
                    arr.push(item[0]);
                }
            }
        }

        return arr;
    };

    // TODO: 其中的加5000是处理后端数据的问题硬编码
    let globalAxleSegmentId = 1;
    links.forEach(current => {
        if (current.startCellType == 1 || current.startCellType == 2) {
            if (current.endCellType == 1 || current.endCellType == 2) {
                let segment = {
                    axleSegmentNum: globalAxleSegmentId++,       //【编号】
                    axleSegmentName: "",	    //【计轴区段名称】
                    originAxleNum: current.startCellType == 2 ? current.startCellId : current.startCellId + 5000,                       //【起点计轴器编号】
                    terminalAxleNum: current.endCellType == 2 ? current.endCellId : current.endCellId + 5000,                     //【终点计轴器编号】
                    originLinkId: current.id,                        //【起点所处link编号】
                    originLinkOffset: 0,                        //【起点所处link偏移量】
                    terminalLinkId: current.id,                      //【终点所处link编号】
                    terminalLinkOffset: current.length,                      //【终点所处link偏移量】
                    logicSegmentCount: 65535,                   //【计轴区段包含的逻辑区段的个数】
                    logicSegmentNums: 65535,                   //【计轴区段包含的逻辑区段的编号】
                    relatePointCount: 0,                    //【关联道岔数目】	
                    refPoionts: [],
                    links: [],
                    p1: 65535,
                    p1d: 65535,
                    p2: 65535,
                    p2d: 65535
                    // TODO 计轴区段其他设置
                };
                axleSegments.push(segment);
            } else {
                let arr = findEndLink(current, links, [], []);
                arr.forEach(a => {
                    let segment = {
                        axleSegmentNum: globalAxleSegmentId++,       //【编号】
                        axleSegmentName: "",	    //【计轴区段名称】
                        originAxleNum: current.startCellType == 2 ? current.startCellId : current.startCellId + 5000,                       //【起点计轴器编号】
                        terminalAxleNum: a.link.endCellType == 2 ? a.link.endCellId : a.link.endCellId + 5000,                     //【终点计轴器编号】
                        originLinkId: current.id,                        //【起点所处link编号】
                        originLinkOffset: 0,                        //【起点所处link偏移量】
                        terminalLinkId: a.link.id,                      //【终点所处link编号】
                        terminalLinkOffset: a.length,                      //【终点所处link偏移量】
                        logicSegmentCount: 65535,                   //【计轴区段包含的逻辑区段的个数】
                        logicSegmentNums: 65535,                   //【计轴区段包含的逻辑区段的编号】
                        relatePointCount: a.refPoionts.length,                    //【关联道岔数目】
                        refPoionts: a.refPoionts,
                        links: a.refLinks.map(r => { return r.id }),
                        p1: 65535,
                        p1d: 65535,
                        p2: 65535,
                        p2d: 65535
                    };
                    // TODO 计算道岔状态

                    if (a.refPoionts.length == 2) {
                        segment.p1 = a.refPoionts[0];
                        segment.p2 = a.refPoionts[1];
                        segment.p1d = 1;
                        segment.p2d = 1;
                    } else if (a.refPoionts.length == 1) {
                        segment.p1 = a.refPoionts[0];
                        let findPoint = points.find(p => { return p.id == segment.p1; });
                        if (findPoint) {
                            if ((findPoint.confluentLinkId == segment.links[0] && findPoint.linkId == segment.links[1]) || (findPoint.confluentLinkId == segment.links[1] && findPoint.linkId == segment.links[0])) {
                                segment.p1d = 1;
                            } else {
                                segment.p1d = 2;
                            }
                        }
                    }

                    axleSegments.push(segment);
                });
            }
        }
    });

    return axleSegments;
};


/**
 * 获取逻辑区段表
 * @param {*} axleSegments 
 */
let getLogicSegments = (axleSegments, links, paper) => {
    let logicSegments = [];
    let globalId = 1;

    let models = paper.model.getCells();
    let stations = models.filter(m => {
        return m.attributes.type == 'tct.Station';
    });

    if (axleSegments && axleSegments.length > 0 && links) {
        axleSegments.forEach(axle => {
            let originLink = links.find(k => {
                return k.id == axle.originLinkId;
            });

            let terminalLink = links.find(k => {
                return k.id == axle.terminalLinkId;
            });

            let startCellType = originLink.startCellType == 1 ? 'tct.Bumper' : originLink.startCellType == 2 ? 'tct.Axle' : originLink.startCellType == 3 ? 'tct.Point' : '';
            let endCellType = terminalLink.endCellType == 1 ? 'tct.Bumper' : terminalLink.endCellType == 2 ? 'tct.Axle' : terminalLink.endCellType == 3 ? 'tct.Point' : '';

            let startCell = models.find(m => {
                return m.attributes.type == startCellType && m.attributes.tctData.tctId == originLink.startCellId;
            });
            let startKm = Number(startCell.attributes.tctData.km);

            let endCell = models.find(m => {
                return m.attributes.type == endCellType && m.attributes.tctData.tctId == terminalLink.endCellId;
            });
            let endKm = Number(endCell.attributes.tctData.km);

            let station = stations.find(s => {
                return s.attributes.tctData.km > startKm && s.attributes.tctData.km < endKm;
            });

            if (startCellType == 'tct.Axle' && endCellType == 'tct.Axle' && station) {
                // 以60米分隔
                let step = 6000, index = 0;
                while (((endKm - startKm) * 100 - index * step) > step * 2) {
                    // 添加分段
                    let segment = new DSU_LogicSegment();
                    segment.name = '';
                    segment.id = globalId++;              // 编号
                    segment.startLinkId = originLink.id;     // 起点所处link编号
                    if (index == 0) {
                        segment.startLinkOffset = 0; // 起点所处link偏移量
                    } else {
                        segment.startLinkOffset = parseInt(step * index) + 1; // 起点所处link偏移量
                    }
                    segment.endLinkId = terminalLink.id;       // 终点所处link编号
                    segment.endLinkOffset = parseInt(step * (index + 1));   // 终点所处link偏移量
                    segment.axleSegmentId = axle.axleSegmentNum;   // 所属计轴区段编号
                    index++;
                    logicSegments.push(segment);
                }
                // 添加剩余分段
                let segment = new DSU_LogicSegment();
                segment.name = '';
                segment.id = globalId++;              // 编号
                segment.startLinkId = originLink.id;     // 起点所处link编号
                if (index == 0) {
                    segment.startLinkOffset = 0; // 起点所处link偏移量
                } else {
                    segment.startLinkOffset = parseInt(step * index) + 1; // 起点所处link偏移量
                }
                segment.endLinkId = terminalLink.id;       // 终点所处link编号
                segment.endLinkOffset = terminalLink.length;   // 终点所处link偏移量
                segment.axleSegmentId = axle.axleSegmentNum;   // 所属计轴区段编号
                index++;
                logicSegments.push(segment);
            } else {
                // 以200米分隔
                let step = 20000, index = 0;
                while (((endKm - startKm) * 100 - index * step) > step * 2) {
                    // 添加分段
                    let segment = new DSU_LogicSegment();
                    segment.name = '';
                    segment.id = globalId++;              // 编号
                    segment.startLinkId = originLink.id;     // 起点所处link编号
                    if (index == 0) {
                        segment.startLinkOffset = 0; // 起点所处link偏移量
                    } else {
                        segment.startLinkOffset = parseInt(step * index) + 1; // 起点所处link偏移量
                    }
                    segment.endLinkId = terminalLink.id;       // 终点所处link编号
                    segment.endLinkOffset = parseInt(step * (index + 1));   // 终点所处link偏移量
                    segment.axleSegmentId = axle.axleSegmentNum;   // 所属计轴区段编号
                    index++;
                    logicSegments.push(segment);
                }
                // 添加剩余分段
                let segment = new DSU_LogicSegment();
                segment.name = '';
                segment.id = globalId++;              // 编号
                segment.startLinkId = originLink.id;     // 起点所处link编号
                if (index == 0) {
                    segment.startLinkOffset = 0; // 起点所处link偏移量
                } else {
                    segment.startLinkOffset = parseInt(step * index) + 1; // 起点所处link偏移量
                }
                segment.endLinkId = terminalLink.id;       // 终点所处link编号
                segment.endLinkOffset = terminalLink.length;   // 终点所处link偏移量
                segment.axleSegmentId = axle.axleSegmentNum;   // 所属计轴区段编号
                index++;
                logicSegments.push(segment);
            }
        });
    }

    return logicSegments;
};

/**
* 获取信号机表信息
* @param {*} links 
* @param {*} paper 
*/
let getSignals = (links, paper) => {
    let signals = [];
    let models = paper.model.getCells();
    let sCells = models.filter(m => {
        return m.attributes.type == 'tct.Signal';
    });

    if (sCells && sCells.length > 0 && links) {
        sCells.forEach(s => {
            let skm = Number(s.attributes.tctData.km);
            let axle = models.find(m => {
                let mkm = Number(m.attributes.tctData.km);
                return m.attributes.type == 'tct.Axle' && s.attributes.drawData.nodeParent.id == m.attributes.drawData.nodeParent.id && !(mkm + 5 < skm || mkm - 5 > skm);
            });

            if (axle) { // 查找计轴
                let mkm = Number(axle.attributes.tctData.km);
                let link1 = links.find(k => {
                    return k.startCellType == 2 && k.startCellId == axle.attributes.tctData.tctId;
                });
                let link2 = links.find(k => {
                    return k.endCellType == 2 && k.endCellId == axle.attributes.tctData.tctId;
                });
                let link = null, proLink = null, signalLinkOffset = 0, protectLinkOffset = 0;
                if (s.attributes.tctData.signalDirection == 0x55) {
                    link = link2;
                    proLink = link1;
                    signalLinkOffset = link.length - (mkm - skm) * 100;
                    protectLinkOffset = 0;
                } else {
                    link = link1;
                    proLink = link2;
                    signalLinkOffset = (skm - mkm) * 100;
                    protectLinkOffset = proLink.length;
                }

                let signal = new DSU_Signal();
                signal.signalNum = s.attributes.tctData.tctId;          /*编号*/
                signal.signalName = s.attributes.tctData.name;          /*信号机名称*/
                signal.signalType = s.attributes.tctData.signalType;	/*信号机类型*/
                signal.signalAttr = s.attributes.tctData.prop;          /*信号机属性*/
                signal.signalLinkId = link ? link.id : 65535;	        /*信号机所处link编号*/
                signal.signalLinkOffset = signalLinkOffset;	            /*信号机所处link偏移量(cm)*/
                signal.direction = s.attributes.tctData.signalDirection;/*信号机防护方向(16进制)*/
                signal.protectLinkId = proLink ? proLink.id : 65535;    /*信号机防护点所处link编号*/
                signal.protectLinkOffset = protectLinkOffset;           /*信号机防护点所处link偏移量(cm)*/
                signal.passSignal = s.attributes.tctData.open;          /*开口信号机标志*/
                signal.enableSignal = 65535;                            /*信号机判断闯信号功能标志*/
                signal.shineSignal = 65535;                             /*信号机亮灭功能标志*/
                signal.signalDengLie = 65535;                           /*信号机灯列*/
                signal.dengWeiFengBi = 65535;                           /*灯位封闭信息*/
                signals.push(signal);
            } else { // 查找车挡
                let track = models.find(m => {
                    return m.attributes.id == s.attributes.drawData.nodeParent.id;
                });
                let bumper = null, link = null, signalLinkOffset = 65535, protectLinkOffset = 65535;
                if (track) {
                    if (s.attributes.tctData.signalDirection == 0x55) {
                        bumper = models.find(m => {
                            return m.attributes.id == track.attributes.drawData.nodeTwo.id && m.attributes.type == 'tct.Bumper';
                        });
                        if (!bumper) {
                            console.log(track)
                        }
                        let bkm = Number(bumper.attributes.tctData.km);
                        link = links.find(k => {
                            return k.endCellType == 1 && k.endCellId == bumper.attributes.tctData.tctId;
                        });
                        signalLinkOffset = link.length - (bkm - skm) * 100;
                        protectLinkOffset = link.length;
                    } else {
                        bumper = models.find(m => {
                            return m.attributes.id == track.attributes.drawData.nodeOne.id && m.attributes.type == 'tct.Bumper';
                        });
                        let bkm = Number(bumper.attributes.tctData.km);
                        link = links.find(k => {
                            return k.startCellType == 1 && k.startCellId == bumper.attributes.tctData.tctId;
                        });
                        signalLinkOffset = (skm - bkm) * 100;
                        protectLinkOffset = 0;
                    }
                }

                let signal = new DSU_Signal();
                signal.signalNum = s.attributes.tctData.tctId;          /*编号*/
                signal.signalName = s.attributes.tctData.name;          /*信号机名称*/
                signal.signalType = s.attributes.tctData.signalType;	/*信号机类型*/
                signal.signalAttr = s.attributes.tctData.prop;          /*信号机属性*/
                signal.signalLinkId = link ? link.id : 65535;	        /*信号机所处link编号*/
                signal.signalLinkOffset = signalLinkOffset;	            /*信号机所处link偏移量(cm)*/
                signal.direction = s.attributes.tctData.signalDirection;/*信号机防护方向(16进制)*/
                signal.protectLinkId = link ? link.id : 65535;		    /*信号机防护点所处link编号*/
                signal.protectLinkOffset = protectLinkOffset;		    /*信号机防护点所处link偏移量(cm)*/
                signal.passSignal = s.attributes.tctData.open;	        /*开口信号机标志*/
                signal.enableSignal = 65535;                            /*信号机判断闯信号功能标志*/
                signal.shineSignal = 65535;                             /*信号机亮灭功能标志*/
                signal.signalDengLie = 65535;                           /*信号机灯列*/
                signal.dengWeiFengBi = 65535;                           /*灯位封闭信息*/
                signals.push(signal);
            }

        });
    }

    return signals;
};

/**
 * 更新组件Link映射
 * @param {*} paper 
 */
let updateComponentLinkMap = (paper) => {
    if (paper.project.components) {
        paper.project.components.forEach(c => {
            let linksMap = {};
            if (c.logicData && c.logicData.links) {
                c.logicData.links.forEach(slink => {
                    let elink = paper.project.logicData.links.find(k => {
                        return k.startCellId == slink.startCellId
                            && k.startCellType == slink.startCellType
                            && k.endCellId == slink.endCellId
                            && k.endCellType == slink.endCellType;

                        // return (k.startCellId == slink.startCellId
                        //     && k.startCellType == slink.startCellType
                        //     && k.endCellId == slink.endCellId
                        //     && k.endCellType == slink.endCellType)
                        //     || (k.startCellId == slink.endCellId
                        //         && k.startCellType == slink.endCellType
                        //         && k.endCellId == slink.startCellId
                        //         && k.endCellType == slink.startCellType);
                    });
                    try {
                        linksMap[slink.id] = elink.id;
                    } catch (e) {
                        console.log("--- find you ---");
                        console.log(paper.project.logicData.links.find(t=>{return t.id==118}));
                        console.log(slink)
                    }
                });
            }
            c.logicData.linksMap = linksMap;
        });
    }
};

/**
 * 获取全线连锁关系
 * @param {*} paper 
 */
let getInterLockingData = (paper) => {
    let relates = [];
    if (!paper.project.components) {
        return relates;
    }
    paper.project.components.forEach(c => {
        if (c.InterLocking) {
            c.InterLocking.forEach(item => {
                let data = _.cloneDeep(item);
                data.ReverseLink = c.logicData.linksMap[Number(data.ReverseLink)];
                data.ReleasePointLnk = c.logicData.linksMap[data.ReleasePointLnk];
                if (!data.ReverseLink) {
                    console.log("----");
                    console.log(c);
                }
                data.BehindPointLnk = c.logicData.linksMap[data.BehindPointLnk];
                if (data.ReverseArea) {
                    for (let i = 0; i < data.ReverseArea.length; i++) {
                        data.ReverseArea[i] = c.logicData.linksMap[data.ReverseArea[i]];
                    }
                }

                if (data.ReleasePointOff == 65535) {
                    let releasePointLnk = paper.project.logicData.links.find(a => {
                        return a.id == data.ReleasePointLnk;
                    });

                    if (releasePointLnk) {
                        data.ReleasePointOff = releasePointLnk.length;
                    }
                }
                delete data.ReverseAreaStr;
                relates.push(data);
            });
        }
    });
    console.log(relates);
    return relates;
};

/**
 * 获取站台信息
 * @param {*} cells 
 * @param {*} links 
 */
let getStations = (cells) => {
    let platforms = [];
    if (!cells || cells.length == 0) {
        return platforms;
    }

    // 查找车站的停车点的定义
    let stations = cells.filter(c => {
        return c.model.attributes.type == 'tct.Station';
    });

    if (stations && stations.length > 0) {
        stations.forEach(station => {
            if (station.model.attributes.tctData.platformID1 > 0) {
                let p = new DSU_Staion();
                p.id = station.model.attributes.tctData.platformID1;             //【编号】
                p.centerKm = station.getKm().kmCm.toString();     //【中心公里标】
                p.stationName = station.model.attributes.tctData.name;    //【车站名称】
                // --- sub_structure ---
                if (station.model.attributes.tctData.stopAreaTLID > 0) {
                    p.stopAreaID = station.model.attributes.tctData.stopAreaTLID;      //【对应停车区域编号】
                    p.relatedDir = 0x55;     //【逻辑方向上站台相对于停车区域的方向】
                } else if (station.model.attributes.tctData.stopAreaTRID > 0) {
                    p.stopAreaID = station.model.attributes.tctData.stopAreaTRID;      //【对应停车区域编号】
                    p.relatedDir = 0xaa;     //【逻辑方向上站台相对于停车区域的方向】
                }
                platforms.push(p);
            }
            if (station.model.attributes.tctData.platformID2 > 0) {
                let p = new DSU_Staion();
                p.id = station.model.attributes.tctData.platformID2;             //【编号】
                p.centerKm = station.getKm().kmCm.toString();     //【中心公里标】
                p.stationName = station.model.attributes.tctData.name;    //【车站名称】
                // --- sub_structure ---
                if (station.model.attributes.tctData.stopAreaBLID > 0) {
                    p.stopAreaID = station.model.attributes.tctData.stopAreaBLID;      //【对应停车区域编号】
                    p.relatedDir = 0x55;     //【逻辑方向上站台相对于停车区域的方向】
                } else if (station.model.attributes.tctData.stopAreaBRID > 0) {
                    p.stopAreaID = station.model.attributes.tctData.stopAreaBRID;      //【对应停车区域编号】
                    p.relatedDir = 0xaa;     //【逻辑方向上站台相对于停车区域的方向】
                }
                platforms.push(p);
            }
        });
    }
    return platforms;
};

export default PaperUtil;