<template>
    <div class="main">

        <h2>城市轨道交通行车能力设计与检验平台</h2>

        <h3 class="clearfix">
            <span class="now">数据录入</span>
            <span>能力分析</span>
        </h3>

        <div class="mainBottom">
            <div class="category">
                <div>
                    <router-link :to="{name:'项目基础数据'}">
                        <img src="../assets/basie/组 1977.png"
                            style="background:#0780E8">
                        <span>项目基础数据</span>
                    </router-link>
                </div>
                <div>
                    <router-link :to="{name:'线路设计数据'}">
                        <img src="../assets/basie/组 1981.png">
                        <span>线路设计数据</span>
                    </router-link>
                </div>
                <div>
                    <router-link :to="{name:'列车特性数据'}">
                        <img src="../assets/basie/组 1979.png">
                        <span>列车特性数据</span>
                    </router-link>
                </div>
                <div>
                    <router-link :to="{name:'信号控制数据'}">
                        <img src="../assets/basie/组 1978.png">
                        <span>信号控制数据</span>
                    </router-link>
                </div>
                <div>
                    <router-link :to="{name:'运营管理数据'}">
                        <img src="../assets/basie/组 1980.png">
                        <span>运营管理数据</span>
                    </router-link>
                </div>
            </div>
            <div class="category"
                style="display:none">
                <div>
                    <router-link :to="{name:'能力计算'}">
                        <img src="../assets/basie/组 1982.png">
                        <span>能力计算</span>
                    </router-link>
                </div>
                <div>
                    <router-link :to="{name:'能力检验'}">
                        <img src="../assets/basie/组 1980.png">
                        <span>能力检验</span>
                    </router-link>
                </div>
                <div>
                    <router-link :to="{name:'线路占用泳道图'}">
                        <img src="../assets/basie/组 1981.png">
                        <span>线路占用泳道图</span>
                    </router-link>
                </div>
                <div>
                    <router-link :to="{name:'牵引计算曲线'}">
                        <img src="../assets/basie/组 1983.png">
                        <span>牵引计算曲线</span>
                    </router-link>
                </div>
                <div>
                    <router-link :to="{name:'制动距离分析'}">
                        <img src="../assets/basie/组 1984.png">
                        <span>制动距离分析</span>
                    </router-link>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
// TODO jquery
$(document).ready(function () {});
export default {
    name: "index",
    data() {
        return {
            city: "北京市",
            line: "7号线",
            activeNames: ["1", "2", "3"],
            options: {},
        };
    },
    created() {},
    mounted() {
        $(".main h3 span").click(function () {
            $(".main h3 span").removeClass("now");
            $(this).addClass("now");
            $(".mainBottom div").eq(0).hide();
            $(".mainBottom div").eq(6).hide();
            // $(".mainBottom div").hide();
            console.log($(this).index());
            if ($(this).index() == 0) {
                $(".mainBottom div").eq(0).show();
            } else if ($(this).index() == 1) {
                $(".mainBottom div").eq(6).show();
            }
        });
    },
    methods: {},
};
</script>

<style scoped>
.main {
    background: #e6ecf2;
    height: 100%;
}
.main h2 {
    height: 84px;
    line-height: 84px;
    font-size: 34px;
    font-weight: bold;
    text-align: center;
    background: url(../assets/basie/header.jpg) no-repeat center center;
    color: #fff;
    margin-bottom: 107px;
}
.main h3 {
    width: 704px;
    margin: 0 auto 86px auto;
    border-radius: 32px;
    background: #fff;
    display: block;
}
.main h3 span {
    width: 352px;
    height: 64px;
    line-height: 64px;
    height: 64px;
    color: #252b3f;
    display: inline-block;
    text-align: center;
    float: left;
    cursor: pointer;
    border-radius: 32px;
    font-size: 30px;
}
.main h3 .now {
    background-color: #0780e8;
    color: #fff;
}
.main .mainBottom {
    background: #efefef;
    height: calc(100vh - 344px);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.category {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: c;
    align-items: center;
}

.category div {
    font-size: 22px;
    transition: all linear 0.3s;
}
.category div:hover {
    top: -20px;
}
.category div img {
    cursor: pointer;
    width: 220px;
    height: 220px;
    margin: 0 20px;
}
.category div span {
    display: block;
    z-index: 2;
    margin-top: -80px;
    text-align: center;
}
</style>
