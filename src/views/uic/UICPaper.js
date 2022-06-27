import * as joint from "jointjs";
import _ from "lodash";
import UICRect from './UICRect';
import UICLabel from './UICLabel';
import UICPolyline from './UICPolyline';


let UICPaper = joint.dia.Paper.extend({
    pointerDown: null, // 鼠标落下时记录位置 【画图帮助】
    // color: ['#d48265', '#749f83', '#ca8622', '#c23531', '#2f4554', '#61a0a8', '#c4ccd3', '#bda29a', '#6e7074', '#91c7ae', '#546570'],
    color: ['#2AD6B5', '#F4ACDE', '#ca8622', '#749f83', '#c23531', '#2f4554', '#61a0a8', '#c4ccd3', '#bda29a', '#6e7074', '#91c7ae', '#546570'],
    /**
     * 根据id获取view
     */
    getViewById(id) {
        let model = this.model.getCell(id);
        return this.findViewByModel(model);
    },
    /**
     * 缩放画布
     * @param {number} size 缩放尺寸
     */
    scalePaper(size) {
        // 计算缩放比例，缩放画布
        let originSize = size;
        originSize = originSize < 0.1 ? 0.1 : originSize;
        originSize = originSize > 3 ? 3 : originSize;
        originSize = Math.round(originSize * 10) / 10;
        this.scale(originSize);
    },
    /**
     * 移动画布
     * @param {number} x x坐标
     * @param {number} y y坐标
     * @param {boolean} isAbsolute 是否绝对坐标 
     */
    translatePaper(x, y, isAbsolute) {
        if (isAbsolute) {
            this.setOrigin(x, y);
        } else {
            let t = this.translate();
            this.setOrigin(
                t.tx + x,
                t.ty + y
            );
        }
    },/**
    * 初始化事件
    */
    initPaperEvent() {
        let paper = this;
        this.on({
            "cell:mousewheel": (cellView, evt, x, y, delta) => {
                // Ctrl键缩放
                if (evt.ctrlKey) {
                    let flag = evt.originalEvent.wheelDeltaY <= -120 ? -1 : 1;
                    let value = paper.scale().sx + 0.1 * flag;
                    if (value < 0.1) {
                        value = 0.1;
                    }
                    if (value > 2) {
                        value = 2;
                    }
                    paper.scalePaper(value);
                } else {  // 非Ctrl滚动
                    let translate = paper.translate();
                    paper.setOrigin(
                        translate.tx,
                        translate.ty + 30 * delta
                    );
                }
            },
            "blank:pointerdown": (evt, x, y) => {
                // 取消高亮
                paper.model.getCells().forEach((item) => {
                    let view = paper.findViewByModel(item);
                    // view.unselect();
                    view.passiveDown();
                });
                paper.pointerDown = { x, y };
            },
            "blank:pointermove": (evt, x, y) => {
                // 鼠标左键
                if (evt.buttons == 1) {
                    let models = paper.model.getCells();
                    models.forEach(model => {
                        let offsetX = x - paper.pointerDown.x;
                        let offsetY = y - paper.pointerDown.y;
                        let view = paper.getViewById(model.attributes.id);
                        view.passiveMove(offsetX, offsetY);
                    });
                    if (!this.toolTip) {
                        return;
                    }
                    this.toolTip({}, evt, false);
                }
            },
            "blank:pointerup": (evt, x, y) => {

            },
            "blank:mousewheel": (evt, x, y, delta) => {
                // Ctrl键缩放
                if (evt.ctrlKey) {
                    let flag = evt.originalEvent.wheelDeltaY <= -120 ? -1 : 1;
                    let value = paper.scale().sx + 0.1 * flag;
                    if (value < 0.1) {
                        value = 0.1;
                    }
                    if (value > 2) {
                        value = 2;
                    }
                    paper.scalePaper(value);
                } else {  // 非Ctrl滚动
                    let translate = paper.translate();
                    paper.setOrigin(
                        translate.tx,
                        translate.ty + 30 * delta
                    );
                }
            },
            "cell:mouseover": (cellView, evt) => {
                if (!this.toolTip) {
                    return;
                }
                console.log(evt);
                if (cellView.model.attributes.detail && cellView.model.attributes.detail.type == '列车') {
                    let position = cellView.model.attributes.position;
                    position = paper.localToClientPoint(position);
                    this.toolTip(cellView.model.attributes.detail, evt, true);
                }
            },
            "blank:mouseover": (cellView, evt) => {
            },
        });
    },
    drawUIC1(data, graph, xRate = 100, yRate = 100) {// 一个分区宽度30像素，一个时间片段高度10像素，一个时间片段30s
        this.model.clear();
        let startTime = -1; // 初始最小开始时间，矫正起始位置从0开始
        let stationNameList = [];
        let stationXList = [];

        let pointList = [];
        let lastPositionX = Number.MIN_VALUE; // 画折线时判断方向用
        let lineDir = 0; // 画折线时判断方向用 >0 上行 <0 下行
        if (data.vecArea.length > 1) {
            lineDir = data.vecArea[1].positionCm - data.vecArea[0].positionCm;
        }
        if (data && data.vecArea) {
            let minTimeAxisData = null, maxTimeAxisData = null; // 画时间轴
            let maxLength = 0; // 画时间轴
            let stationAxis = [];

            let names = data.vecSubAreaTimeName;
            data.vecArea.forEach(d => {
                if (stationNameList.indexOf(d.stationName) == -1 && d.stationName) {
                    let model = new UICRect();
                    let cfg = {
                        type: '车站',
                        name: d.stationName,
                        width: 100,
                        height: 30,
                        x: d.positionCm * xRate,
                        y: 10
                    };
                    stationXList.push(d.positionCm * xRate);
                    model.configData(cfg);
                    model.addTo(graph);
                    stationNameList.push(d.stationName);
                    stationAxis.push(d.positionCm * xRate);
                }
                if (lastPositionX != Number.MIN_VALUE) {
                    lineDir = d.positionCm - lastPositionX;
                }
                d.vecTrain.forEach(t => {
                    if (startTime == -1) {
                        startTime = t.subAreaStartTime;
                    }
                    let timeNames = ['车站', '分区', '车站能力'].concat(names);
                    let abilityData = 0;
                    try {
                        // abilityData = parseInt(d.stationAbility * 1000000);
                        abilityData = parseInt(d.stationAbility * 100000) / 100;
                    } catch { }
                    let timeValues = [d.stationName, d.InterID, abilityData].concat(t.vecSubAreaTimeValue);
                    // -- 折线数据 --
                    let pList = pointList.find(p => {
                        return p.trainId == t.trainId;
                    });
                    if (!pList) {
                        pList = {
                            trainId: t.trainId,
                            points: []
                        }
                        pointList.push(pList);
                    }

                    // let smallTime = timeValues[2] + timeValues[3] + timeValues[4];
                    // let x1 = d.positionCm * xRate;
                    // let y1 = (smallTime + t.subAreaStartTime - startTime) / 1000.0 * yRate + 50;

                    // let x2 = (d.positionCm + d.lenCm) * xRate;
                    // let y2 = (smallTime + timeValues[5] + t.subAreaStartTime - startTime) / 1000.0 * yRate + 50;
                    // if (lineDir > 0) {
                    //     pList.points.push({ x: x1, y: y1 });
                    //     pList.points.push({ x: x2, y: y2 });
                    // } else if (lineDir < 0) {
                    //     pList.points.push({ x: x2, y: y1 });
                    //     pList.points.push({ x: x1, y: y2 });
                    // }
                    // -- end --
                    let train = new UICRect();
                    let trainLocationY = (t.subAreaStartTime - startTime) / 1000.0 * yRate + 50;
                    let cfg = {
                        type: '列车',
                        name: '',
                        width: d.lenCm * xRate,
                        height: (t.subAreaEndTime - t.subAreaStartTime) / 1000.0 * yRate, // 根据占用时间计算出列车高度
                        x: d.positionCm * xRate,
                        y: trainLocationY,// 根据起始时间计算出列车起始y坐标
                        color: this.color[t.trainId - 1] + '55',
                        isChokePoint: d.isChokePoint,
                        TimeValues: timeValues,
                        TimeNames: timeNames
                    };

                    // 计算时间轴数据
                    minTimeAxisData = minTimeAxisData && minTimeAxisData.y < trainLocationY ? minTimeAxisData : { y: trainLocationY, t: t.subAreaEndTime };
                    maxTimeAxisData = maxTimeAxisData && maxTimeAxisData.y > trainLocationY ? maxTimeAxisData : { y: trainLocationY, t: t.subAreaEndTime };
                    let xLength = d.positionCm * xRate + d.lenCm * xRate;
                    maxLength = maxLength < xLength ? xLength : maxLength;
                    // --- end

                    train.configData(cfg);
                    train.addTo(graph);
                });
                lineDir = d.positionCm - lastPositionX;
                lastPositionX = d.positionCm;
            });

            if (data.vecTrainHead) {
                for (let i = 0; i < data.vecTrainHead.length; i++) {
                    if (pointList[i]) {
                        data.vecTrainHead[i].forEach(d => {
                            let x1 = d.positionCm * xRate;
                            let y1 = (d.timeMs - startTime) / 1000.0 * yRate + 50;
                            pointList[i].points.push({ x: x1, y: y1 });
                        });

                    }
                }
            }

            // 画折线
            let colorIndex = 0;
            if (pointList.length > 0) {
                pointList.forEach(lineData => {
                    let polyLine = new UICPolyline();
                    polyLine.configData(lineData.points, this.color[colorIndex]);
                    polyLine.addTo(graph);
                    colorIndex++;
                });
            }

            // // 画时间轴 和 车站纵轴
            if (minTimeAxisData && maxTimeAxisData && minTimeAxisData.y != maxTimeAxisData.y) {
                let tick = parseInt((maxTimeAxisData.y - minTimeAxisData.y) / 10);
                for (let i = 0; i < 12; i++) {
                    let xAxis = new UICLabel();
                    xAxis.configTimeData(minTimeAxisData.y + i * tick, i * tick / (maxTimeAxisData.y - minTimeAxisData.y) * (maxTimeAxisData.t - minTimeAxisData.t) * 1.0, maxLength);
                    xAxis.addTo(graph);
                    if (i == 0 || i == 11) {
                        xAxis.attr('bline/stroke-dasharray', '');
                    }
                }

                if (stationAxis.length > 0) {
                    stationAxis.forEach(axisx => {
                        let yAxis = new UICLabel();
                        yAxis.configStationData(axisx, minTimeAxisData.y, minTimeAxisData.y + 11 * tick);
                        yAxis.addTo(graph);
                    });

                    let startYAxis = new UICLabel();
                    startYAxis.configStationData(maxLength + 100, minTimeAxisData.y, minTimeAxisData.y + 11 * tick);
                    startYAxis.addTo(graph);
                    startYAxis.attr('bline/stroke-dasharray', '');

                    let endYAxis = new UICLabel();
                    endYAxis.configStationData(-40, minTimeAxisData.y, minTimeAxisData.y + 11 * tick);
                    endYAxis.addTo(graph);
                    endYAxis.attr('bline/stroke-dasharray', '');
                }
            }

            this.reset();
        }
        return;
    },

    drawUIC2(data, graph, xRate = 100, yRate = 100) {// 一个分区宽度30像素，一个时间片段高度10像素，一个时间片段30s
        this.model.clear();
        let startTime = -1; // 初始最小开始时间，矫正起始位置从0开始
        let stationNameList = [];
        let stationXList = [];

        let pointList = [];

        if (data && data.vecTrain) {
            let minTimeAxisData = null, maxTimeAxisData = null; // 画时间轴
            let maxLength = 0; // 画时间轴
            let stationAxis = [];

            let names = data.vecSubAreaTimeName;

            data.vecTrain.forEach(t => {
                t.vecArea.forEach(d => {
                    if (stationNameList.indexOf(d.stationName) == -1 && d.stationName) {
                        let model = new UICRect();
                        let cfg = {
                            type: '车站',
                            name: d.stationName,
                            width: 100,
                            height: 30,
                            x: d.positionCm * xRate,
                            y: 10
                        };
                        stationXList.push(d.positionCm * xRate);
                        model.configData(cfg);
                        model.addTo(graph);
                        stationNameList.push(d.stationName);
                        stationAxis.push(d.positionCm * xRate);
                    }

                    if (startTime == -1) {
                        startTime = d.subAreaStartTime;
                    }
                    let timeNames = ['车站', '分区'].concat(names);
                    let timeValues = [d.stationName, d.InterID].concat(d.vecSubAreaTimeValue);


                    let train = new UICRect();
                    let trainLocationY = (d.subAreaStartTime - startTime) / 1000.0 * yRate + 50;
                    let cfg = {
                        type: '列车',
                        name: '',
                        width: d.lenCm * xRate,
                        height: (d.subAreaEndTime - d.subAreaStartTime) / 1000.0 * yRate, // 根据占用时间计算出列车高度
                        x: d.positionCm * xRate,
                        y: trainLocationY,// 根据起始时间计算出列车起始y坐标
                        color: this.color[t.trainId - 1] + '55',
                        TimeValues: timeValues,
                        TimeNames: timeNames
                    };

                    // 计算时间轴数据
                    minTimeAxisData = minTimeAxisData && minTimeAxisData.y < trainLocationY ? minTimeAxisData : { y: trainLocationY, t: d.subAreaEndTime };
                    maxTimeAxisData = maxTimeAxisData && maxTimeAxisData.y > trainLocationY ? maxTimeAxisData : { y: trainLocationY, t: d.subAreaEndTime };
                    let xLength = d.positionCm * xRate + d.lenCm * xRate;
                    maxLength = maxLength < xLength ? xLength : maxLength;
                    // --- end

                    train.configData(cfg);
                    train.addTo(graph);
                });


                // -- 折线数据 --
                let pList = pointList.find(p => {
                    return p.trainId == t.trainId;
                });
                if (!pList) {
                    pList = {
                        trainId: t.trainId,
                        points: []
                    }
                    pointList.push(pList);
                }

                if (t.vecHead) {
                    t.vecHead.forEach(item => {
                        let x1 = item.positionCm * xRate;
                        let y1 = (item.timeMs - startTime) / 1000.0 * yRate + 50;

                        pList.points.push({ x: x1, y: y1 });
                    });
                }
            });


            // 画折线
            let colorIndex = 0;
            if (pointList.length > 0) {
                pointList.forEach(lineData => {
                    let polyLine = new UICPolyline();
                    polyLine.configData(lineData.points, this.color[colorIndex]);
                    polyLine.addTo(graph);
                    colorIndex++;
                });
            }

            // // 画时间轴
            if (minTimeAxisData && maxTimeAxisData && minTimeAxisData.y != maxTimeAxisData.y) {
                let tick = parseInt((maxTimeAxisData.y - minTimeAxisData.y) / 10);
                for (let i = 0; i < 12; i++) {
                    let xAxis = new UICLabel();
                    xAxis.configTimeData(minTimeAxisData.y + i * tick, i * tick / (maxTimeAxisData.y - minTimeAxisData.y) * (maxTimeAxisData.t - minTimeAxisData.t) * 1.0, maxLength);
                    xAxis.addTo(graph);
                    if (i == 0 || i == 11) {
                        xAxis.attr('bline/stroke-dasharray', '');
                    }
                }

                if (stationAxis.length > 0) {
                    stationAxis.forEach(axisx => {
                        let yAxis = new UICLabel();
                        yAxis.configStationData(axisx, minTimeAxisData.y, minTimeAxisData.y + 11 * tick);
                        yAxis.addTo(graph);
                    });

                    let startYAxis = new UICLabel();
                    startYAxis.configStationData(maxLength + 100, minTimeAxisData.y, minTimeAxisData.y + 11 * tick);
                    startYAxis.addTo(graph);
                    startYAxis.attr('bline/stroke-dasharray', '');

                    let endYAxis = new UICLabel();
                    endYAxis.configStationData(-40, minTimeAxisData.y, minTimeAxisData.y + 11 * tick);
                    endYAxis.addTo(graph);
                    endYAxis.attr('bline/stroke-dasharray', '');
                }
            }

            this.reset();
        }
        return;
    },
    /**
     * Obsolete
     * @param {*} data 
     * @param {*} graph 
     * @param {*} timeSegmentHeight 
     * @param {*} timeSegment 
     * @param {*} minWidth 
     * @param {*} maxWidth 
     * @returns 
     */
    drawUIC_v2_bak(data, graph, timeSegmentHeight = 50, timeSegment = 10, minWidth = 1, maxWidth = 10) {// 一个分区宽度30像素，一个时间片段高度10像素，一个时间片段30s
        this.model.clear();
        let stationLength = 0;
        let startTime = -1; // 初始最小开始时间，矫正起始位置从0开始
        if (data && data.length > 0) {
            data.forEach(d => {
                // 添加车站
                let model = new UICRect();

                let distanceX = 0;
                d.abilityUp.vecArea.forEach(vA => {
                    let curWidth = vA.InnerID == 0 ? minWidth : maxWidth;
                    // 添加分区
                    let area = new UICLabel();
                    let cfg = {
                        InnerID: vA.InnerID,
                        width: curWidth,
                        height: 30,
                        x: stationLength + distanceX,
                        y: 60
                    };
                    area.configData(cfg);
                    area.addTo(graph);

                    // 添加车
                    vA.vecTrain.forEach(train => {
                        // TODO 
                        if (startTime < 0) {
                            startTime = train.subAreaStartTime;
                        }
                        // 添加分区
                        let t = new UICRect();
                        let cfg = {
                            type: '列车',
                            name: '',
                            width: curWidth,
                            height: (train.subAreaEndTime - train.subAreaStartTime) / (timeSegment * 1000) * timeSegmentHeight, // 根据占用时间计算出列车高度
                            x: stationLength + distanceX,
                            y: (train.subAreaStartTime) / (timeSegment * 1000) * timeSegmentHeight + 90 - startTime / (timeSegment * 1000) * timeSegmentHeight,// 根据起始时间计算出列车起始y坐标
                            color: this.color[train.trainId],
                            TimeValues: train.vecSubAreaTimeValue,
                            TimeNames: d.vecSubAreaTimeName
                        };
                        t.configData(cfg);
                        t.addTo(graph);
                    });
                    distanceX += curWidth;
                });

                d.abilityDown.vecArea.forEach(vA => {
                    let curWidth = vA.InnerID == 0 ? minWidth : maxWidth;
                    // 添加分区
                    let area = new UICLabel();
                    let cfg = {
                        InnerID: vA.InnerID,
                        width: curWidth,
                        height: 30,
                        x: stationLength + distanceX,
                        y: 60
                    };
                    area.configData(cfg);
                    area.addTo(graph);

                    // 添加车
                    vA.vecTrain.forEach(train => {
                        // TODO 
                        if (startTime < 0) {
                            startTime = train.subAreaStartTime;
                        }
                        // 添加分区
                        let t = new UICRect();
                        let cfg = {
                            type: '列车',
                            name: '',
                            width: curWidth,
                            height: (train.subAreaEndTime - train.subAreaStartTime) / (timeSegment * 1000) * timeSegmentHeight, // 根据占用时间计算出列车高度
                            x: stationLength + distanceX,
                            y: (train.subAreaStartTime) / (timeSegment * 1000) * timeSegmentHeight + 90 - startTime / (timeSegment * 1000) * timeSegmentHeight,// 根据起始时间计算出列车起始y坐标
                            color: this.color[train.trainId],
                            TimeValues: train.vecSubAreaTimeValue,
                            TimeNames: d.vecSubAreaTimeName
                        };
                        t.configData(cfg);
                        t.addTo(graph);
                    });
                    distanceX += curWidth;
                });

                stationLength += distanceX;

                let cfg = {
                    type: '车站',
                    name: d.stationName,
                    width: 100,
                    height: 50,
                    x: stationLength - 100,
                    y: 10
                };
                model.configData(cfg);
                model.addTo(graph);
            });
        }
        return;
    },
    _getCellLocationMap(cells) {
        let map = [];

        if (cells && cells.length > 0) {
            cells.forEach(cell => {
                if (cell.type == 'tct.Bumper') {
                    map.push({
                        type: 1,
                        id: cell.tctData.tctId,
                        position: cell.position
                    });
                } else if (cell.type == "tct.Point") {
                    if (cell.angle == 0) {
                        map.push({
                            type: 3,
                            id: cell.tctData.tctId,
                            position: {
                                x: cell.position.x + 30,
                                y: cell.position.y + 30
                            }
                        });
                    } else {
                        map.push({
                            type: 3,
                            id: cell.tctData.tctId,
                            position: {
                                x: cell.position.x - 30,
                                y: cell.position.y - 30
                            }
                        });
                    }
                } else if (cell.type == "tct.Signal") {
                    map.push({
                        type: 0,
                        id: cell.tctData.tctId,
                        position: cell.position
                    });
                } else if (cell.type == "tct.Axle") {
                    map.push({
                        type: 2,
                        id: cell.tctData.tctId,
                        position: {
                            x: cell.position.x,
                            y: cell.position.y + 30
                        }
                    });
                } else if (cell.type == "tct.Station") {
                    map.push({
                        type: 4,
                        id: cell.tctData.tctId,
                        position: {
                            x: cell.position.x,
                            y: cell.position.y + 30
                        }
                    });
                }
            });
        }

        return map;

    },
    reset() {
        let minx = Number.MAX_VALUE, miny = Number.MAX_VALUE;

        let models = this.model.getCells();
        if (models) {
            models.forEach(model => {
                minx = model.attributes.position.x < minx ? model.attributes.position.x : minx;
                miny = model.attributes.position.y < miny ? model.attributes.position.y : miny;
            });

            models.forEach(model => {
                let view = this.getViewById(model.attributes.id);
                view.passiveDown();
                view.passiveMove(-minx + 50, -miny + 120);
            });
        }

        this.scalePaper(1);
        this.translatePaper(0, 0, true);
    },
    getRouteOptions(start, end, mode, components, models) {
        console.log(models)

        if (!mode) {
            mode = "单程";
        }

        let ability = {
            runMode: mode
        };

        ability.startAreaOptions = [];

        let stopAreaMap = [];

        if (components) {
            let singalPathFilter = [];
            let reversePathFilter = [];
            components.forEach(c => {
                if (c.logicData && c.logicData.stopAreas) {
                    c.logicData.stopAreas.forEach(s => {
                        let areaName = s.stationName + s.id;
                        if (models) {
                            let findM = models.find(m => {
                                return m.type == 'tct.StopArea' && Number(m.tctData.tctId) == s.id;
                            });
                            if (findM) {
                                areaName = findM.tctData.areaName;
                            }
                        }

                        let item = {
                            id: s.id,
                            name: areaName
                        };
                        stopAreaMap.push(item);
                        ability.startAreaOptions.push(item);
                    });

                    if (c.RouteInfo) {
                        if (c.RouteInfo.upPass) {
                            c.RouteInfo.upPass.forEach(item => {
                                singalPathFilter.push(item.id);
                            });
                        }
                        if (c.RouteInfo.downPass) {
                            c.RouteInfo.downPass.forEach(item => {
                                singalPathFilter.push(item.id);
                            });
                        }
                        if (c.RouteInfo.upReverse) {
                            c.RouteInfo.upReverse.forEach(item => {
                                reversePathFilter.push(item.id);
                            });
                        }
                        if (c.RouteInfo.downReverse) {
                            c.RouteInfo.downReverse.forEach(item => {
                                reversePathFilter.push(item.id);
                            });
                        }
                    }
                }
            });
            if (mode == "单程") {
                ability.startAreaOptions = ability.startAreaOptions.filter(item => {
                    return singalPathFilter.indexOf(item.id) > -1;
                });
            } else if (mode == "往返") {
                ability.startAreaOptions = ability.startAreaOptions.filter(item => {
                    return reversePathFilter.indexOf(item.id) > -1;
                });
            }
        }
        ability.endAreaOptions = _.cloneDeep(ability.startAreaOptions);

        // ---- up -- 

        if (ability.startAreaOptions && ability.startAreaOptions.length > 0) {
            ability.startArea = start ? start : ability.startAreaOptions[0].id;
        } else {
            ability.startArea = 0;
        }

        if (ability.endAreaOptions && ability.endAreaOptions.length > 0) {
            ability.endArea = end ? end : ability.endAreaOptions[0].id;
        } else {
            ability.endArea = 0;
        }

        let info = getStopArea(ability.startArea, ability.endArea, mode, components, stopAreaMap);
        ability.stopAreas = info.stopAreas;
        ability.direction = info.direction;
        return ability;
    }
});

export default UICPaper;