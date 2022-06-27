import * as Util from '@/utils/util';
/**
 * 定义全局的数据结构，用于绘图和项目相关的信息保存
 */
class ProjectData {
    constructor(data) {
        this.projectName = "未命名线路";
        this.projectId = Util.getUUID();
        this.projectDescription = "";
        this.createTime = new Date();
        this.updateTime = new Date();
        this.paperInfo = {
            backgroundColor: "#304156",
            mainLineColor: "#001528",
            subLineColor: "#1f2d3d",
            showGrid: true,
            translate: {
                tx: 0,
                ty: 0
            },
            scale: 1
        };
        this.assistInfo = {
            showCoordinate: false,
            showMiniMap: false,
            locked: false
        };
        this.teams = [];
        this.selectedCell = null;
        this.contextMenuEvt = null;
        this.contextMenuVisible = false;
        this.contextMenuCell = null;
        this.gradeInfo = { uniformGradeValue: 0, useUniform: true, data: [] };
        this.limitInfo = {
            uniformLimitValue: 85,
            platFormV: 60,
            useUniform: true,
            data: [],
        };
        this.limitInfoByUser = { data: [] };
    }
}

let data = null;

export const getProjectData = function () {
    return new ProjectData();
};
