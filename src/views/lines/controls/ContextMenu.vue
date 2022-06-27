 <!-- 右键菜单-->
<template>
    <div id="contextmenu"
        class="contextmenu">
        <ul>
            <li v-for="(menu,index) in menus"
                :key="index">
                <div class="contextmenu-item"
                    @mousedown="clickMenu(menu)">{{menu}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ["menus","project"],
    data() {
        return {};
    },
    methods: {
        clickMenu(menu) {
            this.$emit("clickMenu", menu);
        },
        closeMenu() {
            // 取消鼠标监听事件 菜单栏
            this.project.contextMenuVisible = false;
            this.project.contextMenuEvt = null;
            document.removeEventListener("mousedown", this.closeMenu);
            document.removeEventListener("contextmenu", this.updateLocation); // 给整个document添加监听鼠标事件，点击任何位置执行closeMenu方法
        },
        updateLocation() {
            if (!this.project || !this.project.contextMenuEvt) {
                return;
            }
            // 设置菜单出现的位置
            // 具体显示位置根据自己需求进行调节
            let menu = document.querySelector("#contextmenu");
            let cha =
                document.body.clientHeight -
                this.project.contextMenuEvt.clientY;

            // 防止菜单太靠底，根据可视高度调整菜单出现位置
            if (cha < 150) {
                menu.style.top =
                    this.project.contextMenuEvt.offsetY - 120 + "px";
            } else {
                menu.style.top = this.project.contextMenuEvt.offsetY + 2 + "px";
            }
            menu.style.left = this.project.contextMenuEvt.offsetX + 2 + "px";
            document.addEventListener("mousedown", this.closeMenu); // 给整个document添加监听鼠标事件，点击任何位置执行closeMenu方法
            document.addEventListener("contextmenu", this.updateLocation); // 给整个document添加监听鼠标事件，点击任何位置执行closeMenu方法
        },
    },
    mounted() {
        this.updateLocation();
    },
    beforeDestroy() {
        document.removeEventListener("mousedown", this.closeMenu); // 给整个document添加监听鼠标事件，点击任何位置执行closeMenu方法
        document.removeEventListener("contextmenu", this.updateLocation); // 给整个document添加监听鼠标事件，点击任何位置执行closeMenu方法
    },
};
</script>

<style scoped>
.contextmenu-item {
    width: 100%;
    display: block;
    line-height: 30px;
    text-align: center;
}

.contextmenu {
    position: absolute;
    background-color: #ecf5ff;
    width: 100px;
    /*height: 106px;*/
    font-size: 12px;
    color: #409eff;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid rgba(64, 158, 255, 0.2);
    white-space: nowrap;
    z-index: 1000;
}
.contextmenu-item:hover {
    cursor: pointer;
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
}

ul,
li {
    padding-left: 0px;
    list-style: none;
    list-style-type: none;
}
</style>