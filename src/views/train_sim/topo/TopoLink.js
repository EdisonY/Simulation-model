import * as joint from "jointjs";
import BaseData from '@/views/lines/model/BaseData';

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let TopoLink = joint.dia.Element.define('tct.TopoLink', {
    attrs: {
        line: {
            class: 'testclass',
            x1: 0,
            y1: 0,
            x2: 150,
            y2: 0,
            "stroke-width": 30,
            stroke: '#30499f',
        },
        label: {
            x: 75,
            y: 0,
            'font-size': 24,
            fill: '#EEE',
            text: '2'
        }
    },
    markup: [
        {
            tagName: 'line',
            selector: 'line',
        },
        {
            tagName: 'text',
            selector: 'label',
        }],
    tctData: {
        typeName: "TopoLink",
        tctId: BaseData.DefaultTctId,
        km: 0,
        kmOffset: 0,
        direction: BaseData.Direction.NotSet
    },
    drawData: {
        teamId: null
    }
}, {
});


joint.shapes.tct.TopoLinkView = joint.dia.ElementView.extend({
    init() {
    },
    render() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
    },
    // pointerdown: function (evt, x, y) {

    // },
    pointerup: function (evt, x, y) {

    },
    pointermove: function (evt, x, y) {


    },
    /**
     * 选中
     */
    select() { // 每个自定义图元要实现select和unselect方法
        this._setOutlineRectVisibility(true);
        this.model.set('z', 10);
    },
    /**
     * 取消选中
     */
    unselect() { // 每个自定义图元要实现select和unselect方法
        // this.unhighlight();
        this._setOutlineRectVisibility(false);
        this.model.set('z', 1);
    },
    _setOutlineRectVisibility(visible, rect) {
        if (visible) {
            this.model.attr("line/stroke", '#637BC2');
            this.model.attr("label/fill", 'yellow');
        } else {
            this.model.attr("line/stroke", '#30499f');
            this.model.attr("label/fill", '#EEE');
            if (this.VSelect) {
                this.VSelect.remove();
                this.VSelect = null;
            }
        }
    },
    toggle() {
        if (this.model.attributes.drawData.toggle) {
            this.model.attributes.drawData.toggle = false;
            this.model.attr("line/stroke", '#30499f');
        } else {
            this.model.attributes.drawData.toggle = true;
            this.model.attr("line/stroke", '#F56C6C');
        }
    },
    /**
     * 设置颜色
     */
    setColor(color) {
        this.model.attr('line/stroke', color);
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
},
    {
    },

);

export default TopoLink;