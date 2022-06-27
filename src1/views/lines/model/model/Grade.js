import * as Util from "@/utils/util";
import * as joint from "jointjs";
import BaseData from "../BaseData";

const g = joint.g;
const V = joint.V;
const borderColor = '#ccc9';
const lineColor = '#7FFFD4';
const textColor = '#fff';
const borderWidth = 2;
const lineWidth = 4;

joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let Grade = joint.dia.Element.define('tct.Grade', {
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
        V: {
            "font-size": 11,
            text: "0",
            fill: textColor,
            'font-size': 20,
            x: 0,
            y: 23,
            z: 1
        },
        R: {
            "font-size": 11,
            text: "0",
            fill: textColor,
            'font-size': 20,
            x: 0,
            y: 53,
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
        selector: 'V'
    }, {
        tagName: 'text',
        selector: 'R'
    }, {
        tagName: 'text',
        selector: 'km'
    }],
    tctData: {
        typeName: "坡度",
        tctId: BaseData.DefaultTctId,
        startKm: 0,
        endKm: 0,
        gradeValue: 0,
        R: 0,
        originData: null
    },
    drawData: {
        teamId: null
    }
}, {
});

joint.shapes.tct.GradeView = joint.dia.ElementView.extend({
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
            this.model.attr('V/fill', 'orange');
            this.model.attr('R/fill', 'orange');
        } else {
            this.model.attr('border/stroke', borderColor);
            this.model.attr('line/stroke', lineColor);
            this.model.attr('V/fill', textColor);
            this.model.attr('R/fill', textColor);
        }
    },

    /**
     * 更新布局外观
     */
    updateLayout() {
        let current = this.model.attributes;

        if (Number(current.tctData.gradeValue) == 0) {
            this.model.attr('line/y1', 30);
            this.model.attr('line/y2', 30);
        } else if (Number(current.tctData.gradeValue) < 0) {
            this.model.attr('line/y1', 0);
            this.model.attr('line/y2', 60);
        } else {
            this.model.attr('line/y1', 60);
            this.model.attr('line/y2', 0);
        }

        this.model.attr('V/text', `${current.tctData.gradeValue}`);

        let offset = Number(current.tctData.endKm) - Number(current.tctData.startKm);
        offset = parseInt(offset * 1000) / 1000;

        // this.model.attr('R/text', `${offset}`);
        this.model.attr('R/text', `${current.tctData.R}`);

        let km = Number(current.tctData.endKm);
        let km1 = parseInt(km / 1000);
        let km2 = parseInt(km % 1000);
        this.model.attr('km/text', `K${km1}+${km2}`);

        this.model.attr('border/stroke-width', borderWidth);
        this.model.attr('line/stroke-width', lineWidth);
    },
    updatePort() {

    },
    pointermove: function (evt, x, y) {

    },
    /**
     * 设置坡度信息
     * @param {*} rateInfo 
     */
    setGradeInfo(gradeItem, rateInfo) {
        this.model.attributes.tctData.tctId = gradeItem.id;
        this.model.attributes.tctData.startKm = gradeItem.startKm;
        this.model.attributes.tctData.endKm = gradeItem.endKm;
        this.model.attributes.tctData.gradeValue = gradeItem.value;
        this.model.attributes.tctData.R = gradeItem.R;
        this.model.attributes.tctData.originData = gradeItem;

        let x1 = (gradeItem.startKm - rateInfo.minKm) / rateInfo.rate + rateInfo.minX;
        x1 = Util.alignPointToGrid({ x: x1, y: 0 }, 30).x;

        let x2 = (gradeItem.endKm - rateInfo.minKm) / rateInfo.rate + rateInfo.minX;
        x2 = Util.alignPointToGrid({ x: x2, y: 0 }, 30).x;

        this.model.attr('background/width', x2 - x1);
        this.model.attr('border/width', x2 - x1 - 2);
        this.model.attr('V/x', (x2 - x1) / 2 - 10);
        this.model.attr('R/x', (x2 - x1) / 2 - 10);
        this.model.attr('km/x', (x2 - x1) - 10);
        this.model.attr('km/y', 60);
        this.model.attr('km/transform', `rotate(-90 ${x2 - x1 - 15},60)`);

        if (gradeItem.value == 0) {
            this.model.attr('line/x1', 0);
            this.model.attr('line/y1', 30);
            this.model.attr('line/x2', (x2 - x1));
            this.model.attr('line/y2', 30);
        } else if (gradeItem.value < 0) {
            this.model.attr('line/x1', 0);
            this.model.attr('line/y1', 0);
            this.model.attr('line/x2', (x2 - x1));
            this.model.attr('line/y2', 60);
        } else {
            this.model.attr('line/x1', 0);
            this.model.attr('line/y1', 60);
            this.model.attr('line/x2', (x2 - x1));
            this.model.attr('line/y2', 0);
        }

        if (Number(gradeItem.direction) == 2) {
            this.model.position(x1, rateInfo.minY - 120);
        } else if (Number(gradeItem.direction) == 1) {
            this.model.position(x1, rateInfo.maxY + 150);
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
            '编辑坡度'
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

export default Grade;