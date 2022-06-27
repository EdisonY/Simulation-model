<template>
    <div class="main next">

        <h2>2021年工作展望</h2>

        <div class="nextMain">
            <ul class="mainUl">
                <li class="li li1">
                    <div class="limain">
                        <span>平台发布</span>
                    </div>
                    
                    <div class="subMain">
                        <ul>
                            <li>公网版本上线发布</li>
                            <li>开放典型线路数据库</li>
                            <li>面向合作高校开放算法验证平台</li>
                        </ul>
                    </div>
                </li>
                <li class="li li2">
                    <div class="limain">
                        <span>行车组织策略分析</span>
                    </div>
                    <div class="subMain">
                        <ul>
                            <li>支持线路开行方案设计</li>
                            <li>支持运行图自动化编制</li>
                            <li>支持运行图仿真和评估</li>
                        </ul>
                    </div>
                </li>
                <li class="li li3">
                    <div class="limain">
                        <span>功能模块扩展</span>
                    </div>
                    <div class="subMain">
                        <ul>
                            <li>《节能控制导则》能耗分析模块</li>
                            <li>行车-客流耦合仿真分析模块</li>
                            <li>行车应急预案平行推演模块</li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>

export default {
    name: 'index',
    data () {
        return {
            city:'北京市',
            line:'7号线',
            activeNames: ['1','2','3'],
            options:{}
        }
    },
    created () {
        
    },
    mounted () {
        $('.li').mouseover(function(){
            $('.li').css({'zIndex':1}).removeClass('now')
            $(this).css({'zIndex':2,'left':0}).addClass('now')
            $(this).find('.subMain').show().stop().animate({
                width:820
            },200)
        })
        $('.li').mouseleave(function(){
            $('.li2').css({'left':400})
            $('.li3').css({'left':800})
            $('.li').css({'zIndex':1}).removeClass('now')
            $(this).find('.subMain').hide().stop().animate({
                width:0
            },200)
        })
    },
    methods:{
        
    }
}
</script>
<style scoped>
.main{background: #e6ecf2;height: 100vh;width: 100vw;overflow: hidden;;}
.main h2{height: 84px;line-height: 84px;font-size: 34px;font-weight: bold;text-align: center;background: url(../assets/basie/header.jpg) no-repeat center center;color: #fff;margin-bottom: 107px;}
.next h2{margin-bottom: 200px;}
.main h3{width: 704px;margin: 0 auto 86px auto;border-radius: 32px;background: #fff;display: block;}
.main h3 span{width: 352px;height: 64px;line-height: 64px;height: 64px;color: #252b3f;display: inline-block;text-align: center;float:left;cursor: pointer;border-radius: 32px;font-size: 30px;}
.main h3 .now{background-color: #0780e8;color: #fff;}
.main .mainBottom{background: #efefef;height: calc(100vh - 344px);}
.main .mainBottom ul{width: 100%;text-align: center;padding-top: 120px;}
.main .mainBottom li{width: 300px;height: 300px;display: inline-block;font-size: 26px;cursor: pointer;position: relative;margin: 0 10px;transition: left linear .3s;}
.main .mainBottom li:hover{top: -20px;}
.main .mainBottom li img{position: absolute;left: 0;top: 0;}
.main .mainBottom li span{position: relative;z-index: 2;padding-top: 230px;display: block;}

.main .nextMain .mainUl{width: 1200px;text-align: center;margin:0 auto;position: relative;height: 368px;box-sizing:content-box;overflow: hidden;}
.main .nextMain .mainUl .li{width: 368px;height: 368px;display: inline-block;font-size: 30px;cursor: pointer;margin: 0 10px;transition: left linear .5s;position: absolute;top: 0;}
.main .nextMain .mainUl .li .limain{width: 368px;height: 368px;display: inline-block;position: relative;z-index: 5;transition: all linear .3s;}
.main .nextMain .mainUl .li1{left:0}
.main .nextMain .mainUl .li2{left:400px}
.main .nextMain .mainUl .li3{left:800px}
.main .nextMain .mainUl .li1 .limain{background: url(../assets/basie/组 1994.png) no-repeat center center;}
.main .nextMain .mainUl .li2 .limain{background: url(../assets/basie/组 1995.png) no-repeat center center;}
.main .nextMain .mainUl .li3 .limain{background: url(../assets/basie/组 1996.png) no-repeat center center;}
.main .nextMain .mainUl .li span{padding-top: 270px;display: inline-block;z-index: 999999;}
.main .nextMain .mainUl .li1:hover .limain,.main .nextMain .mainUl .li1.now .limain{background-image: url(../assets/basie/组 1997.png);}
.main .nextMain .mainUl .li2:hover .limain,.main .nextMain .mainUl .li2.now .limain{background-image: url(../assets/basie/组 1998.png);}
.main .nextMain .mainUl .li3:hover .limain,.main .nextMain .mainUl .li3.now .limain{background-image: url(../assets/basie/组 1999.png);}
.main .nextMain .mainUl .subMain{display:none;position: absolute;left:345px;top:6px;background: #fff;box-shadow: 2px 2px 2px #e2e2e2;border-radius: 0 0 25px 0;height: 350px;z-index: 4;}
.main .nextMain .mainUl .subMain ul{padding:30px 0 0 80px;text-align: left;}
.main .nextMain .mainUl .subMain li{height: 92px;line-height: 92px;font-size: 30px;position: relative;padding: 0 0 0 50px;overflow:hidden;}
.main .nextMain .mainUl .subMain li::after{content: '';display: block;width: 26px;height: 26px;border-radius: 13px;background: #0780e8;position: absolute;left: 0;top: 34px;}
</style>
