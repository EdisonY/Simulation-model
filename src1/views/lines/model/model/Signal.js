import * as joint from "jointjs";
import * as Util from "@/utils/util";
import BaseData from "../BaseData";

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let Signal = joint.dia.Element.define('tct.Signal', {
    attrs: {
        background: {
            width: 30,
            height: 30,
            'fill-opacity': 0
        },
        mainLine: {
            fill: 'transparent',
            d: '',
            stroke: BaseData.Colors.Track,
            'stroke-width': 2,
            opacity: 1.0
        },
        c1: {
            fill: 'transparent',
            d: '',
            'stroke-width': 2,
            opacity: 1.0
        },
        c2: {
            fill: 'transparent',
            d: '',
            'stroke-width': 2,
            opacity: 1.0
        },
        c3: {
            fill: 'transparent',
            d: '',
            'stroke-width': 2,
            opacity: 1.0
        },
        label: {
            "font-size": 11,
            text: "XHJ",
            fill: "pink",
            x: 0,
            y: 0
        }
    },
    markup: [{
        tagName: 'rect',
        selector: 'background'
    }, {
        tagName: 'path',
        selector: 'mainLine'
    }, {
        tagName: 'path',
        selector: 'c1'
    }, {
        tagName: 'path',
        selector: 'c2'
    }, {
        tagName: 'path',
        selector: 'c3'
    }, {
        tagName: 'text',
        selector: 'label'
    }],
    // 对象属性，自定义数据结构
    tctData: {
        typeName: "信号机",
        name: 'SC',
        prop: 1,
        tctId: BaseData.DefaultTctId,
        km: 0,
        open: 0x55,
        signalDirection: BaseData.SignalDirection.Up,
        signalType: BaseData.SignalType.TWO_SHORT
    },
    drawData: {
        teamId: null,
        nodeParent: null
    }
}, {
});


joint.shapes.tct.SignalView = joint.dia.ElementView.extend({
    passivePointDown: { x: 0, y: 0 },
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
                let r = this.getRect();
                this.VRect.attr({
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
     * 更新端口状态
     */
    updatePort() {
        let model = this.model;
        if (model.attributes.drawData.nodeParent) {
            if (this.VPort) {
                this.VPort.remove();
                this.VPort = null;
            }
            if (this.VPortUp) {
                this.VPortUp.remove();
                this.VPortUp = null;
            }
        } else {
            if (!this.VPort) {
                this.VPort = V("rect");
            }
            this.VPort.attr({
                x: 13,
                y: 28,
                width: 4,
                height: 4,
                fill: "red",
                stroke: "red"
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
        if (!current.tctData.name) {
            current.tctData.name = 'SC';
        }
        if (!current.tctData.prop) {
            current.tctData.prop = 1;
        }
        if (!current.tctData.open) {
            current.tctData.prop = 0x55;
        }
        // if(current.tctData.signalDirection == 0xaa){
        //     current.tctData.signalDirection = 0x55
        // }else{
        //     current.tctData.signalDirection = 0xaa
        // }

        this.model.attr('out/stroke-opacity', 1);
        let lineY1 = 6, lineY2 = 22, lineX = 6;
        if (current.tctData.signalType == BaseData.SignalType.TWO_SHORT) {
            this.model.attr('c1/d', "M 15 15 A 4,4 0 1 1 15,14 z");
            this.model.attr('c2/d', "M 23 15 A 4,4 0 1 1 23,14 z");
            this.model.attr('c3/d', "");
        } else if (current.tctData.signalType == BaseData.SignalType.TWO_TALL) {
            this.model.attr('c1/d', "M 15 10 A 4,4 0 1 1 15,9 z");
            this.model.attr('c2/d', "M 23 10 A 4,4 0 1 1 23,9 z");
            this.model.attr('c3/d', "");
            lineY1 = 4;
            lineY2 = 25;
        } else if (current.tctData.signalType == BaseData.SignalType.THREE_SHORT) {
            this.model.attr('c1/d', "M 10 15 A 4,4 0 1 1 10,14 z");
            this.model.attr('c2/d', "M 19 15 A 4,4 0 1 1 19,14 z");
            this.model.attr('c3/d', "M 28 15 A 4,4 0 1 1 28,14 z");
            lineX = 1;
        } else if (current.tctData.signalType == BaseData.SignalType.THREE_TALL) {
            this.model.attr('c1/d', "M 10 10 A 4,4 0 1 1 10,9 z");
            this.model.attr('c2/d', "M 19 10 A 4,4 0 1 1 19,9 z");
            this.model.attr('c3/d', "M 28 10 A 4,4 0 1 1 28,9 z");
            lineX = 1;
            lineY1 = 4;
            lineY2 = 25;
        }

        if (current.tctData.signalDirection == BaseData.SignalDirection.Up) {
            this.model.attr('c1/fill', "red");
            this.model.attr('c2/fill', "#20EE00");
            this.model.attr('c3/fill', "#ABAB00");
        } else if (current.tctData.signalDirection == BaseData.SignalDirection.Down) {
            lineX = 30 - lineX;
            if (current.tctData.signalType < 3) {
                this.model.attr('c1/fill', "#20EE00");
                this.model.attr('c2/fill', "red");
                this.model.attr('c3/fill', "#ABAB00");
            } else {
                this.model.attr('c1/fill', "#ABAB00");
                this.model.attr('c2/fill', "#20EE00");
                this.model.attr('c3/fill', "red");
            }
        }

        this.model.attr('mainLine/d', `M ${lineX} ${lineY1} L ${lineX} ${lineY2}`);
        this.model.attr('mainLine/stroke', BaseData.Colors.Track);

        this.model.attr('label/text', `${current.tctData.name} (${current.tctData.tctId})`);
        this.updatePort();
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
     * 将当前信号机连接到轨道线
     * @param {*} trackView 轨道线
     */
    combine(trackView) {
        let teamInfo = {};

        let signalPort = this.getPortCanUse();
        if (!signalPort) {
            return teamInfo;
        }

        if (trackView.model.attributes.type != 'tct.Track') {
            return teamInfo;
        }

        let trackPosition = trackView.getTrackRealPosition();

        if (trackPosition.y1 == trackPosition.y2) {
            if (signalPort.y == trackPosition.y1 && signalPort.x >= trackPosition.x1 && signalPort.x <= trackPosition.x2) {
                teamInfo = this._connectPort(trackView);
            } else if (signalPort.upY == trackPosition.y1 && signalPort.upX >= trackPosition.x1 && signalPort.upX <= trackPosition.x2) {
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
    getRect() {
        return {
            x: this.model.attributes.position.x,
            y: this.model.attributes.position.y,
            width: this.model.attr("background/width"),
            height: this.model.attr("background/height"),
        }
    }

});

export default Signal;