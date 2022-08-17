import Vue from 'vue'
import App from './App.vue'
import routes from './router';
import VueRouter from 'vue-router';
import store from './vuex/store'
import echarts from 'echarts'


import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './styles/reset.css';

import jsCookie from 'js-cookie'

// 引入icon
import './assets/icon/iconfont.css'

import axios from 'axios';
import ElementUI from 'element-ui';
Vue.prototype.$axios = axios;

//mock后台接口
require('./mock')

Vue.use(Element, {
  size: 'small',
  zIndex: 3000
});

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

Vue.prototype.$cookie = jsCookie;

let router = null;
let instance = null;

// 应用渲染函数
function render(props = {}) {
  const { container } = props;
  // 实例化 router，根据应用运行环境设置路由前缀
  router = new VueRouter({
    // 如果作为微应用运行，则设置 /vue 为前缀，否则设置 /
    base: '/',
    mode: 'history',
    routes,
  });


  // 实例化 vue 实例
  instance = new Vue({
    router,
    store,
    data: {
      // 空的实例放到根组件下，所有的子组件都能调用
      Bus: new Vue()
    },
    render: h => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');

}

render();