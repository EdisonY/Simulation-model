<template>
    <div>
        <div class="main">
            <!-- <div class="title">{{ title }}</div> -->
            <div class="menu">
                <el-dropdown class="dropdown"
                    placement="bottom"
                    @command="btnClick">
                    <span class="el-dropdown-link">文件</span>
                    <el-dropdown-menu>
                        <el-dropdown-item command="onNewProject">新建</el-dropdown-item>
                        <el-dropdown-item command="onImportProjectFile">打开...</el-dropdown-item>
                        <el-dropdown-item command="onExportProjectFile">导出</el-dropdown-item>
                        <el-dropdown-item command="onSaveAsComponent">导出为站型...</el-dropdown-item>
                        <el-dropdown-item command="onExportProjectToPng">输出为图片...</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown class="dropdown"
                    placement="bottom"
                    @command="btnClick">
                    <span class="el-dropdown-link">车站组件</span>
                    <el-dropdown-menu>
                        <el-dropdown-item command="onImportComponent">导入...</el-dropdown-item>
                        <el-dropdown-item command="onExportComponent">导出...</el-dropdown-item>
                        <el-dropdown-item command="onExportProjectToPng">输出为图片...</el-dropdown-item>
                        <el-dropdown-item command="onClearCache">清除</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown class="dropdown"
                    placement="bottom"
                    @command="btnClick">
                    <span class="el-dropdown-link">导入数据</span>
                    <el-dropdown-menu>
                        <el-dropdown-item command="onSetGrade">坡度...</el-dropdown-item>
                        <el-dropdown-item command="onSetLimit">曲线...</el-dropdown-item>
                        <el-dropdown-item command="onSetLimitByUser">限速...</el-dropdown-item>
                        <el-dropdown-item command="onSetPoint">道岔...</el-dropdown-item>
                        <el-dropdown-item command="onSetEnterRoute">进路(仅固定闭塞)...</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown class="dropdown"
                    v-show="false"
                    placement="bottom"
                    @command="btnClick">
                    <span class="el-dropdown-link">运行</span>
                    <el-dropdown-menu>
                        <el-dropdown-item command="onStartTest">开始能力计算</el-dropdown-item>
                        <el-dropdown-item command="onSetRunParam">上传</el-dropdown-item>
                        <el-dropdown-item v-show='false'
                            command="ontest">停止</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown class="dropdown"
                    placement="bottom"
                    @command="dataTest">
                    <span class="el-dropdown-link"
                        v-show="true">视图</span>
                    <el-dropdown-menu>
                        <el-dropdown-item command="drawLink">画Link</el-dropdown-item>
                        <el-dropdown-item command="clearLink">删Link</el-dropdown-item>
                        <!-- <el-dropdown-item command="fsSetting">同步FS数据</el-dropdown-item>
                        <el-dropdown-item command="test">测试</el-dropdown-item> -->
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="base-icon-list">
                <ul>
                    <li draggable="true"
                        @dragstart="drag($event, bicon)"
                        v-for="(bicon, index) in baseIcons"
                        :key="index"
                        :title="bicon.description">
                        <el-tooltip class="item"
                            effect="dark"
                            :content="bicon.description"
                            :placement="bicon.tooltipPlacement">
                            <img :src="require('../../../assets/primitive/' + bicon.iconClass)" />
                        </el-tooltip>
                    </li>
                </ul>
            </div>
            <el-checkbox v-model="showStationPanel"
                style="margin-left:20px">车站组件</el-checkbox>
            <div style="flex:1;">
                <el-button size="small"
                    type="primary"
                    style="width:220px;float:right;margin-right:-10px"
                    @click="btnClick('onSetRunParam')">保存</el-button>
            </div>
        </div>
        <div class="complex-component-list"
            v-show="showStationPanel"
            @click="select()">
            <ul>
                <li draggable="true"
                    @dragstart="dragComponent($event,component)"
                    v-for="(component,index) in tctComponents"
                    :key="index"
                    :title="component.desc">
                    <div :class="complexSelect&&complexSelect.id==component.id?'component-selected':'component-unselected'">
                        <img :src="component.thumbnail"
                            @click.stop="select(component)" />
                        <div class="component-name">{{component.name}}</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: ["title"],
    data() {
        return {
            baseIcons: [
                {
                    name: "Line",
                    description: "连接线",
                    iconClass: "track.svg",
                    tooltipPlacement: "top",
                },
                {
                    name: "Bumper",
                    description: "车挡",
                    iconClass: "bumper.svg",
                    tooltipPlacement: "top",
                },
                {
                    name: "Point",
                    description: "道岔",
                    iconClass: "point.svg",
                    tooltipPlacement: "top",
                },
                {
                    name: "Axle",
                    description: "计轴",
                    iconClass: "axle.svg",
                    tooltipPlacement: "top",
                },
                {
                    name: "Balise",
                    description: "应答器",
                    iconClass: "balise.svg",
                    tooltipPlacement: "top",
                },
                {
                    name: "Signal",
                    description: "信号机",
                    iconClass: "signal.svg",
                    tooltipPlacement: "bottom",
                },
                {
                    name: "Station",
                    description: "车站",
                    iconClass: "station.svg",
                    tooltipPlacement: "bottom",
                },
                {
                    name: "Stop",
                    description: "停车点",
                    iconClass: "stop.svg",
                    tooltipPlacement: "bottom",
                },
                {
                    name: "StopArea",
                    description: "停车区域",
                    iconClass: "stopArea.svg",
                    tooltipPlacement: "bottom",
                },
                {
                    name: "VirtualLine",
                    description: "虚拟连线",
                    iconClass: "virtualLine.svg",
                    tooltipPlacement: "bottom",
                },
            ],
            showStationPanel: false,
            tctComponents: [],
            complexSelect: null,
        };
    },
    methods: {
        btnClick(evtName) {
            this.$emit(evtName);
        },
        dataTest(key) {
            this.$emit("onDataTest", key);
        },
        drag(ev, bicon) {
            ev.dataTransfer.setData("ComponentData", JSON.stringify(bicon));
        },
        handleChange(val) {
            console.log(val);
        },
        dragComponent(ev, component) {
            ev.dataTransfer.setData(
                "ComplexComponentData",
                JSON.stringify(component)
            );
        },
        getComponents() {
            let components = localStorage.getItem("train_run_components");
            if (!components) {
                components = [];
            } else {
                components = JSON.parse(components);
            }
            this.tctComponents = components;
        },
        select(component) {
            this.complexSelect = component;
        },
    },
    mounted() {
        this.getComponents();
    },
};
</script>

<style scoped>
.main {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.title {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 20px;
    font-weight: bold;
}

.el-dropdown-link {
    color: #409eff;
    cursor: pointer;
}

.menu {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    /* padding: 0 10px; */
}

.dropdown {
    margin: 0 15px;
}

.base-icon-list {
    overflow-y: auto;
}

.base-icon-list ul {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    list-style-type: none;
    padding-inline-start: 10px;
    margin: 5px;
}

.base-icon-list img {
    width: 25px;
    height: 25px;
    font-size: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #eee;
    margin: 3px;
}

.base-icon-list img:hover {
    color: white;
    background: #409eff;
}

.complex-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.complex-component-list {
    flex: 1;
    overflow-y: auto;
    background: #f8f8f8;
}

.complex-component-list ul {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    list-style-type: none;
    padding-inline-start: 15px;
    margin: 5px;
}

.complex-component-list img {
    width: 60px;
    height: 36px;
    background: #304156;
}

.component-name {
    color: #333;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 8px;
    font-weight: bold;
}

.component-selected {
    margin: 3px;
    padding: 3px;
    /* background: #409eff; */
    /* background:#304156; */
    background: #666;
}

.component-unselected {
    margin: 3px;
    padding: 3px;
}
.component-unselected:hover {
    color: white;
    background: #999;
}
</style>