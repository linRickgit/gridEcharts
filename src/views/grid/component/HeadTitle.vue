/**
* 公共图表组件 - 头部标题
*/
<template>
  <div class="top-header">
    <dv-decoration-8 class="header-left-decoration" />
    <dv-decoration-5 class="header-center-decoration" :dur="8" />
    <dv-decoration-8 class="header-right-decoration" :reverse="true" />
    <div class="center-title">{{title}}</div>
  </div>
</template>

<script>
import { getUUID } from "../../../utils/common";
import { getComponentConfig} from "../../../api/gridComponent";

export default {
  name: "HeadTitle",
  props: {
    layoutCode: {
      type: String,
      default: '',
    },
    componentCode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      divId: '',
      title: "标题",
    };
  },

  methods: {

    initConfig(){
      getComponentConfig(this.layoutCode, this.componentCode)
      .then(res => {

        if (res.returnInfo.returnCode === "SUC0000") {
          this.title = res.componentName;
        } else {
            this.$message({
            type: 'info',
            message: this.componentCode + res.returnInfo.errorMsg
          })

        }
      })
      .catch(err => {
        console.log(err)
        this.loading = false
        this.$message.error(this.componentCode + '组件刷新失败')
      })

    },


  },

  mounted() {

  },

  created() {
    this.divId=getUUID();
    //从后台获取配置数据
    this.initConfig();
  },

};
</script>

<style scoped>
.top-header {
  position: relative;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  background: url("~@/assets/img/bigScreenHeadBg.png");
  background-size: 100% 100%;
}

.header-center-decoration {
  width: 40%;
  height: 60px;
  margin-top: 30px;
}

.header-left-decoration,
.header-right-decoration {
  width: 25%;
  height: 60px;
}

.center-title {
  position: absolute;
  font-size: 30px;
  font-weight: bold;
  left: 50%;
  top: 15px;
  color: #fff;
  transform: translateX(-50%);
}
</style>