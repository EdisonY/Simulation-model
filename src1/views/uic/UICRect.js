import * as joint from "jointjs";

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let UICRect = joint.dia.Element.define('tct.UICRect', {
    attrs: {
        background: {
            x: 0,
            y: 0,
            width: 100,
            height: 20,
            fill: 'red',
            'fill-opacity': 0.5
        },
        label: {
            "font-size": 11,
            text: "BLOCK",
            fill: "#EEE",
            x: 0,
            y: 0
        }
    },
    markup: [
        {
            tagName: 'rect',
            selector: 'background'
        },
        {
            tagName: 'text',
            selector: 'label'
        }
    ],
    detail: {
        type: "未定义"
    }
}, {
    /**
     * 配置矩形数据
     * @param {*} cfg 
     */
    configData(cfg) {
        if (cfg.type == '车站') {
            this.attributes.detail.type = cfg.type;
            this.attr('label/text', cfg.name);
            this.position(cfg.x, cfg.y);
            this.attr('background/fill', '#0d629b');
            this.attr('background/stroke', 'white');
            this.attr('background/width', cfg.width);
            this.attr('background/height', cfg.height);
            this.attr('label/x', 10);
            this.attr('label/y', 15);
            this.attr('label/font-size', 16);
            this.attr('label/font-weight', 'bold');
        } else if (cfg.type == '分区') {
            this.attributes.detail.type = cfg.type;
            this.attr('label/text', cfg.name);
            this.position(cfg.x, cfg.y);
            if (cfg.isChokePoint == 1) {
                this.attr('background/fill', '#f00');
            } else {
                this.attr('background/fill', '#61a0a8');
            }
            this.attr('background/stroke', 'white');
            this.attr('background/width', cfg.width);
            this.attr('background/height', cfg.height);
            this.attr('label/x', cfg.width / 2 - 28);
            this.attr('label/y', cfg.height / 2 + 2);
            this.attr('label/font-size', 14);
            this.attr('label/font-weight', 'bold');
        } else if (cfg.type == '列车') {
            this.attributes.detail.type = cfg.type;
            this.attributes.detail.TimeNames = cfg.TimeNames;
            this.attributes.detail.TimeValues = cfg.TimeValues;
            this.attr('label/text', cfg.name);
            this.position(cfg.x, cfg.y);
            if (cfg.isChokePoint == 1) {
                this.attr('background/fill', '#f00');
            } else {
                this.attr('background/fill', cfg.color);
            }
            this.attr('background/fill-opacity', 1.0);
            this.attr('background/stroke', cfg.color);
            this.attr('background/width', cfg.width);
            this.attr('background/height', cfg.height);
            this.attr('label/x', cfg.width / 2 - 28);
            this.attr('label/y', 15);
            this.attr('label/font-size', 14);
            this.attr('label/font-weight', 'bold');
            this.attr('label/fill', 'black');
        }
    }
});

joint.shapes.tct.UICRectView = joint.dia.ElementView.extend({
    init() {
        // console.log("--- UICRect init ---");
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

export default UICRect;