import * as joint from "jointjs";
import BaseData from '@/views/lines/model/BaseData';

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let TopoSignal = joint.dia.Element.define('tct.TopoSignal', {
    attrs: {
        background: {
            width: 30,
            height: 30,
            'fill-opacity': 0
        },
        mainLine: {
            fill: 'transparent',
            d: '',
            stroke: "#eee",
            'stroke-width': 2,
            opacity: 1.0
        },
        c1: {
            fill: '#c71a16',
            d: 'M 28 15 A 13,13 0 1 1 28,14 z',
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
        tagName: 'text',
        selector: 'label'
    }],
    // 对象属性，自定义数据结构
    tctData: {
        typeName: "信号机",
        tctId: BaseData.DefaultTctId,
        km: 0,
        signalDirection:BaseData.SignalDirection.Up,
        signalType: BaseData.SignalType.TWO_SHORT
    },
    drawData: {
        teamId: null,
        nodeParent: null
    }
}, {
});


joint.shapes.tct.TopoSignalView = joint.dia.ElementView.extend({
    passivePointDown: { x: 0, y: 0 },
    init() {
        this.updateLayout();
    },

    render() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
    },
    pointerdown: function (evt, x, y) {
    
    },
    pointerup: function (evt, x, y) {

    },
    pointermove: function (evt, x, y) {


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
        
    },
    /**
     * 更新布局外观
     */
    updateLayout() {
        let current = this.model.attributes;

        this.model.attr('out/stroke-opacity', 1);
       
        if (current.tctData.signalDirection == BaseData.SignalDirection.Down) {
            this.model.attr('mainLine/d', `M 30 0 L 30 30`);
        }else{
            this.model.attr('mainLine/d', `M 0 0 L 0 30`);
        }

       
        this.model.attr('mainLine/stroke', '#EEE');

        this.model.attr('label/text', 'XHJ' + current.tctData.tctId);
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

});

export default TopoSignal;