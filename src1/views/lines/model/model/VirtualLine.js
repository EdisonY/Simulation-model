
import * as Util from "@/utils/util";
import * as joint from "jointjs";
import BaseData from '../BaseData';

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let VirtualLine = joint.dia.Element.define('tct.VirtualLine', {
    attrs: {
        line: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 150,
            "stroke-width": 6,
            "stroke-dasharray": "10 1",
            stroke: "#E42",
        }
    },
    markup: [{
        tagName: 'line',
        selector: 'line',
    }],
    tctData: {
        typeName: "虚拟连线",
        tctId: BaseData.DefaultTctId
    },
    drawData: {
        teamId: null,
        nodeOne: null, // {tctId,type,portType}
        nodeTwo: null
    }
}, {
});

joint.shapes.tct.VirtualLineView = joint.dia.ElementView.extend({
    init() {
        console.log("--- VirtualLine init ---");

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
    },
    render() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.updatePort();
    },
    updateLayout() { },
    /**
     * 选中
     */
    select() { // 每个自定义图元要实现select和unselect方法
        this._setOutlineRectVisibility(true);
    },
    /**
     * 取消选中
     */
    unselect() { // 每个自定义图元要实现select和unselect方法
        // this.unhighlight();
        this._setOutlineRectVisibility(false);
    },
    _setOutlineRectVisibility(visible) {
        if (visible) {
            this.model.attr("line/stroke", BaseData.Colors.Selected);
        } else {
            this.model.attr("line/stroke", "#E42");
            if (this.VSelect) {
                this.VSelect.remove();
                this.VSelect = null;
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

        this.model.attributes.tctData.isSideLine = this.model.attr("line/y1") != this.model.attr("line/y2");
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

        if (!trackPorts || cellView.model.attributes.type != 'tct.Track') {
            return teamInfo;
        }

        let cLine = cellView.getTrackRealPosition();

        if (cLine.y1 != cLine.y2) {
            return teamInfo;
        }

        let minX = Math.min(cLine.x1, cLine.x2);
        let maxX = Math.max(cLine.x1, cLine.x2);

        if (trackPorts.portOne && trackPorts.portOne.y == cLine.y1) {
            if (trackPorts.portOne.x >= minX && trackPorts.portOne.x <= maxX) {
                teamInfo = this._connectPort(cellView, "portOne");
            }
        }

        if (trackPorts.portTwo && trackPorts.portTwo.y == cLine.y1) {
            if (trackPorts.portTwo.x >= minX && trackPorts.portTwo.x <= maxX) {
                teamInfo = this._connectPort(cellView, "portTwo");
            }
        }
        if (this.model.attributes.drawData.nodeOne && this.model.attributes.drawData.nodeTwo) {
            this.model.remove();
        }
        return teamInfo;
    },

    /**
    * 连接连接线端口
    * @param {*} trackView 待连接的trackView,Team信息以trackView为主
    */
    _connectPort(trackView, portNum) {
        if (portNum == "portOne") {
            this.model.attributes.drawData.nodeOne = { id: trackView.model.attributes.id, type: trackView.model.attributes.type };
        } else if (portNum == "portTwo") {
            this.model.attributes.drawData.nodeTwo = { id: trackView.model.attributes.id, type: trackView.model.attributes.type };
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
        } else if (trackTeamId) {
            teamInfo.teamId = trackTeamId;
            teamInfo.oldTeamId = thisTeamId;
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
     * 获取右键菜单
     */
    getMenus() {
        let menus = [
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

export default VirtualLine;