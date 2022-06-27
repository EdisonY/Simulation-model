let DSUDefine = {};

/**
 * Link线路上下行
 */
DSUDefine.LineDirection = {
    'Up': 0x55,
    'Down': 0xaa,
    'Undefine': 0x00
};

/**
 * Link线路上下行
 */
DSUDefine.LinkCellType = {
    'tct.Bumper': 1,/*线路终点*/
    'tct.Axle': 2,/*计轴点*/
    'tct.Point': 3,/*道岔点*/
    'tct.VirtualPort': 100,/*虚拟端口道岔点*/
    'Default': 0
};

/**
 * 计轴类型
 */
DSUDefine.AxleType = {
    'PUTONG': 1,            /*普通计轴器*/
    'CHAOXIANJUEYUAN': 2,   /*超限绝缘计轴器*/
    'FANGZHENG': 3,         /*仿真计轴器*/
    'JUEYUANJIE': 4         /*绝缘节*/
};

export default DSUDefine;