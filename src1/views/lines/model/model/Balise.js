import * as Util from "@/utils/util";
import * as joint from "jointjs";
import BaseData from "../BaseData";


const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let Balise = joint.dia.Element.define('tct.Balise', {
    attrs: {
        out: {
            x: 3,
            y: 20,
            width: 24,
            height: 20,
            'stroke-width': 2,
            'fill-opacity': 0.0,
            stroke: BaseData.Colors.Track
        },
        balise: {
            fill: 'transparent',
            d: '',
            stroke: BaseData.Colors.Stop,
            'stroke-width': 2,
            'fill-opacity': 0.0,
        },
        label: {
            "font-size": 11,
            text: "VB",
            fill: "pink",
            x: 0,
            y: 15,
            'fill-opacity': 0.0,
        },
        labelKm: {
            "font-size": 11,
            text: "K",
            fill: "#ccc",
            x: 0,
            y: 15
        }
    },
    markup: [{
        tagName: 'rect',
        selector: 'out'
    }, {
        tagName: 'text',
        selector: 'label'
    }, {
        tagName: 'path',
        selector: 'balise'
    }, {
        tagName: 'text',
        selector: 'labelKm'
    }],
    tctData: {
        typeName: "固定应答器",
        tctId: BaseData.DefaultTctId,
        baliseType: "FB",
        km: 0
    },
    drawData: {
        teamId: null,
        nodeParent: null
    }
}, {
});


joint.shapes.tct.BaliseView = joint.dia.ElementView.extend({
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
                    x: 0,
                    y: 15,
                    width: 30,
                    height: 30,
                    "fill-opacity": 0,
                    "stroke-width": 2,
                    stroke: BaseData.Colors.Selected
                });
            }
            let r = this.vel.append([this.VRect]);
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
        return;
        let model = this.model;
        if (model.attributes.drawData.nodeParent) {
            if (this.VPort) {
                this.VPort.remove();
                this.VPort = null;
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
            });
            this.vel.append([this.VPort]);
        }
    },
    /**
     * 更新布局外观
     */
    updateLayout() {
        // this.model.attr('out/fill-opacity',"0.0");
        // this.model.attr('balise/fill-opacity',"0.0");
        // this.model.attr('label/fill-opacity',"0.0");
        // this.model.attr('out/stroke',"0.0");
        // this.model.attr('balise/stroke',"0.0");
        // this.model.attr('label/stroke',"0.0");
        // return;
        let current = this.model.attributes;
        /**
         FB-固定应答器
         VB-可变应答器
         WB-轮径矫正应答器
         IB-填充应答器/预告应答器
         DB-休眠唤醒应答器
         LDR-应答器环线
         */
        this.model.attr('out/stroke-opacity', 1);
        if (current.tctData.baliseType == 'FB') {
            current.tctData.typeName = "固定应答器";
            this.model.attr('out/stroke', BaseData.Colors.FB);
            this.model.attr('balise/d', "M 3 20 L 27 40 z M 27 20 L 3 40 z");
            this.model.attr('balise/stroke', BaseData.Colors.FB);
        } else if (current.tctData.baliseType == 'VB') {
            current.tctData.typeName = "可变应答器";
            this.model.attr('out/stroke', BaseData.Colors.Track);
            this.model.attr('balise/d', "");
            this.model.attr('balise/stroke', BaseData.Colors.Track);
        } else if (current.tctData.baliseType == 'WB') {
            current.tctData.typeName = "轮径矫正应答器";
            this.model.attr('out/stroke', BaseData.Colors.WB);
            this.model.attr('balise/d', "M 3 30 L 27 30 z M 15 20 L 15 40 z");
            this.model.attr('balise/stroke', BaseData.Colors.WB);
        } else if (current.tctData.baliseType == 'IB') {
            current.tctData.typeName = "预告应答器";
            this.model.attr('out/stroke', BaseData.Colors.IB);
            this.model.attr('balise/d', "M 3 30 L 15 20 z M 3 40 L 27 20 z M 15 40 L 27 30 z");
            this.model.attr('balise/stroke', BaseData.Colors.IB);
        } else if (current.tctData.baliseType == 'DB') {
            current.tctData.typeName = "休眠唤醒应答器";
            this.model.attr('out/stroke-opacity', 0);
            this.model.attr('balise/d', "M 0 20 L 30 20 L 30 40 L 0 40 z M 0 20 L 30 40z M 30 20 L 0 40z");
            this.model.attr('balise/stroke', BaseData.Colors.DB);
        } else if (current.tctData.baliseType == 'LDR') {
            current.tctData.typeName = "休眠唤醒应答器";
            this.model.attr('out/stroke-opacity', 0);
            this.model.attr('balise/d', "M 0 20 L 12 20 L 18 40 L 30 40 L 30 20 L 18 20 L 12 40 L 0 40 z");
            this.model.attr('balise/stroke', BaseData.Colors.LDR);
        }
        this.model.attr('label/text', current.tctData.baliseType + current.tctData.tctId);
        this.updatePort();
        this.getKmStr();
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
                y: model.position.y + 30
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
     * 将当前应答器连接到轨道线
     * @param {*} trackView 轨道线
     */
    combine(trackView) {
        let teamInfo = {};

        let balisePort = this.getPortCanUse();
        if (!balisePort) {
            return teamInfo;
        }

        if (trackView.model.attributes.type != 'tct.Track') {
            return teamInfo;
        }

        let trackPosition = trackView.getTrackRealPosition();

        if (trackPosition.y1 == trackPosition.y2) { // 侧线不放计轴器
            if (balisePort.y == trackPosition.y1 && balisePort.x >= trackPosition.x1 && balisePort.x <= trackPosition.x2) {
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
            y: this.model.attributes.position.y + 15
        }
    },
    getRect() {
        return {
            x: this.model.attributes.position.x,
            y: this.model.attributes.position.y,
            width: 30,
            height: 30,
        }
    }
});


export default Balise;