import fileSaver from "file-saver";
import XLSX from "xlsx";

let fileSaveHelper = {};

/**
 * 保存Json文件
 * @param {json数据} jsonData 
 * @param {文件名} filename 
 */
fileSaveHelper.saveAsJson = (jsonData, filename) => {
    let fileBlob = new Blob([JSON.stringify(jsonData)], { type: "application/json" });
    fileSaver.saveAs(fileBlob, `${filename}.json`);
};

/**
 * 保存文本文件
 * @param {文件内容} content 
 * @param {文件名} filename 
 * @param {扩展名(默认是txt)} exname 
 */
fileSaveHelper.saveAsText = (content, filename, exname = ".txt") => {
    let fileBlob = new Blob([content], { type: "text/plain;charset=utf-8" });
    fileSaver.saveAs(fileBlob, `${filename}${exname}`);
};

/**
 * 保存Link为Excel
 * @param {*} links  Links
 * @param {String} excelName 文件名
 */
fileSaveHelper.saveLinkAsExcel = (links, excelName) => {
    let workBook = XLSX.utils.book_new();
    let sheetData = [
        ["索引编号", "Link长度（cm）", "线路上下行", "起点端点类型", "起点端点编号", "起点连接正线link编号", "起点侧线link编号", "终点端点类型", "终点端点编号", "终点连接正线link编号", "终点连接侧线link编号", "所属ZC区域编号", "所属ATS区域编号", "所属逻辑CI区域编号", "所属物理CI区域编号", "Link限速信息属性", "Link坡度信息属性"]
    ];
    if (links && links.length > 0) {
        links.forEach(link => {
            sheetData.push([
                link.id,
                link.length,
                link.direction,
                link.startCellType,
                link.startCellId,
                link.preLinkNum,
                link.preSideLinkNum,
                link.endCellType,
                link.endCellId,
                link.nextLinkNum,
                link.nextSideLinkNum,
                link.ZCRegionId,
                link.ATSRegionId,
                link.LogicCIRegionId,
                link.PhysicCIRegionId,
                link.speedLimitInfo,
                link.slopeInfo
            ]);
        });
    }

    let workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "LINK表");
    XLSX.writeFile(workBook, `${excelName}.xlsx`);
};

/**保存道岔为Excel
 * @param {*} data 道岔表数据
 */
fileSaveHelper.saveDSU_PointAsExcel = (data, excelName) => {
    let workBook = XLSX.utils.book_new();
    let sheetData = [
        ["道岔编号", "道岔名称", "联动道岔编号", "道岔点公里标", "所处正线link编号", "所处正线link偏移量(cm)", "所处侧线link编号", "所处侧线link偏移量(cm)", "所处汇合link编号", "所处汇合link偏移量(cm)", "道岔反位静态限制速度(cm/s)"]
    ];
    if (data && data.length > 0) {
        data.forEach(d => {
            sheetData.push([
                d.id,
                d.pointName,
                d.relatePointNum,
                d.km,
                d.linkId,
                d.linkOffset,
                d.sideLinkId,
                d.sideLinkOffset,
                d.confluentLinkId,
                d.confluentLinkOffset,
                d.speedLimit
            ]);
        });
    }

    let workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "道岔表");
    XLSX.writeFile(workBook, `${excelName}.xlsx`);
};

/**保存信号机为Excel
 * @param {*} data 信号机表数据
 */
fileSaveHelper.saveDSU_SignalAsExcel = (data, excelName) => {
    let workBook = XLSX.utils.book_new();
    let sheetData = [
        ["编号", "信号机名称", "信号机类型", "信号机属性", "信号机所处link编号", "信号机所处link偏移量(cm)", "信号机防护方向(16进制)", "信号机防护点所处link编号", "信号机防护点所处link偏移量(cm)", "信号机判断闯信号功能标志", "信号机亮灭功能标志", "信号机灯列", "灯位封闭信息"]
    ];
    if (data && data.length > 0) {
        data.forEach(d => {
            sheetData.push([
                d.signalNum,
                d.signalName,
                d.signalType,
                d.signalAttr,
                d.signalLinkId,
                d.signalLinkOffset,
                d.direction,
                d.protectLinkId,
                d.protectLinkOffset,
                d.passSignal,
                d.enableSignal,
                d.shineSignal,
                d.signalDengLie,
                d.dengWeiFengBi
            ]);
        });
    }

    let workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "信号机表");
    XLSX.writeFile(workBook, `${excelName}.xlsx`);
};

/**保存应答器为Excel
 * @param {*} data 应答器表数据
 */
fileSaveHelper.saveDSU_BaliseAsExcel = (data, excelName) => {
    let workBook = XLSX.utils.book_new();
    let sheetData = [
        ["编号", "应答器ID", "应答器名称", "应答器所处link编号", "应答器所处link偏移量(cm)", "与应答器关联的信号机编号",
            "应答器作用方向", "应答器类型", "在所处link逻辑方向上起点的相邻的应答器数量", "在所处link逻辑方向上起点相邻的应答器的编号",
            "在所处link逻辑方向上起点相邻的应答器的距离", "列车经过本应答器再经过该相邻应答器时的方向", "起点相邻应答器关联道岔编号",
            "起点相邻应答器关联道岔状态", "在所处link逻辑方向上终点的相邻的应答器数量", "在所处link逻辑方向上终点相邻的应答器的编号",
            "在所处link逻辑方向上终点相邻的应答器的距离", "列车经过本应答器再经过该相邻应答器时的方向", "终点相邻应答器关联道岔编号",
            "终点相邻应答器关联道岔状态", "LEU编号"
        ]
    ];
    if (data && data.length > 0) {
        data.forEach(d => {
            sheetData.push([
                d.baliseNum,
                d.baliseID,
                d.baliseName,
                d.baliseLinkId,
                d.baliseLinkOfsset,
                d.signalNum,
                d.direction,
                d.baliseType,
                d.originBaliseCount,
                d.originBaliseIds,
                d.originBaliseDistances,
                d.originBaliseDirs,
                d.originBaliseRelatePointNums,
                d.originBaliseRelatePointStates,
                d.terminalBaliseCount,
                d.terminalBaliseIds,
                d.terminalBaliseDistances,
                d.terminalBaliseDirs,
                d.terminalBaliseRelatePointNums,
                d.terminalBaliseRelatePointStates,
                d.leuNum
            ]);
        });
    }

    let workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "应答器表");
    XLSX.writeFile(workBook, `${excelName}.xlsx`);
};

/**保存计轴为Excel
 * @param {*} data 计轴表数据
 */
fileSaveHelper.saveDSU_AxleAsExcel = (data, excelName) => {
    let workBook = XLSX.utils.book_new();
    let sheetData = [
        ["编号", "计轴器名称", "类型信息", "计轴器公里标", "计轴器所处link编号", "计轴器所处link偏移量(cm)"]
    ];
    if (data && data.length > 0) {
        data.forEach(d => {
            sheetData.push([
                d.id,
                d.axleName,
                d.axleType,
                d.km,
                d.axleLinkId,
                d.axleLinkOffset
            ]);
        });
    }

    let workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "计轴表");
    XLSX.writeFile(workBook, `${excelName}.xlsx`);
};

/**保存计轴区段为Excel
 * @param {*} data 计轴区段表数据
 */
fileSaveHelper.saveDSU_AxleSegmentAsExcel = (data, excelName) => {
    let workBook = XLSX.utils.book_new();
    let sheetData = [
        ["编号", "计轴区段名称", "起点计轴器编号", "终点计轴器编号", "起点所处link编号",
            "终点所处link编号", "计轴区段包含的逻辑区段的个数", "计轴区段包含的逻辑区段的编号",
            "关联道岔数目", "关联道岔编号", "关联道岔状态", "对应物理区段"]
    ];
    if (data && data.length > 0) {
        data.forEach(d => {
            sheetData.push([
                d.axleSegmentNum,
                d.axleSegmentName,
                d.originAxleNum,
                d.terminalAxleNum,
                d.originLinkId,
                d.terminalLinkId,
                d.logicSegmentCount,
                d.logicSegmentNums,
                d.relatePointCount,
                d.relatePointNums,
                d.relatePointStatus,
                d.relatePhysicSegmentId,
            ]);
        });
    }

    let workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "计轴表");
    XLSX.writeFile(workBook, `${excelName}.xlsx`);
};

/**保存限速为Excel
 * @param {*} data 限速表数据
 */
fileSaveHelper.saveDSU_LimitAsExcel = (data, excelName) => {
    let workBook = XLSX.utils.book_new();
    let sheetData = [
        ["编号", "该限速区域所处link编号", "起点所处link偏移量(cm)", "终点所处link偏移量(cm)", "关联道岔编号", "静态限速值"]
    ];
    if (data && data.length > 0) {
        data.forEach(d => {
            sheetData.push([
                d.limitNum,
                d.limitLinkId,
                d.originLinkOffset,
                d.terminalLinkOffset,
                d.relatePointId,
                d.speedLimit
            ]);
        });
    }

    let workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "限速表");
    XLSX.writeFile(workBook, `${excelName}.xlsx`);
};

/**保存坡度为Excel
 * @param {*} data 坡度表数据
 */
fileSaveHelper.saveDSU_GradeAsExcel = (data, excelName) => {

    // DSU_Grade

    let workBook = XLSX.utils.book_new();
    let sheetData = [
        ["编号", "坡度起点所处link编号", "坡度起点所处link偏移量", "坡度终点所处link编号", "坡度终点所处link偏移量", "起点关联道岔编号",
            "起点正线坡度编号", "起点侧线坡度编号", "终点关联道岔编号", "终点正线坡度编号", "终点侧线坡度编号", "坡度值",
            "坡段相对于线路逻辑方向的倾斜方向", "竖曲线半径"]
    ];
    if (data && data.length > 0) {
        data.forEach(d => {
            sheetData.push([
                d.gradeNum,
                d.originLinkId,
                d.originLinkOffset,
                d.terminalLinkId,
                d.terminalLinkOffset,
                d.originRelatePointId,
                d.originMainGradeId,
                d.originSideGradeId,
                d.ternimalRelatePointId,
                d.terminalMainGradeId,
                d.terminalSideGradeId,
                d.radValue,
                d.nclineDir,
                d.adius
            ]);
        });
    }

    let workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "坡度表");
    XLSX.writeFile(workBook, `${excelName}.xlsx`);
};

/**保存停车区域为Excel
 * @param {*} data 数据
 */
fileSaveHelper.saveDSU_StopAreaAsExcel = (data, excelName) => {
    let workBook = XLSX.utils.book_new();
    let sheetData = [
        ["编号", "所属车站名称", "目的地编号", "站台物理范围link编号", "停车区域属性", "站台最小停站时间", "站台最大停站时间", "站台默认停站时间",
            "站台中屏蔽门数量", "安全屏蔽门编号1", "安全屏蔽门编号2", "站台中紧急停车按钮数量", "紧急停车按钮编号1", "紧急停车按钮编号2", "站台包含停车点数目",
            "站台包含停车点编号1", "站台包含停车点编号2", "站台包含停车点编号3", "站台开门方式", "站台开门时间间隔", "站台关门方式", "站台关门时间间隔",
            "站台默认停稳时间", "站台所属车站编号"]
    ];
    if (data && data.length > 0) {
        data.forEach(d => {
            sheetData.push([
                d.id,
                d.stationName,
                d.desNum,
                d.linkId,
                d.attr,
                d.minParkTime,
                d.maxParkTime,
                d.parkTime,
                d.screenCount,
                d.screenNum1,
                d.screenNum2,
                d.emergStopCount,
                d.emergStopID1,
                d.emergStopID2,
                d.stopPointCount,
                d.stopPointID1,
                d.stopPointID2,
                d.stopPointID3,
                d.doorOpenMode,
                d.doorOpenTime,
                d.doorCloseMode,
                d.doorCloseTime,
                d.parkSteadyTime,
                d.stationID
            ]);
        });
    }

    let workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "停车区域表");
    XLSX.writeFile(workBook, `${excelName}.xlsx`);
};

/**保存停车点为Excel
 * @param {*} data 数据
 */
fileSaveHelper.saveDSU_StopAsExcel = (data, excelName) => {
    let workBook = XLSX.utils.book_new();
    let sheetData = [
        ["编号", "停车点属性", "停车点作用方向(16进制)", "停车点所处线路link编号", "停车点link偏移量(cm)", "停车点对应保护区段编号",
            "停车点对应ATO作用窗范围", "停车点对应ATP作用窗范围", "停车点对应停车区域ID"]
    ];
    if (data && data.length > 0) {
        data.forEach(d => {
            sheetData.push([
                d.id,
                d.attr,
                d.dir,
                d.linkId,
                d.linkOffset,
                d.overLapId,
                d.atoRange,
                d.atpRange,
                d.stopAreaID
            ]);
        });
    }

    let workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "停车点表");
    XLSX.writeFile(workBook, `${excelName}.xlsx`);
};

/**保存站台为Excel
 * @param {*} data 数据
 */
fileSaveHelper.saveDSU_PlatformAsExcel = (data, excelName) => {
    let workBook = XLSX.utils.book_new();
    let sheetData = [
        ["编号", "中心公里标", "车站名称", "对应停车区域编号", "逻辑方向上站台相对于停车区域的方向", "站台对应触发逻辑区段个数",
            "站台对应触发逻辑区段id1", "站台对应触发逻辑区段id2", "站台对应触发逻辑区段id3", "站台对应触发逻辑区段id4", "站台对应触发逻辑区段id5"
            , "站台对应触发逻辑区段id6", "站台对应触发逻辑区段id7", "站台对应触发逻辑区段id8", "站台对应触发逻辑区段id9", "站台对应触发逻辑区段id10"]
    ];
    if (data && data.length > 0) {
        data.forEach(d => {
            sheetData.push([
                d.id,
                d.centerKm,
                d.stationName,
                // --- sub_structure ---
                d.stopAreaID,
                d.relatedDir,
                d.logicSgmtCount,
                d.logicSgmt1,
                d.logicSgmt2,
                d.logicSgmt3,
                d.logicSgmt4,
                d.logicSgmt5,
                d.logicSgmt6,
                d.logicSgmt7,
                d.logicSgmt8,
                d.logicSgmt9,
                d.logicSgmt10
            ]);
        });
    }

    let workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "站台表");
    XLSX.writeFile(workBook, `${excelName}.xlsx`);
};

/**
 * 转换成接口数据
 * @param {*} data 数据 
 */
fileSaveHelper.transDataV2 = (data) => {
    let param = {
        ...data
    };
    param.link = [];
    data.link.forEach(d => {
        // TODO: 临时加的不合理方法
        param.link.push([
            d.id,
            d.length,
            d.direction,
            d.startCellType == 1 ? 2 : d.startCellType,
            parseInt(d.startCellType == 1 ? d.startCellId + 5000 : d.startCellId),
            d.preLinkNum,
            d.preSideLinkNum,
            d.endCellType == 1 ? 2 : d.endCellType,
            parseInt(d.endCellType == 1 ? d.endCellId + 5000 : d.endCellId),
            d.nextLinkNum,
            d.nextSideLinkNum,
            d.ZCRegionId,
            d.ATSRegionId,
            d.LogicCIRegionId,
            d.PhysicCIRegionId,
            d.speedLimitInfo,
            d.slopeInfo
        ]);
    });

    param.point = [];
    data.point.forEach(d => {
        param.point.push([
            parseInt(d.id),
            0,//d.pointName,
            parseInt(d.relatePointNum),
            d.km,
            d.linkId >= 0 ? d.linkId : 0,
            d.linkOffset >= 0 ? d.linkOffset : 0,
            d.sideLinkId,
            d.sideLinkOffset,
            d.confluentLinkId,
            d.confluentLinkOffset,
            d.speedLimit
        ]);
    });

    param.axle = [];
    data.axle.forEach(d => {
        param.axle.push([
            parseInt(d.id),
            parseInt(d.id),
            d.axleType,
            d.km,
            d.axleLinkId,
            d.axleLinkOffset
        ]);
    });

    param.axleSegment = [];
    data.axleSegment.forEach(d => {
        let cacheLink = d.links.length == 3 ? d.links[1] : 65535;
        let transData = {
            name: d.axleSegmentName,
            axleSegmentUint: [
                parseInt(d.axleSegmentNum),
                parseInt(d.originAxleNum),    //【起点计轴器编号】
                parseInt(d.terminalAxleNum),  //【终点计轴器编号】
                parseInt(d.originLinkId),     //【起点所处link编号】
                // Number(d.originLinkOffset), //【起点所处link偏移量】
                parseInt(d.terminalLinkId),   //【终点所处link编号】
                // Number(d.terminalLinkOffset),   //【终点所处link偏移量】
                cacheLink,
                65536,                 //包含逻辑区段数目
                65536, 65536, 65536, 65536, 65536, 65536, 65536, 65536, 65536, 65536, 65536, 65536, 65536, 65536, 65536, 65536, // 逻辑区段1-16编号
                parseInt(d.relatePointCount), //关联道岔数目
                d.p1, d.p1d, d.p2, d.p2d
            ]
        };
        param.axleSegment.push(transData);
    });

    param.grade = [];
    data.grade.forEach(d => {
        // param.grade.push([
        //     d.id,
        //     d.originLinkId,
        //     d.originLinkOffset,
        //     d.terminalLinkId,
        //     d.terminalLinkOffset,
        //     d.originRelatePointId,
        //     d.originMainGradeId,
        //     d.originSideGradeId,
        //     d.ternimalRelatePointId,
        //     d.terminalMainGradeId,
        //     d.terminalSideGradeId,
        //     d.radValue,
        //     d.nclineDir,
        //     d.adius
        // ]);

        param.grade.push([
            d.no,
            d.startLink,
            d.startLinkOff,
            d.endLink,
            d.endLinkOff,
            d.startPointID,
            d.startMainID,
            d.startCID,
            d.endPointID,
            d.endMainID,
            d.endCID,
            d.value,
            d.dir,
            d.R
        ]);
    });

    param.staticRestrict = [];
    let limitIndex = 1;
    data.staticRestrict.forEach(d => {
        // param.staticRestrict.push([
        //     d.id,
        //     d.limitLinkId,
        //     d.originLinkOffset,
        //     d.terminalLinkOffset,
        //     Number(d.relatePointId),
        //     d.speedLimit
        // ]);

        param.staticRestrict.push([
            limitIndex++,
            parseInt(d.no),
            parseInt(d.start),
            parseInt(d.end),
            parseInt(d.point),
            parseInt(d.value)
        ]);
    });

    param.stopArea = [];
    let stopAreaIdMapping = {};
    data.stopArea.forEach(d => {
        let stopAreaID = Number(d.stopAreaID);
        d.sbID = stopAreaID > 0 ? stopAreaID : Number(d.id);
        stopAreaIdMapping[d.id] = d.sbID;
    });

    // 排序
    data.stopArea.sort((a, b) => {
        return a.sbID - b.sbID;
    });

    data.stopArea.forEach(d => {
        let stopAreaID = Number(d.stopAreaID);
        param.stopArea.push(
            {
                szCaption: d.stationName,
                DesId: d.desNum,
                StopAreaUnit: [
                    d.sbID,
                    d.linkId,
                    d.attr,
                    d.parentId ? d.parentId : 65535,
                    d.subId ? d.subId : 65535,
                    d.subAreasCount,
                    d.minParkTime,
                    d.maxParkTime,
                    d.parkTime,
                    d.screenCount,
                    d.screenNum1,
                    d.screenNum2,
                    d.emergStopCount,
                    d.emergStopID1,
                    d.emergStopID2,
                    d.stopPointCount,
                    d.stopPointID1,
                    d.stopPointID2,
                    d.stopPointID3,
                    d.doorOpenMode,
                    d.doorOpenTime,
                    d.doorCloseMode,
                    d.doorCloseTime,
                    d.parkSteadyTime,
                    parseInt(d.stationID)
                ]
            }
        )
    });

    param.stopPoint = [];
    data.stopPoint.forEach(d => {
        param.stopPoint.push([
            d.id,
            d.attr,
            d.dir,
            d.linkId,
            parseInt(d.linkOffset),
            d.overLapId,
            d.atoRange,
            d.atpRange,
            parseInt(stopAreaIdMapping[Number(d.stopAreaID)])
        ]);
    });

    param.station = [];
    data.station.forEach(d => {
        param.station.push(
            {
                szGongLiBiao: d.centerKm.toString(),
                szName: d.stationName.toString(),
                stationUnit: [
                    d.id,
                    d.stopAreaID,
                    d.relatedDir,
                    d.logicSgmtCount,
                    d.logicSgmt1,
                    d.logicSgmt2,
                    d.logicSgmt3,
                    d.logicSgmt4,
                    d.logicSgmt5,
                    d.logicSgmt6,
                    d.logicSgmt7,
                    d.logicSgmt8,
                    d.logicSgmt9,
                    d.logicSgmt10
                ]
            }
        )
    });

    param.InterLocking = [];
    if (data.InterLocking) {
        data.InterLocking.forEach(d => {
            let innerData = [
                d.ReverseLink,
                d.ReversePoint,
                d.ReversePointStatus,
                d.ReleasePointLnk,
                d.ReleasePointOff,
                d.ReleasePointDir,
                d.BehindPointLnk,
                d.BehindPointOff,
                d.BehindPointDir
            ];
            let linkCount = d.ReverseArea.length;
            innerData.push(linkCount);
            for (let i = 0; i < 20; i++) {
                if (i < linkCount && d.ReverseArea[i]) {
                    innerData.push(d.ReverseArea[i]);
                } else {
                    innerData.push(65535);
                }
            }
            param.InterLocking.push(innerData);
        });
    }


    param.logicSegment = [];
    data.logicSegment.forEach(d => {
        let transData = {
            name: d.name,
            logicSegmentUint: [
                d.id,             // 编号
                d.startLinkId,    // 起点所处link编号
                d.startLinkOffset, // 起点所处link偏移量
                d.endLinkId,       // 终点所处link编号
                d.endLinkOffset,   // 终点所处link偏移量
                d.axleSegmentId    // 所属计轴区段编号 
            ]
        };
        param.logicSegment.push(transData);
    });

    param.signal = [];
    data.signal.forEach(d => {
        param.signal.push({
            name: d.signalName,
            signalUnit: [
                d.signalNum,       /*编号*/
                d.signalType,	            /*信号机类型*/
                d.signalLinkId,	            /*信号机所处link编号*/
                d.signalLinkOffset,	        /*信号机所处link偏移量(cm)*/
                d.direction,			    /*信号机防护方向(16进制)*/
                d.protectLinkId,		        /*信号机防护点所处link编号*/
                d.protectLinkOffset,		    /*信号机防护点所处link偏移量(cm)*/
                d.passSignal ? d.passSignal : 65535,	            /*开口信号机标志*/
                d.enableSignal,                /*信号机判断闯信号功能标志*/
                d.shineSignal,                 /*信号机亮灭功能标志*/
                d.signalDengLie,           /*信号机灯列*/
                d.dengWeiFengBi               /*灯位封闭信息*/
            ]
        });
    });
    return param;
};

/**
 * 下载设置坡度模板
 */
fileSaveHelper.downloadSetGradeTemplate = () => {
    let workBook = XLSX.utils.book_new();
    let sheetData = [
        ["序号", "起点公里标(m)", "终点公里标(m)", "坡度值", "竖曲线半径(m)", "方向(1=上行 2=下行)"]
    ];

    let workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "坡度");
    XLSX.writeFile(workBook, `设置坡度模板.xlsx`);
};

/**
 * 下载设置限速模板
 */
fileSaveHelper.downloadSetLimitTemplate = () => {
    let workBook = XLSX.utils.book_new();
    let sheetData = [
        ["序号", "起点公里标(m)", "终点公里标(m)", "曲线半径(m)", "缓和曲线长度(m)", "限速(km/h)", "欠超高(mm)", "方向(1=上行 2=下行)"]
    ];

    let workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "静态限速");
    XLSX.writeFile(workBook, `设置静态限速模板.xlsx`);
};

/**
 * 下载设置限速模板
 */
fileSaveHelper.downloadSetLimitByUserTemplate = () => {
    let workBook = XLSX.utils.book_new();
    let sheetData = [
        ["起点公里标(m)", "终点公里标(m)", "方向(1=上行 2=下行)", "限速值"]
    ];

    let workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "自定义限速");
    XLSX.writeFile(workBook, `自定义限速模板.xlsx`);
};

/**
 * 下载设置进路模板
 */
fileSaveHelper.downloadSetEnterRouteTemplate = () => {
    let workBook = XLSX.utils.book_new();
    let sheetData = [
        ["编号", "进路性质(1=通过|2=折返)", "始端信号机ID", "终端信号机ID", "保护计轴区段1始端计轴", "保护计轴区段1终端计轴", "保护计轴区段2始端计轴", "保护计轴区段2终端计轴", "保护计轴区段3始端计轴", "保护计轴区段3终端计轴", "保护计轴区段4始端计轴", "保护计轴区段4终端计轴", "保护计轴区段5始端计轴", "保护计轴区段5终端计轴"]
    ];

    let workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "进路信息设置");
    XLSX.writeFile(workBook, `自定义进路信息模板.xlsx`);
};


export default fileSaveHelper;