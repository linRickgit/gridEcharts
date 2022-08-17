<template>
  <layout-container :layoutCode="layoutCode"/>
</template>

<script>
import LayoutContainer from './LayoutContainer'

export default {
  name: "BigScreen",

  data() {
    return {
      layoutCode: '',
      tag: true

    };
  },

  // 注册组件
  components: {
    LayoutContainer
  },

  watch:{
    //因为大屏用的是同一组件（根据layoutCode区分），layoutCode来自于路由路径参数，需要监听路由变化
    $route:{
      handler:function(val, oldVal){
         const path = val.path;
         if(path.startsWith('/bigScreen') || path.startsWith('bigScreen')){
           this.layoutCode = val.params.id
         }

      }
    }

  },

  created(){
      this.layoutCode =this.$route.params.id
  }

};
</script>

<style scoped>

</style>