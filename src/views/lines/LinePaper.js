import * as joint from "jointjs";
import * as Util from '@/utils/util';
import _ from "lodash";
import ComponentUtil from './model/ComponentUtil';
import ModelFactory from './model/model/ModelFactory';

let g = joint.g;

let startPoint = { x: 0, y: 0 }; // 记录起始位置，移动画布的时候有用

let Paper = joint.dia.Paper.extend({
    project: "empty",
    pointerDown: null, // 鼠标落下时记录位置 【画图帮助】
    passivePoint: null, // 被动移动初始坐标 【画图帮助】
    combineCache: [], // 组合图元缓存【画图帮助】
    selectCacheId: null,
    cellCacheMap: [], // 元素字典
    /**
     * 根据id获取view
     */
    getViewById(id) {
        let model = this.model.getCell(id);
        return this.findViewByModel(model);
    },
    /**
     * 组合元素
     * @param {*} cellView 当前鼠标移动的元素
     */
    combineElement(cellView) {
        let allCellViews = this.model.getElements();
        allCellViews.forEach(cv => {
            cellView = this.getViewById(cv.attributes.id);
            for (let i = 0; i < allCellViews.length; i++) {
                if (cellView.model.attributes.id != allCellViews[i].attributes.id
                    && !(cellView.model.attributes.drawData.stationComponentId && allCellViews[i].attributes.drawData.stationComponentId)) {
                    let view = this.findViewByModel(allCellViews[i]);
                    let teamInfo = cellView.combine(view);

                    // team信息
                    // 如果前后两个team都为空，返回
                    if (teamInfo.oldTeamId || teamInfo.teamId) {
                        // 查找from team
                        let fromTeam = this.project.teams.find((team) => {
                            return team.teamId == teamInfo.oldTeamId;
                        });

                        // 查找to team
                        let toTeam = this.project.teams.find((team) => {
                            return team.teamId == teamInfo.teamId;
                        });

                        // 如果不存在目标组，创建
                        if (!toTeam) {
                            toTeam = { teamId: teamInfo.teamId, nodes: [] };
                            this.project.teams.push(toTeam);
                        }

                        // 如果存在旧的组，合并
                        if (fromTeam && fromTeam.teamId != toTeam.teamId) {
                            fromTeam.nodes.forEach(id => {
                                if (toTeam.nodes.indexOf(id) == -1) {
                                    toTeam.nodes.push(id);
                                }
                            });
                            // 删除旧的team
                            this.project.teams.splice(this.project.teams.indexOf(fromTeam), 1);

                            let allModles = this.model.getElements();
                            allModles.forEach(m => {
                                if (m.attributes.drawData.teamId == teamInfo.oldTeamId) {
                                    m.attributes.drawData.teamId = teamInfo.teamId;
                                }
                            });
                        }

                        if (teamInfo.addIds) {
                            teamInfo.addIds.forEach(id => {
                                if (toTeam.nodes.indexOf(id) == -1) {
                                    toTeam.nodes.push(id);
                                }
                            });
                        }
                    }

                    // if (teamInfo.stop) {
                    //     break;
                    // }
                }
            }
        });
    },
    /**
     * 分离元素
     * @param {*} cellView 
     */
    departElement(cellView) {
        let paper = this;
        let cellViewTeam = paper.project.teams.find(t => {
            return t.teamId == cellView.model.attributes.drawData.teamId;
        });
        let cacheDrawData = _.cloneDeep(cellView.model.attributes.drawData);
        let cacheTctData = _.cloneDeep(cellView.model.attributes.tctData);
        let cacheId = cellView.model.attributes.id;

        let relateInfo = cellView.freePort();
        let team = this.project.teams.find(t => {
            return t.teamId == relateInfo.removeTeamId; // 需要从team中移除
        });

        let resetTeamMap = [];
        let resetTeamId = function (node, newTeam, oldTeam) {
            if (!node || resetTeamMap.indexOf(node.id) > -1) {
                return;
            }

            oldTeam.nodes.splice(oldTeam.nodes.indexOf(node.id), 1);
            newTeam.nodes.push(node.id);

            let view = paper.getViewById(node.id);
            if (!view) {
                console.log('--- TODO ---')
                console.log(node);
                console.log('--- 应该从文件删除？ ---')
                return;
            }
            view.model.attributes.drawData.teamId = newTeam.teamId;
            resetTeamMap.push(node.id);

            if (node.type == 'tct.Point') {
                resetTeamId(view.model.attributes.drawData.nodeLeft, newTeam, oldTeam);
                resetTeamId(view.model.attributes.drawData.nodeMiddle, newTeam, oldTeam);
                resetTeamId(view.model.attributes.drawData.nodeRight, newTeam, oldTeam);
            } else if (node.type == 'tct.Track') {
                resetTeamId(view.model.attributes.drawData.nodeOne, newTeam, oldTeam);
                resetTeamId(view.model.attributes.drawData.nodeTwo, newTeam, oldTeam);
                if (view.model.attributes.drawData.elements) {
                    view.model.attributes.drawData.elements.forEach(e => {
                        resetTeamId(e, newTeam, oldTeam);
                    });
                }
                if (view.model.attributes.drawData.stations) {
                    view.model.attributes.drawData.stations.forEach(s => {
                        resetTeamId(s, newTeam, oldTeam);
                    });
                }
            } else if (node.type == 'tct.Station') {
                resetTeamId(view.model.attributes.drawData.nodeUp, newTeam, oldTeam);
                resetTeamId(view.model.attributes.drawData.nodeDown, newTeam, oldTeam);
            }
        };

        if (cellView.model.attributes.type == 'tct.Point') {
            let createTeamArr = [];
            resetTeamMap = [cellView.model.attributes.id];

            if (cacheDrawData.nodeLeft) {
                let createTeam = {
                    teamId: Util.getUUID(),
                    nodes: []
                }
                resetTeamId(cacheDrawData.nodeLeft, createTeam, cellViewTeam);
                createTeamArr.push(createTeam);
            }
            if (cacheDrawData.nodeMiddle) {
                let createTeam = {
                    teamId: Util.getUUID(),
                    nodes: []
                }
                resetTeamId(cacheDrawData.nodeMiddle, createTeam, cellViewTeam);
                createTeamArr.push(createTeam);
            }
            if (cacheDrawData.nodeRight) {
                let createTeam = {
                    teamId: Util.getUUID(),
                    nodes: []
                }
                resetTeamId(cacheDrawData.nodeRight, createTeam, cellViewTeam);
                createTeamArr.push(createTeam);
            }

            if (createTeamArr.length > 0) {
                paper.project.teams.push(createTeamArr[createTeamArr.length - 1]);
                for (let i = createTeamArr.length - 2; i >= 0; i--) {
                    let canPush = false;
                    if (createTeamArr[createTeamArr.length - 1].nodes.length != createTeamArr[i].nodes.length) {
                        paper.project.teams.push(createTeamArr[i]);
                    } else {
                        createTeamArr[i].nodes.forEach(id => {
                            if (createTeamArr[createTeamArr.length - 1].nodes.indexOf(id) == -1) {
                                canPush = true;
                            }
                        });
                        if (canPush) {
                            paper.project.teams.push(createTeamArr[i]);
                        }
                    }
                }
            }
        } else if (cellView.model.attributes.type == 'tct.Track') {
            let createTeamArr = [];
            if (cacheDrawData.nodeOne) {
                resetTeamMap = [cellView.model.attributes.id];
                let createTeam = {
                    teamId: Util.getUUID(),
                    nodes: []
                }
                resetTeamId(cacheDrawData.nodeOne, createTeam, cellViewTeam);
                createTeamArr.push(createTeam);
            }
            if (cacheDrawData.nodeTwo) {
                resetTeamMap = [cellView.model.attributes.id];
                let createTeam = {
                    teamId: Util.getUUID(),
                    nodes: []
                }
                resetTeamId(cacheDrawData.nodeTwo, createTeam, cellViewTeam);
                createTeamArr.push(createTeam);
            }
            if (createTeamArr.length > 0) {
                paper.project.teams.push(createTeamArr[createTeamArr.length - 1]);
                for (let i = createTeamArr.length - 2; i >= 0; i--) {
                    let canPush = false;
                    if (createTeamArr[createTeamArr.length - 1].nodes.length != createTeamArr[i].nodes.length) {
                        paper.project.teams.push(createTeamArr[i]);
                    } else {
                        createTeamArr[i].nodes.forEach(id => {
                            if (createTeamArr[createTeamArr.length - 1].nodes.indexOf(id) == -1) {
                                canPush = true;
                            }
                        });
                        if (canPush) {
                            paper.project.teams.push(createTeamArr[i]);
                        }
                    }
                }
            }
        } else if (cellView.model.attributes.type == 'tct.Station') {
            if (cacheDrawData.nodeUp) {
                let track = paper.getViewById(cacheDrawData.nodeUp.id);
                if (track && track.model.attributes.drawData.stations) {
                    let tar = track.model.attributes.drawData.stations.find(s => {
                        return s.id == cacheId;
                    });
                    if (tar) {
                        track.model.attributes.drawData.stations.splice(track.model.attributes.drawData.stations.indexOf(tar), 1);
                    }
                }
            }
            if (cacheDrawData.nodeDown) {
                let track = paper.getViewById(cacheDrawData.nodeDown.id);
                if (track && track.model.attributes.drawData.stations) {
                    let tar = track.model.attributes.drawData.stations.find(s => {
                        return s.id == cacheId;
                    });
                    if (tar) {
                        track.model.attributes.drawData.stations.splice(track.model.attributes.drawData.stations.indexOf(tar), 1);
                    }
                }
            }
        } else if (cellView.model.attributes.type == 'tct.Bumper') {
            if (cacheDrawData.nodeNext) {
                let track = paper.getViewById(cacheDrawData.nodeNext.id);
                if (track && track.model.attributes.drawData.elements) {
                    let tar = track.model.attributes.drawData.elements.find(e => {
                        return e.id == cacheId;
                    });
                    if (tar) {
                        track.model.attributes.drawData.elements.splice(track.model.attributes.drawData.elements.indexOf(tar), 1);
                    }
                }
            }
        } else {
            if (cacheDrawData.nodeParent) {
                let track = paper.getViewById(cacheDrawData.nodeParent.id);
                if (track && track.model.attributes.drawData.elements) {
                    let tar = track.model.attributes.drawData.elements.find(e => {
                        return e.id == cacheId;
                    });
                    if (tar) {
                        track.model.attributes.drawData.elements.splice(track.model.attributes.drawData.elements.indexOf(tar), 1);
                    }
                }
            }
        }

        if (team) {
            team.nodes.splice(team.nodes.indexOf(cellView.model.attributes.id), 1);
        }

        relateInfo.relatedNodes.forEach(node => {
            let view = this.getViewById(node.id);
            if (view) {
                let subRelateInfo = view.freePort(node);
                let Subteam = this.project.teams.find(t => {
                    return t.teamId == subRelateInfo.removeTeamId;
                });
                if (Subteam) {
                    Subteam.nodes.splice(Subteam.nodes.indexOf(view.model.attributes.id), 1);
                }
            }
        });

        let teams = this.project.teams;
        for (let i = 0; i < teams.length; i++) {
            if (teams[i].nodes.length < 2) {
                teams[i].nodes.forEach(id => {
                    let node = this.model.getCell(id);
                    if(node){
                        node.attributes.drawData.teamId = null;
                    }
                });
                this.project.teams.splice(i, 1);
                i--;
            }
        }
    },
    /**
     * 获取保存数据
     */
    getJsonData() {
        let jsonData = _.cloneDeep(this.project);
        jsonData.cells = [];
        let cells = this.model.getCells();
        cells.forEach((cell) => {
            let saveCell = _.cloneDeep(cell.attributes);
            delete saveCell.size; // 删除size属性，没有意义，所以不保存
            jsonData.cells.push(saveCell);
        });
        jsonData.selectedCell = null;
        return jsonData;
    },
    /**
     * 获取车站模块信息
     */
    getStationComponentData(formData, x, y) {
        let component = ComponentUtil.getNewComponent(formData, x, y);

        let cells = this.model.getCells();
        cells.forEach((cell) => {
            // TODO wait to delete
            cell.attributes.drawData.startLink = null;
            cell.attributes.drawData.endLink = null;
            cell.attributes.drawData.sideStartLink = null;
            cell.attributes.drawData.sideEndLink = null;
            cell.attributes.drawData.stationComponentId = component.id;
            let saveCell = _.cloneDeep(cell.attributes);
            delete saveCell.size; // 删除size属性，没有意义，所以不保存
            component.cells.push(saveCell);

            // 计算存储带端口的线id
            if (saveCell.type == 'tct.Track') {
                if (!saveCell.drawData.nodeOne || !saveCell.drawData.nodeTwo) {
                    component.info.portLines.push(saveCell.id);
                }
            } else {
                // 计算公里标范围
                let km = saveCell.tctData.km;
                component.info.km.kmMin = component.info.km.kmMin > km ? km : component.info.km.kmMin;
                component.info.km.kmMax = component.info.km.kmMax < km ? km : component.info.km.kmMax;
            }
            // 计算id范围
            component.info[saveCell.type].idMin = (component.info[saveCell.type].idMin > saveCell.tctData.tctId || component.info[saveCell.type].idMin == 0) ? saveCell.tctData.tctId : component.info[saveCell.type].idMin;
            component.info[saveCell.type].idMax = component.info[saveCell.type].idMax < saveCell.tctData.tctId ? saveCell.tctData.tctId : component.info[saveCell.type].idMax;
        });
        component.team = this.project.teams[0];
        return component;
    },
    /**
     * 加载项目文件
     * @param {*} jsonData 
     */
    loadJsonData(jsonData) {
        // 解决错误的厦门轨道交通3号线前端
        let teamId = jsonData.teams[0].teamId;
        jsonData.teams[0].nodes = [];
        jsonData.cells.forEach(item => {
            item.drawData.teamId = teamId;
            jsonData.teams[0].nodes.push(item.id);
        });

        this.project = jsonData;
        this.model.fromJSON({ cells: jsonData.cells });
        this.scalePaper(jsonData.paperInfo.scale);

        // TODO 兼容子停车区域方法：补充属性
        let allCells = this.model.getElements();
        allCells.forEach(c => {
            if (c.attributes.type == 'tct.StopArea') {
                if (!c.attributes.tctData.subAreasCount) {
                    c.attributes.tctData.subAreasCount = 0;
                    c.attributes.tctData.subAreas = [];
                }
            }
        });

        this._initIdMap();
    },
    /**
     * 初始化事件
     */
    initPaperEvent() {
        let paper = this;
        this.on({
            'cell:pointerdown': (cellView, evt, x, y) => {
                closeContextMenu(this);
                startPoint.x = x;
                startPoint.y = y;

                let rect = null;
                let rectArr = [];

                // 取消高亮
                paper.model.getCells().forEach((item) => {
                    let view = paper.findViewByModel(item);
                    view.unselect();
                    view.passiveDown();
                    if (cellView.model.attributes.drawData.stationComponentId && cellView.model.attributes.drawData.stationComponentId == item.attributes.drawData.stationComponentId) {
                        if(view.getRect){
                            rectArr.push(view.getRect());
                        }
                    }
                });

                cellView.select(rect);

                paper.pointerDown =
                {
                    x: cellView.model.attributes.position.x,
                    y: cellView.model.attributes.position.y
                };
            },
            "cell:pointermove": (cellView, evt, x, y) => {
                let teamId = cellView.model.attributes.drawData.teamId;
                if (teamId && paper.project) {
                    let team = paper.project.teams.find(team => {
                        return team.teamId == teamId;
                    });
                    if (team) {
                        team.nodes.forEach(id => {
                            if (id != cellView.model.attributes.id) { // 尤其重要，否则递归
                                let offsetX = cellView.model.attributes.position.x - paper.pointerDown.x;
                                let offsetY = cellView.model.attributes.position.y - paper.pointerDown.y;
                                let view = paper.getViewById(id);
                                view.passiveMove(offsetX, offsetY);
                            }
                        });
                    }
                }

                if (startPoint.x != x || startPoint.y != y) {
                    this.canNormalSelect = true;
                }
            },
            "cell:pointerup": (cellView, evt, x, y) => {
                paper.combineElement(cellView);
                paper.combineCache = [];
                paper.project.selectedCell = cellView.model;
            },
            "cell:mousewheel": (cellView, evt, x, y, delta) => {
                closeContextMenu(paper);
                // // Ctrl键缩放
                // if (evt.ctrlKey) {
                //     let flag = evt.originalEvent.wheelDeltaY <= -120 ? -1 : 1;
                //     paper.scalePaper(paper.project.paperInfo.scale + 0.1 * flag);
                // } else {  // 非Ctrl滚动
                //     let translate = paper.translate();
                //     paper.setOrigin(
                //         translate.tx,
                //         translate.ty + 30 * delta
                //     );
                // }

                // 缩放
                if (!evt.ctrlKey) {
                    let flag = evt.originalEvent.wheelDeltaY <= -120 ? -1 : 1;
                    paper.scalePaper(paper.project.paperInfo.scale + 0.1 * flag);
                }


                updateProjectTranslate(paper);
            },
            "cell:contextmenu": (cellView, evt, x, y) => {
                if (paper.project) {
                    paper.project.contextMenuVisible = true;
                    paper.project.contextMenuEvt = evt;
                    paper.project.contextMenu = cellView.getMenus();
                    paper.project.contextMenuCell = cellView;
                }
            },
            "blank:pointerdown": (evt, x, y) => {
                paper.selectCacheId = null; // TODO 干啥用的
                closeContextMenu(paper);
                // 取消高亮
                paper.model.getCells().forEach((item) => {
                    let view = paper.findViewByModel(item);
                    view.unselect();
                    view.passiveDown();
                });
                paper.project.selectedCell = null;

                paper.pointerDown =
                {
                    x: x,
                    y: y
                };
            },
            "blank:pointermove": (evt, x, y) => {
                // 鼠标左键
                if (evt.buttons == 1) {
                    if (!paper.project.assistInfo.locked || evt.ctrlKey) {
                        let models = paper.model.getCells();
                        models.forEach(model => {
                            let offsetX = x - paper.pointerDown.x;
                            let offsetY = y - paper.pointerDown.y;
                            let view = paper.getViewById(model.attributes.id);
                            view.passiveMove(offsetX, offsetY);
                        });
                    }
                    updateProjectTranslate(paper);
                }
            },
            "blank:pointerup": (evt, x, y) => {

            },
            "blank:mousewheel": (evt, x, y, delta) => {
                closeContextMenu(paper);
                // // Ctrl键缩放
                // if (evt.ctrlKey) {
                //     let flag = evt.originalEvent.wheelDeltaY <= -120 ? -1 : 1;
                //     paper.scalePaper(paper.project.paperInfo.scale + 0.1 * flag);
                // } else {  // 非Ctrl滚动
                //     let translate = paper.translate();
                //     paper.setOrigin(
                //         translate.tx,
                //         translate.ty + 30 * delta
                //     );
                // }

                // 缩放
                if (!evt.ctrlKey) {
                    let flag = evt.originalEvent.wheelDeltaY <= -120 ? -1 : 1;
                    paper.scalePaper(paper.project.paperInfo.scale + 0.1 * flag);
                }


                updateProjectTranslate(paper);
            },
            "blank:contextmenu": (evt, x, y) => {
                if (paper.project) {
                    paper.project.contextMenuVisible = true;
                    paper.project.contextMenuEvt = evt;
                    paper.project.contextMenu = ["解锁画布", "锁定画布", "重置画布"];
                    paper.project.contextMenuCell = null;
                }
            },
        });
    },
    updateBackground() {
        if (!this.project) {
            return;
        }
        this.drawBackground({
            color: this.project.paperInfo.backgroundColor
        });
    },
    updateGrid() {
        if (!this.project) {
            return;
        }

        if (this.project.paperInfo.showGrid) {
            // 因为网格参数比较复杂，所以不能通过setGrid(opt)的方式来设置；
            // 需要分成两个步骤：1.先设置复杂参数 2.drawGrid
            this.setGrid({
                name: "doubleMesh",
                args: [
                    { color: this.project.paperInfo.mainLineColor, thickness: 1 }, // settings for the primary mesh
                    { color: this.project.paperInfo.subLineColor, scaleFactor: 5, thickness: 3 }, //settings for the secondary mesh
                ],
            });
            this.drawGrid();
        } else {
            // 清除网格线后，移动还会出现，因为不能清除初始配置里的项，所以用设置线的颜色为透明的方式来实现的
            this.setGrid({
                name: "doubleMesh",
                args: [
                    { color: "#0000", thickness: 1 }, // settings for the primary mesh
                    { color: "#0000", scaleFactor: 5, thickness: 3 }, //settings for the secondary mesh
                ],
            });
            this.clearGrid();
        }
    },
    /**
     * 绘制元素
     * @param {*} bicon 
     * @param {*} e 
     */
    drawElement(bicon, e) {
        let pt = this.clientToLocalPoint({
            x: e.clientX,
            y: e.clientY,
        });
        pt = Util.alignPointToGrid(pt, 30);
        let model = ModelFactory.getInstanceByTypeName(bicon.description);
        if (model) {
            model.attributes.tctData.tctId = this.createId(model);
            model.position(pt.x, pt.y);
            model.addTo(this.model);
        }
    },
    /**
     * 绘制组件
     * @param {*} component 
     * @param {*} e 
     */
    drawComponent(component, e) {
        if (!component || !component.cells) {
            return;
        }
        component = _.cloneDeep(component);
        // 更新车站组件相关id
        ComponentUtil.updateId(component);

        // 更新组件元素的全局tctId
        if (!this.idMap) {
            this._initIdMap();
        }
        ComponentUtil.updateTctId(this.idMap, component);

        let pt = this.clientToLocalPoint({
            x: e.clientX,
            y: e.clientY,
        });

        // 画布上生成元素
        component.cells.forEach(cell => {
            let position = {
                x: cell.position.x - component.offsetX + pt.x,
                y: cell.position.y - component.offsetY + pt.y,
            };
            cell.position = Util.alignPointToGrid(position, 30);

            let view = ModelFactory.getInstance(cell);
            if (view) {
                view.addTo(this.model);
            }
        });

        if (!this.project.components) {
            this.project.components = [];
        }
        this.project.components.push(component); // 保存到项目中
        this.project.teams.push(_.cloneDeep(component.team)); // 更新当前项目teams
        return component.team;
    },
    /**
     * 更新方向
     * @param {*} model 当前元素
     */
    updateDirection(model) {
        let cell = this.findViewByModel(model);
        this.cellCacheMap = [cell];
        let paper = this;
        let setDirection = function (itemId, direction) {
            let targetCell = paper.model.getCell(itemId);
            if (!targetCell) {
                return;
            }

            targetCell.attributes.tctData.direction = direction;
            paper.cellCacheMap.push(itemId);
            switch (targetCell.attributes.type) {
                case 'tct.Bumper':
                    let nodeNext = targetCell.attributes.drawData.nodeNext;
                    if (nodeNext && paper.cellCacheMap.indexOf(nodeNext.id) == -1) {
                        setDirection(nodeNext.id, direction);
                    }
                    break;
                case 'tct.Track':
                    let nodeOne = targetCell.attributes.drawData.nodeOne;
                    if (nodeOne && paper.cellCacheMap.indexOf(nodeOne.id) == -1) {
                        setDirection(nodeOne.id, direction);
                    }
                    let nodeTwo = targetCell.attributes.drawData.nodeTwo;
                    if (nodeTwo && paper.cellCacheMap.indexOf(nodeTwo.id) == -1) {
                        setDirection(nodeTwo.id, direction);
                    }
                    let elements = targetCell.attributes.drawData.elements;
                    if (elements) {
                        elements.forEach(e => {
                            if (paper.cellCacheMap.indexOf(e.id) == -1) {
                                setDirection(e.id, direction);
                            }
                        });
                    }
                    break;
                case 'tct.Point':
                    let nodeLeft = targetCell.attributes.drawData.nodeLeft;
                    if (nodeLeft && paper.cellCacheMap.indexOf(nodeLeft.id) == -1) {
                        setDirection(nodeLeft.id, direction);
                    }
                    let nodeRight = targetCell.attributes.drawData.nodeRight;
                    if (nodeRight && paper.cellCacheMap.indexOf(nodeRight.id) == -1) {
                        setDirection(nodeRight.id, direction);
                    }
                    break;
            }
        }
        setDirection(cell.model.attributes.id, cell.model.attributes.tctData.direction);
        this.cellCacheMap = [];
    },
    /**
     * 更新元素外观
     * @param {*} model model
     */
    updateCellLayout(model) {
        let view = this.getViewById(model.attributes.id);
        if (view) {
            view.updateLayout();
        }
    },
    /**
     * 把手动改的组件信息更新到组件重
     */
    siliyMockStopAreaIdChange(model) {

        let cid = model.attributes.drawData.stationComponentId;
        let areaId = model.attributes.tctData.stopAreaID;
        let tctId = model.attributes.tctData.tctId;
        let tctType = model.attributes.type;

        let findC = this.project.components.find(c => {
            return c.id == cid;
        });
        if (findC) {
            let fincModel = findC.cells.find(cell => {
                return cell.type == tctType && cell.tctData.tctId == tctId;
            });

            if (fincModel) {
                fincModel.tctData.stopAreaID = Number(areaId);
            }
        }
    },
    /**
     * 处理右键菜单
     * @param {string} menu 
     */
    action(menu) {
        if (menu == "重置画布") {
            this.translatePaper(0, 0, true);
            this.scalePaper(1);
        } else if (menu == "锁定画布") {
            this.project.assistInfo.locked = true;
        } else if (menu == "解锁画布") {
            this.project.assistInfo.locked = false;
        } else if (menu == "复制") {
            Util.log('TODO', '待实现') // TODO
        } else if (this.project.contextMenuCell) {
            if (menu == '拆解') {
                this.departElement(this.project.contextMenuCell);
            } else if (menu == '删除') {
                this.departElement(this.project.contextMenuCell);
                this._removeFromIdMap(this.project.contextMenuCell.model);
            }
            this.project.contextMenuCell.action(menu);
        }
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
        this.project.paperInfo.scale = originSize; // 将缩放比例更新到项目属性中
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
        this.project.paperInfo.translate = this.translate();
    },
    /**
     * 创造ID
     * @param {*} model 
     */
    createId(model) {
        let id = 1;

        if (!this.idMap) {
            this.idMap = {
                "tct.Track": [],
                "tct.Balise": [],
                "tct.Point": [],
                "tct.Bumper": [],
                "tct.Axle": [],
                "tct.Signal": [],
                "tct.Station": [],
                "tct.Stop": [],
                "tct.StopArea": [],
                "tct.VirtualLine": [],
                "tct.VirtualPort": [],
                "tct.Grade": [],
                "tct.Limit": [],
                "tct.StationLimit": []
            };
        }

        let type = model.attributes.type;
        if(!this.idMap[type]){
            this.idMap[type]=[];
        }
        while (this.idMap[type].indexOf(id) > -1) {
            id++;
        }
        this.idMap[type].push(id);
        return id;
    },
    /**
     * 更换车站
     */
    changeStation(component) {
        let componentId = this.project.contextMenuCell.model.attributes.drawData.stationComponentId; // 获取id

        // 查找当前组件
        let dropC = this.project.components.find(c => {
            return c.id == componentId;
        });

        if (!dropC) {
            return;
        }

        // 1. 查找4个接口点
        let portLocation = null;
        dropC.info.portLines.forEach(id => {
            let view = this.getViewById(id);
            let rect = view.getRect();
            if (!portLocation) {
                portLocation = {
                    minx: rect.x, miny: rect.y, maxx: rect.x + rect.width, maxy: rect.y + rect.height
                }
            } else {
                portLocation.minx = portLocation.minx > rect.x ? rect.x : portLocation.minx;
                portLocation.miny = portLocation.miny > rect.y ? rect.y : portLocation.miny;
                portLocation.maxx = portLocation.maxx < (rect.x + rect.width) ? (rect.x + rect.width) : portLocation.maxx;
                portLocation.maxy = portLocation.maxy < (rect.y + rect.height) ? (rect.y + rect.height) : portLocation.maxy;
            }
        });

        if (!portLocation) {
            return;
        }

        // 2. 删除当前车站
        let cells = this.model.getElements();
        cells.forEach(c => {
            if (c.attributes.drawData.stationComponentId == componentId) {
                let view = this.getViewById(c.attributes.id);
                this.departElement(view);
                view.action('删除');
                this._removeFromIdMap(c); // 移除全局编号
            }
        });
        // 删除component(team中的元素id不用删除，应为第2步调用的【删除】操作，会重新更新project的team信息)
        this.project.components.splice(this.project.components.indexOf(dropC), 1);

        // 3. 查找右侧元素
        let waitMoveCells = [];
        cells = this.model.getElements();
        cells.forEach(c => {
            let view = this.getViewById(c.attributes.id);
            let portInfo = view.getPortCanUse();
            if (portInfo) {
                if ((portInfo.x == portLocation.maxx && portInfo.y == portLocation.miny)
                    || (portInfo.x == portLocation.maxx && portInfo.y == portLocation.maxy)) {
                    let results = this._findRelatedCells(view);
                    results.forEach(r => {
                        if (waitMoveCells.indexOf(r) == -1) {
                            waitMoveCells.push(r);
                        }
                    });
                }
                if (portInfo.portOne) {
                    if ((portInfo.portOne.x == portLocation.maxx && portInfo.portOne.y == portLocation.miny)
                        || (portInfo.portOne.x == portLocation.maxx && portInfo.portOne.y == portLocation.miny)) {
                        let results = this._findRelatedCells(view);
                        results.forEach(r => {
                            if (waitMoveCells.indexOf(r) == -1) {
                                waitMoveCells.push(r);
                            }
                        });
                    }
                }
                if (portInfo.portTwo) {
                    if ((portInfo.portTwo.x == portLocation.maxx && portInfo.portTwo.y == portLocation.miny)
                        || (portInfo.portTwo.x == portLocation.maxx && portInfo.portTwo.y == portLocation.miny)) {
                        let results = this._findRelatedCells(view);
                        results.forEach(r => {
                            if (waitMoveCells.indexOf(r) == -1) {
                                waitMoveCells.push(r);
                            }
                        });
                    }
                }
            }
        });

        // 4. 画新的车站
        let pt = {
            clientX: portLocation.minx,
            clientY: portLocation.miny
        }
        let team = this.drawComponent(component, pt);

        // 5. 查找新车站的4个接口点
        let curLocation = null;
        team.nodes.forEach(id => {
            let view = this.getViewById(id);
            let rect = view.getRect();
            if (view.model.attributes.type == 'tct.Track') {
                if (!view.model.attributes.drawData.nodeOne || !view.model.attributes.drawData.nodeTwo) {
                    if (!curLocation) {
                        curLocation = {
                            minx: rect.x, miny: rect.y, maxx: rect.x + rect.width, maxy: rect.y + rect.height
                        }
                    } else {
                        curLocation.minx = curLocation.minx > rect.x ? rect.x : curLocation.minx;
                        curLocation.miny = curLocation.miny > rect.y ? rect.y : curLocation.miny;
                        curLocation.maxx = curLocation.maxx < (rect.x + rect.width) ? (rect.x + rect.width) : curLocation.maxx;
                        curLocation.maxy = curLocation.maxy < (rect.y + rect.height) ? (rect.y + rect.height) : curLocation.maxy;
                    }
                }
            }
        });

        // 6. 平移右侧元素
        let rightCellMoveOffset = (curLocation.maxx - curLocation.minx) - (portLocation.maxx - portLocation.minx); // 右侧元素需要平移的偏移量

        waitMoveCells.forEach(w => {
            let p = w.model.attributes.position;
            w.model.position(p.x + rightCellMoveOffset, p.y);
        });

        // 7. 平移新车站元素
        let offsetX = portLocation.minx - curLocation.minx;
        let offsetY = portLocation.miny - curLocation.miny;
        let clickCell = null;
        team.nodes.forEach(id => {
            let view = this.getViewById(id);
            clickCell = view;
            let p = view.model.attributes.position;
            view.model.position(p.x + offsetX, p.y + offsetY);
        });

        // 8. 触发点击连接事件
        this.combineElement(clickCell);
        this.combineCache = [];
        this.pointerDown = null;
    },
    /**
     * 移除车站
     */
    removeStation() {
        let componentId = this.project.contextMenuCell.model.attributes.drawData.stationComponentId; // 获取id

        // 1. 查找当前组件
        let dropC = this.project.components.find(c => {
            return c.id == componentId;
        });

        if (!dropC) {
            return;
        }

        // 2. 删除当前车站
        let cells = this.model.getElements();
        cells.forEach(c => {
            if (c.attributes.drawData.stationComponentId == componentId) {
                let view = this.getViewById(c.attributes.id);
                this.departElement(view);
                view.action('删除');
                this._removeFromIdMap(c); // 移除全局编号
            }
        });
        // 3. 删除component  (team中的元素id不用删除，应为第2步调用的【删除】操作，会重新更新project的team信息)
        this.project.components.splice(this.project.components.indexOf(dropC), 1);

        // 4. 当前选中元素置空
        this.project.contextMenuCell = null;
    },
    /**
     * 设置组件起始公里标
     * @param {string} cid 组件id
     * @param {number} value 厘米值，如果想减小公里标设置请负值 
     */
    setComponentKmOffset(cid, value) {
        // 1. 查找组件
        let component = this.project.components.find(c => {
            return c.id == cid;
        });
        if (!component) {
            return;
        }

        component.team.nodes.forEach(n => {
            let view = this.getViewById(n);
            if (view) {
                let km = Number(view.model.attributes.tctData.km);
                if (!Number.isNaN(km)) {
                    view.model.attributes.tctData.km = km + Number(value);
                }

                let km1 = Number(view.model.attributes.tctData.km1);
                if (!Number.isNaN(km1)) {
                    view.model.attributes.tctData.km1 = km1 + Number(value);
                }
                let km2 = Number(view.model.attributes.tctData.km2);
                if (!Number.isNaN(km2)) {
                    view.model.attributes.tctData.km2 = km2 + Number(value);
                }
                view.updateLayout();
            }
        });
    },
    /**
     * 初始化IdMap
     */
    _initIdMap() {
        this.idMap = {
            "tct.Track": [],
            "tct.Balise": [],
            "tct.Point": [],
            "tct.Bumper": [],
            "tct.Axle": [],
            "tct.Signal": [],
            "tct.Station": [],
            "tct.Stop": [],
            "tct.StopArea": [],
            "tct.VirtualPort": [],
            "tct.Tag": [],
            "tct.Grade": [],
            "tct.Limit": [],
            "tct.StationLimit": []
        };
        let cells = this.model.getElements();
        if (cells) {
            cells.forEach(c => {
                let type = c.attributes.type;
                this.idMap[type].push(c.attributes.tctData.tctId);
            });
        }
    },
    /**
     * 从IdMap移除
     * @param {*} model 
     */
    _removeFromIdMap(model) {
        let type = model.attributes.type;

        if (this.idMap && this.idMap[type]) {
            let index = this.idMap[type].indexOf(parseInt(model.attributes.tctData.tctId));
            if (index > -1) {
                this.idMap[type].splice(index, 1);
            }
        }
    },
    /**
     * 重置cells编号
     */
    resetCellId() {
        // TODO 设置编号
        this._initIdMap();
    },
    /**
     * 画完组件后，清除VirtualPort
     */
    clearVirtualPort() {
        let cells = this.model.getElements();
        if (cells) {
            cells.forEach(c => {
                if (c.attributes.type == 'tct.VirtualPort') {
                    let view = this.getViewById(c.attributes.id);
                    this.project.contextMenuCell = view;
                    this.action('删除');
                }
            });
        }
    },
    /**
     * 递归查找相关联的Cell
     */
    _findRelatedCells(view) {
        let cellMap = [];
        let paper = this;
        let _find = function (view) {
            if (cellMap.indexOf(view) > -1) {
                return;
            }
            cellMap.push(view);

            switch (view.model.attributes.type) {
                case 'tct.Track':
                    if (view.model.attributes.drawData.nodeOne) {
                        let subView = paper.getViewById(view.model.attributes.drawData.nodeOne.id);
                        if (subView) {
                            _find(subView);
                        }
                    }
                    if (view.model.attributes.drawData.nodeTwo) {
                        let subView = paper.getViewById(view.model.attributes.drawData.nodeTwo.id);
                        if (subView) {
                            _find(subView);
                        }
                    }
                    if (view.model.attributes.drawData.elements) {
                        view.model.attributes.drawData.elements.forEach(e => {
                            let eView = paper.getViewById(e.id);
                            cellMap.push(eView);
                        });
                    }
                    if (view.model.attributes.drawData.stations) {
                        view.model.attributes.drawData.stations.forEach(s => {
                            let sView = paper.getViewById(s.id);
                            cellMap.push(sView);
                        });
                    }
                    break;
                case 'tct.Point':
                    if (view.model.attributes.drawData.nodeLeft) {
                        let subView = paper.getViewById(view.model.attributes.drawData.nodeLeft.id);
                        if (subView) {
                            _find(subView);
                        }
                    }
                    if (view.model.attributes.drawData.nodeMiddle) {
                        let subView = paper.getViewById(view.model.attributes.drawData.nodeMiddle.id);
                        if (subView) {
                            _find(subView);
                        }
                    }
                    if (view.model.attributes.drawData.nodeRight) {
                        let subView = paper.getViewById(view.model.attributes.drawData.nodeRight.id);
                        if (subView) {
                            _find(subView);
                        }
                    }
                    break;
            }
        };
        _find(view);
        return cellMap;
    },
    /**
     * 画Link标签
     */
    drawLink() {
        // 更新Link标签
        this.clearLink();

        let cells = this.model.getElements();
        let links = [];
        if (this.project.logicData && this.project.logicData.links) {
            links = this.project.logicData.links;
        }

        if (links.length > 0) {
            let team = this.project.teams ? this.project.teams[0] : null;

            links.forEach(link => {
                let linkCellType = {
                    1: 'tct.Bumper',/*线路终点*/
                    2: 'tct.Axle',/*计轴点*/
                    3: 'tct.Point',/*道岔点*/
                };

                let startCell = cells.find(c => {
                    return c.attributes.type == linkCellType[link.startCellType] && c.attributes.tctData.tctId == link.startCellId;
                });
                startCell = this.findViewByModel(startCell);

                let endCell = cells.find(c => {
                    return c.attributes.type == linkCellType[link.endCellType] && c.attributes.tctData.tctId == link.endCellId;
                });
                endCell = this.findViewByModel(endCell);

                try{
                    let x = (startCell.getPosition().x + endCell.getPosition().x) / 2;
                    let y = (startCell.getPosition().y + endCell.getPosition().y) / 2;
    
                    let tag = ModelFactory.getInstanceByTypeName('标签');
                    tag.resize(0, 0);
                    tag.position(x, y);
                    tag.attr("text/text", "LK" + link.id);
                    tag.addTo(this.model);
    
                    if (team) {
                        tag.attributes.drawData.teamId = team.teamId;
                        let view = this.findViewByModel(tag);
                        team.nodes.push(view.model.attributes.id);
                    }
                }catch(err){
                    console.log(err);
                    console.log(link);
                }
            });
        }
    },
    /**
     * 清除Link标签
     */
    clearLink() {
        let team = this.project.teams ? this.project.teams[0] : null;
        let cells = this.model.getElements();
        cells = cells.filter(c => {
            return c.attributes.type == 'tct.Tag';
        });
        cells = cells.map((c) => {
            return this.findViewByModel(c);
        });

        cells.forEach((c) => {
            if (team) {
                team.nodes.splice(team.nodes.indexOf(c.model.attributes.id), 1);
                c.model.remove();
            }
        });
    },
    /**
     * 清除坡度
     */
    clearGrade() {
        let team = this.project.teams ? this.project.teams[0] : null;
        let cells = this.model.getElements();
        cells = cells.filter(c => {
            return c.attributes.type == 'tct.Grade';
        });
        cells = cells.map((c) => {
            return this.findViewByModel(c);
        });

        cells.forEach((c) => {
            if (team) {
                team.nodes.splice(team.nodes.indexOf(c.model.attributes.id), 1);
                c.model.remove();
            }
        });
    },
    /**
     * 获取公里标范围和画布网格大小的比例
     */
    getKmGridRate() {
        let minX = 0, maxX = 0, minY = 0, maxY = 0;
        let minKm = 0, maxKm = 0;

        let models = this.model.getCells();

        if (models) {
            let setFirst = false;
            for (let i = 0; i < models.length; i++) {
                let current = models[i].attributes;
                if (!(current.type == "tct.Bumper" || current.type == "tct.Station" || current.type == "tct.Point" || current.type == "tct.Axle") || current.type == "tct.Axle") {
                    continue;
                }
                if (!setFirst) {
                    minX = Number(current.position.x);
                    maxX = Number(current.position.x);
                    minY = Number(current.position.y);
                    maxY = Number(current.position.y);
                    minKm = Number(current.tctData.km);
                    maxKm = Number(current.tctData.km);
                    setFirst = true;
                } else {
                    minX = minX > Number(current.position.x) ? Number(current.position.x) : minX;
                    maxX = maxX < Number(current.position.x) ? Number(current.position.x) : maxX;
                    minY = minY > Number(current.position.y) ? Number(current.position.y) : minY;
                    maxY = maxY < Number(current.position.y) ? Number(current.position.y) : maxY;
                    minKm = minKm > Number(current.tctData.km) ? Number(current.tctData.km) : minKm;
                    maxKm = maxKm < Number(current.tctData.km) ? Number(current.tctData.km) : maxKm;
                }
            }
        }

        // minKm *= 100;
        // maxKm *= 100;
        let kmLength = maxKm - minKm;
        let xLength = maxX - minX;
        let rate = 1;
        if (xLength > 0 && kmLength > 0) {
            rate = kmLength / xLength;
        }

        let info = {
            minX, maxX, minY, maxY, minKm, maxKm, rate
        };

        return info;
    },
    /**
     * 画坡度
     */
    drawGrade(rawGrade) {

        let team = null;
        if (this.project.teams && this.project.teams.length > 0) {
            team = this.project.teams[0];
        }

        let models = this.model.getCells();
        models.forEach(m => {
            if (m.attributes.type == 'tct.Grade') {
                m.remove();
                if (team) {
                    team.nodes.splice(team.nodes.indexOf(m.attributes.id), 1);
                }
            }
        });

        if (rawGrade) {
            let info = this.getKmGridRate();
            rawGrade.forEach(raw => {
                if (raw && raw.length > 0) {
                    raw.forEach(g => {
                        let model = ModelFactory.getInstanceByTypeName('坡度');
                        model.addTo(this.model);
                        let view = this.findViewByModel(model);
                        view.setGradeInfo(g, info);
                        if (team) {
                            team.nodes.push(model.attributes.id);
                        }
                    });
                }
            });
        }
    },
    /**
    * 画限速
    * @param {*} limitInfo 
    */
    drawLimit(rawLimit) {
        let team = null;
        if (this.project.teams && this.project.teams.length > 0) {
            team = this.project.teams[0];
        }

        let models = this.model.getCells();
        models.forEach(m => {
            if (m.attributes.type == 'tct.Limit') {
                m.remove();
                if (team) {
                    team.nodes.splice(team.nodes.indexOf(m.attributes.id), 1);
                }
            }
        });

        if (rawLimit) {
            let info = this.getKmGridRate();
            rawLimit.forEach(raw => {
                if (raw && raw.length > 0) {
                    raw.forEach(g => {
                        let model = ModelFactory.getInstanceByTypeName('限速');
                        model.addTo(this.model);
                        let view = this.findViewByModel(model);
                        view.setLimitInfo(g, info);
                        if (team) {
                            team.nodes.push(model.attributes.id);
                        }
                    });
                }
            });
        }
    },
    filterRawLimit(rawLimit, limitInfo) {
        let data = _.cloneDeep(rawLimit);
        let results = [[], []];
        data[0].forEach(a => {
            let p = {};
            p.startCm = parseInt(a.startCm * 100);
            p.endCm = parseInt(a.endCm * 100);
            p.R = parseInt(a.R * 100);
            p.L = parseInt(a.L * 100);
            p.V = parseInt(a.V * 1000 / 36);
            p.H = parseInt(a.H);

            if (Number(p.R) != 0) {
                results[0].push(p);
            }
        });
        data[1].forEach(a => {
            let p = {};
            p.startCm = parseInt(a.startCm * 100);
            p.endCm = parseInt(a.endCm * 100);
            p.R = parseInt(a.R * 100);
            p.L = parseInt(a.L * 100);
            p.V = parseInt(a.V * 1000 / 36);
            p.H = parseInt(a.H);
            if (Number(p.R) != 0) {
                results[1].push(p);
            }
        });
        return {
            platFormV: parseInt(Number(limitInfo.platFormV) * 1000 / 36),
            lsCmStru: results
        };
    },
    /**
     * 获取车站限速
     */
    getStationLimit(links, stopAreas) {
        let data = [[], []];
        let cells = this.model.getCells();
        let models = [];
        if (models) {
            models = cells.filter(m => {
                return m.attributes.type == 'tct.StopArea' && Number(m.attributes.tctData.limit) > 0;
            });

            if (models) {
                models.forEach(m => {
                    let findS = stopAreas.find(s => {
                        return Number(s.id) == Number(m.attributes.tctData.tctId);
                    });
                    if (findS) {
                        let link = links.find(k => {
                            return k.id == findS.linkId;
                        });

                        if (link) {
                            let start = cells.find(c => {
                                let type = 'tct.Bumper';
                                if (Number(link.startCellType) == 2) {
                                    type = 'tct.Axle';
                                } else if (Number(link.startCellType) == 3) {
                                    type = 'tct.Point';
                                }

                                return c.attributes.type == type && Number(c.attributes.tctData.tctId) == Number(link.startCellId);
                            });

                            let end = cells.find(c => {
                                let type = 'tct.Bumper';
                                if (Number(link.endCellType == 2)) {
                                    type = 'tct.Axle';
                                } else if (Number(link.endCellType == 3)) {
                                    type = 'tct.Point';
                                }

                                return c.attributes.type == type && Number(c.attributes.tctData.tctId) == Number(link.endCellId);
                            });

                            if (start && end) {
                                let item = {
                                    startCm: parseInt(Number(start.attributes.tctData.km) * 100),
                                    endCm: parseInt(Number(end.attributes.tctData.km) * 100),
                                    V: parseInt(Number(m.attributes.tctData.limit) * 1000 / 36)
                                }
                                if (Number(m.attributes.tctData.location) == 1) {
                                    data[0].push(item);
                                } else if (Number(m.attributes.tctData.location) == 2) {
                                    data[1].push(item);
                                }
                            }
                        }
                    }
                });
            }
        }
        return data;
    },

    /**
     * 设置统一道岔
     * @param {*} type 
     */
    setAllPointType(type) {
        type = parseInt(type);
        if (type > 0 && type < 5) {
            let cells = this.model.getElements();
            if (cells) {
                cells.forEach(c => {
                    if (c.attributes.type == 'tct.Point') {
                        let view = this.getViewById(c.attributes.id);
                        if (view) {
                            c.attributes.tctData.pointType = type;
                            view.updateLayout();
                        }
                    }
                });
            }
        }
    },
    updateKmFromFS(fsData) {
        let paper = this;
        if (!fsData || !fsData.fslinks) {
            return;
        }

        let cellSetMap = []; // 已经设置过公里标的元素集合
        let linkInfo = _.cloneDeep(this.project.logicData.links);

        if (!linkInfo) {
            return;
        }
        let cells = this.model.getElements();

        function setRelateCell(cell) {
            if (cellSetMap.indexOf(cell) > -1) {
                return;
            }
            cellSetMap.push(cell);
            let cellType = cell.attributes.type == "tct.Bumper" ? 1 : cell.attributes.type == "tct.Axle" ? 2 : 3;
            let cellId = cell.attributes.tctData.tctId;

            let findStartLinks = linkInfo.filter(item => {
                return item.startCellType == cellType && item.startCellId == cellId;
            });
            if (findStartLinks) {
                findStartLinks.forEach(item => {
                    let typeName = item.endCellType == 1 ? 'tct.Bumper' : item.endCellType == 2 ? 'tct.Axle' : 'tct.Point';
                    let findCell = cells.find(c => {
                        return c.attributes.type == typeName && c.attributes.tctData.tctId == item.endCellId;
                    });
                    let findLinkMap = fsData.fslinks.find(x => {
                        return x.link == item.id;
                    });
                    if (findCell && findLinkMap && cellSetMap.indexOf(findCell) == -1) {
                        findCell.attributes.tctData.km = Number(cell.attributes.tctData.km) + Math.floor(findLinkMap.realLength) / 100;
                        // TODO 
                        if (item.id == 200) {
                            console.log(cell.attributes.type, cell.attributes.tctData.tctId, cell.attributes.tctData.km);
                            console.log(findCell.attributes.type, findCell.attributes.tctData.tctId, findCell.attributes.tctData.km);
                        }
                        setRelateCell(findCell);
                        let view = paper.findViewByModel(findCell);
                        view.updateLayout();
                    }
                    item.start = Number(cell.attributes.tctData.km);
                });
            }

            let findEndLinks = linkInfo.filter(item => {
                return item.endCellType == cellType && item.endCellId == cellId;
            });
            if (findEndLinks) {
                findEndLinks.forEach(item => {
                    let typeName = item.startCellType == 1 ? 'tct.Bumper' : item.startCellType == 2 ? 'tct.Axle' : 'tct.Point';
                    let findCell = cells.find(c => {
                        return c.attributes.type == typeName && Number(c.attributes.tctData.tctId) == item.startCellId;
                    });
                    let findLinkMap = fsData.fslinks.find(x => {
                        return x.link == item.id;
                    });
                    if (findCell && findLinkMap && cellSetMap.indexOf(findCell) == -1) {
                        findCell.attributes.tctData.km = Number(cell.attributes.tctData.km) - Math.floor(findLinkMap.realLength) / 100;
                        // TODO 
                        if (item.id == 200) {
                            console.log(cell.attributes.type, cell.attributes.tctData.tctId, cell.attributes.tctData.km);
                            console.log(findCell.attributes.type, findCell.attributes.tctData.tctId, findCell.attributes.tctData.km);
                        }
                        setRelateCell(findCell);
                        let view = paper.findViewByModel(findCell);
                        view.updateLayout();
                    }
                    item.end = Number(cell.attributes.tctData.km);
                });
            }
        }

        // let startCell = cells.find(item => {
        //     return item.attributes.type == 'tct.Bumper' && item.attributes.tctData.tctId == 1;
        // });

        // startCell.attributes.tctData.km = 208.273;

        let startCell = cells.find(item => {
            return item.attributes.type == 'tct.Bumper' && item.attributes.tctData.tctId == 16;
        });

        startCell.attributes.tctData.km = 28617.594;

        setRelateCell(startCell);

        if (fsData.grades) {
            this.project.gradeInfo = { uniformGradeValue: 0, useUniform: true, data: [] };
            fsData.grades.forEach(grade => {
                let findMap = fsData.fslinks.find(tar => {
                    return tar.fslink == grade.start;
                });
                let findStart = linkInfo.find(item => {
                    return item.id == findMap.link;
                });
                findMap = fsData.fslinks.find(tar => {
                    return tar.fslink == grade.end;
                });
                let findEnd = linkInfo.find(item => {
                    return item.id == findMap.link;
                });

                if (findStart && findEnd) {
                    let data = {
                        id: 0,
                        startKm: findStart.start * 100 + grade.startOffset,
                        endKm: findEnd.start * 100 + grade.endOffset,
                        value: grade.grade,
                        R: grade.r,
                        direction: grade.dir == 0x55 ? 1 : 2,
                    };
                    if (data.startKm && data.endKm && data.endKm > data.startKm) {
                        this.project.gradeInfo.data.push(data);
                    }
                }
            });
        }

        if (fsData.limits) {
            this.project.limitInfo = {
                uniformLimitValue: 85,
                platFormV: 60,
                useUniform: true,
                data: [],
            };

            let lastLimit = null;
            let lastData = null;

            fsData.limits.forEach(limit => {
                let findMap = fsData.fslinks.find(tar => {
                    return tar.fslink == limit.link;
                });
                let findLink = linkInfo.find(item => {
                    return item.id == findMap.link;
                });

                if (findLink) {
                    let data = {
                        startCm: (findLink.start + limit.start / 100),
                        endCm: (findLink.start + limit.end / 100),
                        direction: findLink.direction == 0x55 ? 1 : 2,
                        L: 0,
                        R: 0,
                        V: limit.limit,
                        H: 0,
                    };
                    if (data.startCm && data.endCm) {
                        if (data.startCm < data.endCm) {
                            if (lastLimit && lastLimit.link == limit.link && lastLimit.limit == limit.limit) {
                                data.startCm = lastData.startCm;
                            } else {
                                this.project.limitInfo.data.push(data);
                            }
                            lastLimit = limit;
                            lastData = data;
                        }
                    }
                }
            });
        }

        console.log('-- ok --', this.project.gradeInfo.data.length, this.project.limitInfo.data.length);

    },
    /**
     * 定位到车站位置
     * @param {*} s 
     */
    location(s) {
        let cells = this.model.getCells();
        let c = cells.find(m => {
            return m.attributes.type == 'tct.Station' && m.attributes.tctData.name == s;
        });

        if (c) {
            let position = c.attributes.position;
            let targetPosition = { x: 500, y: 200 };
            let offsetX = targetPosition.x - position.x;
            let offsetY = targetPosition.y - position.y;


            cells.forEach(model => {
                model.position(model.attributes.position.x + offsetX, model.attributes.position.y + offsetY);
            });
        }
    },
    getStationNameList() {
        let cells = this.model.getCells();
        let names = [];

        cells.sort((a, b) => {
            return a.attributes.position.x - b.attributes.position.x;
        });

        cells.forEach(c => {
            if (c.attributes.type == 'tct.Station' && names.indexOf(c.attributes.tctData.name) == -1) {
                names.push(c.attributes.tctData.name);
            }
        });

        return names;
    }
});

// --- 以下是私有方法 ---

function closeContextMenu(paper) {
    if (paper && paper.project) {
        paper.project.contextMenuVisible = false;
        paper.project.contextMenuEvt = null;
        paper.project.contextMenu = [];
        paper.project.contextMenuCell = null;
    }
}

let updateProjectTranslate = function (paper) {
    if (paper && paper.project) {
        paper.project.paperInfo.translate = paper.translate();
    }
};

export default Paper;