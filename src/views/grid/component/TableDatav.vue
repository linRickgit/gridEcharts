/**
* 公共图表组件 - 轮播表
*/
<template>
  <div class="container">
    <div class="table-title">{{ title }}</div>
    <div class="my-table">
      <dv-loading v-if="loading=='0'">加载中...</dv-loading>
      <dv-scroll-board v-else-if="type=='table' && loading=='1'" :id="divId"  :config="option"/>
      <dv-scroll-ranking-board class="ranking-board" v-else-if="type=='ranking' && loading=='1'" :id="divId"  :config="option"/>

    </div>
  </div>
</template>

<script>
import { getUUID } from "../../../utils/common";
import { getComponentConfig, queryComponentConfig } from "../../../api/gridComponent";
import datav from "@jiaminghi/data-view";
import Vue from "vue";
Vue.use(datav);
export default {
  name: "TableDatav",
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
      //时间戳,监控用
      timestamp: 0,
      divId: '',
      //0：加载中，1：加载完成
      loading: '0',
      title: "标题",
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
          //修改时间戳触发重新绘制
          this.timestamp = new Date().getTime();
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
    //监控时间戳并重绘图形
    timestamp(newTitle, oldTitle){
      this.refresh();
    }
  },

  created() {
    this.divId=getUUID();
    //从后台获取配置数据
    this.initConfig();
  },

};
</script>

<style scoped>
.container{
  width: 100%;
  height: 100%;
}

.table-title {
  margin-left: 10px;
  font-weight: bold;
  height: 30px;
  display: flex;
  align-items: center;
  font-size: 17px;
  color: #fff;
}

.my-table{
  height: 90%;
}

.my-table .ranking-board{
  margin: 0 auto;
  width: 90%;
}

</style>