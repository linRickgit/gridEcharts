<template>
  <el-container class="index-con">
    <el-aside :class="showclass" v-show="!this.$store.state.fullScreen">
      <leftnav></leftnav>
    </el-aside>
    <el-container class="main-con">
      <el-header class="index-header" v-show="!this.$store.state.fullScreen">
        <navcon></navcon>
      </el-header>
      <el-main clss="index-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
// 导入组件
import navcon from '../components/navcon.vue'
import leftnav from '../components/leftnav.vue'
export default {
  name: 'index',
  data() {
    return {
      showclass: 'asideshow',
      showtype: false
    }
  },
  // 注册组件
  components: {
    navcon,
    leftnav
  },
  methods: {
    keyDown(event){
      if(event.keyCode==27){
        //ESC 显示菜单栏
        this.$store.commit('setFullScreen', false);
      }else if(event.keyCode==122){
        //F11 隐藏菜单
        this.$store.commit('setFullScreen', true);
      }

    }
  },
  mounted(){
    window.addEventListener("keydown", this.keyDown, true);
  },
  created() {
    // 监听
    this.$root.Bus.$on('toggle', value => {
      if (value) {
        this.showclass = 'asideshow'
      } else {
        setTimeout(() => {
          this.showclass = 'aside'
        }, 300)
      }
    })
  },

}
</script>
<style >
.el-main{
  padding: 0 !important
}

.index-con {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.aside {
  width: 45px !important;
  height: 100%;
  background-color: #334157;
  margin: 0px;
}
.asideshow {
  width: 220px !important;
  height: 100%;
  background-color: #334157;
  margin: 0px;
}
.index-header,
.index-main {
  padding: 0px;
}

.index-header,
.el-header{
  padding: 0 0px !important;
}

.el-menu--horizontal,
.el-menu{
  border-bottom: 0px !important;
}

</style>