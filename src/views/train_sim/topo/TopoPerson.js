import * as joint from "jointjs";

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let TopoPerson = joint.dia.Element.define('tct.TopoPerson', {
    attrs: {
        head:{
            cx:0,
            cy:-50,
            r:10,
            x: 0,
            y: 0
        },
        body: {
            d: 'M 0 -50 L -12 -20,12 -20 z',
            x: 0,
            y: 0
        },
    },
    markup: [
        {
            tagName: 'circle',
            selector: 'head'
        },
        {
            tagName:'path',
            selector:'body'
        }
    ],
    tctData: {
        typeName: "人",
        tctId: 0,
        km: 0
    },
    drawData: {
        teamId: null,
        nodeNext: null
    },
}, {
});

joint.shapes.tct.TopoPersonView = joint.dia.ElementView.extend({
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


export default TopoPerson;