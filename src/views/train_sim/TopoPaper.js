import * as joint from "jointjs";
import _ from "lodash";
import TopoFactory from './topo/TopoFactory';

let TopoPaper = joint.dia.Paper.extend({
    pointerDown: null, // 鼠标落下时记录位置 【画图帮助】
    topoLinks: [], // 拓扑图上的Link
    trainList: [],
    fsLinkMap: null,
    toolTip: null,
    setTmpLimit: false,
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
            "cell:pointerdown": (cellView, evt, x, y) => {
                if (paper.setTmpLimit) {
                    if (cellView.toggle) {
                        cellView.toggle();
                    }
                } else {
                    // 取消高亮
                    paper.model.getCells().forEach((item) => {
                        let view = paper.findViewByModel(item);
                        view.unselect();
                        view.passiveDown();
                    });

                    cellView.select();
                }
            },

            "cell:mouseover": (cellView, evt) => {
                if (!this.toolTip) {
                    return;
                }
                let position = cellView.model.attributes.position;
                position = paper.localToClientPoint(position);
                if (cellView.model.attributes.type == 'tct.TopoStation') {
                    this.toolTip(cellView.model.attributes, position, true);
                } else if (cellView.model.attributes.type == 'tct.TopoTrain') {
                    this.toolTip(cellView.model.attributes, position, true);
                }
            },
            "blank:pointerdown": (evt, x, y) => {
                // 取消高亮
                paper.model.getCells().forEach((item) => {
                    let view = paper.findViewByModel(item);
                    if (!paper.setTmpLimit) {
                        view.unselect();
                    }
                    view.passiveDown();
                });

                paper.pointerDown = { x, y };
                if (!this.toolTip) {
                    return;
                }
                this.toolTip({}, null);
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
    clearSetLimitLink() {
        let cells = this.model.getCells();
        cells.forEach(c => {
            if (c.attributes.drawData.toggle) {
                let view = this.findViewByModel(c);
                if (view && view.toggle) {
                    view.toggle();
                }
            }
        });
    },
    getTmpLimitFromLink() {
        let data = [];
        let cells = this.model.getCells();
        cells.forEach(c => {
            if (c.attributes.drawData.toggle) {
                data.push({
                    id: -1,
                    link: c.attributes.tctData.tctId,
                    headOfst: 0,
                    tailOfst: c.attributes.tctData.length,
                    limitSpd: 0,
                    remove:false
                });
            }
        });
        return data;
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
                        line.attributes.tctData.length = link.length;
                        line.position(start.position.x, start.position.y);
                        line.attr('line/x2', end.position.x - start.position.x);
                        line.attr('line/y2', end.position.y - start.position.y);
                        line.attr('label/text', `LK${link.id}`);
                        line.attr('label/x', (end.position.x - start.position.x) / 2);
                        line.attr('label/y', (end.position.y - start.position.y) / 2 + 8);
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
                    line.attributes.tctData = cell.tctData;
                    line.attributes.tctData.name = cell.tctData.name + '' + cell.tctData.tctId;
                    line.addTo(graph);
                }
            });
        }
        this.reset();
    },
    clearPerson() {
        try {
            let cells = this.model.getCells();
            let persons = cells.filter(c => {
                return c.attributes.type == 'tct.TopoPerson';
            });
            if (persons) {
                persons.forEach(t => {
                    t.remove();
                });
            }
        } catch (err) {
            console.log(err);
        }
    },
    drawPerson(realData) {
        this.clearPerson();
        let cells = this.model.getCells();
        let bsV = realData;
        if (bsV.bsTrainData && bsV.bsTrainData.length > 0) {
            bsV.bsTrainData.forEach(bst => {
                if(bst.driverOnboardFlag !== 0){
                    let linkModel = cells.find(c => {
                        return c.attributes.type == 'tct.TopoLink' && c.attributes.tctData.tctId == this.fsLinkMap[bst.driverLinkId].linkid;
                    });
    
                    if (linkModel) {
                        let person = TopoFactory.getInstance('tct.TopoPerson');
                        let x1 = linkModel.attr('line/x1');
                        let y1 = linkModel.attr('line/y1');
                        let rate = bst.driverLinkOfst * 1.0 / this.fsLinkMap[bst.driverLinkId].length;
                        let x = linkModel.position().x + (linkModel.attr('line/x2') - x1) * rate - 45;
                        let y = linkModel.position().y + (linkModel.attr('line/y2') - y1) * rate - 28;
                        person.position(x, y);
                        if (bst.driverOnboardFlag == 1) {
                            person.attr('head/fill', 'orange');
                            person.attr('body/fill', 'orange');
                        } else if (bst.driverOnboardFlag == 2) {
                            person.attr('head/fill', 'green');
                            person.attr('body/fill', 'green');
                        }
                        person.addTo(this.model);
                    }
                }
            });
        }
        return;
    },
    test(){
        // let person = TopoFactory.getInstance('tct.TopoPerson');
        // person.position(300, 300);
        // person.attr('head/fill', '#409EFF');
        // person.attr('body/fill', '#409EFF');  

        let train = TopoFactory.getInstance('tct.TopoTrain');
        train.position(300, 300);
        train.attr('body/fill', '#750614');
        train.attr('body/stroke', '#750614');  
        train.addTo(this.model);

        let view = this.findViewByModel(train);
        if(view){
            console.log('test animation.');
            view.notifyWarning();
        }
       
    },
    drawTrain(realData) {
        this.clearTrain();
        let cells = this.model.getCells();
        let bsV = realData;
        if (bsV.bsTrainData && bsV.bsTrainData.length > 0) {
            bsV.bsTrainData.forEach(bst => {
                let linkModel = cells.find(c => {
                    return c.attributes.type == 'tct.TopoLink' && c.attributes.tctData.tctId == this.fsLinkMap[bst.wHeadLinkId].linkid;
                });

                if (linkModel) {
                    let train = this.trainList.find(t => {
                        return t.attributes.tctData.tctId == bst.wTrainId;
                    });
                    if (!train) {
                        train = TopoFactory.getInstance('tct.TopoTrain');
                        this.trainList.push(train);
                    }
                    let x1 = linkModel.attr('line/x1');
                    let y1 = linkModel.attr('line/y1');
                    let rate = bst.wHeadLinkOfst * 1.0 / this.fsLinkMap[bst.wHeadLinkId].length;
                    let x = linkModel.position().x + (linkModel.attr('line/x2') - x1) * rate - 45;
                    let y = linkModel.position().y + (linkModel.attr('line/y2') - y1) * rate - 28;
                    train.attributes.tctData.tctId = bst.wTrainId;
                    train.position(x, y);
                    if (bst.wTrainDir == 0x55) {
                        train.attr('left/fill-opacity', 0.0);
                        train.attr('right/fill-opacity', 1.0);
                    } else if (bst.wTrainDir == 0xaa) {
                        train.attr('right/fill-opacity', 0.0);
                        train.attr('left/fill-opacity', 1.0);
                    }

                    if (bst.loadRate00 < 4000) {
                        train.attr('body/fill', '#409EFF');
                        train.attr('body/stroke', '#409EFF');
                    } else if (bst.loadRate00 < 6000) {
                        train.attr('body/fill', '#1a9513');
                        train.attr('body/stroke', '#1a9513');
                    } else if (bst.loadRate00 < 8000) {
                        train.attr('body/fill', '#fc0');
                        train.attr('body/stroke', '#fc0');
                    } else if (bst.loadRate00 < 10000) {
                        train.attr('body/fill', '#f00');
                        train.attr('body/stroke', '#f00');
                    } else if (bst.loadRate00 >= 10000) {
                        train.attr('body/fill', '#750614');
                        train.attr('body/stroke', '#750614');
                    }

                    train.attr('text/text', bst.orderNum);
                    train.addTo(this.model);

                    if(bst.msgFlag == 1){
                        let view = this.findViewByModel(train);
                        if(view && view.notifyWarning){
                            view.notifyWarning();
                        }
                    }

                    if(bst.abnormal){
                        train.attr('abnormal/stroke', '#fc0000');
                    }else{
                        train.attr('abnormal/stroke', 'transparent');
                    }
                }
            });
        }
        return;
    },
    updateStationColor(data) {
        // console.log('---daa');
        // console.log(data);
        let cells = this.model.getCells();
        cells.forEach(c => {
            if (c.attributes.type == 'tct.TopoStation') {
                c.attr('background/fill', 'transparent');
            }
        });

        if (data.bsStationStru) {
            data.bsStationStru.forEach(bsS => {
                let tctId = bsS.wStationId;
                let passengerCount = bsS.passengerCount;
                let color = 'transparent';
                if (passengerCount < 100) {
                    color = '#409EFF';
                } else if (passengerCount < 500) {
                    color = '#1a9513';
                } else if (passengerCount < 1000) {
                    color = '#fc0';
                } else if (passengerCount < 3000) {
                    color = '#f00';
                } else if (passengerCount >= 3000) {
                    color = '#750614';
                }
                let findC = cells.find(c => {
                    return c.attributes.type == 'tct.TopoStation' && c.attributes.tctData.tctId == tctId;
                });
                if (findC) {
                    findC.attr('background/fill', color);
                }
            });
        }
    },
    clearTrain() {
        try {
            let cells = this.model.getCells();
            let trains = cells.filter(c => {
                return c.attributes.type == 'tct.TopoTrain';
            });
            if (trains) {
                trains.forEach(t => {
                    t.remove();
                });
            }
        } catch (err) {
            console.log(err);
        }
    },
    checkFsLinkMap(project) {
        this.fsLinkMap = {};
        if (project && project.logicData && project.logicData.links) {
            project.logicData.links.forEach(item => {
                this.fsLinkMap[Number(item.id)] = {
                    linkid: Number(item.id),
                    length: Number(item.length)
                }
            });
        }
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
                if (i == indexEnd) {
                    if (sid != end) {
                        sid = components[i].RouteInfo.downPass[0].id;
                    }
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
                if (i == indexEnd) {
                    if (sid != end) {
                        sid = components[i].RouteInfo.upPass[0].id;
                    }
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
                let begin = stopAreas[0];
                stopAreas.splice(0, 1);
                stopAreas.push(begin);
                index--;
            }
            stopAreas.push(_.cloneDeep(stopAreas[0]));
        }
    } else if (mode == '单折') {
        if (direction == 1) {
            let findReversePath = reverseC.RouteInfo.upReverse.find(ur => {
                return ur.id == reverse;
            });

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