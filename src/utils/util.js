let tasks = {};
let uuid = require("uuid");


/**
 * 延迟执行
 *
 * @param {string} key
 * @param {function} func
 * @param {number} time
 * @returns
 */
export const setDelayTask = function (key, func, time) {
    if (tasks[key]) return;
    tasks[key] = func;
    setTimeout(() => {
        func();
        tasks[key] = null;
    }, time || 20);
};

let globalEvents = {};
/**
 * 设置全局事件
 * @param {String} evtName 事件名
 * @param {function} func 事件处理程序
 * @param {String} key 关键字
 */
export const setGlobalEvent = (evtName, func, key) => {
    if (globalEvents[evtName]) {
        globalEvents[evtName].push({
            key,
            func
        })
    } else {
        globalEvents[evtName] = [{ key, func }];
    }
};

/**
 * 触发全局事件
 * @param {String} evtName 事件名
 * @param {*} param 参数
 */
export const doGlobalEvent = (evtName, param) => {
    if (globalEvents[evtName]) {
        globalEvents.evtName.forEach(evt => {
            evt.func(param);
        });
    }
}

/**
 * 移除事件
 * @param {String} eventName 事件名
 * @param {string} key 关键字 
 */
export const removeGlobalEvent = (eventName, key) => {
    if (globalEvents[eventName]) {
        for (let i = 0; i < globalEvents[eventName].length; i++) {
            if (globalEvents[eventName].key == key) {
                globalEvents.splice(i, 1);
                i--;
            }
        }
    }
};

/**
 * 移除所有全局事件
 * @param {String} evtName 事件名
 */
export const clearGlobalEvents = (evtName) => {
    if (globalEvents[evtName]) {
        globalEvents[evtName] = [];
    }
};

/**
 * 对齐到画布网格坐标
 * @param {*} point 待对齐的坐标 {x,y}
 * @param {Number} gridSize 网格大小(像素) 
 * @returns
 */
export const alignPointToGrid = (point, gridSize = 30) => {
    let alignPoint = { x: 0, y: 0 };
    if (point && gridSize > 1) { // 计算对其网格的坐标
        alignPoint.x = (Math.round(point.x / parseFloat(gridSize))) * gridSize;
        alignPoint.y = (Math.round(point.y / parseFloat(gridSize))) * gridSize;
    }
    return alignPoint;
}

/**
 * 判断两个矩形是否有重叠区
 * @param {*} rect1 矩形1 {x,y,width,height}
 * @param {*} rect2 矩形2 {x,y,width,height}
 * @returns
 */
export const isOverlap = (rect1, rect2) => {
    if (rect1.x + rect1.width > rect2.x &&
        rect2.x + rect2.width > rect1.x &&
        rect1.y + rect1.height > rect2.y &&
        rect2.y + rect2.height > rect1.y
    )
        return true;
    else
        return false;
}

/**
 * 判断矩形是否相交
 * @param {Object} line 直线 {x1,y1,x2,y2}
 * @param {Object} rect 矩形 {x,y,width,height}
 */
export const isLineCrossRect = (line, rect) => {
    let k = (line.y1 - line.y2) / (line.x1 - line.x2);
    let b = line.y1 - k * line.x1;

    let r1 = rect.y - k * rect.x - b;
    let r2 = rect.y - k * (rect.x + rect.width) - b;
    let r3 = (rect.y + rect.height) - k * rect.x - b;
    let r4 = (rect.y + rect.height) - k * (rect.x + rect.width) - b;

    if (r1 > 0 && r2 > 0 && r3 > 0 && r4 > 0) {
        return false;
    }

    if (r1 < 0 && r2 < 0 && r3 < 0 && r4 < 0) {
        return false;
    }
    let lineRect = {
        x: line.x1 < line.x2 ? line.x1 : line.x2,
        y: line.y1 < line.y2 ? line.y1 : line.y2,
        width: Math.abs(line.x1 - line.x2),
        height: Math.abs(line.y1 - line.y2)
    };
    return isOverlap(lineRect, rect);
};


/**
 * 获取UUID
 */
export const getUUID = () => {
    return uuid.v4();
};

/**
 * 日志
 * @param {string} key 关键字
 * @param  {...any} obj 对象
 */
export const log = (key, ...obj) => {
    console.log(`--- ${key} ---`);
    for (let o of obj) {
        console.log(o);
    }
    console.log(`--- end ${key} ---`);
}

/**
 * 是否相等
 * @param {number} number1 
 * @param {number} number2 
 * @param {int} digits 精度
 */
export const isEqual = (number1, number2, digits) => {
    digits = digits == undefined ? 10 : digits; // 默认精度为10
    return number1.toFixed(digits) === number2.toFixed(digits);
}

/**
 * 获取时间字符串
 * @param {*} time 
 */
export const getCurrentDate = (time) => {
    let date = time ? new Date(time) : new Date();
    let Y = date.getFullYear() + "-";
    let M =
        (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
    let D = ("0" + date.getDate()).slice(-2) + " ";
    let h = ("0" + date.getHours()).slice(-2) + ":";
    let m = ("0" + date.getMinutes()).slice(-2) + ":";
    let s = ("0" + date.getSeconds()).slice(-2);
    return Y + M + D + h + m + s;
};

/**
 * 获取MQ消息参数
 * @param {*} msgType 
 * @param {*} data 
 */
export const getMQParam = (msgType, data) => {
    let param = {
        msgId: 1,
        msgType: msgType,
        requestId: 123456,
        session: 123456,
        data: data,
        timestamp: getCurrentDate(),
    };

    return param;
};

/**
 * 获取原始Grade信息
 * @param {*} gradeInfo 
 */
export const getRawGrade = (gradeInfo, minKm, maxKm) => {
    let upList = [], downList = [];
    if (gradeInfo.data && gradeInfo.data.length) {
        gradeInfo.data.forEach(d => {
            d.startKm = Number(d.startKm);
            d.endKm = Number(d.endKm);
            d.value = Number(d.value);
            d.R = Number(d.R);
            if (d.direction == 1) {
                upList.push(d);
            } else if (d.direction == 2) {
                downList.push(d);
            }
        });
    }

    if (upList.length > 1) {
        for (let i = 0; i < upList.length - 1; i++) {
            if (upList[i].endKm < upList[i + 1].startKm) {
                let item = {
                    id: -1,
                    startKm: upList[i].endKm,
                    endKm: upList[i + 1].startKm,
                    direction: 1,
                    value: 0,
                    R: 0
                };
                upList.splice(i + 1, 0, item);
            }
        }
    }
    if (upList.length == 0) {
        upList.push({
            id: -1,
            startKm: minKm,
            endKm: maxKm,
            direction: 1,
            value: 0,
            R: 0
        });
    } else {
        if (upList[upList.length - 1].endKm < maxKm) {
            upList.push({
                id: -1,
                startKm: upList[upList.length - 1].endKm,
                endKm: maxKm,
                direction: 1,
                value: 0,
                R: 0
            });
        }
        if (upList[0].startKm > minKm) {
            upList.push({
                id: -1,
                startKm: minKm,
                endKm: upList[0].startKm,
                direction: 1,
                value: 0,
                R: 0
            });
        }
    }

    if (downList.length > 1) {
        for (let i = 0; i < downList.length - 1; i++) {
            if (downList[i].endKm < downList[i + 1].startKm) {
                let item = {
                    id: -1,
                    startKm: downList[i].endKm,
                    endKm: downList[i + 1].startKm,
                    direction: 2,
                    value: 0,
                    R: 0
                };
                downList.splice(i + 1, 0, item);
            }
        }
    }

    if (downList.length == 0) {
        downList.push({
            id: -1,
            startKm: minKm,
            endKm: maxKm,
            direction: 2,
            value: 0,
            R: 0
        });
    } else {
        if (downList[downList.length - 1].endKm < maxKm) {
            downList.push({
                id: -1,
                startKm: downList[downList.length - 1].endKm,
                endKm: maxKm,
                direction: 2,
                value: 0,
                R: 0
            });
        }
        if (downList[0].startKm > minKm) {
            downList.push({
                id: -1,
                startKm: minKm,
                endKm: downList[0].startKm,
                direction: 2,
                value: 0,
                R: 0
            });
        }
    }


    upList.sort((a, b) => {
        return a.startKm - b.startKm;
    });
    downList.sort((a, b) => {
        return a.startKm - b.startKm;
    });

    return [upList, downList];
};

/**
 * 获取可以发送的Grade信息
 * @param {*} rawGrade 
 */
export const getRawGradeCanSend = (rawGrade) => {
    let sendData = [];

    if (rawGrade && rawGrade.length > 0) {
        rawGrade.forEach(list => {
            let innerData = [];
            list.forEach(raw => {
                let data = {
                    startCm: parseInt(Number(raw.startKm) * 100),
                    endCm: parseInt(Number(raw.endKm) * 100),
                    gradeValue: parseInt(Number(raw.value)),
                    R: parseInt(Number(raw.R) * 100)
                };
                innerData.push(data);
            });
            sendData.push(innerData);
        });
    }

    return sendData;
};

/**
 * 获取原始Limit信息
 * @param {*} limitInfo 
 */
export const checkLimitData = (limitInfo, minKm, maxKm) => {
    let upList = [], downList = [];
    if (limitInfo.data && limitInfo.data.length) {
        limitInfo.data.forEach(d => {
            let data = {
                innerId: Number(d.innerId),
                id: Number(d.id),
                startCm: Number(d.startCm),
                endCm: Number(d.endCm),
                direction: d.direction,
                R: Number(d.R),
                L: Number(d.L),
                V: Number(d.V),
                H: Number(d.H),
            };
            if (d.direction == 1) {
                upList.push(data);
            } else if (d.direction == 2) {
                downList.push(data);
            }
        });
    }

    if (upList.length > 1) {
        for (let i = 0; i < upList.length - 1; i++) {
            if (Number(upList[i].endCm) < Number(upList[i + 1].startCm)) {
                let item = {
                    id: -1,
                    startCm: Number(upList[i].endCm),
                    endCm: Number(upList[i + 1].startCm),
                    direction: 1,
                    R: 0,
                    L: 0,
                    V: 0,
                    H: 0
                };
                upList.splice(i + 1, 0, item);
            }
        }
    }
    if (upList.length == 0) {
        upList.push({
            id: -1,
            startCm: minKm,
            endCm: maxKm,
            direction: 1,
            R: 0,
            L: 0,
            V: 0,
            H: 0
        });
    } else {
        if (Number(upList[upList.length - 1].endCm) < maxKm) {
            upList.push({
                id: -1,
                startCm: upList[upList.length - 1].endCm,
                endCm: maxKm,
                direction: 1,
                R: 0,
                L: 0,
                V: 0,
                H: 0
            });
        }
        if (upList[0].startCm > minKm) {
            upList.push({
                id: -1,
                startCm: minKm,
                endCm: upList[0].startCm,
                direction: 1,
                R: 0,
                L: 0,
                V: 0,
                H: 0
            });
        }
    }

    if (downList.length > 1) {
        for (let i = 0; i < downList.length - 1; i++) {
            if (downList[i].endCm < downList[i + 1].startCm) {
                let item = {
                    id: -1,
                    startCm: Number(downList[i].endCm),
                    endCm: Number(downList[i + 1].startCm),
                    direction: 2,
                    R: 0,
                    L: 0,
                    V: 0,
                    H: 0
                };
                downList.splice(i + 1, 0, item);
            }
        }
    }

    if (downList.length == 0) {
        downList.push({
            id: -1,
            startCm: minKm,
            endCm: maxKm,
            direction: 2,
            R: 0,
            L: 0,
            V: 0,
            H: 0
        });
    } else {
        if (downList[downList.length - 1].endCm < (maxKm - 1)) {
            downList.push({
                id: -1,
                startCm: downList[downList.length - 1].endCm,
                endCm: maxKm,
                direction: 2,
                R: 0,
                L: 0,
                V: 0,
                H: 0
            });
        }
        if (downList[0].startCm > minKm) {
            downList.push({
                id: -1,
                startCm: minKm,
                endCm: downList[0].startCm,
                direction: 2,
                R: 0,
                L: 0,
                V: 0,
                H: 0
            });
        }
    }
    upList.sort((a, b) => {
        return a.startCm - b.startCm;
    });
    downList.sort((a, b) => {
        return a.startCm - b.startCm;
    });
    return [upList, downList];
};

/**
 * 获取原始用户自定义Limit信息
 * @param {*} limitInfo 
 */
export const getRawLimitByUser = (limits) => {
    let upList = [], downList = [];
    if (limits.data && limits.data.length) {
        limits.data.forEach(d => {
            let data = {
                startCm: parseInt(Number(d.startCm) * 100),
                endCm: parseInt(Number(d.endCm) * 100),
                V: parseInt(Number(d.V) * 100000 / 3600)  // 单位转换：km/h ---> cm/s
            };
            if (d.direction == 1) {
                upList.push(data);
            } else if (d.direction == 2) {
                downList.push(data);
            }
        });
    }
    return [upList, downList];
};


/**
 * 获取可以发送的进路信息
 * @param {*} routes 
 */
export const getRawEnterRouteSend = (routes) => {
    let routeData = _.cloneDeep(routes);
    let data = [];
    if (routeData && routeData.length) {
        routeData.forEach(d => {

            data.push(
                {
                    routeID: parseInt(d.routeID),
                    routeType: parseInt(d.routeType),
                    startSignalId: parseInt(d.startSignalId),
                    endSignalId: parseInt(d.endSignalId),
                    startProtectAxleId: [parseInt(d.startProtectAxleId1), parseInt(d.startProtectAxleId2), parseInt(d.startProtectAxleId3), parseInt(d.startProtectAxleId4), parseInt(d.startProtectAxleId5)],
                    endProtectAxleId: [parseInt(d.endProtectAxleId1), parseInt(d.endProtectAxleId2), parseInt(d.endProtectAxleId3), parseInt(d.endProtectAxleId5), parseInt(d.endProtectAxleId5)]
                }
            );
        });
    }
    console.log(data)
    return data;
};