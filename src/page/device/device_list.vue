<template>
  <div id='devicelist' class="devicelist">
      <div class="head">
        <div class="search clearfix">
          <router-link class='secure' v-bind:to="'/searchlist/list'">
            <input class="input" type="text" placeholder="设备编号、绑定物名字、通讯号" readonly />
          </router-link>
          <router-link class='secure' v-bind:to="{name:'deviceadd',query:{routeFrom:'devicelist'}}">
            <span class="add-icon"></span>
          </router-link>
        </div>
        <div class="tab">
          <span class="tab-item bg-color" :class="{ 'select': deviceStatus == 0}"  @click='getDeviceStatus(0);'>行驶</span>
          <span class="tab-item bg-color" :class="{ 'select': deviceStatus == 1}" @click='getDeviceStatus(1);'>停车</span>
          <!--<span class="tab-item bg-color"  @click='getDeviceStatus(0);'>行驶</span>
          <span class="tab-item bg-color"  @click='getDeviceStatus(1);'>停车</span>-->
          <span class="tab-item pulldown" :class="{ 'select': labelStatus == 0}" @click='screen(0);'><span class="arrow" v-bind:class="{open:!policeClass,close:policeClass}"></span>报警</span>
          <span class="tab-item pulldown" :class="{ 'select': labelStatus == 1}" @click='screen(1);'><span class="arrow" v-bind:class="{open:!tagClass,close:tagClass}"></span>标签</span>
        </div>

        <div class="mask" :class='{show:isShowMask}'></div>

        <div class="tab-box" :class="{show:isShowAlarm}">
          <div class="label-box clearfix">
            <span class="label" ref="alarmList" v-for='(item,index) in alarm' @click="setAlarm(item.id,index)">{{item.name}}</span>
          </div>
          <div class="btn-box clearfix">
            <span class="btn" @click="clearAlarm">重置</span>
            <span class="btn blue" @click="getAlarm">确定</span>
          </div>
        </div>
        <div class="tab-box" :class='{show:isShowLabel}'>
          <div class="label-box clearfix">
            <span class="label" ref='tagList' v-for='(item,index) in label' @click="setTag(item.tagId,index)">{{item.name}}</span>
          </div>
          <div class="btn-box clearfix">
            <span class="btn" @click="clearTag">重置</span>
            <span class="btn blue" @click="getTag">确定</span>
          </div>
        </div>
      </div >
      <div class="page-loadmore-wrapper" :class="{overflow:isHidden}" ref="wrapper"  :style="{height: wrapperHeight + 'px','-webkit-overflow-scrolling': scrollMode}" >
        <mt-loadmore :bottom-method="loadBottom" :auto-fill="false" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="list">
            <li v-for='item in listData'>
              <router-link class='secure' v-bind:to="{name:'index',params:{serialNo:item.serialNo}}">
                  <img src="../../../static/image/defaultCar.png" alt="">
                  <div class="content">
                    <div class="number clearfix">
                      <span class="title">设备编号：</span>
                      <span class="serialNo">{{ item.serialNo }}</span>
                    </div>
                    <div class="number clearfix">
                      <span class="title">绑定物名：</span>
                      <span class="serialNo">{{ item.carName }}</span>
                    </div>
                  </div>
                  <div class="status-panel">
                    <span class="status green" v-if='item.runningState === 0'>行驶</span>
                    <span class="status red" v-else-if='item.runningState === 1'>停车</span>
                    <span class="type">{{item.warningType }}</span>
                  </div>
              </router-link>
              <router-link class='secure' v-bind:to="{name:'devicecard',query:{deviceId : item.serialNo}}">
                <div class="arrow"></div>
              </router-link>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
                <mt-spinner class="loading"  color="#26a2ff" type="fading-circle"></mt-spinner>
            </span>
          </div>
        </mt-loadmore>
      </div>
  </div>
</template>
<script>
  import { MessageBox,Toast } from 'mint-ui';
  import cookieUtil from '../../utils/utils'
  import index from "../../api/index";
  export default {
    data() {
      return {
        listData: [], //设备列表数据
        label:[], //标签
        alarm:[], //报警类型
        alarmIdList:[], //记录用户已选择的报警条件
        tagIdList:[], //记录用户已选择的报警条件
        requestParams:{ //请求参数
          user: cookieUtil.getCookie("user"),
          runningState:'',
          warningType:'',
          tags:'',
          pageSize: 10,
          pageNum: 1,
          serialNo:null,
        },

        policeClass:false,
        tagClass:false,
        allLoaded: false,
        totalPage:0,
        bottomStatus: '',
        wrapperHeight: 0,
        buttonBottom: 0,
        scrollMode:'auto', //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动

        status:null,  //记录报警、标签打开关闭状态
        deviceStatus:null, //记录行驶、停车选择状态
        labelStatus:null,  //记录报警、标签选择状态


        isShowMask:false, //遮罩层
        isHidden:false, //弹出遮罩，禁止下面滚动
        isShowLabel:false, //标签面板
        isShowAlarm:false, //报警面板
      };
    },
    created() {
      //获取标签
      let that = this;
      this.$api.get("/device/deviceTag/clientListDeviceTags.do",{
        user:that.requestParams.user,
      },function (data) {
        if(data.status === 0){
          that.label = data.result;
        }else {
          this.openAlert(data.message);
        }
      },function (failure) {

      });
      //获取报警类型
      this.$api.get("/system/dict/warningType/clientQueryDictWarnType.do",{
      },function (data) {
        if(data.status === 0){
          that.alarm = data.result;
        }else {
          this.openAlert(data.message);
        }
      },function (failure) {

      });

      let data = this.$route.params.data;
      if(data && data.fieldType === 1){
        this.requestParams.tags = data.fieldId;
      }else if(data && data.fieldType != 1){
        this.requestParams.serialNo = data.fieldId;
      }
      this.getDevices();//初次访问查询列表

    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight;
      localStorage.removeItem('deviceId');
    },
    beforeRouteLeave(to, from, next) {
      // 设置下一个路由的 meta
      to.meta.keepAlive = true;  // B 跳转到 A 时，让 A 缓存，即不刷新
      next();
    },
    methods: {
      getDeviceStatus(deviceStatus){   //查询设备停使
        if(this.deviceStatus != deviceStatus) {
          this.isShowMask = false;
          this.isShowLabel = false;
          this.isShowAlarm = false;
          this.deviceStatus = deviceStatus;
          this.status = null;
          this.labelStatus = null;
        }else {
          this.deviceStatus = null;
          this.isShowMask = false;
          this.isShowLabel = false;
          this.isShowAlarm = false;
          this.status = null;
          this.labelStatus = null;
        }
        this.requestParams.pageNum = 1;
        this.requestParams.runningState = this.deviceStatus;
        this.getDevices();
      },
      screen(status){   //根据报警和标签筛选
        if(this.status != status){
          this.isHidden = true;
          if(status === 0){
            this.isShowMask = true;
            this.isShowAlarm = true
            this.isShowLabel = false;
            this.status = status;
            this.labelStatus = status;
            this.policeClass = true;
            this.tagClass = false;
            return
          }
          if(status === 1){
            this.isShowMask = true;
            this.isShowLabel = true;
            this.isShowAlarm = false;
            this.status = status;
            this.labelStatus = status;
            this.policeClass = false;
            this.tagClass = true;
            return
          }
        }
        this.isHidden = false;
        this.status = null;
        this.labelStatus = null;
        this.isShowMask = false;
        this.isShowLabel = false;
        this.isShowAlarm = false;
        this.policeClass = false;
        this.tagClass = false;
        this.requestParams.pageNum = 1;
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        // 上拉加载
        this.more();// 上拉触发的分页查询
        this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
      },
      openAlert(content) {
        MessageBox.alert(content, '提示');
      },
      goodDevice(){
        MessageBox.confirm('确认设备已经完成修复？能够正常使用?').then(action => {
          this.openAlert('成功');
        }).catch(()=>{
          this.openAlert('失败');
        });
      },
      setAlarm(id,index){  //选择报警类型
        let alarmList = this.$refs.alarmList;
        for(let i in alarmList ){
          if(i == index && !alarmList[i].id){
            alarmList[i].id = index;
            alarmList[i].className = 'select';
            this.alarmIdList.push(id);
            // console.log(this.alarmIdList);
            return;
          }
          if(i == index && alarmList[i].id){
            alarmList[i].removeAttribute('id');
            alarmList[i].className = 'label';
            for(let x in this.alarmIdList){
              if(this.alarmIdList[x] === id){
                this.alarmIdList.splice(x, 1)
              }
            }
            return;
          }
        }
      },
      setTag(id,index){  //选择标签
        let tagList = this.$refs.tagList;
        for(let i in tagList ){
          if(i == index && !tagList[i].id){
            tagList[i].id = index;
            tagList[i].className = 'select'
            this.tagIdList.push(id);
            return;
          }
          if(i == index && tagList[i].id){
            tagList[i].removeAttribute('id');
            tagList[i].className = 'label';
            for(let x in this.tagIdList){
              if(this.tagIdList[x] === id){
                this.tagIdList.splice(x, 1)
              }
            }
            return;
          }
        }
      },
      clearTag(){  //重置标签
        this.policeClass = false;
        this.tagClass = false;
        this.status = null;
        this.labelStatus = null;
        let tagList = this.$refs.tagList;
        for(let i in tagList ){
          tagList[i].removeAttribute('id');
          tagList[i].className = 'label';
        }
        this.requestParams.tags = '';
        this.getDevices();
      },
      clearAlarm(){ //重置报警
        this.policeClass = false;
        this.tagClass = false;
        this.status = null;
        this.labelStatus = null;
        let alarmList = this.$refs.alarmList;
        for(let i in alarmList ){
          alarmList[i].removeAttribute('id');
          alarmList[i].className = 'label';
        }
        this.requestParams.warningType = '';
        this.getDevices();
      },
      getTag(){  //提交标签
        this.policeClass = false;
        this.tagClass = false;
        this.status = null;
        this.requestParams.tags = this.tagIdList.join('|');
        console.log(this.requestParams.tags);
        if(this.requestParams.tags === ''){
          this.labelStatus = null;
        }
        this.getDevices();
      },
      getAlarm(){ //提交报警
        this.policeClass = false;
        this.tagClass = false;
        this.status = null;
        this.requestParams.warningType = this.alarmIdList.join('|');
        if(this.requestParams.warningType === ''){
          this.labelStatus = null;
        }
        this.getDevices();
      },
      getDevices() { //初次加载获取设备列表信息
        let that = this;
        //this.requestParams.pageNum = 1;
        this.$api.get("/device/device/clientFilterDevicesList.do",{
          user:that.requestParams.user,
          runningState:this.requestParams.runningState,
          warningType:this.requestParams.warningType,
          tags:this.requestParams.tags,
          pageSize:this.requestParams.pageSize,
          pageNum:this.requestParams.pageNum,
          serialNo:this.requestParams.serialNo
        },function (data) {
          if(data.status === 0){
            if(data.result.list.length === 0){
              Toast({
                message: '查询无记录',
                position: 'center',
              });
            }
            that.listData = data.result.list;
            that.isShowMask = false;
            that.isShowLabel = false;
            that.isShowAlarm = false;
            that.isHidden = false;
            that.totalPage = Math.ceil(data.result.totalNum/that.requestParams.pageSize);
            if(that.totalPage === 1){
              that.allLoaded = true;
            }else{
              that.allLoaded = false;
            }
            that.$nextTick(function () {
              // 是否还有下一页，加个方法判断，没有下一页要禁止上拉
              that.scrollMode = "touch";
              that.isHaveMore();
            });
          }else {
            that.openAlert(data.message);
          }
        },function (failure) {

        })
      },
      more(){ // 分页查询
        let that = this;
        if(this.allLoaded) return false;
        if(this.totalpage === 1){
          this.requestParams.pageNum = 1;
          this.allLoaded = true;
        }else{
          this.requestParams.pageNum = parseInt(this.requestParams.pageNum) + 1;
          this.allLoaded = false;
        }
        this.$api.get("/device/device/clientFilterDevicesList.do",{
          user:that.requestParams.user,
          runningState:that.requestParams.runningState,
          warningType:that.requestParams.warningType,
          tags:that.requestParams.tags,
          pageSize:that.requestParams.pageSize,
          pageNum:that.requestParams.pageNum
        },function (data) {
          if(data.status === 0){
            that.listData.push.apply(that.listData,data.result.list);
            that.isShowMask = false;
            that.isShowLabel = false;
            that.isShowAlarm = false;
            that.isHidden = false;
            that.isHaveMore();
          }else {
            that.openAlert(data.message);
          }
        },function (failure) {

        })
      },
      isHaveMore:function(){
        // 是否还有下一页，如果没有就禁止上拉刷新
        //this.allLoaded = false; //true是禁止上拉加载
        if(this.requestParams.pageNum == this.totalPage){
          this.allLoaded = true;
        }
      }
    },
  };
</script>
<style scoped lang='less'>
  @import '../../style/less/device/device_list.less';
</style>
