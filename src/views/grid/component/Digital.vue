/**
* 公共图表组件 - 数值显示
*/
<template>

    <div class="container">
      <div class="digital-title">{{ option.title }}</div>
      <div class="digital-content">
        <div class="digital-number">{{ option.value}}</div>
        <div class="digital-unit">{{ option.unit }}</div>
      </div>
    </div>

</template>

<script>
import { getComponentConfig, queryComponentConfig } from "../../../api/gridComponent";
export default {
  name: "Digital",
  props: {
    layoutCode: {
      type: String,
      default: '',
    },
    componentCode: {
      type: String,
      default: '',
    },
    type:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      timer: null,
      divId: '',
      //0：加载中，1：加载完成
      loading: '0',
      option: {},
      responseAnalysis: '',
      refreshRate: -1
    };
  },

  methods: {

    initConfig(){
      getComponentConfig(this.layoutCode, this.componentCode)
      .then(res => {

        if (res.returnInfo.returnCode === "SUC0000") {
          try{
            this.option = JSON.parse(res.config);
          }catch(err){
            console.log(err)
            this.$message.error(this.componentCode + '组件配置JSON解析失败')
            return;
          }
          this.title = res.componentName;
          this.responseAnalysis = res.responseAnalysis;
          this.refreshRate = res.refreshRate;
          this.timeRefresh();
          this.getData();
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

    getData(){
      this.loading = '0';
      queryComponentConfig(this.layoutCode, this.componentCode)
      .then(res => {
        if (res.returnInfo.returnCode === "SUC0000") {
          this.processorData(res.result);
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
        this.$message.error(this.componentCode + '请求外部接口失败')
      })

    },

    processorData(data){
      if(!data){
        console.log(this.componentCode +'组件请求结果为空');
        return;
      }
      let jsonData = JSON.parse(data);
      let option = this.option;
      try{
        let func = new Function('jsonData', 'option', this.responseAnalysis);
        //自定义脚本根据接口返回值修改option
        func(jsonData, option);
      }catch(err){
        console.log(err)
        this.$message.error(this.componentCode + '结果解析失败')
      }

    },

    refresh() {
      this.loading = '1';
      const { option } = this;
      this.option = { ...this.option };
    },

    //定时刷新
    timeRefresh(){
      if (this.refreshRate && this.refreshRate > 0) {
        const that = this;
        that.timer = setInterval(()=>that.getData
          , that.refreshRate * 1000);
      }
    }

  },

  mounted() {

  },

  beforeDestroy(){
    if(this.timer){
      clearInterval(this.timer);
    }
  },

  beforeDestroy(){
    //离开页面后销毁定时器
    if(this.timer){
      clearInterval(this.timer);
    }
  },

  watch: {
  },

  created() {
    //从后台获取配置数据
    this.initConfig();
  },

};
</script>

<style scoped>


.container {
  height: 100%;
  width: 100%;
  border-left: 5px solid rgb(6, 30, 93);
}

.digital-title {
  height: 30%;
  font-size: 18px;
  color: rgb(255, 255, 255);
}
.digital-content{
  height: 65%;
  width: 100%;
  flex-direction: row;
  display: flex;
  position: relative;
}

.digital-number{
  font-size: 50px;
  font-family:'Times New Roman', Times, serif;
  color: rgb(114, 159, 250);
}
.digital-unit{
position: absolute;

bottom: 4px;
right: 10px;
font-size: 20px;
color: rgb(255, 255, 255);
}

</style>