let SelectionData = {};

/**
 * 车站垂直高度
 */
SelectionData.stationVerticalSize = [
    {
        value: 3,
        name: "小",
    },
    {
        value: 4,
        name: "中",
    },
    {
        value: 5,
        name: "大",
    },
];

/**
 * 车站的站台类型
 */
SelectionData.platformTypes = [
    {
        value: 1,
        name: "上下全部",
    },
    {
        value: 2,
        name: "上",
    },
    {
        value: 3,
        name: "下",
    },
];

/**
 * 车站的连接端口
 */
SelectionData.stationPortTypes = [
    {
        value: 1,
        name: "上下全部",
    },
    {
        value: 2,
        name: "上",
    },
    {
        value: 3,
        name: "下",
    },
];

/**
 * 应答器类型
 */
SelectionData.baliseTypes = [
    {
        value: "VB",
        name: "可变应答器",
    },
    {
        value: "FB",
        name: "固定应答器",
    },
    {
        value: "IB",
        name: "填充/预告应答器",
    },
    {
        value: "WB",
        name: "轮径矫正应答器",
    },
    {
        value: "DB",
        name: "休眠唤醒应答器",
    },
    {
        value: "LDR",
        name: "应答器环线",
    },
];

/**
 * 信号机类型
 */
SelectionData.signalTypes = [
    {
        value: 1,
        name: "两显示矮柱",
    },
    {
        value: 2,
        name: "两显示高柱",
    },
    {
        value: 3,
        name: "三显示矮柱",
    },
    {
        value: 4,
        name: "三显示高柱",
    },
];

/**
 * 道岔类型
 */
SelectionData.pointTypes = [
    {
        value: 1,
        name: "9#直尖轨"
    },
    {
        value: 2,
        name: "9#曲尖轨"
    },
    {
        value: 3,
        name: "7#道岔"
    },
    {
        value: 4,
        name: "12#道岔"
    },
];

/**
 * 信号机方向
 */
SelectionData.signalDirections = [
    {
        value: 0x55,
        name: "上行",
    },
    {
        value: 0xaa,
        name: "下行",
    },
];

/**
 * 停车区域上下行
 */
SelectionData.locationTypes = [
    {
        id: 0,
        name: '未设置'
    },
    {
        id: 1,
        name: '上行'
    }, 
    {
        id: 2,
        name: '下行'
    }
]

SelectionData.reverseTypes=[
    {
        id:0,
        name:'不折反'
    },
    {
        id:1,
        name:'上行方向折返'
    },
    {
        id:2,
        name:'下行方向折反'
    },
    {
        id:3,
        name:'双向折返'
    }
]

export default SelectionData;