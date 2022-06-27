import * as Util from "@/utils/util";
import * as joint from "jointjs";
import BaseData from "../BaseData";

const g = joint.g;
const V = joint.V;
const borderColor = "#ccc9";
const borderWidth = 2;
const lineColor = "#87CEFF";
const lineWidth = 4;
const textColor = "#fff";
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let Limit = joint.dia.Element.define('tct.Limit', {
    attrs: {
        background: {
            width: 30,
            height: 60,
            'fill-opacity': 0
        },
        border: {
            width: 28,
            height: 60,
            'fill-opacity': 0,
            x: 1,
            y: 0,
            'stroke-width': borderWidth,
            stroke: borderColor,
            z: -1
        },
        line: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            "stroke-width": lineWidth,
            stroke: lineColor,
            z: 0
        },
        label: {
            "font-size": 11,
            text: "0",
            fill: textColor,
            'font-size': 20,
            x: 0,
            y: 0,
            z: 1
        },
        km: {
            "font-size": 11,
            text: "k0",
            fill: textColor,
            'font-size': 14,
            x: 0,
            y: 0,
            z: 1
        }
    },
    markup: [{
        tagName: 'rect',
        selector: 'background'
    }, {
        tagName: 'rect',
        selector: 'border'
    }, {
        tagName: 'line',
        selector: 'line'
    }, {
        tagName: 'text',
        selector: 'label'
    }, {
        tagName: 'text',
        selector: 'km'
    }],
    tctData: {
        typeName: "限速",
        tctId: BaseData.DefaultTctId,
        startCm: 0,
        endCm: 0,
        H: 0,
        R: 0,
        originData: null
    },
    drawData: {
        teamId: null
    }
}, {
});

joint.shapes.tct.LimitView = joint.dia.ElementView.extend({
    init() {
        this.updateLayout();
    },

    render() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.updateLayout();
    },
    /**
     * 选中
     */
    select(rect) {
        this._setOutlineRectVisibility(true);
    },
    /**
     * 取消选中
     */
    unselect() {
        this._setOutlineRectVisibility(false);
    },

    _setOutlineRectVisibility(visible) {
        if (visible) {
            this.model.attr('border/stroke', 'orange');
            this.model.attr('line/stroke', 'orange');
            this.model.attr('label/fill', 'orange');
        } else {
            this.model.attr('border/stroke', borderColor);
            this.model.attr('line/stroke', lineColor);
            this.model.attr('label/fill', textColor);
        }
    },

    /**
     * 更新布局外观
     */
    updateLayout() {
        let current = this.model.attributes;

        if (Number(current.tctData.R) == 0) {
            this.model.attr('line/y1', 30);
            this.model.attr('line/y2', 30);
        } else if (Number(current.tctData.R) < 0) {
            this.model.attr('line/y1', 45);
            this.model.attr('line/y2', 45);
        } else {
            this.model.attr('line/y1', 15);
            this.model.attr('line/y2', 15);
        }

        if (current.tctData.R == 0) {
            this.model.attr('label/text', ``);
        } else {
            this.model.attr('label/text', `R ${current.tctData.R}`);
        }
        let km = Number(current.tctData.endCm);
        let km1 = parseInt(km / 1000);
        let km2 = parseInt(km % 1000);
        this.model.attr('km/text', `K${km1}+${km2}`);
    },
    updatePort() {

    },
    pointermove: function (evt, x, y) {

    },
    /**
     * 设置坡度信息
     * @param {*} rateInfo 
     */
    setLimitInfo(limitItem, rateInfo) {
        this.model.attributes.tctData.tctId = limitItem.id;
        this.model.attributes.tctData.startCm = limitItem.startCm;
        this.model.attributes.tctData.endCm = limitItem.endCm;
        this.model.attributes.tctData.R = limitItem.R;
        this.model.attributes.tctData.H = limitItem.H;
        this.model.attributes.tctData.V = limitItem.V;
        this.model.attributes.tctData.originData = limitItem;

        let x1 = (limitItem.startCm - rateInfo.minKm) / rateInfo.rate + rateInfo.minX;
        x1 = Util.alignPointToGrid({ x: x1, y: 0 }, 30).x;

        let x2 = (limitItem.endCm - rateInfo.minKm) / rateInfo.rate + rateInfo.minX;
        x2 = Util.alignPointToGrid({ x: x2, y: 0 }, 30).x;
        if (x1 == x2) {
            x2 += 2;
        }
        this.model.attr('background/width', x2 - x1);
        this.model.attr('border/width', x2 - x1 - 2);
        this.model.attr('label/x', (x2 - x1) / 2 - 10);
        this.model.attr('km/x', (x2 - x1) - 10);
        this.model.attr('km/y', 60);
        this.model.attr('km/transform', `rotate(-90 ${x2 - x1 - 15},60)`);

        if (limitItem.R == 0) {
            this.model.attr('line/x1', 0);
            this.model.attr('line/y1', 30);
            this.model.attr('line/x2', (x2 - x1));
            this.model.attr('line/y2', 30);
            this.model.attr('label/y', 60);
        } else if (limitItem.R < 0) {
            this.model.attr('line/x1', 0);
            this.model.attr('line/y1', 45);
            this.model.attr('line/x2', (x2 - x1));
            this.model.attr('line/y2', 45);
            this.model.attr('label/y', 35);
        } else {
            this.model.attr('line/x1', 0);
            this.model.attr('line/y1', 15);
            this.model.attr('line/x2', (x2 - x1));
            this.model.attr('line/y2', 15);
            this.model.attr('label/y', 40);
        }

        if (Number(limitItem.direction) == 2) {
            this.model.position(x1, rateInfo.minY - 182);
        } else if (Number(limitItem.direction) == 1) {
            this.model.position(x1, rateInfo.maxY + 212);
        }

        this.updateLayout();
    },
    /**
     * 获取可用端口
     */
    getPortCanUse() {
        let port = null;

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

        return teamInfo;
    },

    /**
     * 获取右键菜单
     */
    getMenus() {
        let menus = [
            '编辑限速'
        ];
        return menus;
    },
    /**
     * 获取公里标
     */
    getKm() {
        return {
            startKm: this.model.attributes.tctData.startKm,
            endKm: this.model.attributes.tctData.endKm
        };
    },
    /**
     * 释放端口
     * @param {*} node 
     */
    freePort(node) {
        let data = { relatedNodes: [], removeTeamId: null };

        return data;
    },
    action(menu) {

    },
    getRect() {
        return {
            x: this.model.attributes.position.x,
            y: this.model.attributes.position.y,
            width: this.model.attr('background/width'),
            height: this.model.attr('background/height'),
        }
    }

});

export default Limit;