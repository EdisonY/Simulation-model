import * as joint from "jointjs";

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let UICLabel = joint.dia.Element.define('tct.UICLabel', {
    attrs: {
        bline: {
            x1: 50,
            y1: 0,
            x2: 101,
            y2: 0,
            stroke: '#708090',
            'stroke-width': 1,
            'stroke-dasharray': '10 12'
        },
        label: {
            "font-size": 10,
            text: "",
            fill: "#EEE",
            x: 0,
            y: 0
        }
    },
    markup: [
        {
            tagName: 'line',
            selector: 'bline'
        },
        {
            tagName: 'text',
            selector: 'label'
        }
    ]
}, {
    /**
    * 配置数据
    * @param {*} cfg 
    */
    configTimeData(y, time, length) {
        this.attr('bline/x2', length + 200);
        this.attr('label/text', this.formatTime(time / 1000));
        this.position(-100, y);
        this.set('z', -10);
    },
    configStationData(x, miny, maxy) {
        this.attr('bline/x1', 0);
        this.attr('bline/x2', 0);
        this.attr('bline/y1', miny);
        this.attr('bline/y2', maxy);
        this.position(x, 0);
        this.set('z', -10);
    },
    formatTime(time) {
        let hour = parseInt(time / 3600)
            .toString()
            .padStart(2, "0");
        let minute = parseInt((time % 3600) / 60)
            .toString()
            .padStart(2, "0");
        let second = parseInt(time % 60)
            .toString()
            .padStart(2, "0");
        return `${hour}:${minute}:${second}`;
    },


});

joint.shapes.tct.UICLabelView = joint.dia.ElementView.extend({
    init() {
        // console.log("--- UICLabel init ---");
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

export default UICLabel;