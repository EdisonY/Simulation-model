import * as joint from "jointjs";
import _ from "lodash";
import TopoFactory from './topo/TopoFactory';

let TopoPaper = joint.dia.Paper.extend({
    pointerDown: null, // 鼠标落下时记录位置 【画图帮助】
    topoLinks: [], // 拓扑图上的Link
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
                    if (value > 1) {
                        value = 1;
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
                    view.unselect();
                    view.passiveDown();
                });

                paper.pointerDown =
                {
                    x: x,
                    y: y
                };
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
                    if (value > 1) {
                        value = 1;
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
        });
    },
    drawTopo(project, graph) {
        this.topoLinks = [];
        if (project && project.logicData && project.cells) {
            let map = this._getCellLocationMap(project.cells);

            if (project.logicData.links) {
                project.logicData.links.forEach(link => {
                    let start = map.find(m => {
                        return m.type == link.startCellType && m.id == link.startCellId;
                    });
                    let end = map.find(m => {
                        return m.type == link.endCellType && m.id == link.endCellId;
                    });

                    if (start && end) {
                        let line = TopoFactory.getInstance('tct.TopoLink');
                        line.attributes.tctData.tctId = link.id;
                        line.position(start.position.x, start.position.y);
                        line.attr('line/x2', end.position.x - start.position.x);
                        line.attr('line/y2', end.position.y - start.position.y);
                        line.addTo(graph);
                        this.topoLinks.push(line);
                    }
                });
            }

            project.cells.forEach(cell => {
                if (cell.type == 'tct.Bumper') {
                    let mapItem = map.find(m => {
                        return m.type == 1 && m.id == cell.tctData.tctId;
                    });

                    let line = TopoFactory.getInstance('tct.TopoBumper');
                    line.position(mapItem.position.x, mapItem.position.y);
                    line.attributes.angle = cell.angle;
                    line.addTo(graph);
                } else if (cell.type == 'tct.Signal') {
                    let mapItem = map.find(m => {
                        return m.type == 0 && m.id == cell.tctData.tctId;
                    });

                    let line = TopoFactory.getInstance('tct.TopoSignal');
                    line.position(mapItem.position.x, mapItem.position.y);
                    line.attributes.tctData.signalDirection = cell.tctData.signalDirection;
                    line.addTo(graph);
                } else if (cell.type == 'tct.Station') {
                    let mapItem = map.find(m => {
                        return m.type == 4 && m.id == cell.tctData.tctId;
                    });

                    let line = TopoFactory.getInstance('tct.TopoStation');
                    line.position(mapItem.position.x, mapItem.position.y - 30);
                    line.attributes.tctData.name = cell.tctData.name;
                    line.attributes.drawData.stationComponentId = cell.drawData.stationComponentId;
                    line.addTo(graph);
                }
            });
        }
        this.reset();
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
    setPath(linkNums) {
        if (!linkNums) {
            return;
        }
        this.topoLinks.forEach(link => {
            if (linkNums.indexOf(Number(link.attributes.tctData.tctId)) > -1) {
                link.attr('line/stroke', 'orange');
            } else {
                link.attr('line/stroke', '#30499f');
            }
        });
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

        this.scalePaper(0.5);
    },
    getRouteOptions(start, reverse, end, mode, components, models) {
        if (!mode) {
            mode = "单程";
        }

        let ability = {
            runMode: mode
        };

        ability.startAreaOptions = [];
        ability.reverseAreaOptions = [];
        let stopAreaMap = [];
        if (components) {
            let singalPathFilter = [];
            let reversePathFilter = [];

            // 车站排序
            let cells = this.model.getCells();
            cells = cells.filter(c => {
                return c.attributes.type == 'tct.TopoStation';
            });
            cells.sort((a, b) => {
                return a.attributes.position.x - b.attributes.position.x;
            });

            let names = [];
            cells.forEach(c => {
                if (c.attributes.drawData.stationComponentId && names.indexOf(c.attributes.drawData.stationComponentId) == -1) {
                    names.push(c.attributes.drawData.stationComponentId);
                }
            });

            names.forEach(stationId => {
                let c = components.find(item => {
                    return item.id == stationId;
                });
                if (c && c.logicData && c.logicData.stopAreas) {
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

            ability.reverseAreaOptions = ability.startAreaOptions.filter(item => {
                return reversePathFilter.indexOf(item.id) > -1;
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
            ability.startArea = "";
        }


        if (ability.reverseAreaOptions && ability.reverseAreaOptions.length > 0) {
            ability.reverseArea = reverse ? reverse : ability.reverseAreaOptions[0].id;
        } else {
            ability.reverseArea = "";
        }

        if (ability.endAreaOptions && ability.endAreaOptions.length > 0) {
            ability.endArea = end ? end : ability.endAreaOptions[0].id;
        } else {
            ability.endArea = "";
        }

        let info = getStopArea(ability.startArea, ability.reverseArea, ability.endArea, mode, components, stopAreaMap);
        ability.stopAreas = info.stopAreas;
        ability.direction = info.direction;
        return ability;
    }
});

// ----- private func -----

let getStopArea = (start, reverse, end, mode, components, stopAreaMap) => {
    let direction = 0;
    let stopAreas = [];

    if (!components) {
        return { direction, stopAreas };
    }

    let startC = components.find(c => {
        if (c.RouteInfo) {
            let findR = null;
            if (mode == '单程' || mode == '单折') {
                if (c.RouteInfo.upPass) {
                    findR = c.RouteInfo.upPass.find(p => {
                        return p.id == start;
                    });
                }
                if (!findR && c.RouteInfo.downPass) {
                    findR = c.RouteInfo.downPass.find(p => {
                        return p.id == start;
                    });
                }
            } else if (mode == '往返') {
                if (c.RouteInfo.upReverse) {
                    findR = c.RouteInfo.upReverse.find(p => {
                        return p.id == start;
                    });
                }
                if (!findR && c.RouteInfo.downReverse) {
                    findR = c.RouteInfo.downReverse.find(p => {
                        return p.id == start;
                    });
                }
            }
            return findR;
        }
        return false;
    });

    let reverseC = components.find(c => {
        if (c.RouteInfo) {
            let findR = null;
            if (c.RouteInfo.upReverse) {
                findR = c.RouteInfo.upReverse.find(p => {
                    return p.id == reverse;
                });
            }
            if (!findR && c.RouteInfo.downReverse) {
                findR = c.RouteInfo.downReverse.find(p => {
                    return p.id == reverse;
                });
            }
            return findR;
        }
        return false;
    });

    let endC = components.find(c => {
        if (c.RouteInfo) {
            let findR = null;
            if (mode == '单程' || mode == '单折') {
                if (c.RouteInfo.upPass) {
                    findR = c.RouteInfo.upPass.find(p => {
                        return p.id == end;
                    });
                }

                if (!findR && c.RouteInfo.downPass) {
                    findR = c.RouteInfo.downPass.find(p => {
                        return p.id == end;
                    });
                }
            } else if (mode == '往返') {
                if (c.RouteInfo.upReverse) {
                    findR = c.RouteInfo.upReverse.find(p => {
                        return p.id == end;
                    });
                }
                if (!findR && c.RouteInfo.downReverse) {
                    findR = c.RouteInfo.downReverse.find(p => {
                        return p.id == end;
                    });
                }
            }
            return findR;
        }
        return false;
    });

    let indexStart = components.indexOf(startC);
    let indexReverse = components.indexOf(reverseC);
    let indexEnd = components.indexOf(endC);

    if (mode == '单折') {
        if (indexStart == -1 || indexReverse == -1 || indexEnd == -1) {
            return { direction, stopAreas };
        }
        if (indexStart == indexReverse || indexEnd == indexReverse) {
            return { direction, stopAreas };
        }
    } else {
        if (indexStart == -1 || indexEnd == -1) {
            return { direction, stopAreas };
        }
        if (indexStart == indexEnd) {
            return { direction, stopAreas };
        }
    }

    direction = indexStart < indexEnd ? 1 : 2;
    if (mode == '单折') {
        direction = indexStart < indexReverse ? 1 : 2;
    }

    if (mode == '单程') {
        if (direction == 1) {
            for (let i = indexStart; i <= indexEnd; i++) {
                let sid = components[i].RouteInfo.upPass[0].id;
                if (i == indexStart) {
                    sid = start;
                }
                if (i == indexEnd) {
                    sid = end;
                }

                let findA = stopAreaMap.find(sm => {
                    return sm.id == sid;
                });
                if (findA) {
                    let a = {
                        selectedArea: findA.name,
                        id: findA.id,
                        stopTime: 30,
                        areas: [{
                            id: findA.id,
                            name: findA.name
                        }]
                    };
                    stopAreas.push(a);
                }
            }
        } else {
            for (let i = indexStart; i >= indexEnd; i--) {
                let sid = components[i].RouteInfo.downPass[0].id;
                if (i == indexStart) {
                    sid = start;
                }
                if (i == indexEnd) {
                    sid = end;
                }
                let findA = stopAreaMap.find(sm => {
                    return sm.id == sid;
                });
                if (findA) {
                    let a = {
                        selectedArea: findA.name,
                        id: findA.id,
                        stopTime: 30,
                        areas: [{
                            id: findA.id,
                            name: findA.name
                        }]
                    };
                    stopAreas.push(a);
                }
            }
        }
    } else if (mode == '往返') {
        if (direction == 1) {
            let findStartPath = startC.RouteInfo.downReverse.find(dr => {
                return dr.id == start;
            });
            let findEndPath = endC.RouteInfo.upReverse.find(ur => {
                return ur.id == end;
            });

            if (findStartPath && findStartPath.data && findEndPath && findEndPath.data) {
                findStartPath.data.forEach(id => {
                    let findA = stopAreaMap.find(sm => {
                        return sm.id == id;
                    });
                    if (findA) {
                        let a = {
                            selectedArea: findA.name,
                            id: findA.id,
                            stopTime: 30,
                            areas: [{
                                id: findA.id,
                                name: findA.name
                            }]
                        };
                        stopAreas.push(a);
                    }
                });

                for (let i = indexStart + 1; i < indexEnd; i++) {
                    let sid = components[i].RouteInfo.upPass[0].id;
                    let findA = stopAreaMap.find(sm => {
                        return sm.id == sid;
                    });
                    if (findA) {
                        let a = {
                            selectedArea: findA.name,
                            id: findA.id,
                            stopTime: 30,
                            areas: [{
                                id: findA.id,
                                name: findA.name
                            }]
                        };
                        stopAreas.push(a);
                    }
                }

                findEndPath.data.forEach(id => {
                    let findA = stopAreaMap.find(sm => {
                        return sm.id == id;
                    });
                    if (findA) {
                        let a = {
                            selectedArea: findA.name,
                            id: findA.id,
                            stopTime: 30,
                            areas: [{
                                id: findA.id,
                                name: findA.name
                            }]
                        };
                        stopAreas.push(a);
                    }
                });

                for (let i = indexEnd - 1; i > indexStart; i--) {
                    let sid = components[i].RouteInfo.downPass[0].id;
                    let findA = stopAreaMap.find(sm => {
                        return sm.id == sid;
                    });
                    if (findA) {
                        let a = {
                            selectedArea: findA.name,
                            id: findA.id,
                            stopTime: 30,
                            areas: [{
                                id: findA.id,
                                name: findA.name
                            }]
                        };
                        stopAreas.push(a);
                    }
                }
            }
        } else {
            let findStartPath = startC.RouteInfo.upReverse.find(dr => {
                return dr.id == start;
            });
            let findEndPath = endC.RouteInfo.downReverse.find(ur => {
                return ur.id == end;
            });

            if (findStartPath && findStartPath.data && findEndPath && findEndPath.data) {
                findStartPath.data.forEach(id => {
                    let findA = stopAreaMap.find(sm => {
                        return sm.id == id;
                    });
                    if (findA) {
                        let a = {
                            selectedArea: findA.name,
                            id: findA.id,
                            stopTime: 30,
                            areas: [{
                                id: findA.id,
                                name: findA.name
                            }]
                        };
                        stopAreas.push(a);
                    }
                });

                for (let i = indexStart - 1; i > indexEnd; i--) {
                    let sid = components[i].RouteInfo.downPass[0].id;
                    let findA = stopAreaMap.find(sm => {
                        return sm.id == sid;
                    });
                    if (findA) {
                        let a = {
                            selectedArea: findA.name,
                            id: findA.id,
                            stopTime: 30,
                            areas: [{
                                id: findA.id,
                                name: findA.name
                            }]
                        };
                        stopAreas.push(a);
                    }
                }

                findEndPath.data.forEach(id => {
                    let findA = stopAreaMap.find(sm => {
                        return sm.id == id;
                    });
                    if (findA) {
                        let a = {
                            selectedArea: findA.name,
                            id: findA.id,
                            stopTime: 30,
                            areas: [{
                                id: findA.id,
                                name: findA.name
                            }]
                        };
                        stopAreas.push(a);
                    }
                });

                for (let i = indexEnd + 1; i < indexStart; i++) {
                    let sid = components[i].RouteInfo.upPass[0].id;
                    let findA = stopAreaMap.find(sm => {
                        return sm.id == sid;
                    });
                    if (findA) {
                        let a = {
                            selectedArea: findA.name,
                            id: findA.id,
                            stopTime: 30,
                            areas: [{
                                id: findA.id,
                                name: findA.name
                            }]
                        };
                        stopAreas.push(a);
                    }
                }
            }
        }

        if (stopAreas.length > 0) {
            let index = 10;
            while (stopAreas[0].id != start && index > 0) {
                console.log(_.cloneDeep(stopAreas))
                let begin = stopAreas[0];
                stopAreas.splice(0, 1);
                stopAreas.push(begin);
                index--;
            }
            stopAreas.push(_.cloneDeep(stopAreas[0]));
        }
    } else if (mode == '单折') {
        console.log('---run');
        console.log(indexStart, indexReverse, indexEnd);
        console.log(start, reverse, end);
        if (direction == 1) {
            let findReversePath = reverseC.RouteInfo.upReverse.find(ur => {
                return ur.id == reverse;
            });
            console.log(findReversePath);

            if (findReversePath && findReversePath.data) {
                for (let i = indexStart; i < indexReverse; i++) {
                    let sid = components[i].RouteInfo.upPass[0].id;
                    let findA = stopAreaMap.find(sm => {
                        return sm.id == sid;
                    });
                    if (findA) {
                        let a = {
                            selectedArea: findA.name,
                            id: findA.id,
                            stopTime: 30,
                            areas: [{
                                id: findA.id,
                                name: findA.name
                            }]
                        };
                        stopAreas.push(a);
                    }
                }

                findReversePath.data.forEach(id => {
                    let findA = stopAreaMap.find(sm => {
                        return sm.id == id;
                    });
                    if (findA) {
                        let a = {
                            selectedArea: findA.name,
                            id: findA.id,
                            stopTime: 30,
                            areas: [{
                                id: findA.id,
                                name: findA.name
                            }]
                        };
                        stopAreas.push(a);
                    }
                });

                for (let i = indexReverse - 1; i >= indexEnd; i--) {
                    let sid = components[i].RouteInfo.downPass[0].id;
                    let findA = stopAreaMap.find(sm => {
                        return sm.id == sid;
                    });
                    if (findA) {
                        let a = {
                            selectedArea: findA.name,
                            id: findA.id,
                            stopTime: 30,
                            areas: [{
                                id: findA.id,
                                name: findA.name
                            }]
                        };
                        stopAreas.push(a);
                    }
                }
            }
        } else {
            let findReversePath = reverseC.RouteInfo.downReverse.find(ur => {
                return ur.id == reverse;
            });

            if (findReversePath && findReversePath.data) {
                for (let i = indexStart; i > indexReverse; i--) {
                    let sid = components[i].RouteInfo.downPass[0].id;
                    let findA = stopAreaMap.find(sm => {
                        return sm.id == sid;
                    });
                    if (findA) {
                        let a = {
                            selectedArea: findA.name,
                            id: findA.id,
                            stopTime: 30,
                            areas: [{
                                id: findA.id,
                                name: findA.name
                            }]
                        };
                        stopAreas.push(a);
                    }
                }

                findReversePath.data.forEach(id => {
                    let findA = stopAreaMap.find(sm => {
                        return sm.id == id;
                    });
                    if (findA) {
                        let a = {
                            selectedArea: findA.name,
                            id: findA.id,
                            stopTime: 30,
                            areas: [{
                                id: findA.id,
                                name: findA.name
                            }]
                        };
                        stopAreas.push(a);
                    }
                });

                for (let i = indexReverse + 1; i <= indexEnd; i++) {
                    let sid = components[i].RouteInfo.upPass[0].id;
                    let findA = stopAreaMap.find(sm => {
                        return sm.id == sid;
                    });
                    if (findA) {
                        let a = {
                            selectedArea: findA.name,
                            id: findA.id,
                            stopTime: 30,
                            areas: [{
                                id: findA.id,
                                name: findA.name
                            }]
                        };
                        stopAreas.push(a);
                    }
                }
            }
        }
    }
    return { direction, stopAreas };
};

export default TopoPaper;