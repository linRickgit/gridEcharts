import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
// 登录验证
export default new Vuex.Store({
    state: {
        //是否全屏，大屏监控使用
        fullScreen: false,
    },

    getters:{
        getValue:state => state.demo
    },
    
    mutations: {
  
        setFullScreen(state, value){
            state.fullScreen = value;
        }



    },

})