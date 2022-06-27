# Storage Index

## 为什么使用sessionStorage
* 前端系统没有使用Restful接口
* 页面之间是松散的
* 业务上需要页面之间数据共享

## 为什么建立索引
* 页面间数据共享频繁
* 页面逻辑和数据结构频繁改动（所以vuex也不适合使用）
* 共享数据多，维护就是灾难，建立此文件来缓解下维护灾难

## sessionStorage索引详情
1. currentLine 当前线路名称
2. cfgLineJson 是否向后端发送了线路拓扑信息（1=发送，0 | undefined=无发送）
3. cfgAbilityParam 后端发送了能力拓扑线路选择的参数
4. cacheAbility1 能力计算数据缓存、运行模式、列车设置
5. cacheAbilityCheck2 能力检验数据缓存、运行模式、列车设置
6. summaryMode 能力计算的模式，1=能力计算；2=能力检验，泳道图根据这个定制化显示图
7. uicDataMode1 mode=1能力计算泳道图的缓存 
8. uicDataMode2 mode=2能力检验泳道图的缓存 
9.  `[currentLine] + 'trainType'` 列车特性数据选择车型

## localStorage索引详情
1. `[currentLine] + 'json'` 线路拓扑json
2. train_run_components 组件列表