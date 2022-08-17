/**
* 公共图表组件 - ApacheECharts
*/
<template>
  <div class="container">
    <div :id="divId" class="my-echarts" />
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getUUID } from "../../../utils/common";
import { getComponentConfig, queryComponentConfig } from "../../../api/gridComponent";
export default {
  name: "ApacheECharts",
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
      timer: null,
      //时间戳,监控用
      timestamp: 0,
      divId: '',
      myChart: null,
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
          this.option.title.text = res.componentName;
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
      this.myChart.showLoading();
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
        let func = new Function('jsonData', 'option', 'echarts', this.responseAnalysis);
        //自定义脚本根据接口返回值修改option
        func(jsonData, option, echarts);
      }catch(err){
        console.log(err)
        this.$message.error(this.componentCode + '结果解析失败')
      }

    },

    refresh() {
      this.myChart.setOption(this.option);
      this.myChart.resize();
      this.myChart.hideLoading();
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
    let chart = echarts.init(document.getElementById(this.divId));
    this.myChart = chart;
    this.myChart.showLoading();
    //加上以下这代码，不加会超过div的界限
    window.addEventListener("resize", function () {
      chart.resize();
    });

    this.$root.Bus.$on("gridResize", i=>{
      if(i===this.componentCode){
          this.refresh();
      }
    });

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

.my-echarts{
  height: 100%;
}

</style>