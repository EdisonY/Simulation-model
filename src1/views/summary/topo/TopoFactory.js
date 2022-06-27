import TopoStation from './TopoStation';
import TopoBumper from './TopoBumper';
import TopoSignal from './TopoSignal';
import TopoLink from './TopoLink';


/**
 * 工厂类-生成元素
 */
let TopoFactory = {};

/**
 * 根据model生成获取新的图元实例
 * @param {*} type 图元model
 */
TopoFactory.getInstance = (type) => {
    let instance = null;
    if (type == "tct.TopoStation") {
        instance = new TopoStation();
    } else if (type == "tct.TopoBumper") {
        instance = new TopoBumper();
    } else if (type == "tct.TopoSignal") {
        instance = new TopoSignal();
    } else if (type == "tct.TopoLink") {
        instance = new TopoLink();
    } else {
        console.log("没有匹配到元素:", type);
    }
    return instance;
};

export default TopoFactory;