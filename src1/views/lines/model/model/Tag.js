
import * as joint from "jointjs";
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let Tag = joint.dia.Element.define('tct.Tag', {
    attrs: {
        text: {
            x: -10,
            y: -5,
            text: 'Tag',
            fill: 'red',
            stroke: 'red',
            'font-size':12
        }
    },
    markup: [{
        tagName: 'text',
        selector: 'text'
    }],
    tctData: {
        typeName: "Tag",
        tctId: 65535
    },
    drawData: {
        teamId: null,
        nodeParent: null
    },
}, {
});


joint.shapes.tct.TagView = joint.dia.ElementView.extend({
    init() {
    },

    render() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
    },

    select() {
    },
    unselect() {
    },
    updatePort() {
    },
    updateLayout() { },
    getPortCanUse() {
        /**
         * 获取可用端口
         */
        let port = null;
        return port;
    },
    combine(cell) {
        let teamInfo = {};
        return teamInfo;
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
     * 获取右键菜单
     */
    getMenus() {
        if (this.model.attributes.drawData.stationComponentId) {
            return ["更换站型", "删除车站"];
        }
        let menus = [
            '拆解',
            '复制',
            '删除'
        ];
        return menus;
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
});

export default Tag;