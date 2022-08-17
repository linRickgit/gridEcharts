<template>
  <div class="grid-container" :id="containerId" style="height: 100%; width: 100%">
    <div class="config-button">
      <el-button v-if="model=='show'" size="mini" round @click="editLayout">编辑</el-button>
      <el-button v-if="model=='edit'" size="mini" round @click="showLayout">退出编辑</el-button>
      <el-button v-if="model=='edit'" size="mini" round @click="addLayout">添加组件</el-button>
    </div>

    <grid-layout
            :layout.sync="allLayoutConfig"
            :col-num="30"

            :row-height="rowHeight"
            :is-draggable="isDraggable"
            :is-resizable="isResizable"
            :is-mirrored="false"
            :auto-size="true"
            :vertical-compact="false"
            :prevent-collision="true"
            :margin="[colMargin, rowMargin]"
            :use-css-transforms="true"
    style="height: 100%; width: 100%">

        <grid-item v-for="item in allLayoutConfig"
                   :x="item.x"
                   :y="item.y"
                   :w="item.w"
                   :h="item.h"
                   :i="item.i"
                   :key="item.i"
                   @moved="movenEvent"
                   @resized="resizeEvent"
                  >

            <div class="close-icon" @click="deleteComponent(item.i)" v-if="model=='edit'">
              <i class="el-icon-close"></i>
            </div>

            <apache-e-charts v-if="item.componentType=='ApacheECharts'"
              :layoutCode="layoutCode"
              :componentCode="item.i"
              style="height: 100%; width: 100%;"/>

            <table-datav v-else-if="item.componentType=='TableDatav'"
              :layoutCode="layoutCode"
              :componentCode="item.i"
              :type='"table"'
              style="height: 100%; width: 100%;"/>

            <table-datav v-else-if="item.componentType=='RankingDatav'"
            :layoutCode="layoutCode"
            :componentCode="item.i"
            :type='"ranking"'
            style="height: 100%; width: 100%;"/>

            <digital v-else-if="item.componentType=='Digital'"
            :layoutCode="layoutCode"
            :componentCode="item.i"
            :type='"digital"'
            style="height: 100%; width: 100%;"/>

            <head-title v-else-if="item.componentType=='HeadTitle'"
            :layoutCode="layoutCode"
            :componentCode="item.i"
            style="height: 100%; width: 100%;"/>
            <h1 v-else>   {{item.i}}</h1>

            <div class="edit-button">
              <el-button v-if="model=='edit'" size="mini" round @click="editComponentConfig(item.i, '1')">配置</el-button>
              <el-button v-if="model=='edit' && item.componentType!='HeadTitle'" size="mini" round @click="editComponentConfig(item.i, '2')">接口</el-button>
            </div>

        </grid-item>

    </grid-layout>

    <!-- 组件添加的弹窗 -->
    <el-dialog title='添加组件' :close-on-click-modal='false' :visible.sync="componentAddVisible" width="650px" @close='closeComponentAddDialog()'>
       <el-form label-width="80px" ref="componentAddForm" :model="componentAddForm" style="margin-top: 10px">

          <el-form-item label="组件编码:" prop="componentCode">
            <el-input size="small" v-model="componentAddForm.componentCode"></el-input>
          </el-form-item>

          <el-form-item label="组件名称:" prop="componentName">
            <el-input size="small" v-model="componentAddForm.componentName"></el-input>
          </el-form-item>

          <el-form-item label="组件类型:" prop="componentType">
            <el-select size="mini" v-model='componentAddForm.componentType' style="width:120px">
              <el-option v-for="item in componentTypeOptions"
              :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="配置:" prop="config">
            <el-input size="small"  type="textarea" rows="10" v-model="componentAddForm.config"></el-input>
          </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeComponentAddDialog()">取消</el-button>
        <el-button size="small" type="primary" class="title" @click="componentAdd()">保存</el-button>
      </div>
    </el-dialog>

    <!-- 组件编辑的弹窗1, 配置信息 -->
    <el-dialog title='配置信息编辑' :close-on-click-modal='false' :visible.sync="componentConfigOneEditVisible" width="650px"  @close="closeComponentConfigEditDialog('1')">
       <el-form label-width="80px" ref="componentConfigOneEditForm" :model="componentConfigOneEditForm" style="margin-top: 10px">

          <el-form-item label="组件编码:" prop="componentCode">
            <el-input size="small" v-model="componentConfigOneEditForm.componentCode" disabled></el-input>
          </el-form-item>

          <el-form-item label="组件名称:" prop="componentName">
            <el-input size="small" v-model="componentConfigOneEditForm.componentName" disabled></el-input>
          </el-form-item>

          <el-form-item label="组件类型:" prop="componentType">
            <el-select size="mini" v-model='componentConfigOneEditForm.componentType' style="width:120px" disabled>
              <el-option v-for="item in componentTypeOptions"
              :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="配置:" prop="config">
            <el-input size="small"  type="textarea" rows="15" v-model="componentConfigOneEditForm.config"></el-input>
          </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeComponentConfigEditDialog('1')">取消</el-button>
        <el-button size="small" type="primary" class="title" @click="componentConfigUpdateConfig('1')">修改</el-button>
      </div>
    </el-dialog>

    <!-- 组件编辑的弹窗2, 接口相关的信息 -->
    <el-dialog title="接口相关信息编辑" :close-on-click-modal='false' :visible.sync="componentConfigTwoEditVisible" width="1200px" @close="closeComponentConfigEditDialog('2')">
      <el-form label-width="100px" ref="componentConfigTwoEditForm" :model="componentConfigTwoEditForm">

        <el-row>
          <el-col :span="16">
            <el-form-item label="URL:" prop="url">
              <el-input size="small" v-model="componentConfigTwoEditForm.url"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="请求方式:" prop="httpMethod">
              <el-select size="mini" v-model='componentConfigTwoEditForm.httpMethod'>
                <el-option label="GET" value="GET"></el-option>
                <el-option label="POST" value="POST"></el-option>
            </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="请求头:" prop="headerJson">
          <el-input  type="textarea" :autosize="{ minRows: 1, maxRows: 15 }" size="headerJson" v-model="componentConfigTwoEditForm.headerJson"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="请求体:" prop="reqJson">
              <el-input  type="textarea" :autosize="{ minRows: 5, maxRows: 15 }" size="small" v-model="componentConfigTwoEditForm.reqJson"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="结果解析:" prop="reqJson">
              <el-input  type="textarea" :autosize="{ minRows: 5, maxRows: 15 }" size="small" v-model="componentConfigTwoEditForm.responseAnalysis"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="刷新频率(秒):" prop="refreshRate">
              <el-input size="small" v-model="componentConfigTwoEditForm.refreshRate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缓存时间(秒):" prop="responseTtl">
              <el-input size="small" v-model="componentConfigTwoEditForm.responseTtl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeComponentConfigEditDialog('2')">取消</el-button>
          <el-button size="small" type="primary" class="title" @click="componentConfigUpdateConfig('2')">修改</el-button>
        </div>
      </el-dialog>



  </div>
</template>

<script>
import { getComponentConfig, getListComponentConfig, addComponentConfig, updateComponentConfig, deleteComponentConfig } from "../../api/gridComponent";
import VueGridLayout from 'vue-grid-layout'
 

import ApacheECharts from './component/ApacheECharts'
import TableDatav from './component/TableDatav'
import Digital from './component/Digital'
import HeadTitle from './component/HeadTitle'

import { getUUID } from "../../utils/common";
export default {
  name: "LayoutContainer",
  props: {
    //获取和更新后台布局配置的code
    layoutCode: {
      type: String,
      default: '',
    }

  },
  data() {
    return {
      containerId: '',
      //当前页面模式 edit:编辑模式， show:展示模式
      model: "show",
      //是否可拖拽
      isDraggable: false,
      //是否可调整大小
      isResizable: false,
      allLayoutConfig:[],
      //栅格高度 单位:像素
      rowHeight: 20,
      //栅格行数
      rowNum: 30,
      //栅格行距 单位:像素
      rowMargin: 4,
      //栅格列距 单位:像素
      colMargin: 4,

      componentAddVisible: false,
      componentAddForm:{
        componentCode: null,
        componentName: null,
        componentType: null,
        config: null,
        layoutConfig:null
      },
      componentConfigOneEditVisible: false,
      componentConfigOneEditForm:{
        componentCode: null,
        componentName: null,
        componentType: null,
        config: null
      },
      componentConfigTwoEditVisible: false,
      componentConfigTwoEditForm:{
        componentCode: null,
        httpMethod: null,
        url: null,
        headerJson: null,
        reqJson: null,
        responseAnalysis: null,
        refreshRate: null,
        responseTtl: null
      },
      componentTypeOptions:[
        {
          value: "HeadTitle",
          label: '头部标题'
        },{
          value: "Digital",
          label: '数显'
        },{
          value: "ApacheECharts",
          label: 'ApacheECharts'
        },{
          value: "TableDatav",
          label: '表格(datav)'
        },{
          value: "RankingDatav",
          label: '排名轮播表(datav)'
        }

      ],

    }
  },

  watch:{
    layoutCode(){
      this.getLayout();
      this.$forceUpdate();

    }

  },
  // 注册组件
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    ApacheECharts,
    TableDatav,
    HeadTitle,
    Digital
  },


  /**
   * 创建完毕
   */
  created() {
    this.containerId=getUUID();
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    editLayout(){
      this.model = "edit";
      this.isDraggable = true;
      this.isResizable = true;
    },
    showLayout(){
      this.model = "show";
      this.isDraggable = false;
      this.isResizable = false;
    },

    addLayout(){
      this.componentAddVisible = true;
    },

    getLayout(){
      getListComponentConfig(this.layoutCode)
        .then(res => {
          if (res.returnInfo.returnCode === "SUC0000") {
            let _allLayoutConfig = [];
            for(let i=0; i<res.configList.length; i++){
              let layoutConfigStr = res.configList[i].layoutConfig;
              _allLayoutConfig.push(JSON.parse(layoutConfigStr));
            }
            this.allLayoutConfig = _allLayoutConfig;
          } else {
             this.$message({
              type: 'info',
              message: res.returnInfo.errorMsg
            })

          }
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.$message.error('获取组件配置列表失败')
        })

    },

    refreshGridHeight(){
      let containerHeight = document.getElementById(this.containerId).offsetHeight;
      this.rowHeight = (containerHeight - (this.rowNum+1)*this.rowMargin)/this.rowNum;
    },

    //删除栅格组件
    deleteComponent(i){
      this.$confirm('删除组件: '+i, '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parameter = {
          layoutCode: this.layoutCode,
          componentCode: i
        };
        deleteComponentConfig(parameter)
          .then(res => {
            if (res.returnInfo.returnCode === "SUC0000") {
              this.$message({
                type: 'success',
                message: '删除成功'
              })

            } else {
              this.$message({
                type: 'info',
                message: res.returnInfo.errorMsg
              })

            }
          })
          .catch(err => {
            console.log(err)
            this.loading = false
            this.$message.error('删除组件失败')
          })
        this.allLayoutConfig = this.allLayoutConfig.filter(
          item=>!(item.i===i)
        );

      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        });
      });

    },

    //组件新增
    componentAdd(){
      this.componentAddForm.layoutCode = this.layoutCode;
      //栅格的 i 取componentCode
      let layoutConfig = {"x":10,"y":10,"w":10,"h":10,"i":this.componentAddForm.componentCode
        , "componentType": this.componentAddForm.componentType};

      this.componentAddForm.layoutConfig = JSON.stringify(layoutConfig);
      addComponentConfig(this.componentAddForm)
        .then(res => {
          if (res.returnInfo.returnCode === "SUC0000") {

            //后台添加成功，前端展示添加
            this.allLayoutConfig.push(layoutConfig);
            this.closeComponentAddDialog();
            this.$message({
              type: 'success',
              message: '添加成功'
            })

          } else {
            this.$message({
              type: 'info',
              message: res.returnInfo.errorMsg
            })

          }
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.$message.error('新增组件失败')
        })

    },

    //关闭组件新增弹窗
    closeComponentAddDialog(){
      this.componentAddVisible = false;
      this.componentAddForm = {
        componentCode: null,
        componentName: null,
        componentType: null,
        config: null,
        layoutConfig: null
      };

    },

    //发生移动后保存
    movenEvent(i, newX, newY){
      let currentLayoutConfig = this.allLayoutConfig.find(
        item=>item.i===i
      );

      let parameter = {
        layoutCode: this.layoutCode,
        componentCode: i,
        layoutConfig: JSON.stringify(currentLayoutConfig)
      }
      this.updateComponent(parameter);
    },

    //大小改变
    resizeEvent(i, newH,newW,newHPx, newWPx){
      let currentLayoutConfig = this.allLayoutConfig.find(
        item=>item.i===i
      );
      let parameter = {
        layoutCode: this.layoutCode,
        componentCode: i,
        layoutConfig: JSON.stringify(currentLayoutConfig)
      }
      this.updateComponent(parameter);
      //通知子组件刷新大小
      this.$root.Bus.$emit("gridResize", i);
    },

    //更新组件后台数据
    updateComponent(parameter){
      //请求后台
      updateComponentConfig(parameter)
        .then(res => {
          if (res.returnInfo.returnCode === "SUC0000") {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.componentConfigOneEditVisible = false;
            this.componentConfigTwoEditVisible = false;

          } else {
            this.$message({
              type: 'info',
              message: res.returnInfo.errorMsg
            })

          }
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.$message.error('新增组件失败')
        })
    },

    //查询后台组件配置(配置), 有两个编辑弹窗,type分辨是哪个弹窗
    openComponentConfigEditDialog(componentCode, type){
      getComponentConfig(this.layoutCode, componentCode)
        .then(res => {

          if (res.returnInfo.returnCode === "SUC0000") {
            if(type==='1'){
              this.componentConfigOneEditForm.layoutCode = res.layoutCode;
              this.componentConfigOneEditForm.componentCode = res.componentCode;
              this.componentConfigOneEditForm.componentName = res.componentName;
              this.componentConfigOneEditForm.componentType = res.componentType;
              this.componentConfigOneEditForm.config = res.config;
            }else if(type==='2'){
              this.componentConfigTwoEditForm.layoutCode = res.layoutCode;
              this.componentConfigTwoEditForm.componentCode = res.componentCode;
              this.componentConfigTwoEditForm.httpMethod = res.httpMethod;
              this.componentConfigTwoEditForm.url = res.url;
              this.componentConfigTwoEditForm.headerJson = res.headerJson;
              this.componentConfigTwoEditForm.reqJson = res.reqJson;
              this.componentConfigTwoEditForm.responseAnalysis = res.responseAnalysis;
              this.componentConfigTwoEditForm.refreshRate = res.refreshRate;
              this.componentConfigTwoEditForm.responseTtl = res.responseTtl;
            }

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
          this.$message.error(this.componentCode + '组件配置获取失败')
        })

    },

    //弹出编辑页面, 有两个编辑弹窗,type分辨是哪个弹窗
    editComponentConfig(componentCode, type){
      if(type==='1'){
        this.componentConfigOneEditVisible = true;
      }else if(type==='2'){
        this.componentConfigTwoEditVisible = true;
      }
      this.openComponentConfigEditDialog(componentCode, type);
    },

    //关闭编辑页面的回调函数,有两个编辑弹窗,type分辨是哪个弹窗
    closeComponentConfigEditDialog(type){
       if(type==='1'){
        this.componentConfigOneEditForm = {
          componentCode: null,
          componentName: null,
          componentType: null,
          config: null
        };
        this.componentConfigOneEditVisible = false;
      }else if(type==='2'){
        this.componentConfigTwoEditForm = {
          componentCode: null,
          httpMethod: null,
          url: null,
          headerJson: null,
          reqJson: null,
          responseAnalysis: null,
          refreshRate: null,
          responseTtl: null
        }
        this.componentConfigTwoEditVisible = false;
      }
    },

    //更新配置相关字段
    componentConfigUpdateConfig(type){
      if(type==='1'){
        this.updateComponent(this.componentConfigOneEditForm);
      }else if(type==='2'){
        this.updateComponent(this.componentConfigTwoEditForm);
      }
    },

    //更新接口相关字段
    componentConfigUpdateInterface(){

    },




  },

  mounted(){
    this.getLayout();
    this.refreshGridHeight();
    let _this = this;
    window.addEventListener("resize", function () {
      _this.refreshGridHeight();
    });
  }
}
</script>

<style scoped>
.vue-grid-item{
  background-color: rgba(6, 30, 93, 0.5);
}

.grid-container{
  background: url("~@/assets/img/bigScreenBg.png");
    position: relative;
}

.config-button {

  position: absolute;
  text-align: right;
  left: 20px;
  top: 10px;
  z-index: 200;
}

.close-icon {
  float: right;
  position: absolute;
  text-align: right;
  right: 0px;
  top: 0px;
  z-index: 200;
}


.edit-button {
  position: absolute;
  top: 4px;
  right: 20px;
  z-index: 10;
}

.el-button--mini.is-round {
  padding: 3px 10px !important;
  border: 0px;
  background-color: #0b2698;
}
</style>