import * as Util from "@/utils/util";
import * as joint from "jointjs";
import BaseData from "../BaseData";

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let Stop = joint.dia.Element.define('tct.Stop', {
    attrs: {
        background: {
            width: 30,
            height: 60,
            'fill-opacity': 0
        },
        flag: {
            fill: 'transparent',
            d: 'M 0 -19 L 11 0 L -11 0 z',
            stroke: BaseData.Colors.Stop,
            'stroke-width': 3
        },
        line: {
            x1: 0,
            y1: -10,
            x2: 0,
            y2: 20,
            "stroke-width": 2,
            stroke: BaseData.Colors.Stop,
        },
        label: {
            "font-size": 11,
            text: "停车点",
            fill: "pink",
            x: -20,
            y: 30
        }
    },
    markup: [{
        tagName: 'rect',
        selector: 'background'
    }, {
        tagName: 'path',
        selector: 'flag'
    }, {
        tagName: 'line',
        selector: 'line'
    }, {
        tagName: 'text',
        selector: 'label'
    }],
    tctData: {
        typeName: "停车点",
        tctId: BaseData.DefaultTctId,
        km: 0,
        props: {
            EMAP_OPERAT_STOP_POINT: false,           /*站台运营停车点*/
            EMAP_EXITROUTE_STOP_POINT: false,        /*退出停车点（CBTC区域至非CBTC区域)*/
            EMAP_REVERT_STOP_POINT: false,           /*折返停车点*/
            EMAP_SIGNAL_STOP_POINT: false,           /*站外信号机停车点(非折返)*/  /*通过停车点*/
            EMAP_REVERTEND_STOP_POINT: false,        /*折返后停车点*/
            EMAP_SWITCH_STOP_POINT: false,           /*转换轨(小站台)停车点（非CBTC区域至CBTC区域）*/
            EMAP_SLEEP_AWAKE_STOP_POINT: false,    /*休眠唤醒停车点*/
            EMAP_CLEAN_REQ_STOP_POINT: false,      /*洗车请求停车点*/
            EMAP_CLEAN_FRONT_STOP_POINT: false,    /*前端洗车停车点*/
            EMAP_CLEAN_END_STOP_POINT: false,      /*后端洗车停车点*/
            EMAP_PASS_REQ_STOP_POINT: false,       /*通过请求停车点*/
            EMAP_4GROUP_STOP_POINT: false,         /*4编组停车点*/
            EMAP_6GROUP_STOP_POINT: false,         /*6编组停车点*/
        },
        direction: BaseData.Direction.NotSet
    },
    drawData: {
        teamId: null,
        nodeParent: null,
        locked: false
    }
}, {
});


joint.shapes.tct.StopView = joint.dia.ElementView.extend({
    init() {
        console.log("--- Stop init ---");
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
            if (!this.VRect) {
                this.VRect = V("rect");
            }
            if (rect) {
                let r = this.getRect();
                this.VRect.attr({
                    x: rect.x - r.x -15,
                    y: rect.y - r.y - 30,
                    width: rect.width,
                    height: rect.height,
                    fill:"#222",
                    "fill-opacity": 0.3,
                    "stroke-width": 2,
                    stroke: BaseData.Colors.Selected
                });
            } else {
                this.VRect.attr({
                    x: -15,
                    y: -30,
                    width: 30,
                    height: 60,
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
        } else { // 不满连接条件，画出连接端口
            if (!this.VPort) {
                this.VPort = V("rect");
            }

            this.VPort.attr({
                x: -2,
                y: -32,
                width: 4,
                height: 4,
                stroke: "red",
                "fill": 'red',
            });

            if (this.model.attributes.angle % 360 == 180) {
                this.VPort.attr({ y: 28 });
            }

            this.vel.append([this.VPort]);
        }
    },
    /**
     * 更新布局外观
     */
    updateLayout() {
        let current = this.model.attributes;
        this.model.attr('label/text', '停车点'+current.tctData.tctId);
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
                x: model.position.x,
                y: model.position.y - 30
            }

            if (this.model.attributes.angle % 360 == 180) {
                port.y = model.position.y + 30;
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
            eId:this.model.attributes.id
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
            return ["更换站型","删除车站"];
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
    getRect() {
        return {
            x: this.model.attributes.position.x-15,
            y: this.model.attributes.position.y-30,
            width: 30,
            height: 60,
        }
    }

});

export default Stop;