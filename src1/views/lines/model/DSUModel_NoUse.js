
/**
 * 坡度结构
 */
export class DSU_Grade {
    constructor() {
        this.id = 65535;              //【编号】
        this.originLinkId = 65535;          //【坡度起点所处link编号】
        this.originLinkOffset = 65535;      //【坡度起点所处link偏移量】
        this.terminalLinkId = 65535;        //【坡度终点所处link编号】
        this.terminalLinkOffset = 65535;    //【坡度终点所处link偏移量】
        this.originRelatePointId = 65535;   //【起点关联道岔编号】
        this.originMainGradeId = 65535;     //【起点正线坡度编号】
        this.originSideGradeId = 65535;     //【起点侧线坡度编号】
        this.ternimalRelatePointId = 65535; //【终点关联道岔编号】
        this.terminalMainGradeId = 65535;   //【终点正线坡度编号】
        this.terminalSideGradeId = 65535;   //【终点侧线坡度编号】
        this.radValue = 0;              //【坡度值】
        this.nclineDir = 0xaa;             //【坡段相对于线路逻辑方向的倾斜方向】
        this.adius = 0;                 //【竖曲线半径】
    }
}


/**
 * 限速结构
 */
 export class DSU_Limit {
    constructor() {
        this.id = 65535;                    //【编号】
        this.limitLinkId = 65535;           //【该限速区域所处link编号】
        this.originLinkOffset = 65535;      //【起点所处link偏移量(cm)】
        this.terminalLinkOffset = 65535;    //【终点所处link偏移量(cm)】
        this.relatePointId = 65535;         //【关联道岔编号】
        this.speedLimit = 2361;             //【静态限速值】
    }
}

/**
 * 应答器结构
 * 结构说明：
 * 固定应答器特有属性：起点相邻相关属性【有的时候起点相邻不区分应答器类型，使用的时候要确定业务再实现】
 * 可变应答器特有属性：关联信号机、作用方向等属性
 */
 export class DSU_Balise {
    constructor(s) {
        this.baliseNum = s.balisNum;					    //【编号】
        this.baliseID = s.baliseID;			            //【应答器ID】
        this.baliseName = "FB";                           //【应答器名称】
        this.baliseLinkId = 0;                            //【应答器所处link编号】
        this.baliseLinkOfsset = 0;                        //【应答器所处link偏移量(cm)】
        this.signalNum = 0;                               //【与应答器关联的信号机编号】
        this.direction = 0x00;                            //【应答器作用方向()】
        this.baliseType = 0;                              //【应答器类型】
        this.originBaliseCount = 0;                       //【在所处link逻辑方向上起点的相邻的应答器数量】
        this.originBaliseIds = [];                        //【在所处link逻辑方向上起点相邻的应答器的编号】
        this.originBaliseDistances = [];                  //【在所处link逻辑方向上起点相邻的应答器的距离】
        this.originBaliseDirs = [];                       //【沿线路的起点方向，与本应答器相邻且对列车有效（可直接到达）的应答器间路径上，列车经过本应答器再经过该相邻应答器时的方向】
        this.originBaliseRelatePointNums = [];            //【起点相邻应答器关联道岔编号】
        this.originBaliseRelatePointStates = [];          //【起点相邻应答器关联道岔状态】	
        this.terminalBaliseCount = 0;                     //【在所处link逻辑方向上终点的相邻的应答器数量】
        this.terminalBaliseIds = [];                      //【在所处link逻辑方向上终点相邻的应答器的编号】
        this.terminalBaliseDistances = [];                //【在所处link逻辑方向上终点相邻的应答器的距离】
        this.terminalBaliseDirs = [];                     //【沿线路的终点方向，与本应答器相邻且对列车有效（可直接到达）的应答器间路径上，列车经过本应答器再经过该相邻应答器时的方向】
        this.terminalBaliseRelatePointNums = [];          //【终点相邻应答器关联道岔编号】
        this.terminalBaliseRelatePointStates = [];        //【终点相邻应答器关联道岔状态】		
        this.leuNum = 0;                                  //【LEU编号】
    }
}

/**
 * 计轴结构
 */
 export class DSU_Axle {
    constructor() {
        this.id = 0;	    //【编号】
        this.axleName = 'JZ';   //【计轴器名称】
        this.axleType = 0x00;       //【类型信息】
        this.km = 0;              //【计轴器公里标】
        this.axleLinkId = 0;          //【计轴器所处link编号】	
        this.axleLinkOffset = 0;      //【计轴器所处link偏移量(cm)】
    }
}

/**
 * 计轴区段
 */
 export class DSU_AxleSegment {
    constructor(s) {
        this.axleSegmentNum = s.axleSegmentNum;       //【编号】
        this.axleSegmentName = s.axleSegmentName;	    //【计轴区段名称】
        this.originAxleNum = 0;                       //【起点计轴器编号】
        this.terminalAxleNum = 0;                     //【终点计轴器编号】
        this.originLinkId = 0;                        //【起点所处link编号】
        this.originLinkOffset = 0;                        //【起点所处link偏移量】
        this.terminalLinkId = 0;                      //【终点所处link编号】
        this.terminalLinkOffset = 0;                      //【终点所处link偏移量】
        this.logicSegmentCount = 0;                   //【计轴区段包含的逻辑区段的个数】
        this.logicSegmentNums = [];                   //【计轴区段包含的逻辑区段的编号】
        this.relatePointCount = 0;                    //【关联道岔数目】	
        this.relatePointNums = [];                    //【关联道岔编号】
        this.relatePointStatus = [];                  //【关联道岔状态】
        this.relatePhysicSegmentId = 0;               //【对应物理区段】
    }
}
