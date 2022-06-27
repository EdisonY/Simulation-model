let instance = null; // 全局VM

/**
 * 设置vue实例
 * @param {*} mv 
 */
export const setInstance = (vm) => {
    instance = vm;
};

/**
 * 保存数据
 */
export const saveAppData = () => {
    if (!instance) {
        return;
    }

    let data = { ...instance.$store.getters };
    // console.log('save------');
    // console.log(data);
    sessionStorage.setItem("cacheData", JSON.stringify(data));
};

/**
 * 加载数据
 */
export const loadAppData = (checkToken = true) => {
    if (!instance) {
        return;
    }
    let data = sessionStorage.getItem("cacheData");
    // console.log('load------');
    // console.log(data);
    instance.$store.commit("setCacheData", JSON.parse(data));
};

