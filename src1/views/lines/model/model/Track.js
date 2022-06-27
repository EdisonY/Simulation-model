
import * as Util from "@/utils/util";
import * as joint from "jointjs";
import BaseData from '../BaseData';

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let Track = joint.dia.Element.define('tct.Track', {
    attrs: {
        line: {
            x1: 0,
            y1: 0,
            x2: 150,
            y2: 0,
            "stroke-width": 6,
            stroke: BaseData.Colors.Track,
        }
    },
    markup: [{
        tagName: 'line',
        selector: 'line',
    }],
    tctData: {
        typeName: "轨道",
        tctId: BaseData.DefaultTctId,
        km: 0,
        kmOffset: 0,
        direction: BaseData.Direction.NotSet
    },
    drawData: {
        teamId: null,
        nodeOne: null, // {tctId,type,portType}
        nodeTwo: null,
        elements: [],
        stations: []
    }
}, {
});


joint.shapes.tct.TrackView = joint.dia.ElementView.extend({
    init() {
        // 拖拽移动辅助
        this._oldPosition = null;
        this._oldPt = null;
        this._oldPt1 = null;
        this._oldPt2 = null;
        this._offsetPoint = null;
        this._dragIndex = null;

        //svg 元素
        this.VDragRect1 = null;
        this.VDragRect2 = null;

        this.model.on("change", this.onPositionChange.bind(this));
    },
    render() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.updatePort();
    },
    onPositionChange() {
        // console.log("--- onPositionChange ---");
    },
    /**
     * 选中
     */
    select(rect) { // 每个自定义图元要实现select和unselect方法
        this._setOutlineRectVisibility(true, rect);
    },
    updateLayout() { },
    /**
     * 取消选中
     */
    unselect() { // 每个自定义图元要实现select和unselect方法
        // this.unhighlight();
        this._setOutlineRectVisibility(false);
    },
    _setOutlineRectVisibility(visible, rect) {
        if (rect) {
            if (visible) {
                if (!this.VSelect) {
                    this.VSelect = V("rect");
                }
                let r = this.getRect();
                this.VSelect.attr({
                    x: rect.x - r.x + Math.min(this.model.attr('line/x1'), this.model.attr('line/x2')),
                    y: rect.y - r.y + Math.min(this.model.attr('line/y1'), this.model.attr('line/y2')),
                    width: rect.width,
                    height: rect.height,
                    fill: "#222",
                    "fill-opacity": 0.3,
                    "stroke-width": 2,
                    stroke: BaseData.Colors.Selected
                });
                this.vel.append([this.VSelect]);
            } else {
                if (this.VSelect) {
                    this.VSelect.remove();
                    this.VSelect = null;
                }
            }
        } else {
            if (visible) {
                this.model.attr("line/stroke", BaseData.Colors.Selected);
            } else {
                this.model.attr("line/stroke", BaseData.Colors.Track);
                if (this.VSelect) {
                    this.VSelect.remove();
                    this.VSelect = null;
                }
            }
        }
    },
    pointerdown: function (evt, x, y) {
        joint.dia.ElementView.prototype.pointerdown.apply(this, arguments);
        this._oldPt = g.point(x, y);
        this._oldPosition = { x: this.model.attributes.position.x, y: this.model.attributes.position.y };
        this._oldPt1 = g.point(
            this.model.attr("line/x1"),
            this.model.attr("line/y1")
        );
        this._oldPt2 = g.point(
            this.model.attr("line/x2"),
            this.model.attr("line/y2")
        );
        this._offsetPoint = {
            offsetX1: this._oldPt.x - this._oldPt1.x,
            offsetY1: this._oldPt.y - this._oldPt1.y,
            offsetX2: this._oldPt.x - this._oldPt2.x,
            offsetY2: this._oldPt.y - this._oldPt2.y,
        }
        this._dragIndex = evt.target.getAttribute("dragRect-idx");
    },
    pointerup: function (evt, x, y) {
        this._oldPosition = null;
        this._oldPt = null;
        this._oldPt1 = null;
        this._dragIndex = null;
        joint.dia.ElementView.prototype.pointerup.apply(this, arguments);
    },
    pointermove: function (evt, x, y) {
        if (this._dragIndex == 1) { // 选中左拖拽方块移动
            //任意拉长
            this.model.attr("line", {
                x1: x - this._offsetPoint.offsetX1,
                y1: y - this._offsetPoint.offsetY1
            });
        } else if (this._dragIndex == 2) { // 选中右拖拽方块移动
            this.model.attr("line", {
                x2: x - this._offsetPoint.offsetX2,
                y2: y - this._offsetPoint.offsetY2
            });
        } else {  // 选中线移动
            //移动
            const distanceX = x - this._oldPt.x;
            const distanceY = y - this._oldPt.y;
            this.model.position(this._oldPosition.x + distanceX, this._oldPosition.y + distanceY);
            joint.dia.CellView.prototype.pointermove.apply(this, arguments);
        }

        this.updatePort(); // select方法会更新线段两端的小框

    },
    /**
     * 更新端口状态
     */
    updatePort() {
        let model = this.model;
        if (model.attributes.drawData.nodeOne) {
            if (this.VDragRect1) {
                this.VDragRect1.remove();
                this.VDragRect1 = null;
            }
        } else {
            if (!this.VDragRect1) {
                this.VDragRect1 = V("rect");
            }
            this.VDragRect1.attr({
                x: model.attr("line/x1") - 3,
                y: model.attr("line/y1") - 3,
                width: 6,
                height: 6,
                fill: "white",
                "stroke-width": 3,
                stroke: "red",
                "dragRect-idx": 1
            });
            this.vel.append([this.VDragRect1]);
        }

        if (model.attributes.drawData.nodeTwo) {
            if (this.VDragRect2) {
                this.VDragRect2.remove();
                this.VDragRect2 = null;
            }
        } else {
            if (!this.VDragRect2) {
                this.VDragRect2 = V("rect");
            }
            this.VDragRect2.attr({
                x: model.attr("line/x2") - 3,
                y: model.attr("line/y2") - 3,
                width: 6,
                height: 6,
                fill: "white",
                "stroke-width": 3,
                stroke: "red",
                "dragRect-idx": 2
            });
            this.vel.append([this.VDragRect2]);
        }
    },
    /**
     * 获取可用端口
     */
    getPortCanUse() {
        let ports = null;
        let model = this.model.attributes;

        if (!model.drawData.nodeOne) {
            let port = {
                x: model.attrs.line.x1 + model.position.x,
                y: model.attrs.line.y1 + model.position.y
            }

            ports = { portOne: port };
        }

        if (!model.drawData.nodeTwo) {
            let port = {
                x: model.attrs.line.x2 + model.position.x,
                y: model.attrs.line.y2 + model.position.y
            }
            if (ports) {
                ports.portTwo = port;
            } else {
                ports = { portTwo: port };
            }
        }
        return ports;
    },
    /**
     * 组内元素鼠标落下，记录位置
     */
    passiveDown() {
        this.passivePointDown = this.model.attributes.position;
    },
    /**
     * 组件关联移动
     * @param {number} offsetX 相对初始位置的偏移量x
     * @param {number} offsetY 相对初始位置的偏移量y
     */
    passiveMove: function (offsetX, offsetY) {
        this.model.position(
            this.passivePointDown.x + offsetX,
            this.passivePointDown.y + offsetY
        );
    },
    /**
     * 获轨道线的真实位置
     */
    getTrackRealPosition() {
        return {
            x1: this.model.attributes.position.x + this.model.attributes.attrs.line.x1,
            y1: this.model.attributes.position.y + this.model.attributes.attrs.line.y1,
            x2: this.model.attributes.position.x + this.model.attributes.attrs.line.x2,
            y2: this.model.attributes.position.y + this.model.attributes.attrs.line.y2
        }
    },
    /**
     * 将当前线连接到其他元素
     * @param {*} cellView 其他元素
     */
    combine(cellView) {
        let teamInfo = {};

        let trackPorts = this.getPortCanUse();

        if ((cellView.model.attributes.type == 'tct.Bumper' || cellView.model.attributes.type == 'tct.VirtualPort') && trackPorts) { // 车挡
            let bumperPort = cellView.getPortCanUse();
            if (!bumperPort) {
                return teamInfo;
            }

            if (trackPorts.portOne && trackPorts.portOne.x == bumperPort.x && trackPorts.portOne.y == bumperPort.y) {
                teamInfo = this._connectBumperPort(cellView, "portOne");
            } else if (trackPorts.portTwo && trackPorts.portTwo.x == bumperPort.x && trackPorts.portTwo.y == bumperPort.y) {
                teamInfo = this._connectBumperPort(cellView, "portTwo");
            }
        } else if (cellView.model.attributes.type == 'tct.Track' && trackPorts) {
            let tarPorts = cellView.getPortCanUse();
            if (!tarPorts) {
                return teamInfo;
            }

            if (trackPorts.portOne && tarPorts.portOne && trackPorts.portOne.x == tarPorts.portOne.x && trackPorts.portOne.y == tarPorts.portOne.y) {
                teamInfo = this._connectTrackPort(cellView, "portOne", "portOne");
            } else if (trackPorts.portTwo && tarPorts.portOne && trackPorts.portTwo.x == tarPorts.portOne.x && trackPorts.portTwo.y == tarPorts.portOne.y) {
                teamInfo = this._connectTrackPort(cellView, "portTwo", "portOne");
            } else if (trackPorts.portOne && tarPorts.portTwo && trackPorts.portOne.x == tarPorts.portTwo.x && trackPorts.portOne.y == tarPorts.portTwo.y) {
                teamInfo = this._connectTrackPort(cellView, "portOne", "portTwo");
            } else if (trackPorts.portTwo && tarPorts.portTwo && trackPorts.portTwo.x == tarPorts.portTwo.x && trackPorts.portTwo.y == tarPorts.portTwo.y) {
                teamInfo = this._connectTrackPort(cellView, "portTwo", "portTwo");
            }

        } else if (cellView.model.attributes.type == 'tct.Point' && trackPorts) {
            let pointPorts = cellView.getPortCanUse();
            if (!pointPorts) {
                return teamInfo;
            }

            if (trackPorts.portOne && pointPorts.portLeft && trackPorts.portOne.x == pointPorts.portLeft.x && trackPorts.portOne.y == pointPorts.portLeft.y) {
                teamInfo = this._connectPointPort(cellView, "portOne", "portLeft");
            } else if (trackPorts.portTwo && pointPorts.portLeft && trackPorts.portTwo.x == pointPorts.portLeft.x && trackPorts.portTwo.y == pointPorts.portLeft.y) {
                teamInfo = this._connectPointPort(cellView, "portTwo", "portLeft");
            } else if (trackPorts.portOne && pointPorts.portMiddle && trackPorts.portOne.x == pointPorts.portMiddle.x && trackPorts.portOne.y == pointPorts.portMiddle.y) {
                teamInfo = this._connectPointPort(cellView, "portOne", "portMiddle");
            } else if (trackPorts.portTwo && pointPorts.portMiddle && trackPorts.portTwo.x == pointPorts.portMiddle.x && trackPorts.portTwo.y == pointPorts.portMiddle.y) {
                teamInfo = this._connectPointPort(cellView, "portTwo", "portMiddle");
            } else if (trackPorts.portOne && pointPorts.portRight && trackPorts.portOne.x == pointPorts.portRight.x && trackPorts.portOne.y == pointPorts.portRight.y) {
                teamInfo = this._connectPointPort(cellView, "portOne", "portRight");
            } else if (trackPorts.portTwo && pointPorts.portRight && trackPorts.portTwo.x == pointPorts.portRight.x && trackPorts.portTwo.y == pointPorts.portRight.y) {
                teamInfo = this._connectPointPort(cellView, "portTwo", "portRight");
            }
        } else if (cellView.model.attributes.type == 'tct.Axle' ||
            cellView.model.attributes.type == 'tct.Balise' ||
            cellView.model.attributes.type == 'tct.Signal' ||
            cellView.model.attributes.type == 'tct.Stop' ||
            cellView.model.attributes.type == 'tct.StopArea') {
            if (cellView.model.attributes.drawData.nodeParent) {
                return teamInfo;
            }
            let trackPosition = this.getTrackRealPosition();
            if (trackPosition.y1 == trackPosition.y2) {
                let cellPort = cellView.getPortCanUse();
                if (cellPort) {
                    if (cellPort.y == trackPosition.y1 && cellPort.x >= trackPosition.x1 && cellPort.x <= trackPosition.x2) {
                        teamInfo = this._connectElementPort(cellView);
                    }
                }
            } else {
                let portRange = {
                    x: cellView.model.attributes.position.x,
                    y: cellView.model.attributes.position.y,
                    width: 30,
                    height: 30
                };

                if (Util.isLineCrossRect(trackPosition, portRange)) {
                    teamInfo = this._connectElementPort(cellView);
                }
            }
        } else if (cellView.model.attributes.type == 'tct.Axle' ||
            cellView.model.attributes.type == 'tct.Signal') {
            if (cellView.model.attributes.drawData.nodeParent) {
                return teamInfo;
            }
            let trackPosition = this.getTrackRealPosition();
            if (trackPosition.y1 == trackPosition.y2) {
                let cellPort = cellView.getPortCanUse();
                if (cellPort) {
                    if (cellPort.y == trackPosition.y1 && cellPort.x >= trackPosition.x1 && cellPort.x <= trackPosition.x2) {
                        teamInfo = this._connectElementPort(cellView);
                    } else if (cellPort.upY == trackPosition.y1 && cellPort.upX >= trackPosition.x1 && cellPort.upX <= trackPosition.x2) {
                        teamInfo = this._connectElementPort(cellView);
                    }
                }
            } else {
                let portRange = {
                    x: cellView.model.attributes.position.x,
                    y: cellView.model.attributes.position.y,
                    width: 30,
                    height: 30
                };

                if (Util.isLineCrossRect(trackPosition, portRange)) {
                    teamInfo = this._connectElementPort(cellView);
                }
            }
        } else if (cellView.model.attributes.type == 'tct.Station') {
            let stationPorts = cellView.getPortCanUse();
            if (!stationPorts) {
                return teamInfo;
            }
            let trackPosition = this.getTrackRealPosition();
            if (trackPosition.y1 == trackPosition.y2) {
                if (stationPorts.portUp) {
                    if (trackPosition.x1 <= stationPorts.portUp.x
                        && trackPosition.x2 >= stationPorts.portUp.x
                        && trackPosition.y1 >= stationPorts.portUp.y1
                        && trackPosition.y1 <= stationPorts.portUp.y2) {
                        teamInfo = this._connectStationPort(cellView, "portUp");
                    }
                }
                if (stationPorts.portDown) {
                    if (trackPosition.x1 <= stationPorts.portDown.x
                        && trackPosition.x2 >= stationPorts.portDown.x
                        && trackPosition.y1 >= stationPorts.portDown.y1
                        && trackPosition.y1 <= stationPorts.portDown.y2) {
                        teamInfo = this._connectStationPort(cellView, "portDown");
                    }
                }
            }
        }

        return teamInfo;
    },
    /**
     * 连接车挡端口
     * @param {*} bumperView 待连接的bumperView,Team信息以bumperView为主
     * @param {string} portNum 轨道端口号: portOne | portTwo
     */
    _connectBumperPort(bumperView, portNum) {
        bumperView.model.attributes.drawData.nodeNext = { id: this.model.attributes.id, type: this.model.attributes.type, port: portNum };
        if (portNum == 'portOne') {
            this.model.attributes.drawData.nodeOne = { id: bumperView.model.attributes.id, type: bumperView.model.attributes.type, port: 'nodeNext' };
        } else if (portNum == 'portTwo') {
            this.model.attributes.drawData.nodeTwo = { id: bumperView.model.attributes.id, type: bumperView.model.attributes.type, port: 'nodeNext' };
        }

        // 统一设置teamId，并返回teamId信息
        let bumperTeamId = bumperView.model.attributes.drawData.teamId;
        let thisTeamId = this.model.attributes.drawData.teamId;
        let teamInfo = {
            from: this,
            to: bumperView,
            stop: false  // 后续是否停止
        };
        if (!bumperTeamId && !thisTeamId) {
            teamInfo.teamId = Util.getUUID();
            teamInfo.addIds = [this.model.attributes.id, bumperView.model.attributes.id];
            if (this.model.attributes.elements) {
                this.model.attributes.elements.forEach(e => {
                    teamInfo.addIds.push(e.id);
                });
            }
            if (this.model.attributes.stations) {
                this.model.attributes.stations.forEach(s => {
                    teamInfo.addIds.push(s.id);
                });
            }
        } else if (thisTeamId) {
            teamInfo.teamId = thisTeamId;
            teamInfo.addIds = [bumperView.model.attributes.id];
        }
        this.model.attributes.drawData.teamId = teamInfo.teamId;
        bumperView.model.attributes.drawData.teamId = teamInfo.teamId;
        bumperView.updatePort();
        this.updatePort();
        return teamInfo;
    },
    /**
    * 连接连接线端口
    * @param {*} trackView 待连接的trackView,Team信息以trackView为主
    */
    _connectTrackPort(trackView, portNum, tarPortNum) {
        if (tarPortNum == "portOne") {
            trackView.model.attributes.drawData.nodeOne = { id: this.model.attributes.id, type: this.model.attributes.type, port: portNum };
        } else if (tarPortNum == "portTwo") {
            trackView.model.attributes.drawData.nodeTwo = { id: this.model.attributes.id, type: this.model.attributes.type, port: portNum };
        }

        if (portNum == 'portOne') {
            this.model.attributes.drawData.nodeOne = { id: trackView.model.attributes.id, type: trackView.model.attributes.type, port: tarPortNum };
        } else if (portNum == 'portTwo') {
            this.model.attributes.drawData.nodeTwo = { id: trackView.model.attributes.id, type: trackView.model.attributes.type, port: tarPortNum };
        }

        // 统一设置teamId，并返回teamId信息
        let trackTeamId = trackView.model.attributes.drawData.teamId;
        let thisTeamId = this.model.attributes.drawData.teamId;
        let teamInfo = {
            from: this,
            to: trackView,
            stop: false  // 后续是否停止
        };
        if (!trackTeamId && !thisTeamId) {
            teamInfo.teamId = Util.getUUID();
            teamInfo.addIds = [this.model.attributes.id, trackView.model.attributes.id];
            if (this.model.attributes.elements) {
                this.model.attributes.elements.forEach(e => {
                    teamInfo.addIds.push(e.id);
                });
            }
            if (this.model.attributes.stations) {
                this.model.attributes.stations.forEach(s => {
                    teamInfo.addIds.push(s.id);
                });
            }
            if (trackView.model.attributes.elements) {
                trackView.model.attributes.elements.forEach(e => {
                    teamInfo.addIds.push(e.id);
                });
            }
            if (trackView.model.attributes.stations) {
                trackView.model.attributes.stations.forEach(s => {
                    teamInfo.addIds.push(s.id);
                });
            }
        } else if (trackTeamId) {
            teamInfo.teamId = trackTeamId;
            teamInfo.oldTeamId = thisTeamId;
            teamInfo.addIds = [this.model.attributes.id];
            if (this.model.attributes.elements) {
                this.model.attributes.elements.forEach(e => {
                    teamInfo.addIds.push(e.id);
                });
            }
            if (this.model.attributes.stations) {
                this.model.attributes.stations.forEach(s => {
                    teamInfo.addIds.push(s.id);
                });
            }
        } else if (thisTeamId) {
            teamInfo.teamId = thisTeamId;
            teamInfo.addIds = [trackView.model.attributes.id];
            if (trackView.model.attributes.elements) {
                trackView.model.attributes.elements.forEach(e => {
                    teamInfo.addIds.push(e.id);
                });
            }
            if (trackView.model.attributes.stations) {
                trackView.model.attributes.stations.forEach(s => {
                    teamInfo.addIds.push(s.id);
                });
            }
        }
        this.model.attributes.drawData.teamId = teamInfo.teamId;
        trackView.model.attributes.drawData.teamId = teamInfo.teamId;
        trackView.updatePort();
        this.updatePort();
        return teamInfo;
    },
    /**
   * 连接道岔端口
   * @param {*} pointView 待连接的pointView,Team信息以trackView为主
   */
    _connectPointPort(pointView, portNum, tarPortNum) {
        if (tarPortNum == "portLeft") {
            pointView.model.attributes.drawData.nodeLeft = { id: this.model.attributes.id, type: this.model.attributes.type, port: portNum };
        } else if (tarPortNum == "portMiddle") {
            pointView.model.attributes.drawData.nodeMiddle = { id: this.model.attributes.id, type: this.model.attributes.type, port: portNum };
        } else if (tarPortNum == "portRight") {
            pointView.model.attributes.drawData.nodeRight = { id: this.model.attributes.id, type: this.model.attributes.type, port: portNum };
        }

        if (portNum == 'portOne') {
            this.model.attributes.drawData.nodeOne = { id: pointView.model.attributes.id, type: pointView.model.attributes.type, port: tarPortNum };
        } else if (portNum == 'portTwo') {
            this.model.attributes.drawData.nodeTwo = { id: pointView.model.attributes.id, type: pointView.model.attributes.type, port: tarPortNum };
        }

        // 统一设置teamId，并返回teamId信息
        let pointTeamId = pointView.model.attributes.drawData.teamId;
        let thisTeamId = this.model.attributes.drawData.teamId;
        let teamInfo = {
            from: this,
            to: pointView,
            stop: false  // 后续是否停止
        };
        if (!pointTeamId && !thisTeamId) {
            teamInfo.teamId = Util.getUUID();
            teamInfo.addIds = [this.model.attributes.id, pointView.model.attributes.id];
            if (this.model.attributes.elements) {
                this.model.attributes.elements.forEach(e => {
                    teamInfo.addIds.push(e.id);
                });
            }
            if (this.model.attributes.stations) {
                this.model.attributes.stations.forEach(s => {
                    teamInfo.addIds.push(s.id);
                });
            }
        } else if (pointTeamId) {
            teamInfo.teamId = pointTeamId;
            teamInfo.oldTeamId = thisTeamId;
            teamInfo.addIds = [this.model.attributes.id];
            if (this.model.attributes.elements) {
                this.model.attributes.elements.forEach(e => {
                    teamInfo.addIds.push(e.id);
                });
            }
            if (this.model.attributes.stations) {
                this.model.attributes.stations.forEach(s => {
                    teamInfo.addIds.push(s.id);
                });
            }
        } else if (thisTeamId) {
            teamInfo.teamId = thisTeamId;
            teamInfo.addIds = [pointView.model.attributes.id];
        }
        this.model.attributes.drawData.teamId = teamInfo.teamId;
        pointView.model.attributes.drawData.teamId = teamInfo.teamId;
        pointView.updatePort();
        this.updatePort();
        return teamInfo;
    },
    /**
    * 连接挂载元素端口
    * @param {*} cellView 待连接的cellView,Team信息以trackView为主
    */
    _connectElementPort(cellView) {
        if (!this.model.attributes.drawData.elements) {
            this.model.attributes.drawData.elements = [];
        }
        this.model.attributes.drawData.elements.push({
            type: cellView.model.attributes.type,
            id: cellView.model.attributes.id
        });
        cellView.model.attributes.drawData.nodeParent = {
            id: this.model.attributes.id,
            type: this.model.attributes.type,
            port: "elements",
        };

        // 统一设置teamId，并返回teamId信息
        let cellTeamId = cellView.model.attributes.drawData.teamId;
        let thisTeamId = this.model.attributes.drawData.teamId;
        let teamInfo = {
            from: this,
            to: cellView,
            stop: true  // 后续是否停止
        };
        if (!cellTeamId && !thisTeamId) {
            teamInfo.teamId = Util.getUUID();
            teamInfo.addIds = [this.model.attributes.id, cellView.model.attributes.id];
            if (this.model.attributes.elements) {
                this.model.attributes.elements.forEach(e => {
                    teamInfo.addIds.push(e.id);
                });
            }
            if (this.model.attributes.stations) {
                this.model.attributes.stations.forEach(s => {
                    teamInfo.addIds.push(s.id);
                });
            }
        } else if (thisTeamId) {
            teamInfo.teamId = thisTeamId;
            teamInfo.addIds = [cellView.model.attributes.id];
        }
        this.model.attributes.drawData.teamId = teamInfo.teamId;
        cellView.model.attributes.drawData.teamId = teamInfo.teamId;
        cellView.updatePort();
        this.updatePort();
        return teamInfo;
    },
    /**
     * 连接车站端口
     * @param {*} cellView 待连接的cellView,Team信息以trackView为主
     */
    _connectStationPort(cellView, tarPortNum) {
        if (!this.model.attributes.drawData.stations) {
            this.model.attributes.drawData.stations = [];
        }
        this.model.attributes.drawData.stations.push({
            type: cellView.model.attributes.type,
            id: cellView.model.attributes.id,
            port: tarPortNum
        });

        if (tarPortNum == 'portUp') {
            cellView.model.attributes.drawData.nodeUp = { id: this.model.attributes.id, type: this.model.attributes.type };
        } else if (tarPortNum == 'portDown') {
            cellView.model.attributes.drawData.nodeDown = { id: this.model.attributes.id, type: this.model.attributes.type };
        }

        // 统一设置teamId，并返回teamId信息
        let cellTeamId = cellView.model.attributes.drawData.teamId;
        let thisTeamId = this.model.attributes.drawData.teamId;
        let teamInfo = {
            from: this,
            to: cellView,
            stop: false  // 后续是否停止
        };
        if (!cellTeamId && !thisTeamId) {
            teamInfo.teamId = Util.getUUID();
            teamInfo.addIds = [this.model.attributes.id, cellView.model.attributes.id];
            if (this.model.attributes.elements) {
                this.model.attributes.elements.forEach(e => {
                    teamInfo.addIds.push(e.id);
                });
            }
            if (this.model.attributes.stations) {
                this.model.attributes.stations.forEach(s => {
                    teamInfo.addIds.push(s.id);
                });
            }
        } else if (thisTeamId) {
            teamInfo.teamId = thisTeamId;
            teamInfo.oldTeamId = cellTeamId;
            teamInfo.addIds = [cellView.model.attributes.id];
        } else if (cellTeamId) {
            teamInfo.teamId = cellTeamId;
            teamInfo.addIds = [this.model.attributes.id];
            if (this.model.attributes.elements) {
                this.model.attributes.elements.forEach(e => {
                    teamInfo.addIds.push(e.id);
                });
            }
            if (this.model.attributes.stations) {
                this.model.attributes.stations.forEach(s => {
                    teamInfo.addIds.push(s.id);
                });
            }
        }
        this.model.attributes.drawData.teamId = teamInfo.teamId;
        cellView.model.attributes.drawData.teamId = teamInfo.teamId;
        cellView.updatePort();
        this.updatePort();
        return teamInfo;
    },
    /**
     * 获取右键菜单
     */
    getMenus() {
        if (this.model.attributes.drawData.stationComponentId) {
            return ["更换站型", "删除车站"];
        }
        let menus = [
            '拆解',
            '复制',
            '删除'
        ];
        return menus;
    },
    /**
     * 释放端口
     * @param {*} node 
     */
    freePort(node) {
        let data = { relatedNodes: [], removeTeamId: null };
        let drawData = this.model.attributes.drawData;
        if (node) {
            if (this.model.attributes.id == node.id) {
                if (node.port == 'portOne') {
                    data.relatedNodes = [this.model.attributes.drawData.nodeOne];
                    this.model.attributes.drawData.nodeOne = null;
                } else if (node.port == 'portTwo') {
                    data.relatedNodes = [this.model.attributes.drawData.nodeTwo];
                    this.model.attributes.drawData.nodeTwo = null;
                } else if (node.port == 'elements') {
                    data.relatedNodes = [node.eId];
                    if (this.model.attributes.drawData.elements) {
                        let element = this.model.attributes.drawData.elements.find(e => {
                            return e.id == node.eId;
                        });
                        if (element) {
                            this.model.attributes.drawData.elements.splice(this.model.attributes.drawData.elements.indexOf(element), 1);
                        }
                    }
                } else if (node.port == 'stations') {
                    data.relatedNodes = [node.eId];
                    if (this.model.attributes.drawData.stations) {
                        let station = this.model.attributes.drawData.stations.find(s => {
                            return s.id == node.eId;
                        });
                        if (station) {
                            this.model.attributes.drawData.stations.splice(this.model.attributes.drawData.stations.indexOf(station), 1);
                        }
                    }
                }
            }
        } else {
            if (this.model.attributes.drawData.nodeOne) {
                data.relatedNodes.push(this.model.attributes.drawData.nodeOne);
                this.model.attributes.drawData.nodeOne = null;
            }
            if (this.model.attributes.drawData.nodeTwo) {
                data.relatedNodes.push(this.model.attributes.drawData.nodeTwo);
                this.model.attributes.drawData.nodeTwo = null;
            }
            if (this.model.attributes.drawData.elements) {
                this.model.attributes.drawData.elements.forEach(e => {
                    let eData = {
                        id: e.id,
                        type: e.type,
                        port: e.port
                    }
                    data.relatedNodes.push(eData);
                });
                this.model.attributes.drawData.elements = null;
            }
            if (this.model.attributes.drawData.stations) {
                this.model.attributes.drawData.stations.forEach(s => {
                    let sData = {
                        id: s.id,
                        type: s.type,
                        port: s.port
                    }
                    data.relatedNodes.push(sData);
                });
                this.model.attributes.drawData.stations = null;
            }
        }
        if (!drawData.nodeOne && !drawData.nodeTwo
            && (!this.model.attributes.drawData.stations || this.model.attributes.drawData.stations.length == 0)
            && (!this.model.attributes.drawData.elements || this.model.attributes.drawData.elements.length == 0)) {
            data.removeTeamId = this.model.attributes.drawData.teamId;
            this.model.attributes.drawData.teamId = null;
        }

        this.updatePort();
        return data;
    },
    action(menu) {
        if (menu == '拆解') {
            this.updatePort();
        } else if (menu == '删除') {
            this.updatePort();
            this.model.remove();
        }
    },
    getRect() {
        return {
            x: this.model.attributes.position.x + Math.min(this.model.attr("line/x1"), this.model.attr("line/x2")),
            y: this.model.attributes.position.y + Math.min(this.model.attr("line/y1"), this.model.attr("line/y2")),
            width: Math.abs(this.model.attr("line/x1") - this.model.attr("line/x2")),
            height: Math.abs(this.model.attr("line/y1") - this.model.attr("line/y2"))
        }
    }
},
    {
    },

);

export default Track;