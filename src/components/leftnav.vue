<template>
  <el-menu :collapse="collapsed" collapse-transition router :default-active="$route.path" unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff" active-text-color="#ffd04b">
    <div class="logobox">
      <img class="logoimg" src="../assets/img/logo.png" alt="">
    </div>

    <menu-item  v-for="(chmenu, index) in menus" :menuData="chmenu" :key="index"/>

  </el-menu>
</template>
<script>
import { getMenuList } from "../api/menu"
import MenuItem from "./MenuItem.vue";
export default {
  name: 'leftnav',
  components: {
    MenuItem
  },
  data() {
    return {
      collapsed: false,
      menus: [],
      mmjRoutes: []
    }
  },
  // 创建完毕状态(里面是操作)
  created() {

    //获取所有菜单
    getMenuList()
      .then(res => {
        this.loading = false
        if (res.returnInfo.returnCode === "SUC0000") {    
          this.menus = res.menus;
          this.addMmjRoutes(res.menus);

        } else {
            this.$message({
            type: 'info',
            message: res.returnInfo.errorMsg
          })
      
        }
      })
      .catch(err => {
        console.log(err)
        this.$message.error('菜单加载失败')
      })

    // 监听
    this.$root.Bus.$on('toggle', value => {
      this.collapsed = !value
    })
  },

  methods: {
    //初始化埋埋机的routes
    addMmjRoutes(menus){
      if(menus && menus.length > 0){
        for(let menu of menus){
          if(menu.path && menu.path!=''){
            this.mmjRoutes.push({'path':menu.path, 'pageName': menu.name});
          }

          this.addMmjRoutes(menu.children);
        }
      }
    }
  }
}
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;
  min-height: 400px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}
.el-menu-item-group__title {
  padding: 0px !important;
}
.el-menu-bg {
  background-color: #1f2d3d !important;
}
.el-menu {
  border: none;
}
.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}
.logoimg {
  height: 40px;
}
.iconfont{
margin-right: 5px;
}

</style>