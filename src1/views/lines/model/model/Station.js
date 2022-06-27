import * as Util from "@/utils/util";
import * as joint from "jointjs";
import BaseData from "../BaseData";

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let Station = joint.dia.Element.define('tct.Station', {
    attrs: {
        background: {
            width: 180,
            height: 90,
            x: 0,
            y: 0,
            fill: BaseData.Colors.StationBackground,
            stroke: BaseData.Colors.StationBorder,
            'stroke-width': 2,
            'fill-opacity': 0.9
        },
        psdUp: {
            x: 30,
            y: 5,
            width: 140,
            height: 10,
            fill: BaseData.Colors.PSD,
            'fill-opacity': 1.0
        },
        psdDown: {
            x: 30,
            y: 75,
            width: 140,
            height: 10,
            fill: BaseData.Colors.PSD,
            'fill-opacity': 1.0
        },
        text: {
            "font-size": 42,
            fill: "white",
            ref: "background",
            refX: .5,
            refY: .16,
            text: "",
            stroke: BaseData.Colors.StationText,
            "text-anchor": "middle",
            "dominant-baseline": "middle"
        },
        // top-left
        stopTL: {
            fill: 'transparent',
            d: 'M 15 -26 L 28 -2 L 2 -2 z',
            stroke: BaseData.Colors.Stop,
            'stroke-width': 3,
            opacity: 1.0
        },
        // top-right
        stopTR: {
            fill: 'transparent',
            d: 'M 15 -26 L 28 -2 L 2 -2 z',
            stroke: BaseData.Colors.Stop,
            'stroke-width': 3,
            opacity: 1.0
        },
        // bottpm-left
        stopBL: {
            fill: 'transparent',
            d: 'M 15 -26 L 28 -2 L 2 -2 z',
            stroke: BaseData.Colors.Stop,
            'stroke-width': 3,
            opacity: 1.0
        },
        // bottom-right
        stopBR: {
            fill: 'transparent',
            d: 'M 15 -26 L 28 -2 L 2 -2 z',
            stroke: BaseData.Colors.Stop,
            'stroke-width': 3,
            opacity: 1.0
        },
        labelKm: {
            "font-size": 11,
            text: "K",
            fill: "#ccc",
            x: 10,
            y: 40
        }
    },
    markup: [{
        tagName: 'rect',
        selector: 'background'
    }, {
        tagName: 'text',
        selector: 'text'
    }, {
        tagName: 'rect',
        selector: 'psdUp'
    }, {
        tagName: 'rect',
        selector: 'psdDown'
    }, {
        tagName: 'path',
        selector: 'stopTL'
    }, {
        tagName: 'path',
        selector: 'stopTR'
    }, {
        tagName: 'path',
        selector: 'stopBL'
    }, {
        tagName: 'path',
        selector: 'stopBR'
    }, {
        tagName: 'text',
        selector: 'labelKm'
    }],
    tctData: {
        typeName: "车站",
        name: "车站",
        tctId: BaseData.DefaultTctId,
        platformID1: -1,// 站台ID
        platformID2: -1,
        psdId1: -1, // PSD
        psdID2: -1,
        stopTLID: -1, // 停车点ID
        stopTRID: -1,
        stopBLID: -1,
        stopBRID: -1,
        stopAreaTLID: -1, // 停车点对应停车区域ID
        stopAreaTRID: -1,
        stopAreaBLID: -1,
        stopAreaBRID: -1,
        km: 0,
        kmOffset: 0,
        carCount: 6,
        upPositiveStop: true,
        upNegativeStop: false,
        downPositiveStop: true,
        downNegativeStop: false,
        portLocation: BaseData.StationPortLocation.UpAndDown,
        psdLocation: BaseData.PSDLocation.UpAndDown,
        verticalSize: 3,// 车站垂直高度（单位:单元[1单元=30像素]）
        direction: BaseData.Direction.NotSet,
        speedLimit:50
    },
    drawData: {
        teamId: null,
        nodeUp: null,
        nodeDown: null
    }
}, {
});


joint.shapes.tct.StationView = joint.dia.ElementView.extend({
    init() {
        this.VSelect = null;
        this.VPortUp = null;
        this.VPortDown = null;
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
        if (rect) {
            if (visible) {
                if (!this.VSelect) {
                    this.VSelect = V("rect");
                }
                let r = this.getRect();
                this.VSelect.attr({
                    x: rect.x - r.x,
                    y: rect.y - r.y,
                    width: rect.width,
                    height: rect.height,
                    fill:"#222",
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
                this.model.attr("background/stroke", BaseData.Colors.Selected);
                this.model.attr("background/fill", BaseData.Colors.StationSelected);
            } else {
                this.model.attr("background/stroke", BaseData.Colors.StationBorder);
                this.model.attr("background/fill", BaseData.Colors.StationBackground);
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
        let current = this.model.attributes;
        let width = this.model.attr('background/width');
        let height = this.model.attr('background/height');

        if (this.VPortDown) {
            this.VPortDown.remove();
        }

        if (this.VPortUp) {
            this.VPortUp.remove();
        }

        if (current.tctData.portLocation == BaseData.StationPortLocation.Up || current.tctData.portLocation == BaseData.StationPortLocation.UpAndDown) {
            if (current.drawData.nodeUp) {
                if (this.VPortUp) {
                    this.VPortUp.remove();
                    this.VPortUp = null;
                }
            } else {
                if (!this.VPortUp) {
                    this.VPortUp = V("line");
                }
                this.VPortUp.attr({
                    x1: width / 2,
                    y1: - 120,
                    x2: width / 2,
                    y2: - 30,
                    fill: "white",
                    "stroke-width": 2,
                    "stroke-dasharray": "8, 4",
                    stroke: "red"
                });
                this.vel.append([this.VPortUp]);
            }
        }
        if (current.tctData.portLocation == BaseData.StationPortLocation.Down || current.tctData.portLocation == BaseData.StationPortLocation.UpAndDown) {
            if (current.drawData.nodeDown) {
                if (this.VPortDown) {
                    this.VPortDown.remove();
                    this.VPortDown = null;
                }
            } else {
                if (!this.VPortDown) {
                    this.VPortDown = V("line");
                }
                this.VPortDown.attr({
                    x1: width / 2,
                    y1: height + 30,
                    x2: width / 2,
                    y2: height + 120,
                    fill: "white",
                    "stroke-width": 2,
                    "stroke-dasharray": "8, 4",
                    stroke: "red"
                });
                this.vel.append([this.VPortDown]);
            }
        }
    },
    /**
     * 更新布局外观
     */
    updateLayout() {
        let current = this.model.attributes;

        let width = current.tctData.carCount * 60;
        let height = current.tctData.verticalSize * 30;
        // 设置车站名称
        this.model.attr('text/text', current.tctData.name);

        // 根据编组设置长度
        this.model.attr('background/width', width);

        // 根据垂直高度单元设置高度
        this.model.attr('background/height', height);

        // 设置上方PSD
        let showPsdUp = current.tctData.psdLocation == BaseData.PSDLocation.Up || current.tctData.psdLocation == BaseData.PSDLocation.UpAndDown;
        this.model.attr('psdUp/width', width - 60);
        this.model.attr('psdUp/opacity', showPsdUp ? 1.0 : 0);

        // 设置下方PSD
        let showPsdDown = current.tctData.psdLocation == BaseData.PSDLocation.Down || current.tctData.psdLocation == BaseData.PSDLocation.UpAndDown;
        this.model.attr('psdDown/width', width - 60);
        this.model.attr('psdDown/y', height - 15);
        this.model.attr('psdDown/opacity', showPsdDown ? 1.0 : 0);

        // 停车标
        this.model.attr('stopTL/opacity', current.tctData.downPositiveStop ? 1.0 : 0);

        let data = `M ${width - 30 + 15} -26 L ${width - 30 + 28} -2 L ${width - 30 + 2} -2 z`;
        this.model.attr('stopTR/d', data);
        this.model.attr('stopTR/opacity', current.tctData.downNegativeStop ? 1.0 : 0);

        data = `M 2 ${height + 2} L 28 ${height + 2} L 15 ${height + 26} z`;
        this.model.attr('stopBL/d', data);
        this.model.attr('stopBL/opacity', current.tctData.upNegativeStop ? 1.0 : 0);

        data = `M ${width - 30 + 2} ${height + 2} L ${width - 30 + 28} ${height + 2} L ${width - 30 + 15} ${height + 26} z`;
        this.model.attr('stopBR/d', data);
        this.model.attr('stopBR/opacity', current.tctData.upPositiveStop ? 1.0 : 0);
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
        let ports = null;
        let current = this.model.attributes;

        let setUp = current.tctData.portLocation == BaseData.StationPortLocation.Up || current.tctData.portLocation == BaseData.StationPortLocation.UpAndDown;
        let width = this.model.attr('background/width');
        let height = this.model.attr('background/height');
        if (setUp) {
            if (!current.drawData.nodeUp) {
                if (!ports) {
                    ports = {};
                }
                ports.portUp = {
                    x: current.position.x + width / 2,
                    y1: current.position.y - 120,
                    y2: current.position.y - 30
                };
            }
        }

        let setDown = current.tctData.portLocation == BaseData.StationPortLocation.Down || current.tctData.portLocation == BaseData.StationPortLocation.UpAndDown;
        if (setDown) {
            if (!current.drawData.nodeDown) {
                if (!ports) {
                    ports = {};
                }
                ports.portDown = {
                    x: current.position.x + width / 2,
                    y1: current.position.y + height + 30,
                    y2: current.position.y + height + 120
                };
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
     * 将当前车站连接到轨道线
     * @param {*} trackView 轨道线
     */
    combine(trackView) {
        let teamInfo = {};

        let stationPorts = this.getPortCanUse();
        if (!stationPorts || trackView.model.attributes.type != 'tct.Track') {
            return teamInfo;
        }
        let trackPosition = trackView.getTrackRealPosition();

        if (trackPosition.y1 == trackPosition.y2) {
            if (stationPorts.portUp) {
                if (trackPosition.x1 <= stationPorts.portUp.x
                    && trackPosition.x2 >= stationPorts.portUp.x
                    && trackPosition.y1 >= stationPorts.portUp.y1
                    && trackPosition.y1 <= stationPorts.portUp.y2) {
                    teamInfo = this._connectPort(trackView, "portUp");
                }
            }
            if (stationPorts.portDown) {
                if (trackPosition.x1 <= stationPorts.portDown.x
                    && trackPosition.x2 >= stationPorts.portDown.x
                    && trackPosition.y1 >= stationPorts.portDown.y1
                    && trackPosition.y1 <= stationPorts.portDown.y2) {
                    teamInfo = this._connectPort(trackView, "portDown");
                }
            }
        }

        return teamInfo;
    },
    /**
     * 连接端口
     * @param {*} trackView 待连接的trackView,Team信息以trackView为主
     */
    _connectPort(trackView, tarPortNum) {
        if (!trackView.model.attributes.drawData.stations) {
            trackView.model.attributes.drawData.stations = [];
        }
        trackView.model.attributes.drawData.stations.push({
            type: this.model.attributes.type,
            id: this.model.attributes.id,
            port: tarPortNum
        });
        if (tarPortNum == 'portUp') {
            this.model.attributes.drawData.nodeUp = { id: trackView.model.attributes.id, type: trackView.model.attributes.type, port: "stations", eId: this.model.attributes.id };
        } else if (tarPortNum == 'portDown') {
            this.model.attributes.drawData.nodeDown = { id: trackView.model.attributes.id, type: trackView.model.attributes.type, port: "stations", eId: this.model.attributes.id };
        }

        // 统一设置teamId，并返回teamId信息
        let cellTeamId = trackView.model.attributes.drawData.teamId;
        let thisTeamId = this.model.attributes.drawData.teamId;
        let teamInfo = {
            from: this,
            to: trackView,
            stop: false  // 后续是否停止
        };
        if (!cellTeamId && !thisTeamId) {
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
        } else if (thisTeamId) {
            teamInfo.teamId = thisTeamId;
            teamInfo.oldTeamId = cellTeamId;
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
        } else if (cellTeamId) {
            teamInfo.teamId = cellTeamId;
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
     * 释放端口
     * @param {*} node 
     */
    freePort(node) {
        let data = { relatedNodes: [], removeTeamId: null };
        let drawData = this.model.attributes.drawData;
        if (node) {
            if (this.model.attributes.id == node.id) {
                if (node.port == 'portUp') {
                    data.relatedNodes = [this.model.attributes.drawData.nodeUp];
                    this.model.attributes.drawData.nodeUp = null;
                } else if (node.port == 'portDown') {
                    data.relatedNodes = [this.model.attributes.drawData.nodeDown];
                    this.model.attributes.drawData.nodeDown = null;
                }
            }
        } else {
            if (this.model.attributes.drawData.nodeUp) {
                data.relatedNodes.push(this.model.attributes.drawData.nodeUp);
                this.model.attributes.drawData.nodeUp = null;
            }
            if (this.model.attributes.drawData.nodeDown) {
                data.relatedNodes.push(this.model.attributes.drawData.nodeDown);
                this.model.attributes.drawData.nodeDown = null;
            }
        }

        if (!drawData.nodeUp && !drawData.nodeDown) {
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
            x: this.model.attributes.position.x,
            y: this.model.attributes.position.y ,
            width: this.model.attr("background/width"),
            height: this.model.attr("background/height") ,
        }
    }
});

export default Station;