<template>
  <div>
    <el-menu-item v-if='menuData.children==null' :index="menuData.path" 
    :route="{path: menuData.path ,query: menuData.parameter? menuData.parameter : {}}">
      <i :class='"iconfont "+ (menuData.icon? menuData.icon: "icon-fuzhi")'></i>
      <span>{{menuData.name}}</span>
    </el-menu-item> 

    <el-submenu  v-else :index="menuData.name">
      <template slot="title">
        <i :class='"iconfont "+ (menuData.icon? menuData.icon: "icon-fuzhi")'></i>
        <span>{{menuData.name}}</span>
      </template>
      <el-menu-item-group >
        <MenuItem v-for="chmenu in menuData.children" :menuData="chmenu" :key="chmenu.name+chmenu.path" />
      </el-menu-item-group>
    </el-submenu>

  </div>
 
</template>

<script>
export default {
  name: 'MenuItem',

  props: {
    menuData: {
      type: Object,
      default: {},
    }
  
  },
  data() {
    return{}
  }


}
</script>
<style>
</style>