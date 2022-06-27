import * as Util from "@/utils/util";
import * as joint from "jointjs";
import BaseData from "../BaseData";
import DSUDefine from '../DSUDefine';

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let Axle = joint.dia.Element.define('tct.Axle', {
    attrs: {
        background: {
            x: 0,
            y: 0,
            width: 30,
            height: 30,
            'fill-opacity': 0
        },
        mainLine: {
            x1: 4,
            y1: 15,
            x2: 26,
            y2: 15,
            stroke: BaseData.Colors.Track,
            'stroke-width': 2
        },
        c1: {
            cx: 11,
            cy: 15,
            r: 3,
            fill: BaseData.Colors.Track
        },
        c2: {
            cx: 19,
            cy: 15,
            r: 3,
            fill: BaseData.Colors.Track
        },
        label: {
            "font-size": 11,
            text: "JZ",
            fill: "pink",
            x: 0,
            y: 0
        },
        labelKm: {
            "font-size": 11,
            text: "k",
            fill: "#ccc",
            x: 0,
            y: -15
        }
    },
    markup: [{
        tagName: 'rect',
        selector: 'background'
    }, {
        tagName: 'line',
        selector: 'mainLine'
    }, {
        tagName: 'circle',
        selector: 'c1'
    }, {
        tagName: 'circle',
        selector: 'c2'
    }, {
        tagName: 'text',
        selector: 'label'
    }, {
        tagName: 'text',
        selector: 'labelKm'
    }],
    tctData: {
        typeName: "计轴",
        tctId: BaseData.DefaultTctId,
        type: DSUDefine.AxleType.PUTONG,
        // direction: BaseData.SignalDirection.Up,
        km: 0
    },
    drawData: {
        teamId: null,
        nodeParent: null
    }
}, {
});


joint.shapes.tct.AxleView = joint.dia.ElementView.extend({
    init() {
        this.updateLayout();
    },

    render() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.updatePort();
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

    _setOutlineRectVisibility(visible, rect) {
        if (visible) {
            const model = this.model;
            if (!this.VRect) {
                this.VRect = V("rect");
            }

            if (rect) {
                this.VRect.attr({
                    x: rect.x - this.model.attributes.position.x,
                    y: rect.y - this.model.attributes.position.y,
                    width: rect.width,
                    height: rect.height,
                    fill: "#222",
                    "fill-opacity": 0.3,
                    "stroke-width": 2,
                    stroke: BaseData.Colors.Selected
                });
            } else {
                this.VRect.attr({
                    width: 30,
                    height: 30,
                    "fill-opacity": 0,
                    "stroke-width": 2,
                    stroke: BaseData.Colors.Selected
                });
            }
            this.vel.append([this.VRect]);

        } else {
            if (this.VRect) {
                this.VRect.remove();
                this.VRect = null;
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
            if (this.VPortUp) {
                this.VPortUp.remove();
                this.VPortUp = null;
            }
        } else { // 不满连接条件，画出连接端口
            if (!this.VPort) {
                this.VPort = V("rect");
            }

            this.VPort.attr({
                x: 13,
                y: 28,
                width: 4,
                height: 4,
                stroke: "red",
                "fill": 'red',
            });

            if (!this.VPortUp) {
                this.VPortUp = V("rect");
            }
            this.VPortUp.attr({
                x: 13,
                y: -2,
                width: 4,
                height: 4,
                fill: "red",
                stroke: "red"
            });
            this.vel.append([this.VPort, this.VPortUp]);
        }
    },
    /**
     * 更新布局外观
     */
    updateLayout() {
        let current = this.model.attributes;
        this.model.attr('label/text', 'JZ' + current.tctData.tctId);
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
     * 获取可用端口
     */
    getPortCanUse() {
        let port = null;
        let model = this.model.attributes;

        if (!model.drawData.nodeParent) {
            port = {
                x: model.position.x + 15,
                y: model.position.y + 30,
                upX: model.position.x + 15,
                upY: model.position.y,
            }
        }

        return port;
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
     * 将当前计轴连接到轨道线
     * @param {*} trackView 轨道线
     */
    combine(trackView) {
        let teamInfo = {};

        let axlePort = this.getPortCanUse();
        if (!axlePort) {
            return teamInfo;
        }

        if (trackView.model.attributes.type != 'tct.Track') {
            return teamInfo;
        }

        let trackPosition = trackView.getTrackRealPosition();

        if (trackPosition.y1 == trackPosition.y2) {
            if (axlePort.y == trackPosition.y1 && axlePort.x >= trackPosition.x1 && axlePort.x <= trackPosition.x2) {
                teamInfo = this._connectPort(trackView);
            } else if (axlePort.upY == trackPosition.y1 && axlePort.upX >= trackPosition.x1 && axlePort.upX <= trackPosition.x2) {
                teamInfo = this._connectPort(trackView);
            }
        } else {
            let portRange = {
                x: this.model.attributes.position.x,
                y: this.model.attributes.position.y,
                width: 30,
                height: 30
            };

            if (Util.isLineCrossRect(trackPosition, portRange)) {
                teamInfo = this._connectPort(trackView);
                console.log(trackPosition)
                console.log(portRange)
            }
        }

        return teamInfo;
    },
    /**
     * 连接端口
     * @param {*} trackView 待连接的trackView,Team信息以trackView为主
     */
    _connectPort(trackView) {
        if (!trackView.model.attributes.drawData.elements) {
            trackView.model.attributes.drawData.elements = [];
        }
        trackView.model.attributes.drawData.elements.push({
            type: this.model.attributes.type,
            id: this.model.attributes.id
        });
        this.model.attributes.drawData.nodeParent = {
            id: trackView.model.attributes.id,
            type: trackView.model.attributes.type,
            port: "elements",
            eId: this.model.attributes.id
        };

        // 统一设置teamId，并返回teamId信息
        let lineTeamId = trackView.model.attributes.drawData.teamId;
        let thisTeamId = this.model.attributes.drawData.teamId;
        let teamInfo = {
            from: this,
            to: trackView,
            stop: true  // 后续是否停止
        };
        if (!lineTeamId && !thisTeamId) {
            teamInfo.teamId = Util.getUUID();
            teamInfo.addIds = [this.model.attributes.id, trackView.model.attributes.id];
        } else if (lineTeamId) {
            teamInfo.teamId = lineTeamId;
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
            '拆解',
            '复制',
            '删除'
        ];
        return menus;
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
    /**
     * 释放端口
     * @param {*} node 
     */
    freePort(node) {
        let data = { relatedNodes: [], removeTeamId: null };
        if (this.model.attributes.drawData.nodeParent) {
            data.relatedNodes = [this.model.attributes.drawData.nodeParent];
            data.removeTeamId = this.model.attributes.drawData.teamId;
            this.model.attributes.drawData.nodeParent = null;
            this.model.attributes.drawData.teamId = null;
            this.updatePort();
        }
        return data;
    },
    action(menu) {
        if (menu == '拆解') {
        } else if (menu == '删除') {
            this.model.remove();
        }
    },
    getPosition() {
        return {
            x: this.model.attributes.position.x + 15,
            y: this.model.attributes.position.y + 30
        }
    },
    getRect() {
        return {
            x: this.model.attributes.position.x,
            y: this.model.attributes.position.y,
            width: this.model.attr("background/width"),
            height: this.model.attr("background/height"),
        }
    }
});

export default Axle;