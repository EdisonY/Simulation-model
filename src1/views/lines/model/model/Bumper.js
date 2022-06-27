import * as joint from "jointjs";
import * as Util from "@/utils/util";
import BaseData from '../BaseData';

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let Bumper = joint.dia.Element.define('tct.Bumper', {
    attrs: {
        left: {
            fill: 'transparent',
            d: 'M -20 -10 H 5 Q 15 0 5 10 L -20 10',
            stroke: BaseData.Colors.Bumper,
            'stroke-width': 5
        },
        right: {
            stroke: BaseData.Colors.BumperLine,
            x1: 10,
            y1: 0,
            x2: 30,
            y2: 0,
            'stroke-width': 5
        },
        labelKm: {
            "font-size": 11,
            text: "K",
            fill: "#ccc",
            x: -15,
            y: -20
        }
    },
    markup: [
        {
            tagName: 'path',
            selector: 'left'
        }, {
            tagName: 'line',
            selector: 'right'
        }, {
            tagName: 'text',
            selector: 'labelKm'
        },
    ],
    tctData: {
        typeName: "车挡",
        tctId: BaseData.DefaultTctId,
        km: 0
    },
    drawData: {
        teamId: null,
        nodeNext: null
    }
}, {
});

joint.shapes.tct.BumperView = joint.dia.ElementView.extend({
    init() {
        this.VSelect = null;
        this.VPort = null;
        this.updateLayout();
    },
    render() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.updatePort();
    },
    /**
     * 更新布局外观
     */
    updateLayout() {
        this.getKmStr();
        this.updatePort();
    },
    getKmStr() {
        let km = Number(this.model.attributes.tctData.km);
        if (!(km > 0)) {
            this.model.attributes.tctData.km = 0;
            km = 0;
        }
        km = parseInt(km);

        let str = `K${parseInt(km / 1000)}+${km % 1000}`;
        this.model.attr('labelKm/text', str);
    },

    /**
     * 选中
     */
    select(rect) {
        this._setOutlineRectVisibility(true, rect);
    },
    /**
     * 取消选中
     */
    unselect() {
        this._setOutlineRectVisibility(false);
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
    _setOutlineRectVisibility(visible, rect) {
        if (visible) {
            if (!this.VSelect) {
                this.VSelect = V("rect");
            }

            if (rect) {
                let r = this.getRect();
                this.VSelect.attr({
                    x: rect.x - r.x,
                    y: rect.y - r.y,
                    width: rect.width,
                    height: rect.height,
                    fill: "#222",
                    "fill-opacity": 0.3,
                    "stroke-width": 2,
                    stroke: BaseData.Colors.Selected
                });
            } else {
                this.VSelect.attr({
                    width: 60,
                    height: 60,
                    x: -30,
                    y: -30,
                    "fill-opacity": 0,
                    "stroke-width": 2,
                    stroke: BaseData.Colors.Selected
                });
            }
            this.vel.append([this.VSelect]);

        } else {
            if (this.VSelect) {
                this.VSelect.remove();
                this.VSelect = null;
            }
        }
    },
    /**
     * 更新端口
     */
    updatePort() {
        if (!this.getPortCanUse()) {
            if (this.VPort) {
                this.VPort.remove();
                this.VPort = null;
            }
        } else { // 不满连接条件，画出连接端口
            if (!this.VPort) {
                this.VPort = V("rect");
            }

            this.VPort.attr({
                x: 27,
                y: -3,
                width: 6,
                height: 6,
                stroke: "red",
                // "stroke-dasharray": "2, 2",
                "fill": '#EEE',
                "stroke-width": 3,
            });
            this.vel.append([this.VPort]);
        }
    },
    /**
     * 获取可用端口
     */
    getPortCanUse() {
        let model = this.model.attributes;
        if (model.drawData.nodeNext) {
            return null;
        }

        let port = {};
        // 以下根据旋转角度，计算出连接线端口范围区间
        model.angle = model.angle % 360;
        if (model.angle == 0) {
            port.x = model.position.x + 30;
            port.y = model.position.y;
        } else if (model.angle == 90) {
            port.x = model.position.x;
            port.y = model.position.y + 30;
        } else if (model.angle == 180) {
            port.x = model.position.x - 30;
            port.y = model.position.y;
        } else if (model.angle == 270) {
            port.x = model.position.x;
            port.y = model.position.y - 30;
        }
        return port;
    },
    /**
  * 将当前计轴连接到轨道线
  * @param {*} trackView 轨道线
  */
    combine(trackView) {
        let teamInfo = {};

        let bumperPort = this.getPortCanUse();
        if (!bumperPort) {
            return teamInfo;
        }

        if (trackView.model.attributes.type != 'tct.Track') {
            return teamInfo;
        }

        let trackPorts = trackView.getPortCanUse();
        if (!trackPorts) {
            return teamInfo;
        }

        if (trackPorts.portOne && trackPorts.portOne.x == bumperPort.x && trackPorts.portOne.y == bumperPort.y) {
            teamInfo = this._connectTrackPort(trackView, "portOne");
        } else if (trackPorts.portTwo && trackPorts.portTwo.x == bumperPort.x && trackPorts.portTwo.y == bumperPort.y) {
            teamInfo = this._connectTrackPort(trackView, "portTwo");
        }

        return teamInfo;
    },
    /**
     * 连接端口
     * @param {*} trackView 待连接的trackView,Team信息以trackView为主
     */
    _connectTrackPort(trackView, portNum) {
        if (portNum == "portOne") {
            trackView.model.attributes.drawData.nodeOne = { id: this.model.attributes.id, type: this.model.attributes.type, port: 'nodeNext' };
        } else if (portNum == "portTwo") {
            trackView.model.attributes.drawData.nodeTwo = { id: this.model.attributes.id, type: this.model.attributes.type, port: 'nodeNext' };
        }
        this.model.attributes.drawData.nodeNext = { id: trackView.model.attributes.id, type: trackView.model.attributes.type, port: portNum };


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
        if (this.model.attributes.drawData.stationComponentId) {
            return ["更换站型", "删除车站"];
        }
        let menus = [
            '旋转',
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
        if (this.model.attributes.drawData.nodeNext) {
            data.relatedNodes = [this.model.attributes.drawData.nodeNext];
            data.removeTeamId = this.model.attributes.drawData.teamId;
            this.model.attributes.drawData.nodeNext = null;
            this.model.attributes.drawData.teamId = null;
            this.updatePort();
        }
        return data;
    },
    action(menu) {
        if (menu == '旋转') {
            this.model.rotate(180);
            let p = Util.alignPointToGrid(this.model.attributes.position, 30);
            this.model.position(p.x, p.y);
        } else if (menu == '拆解') {
        } else if (menu == '删除') {
            this.model.remove();
        }
    },
    /**
     * 获取公里标
     */
    getKm() {
        return {
            km: this.model.attributes.tctData.km,
            kmOffset: this.model.attributes.tctData.kmOffset,
            kmCm: this.model.attributes.tctData.km * 100000 + this.model.attributes.tctData.kmOffset * 100,
        };
    },
    getPosition() {
        if (this.model.attributes.angle == 0) {
            return {
                x: this.model.attributes.position.x + 30,
                y: this.model.attributes.position.y,
            }
        } else if (this.model.attributes.angle == 180) {
            return {
                x: this.model.attributes.position.x - 30,
                y: this.model.attributes.position.y,
            }
        }
    },
    getRect() {
        return {
            x: this.model.attributes.position.x - 30,
            y: this.model.attributes.position.y - 30,
            width: 60,
            height: 60,
        }
    }
});


export default Bumper;