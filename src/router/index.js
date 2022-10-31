import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'js-cookie'


Vue.use(Router)

/* Layout */
import Layout from '@/layout'


export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/index'),
        hidden: true
    },
    {
        path: '/main',
        component: () =>
            import ('@/views/main1'),
        hidden: true
    },
    {
        path: '/next',
        component: () =>
            import ('@/views/next'),
        hidden: true
    },
    {
        path: '/add',
        component: () =>
            import ('@/views/chooseLine2'),
        hidden: true
    },
    {
        path: '/nav',
        // component: Layout,
        hidden: true,
        children: [{
            path: '/main',
            name: '首页',
            component: () =>
                import ('@/views/main1'),
            meta: { title: '首页', icon: 'form' }
        }]
    },
    {
        path: '/',
        redirect: '/login'
    },
    // {
    //     path: '/line',
    //     component: Layout,
    //     children: [
    //         {
    //             path: '/line',
    //             name: '线路设计',
    //             component: () => import('@/views/lines/LineDesign'),
    //             meta: { title: '线路设计', icon: 'tree' }
    //         }
    //     ]
    // },
    {
        path: '/subway',
        component: () =>
            import ('@/views/subway'),
        hidden: true
    },
    {
        path: '/index',
        component: Layout,
        redirect: '/basedata',
        name: '线路设计',
        meta: { title: '线路设计', icon: 'tree' },
        children: [{
                path: 'basedata',
                name: '项目基础数据',
                component: () =>
                    import ('@/views/projectdata/baseData'),
                meta: { title: '项目基础数据' }
            },
            {
                path: 'line',
                name: '线路设计数据',
                component: () =>
                    import ('@/views/lines/LineDesign'),
                meta: { title: '线路设计数据' }
            },
            {
                path: 'traindata',
                name: '列车特性数据',
                component: () =>
                    import ('@/views/projectdata/trainFeatureData'),
                meta: { title: '列车特性数据', type: true }
            },
            {
                path: 'signaldata',
                name: '信号控制数据',
                component: () =>
                    import ('@/views/projectdata/signalCtrData'),
                meta: { title: '信号控制数据', affix: true }
            },
            {
                path: 'operationdata',
                name: '运营管理数据',
                component: () =>
                    import ('@/views/projectdata/operationData'),
                meta: { title: '运营管理数据' }
            }
        ]
    },
    // {
    //     path: '/operation',
    //     component: Layout,
    //     children: [{
    //         path: '/operation',
    //         name: '运行数据配置',
    //         component: () =>
    //             import ('@/views/roadnetwork/pfbasic/trainNumber'),
    //         meta: { title: '运行数据配置', icon: 'icon' }
    //     }]
    // },
    {
        path: '/passenger',
        component: Layout,
        children: [{
            path: '/passenger',
            name: '客流数据管理',
            component: () =>
                import ('@/views/passenger'),
            meta: { title: '客流数据管理', icon: 'peopels' }
        }]
    },
    {
        path: '/emergency',
        component: Layout,
        redirect: '/rungraph',
        name: '线路模型',
        meta: { title: '线路模型', icon: 'dashboard' },
        children: [{
                path: 'rungraphset',
                name: '运行图设置',
                component: () =>
                    import ('@/views/roadnetwork/rungraph/rungraphset'),
                meta: { title: '运行图设置', type: true }
            }, {
                path: 'rungraph',
                name: '实际运行图',
                component: () =>
                    import ('@/views/roadnetwork/rungraph/rungraph'),
                meta: { title: '实际运行图', type: true }
            }, {
                path: 'trainrun',
                name: '站场监控',
                component: () =>
                    import ('@/views/train_sim/TrainRun'),
                meta: { title: '站场监控', }
            }, {
                path: 'report',
                name: '仿真结果-应急',
                component: () =>
                    import ('@/views/report'),
                meta: { title: '仿真结果-应急', }
            }, {
                path: 'reportnormal',
                name: '仿真结果-正常',
                component: () =>
                    import ('@/views/roadnetwork/indicator/index1'),
                meta: { title: '仿真结果-正常', }
            }, {
                path: 'fault',
                name: '故障设置',
                component: () =>
                    import ('@/views/train_sim/TrainRunFault'),
                meta: { title: '故障设置', }
            }, {
                path: 'history',
                name: '历史记录查看',
                component: () =>
                    import ('@/views/history'),
                meta: { title: '历史记录查看', }
            },
            {
                path: 'summarycheck',
                name: '运行能力检验',
                component: () =>
                    import ('@/views/summarycheck/SummaryCheck'),
                meta: { title: '运行能力检验' }
            },
            {
                path: 'uic',
                name: '线路占用泳道图',
                component: () =>
                    import ('@/views/uic/UIC'),
                meta: { title: '线路占用泳道图' }
            },
            // {
            //     path: 'scenes',
            //     name: '场景设置',
            //     disabled:true,
            //     component: () => import('@/views/projectdata/baseData'),
            //     meta: { title: '场景设置', type: true }
            // },{
            //     path: '',
            //     name: '运行策略设置',
            //     disabled:true,
            //     component: () => import('@/views/projectdata/baseData'),
            //     meta: { title: '运行策略设置', type: true }
            // },{
            //     path: 'rungraph1',
            //     name: '运行图视图',
            //     component: () => import('@/views/roadnetwork/rungraph/rungraph'),
            //     meta: { title: '运行图视图', type: true }
            // }
        ]
    },



    {
        path: '/emergency1',
        component: Layout,
        redirect: '/wirenetwork',
        name: '线网模型',
        meta: { title: '线网模型', icon: 'example' },
        children: [{
            path: 'wirenetwork',
            name: '线网仿真',
            component: () =>
                import ('@/views/wirenetwork'),
            meta: { title: '线网仿真', type: true }
        }, {
            path: 'marshalling',
            name: '线网集群',
            hidden: true,
            component: () =>
                import ('@/views/marshalling'),
            meta: { title: '线网集群', type: true }
        }, {
            path: 'linepassenger',
            name: '线网客流设置',
            component: () =>
                import ('@/views/linepassenger'),
            meta: { title: '线网客流设置', type: true }
        }, {
            path: 'wireset',
            name: '线网运行图设置',
            component: () =>
                import ('@/views/wireset'),
            meta: { title: '线网运行图设置', type: true }
        }, {
            path: 'networkindicators',
            name: '线网指标查看',
            component: () =>
                import ('@/views/networkindicators'),
            meta: { title: '线网指标查看', type: true }
        }]
    },
    // {
    //     path: '/history',
    //     component: Layout,
    //     disabled:true,
    //     children: [
    //         {
    //             path: '/history',
    //             name: '历史运行数据',
    //             component: () => import('@/views/projectdata/baseData'),
    //             meta: { title: '历史运行数据', icon: 'nested' }
    //         }
    //     ]
    // },

    // {
    //     path: '/traincapacity',
    //     component: Layout,
    //     redirect: '/indicator',
    //     name: '能力分析',
    //     hidden: true,
    //     meta: { title: '能力分析', icon: 'dashboard' },
    //     children: [
    //         {
    //             path: 'summary',
    //             name: '能力计算',
    //             component: () => import('@/views/summary/Ability'),
    //             meta: { title: '能力计算', icon: 'form' }
    //         },
    // {
    //     path: 'summarycheck',
    //     name: '能力检验',
    //     component: () => import('@/views/summarycheck/SummaryCheck'),
    //     meta: { title: '能力检验', icon: 'form' }
    // },
    // {
    //     path: 'uic',
    //     name: '线路占用泳道图',
    //     component: () => import('@/views/uic/UIC'),
    //     meta: { title: '线路占用泳道图', icon: 'form' }
    // },
    //         {
    //             path: 'analysis',
    //             name: '牵引计算曲线',
    //             component: () => import('@/views/analysis'),
    //             meta: { title: '牵引计算曲线', icon: 'form' }
    //         },
    //         {
    //             path: 'feature',
    //             name: '制动距离分析',
    //             component: () => import('@/views/feature'),
    //             meta: { title: '制动距离分析', icon: 'form' }
    //         },
    //     ]
    // },
    // {
    //     path: '/program',
    //     component: Layout,
    //     redirect: '/design',
    //     name: '运行图设计',
    //     hidden: true,
    //     meta: { title: '运行图设计', icon: 'dashboard' },
    //     children: [
    //         {
    //             path: 'design',
    //             name: '总体方案',
    //             component: () => import('@/views/design'),
    //             meta: { title: '总体方案', icon: 'form' }
    //         },
    //         {
    //             path: 'trainNumber',
    //             name: '基础信息',
    //             component: () => import('@/views/roadnetwork/pfbasic/trainNumber'),
    //             meta: { title: '基础信息', icon: 'form' }
    //         },
    //         {
    //             path: 'Inquire',
    //             name: '客流查询',
    //             component: () => import('@/views/roadnetwork/pfbasic/Inquire'),
    //             meta: { title: '客流查询', icon: 'form' }
    //         },
    //         {
    //             path: 'operation',
    //             name: '运行图生成',
    //             component: () => import('@/views/roadnetwork/pfbasic/operation'),
    //             meta: { title: '运行图生成', icon: 'form' }
    //         },
    //         {
    //             path: 'rungraph1',
    //             name: '运行图查看',
    //             component: () => import('@/views/roadnetwork/rungraph/common'),
    //             meta: { title: '运行图查看', icon: 'form', type: false }
    //         },
    //         {
    //             path: 'rungraph',
    //             name: '实际运行图',
    //             component: () => import('@/views/roadnetwork/rungraph/rungraph'),
    //             meta: { title: '实际运行图', icon: 'form', type: true }
    //         },
    //         {
    //             path: 'trainrun',
    //             name: '运行仿真',
    //             component: () => import('@/views/train_sim/TrainRun'),
    //             meta: { title: '运行仿真', icon: 'form' }
    //         },
    //         {
    //             path: 'report',
    //             name: '评估报告',
    //             component: () => import('@/views/roadnetwork/indicator/index1'),
    //             meta: { title: '评估报告', icon: 'form' }
    //         }
    //     ]
    // },
    // {
    //     path: '/nav1',
    //     // component: Layout,
    //     hidden: true,
    //     children: [
    //         {
    //             path: '/next',
    //             name: '工作展望',
    //             component: () => import('@/views/next'),
    //             meta: { title: '工作展望', icon: 'form' }
    //         }
    //     ]
    // },
    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    mode: 'hash',
    base: '/',
    routes: constantRoutes
})

const router = createRouter()
import { saveAppData } from "@/utils/appCache";
router.beforeEach((to, from, next) => {
    saveAppData();
    // if (to.path != '/login') {
    //     let token = Cookies.get('tct_token');
    //     if (!token) {
    //         next({
    //             path: '/login'
    //         });
    //         return;
    //     }
    // }
    next()
})

Vue.prototype.$resetRoute = function() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router