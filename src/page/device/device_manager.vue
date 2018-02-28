<template>
  <div id='devicelist'>
    <div class="head-fixed">
      <div class="search">
        <router-link class='secure' v-bind:to="'/searchlist/manager'">
          <input class="input" type="text" placeholder="设备编号、绑定物名字、通讯号" readonly/>
        </router-link>
        <div class='secure' @click="goAddDeice">
          <span class="add-icon"></span>
        </div>
      </div>
      <div class="tab clearfix">
        <span class="tab-item" :class="{ 'select': requestParams.type == 0}"
              v-if="devicesResult.totalDevice > 99"
              @click='screen(0);'>全部(99+)</span>
        <span class="tab-item" :class="{ 'select': requestParams.type == 0}"
              v-else
              @click='screen(0);'>全部({{devicesResult.totalDevice}})</span>

        <span class="tab-item" :class="{ 'select': requestParams.type == 1}"
              v-if="devicesResult.usedDevice > 99"
              @click='screen(1);'>使用(99+)</span>
        <span class="tab-item" :class="{ 'select': requestParams.type == 1}"
              v-else
              @click='screen(1);'>使用({{devicesResult.usedDevice}})</span>

        <span class="tab-item" :class="{ 'select': requestParams.type == 2}"
              v-if="devicesResult.unActivatedDevice > 99"
              @click='screen(2);'>未激活(99+)</span>
        <span class="tab-item" :class="{ 'select': requestParams.type == 2}"
              v-else
              @click='screen(2);'>未激活({{devicesResult.unActivatedDevice}})</span>

        <span class="tab-item" :class="{ 'select': requestParams.type == 3}"
              v-if="devicesResult.unRechargedDevice > 99"
              @click='screen(3);'>待充值(99+)</span>
        <span class="tab-item" :class="{ 'select': requestParams.type == 3}"
              v-else
              @click='screen(3);'>待充值({{devicesResult.unRechargedDevice}})</span>

        <span class="tab-item" :class="{ 'select': requestParams.type == 4}"
              v-if="devicesResult.brokenDevice > 99"
              @click='screen(4);'>损坏(99+)</span>
        <span class="tab-item" :class="{ 'select': requestParams.type == 4}"
              v-else
              @click='screen(4);'>损坏({{devicesResult.brokenDevice}})</span>
      </div>
    </div>
    <div class="page-loadmore-wrapper" ref="wrapper"  :style="{ height: wrapperHeight + 'px','-webkit-overflow-scrolling': scrollMode}">
      <mt-loadmore :bottom-method="loadBottom" :auto-fill="false" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
        <ul class="list">
          <div v-if="showRecharge" class="recharge" @click="rechargeMethod">批量充值</div>
          <div v-if="selectRecharge" class="recharge">
            <span class="selectNum">已选择（{{selectedDevices.length}}/10）</span>
            <span class="btn" @click="rechargeAll">进行充值</span>
            <span class="btn" @click="cancelSelect">取消</span>
          </div>
          <li v-for='item in list'>
            <input v-if="selectRecharge" :id="item.serialNo" class="check1" name="rechargeDevices" type="checkbox" @click="selectDevice(item.deviceId,$event);"/>
            <img v-else="selectRecharge" src="../../../static/image/defaultCar.png" alt="">
            <div @click="openBottomPopup(item)">
              <div class="content">
                <div class="number clearfix">
                  <span class="title">设备编号：</span>
                  <span class="serialNo">{{item.serialNo }}</span>
                </div>
                <div class="number clearfix" v-if="!showInactive">
                  <span class="title">绑定物名：</span>
                  <span class="serialNo">{{item.carName }}</span>
                </div>
                <div class="number clearfix" v-if="showInactive">
                  <span class="title">设备型号：</span>
                  <span class="serialNo">{{item.deviceType }}</span>
                </div>
              </div>
              <p class="device" v-if="showName">{{item.deviceType}}</p>
              <div class="inactive" v-if="showInactive">
                <router-link class='secure' v-bind:to="'/editdevicebind'">
                  <span class="btn">绑定物</span>
                </router-link>
                <router-link class='secure' v-bind:to="{name:'devicecard',query:{deviceId : item.serialNo}}">
                  <span class="btn">详情</span>
                </router-link>
              </div>
              <div class="device-recharge" v-if="showRecharge">
                <P class="des" v-if="item.isExpired === 1">过期</P>
                <P class="des" v-if="item.isExpired === 0">未过期</P>
                <!--<router-link class='secure' v-bind:to="{path:'devicecard',params:{deviceId : item.serialNo}}">-->
                  <span class="btn" @click="recharge(item.deviceId)">充值</span>
                <!--</router-link>-->
              </div>
              <div class="inactive" v-if="showSpoilage">
                <span class="btn long-btn" @click="goodDevice">修复完成</span>
                <router-link class='secure' v-bind:to="{name:'devicecard',query:{deviceId : item.serialNo}}">
                  <span class="btn">详情</span>
                </router-link>
              </div>
            </div>
          </li>
          <div class="inactive" v-if="showInactive">
            <p class="des">设备开机并进行首次和平台交互后，设备将激活。使用期将开始计算</p>
            <router-link class='secure' v-bind:to="'/activation'">
              <div class="blue-btn">查看常见激活解决方案</div>
            </router-link>
            <a class="blue-btn call" href="tel:110120119122">电话联系客服解决激活问题</a>
          </div>
        </ul>
        <div slot="bottom" class="mint-loadmore-bottom">
          <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
          <span v-show="bottomStatus === 'loading'">
                <mt-spinner class="loading" color="#26a2ff" type="fading-circle"></mt-spinner>
            </span>
        </div>
      </mt-loadmore>
      <mt-popup v-model="popupValue.popupVisible" position="bottom" class="popup" v-if="showPopup">
        <router-link class='secure' v-bind:to="{name:'tag',query:{deviceId : popupValue.data.serialNo}}">
          <div class="item"><img src="../../../static/image/label.png" alt="">设置标签</div>
        </router-link>
        <router-link class='secure' v-bind:to="{name:'rail',query:{serialNo:popupValue.data.serialNo,routeForm:'deviceManager'}}">
          <div class="item"><img src="../../../static/image/rail.png" alt="">设置电子围栏</div>
        </router-link>
        <router-link class='secure' v-bind:to="'/regionrailcard/new'">
          <div class="item"><img src="../../../static/image/regionrail.png" alt="">设置区域围栏</div>
        </router-link>
        <router-link class='secure' v-bind:to="{name:'index',params:{serialNo:popupValue.data.serialNo}}" >
          <div class="item"><img src="../../../static/image/monitor.png" alt="">定位监控</div>
        </router-link>
        <div class="item"  @click="bugTime(popupValue.data.deviceId)"><img src="../../../static/image/time.png" alt="">购买使用时长</div>
        <router-link class='secure' v-bind:to="{name:'massagelist',query :{title:'报警消息',type:0,serialNo:popupValue.data.serialNo}}">
          <div class="item"><img src="../../../static/image/policemassage.png" alt="">报警消息</div>
        </router-link>
        <router-link class='secure' v-bind:to="{name:'devicecard',query:{deviceId : popupValue.data.serialNo}}">
          <div class="item"><img src="../../../static/image/detail.png" alt="">设备详情</div>
        </router-link>
        <div class="item" v-if="popupValue.data.usedState === 0" @click="setDeviceStatus(popupValue.data.serialNo,1,true);"><img src="../../../static/image/spoilage.png" alt="">激活设备</div>
        <div class="item" v-if="popupValue.data.usedState === 1" @click="setDeviceStatus(popupValue.data.serialNo,2);"><img src="../../../static/image/spoilage.png" alt="">设为损坏</div>
        <div class="item" v-else-if="popupValue.data.usedState === 2" @click="setDeviceStatus(popupValue.data.serialNo,1,true);"><img src="../../../static/image/spoilage.png" alt="">设为修复</div>
      </mt-popup>
    </div>
  </div>
</template>
<script>
  import {MessageBox} from 'mint-ui';
  import {Indicator} from 'mint-ui';
  import {Toast} from 'mint-ui';
  import cookieUtil from '../../utils/utils'
  export default {
    data() {
      return {
        list: [],  //设备管理列表
        devicesResult: {}, //设备管理列表各类型总数
        fieldId:null,  //设备编号筛选条件
        showInactive: false,  //控制未激活显示dom
        showRecharge: false,  //控制充值显示dom
        selectRecharge: false,  //控制选择设备显示dom
        showName: true,  //控制全部和使用中  显示设备型号
        showSpoilage: false, //控制损坏显示dom
        showPopup: true, //在全部或者使用中点击列表项，下方弹出弹窗(这里控制遮罩显示)
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        totalPage:0,  //总共页数
        selectedDevices:[], //批量充值选中设备
        scrollMode:'auto', //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        popupValue: {
          popupVisible: false,
          data: {}
        },
        requestParams:{ //请求参数
          user: cookieUtil.getCookie("user"),
          type: 0,   // 0-全部、1-使用、2-未激活、3-待充值、4-损坏
          tagId:null,
          pageSize: 10,
          pageNum: 1,
          serialNo:null,
        },
        totalContent:null
      };
    },
    created() {
      let data = this.$route.params.data;
      if(data && data.fieldType === 1){
        this.requestParams.tagId = data.fieldId;
      }else if(data){
        this.requestParams.serialNo = data.fieldId;
      }
      this.getDevices();
    },
    activated(){
      let data = this.$route.params.data;
      console.log(data);
      if(data && data.fieldType === 1){
        this.requestParams.tagId = data.fieldId;
      }else if(data){
        this.requestParams.serialNo = data.fieldId;
      }
      this.getDevices();
    },
    deactivated() {
      this.popupValue.popupVisible = false;
    },

    methods: {
      goAddDeice(){
        sessionStorage.removeItem('deviceAddInfo');
        this.$router.push({name:'deviceadd',query:{routeFrom:'devicemanager'}});
      },
      openAlert(content) {
        MessageBox.alert(content, '提示');
      },
      getDevices(){ //初次查询
        let that = this;
        this.requestParams.pageNum = 1;
        this.$api.get("/device/device/clientListDevices.do", {
          user: this.requestParams.user,
          type: this.requestParams.type,
          tagId:this.requestParams.tagId,
          pageSize: this.requestParams.pageSize,
          pageNum: this.requestParams.pageNum,
          serialNo:this.requestParams.serialNo,
        }, function (success) {
          if (success.status === 0) {
            console.log(success);
            that.devicesResult = success.result;
            that.list = success.result.list;
            that.totalContent = success.result.totalDevice;
            that.totalPage = Math.ceil(success.result.totalNum/that.requestParams.pageSize);
            if(that.totalPage === 1){
              that.allLoaded = true;
            }
            that.$nextTick(function () {
              // 是否还有下一页，加个方法判断，没有下一页要禁止上拉
              that.scrollMode = "touch";
              that.isHaveMore();
            });
            that.wrapperHeight = document.documentElement.clientHeight - that.$refs.wrapper.getBoundingClientRect().top;
          } else {
            //请求失败
            that.openAlert(success.message);
          }
        }, function (error) {

        })
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        // 上拉加载
        this.more();// 上拉触发的分页查询
        this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
      },
      more(){ // 分页查询
        let that = this;
        if(this.allLoaded) return;
        if(this.totalpage === 1){
          this.requestParams.pageNum = 1;
          this.allLoaded = true;
        }else{
          this.requestParams.pageNum = parseInt(this.requestParams.pageNum) + 1;
          this.allLoaded = false;
        }
        this.$api.get("/device/device/clientListDevices.do", {
          user: that.requestParams.user,
          type: that.requestParams.type,
          pageSize: that.requestParams.pageSize,
          pageNum: that.requestParams.pageNum,
          serialNo:that.requestParams.serialNo,
        }, function (success) {
          if (success.status === 0) {
            that.devicesResult = success.result;
            that.list.push.apply(that.list,success.result.list);
            that.totalContent = success.result.totalDevice;
            that.isHaveMore();
          } else {
            //请求失败
            that.openAlert(success.message);
          }
        }, function (error) {

        })
      },
      isHaveMore:function(){
        // 是否还有下一页，如果没有就禁止上拉刷新
        //this.allLoaded = false; //true是禁止上拉加载
        if(this.requestParams.pageNum == this.totalPage){
          this.allLoaded = true;
        }
      },
      screen(status){
        this.requestParams.serialNo = null;
        this.popupVisible = false;
        this.showName = false;
        this.showInactive = false;
        this.showRecharge = false;
        this.selectRecharge = false;
        this.showSpoilage = false;
        this.showPopup = false;
        this.requestParams.type = status;
        this.requestParams.pageNum = 1;
        this.selectedDevices = [];
        if (status === 0 || status === 1) {
          this.showName = true;
          this.showPopup = true;
        }
        if (status === 2) {
          this.showInactive = true;
        }
        if (status === 3) {
          this.showRecharge = true;
        }
        if (status === 4) {
          this.showSpoilage = true;
        }
        this.getDevices();
      },
      rechargeMethod(){  //批量充值
        this.showRecharge=false;
        this.selectRecharge=true;
      },
      selectDevice(deviceId,event){  //多选
        if(this.selectedDevices.length<10){
          let el = event.currentTarget;
          if(el.checked){
            this.selectedDevices.push(deviceId);
          }else {
            for(let i=0;i<this.selectedDevices.length;i++){
              if(this.selectedDevices[i]===deviceId){
                this.selectedDevices.splice(i, 1);
                break;
              }
            }
          }
        }else {
          Toast({
            message: '最多选择10个设备',
            position: 'bottom',
          });
        }
      },
      cancelSelect(){  //取消批量充值
        this.selectRecharge=false;
        this.showRecharge=true;
        this.selectedDevices=[];
      },
      rechargeAll(){  //进行批量充值
        if(this.selectedDevices.length===0){
          MessageBox.alert("请选择至少一个设备");
          return false;
        }
        let deviceIds=this.selectedDevices.join(",");
        console.log(deviceIds);
        this.recharge(deviceIds);
      },
      recharge(deviceIds){
        //window.location.href = 'https://www.baidu.com/';
        this.$api.get("/financial/chargeOrder/order.do", {
          sources:1,
          deviceIds: deviceIds,
        }, function (success) {
          if(success.status===0){
            console.log(success);
            window.location.href = success.message;
            return;
          }
          MessageBox.alert(success.message);

        }, function (failure) {

        })
      },
      goodDevice(){  //设备已修
        MessageBox.confirm('确认设备已经完成修复？能够正常使用?').then(action => {
          this.setDeviceStatus(this.popupValue.data.serialNo,1);
        }).catch(() => {
          this.openAlert('失败');
        });
      },
      openBottomPopup(item){
        this.popupValue.popupVisible = true;
        this.popupValue.data = item;
        console.log(this.popupValue.popupVisible);
      },
      setDeviceStatus(serialNo,state,fromPopup){  //设为损坏或者修复
        let that = this;
        this.$api.post("/device/device/clientUpdateState.do", {
          usedState: state,
          serialNo: serialNo
        }, function (success) {
          if (success.status === 0) {
            that.openAlert('设置成功');
            if (state === 1 && !fromPopup){
              that.screen(4);
            }else {
              that.getDevices();
            }
            that.popupValue.popupVisible = false;
          }
        }, function (error) {

        })
      },
      bugTime(deviceIds){
        this.$api.get("/financial/chargeOrder/order.do", {
          sources:1,
          deviceIds: deviceIds,
        }, function (success) {
          if(success.status===0){
            console.log(success);
            window.location.href = success.message;
          }
        }, function (failure) {

        })
      }
    }
  };
</script>
<style scoped lang='less'>
  @import '../../style/less/device/device_manager.less';
</style>
