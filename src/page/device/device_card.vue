<template>
  <div id="devicecard">
    <div class="box">
      <router-link v-bind:to="{name:'editdevice',query:{serialNo:repData.serialNo,carName:repData.carName,number:repData.number}}">
        <div class="device clearfix">
          <img :src="repData.photo?$api.root+repData.photo:this.$api.root+'/wechat/static/image/userhead.png'" alt="">
          <div class="content">
            <div class="number clearfix">
              <span class="title">设备编号：</span>
              <span class="serialNo">{{repData.serialNo}}</span>
            </div>
            <div class="number clearfix">
              <span class="title">绑定物名：</span>
              <span class="serialNo">{{ repData.carName}}</span>
            </div>
          </div>
          <div class="arrow"></div>
        </div>
      </router-link>
    </div>
    <div class="box">
      <ul class="status">
        <li>
          <span class="name">当前状态：</span>
          <span class="value" v-if="repData.usedState === 0">未激活</span>
          <span class="value" v-if="repData.usedState === 1">使用</span>
          <span class="value" v-if="repData.usedState === 2">损坏</span>
          <span class="value" v-if="repData.usedState === 3">待充值</span>
          <span class="chart" @click="openStatus">状态一览</span>
        </li>
        <li>
          <span class="name">最后位置：</span>
          <p class="value">{{lastAddress}}</p>
        </li>
        <li>
          <span class="name">通讯时间：</span>
          <span class="value">{{repData.lastUtcTime | formatDate}}</span>
        </li>
        <li>
          <span class="name"><span>经</span><span>纬</span><span>度：</span></span>
          <span class="value">{{repData.lastLocation.lng.toFixed(4)}},{{repData.lastLocation.lat.toFixed(4)}}</span>
        </li>
      </ul>
      <div class="btn-list">
        <router-link v-bind:to="{name:'index',params:{serialNo:repData.serialNo,trace:true}}">
          <span class="btn">追踪</span>
        </router-link>
        <router-link v-bind:to="{name:'order',query:{serialNo:repData.serialNo,carName:repData.carName}}">
          <span class="btn">指令</span>
        </router-link>
        <router-link class="no-margin" v-bind:to="{name:'historytrack',query:{serialNo:repData.serialNo}}">
          <span class="btn">历史轨迹</span>
        </router-link>
      </div>
    </div>
    <div class="box other-operation">
      <ul>
        <li>
          <span class="name">设备编号：</span>
          <span class="left">{{repData.serialNo}}</span>
        </li>
        <li>
          <span class="name">设备型号：</span>
          <span class="left">{{repData.deviceType}}</span>
        </li>
        <li>
          <span class="name"><span class="three">通</span><span class="three">讯</span>号：</span>
          <span class="left">{{repData.phone}}</span>
        </li>
        <li>
          <span class="name">开通时间：</span>
          <span class="left">{{repData.createTime}}</span>
        </li>
        <li @click="bugTime(repData.deviceId)">
          <span class="name">到期时间：</span>
          <span class="left">{{repData.expireAt}}</span>
          <span class="right-arrow"></span>
          <span class="right">购买服务时长</span>
        </li>
        <router-link class='secure' v-bind:to="{name:'tag',query:{deviceId : repData.serialNo}}">
          <li>
            <span class="name"><span class="two">标</span>签：</span>
            <span class="right-arrow"></span>
            <span class="right">{{repData.tags}}</span>
          </li>
        </router-link>
        <router-link class='secure' v-bind:to="{name:'editspeed',query:{deviceId : repData.serialNo}}">
          <li>
            <span class="name">超速报警：</span>
            <span class="right-arrow"></span>
            <span class="right">{{repData.alertSpeed}} km/h</span>
          </li>
        </router-link>
        <router-link class='secure' v-bind:to="{name:'regionrail',query:{serialNo : repData.serialNo}}">
          <li>
            <span class="name">区域报警：</span>
            <span class="right-arrow"></span>
            <span class="right">通过行政区域规划设置报警</span>
          </li>
        </router-link>
        <router-link class='secure' v-bind:to="{name:'rail',query:{serialNo : repData.serialNo , lng : repData.lastLocation.lng , lat : repData.lastLocation.lat}}" >
          <li>
            <span class="name">电子围栏：</span>
            <span class="right-arrow"></span>
            <span class="right">通过地图设置围栏进行报警</span>
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
  import {formatDate} from '../../utils/filters.js';
  import gpsPoi from '../../utils/gpsPoi';
  export default {
    data() {
      return {
        repData: {},
        geolocationLng:null,
        geolocationLat:null,
        deviceId: null,
        lastAddress:null
      };
    },
    created() {
      console.log(2);
      this.deviceId = this.$route.query.deviceId;
      this.fetchData();

      //百度当前定位
      let that = this;
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
          var gdPoi = gpsPoi.bdTogd(r.point.lng , r.point.lat);
          that.geolocationLng = gdPoi["lng"];
          that.geolocationLat = gdPoi["lat"];
        }
      },{enableHighAccuracy: true});
    },
    activated(){
      this.deviceId = this.$route.query.deviceId;
      this.fetchData();
    },
    mounted() {

    },
    methods: {
      fetchData(){
        this.getDevice(this.deviceId);
      },
      getDevice(deviceId) {
        let that = this;
        this.$api.get("/device/device/clientGetDetailInfo.do", {
          serialNo: deviceId,
        }, function (success) {
          if(success.status===0){
            console.log(success);
            that.repData = success.result;
            if(success.result.lastLocation.lng === 0){
              that.repData.lastLocation.lng = that.geolocationLng;
            }
            if(success.result.lastLocation.lat === 0){
              that.repData.lastLocation.lat = that.geolocationLat;
            }
            var point = new BMap.Point(success.result.lastLocation.lng,success.result.lastLocation.lat);
            var geoc = new BMap.Geocoder();
            geoc.getLocation(point, function(rs){
              var addComp = rs.addressComponents;
              that.lastAddress = addComp.city+addComp.district+addComp.street;
            });
          }
        }, function (failure) {
        })
      },
      openStatus(){
        this.$router.push({name:'alertstatus',query:{id:1}})
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
    },
    filters: {
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    }
  };
</script>

<style scoped lang="less">
  @import '../../style/less/device/device_card.less';
</style>
