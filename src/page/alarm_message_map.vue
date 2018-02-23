<template>
  <div id='index'>
    <div id='allmap'></div>
    <div id="device" class="device" :class="{show:isShow,hide:!isShow}">
      <div class="content-panel">
        <router-link :to="{name:'devicecard',query:{deviceId : dataParams.serialNo}}">
          <ul class="left">
            <li class="li">
              <span class="name">设备编号：</span>
              <span class="value">{{dataParams.serialNo}}</span>
            </li>
            <li class="li">
              <span class="name">绑定设备：</span>
              <span class="value">{{dataParams.carName}}</span>
            </li>
            <li class="li">
              <span class="name">报警类型：</span>
              <span class="value">{{dataParams.warningType}}</span>
            </li>
            <li class="li">
              <span class="name">报警时刻：</span>
              <span class="value">{{dataParams.lastUtcTime | formatDate}}</span>
            </li>
            <li class="li">
              <span class="name">报警位置：</span>
              <span class="value">{{dataParams.address}}</span>
            </li>
          </ul>
        </router-link>
      </div>
      <div class="btn-panel">
        <div class="btn" @click="trace">追踪</div>
          <div class="btn">历史轨迹</div>
          <div class="btn" @click="goList">设备信息</div>
      </div>
    </div>
    <!--<tabbar></tabbar>-->
  </div>
</template>
<script>
  import cookieUtil from '../utils/utils';
  import {formatDate} from '../utils/filters.js';
  import {MessageBox,Toast} from 'mint-ui';
  export default {
    data () {
      return {
        dataParams:{}, //返回数据
        requestParams:{ //请求参数
          user: cookieUtil.getCookie("user"),
          runningState:'',
          warningType:'',
          tags:'',
          pageSize:0,
          pageNum:1
        },
        isShow:true,
        gMap: null ,
        myPoint : null,

      }
    },
    created(){
      this.getData();
    },
    mounted() {
      var gThis = this;
      let that = this;
      // 百度地图API功能
      let map = new BMap.Map("allmap");
      this.gMap  = map ;
      map.enableScrollWheelZoom(true);
      map.addEventListener('dragstart',function () {  //移动地图，隐藏tab框
        that.isShow = false;
      });
      map.addEventListener('zoomstart',function () { //缩放地图，隐藏tab框
        that.isShow = false;
      });

      //定位当前位置
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
          gThis.myPoint = r.point;
        }
      },{enableHighAccuracy: true})

    },
    methods:{
      goList(){ //跳转详情页
        this.$router.push({name:'devicecard',query:{deviceId : this.dataParams.serialNo}})
      },
      trace() {  //追踪
        this.calc();
        this.isShow = false;
        this.addMarker();
      },
      calc() {
        if(this.myPoint == null) {
          return ;
        }
        var p1 = new BMap.Point(this.myPoint.lng , this.myPoint.lat);
        var p2 = new BMap.Point(this.dataParams.lastLocation.lng,this.dataParams.lastLocation.lat);
        var driving = new BMap.DrivingRoute( this.gMap, {renderOptions:{map: this.gMap, autoViewport: true}});
        driving.search(p1, p2);
      } ,
      screen(data){  //筛选
        let that = this;
        var serialNo = this.$route.query.serialNo;
        data.forEach(function (item,key) {
          if(serialNo === item.serialNo){
            let list = item;
            if(!list.lastLocation){
              Toast({
                message: '设备不存在',
                position: 'bottom',
              });
            }else {
              that.addMarker(list.lastLocation.lng,list.lastLocation.lat);
            }
            console.log(list);
            var lng = list.lastLocation.lng;
            var lat = list.lastLocation.lat;
            var point = new BMap.Point(lng, lat);
            var geoc = new BMap.Geocoder();
            geoc.getLocation(point, function (rs) {
              var addComp = rs.addressComponents;
              if(addComp){
                list.address = addComp.city + addComp.district + addComp.street;
                that.dataParams = list;
              }
            });
          }
        })
      },
      getData(){ //获取数据
        let that = this;
        this.$api.get("/device/device/clientFilterDevicesList.do",{
          user:this.requestParams.user,
          runningState:this.requestParams.runningState,
          warningType:this.requestParams.warningType,
          tags:this.requestParams.tags,
          pageSize:this.requestParams.pageSize,
          pageNum:this.requestParams.pageNum
        },function (data) {
          if(data.status === 0){
            that.screen(data.result.list);
            console.log(data.result.list);
            //that.dataList = data.result.list;
          }
          //that.checkLastLocation();
        },function (failure) {
        })
      },
      addMarker(lng,lat) {  //添加icon
        let gThis = this;
        let point = new BMap.Point(lng,lat);
        let myIcon = new BMap.Icon(gThis.$api.root+"/wechat/static/image/carIcon-x.png", new BMap.Size(30,53));
        this.gMap.centerAndZoom(point, 10);
        let marker = new BMap.Marker(point,{icon:myIcon});
        gThis.gMap.addOverlay(marker);
        marker.addEventListener("click",function(e) {
          gThis.isShow = !gThis.isShow;
        },true);
      }
    },
    filters: {
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    },
  }
</script>
<style scoped lang='less'>
  @import '../style/less/alarm_message_map.less';
  #allmap {
    width: 100vw;
    height:100vh;
    overflow: hidden;
    margin:0;
    font-family:"微软雅黑";
  }
</style>
