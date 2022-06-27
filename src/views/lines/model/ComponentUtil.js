import * as Util from '@/utils/util';

/**
 * 车站组件相关的工具类
 */
let ComponentUtil = {};

/**
 * 获取一个新的组件
 * @param {*} formData 表单基础数据
 * @param {number} x 组件生成时相对于画布的x偏移量
 * @param {number} y 组件生成时相对于画布的y偏移量
 */
ComponentUtil.getNewComponent = (formData, x, y) => {
    let component = {
        id: Util.getUUID(),
        ...formData,
        offsetX: x,
        offsetY: y,
        thumbnail: null,
        cells: [],          // 组件元素信息
        team: [],            // 组信息
        logicData: null,    // 组件线路计算的逻辑信息
        info: {             // 包括各类元素的id起始信息、公里标起始信息、端口线列表
            "tct.Track": {
                idMin: Number.MAX_SAFE_INTEGER,
                idMax: Number.MIN_SAFE_INTEGER,
                idStart: 0
            },
            "tct.Balise": {
                idMin: Number.MAX_SAFE_INTEGER,
                idMax: Number.MIN_SAFE_INTEGER,
                idStart: 0
            },
            "tct.Point": {
                idMin: Number.MAX_SAFE_INTEGER,
                idMax: Number.MIN_SAFE_INTEGER,
                idStart: 0
            },
            "tct.Bumper": {
                idMin: Number.MAX_SAFE_INTEGER,
                idMax: Number.MIN_SAFE_INTEGER,
                idStart: 0
            },
            "tct.Axle": {
                idMin: Number.MAX_SAFE_INTEGER,
                idMax: Number.MIN_SAFE_INTEGER,
                idStart: 0
            },
            "tct.Signal": {
                idMin: Number.MAX_SAFE_INTEGER,
                idMax: Number.MIN_SAFE_INTEGER,
                idStart: 0
            },
            "tct.Station": {
                idMin: Number.MAX_SAFE_INTEGER,
                idMax: Number.MIN_SAFE_INTEGER,
                idStart: 0
            },
            "tct.Stop": {
                idMin: Number.MAX_SAFE_INTEGER,
                idMax: Number.MIN_SAFE_INTEGER,
                idStart: 0
            },
            "tct.StopArea": {
                idMin: Number.MAX_SAFE_INTEGER,
                idMax: Number.MIN_SAFE_INTEGER,
                idStart: 0
            },
            "tct.VirtualPort": {
                idMin: Number.MAX_SAFE_INTEGER,
                idMax: Number.MIN_SAFE_INTEGER,
                idStart: 0
            },
            "tct.Grade": {
                idMin: Number.MAX_SAFE_INTEGER,
                idMax: Number.MIN_SAFE_INTEGER,
                idStart: 0
            },
            "tct.Limit": {
                idMin: Number.MAX_SAFE_INTEGER,
                idMax: Number.MIN_SAFE_INTEGER,
                idStart: 0
            },
            "tct.StationLimit": {
                idMin: Number.MAX_SAFE_INTEGER,
                idMax: Number.MIN_SAFE_INTEGER,
                idStart: 0
            },
            "tct.Tag": {
                idMin: Number.MAX_SAFE_INTEGER,
                idMax: Number.MIN_SAFE_INTEGER,
                idStart: 0
            },
            portLines: [],
            km: {
                kmMin: Number.MAX_SAFE_INTEGER,
                kmMax: Number.MIN_SAFE_INTEGER,
                kmStart: 0
            }
        }
    };
    return component;
};

/**
 * 更新组件id
 * @param {*} component 组件
 */
ComponentUtil.updateId = (component) => {
    if (!component) {
        return;
    }

    // 1. 生成新的id
    component.id = Util.getUUID(); // 新组件id
    component.team.teamId = Util.getUUID(); // 新team的id
    component.team.nodes = [];

    let cellIdMap = {};
    // 2. 更新元素相关的id
    component.cells.forEach(cell => {
        cellIdMap[cell.id] = Util.getUUID();  // 生成新旧id对照字典
        cell.id = cellIdMap[cell.id];       // 更新id
        cell.drawData.stationComponentId = component.id;    // 更新父组件id
        cell.drawData.teamId = component.team.teamId;       // 更新teamId
        component.team.nodes.push(cell.id);
    });

    // 更新相关端口元素的id
    component.cells.forEach(cell => {
        if (cell.type == "tct.Track") {
            if (cell.drawData.nodeOne) {
                cell.drawData.nodeOne.id = cellIdMap[cell.drawData.nodeOne.id];
            }
            if (cell.drawData.nodeTwo) {
                cell.drawData.nodeTwo.id = cellIdMap[cell.drawData.nodeTwo.id];
            }
            if (cell.drawData.elements) {
                cell.drawData.elements.forEach(element => {
                    element.id = cellIdMap[element.id];
                });
            }
            if (cell.drawData.stations) {
                cell.drawData.stations.forEach(staion => {
                    staion.id = cellIdMap[staion.id];
                });
            }
        }
        else if (cell.type == "tct.Station") {
            if (cell.drawData.nodeUp) {
                cell.drawData.nodeUp.id = cellIdMap[cell.drawData.nodeUp.id];
            }
            if (cell.drawData.nodeDown) {
                cell.drawData.nodeDown.id = cellIdMap[cell.drawData.nodeDown.id];
            }
        } else if (cell.type == "tct.Point") {
            if (cell.drawData.nodeLeft) {
                cell.drawData.nodeLeft.id = cellIdMap[cell.drawData.nodeLeft.id];
            }
            if (cell.drawData.nodeMiddle) {
                cell.drawData.nodeMiddle.id = cellIdMap[cell.drawData.nodeMiddle.id];
            }
            if (cell.drawData.nodeRight) {
                cell.drawData.nodeRight.id = cellIdMap[cell.drawData.nodeRight.id];
            }
        } else if (cell.type == "tct.Bumper") {
            if (cell.drawData.nodeNext) {
                cell.drawData.nodeNext.id = cellIdMap[cell.drawData.nodeNext.id];
            }
        } else if (cell.type == "tct.Axle" || cell.type == "tct.Balise" || cell.type == "tct.Signal" || cell.type == "tct.Stop" || cell.type == "tct.StopArea") {
            if (cell.drawData.nodeParent) {
                cell.drawData.nodeParent.id = cellIdMap[cell.drawData.nodeParent.id];
            }
        }
    });

    // 更新端口线的id
    let portLines = [];
    component.info.portLines.forEach(line => {
        portLines.push(cellIdMap[line]);
    });
    component.info.portLines = portLines;
    return component;
};

/**
 * 更新组件元素的全局tctId
 * @param {*} idMap 全局idMap映射表
 * @param {*} component 组件
 */
ComponentUtil.updateTctId = (idMap, component) => {
    if (!component) {
        return;
    }

    // 查找id起点（或者说偏移量）
    component.info["tct.Axle"].idStart = Math.max(...idMap['tct.Axle']);
    component.info["tct.Axle"].idStart = component.info["tct.Axle"].idStart < 0 ? 0 : component.info["tct.Axle"].idStart;
    component.info["tct.Balise"].idStart = Math.max(...idMap['tct.Balise']);
    component.info["tct.Balise"].idStart = component.info["tct.Balise"].idStart < 0 ? 0 : component.info["tct.Balise"].idStart;
    component.info["tct.Bumper"].idStart = Math.max(...idMap['tct.Bumper']);
    component.info["tct.Bumper"].idStart = component.info["tct.Bumper"].idStart < 0 ? 0 : component.info["tct.Bumper"].idStart;
    component.info["tct.Point"].idStart = Math.max(...idMap['tct.Point']);
    component.info["tct.Point"].idStart = component.info["tct.Point"].idStart < 0 ? 0 : component.info["tct.Point"].idStart;
    component.info["tct.Signal"].idStart = Math.max(...idMap['tct.Signal']);
    component.info["tct.Signal"].idStart = component.info["tct.Signal"].idStart < 0 ? 0 : component.info["tct.Signal"].idStart;
    component.info["tct.Station"].idStart = Math.max(...idMap['tct.Station']);
    component.info["tct.Station"].idStart = component.info["tct.Station"].idStart < 0 ? 0 : component.info["tct.Station"].idStart;
    component.info["tct.Stop"].idStart = Math.max(...idMap['tct.Stop']);
    component.info["tct.Stop"].idStart = component.info["tct.Stop"].idStart < 0 ? 0 : component.info["tct.Stop"].idStart;
    component.info["tct.StopArea"].idStart = Math.max(...idMap['tct.StopArea']);
    component.info["tct.StopArea"].idStart = component.info["tct.StopArea"].idStart < 0 ? 0 : component.info["tct.StopArea"].idStart;
    component.info["tct.Track"].idStart = Math.max(...idMap['tct.Track']);
    component.info["tct.Track"].idStart = component.info["tct.Track"].idStart < 0 ? 0 : component.info["tct.Track"].idStart;
    component.info["tct.VirtualPort"].idStart = Math.max(...idMap['tct.VirtualPort']);
    component.info["tct.VirtualPort"].idStart = component.info["tct.VirtualPort"].idStart < 0 ? 0 : component.info["tct.VirtualPort"].idStart;

    // 统一更新tctId
    component.cells.forEach(c => {
        c.tctData.tctId += component.info[c.type].idStart;
        idMap[c.type].push(c.tctData.tctId);
    });

    if (component.logicData && component.logicData.links) {
        // 更新Link表中的tctId 
        // 'tct.Bumper': 1,/*线路终点*/
        // 'tct.Axle': 2,/*计轴点*/
        // 'tct.Point': 3,/*道岔点*/
        // 'tct.VirtualPort': 100,/*虚拟端口道岔点*/
        component.logicData.links.forEach(item => {
            if (item.startCellType == 1) {
                item.startCellId += component.info["tct.Bumper"].idStart;
            } else if (item.startCellType == 2) {
                item.startCellId += component.info["tct.Axle"].idStart;
            } else if (item.startCellType == 3) {
                item.startCellId += component.info["tct.Point"].idStart;
            } else if (item.startCellType == 100) {
                item.startCellId += component.info["tct.VirtualPort"].idStart;
            }

            if (item.endCellType == 1) {
                item.endCellId += component.info["tct.Bumper"].idStart;
            } else if (item.endCellType == 2) {
                item.endCellId += component.info["tct.Axle"].idStart;
            } else if (item.endCellType == 3) {
                item.endCellId += component.info["tct.Point"].idStart;
            } else if (item.endCellType == 100) {
                item.endCellId += component.info["tct.VirtualPort"].idStart;
            }
        });
    }

    // 更新连锁关系中折返道岔编号
    if (component.InterLocking) {
        component.InterLocking.forEach(item => {
            item.ReversePoint += component.info["tct.Point"].idStart;
        });
    }


    if (component.logicData && component.logicData.stopAreas) {
        component.logicData.stopAreas.forEach(item => {
            item.id += component.info["tct.StopArea"].idStart;
        });
    }

    // 更新路径中停车区域编号
    if (component.RouteInfo) {
        console.log('--- compare ---');
        console.log(_.cloneDeep(component.RouteInfo))
        if (component.RouteInfo.upPass) {
            component.RouteInfo.upPass.forEach(a => {
                a.id += component.info["tct.StopArea"].idStart;
                for (let i = 0; i < a.data.length; i++) {
                    a.data[i] += component.info["tct.StopArea"].idStart;
                }
            });
        }
        if (component.RouteInfo.downPass) {
            component.RouteInfo.downPass.forEach(a => {
                a.id += component.info["tct.StopArea"].idStart;
                for (let i = 0; i < a.data.length; i++) {
                    a.data[i] += component.info["tct.StopArea"].idStart;
                }
            });
        }
        if (component.RouteInfo.upReverse) {
            component.RouteInfo.upReverse.forEach(a => {
                a.id += component.info["tct.StopArea"].idStart;
                for (let i = 0; i < a.data.length; i++) {
                    a.data[i] += component.info["tct.StopArea"].idStart;
                }
            });
        }
        if (component.RouteInfo.downReverse) {
            component.RouteInfo.downReverse.forEach(a => {
                a.id += component.info["tct.StopArea"].idStart;
                for (let i = 0; i < a.data.length; i++) {
                    a.data[i] += component.info["tct.StopArea"].idStart;
                }
            });
        }
        console.log(_.cloneDeep(component.RouteInfo))
    }
};

/**
 * 更新停车区域所属车站名车
 * @param {*} name 
 * @param {*} component 
 */
ComponentUtil.updateStopAreaName = (name, component, paper) => {
    let models = [];
    if (paper) {
        models = paper.model.getCells();
    }
    if (component && component.logicData && component.logicData.stopAreas) {
        component.logicData.stopAreas.forEach(s => {
            s.stationName = name;
            let tar = models.find(m => {
                return m.attributes.type == 'tct.StopArea' && m.attributes.tctData.tctId == s.id;
            });
            if (tar) {
                tar.attributes.tctData.stationName = name;
            }
        });
    }
};

export default ComponentUtil;