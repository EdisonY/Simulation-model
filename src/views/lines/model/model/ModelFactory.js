import Axle from './Axle';
import Balise from './Balise';
import Bumper from './Bumper';
import Point from './Point';
import Signal from './Signal';
import Station from './Station';
import Stop from './Stop';
import StopArea from './StopArea';
import Tag from './Tag';
import Track from './Track';
import VirtualLine from './VirtualLine';
import VirtualPort from './VirtualPort';
import Grade from './Grade';
import Limit from './Limit';
import StationLimit from './StationLimit';

/**
 * 工厂类-生成元素
 */
let ModelFactory = {};

/**
 * 根据model生成获取新的图元实例
 * @param {*} model 图元model
 */
ModelFactory.getInstance = (model) => {
    let instance = null;
    if (model.type == "tct.Track") {
        instance = new Track(model);
    } else if (model.type == "tct.Station") {
        instance = new Station(model);
    } else if (model.type == "tct.Point") {
        instance = new Point(model);
    } else if (model.type == "tct.Bumper") {
        instance = new Bumper(model);
    } else if (model.type == "tct.Axle") {
        instance = new Axle(model);
    } else if (model.type == "tct.Balise") {
        instance = new Balise(model);
    } else if (model.type == "tct.Signal") {
        instance = new Signal(model);
    } else if (model.type == "tct.Stop") {
        instance = new Stop(model);
    } else if (model.type == "tct.StopArea") {
        instance = new StopArea(model);
    } else if (model.type == "tct.VirtualLine") {
        instance = new VirtualLine(model);
    }else if (model.type == "tct.VirtualPort") {
        instance = new VirtualPort(model);
    } else if (model.type == "tct.Tag") {
        instance = new Tag(model);
    } else if (model.type == "tct.Grade") {
        instance = new Grade(model);
    }else if (model.type == "tct.Limit") {
        instance = new Limit(model);
    } else if (model.type == "tct.StationLimit") {
        instance = new StationLimit(model);
    } else {
        console.log("没有匹配到元素:", model);
    }
    return instance;
};

/**
 * 根据类型名称生成获取新的图元实例
 * @param {string} typename 类型名
 */
ModelFactory.getInstanceByTypeName = (typename) => {
    let instance = null;
    if (typename == "连接线") {
        instance = new Track();
    } else if (typename == "车站") {
        instance = new Station();
    } else if (typename == "道岔") {
        instance = new Point();
    } else if (typename == "车挡") {
        instance = new Bumper();
    } else if (typename == "计轴") {
        instance = new Axle();
    } else if (typename == "应答器") {
        instance = new Balise();
    } else if (typename == "信号机") {
        instance = new Signal();
    } else if (typename == "停车点") {
        instance = new Stop();
    } else if (typename == "停车区域") {
        instance = new StopArea();
    } else if (typename == "虚拟连线") {
        instance = new VirtualLine();
    }else if (typename == "虚拟端口") {
        instance = new VirtualPort();
    }else if (typename == "标签") {
        instance = new Tag();
    }else if (typename == "坡度") {
        instance = new Grade();
    }else if (typename == "限速") {
        instance = new Limit();
    }else if (typename == "车站限速") {
        instance = new StationLimit();
    }else {
        console.log("没有匹配到元素:", typename);
    }
    return instance;
};

export default ModelFactory;