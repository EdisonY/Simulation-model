import * as joint from "jointjs";
import * as Util from "@/utils/util";
import BaseData from "../BaseData";

const g = joint.g;
const V = joint.V;
joint.shapes.tct = joint.shapes.tct ? joint.shapes.tct : {};

let Point = joint.dia.Element.define('tct.Point', {
  attrs: {
    background: {
      width: 60,
      height: 30,
      'fill-opacity': 0
    },
    main: {
      x1: 0,
      y1: 30,
      x2: 60,
      y2: 30,
      "stroke-width": 8,
      stroke: BaseData.Colors.PointMain
    },
    point: {
      x1: 0,
      y1: 0,
      x2: 30,
      y2: 30,
      "stroke-width": 6,
      stroke: BaseData.Colors.Point
    },
    rect: {
      width: 40,
      height: 10,
      x: 10,
      y: 20,
      fill: BaseData.Colors.PointBlock
    },
    label: {
      "font-size": 11,
      text: "道岔",
      fill: "pink",
      x: 15,
      y: -10
    },
    labelKm: {
      "font-size": 11,
      text: "K",
      fill: "#ccc",
      x: 15,
      y: 60
    }
  },
  markup: [{
    tagName: 'rect',
    selector: 'background',
  }, {
    tagName: 'line',
    selector: 'main',
  }, {
    tagName: 'line',
    selector: 'point',
  }, {
    tagName: 'rect',
    selector: 'rect',
  }, {
    tagName: 'text',
    selector: 'label'
  }, {
    tagName: 'text',
    selector: 'labelKm'
  }],
  tctData: {
    typeName: "道岔",
    tctId: BaseData.DefaultTctId,
    pointName: '道岔',
    pointType: BaseData.PointType.N9Direct,
    km: 0,
    direction: BaseData.Direction.NotSet,
    pointDirection: BaseData.PointDirection.Left,
    mainSpeedLimit: 0,
    sideSpeedLimit: 0
  },
  drawData: {
    teamId: null,
    nodeLeft: null,
    nodeMiddle: null,
    nodeRight: null
  }
}, {

});


joint.shapes.tct.PointView = joint.dia.ElementView.extend({
  init() {
    this.updateLayout();
    // 端口连接
    this.VSelect = null;
    this.VPortLeft = null;
    this.VPortMiddle = null;
    this.VPortRight = null;
  },

  render() {
    joint.dia.ElementView.prototype.render.apply(this, arguments);
    this.updatePort();
  },
  /**
   * 选中
   */
  select(rect) { // 每个自定义图元要实现select和unselect方法
    // this.highlight();
    this._setOutlineRectVisibility(true, rect);
  },
  /**
   * 取消选中
   */
  unselect() { // 每个自定义图元要实现select和unselect方法
    // this.unhighlight();
    this._setOutlineRectVisibility(false);
  },
  _setOutlineRectVisibility(visible, rect) {
    if (visible) {
      if (!this.VSelect) {
        this.VSelect = V("rect");
      }
      if (rect) {
        let r = this.getRect();

        if (this.model.attributes.angle == 0) {
          this.VSelect.attr({
            x: rect.x - r.x,
            y: rect.y - r.y,
            width: rect.width,
            height: rect.height,
            fill: "#222",
            "fill-opacity": 0.3,
            "stroke-width": 2,
            stroke: BaseData.Colors.Selected
          });
        } else {
          this.VSelect.attr({
            x: r.x - rect.x - rect.width + 60,
            y: r.y - rect.y - rect.height - 30,
            width: rect.width,
            height: rect.height,
            fill: "#222",
            "fill-opacity": 0.3,
            "stroke-width": 2,
            stroke: BaseData.Colors.Selected
          });
        }
      } else {
        this.VSelect.attr({
          width: 68,
          height: 38,
          x: -4,
          y: -4,
          "fill-opacity": 0,
          "stroke-width": 2,
          stroke: BaseData.Colors.Selected
        });
      }
      this.vel.append([this.VSelect]);

    } else {
      if (this.VSelect) {
        this.VSelect.remove();
        this.VSelect = null;
      }
    }
  },
  /**
   * 更新端口
   */
  updatePort() {
    let model = this.model;
    if (model.attributes.drawData.nodeLeft) {
      if (this.VPortLeft) {
        this.VPortLeft.remove();
        this.VPortLeft = null;
      }
    } else {
      if (!this.VPortLeft) {
        this.VPortLeft = V("rect");
      }
      this.VPortLeft.attr({
        x: model.attr("main/x1") - 3,
        y: model.attr("main/y1") - 3,
        width: 6,
        height: 6,
        stroke: "red",
        fill: "#EEE",
        "stroke-width": 3,
      });
      this.vel.append([this.VPortLeft]);
    }

    if (model.attributes.drawData.nodeMiddle) {
      if (this.VPortMiddle) {
        this.VPortMiddle.remove();
        this.VPortMiddle = null;
      }
    } else {
      if (!this.VPortMiddle) {
        this.VPortMiddle = V("rect");
      }
      this.VPortMiddle.attr({
        x: model.attr("point/x1") - 3,
        y: model.attr("point/y1") - 3,
        width: 6,
        height: 6,
        stroke: "red",
        fill: "#EEE",
        "stroke-width": 3,
      });
      this.vel.append([this.VPortMiddle]);
    }

    if (model.attributes.drawData.nodeRight) {
      if (this.VPortRight) {
        this.VPortRight.remove();
        this.VPortRight = null;
      }
    } else {
      if (!this.VPortRight) {
        this.VPortRight = V("rect");
      }
      this.VPortRight.attr({
        x: model.attr("main/x2") - 3,
        y: model.attr("main/y2") - 3,
        width: 6,
        height: 6,
        stroke: "red",
        fill: "#EEE",
        "stroke-width": 3,
      });
      this.vel.append([this.VPortRight]);
    }

    if (this.model.attributes.angle == 180) {
      this.model.attr('label/transform', "rotate(180,30,15)");
    } else {
      this.model.attr('label/transform', "rotate(0,30,15)");
    }
  },
  /**
   * 更新布局外观
   */
  updateLayout() {
    let current = this.model.attributes;
    this.model.attr('label/text', '道岔' + current.tctData.tctId);
    if (BaseData.PointLimit[current.tctData.pointType]) {
      current.tctData.mainSpeedLimit = BaseData.PointLimit[current.tctData.pointType].Main;
      current.tctData.sideSpeedLimit = BaseData.PointLimit[current.tctData.pointType].Side;
    }
    this.updatePort();
    this.getKmStr();
  },

  getKmStr() {
    let km = Number(this.model.attributes.tctData.km);
    if (!(km > 0)) {
        this.model.attributes.tctData.km = 0;
        km = 0;
    }
    km = parseInt(km);

    let str = `K${parseInt(km / 1000)}+${km % 1000}`;
    this.model.attr('labelKm/text', str);
},
  /**
   * 获取可用端口
   */
  getPortCanUse() {
    let ports = null;
    let model = this.model.attributes;
    let angleCoefficient = 1;
    if (this.model.attributes.angle == 180) {
      angleCoefficient = -1;
    }

    if (!model.drawData.nodeLeft) {
      let port = {
        x: model.attrs.main.x1 * angleCoefficient + model.position.x,
        y: model.attrs.main.y1 * angleCoefficient + model.position.y
      }
      ports = { portLeft: port };
    }

    if (!model.drawData.nodeMiddle) {
      let port = {
        x: model.attrs.point.x1 * angleCoefficient + model.position.x,
        y: model.attrs.point.y1 * angleCoefficient + model.position.y
      }
      if (ports) {
        ports.portMiddle = port;
      } else {
        ports = { portMiddle: port };
      }
    }

    if (!model.drawData.nodeRight) {
      let port = {
        x: model.attrs.main.x2 * angleCoefficient + model.position.x,
        y: model.attrs.main.y2 * angleCoefficient + model.position.y
      }
      if (ports) {
        ports.portRight = port;
      } else {
        ports = { portRight: port };
      }
    }

    return ports;
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
   * 将当前计轴连接到轨道线
   * @param {*} trackView 轨道线
   */
  combine(trackView) {
    let teamInfo = {};

    let pointPorts = this.getPortCanUse();
    if (!pointPorts) {
      return teamInfo;
    }

    if (trackView.model.attributes.type != 'tct.Track') {
      return teamInfo;
    }

    let trackPorts = trackView.getPortCanUse();
    if (!trackPorts) {
      return teamInfo;
    }

    if (pointPorts.portLeft && trackPorts.portOne && pointPorts.portLeft.x == trackPorts.portOne.x && pointPorts.portLeft.y == trackPorts.portOne.y) {
      teamInfo = this._connectTrackPort(trackView, 'portLeft', 'portOne');
    } else if (pointPorts.portLeft && trackPorts.portTwo && pointPorts.portLeft.x == trackPorts.portTwo.x && pointPorts.portLeft.y == trackPorts.portTwo.y) {
      teamInfo = this._connectTrackPort(trackView, 'portLeft', 'portTwo');
    } else if (pointPorts.portMiddle && trackPorts.portOne && pointPorts.portMiddle.x == trackPorts.portOne.x && pointPorts.portMiddle.y == trackPorts.portOne.y) {
      teamInfo = this._connectTrackPort(trackView, 'portMiddle', 'portOne');
    } else if (pointPorts.portMiddle && trackPorts.portTwo && pointPorts.portMiddle.x == trackPorts.portTwo.x && pointPorts.portMiddle.y == trackPorts.portTwo.y) {
      teamInfo = this._connectTrackPort(trackView, 'portMiddle', 'portTwo');
    } else if (pointPorts.portRight && trackPorts.portOne && pointPorts.portRight.x == trackPorts.portOne.x && pointPorts.portRight.y == trackPorts.portOne.y) {
      teamInfo = this._connectTrackPort(trackView, 'portRight', 'portOne');
    } else if (pointPorts.portRight && trackPorts.portTwo && pointPorts.portRight.x == trackPorts.portTwo.x && pointPorts.portRight.y == trackPorts.portTwo.y) {
      teamInfo = this._connectTrackPort(trackView, 'portRight', 'portTwo');
    }

    return teamInfo;
  },
  /**
   * 连接端口
   * @param {*} trackView 待连接的trackView,Team信息以trackView为主
   */
  _connectTrackPort(trackView, portNum, trackPortNum) {
    if (portNum == 'portLeft') {
      this.model.attributes.drawData.nodeLeft = { id: trackView.model.attributes.id, type: trackView.model.attributes.type, port: trackPortNum };
    } else if (portNum == 'portMiddle') {
      this.model.attributes.drawData.nodeMiddle = { id: trackView.model.attributes.id, type: trackView.model.attributes.type, port: trackPortNum };
    } else if (portNum == 'portRight') {
      this.model.attributes.drawData.nodeRight = { id: trackView.model.attributes.id, type: trackView.model.attributes.type, port: trackPortNum };
    }

    if (trackPortNum == 'portOne') {
      trackView.model.attributes.drawData.nodeOne = { id: this.model.attributes.id, type: this.model.attributes.type, port: portNum };
    } else if (trackPortNum == 'portTwo') {
      trackView.model.attributes.drawData.nodeTwo = { id: this.model.attributes.id, type: this.model.attributes.type, port: portNum };
    }

    // 统一设置teamId，并返回teamId信息
    let lineTeamId = trackView.model.attributes.drawData.teamId;
    let thisTeamId = this.model.attributes.drawData.teamId;
    let teamInfo = {
      from: this,
      to: trackView,
      stop: true  // 后续是否停止
    };
    if (!lineTeamId && !thisTeamId) {
      teamInfo.teamId = Util.getUUID();
      teamInfo.addIds = [this.model.attributes.id, trackView.model.attributes.id];
      if (trackView.model.attributes.elements) {
        trackView.model.attributes.elements.forEach(e => {
          teamInfo.addIds.push(e.id);
        });
      }
      if (trackView.model.attributes.stations) {
        trackView.model.attributes.stations.forEach(s => {
          teamInfo.addIds.push(s.id);
        });
      }
    } else if (lineTeamId) {
      teamInfo.teamId = lineTeamId;
      teamInfo.oldTeamId = thisTeamId;
      teamInfo.addIds = [this.model.attributes.id];
    } else if (thisTeamId) {
      teamInfo.teamId = thisTeamId;
      teamInfo.oldTeamId = lineTeamId;
      teamInfo.addIds = [trackView.model.attributes.id];
      if (trackView.model.attributes.elements) {
        trackView.model.attributes.elements.forEach(e => {
          teamInfo.addIds.push(e.id);
        });
      }
      if (trackView.model.attributes.stations) {
        trackView.model.attributes.stations.forEach(s => {
          teamInfo.addIds.push(s.id);
        });
      }
    }
    this.model.attributes.drawData.teamId = teamInfo.teamId;
    trackView.model.attributes.drawData.teamId = teamInfo.teamId;
    trackView.updatePort();
    this.updatePort();
    return teamInfo;
  },
  /**
   * 获取右键菜单
   */
  getMenus() {
    if (this.model.attributes.drawData.stationComponentId) {
      return ["更换站型", "删除车站"];
    }
    let menus = [
      '改变岔尖',
      '旋转',
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
    let drawData = this.model.attributes.drawData;

    if (node) {
      if (this.model.attributes.id == node.id) {
        if (node.port == 'portLeft') {
          data.relatedNodes = [this.model.attributes.drawData.nodeLeft];
          this.model.attributes.drawData.nodeLeft = null;
        } else if (node.port == 'portMiddle') {
          data.relatedNodes = [this.model.attributes.drawData.nodeMiddle];
          this.model.attributes.drawData.nodeMiddle = null;
        } else if (node.port == 'portRight') {
          data.relatedNodes = [this.model.attributes.drawData.nodeRight];
          this.model.attributes.drawData.nodeRight = null;
        }
      }

    } else {
      if (this.model.attributes.drawData.nodeLeft) {
        data.relatedNodes.push(this.model.attributes.drawData.nodeLeft);
        this.model.attributes.drawData.nodeLeft = null;
      }
      if (this.model.attributes.drawData.nodeMiddle) {
        data.relatedNodes.push(this.model.attributes.drawData.nodeMiddle);
        this.model.attributes.drawData.nodeMiddle = null;
      }
      if (this.model.attributes.drawData.nodeRight) {
        data.relatedNodes.push(this.model.attributes.drawData.nodeRight);
        this.model.attributes.drawData.nodeRight = null;
      }
    }

    if (!drawData.nodeLeft && !drawData.nodeMiddle && !drawData.nodeRight) {
      data.removeTeamId = this.model.attributes.drawData.teamId;
      this.model.attributes.drawData.teamId = null;
    }
    this.updatePort();
    return data;
  },
  action(menu) {
    if (menu == '旋转') {
      // this.model.rotate(180);
      if (this.model.attributes.angle == 0) {
        this.model.rotate(180, true, { x: this.model.attributes.position.x + 30, y: this.model.attributes.position.y + 15, });
      } else {
        this.model.rotate(0, true, { x: this.model.attributes.position.x - 30, y: this.model.attributes.position.y - 15, });
      }

      let p = Util.alignPointToGrid(this.model.attributes.position, 30);
      this.model.position(p.x, p.y);
      this.updatePort();
    } else if (menu == '改变岔尖') {
      if (this.model.attributes.tctData.pointDirection == BaseData.PointDirection.Left) {
        this.model.attributes.tctData.pointDirection = BaseData.PointDirection.Right;
        this.model.attr("point/x1", 60);
      } else {
        this.model.attributes.tctData.pointDirection = BaseData.PointDirection.Left;
        this.model.attr("point/x1", 0);
      }
      this.updatePort();
    } else if (menu == '拆解') {
      this.updatePort();
    } else if (menu == '删除') {
      this.updatePort();
      this.model.remove();
    }
  },
  /**
   * 获取公里标
   */
  getKm() {
    return {
      km: this.model.attributes.tctData.km,
      kmOffset: this.model.attributes.tctData.kmOffset,
      kmCm: this.model.attributes.tctData.km * 100000 + this.model.attributes.tctData.kmOffset * 100,
    };
  },
  getPosition() {
    if (this.model.attributes.angle == 0) {
      return {
        x: this.model.attributes.position.x + 30,
        y: this.model.attributes.position.y
      }
    } else {
      return {
        x: this.model.attributes.position.x - 30,
        y: this.model.attributes.position.y - 30
      }
    }
  },
  getRect() {
    if (this.model.attributes.angle == 0) {
      return {
        x: this.model.attributes.position.x,
        y: this.model.attributes.position.y,
        width: 60,
        height: 30
      }
    } else {
      return {
        x: this.model.attributes.position.x - 60,
        y: this.model.attributes.position.y + 30,
        width: 60,
        height: 30
      }
    }
  }
});

export default Point;