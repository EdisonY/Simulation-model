let BaseData = {};

/**
 * 元素默认Id
 */
BaseData.DefaultTctId = 0;

/**
 * 元素的运行方向
 */
BaseData.Direction = {
    "NotSet": {
        name: "未设置",
        value: 0
    },
    "Up": {
        name: "上行",
        value: 1
    },
    "Down": {
        name: "下行",
        value: 2
    }
};

/**
 * 道岔岔尖方向
 */
BaseData.PointDirection = {
    "Left": 1,
    "Right": 2
}

/**
 * 道岔类型
 */
BaseData.PointType = {
    "N9Direct": 1,   // 9#直尖轨
    "N9Curved": 2,   // 9#曲尖轨
    "N7": 3,         // 7#
    "N12": 4,        // 12#
}

// /**
//  * 道岔限速信息
//  */
// BaseData.PointLimit = {
//     1: {
//         "Side": parseInt(30 * 1000 / 36),
//         "Main": parseInt(80 * 1000 / 36)
//     },
//     2: {
//         "Side": parseInt(35 * 1000 / 36),
//         "Main": parseInt(100 * 1000 / 36)
//     },
//     3: {
//         "Side": parseInt(25 * 1000 / 36),
//         "Main": parseInt(60 * 1000 / 36)
//     },
//     4: {
//         "Side": parseInt(50 * 1000 / 36),
//         "Main": parseInt(120 * 1000 / 36)
//     }
// };

/**
 * 道岔限速信息
 */
BaseData.PointLimit = {
    1: {
        "Side": 30,
        "Main": 80
    },
    2: {
        "Side": 35,
        "Main": 100
    },
    3: {
        "Side": 25,
        "Main": 60
    },
    4: {
        "Side": 50,
        "Main": 120
    }
};

/**
 * 相对于Link的方向
 */
BaseData.RelatedLinkDirection = {
    'Same': 0x55,
    'Diff': 0xaa,
    'Unknown': 0xff
};

/**
 * 停车点属性
 */
BaseData.StopType = {
    EMAP_OPERAT_STOP_POINT: 0x01,           /*站台运营停车点*/
    EMAP_EXITROUTE_STOP_POINT: 0x02,        /*退出停车点（CBTC区域至非CBTC区域)*/
    EMAP_REVERT_STOP_POINT: 0x04,           /*折返停车点*/
    EMAP_SIGNAL_STOP_POINT: 0x08,           /*站外信号机停车点(非折返)*/  /*通过停车点*/
    EMAP_REVERTEND_STOP_POINT: 0x10,        /*折返后停车点*/
    EMAP_SWITCH_STOP_POINT: 0x20,           /*转换轨(小站台)停车点（非CBTC区域至CBTC区域）*/
    EMAP_SLEEP_AWAKE_STOP_POINT: 0x0040,    /*休眠唤醒停车点*/
    EMAP_CLEAN_REQ_STOP_POINT: 0x0080,      /*洗车请求停车点*/
    EMAP_CLEAN_FRONT_STOP_POINT: 0x0100,    /*前端洗车停车点*/
    EMAP_CLEAN_END_STOP_POINT: 0x0200,      /*后端洗车停车点*/
    EMAP_PASS_REQ_STOP_POINT: 0x0400,       /*通过请求停车点*/
    EMAP_4GROUP_STOP_POINT: 0x0800,         /*4编组停车点*/
    EMAP_6GROUP_STOP_POINT: 0x1000,         /*6编组停车点*/
}

/**
 * 站显示的连接线
 */
BaseData.StationPortLocation = {
    "UpAndDown": 1,
    "Up": 2,
    "Down": 3
}

/**
 * 显示的站台门
 */
BaseData.PSDLocation = {
    "UpAndDown": 1,
    "Up": 2,
    "Down": 3
}

/**
 * 信号机类型
 */
BaseData.SignalType = {
    "TWO_SHORT": 1,
    "TWO_TALL": 2,
    "THREE_SHORT": 3,
    "THREE_TALL": 4
}

// TODO 是这么定义吗 
/**
 * 信号机方向
 */
BaseData.SignalDirection = {
    "Up": 0x55,
    "Down": 0xaa
}

// --- 颜色设置 ---

/**
 * 颜色设置
 */
BaseData.Colors = {
    'Bumper': "#EEE", // 车挡颜色
    'BumperLine': "#EEE", // 车挡线颜色
    'Track': "#28A4F1", // 轨道颜色  #28A4F1
    'PointMain': "#EEE", // 道岔主线
    'Point': "#EEE", // 岔尖线
    'PointBlock': "#EEE8", // 岔尖块
    'Selected': 'orange', // 选中颜色
    'Stop': '#E00', // 停车点
    'PSD': '#409F28', //站台门颜色
    'StationBackground': '#222', // 站台背景色
    'StationBorder': 'gray', // 站台边框色
    'StationText': '#EEE', // 站台文字颜色
    'StationSelected': '#333',
    'FB': '#0ff',
    'WB': '#c11',
    'IB': '#08c',
    'LDR': '#c11',
    'DB': '#ccc',
};

export default BaseData;