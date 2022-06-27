import * as Util from "@/utils/util";
import * as joint from "jointjs";
import BaseData from "../BaseData";

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let StopArea = joint.dia.Element.define('tct.StopArea', {
    attrs: {
        background: {
            x: -50,
            y: -10,
            width: 100,
            height: 20,
            fill: 'red',
            'fill-opacity': 0.2
        },
        left: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            stroke: 'red',
            'stroke-width': 1
        },
        right: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            stroke: 'red',
            'stroke-width': 1
        },
        label: {
            "font-size": 11,
            text: "停车区",
            fill: "blue",
            x: -20,
            y: 5
        },
        name: {
            "font-size": 11,
            text: "",
            fill: "white",
            x: -50,
            y: -15
        }
    },
    markup: [
        {
            tagName: 'rect',
            selector: 'background'
        }, {
            tagName: 'line',
            selector: 'left'
        }, {
            tagName: 'line',
            selector: 'right'
        }, {
            tagName: 'text',
            selector: 'label'
        }, {
            tagName: 'text',
            selector: 'name'
        }],
    tctData: {
        typeName: "停车区域",
        tctId: BaseData.DefaultTctId,
        stopAreaID:0,
        stop1ID: -1,
        stop2ID: -1,
        km1: 0,
        km2: 0,
        stationName: '',
        areaName: '',
        props: {
            EMAP_STATION_AREA: false,   // 0x01 站台区域
            EMAP_REVERT_AREA: true,    // 0x02 折返区域
            EMAP_TRANSFORM_AREA: false, // 0x04 转换轨区域 
            EMAP_DEPOT_AREA: false,     // 0x08 停车库轨区域
            EMAP_SLEEP_AREA: false,     // 0x10 休眠轨区域
            EMAP_CLEAR_AREA: false,     // 0x40 站台清客区域
        },
        direction: BaseData.Direction.NotSet,
        minStopTime: 30,
        maxStopTime: 30,
        defaultStopTime: 30,
        location: 0, // 0=未设置 1=上行 2=下行
        limit: 0,
        subAreasCount: 0,
        subAreas: [],
        /*
        {
            subId,
            startKm,
            endKm,
        }
        */
       reverseType:0 // 折返类型 0=不折反  1=上行方向折返  2=下行方向折返  3=双向折返
    },
    drawData: {
        teamId: null,
        nodeParent: null
    }
}, {
});


joint.shapes.tct.StopAreaView = joint.dia.ElementView.extend({
    init() {
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
        if (rect) {
            if (visible) {
                if (!this.VSelect) {
                    this.VSelect = V("rect");
                }
                let r = this.getRect();
                this.VSelect.attr({
                    x: rect.x - r.x - 50,
                    y: rect.y - r.y - 10,
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
                this.model.attr('background/fill-opacity', 0.4);
                this.model.attr('background/stroke', 'orange');
                this.model.attr('background/stroke-width', '2');

            } else {
                this.model.attr('background/fill-opacity', 0.2);
                this.model.attr('background/stroke', 'transparent');
                this.model.attr('background/stroke-width', '0');
                if (this.VSelect) {
                    this.VSelect.remove();
                    this.VSelect = null;
                }
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
                y: -2,
                width: 4,
                height: 4,
                stroke: "red",
                "fill": 'red',
            });

            this.vel.append([this.VPort]);
        }
        this.model.attr('label/text', '停车区' + this.model.attributes.tctData.tctId);
        this.model.attr('name/text', this.model.attributes.tctData.areaName);
    },
    updateLayout() {
        if (!this.model.attributes.tctData.subAreasCount) {
            this.model.attributes.tctData.subAreasCount = 0;
        }
        if (this.model.attributes.tctData.subAreasCount == 0) {
            this.model.attributes.tctData.subAreas = [];
        } else {
            let oldData = _.cloneDeep(this.model.attributes.tctData.subAreas);
            if (!oldData || oldData.length != this.model.attributes.tctData.subAreasCount) {
                let newData = [];
                for (let i = 0; i < this.model.attributes.tctData.subAreasCount; i++) {
                    if (oldData && oldData.length > i) {
                        newData.push(oldData[i]);
                    } else {
                        newData.push({
                            subId: i + 1,
                            startKm: 0,
                            endKm: 0
                        });
                    }
                }
                this.model.attributes.tctData.subAreas = newData;
            }
        }
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
                y: model.position.y
            }
        }

        return port;
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
     * 将当前停车区域连接到轨道线
     * @param {*} trackView 轨道线
     */
    combine(trackView) {
        let teamInfo = {};

        let stopAreaPort = this.getPortCanUse();
        if (!stopAreaPort) {
            return teamInfo;
        }

        if (trackView.model.attributes.type != 'tct.Track') {
            return teamInfo;
        }

        let trackPosition = trackView.getTrackRealPosition();

        if (trackPosition.y1 == trackPosition.y2) {
            if (stopAreaPort.y == trackPosition.y1 && stopAreaPort.x >= trackPosition.x1 && stopAreaPort.x <= trackPosition.x2) {
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
            km1: this.model.attributes.tctData.km1,
            km1Offset: this.model.attributes.tctData.km1Offset,
            km1Cm: this.model.attributes.tctData.km1 * 100000 + this.model.attributes.tctData.km1Offset * 100,
            km2: this.model.attributes.tctData.km2,
            km2Offset: this.model.attributes.tctData.km2Offset,
            km2Cm: this.model.attributes.tctData.km2 * 100000 + this.model.attributes.tctData.km2Offset * 100,
        };
    },
    /**
     * 获取停车区域属性
     */
    getStopProp() {
        let props = this.model.attributes.tctData.props;
        let value = 0;
        if (props.EMAP_STATION_AREA) {
            value += 0x01;
        }
        if (props.EMAP_REVERT_AREA) {
            value += 0x02;
        }
        if (props.EMAP_TRANSFORM_AREA) {
            value += 0x04;
        }
        if (props.EMAP_DEPOT_AREA) {
            value += 0x08;
        }
        if (props.EMAP_SLEEP_AREA) {
            value += 0x10;
        }
        if (props.EMAP_CLEAR_AREA) {
            value += 0x40;
        }
        return value;
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
            x: this.model.attributes.position.x - 50,
            y: this.model.attributes.position.y - 10,
            width: 100,
            height: 20,
        }
    }

});

export default StopArea;