import * as joint from "jointjs";

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let TopoTrain = joint.dia.Element.define('tct.TopoTrain', {
    attrs: {
        abnormal:{
            width: 190,
            height: 84,
            x: -50,
            y: -15,
            rx:10,
            ry:10,
            fill:'transparent',
            stroke: 'transparent',
            'stroke-width': 6,
        },
        body: {
            width: 90,
            height: 54,
            x: 0,
            y: 0,
            fill: '#1a9513',
            // fill: '#222',
            stroke: '#1a9513',
            'stroke-width': 6,
        },
        text: {
            x:38,
            y:30,
            "font-size": 36,
            fill: "white",
            text: "000",
            "text-anchor": "middle",
            "dominant-baseline": "middle"
        },
        right:{
            d:'M 100,-3 130,27 100,57 z',
            fill:'yellow',
            'fill-opacity':1
        },
        left:{
            d:'M -10,-3 -40,27 -10,57 z',
            fill:'yellow',
            'fill-opacity':1
        },
        notify:{
            x:38,
            y:-30,
            "font-size": 40,
            "background": 'yellow',
            "font-weight": 'bold',
            fill: "red",
            text: "!!!",
            "text-anchor": "middle",
            "dominant-baseline": "middle",
            'fill-opacity':0.0
        }
    },
    markup: [
        {
            tagName: 'rect',
            selector: 'body'
        },
        {
            tagName:'rect',
            selector:'abnormal'
        },
        {
            tagName: 'text',
            selector: 'text'
        },
        {
            tagName: 'path',
            selector: 'left'
        },
        {
            tagName: 'path',
            selector: 'right'
        },
        {
            tagName:'text',
            selector:'notify'
        }
    ],
    tctData: {
        typeName: "车",
        tctId: 0,
        km: 0
    },
    drawData: {
        teamId: null,
        nodeNext: null
    },
}, {
});

joint.shapes.tct.TopoTrainView = joint.dia.ElementView.extend({
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
    notifyWarning(){
        this.model.attr('notify/fill-opacity',1.0);
        setTimeout(()=>{
            this.model.attr('notify/fill-opacity',0.0);
        },2500);
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


export default TopoTrain;