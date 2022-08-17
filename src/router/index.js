import Vue from 'vue'
import VueRouter from 'vue-router'

// 首页
import Index from '@/views/index';

//大屏监控(公共)
import BigScreen from '@/views/grid/BigScreen';


// 启用路由
Vue.use(VueRouter)


const routes = [
    {
        path: '/',
        name: '首页',
        component: Index,
        iconCls: 'el-icon-tickets',
        children: [
            {
                // 大屏监控(公共)
                path: '/BigScreen/:id',
                component: BigScreen
            }
        ]
    }
]

export default routes