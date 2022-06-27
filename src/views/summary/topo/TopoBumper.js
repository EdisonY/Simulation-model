import * as joint from "jointjs";
import BaseData from '@/views/lines/model/BaseData';

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let TopoBumper = joint.dia.Element.define('tct.TopoBumper', {
    attrs: {
        left: {
            fill: 'transparent',
            d: 'M -30 -20 H 5 Q 15 0 5 20 L -30 20',
            stroke: '#c71a16',
            'stroke-width': 15
        },
    },
    markup: [
        {
            tagName: 'path',
            selector: 'left'
        },
    ],
    tctData: {
        typeName: "车挡",
        tctId: BaseData.DefaultTctId,
        km: 0
    },
    drawData: {
        teamId: null,
        nodeNext: null
    }
}, {
});

joint.shapes.tct.TopoBumperView = joint.dia.ElementView.extend({
    init() {
        this.VSelect = null;
        this.VPort = null;
    },
    render() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
    },
    /**
     * 选中
     */
    select() {
    },
    /**
     * 取消选中
     */
    unselect() {
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


export default TopoBumper;