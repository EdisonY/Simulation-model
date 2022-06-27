
import * as joint from "jointjs";
import BaseData from '@/views/lines/model/BaseData';

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let TopoStation = joint.dia.Element.define('tct.TopoStation', {
    attrs: {
        background: {
            width: 360,
            height: 90,
            x: 0,
            y: 0,
            rx:20,
            ry:20,
            fill: 'transparent',
            stroke: '#2fd991',
            'stroke-width': 6,
        },
        text: {
            "font-size": 36,
            fill: "white",
            ref: "background",
            refX: .5,
            refY: .20,
            text: "未命名站台",
            stroke: BaseData.Colors.StationText,
            "text-anchor": "middle",
            "dominant-baseline": "middle"
        }
    },
    markup: [{
        tagName: 'rect',
        selector: 'background'
    }, {
        tagName: 'text',
        selector: 'text'
    }],
    tctData: {
        typeName: "TopoStation",
        name: "TopoStation",
        tctId: BaseData.DefaultTctId,
    },
    drawData: {
        teamId: null,
        nodeUp: null,
        nodeDown: null
    }
}, {
});


joint.shapes.tct.TopoStationView = joint.dia.ElementView.extend({
    init() {
        this.updateLayout();
    },

    render() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
    },
    /**
     * 选中
     */
    select() {
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
            this.model.attr("background/stroke", '#2fd991');
            this.model.attr("background/fill", 'transparent');
        } else {
            this.model.attr("background/stroke", '#2fd991');
            this.model.attr("background/fill", 'transparent');
        }
    },
      /**
     * 更新布局外观
     */
    updateLayout() {
        let current = this.model.attributes;
        // 设置车站名称
        this.model.attr('text/text', current.tctData.name);
       
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
    pointerdown: function (evt, x, y) {
    
    },
    pointerup: function (evt, x, y) {

    },
    pointermove: function (evt, x, y) {


    },
});

export default TopoStation;