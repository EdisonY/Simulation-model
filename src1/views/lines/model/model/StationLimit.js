import * as Util from "@/utils/util";
import * as joint from "jointjs";
import BaseData from "../BaseData";

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let StationLimit = joint.dia.Element.define('tct.StationLimit', {
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
            'stroke-width': 2,
            stroke: BaseData.Colors.Track
        },
        label: {
            "font-size": 11,
            text: "限速值",
            fill: BaseData.Colors.Track,
            'font-size':20,
            x: 10,
            y: 20
        }
    },
    markup: [{
        tagName: 'rect',
        selector: 'background'
    }, {
        tagName: 'rect',
        selector: 'border'
    },{
        tagName: 'text',
        selector: 'label'
    }],
    tctData: {
        typeName: "车站限速",
        tctId: BaseData.DefaultTctId,
        startCm: 0,
        endCm: 0,
        V: 0
    },
    drawData: {
        teamId: null
    }
}, {
});

joint.shapes.tct.StationLimitView = joint.dia.ElementView.extend({
    init() {
        console.log("--- StationLimit init ---");
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
            this.model.attr('label/fill', 'orange');
        } else {
            this.model.attr('border/stroke',BaseData.Colors.Track);
            this.model.attr('label/fill', BaseData.Colors.Track);
        }
    },

    /**
     * 更新布局外观
     */
    updateLayout() {
        let current = this.model.attributes;
        this.model.attr('label/text', `限速值${current.tctData.V}\n[${current.tctData.startCm}cm,${current.tctData.endCm}cm]`);
    },
    updatePort() {

    },  
    pointermove: function (evt, x, y) {
        
    },
    /**
     * 设置坡度信息
     * @param {*} rateInfo 
     */
    setStationLimitInfo(limitItem, rateInfo) {
        this.model.attributes.tctData.startCm = limitItem.startCm;
        this.model.attributes.tctData.endCm = limitItem.endCm;
        this.model.attributes.tctData.R = limitItem.R;
        this.model.attributes.tctData.H = limitItem.H;
        this.model.attributes.tctData.V = limitItem.V;

        let x1 = (limitItem.startCm - rateInfo.minKm) / rateInfo.rate + rateInfo.minX;
        x1 = Util.alignPointToGrid({ x: x1, y: 0 }, 30).x;

        let x2 = (limitItem.endCm - rateInfo.minKm) / rateInfo.rate + rateInfo.minX;
        x2 = Util.alignPointToGrid({ x: x2, y: 0 }, 30).x;

        this.model.attr('background/width', x2 - x1);
        this.model.attr('border/width', x2 - x1 - 2);

        if (Number(limitItem.direction) == 2) {
            this.model.position(x1, rateInfo.minY - 300);
        } else if(Number(limitItem.direction) == 1){
            this.model.position(x1, rateInfo.maxY + 330);
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
            '编辑车站限速'
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

export default StationLimit;