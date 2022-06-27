import * as joint from "jointjs";

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let UICPolyline = joint.dia.Element.define('tct.UICPolyline', {
    attrs: {
        polyline: {
            x: 0,
            y: 0,
            stroke: 'blue',
            'stroke-width': 2,
            fill: 'none',
            'fill-opacity': 0
        }
    },
    markup: [
        {
            tagName: 'path',
            selector: 'polyline'
        }
    ],
    detail: {
        type: '折线'
    }
}, {
    /**
     * 设置曲线值
     * @param {*} cfg 
     */
    configData(cfg,color) {
        if (cfg && cfg.length > 0) {
            this.position(0, 0);
            let data = `M `;
            cfg.forEach(c => {
                data += `${c.x},${c.y} L `;
            });
            data = data.substring(0, data.length - 2);
            this.attr('polyline/d', data);
            // let colors = ['red', 'blue', 'orange', 'white', 'purple'];
            // this.attr('polyline/stroke', colors[(parseInt(Math.random() * 100) % colors.length)]);
            this.attr('polyline/stroke', color);
        }
    }
});

joint.shapes.tct.UICPolylineView = joint.dia.ElementView.extend({
    init() {
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
    pointermove: function (evt, x, y) {

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

export default UICPolyline;