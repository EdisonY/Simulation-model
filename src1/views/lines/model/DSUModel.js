import DSUDefine from "./DSUDefine";

/**
 * Link表结构
 */
export class DSU_Link {
    constructor() {
        this.id = 0;           //【索引编号】
        this.length = 0;            //【Link长度（cm）】
        this.direction = DSUDefine.LineDirection.Undefine;  // 【线路上下行】0xaa=下行 0x55=上行

        this.startCellType = DSUDefine.LinkCellType.Default;    //【起点端点类型】
        this.startCellId = 0xffff;       //【起点端点编号】
        this.preLinkNum = 0xffff;        //【起点连接正线link编号】
        this.preSideLinkNum = 0xffff;    //【起点侧线link编号】

        this.endCellType = DSUDefine.LinkCellType.Default;      //【终点端点类型】
        this.endCellId = 0xffff;         //【终点端点编号】
        this.nextLinkNum = 0xffff;        //【终点连接正线link编号】
        this.nextSideLinkNum = 0xffff;   //【终点连接侧线link编号】

        this.ZCRegionId = 0xffff;        //【所属ZC区域编号】
        this.ATSRegionId = 0xffff;       //【所属ATS区域编号】
        this.LogicCIRegionId = 0xffff;   //【所属逻辑CI区域编号】
        this.PhysicCIRegionId = 0xffff;  //【所属物理CI区域编号】

        this.speedLimitInfo = 0;    //【Link限速信息属性】
        this.slopeInfo = 0;         //【Link坡度信息属性】

        // --- 以下是计算辅助信息，不需要存储 ---
        this.isSideLink = 0; // 是否为侧线link
        this.startKm = 0; // 起始公里标
        this.startKmOffset = 0; // 起始公里标偏移量
    }
}

/**
 * 道岔表结构
 */
export class DSU_Point {
    constructor() {
        this.id = 0;                    // 【道岔编号】
        this.pointName = '道岔';        // 【道岔名称】
        this.relatePointNum = 0;        // 【联动道岔编号】
        this.km = 0;                    // 【道岔点公里标】
        this.linkId = 0;                // 【所处正线link编号】
        this.linkOffset = 0;            // 【所处正线link偏移量(cm)】
        this.sideLinkId = 0;            // 【所处侧线link编号】
        this.sideLinkOffset = 0;        // 【所处侧线link偏移量(cm)】
        this.confluentLinkId = 0;       // 【所处汇合link编号】
        this.confluentLinkOffset = 0;   // 【所处汇合link偏移量(cm)】
        this.speedLimit = 972;          // 【道岔反位静态限制速度(cm/s)】
    }
}

/**
 * 停车区域
 */
export class DSU_StopArea {
    constructor(s) {
        this.id = 0;                   //【编号】
        this.stationName = '';          //【所属车站名称】
        this.desNum = '';               //【目的地编号】 /*新增---严广学 ATS使用 */ /*此处遗留：文档中是单字节数组*/
        this.linkId = 0;                //【站台物理范围link编号】
        this.attr = 0;                  //【停车区域属性】
        this.minParkTime = 20;          //【站台最小停站时间】
        this.maxParkTime = 60;          //【站台最大停站时间】
        this.parkTime = 30;             //【站台默认停站时间】
        this.screenCount = 0;           //【站台中屏蔽门数量】
        this.screenNum1 = 65535;        //【安全屏蔽门编号1】
        this.screenNum2 = 65535;        //【安全屏蔽门编号2】
        this.emergStopCount = 0;        //【站台中紧急停车按钮数量】
        this.emergStopID1 = 65535;      //【紧急停车按钮编号1】
        this.emergStopID2 = 65535;      //【紧急停车按钮编号2】
        this.stopPointCount = 0;        //【站台包含停车点数目】
        this.stopPointID1 = 65535;      //【站台包含停车点编号1】 /*20160314 根据互联互通需求修改 by guojian.hou*/
        this.stopPointID2 = 65535;      //【站台包含停车点编号2】 /*20160314 根据互联互通需求修改 by guojian.hou*/
        this.stopPointID3 = 65535;      //【站台包含停车点编号3】 /*20160314 根据互联互通需求修改 by guojian.hou*/
        this.doorOpenMode = 0;          //【站台开门方式】
        this.doorOpenTime = 0;          //【站台开门时间间隔】
        this.doorCloseMode = 0;         //【站台关门方式】
        this.doorCloseTime = 0;         //【站台关门时间间隔】
        this.parkSteadyTime = 0;        //【站台默认停稳时间】
        this.stationID = 0;             //【站台所属车站编号】
    }
}


/**
 * 信号机结构
 */
export class DSU_Signal {
    constructor() {
        this.signalNum = 65535;       /*编号*/
        this.signalName = '';     /*信号机名称*/
        this.signalType = 0;	            /*信号机类型*/
        this.signalAttr = 0;                /*信号机属性*/
        this.signalLinkId = 0;	            /*信号机所处link编号*/
        this.signalLinkOffset = 0;	        /*信号机所处link偏移量(cm)*/
        this.direction = 0x55;			    /*信号机防护方向(16进制)*/
        this.protectLinkId = 0;		        /*信号机防护点所处link编号*/
        this.protectLinkOffset = 0;		    /*信号机防护点所处link偏移量(cm)*/
        this.passSignal = 0;	            /*开口信号机标志*/
        this.enableSignal = 0;                /*信号机判断闯信号功能标志*/
        this.shineSignal = 0;                 /*信号机亮灭功能标志*/
        this.signalDengLie = 0;             /*信号机灯列*/
        this.dengWeiFengBi = 0;               /*灯位封闭信息*/
    }
}

/**
 * 逻辑区段表
 */
export class DSU_LogicSegment {
    constructor() {
        this.name = '';
        this.id = 65535;              // 编号
        this.startLinkId = 65535;     // 起点所处link编号
        this.startLinkOffset = 65535; // 起点所处link偏移量
        this.endLinkId = 65535;       // 终点所处link编号
        this.endLinkOffset = 65535;   // 终点所处link偏移量
        this.axleSegmentId = 65535;   // 所属计轴区段编号
    }
}


/**
* 停车点
*/
export class DSU_Stop {
    constructor(s) {
        this.id = 0;           //【编号】
        this.attr = 0x01;       //【停车点属性】
        this.dir = 0;           //【停车点作用方向(16进制)】
        this.linkId = 0;        //【停车点所处线路link编号】
        this.linkOffset = 0;    //【停车点link偏移量(cm)】
        this.overLapId = 65535;     //【停车点对应保护区段编号】
        this.atoRange = 300;      //【停车点对应ATO作用窗范围】
        this.atpRange = 300;      //【停车点对应ATP作用窗范围】
        this.stopAreaID = 0;	//【停车点对应停车区域ID】
    }
}


/**
 * 站台结构
 */
class DSU_Staion {
    constructor() {
        this.id = 0;             //【编号】   //【】
        this.centerKm = '';     //【中心公里标】
        this.stationName = '';    //【车站名称】
        // --- sub_structure ---
        this.stopAreaID = 0;      //【对应停车区域编号】
        this.relatedDir = '';     //【逻辑方向上站台相对于停车区域的方向】
        this.logicSgmtCount = 0;  //【站台对应触发逻辑区段个数】
        this.logicSgmt1 = 65535;  //【站台对应触发逻辑区段id1】
        this.logicSgmt2 = 65535;  //【站台对应触发逻辑区段id2】
        this.logicSgmt3 = 65535;  //【站台对应触发逻辑区段id3】
        this.logicSgmt4 = 65535;  //【站台对应触发逻辑区段id4】
        this.logicSgmt5 = 65535;  //【站台对应触发逻辑区段id5】
        this.logicSgmt6 = 65535;  //【站台对应触发逻辑区段id6】
        this.logicSgmt7 = 65535;  //【站台对应触发逻辑区段id7】
        this.logicSgmt8 = 65535;  //【站台对应触发逻辑区段id8】
        this.logicSgmt9 = 65535;  //【站台对应触发逻辑区段id9】
        this.logicSgmt10 = 65535; //【站台对应触发逻辑区段id10】
    }
}