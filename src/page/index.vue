<template>
    <div id='index'>
        <router-link class='secure' v-bind:to="'/devicelist'">
            <div class="list"></div>
        </router-link>
        <div id='allmap'></div>
        <div :class="{'show':showPopup}" class="device">
            <div class="content-panel">
              <router-link :to="{name:'devicecard',query:{deviceId : panelData.serialNo}}">
                <ul class="left">
                    <li class="li">
                        <span class="name">设备编号：</span>
                        <span class="value">{{panelData.serialNo}}</span>
                    </li>
                    <li class="li">
                        <span class="name">绑定设备：</span>
                        <span class="value">{{panelData.carName}}</span>
                    </li>
                    <li class="li">
                        <span class="name">当前状态：</span>
                        <span class="value" v-if="panelData.runningState === 1">停止</span>
                        <span class="value" v-if="panelData.runningState === 0">行驶</span>
                    </li>
                    <li class="li">
                        <span class="name">通讯时刻：</span>
                        <span class="value">{{panelData.lastUtcTime | formatDate}}</span>
                    </li>
                    <li class="li">
                        <span class="name">当前位置：</span>
                        <span class="value">{{panelData.lastLocationDesc}}</span>
                    </li>
                </ul>
                <div class="right-arrow"></div>
              </router-link>
            </div>
            <div class="btn-panel">
              <router-link class="btn" :to="''">
                <div @click="trace">追踪</div>
              </router-link>
              <router-link class="btn" :to="{name:'historytrack',query:{serialNo : panelData.serialNo}}">
                <div>历史轨迹</div>
              </router-link>
              <router-link class="btn" :to="{name:'massagelist' , query:{title:'预警消息',type:0}}">
                <div>预警消息</div>
              </router-link>
            </div>
        </div>
        <bottom-tab></bottom-tab>
    </div>
</template>
<script>
    import cookieUtil from '../utils/utils';
    import gpsPoi from '../utils/gpsPoi';
    import {MessageBox,Toast} from 'mint-ui';
    import {formatDate} from '../utils/filters.js';
    export default {
        name:'index',
        data () {
            return {
              requestParams:{ //请求参数
                user: cookieUtil.getCookie("user"),
                runningState:'',
                warningType:'',
                tags:'',
                pageSize:0,
                pageNum:1
              },
              showPopup:false,
              panelData:{},
              dataList:[],  //存放全部
              gMap: null ,
              index : 0 ,
              devices : [] ,
              myPoint : null,

              modelData:{},
              infos:[]  //存放可视范围获取到的
            }
        },
        created(){
          this.$forceUpdate();
        },
        /*computed: {
          timeOut: {
            set (val) {
              this.$store.state.timeout.compileTimeout = val;
            },
            get() {
              return this.$store.state.timeout.compileTimeout;
            }
          },
        },*/
        mounted() {
          this.$nextTick(() => {
            let that = this;
            // 百度地图API功能
            let map = new BMap.Map("allmap");
            this.gMap  = map ;
            let point = new BMap.Point(116.404, 39.915);
            map.centerAndZoom(point, 10);
            // 编写自定义函数,创建标注
            map.enableScrollWheelZoom(true);
            map.addEventListener('dragstart',function () {
              that.showPopup = false;
            })
            map.addEventListener('zoomstart',function () {
              that.showPopup = false;
            })
            map.addEventListener("dragend", function(){
              //that.getDeviceInfos();
            });
            this.getDeviceInfos();
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
              if(this.getStatus() == BMAP_STATUS_SUCCESS){
                that.myPoint = r.point;
                that.gMap.centerAndZoom(r.point, 11);
              }
            },{enableHighAccuracy: true})
          })
        },
        watch:{
          '$route':'getDeviceInfos'
        },
        filters: {
          formatDate(time) {
            var date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
          }
        },
        methods:{
          trace() {
              this.calc();
              this.showPopup = false;
              this.addMarker();
              this.hide = true;
          },
          calc() {
            if(this.myPoint == null) {
              return ;
            }
            this.removeRoute();
            var p1 = new BMap.Point(this.myPoint.lng , this.myPoint.lat);
            var p2 = new BMap.Point(this.modelData.lastLocation.lng,this.modelData.lastLocation.lat);
            var driving = new BMap.DrivingRoute( this.gMap, {renderOptions:{map: this.gMap, autoViewport: true}});
            var endIcon = new BMap.Icon(this.$api.root+"/wechat/static/image/endIcon.png", new BMap.Size(30,42));
            var startIcon = new BMap.Icon(this.$api.root+"/wechat/static/image/startIcon.png", new BMap.Size(30,42));
            driving.search(p1, p2);
            driving.setMarkersSetCallback(function(pois) {
              pois[0].marker.setIcon(startIcon);
              pois[1].marker.setIcon(endIcon);
              var routeMarker = pois;
              //pois[1].point = p2;
            });
          } ,
          removeRoute() {
            this.gMap.clearOverlays();
          } ,
          checkLastLocation(){
            let that = this;
            if(this.$route.params.serialNo){
              this.dataList.forEach((item,index)=>{
                if(item.serialNo === that.$route.params.serialNo){
                  if(!item.lastLocation){
                    Toast({
                      message: '设备不存在',
                      position: 'bottom',
                    });
                    this.showPopup = false;
                  }else {
                    this.removeRoute();
                    this.addMarker();
                  }
                }
              })
            }else {
              this.removeRoute();
              this.addMarker();
            }
          },
          getDeviceInfos() {
            let that = this;
            this.gMap.clearOverlays();
            this.$api.get("/device/device/clientFilterDevicesList.do",{
              user:this.requestParams.user,
              runningState:this.requestParams.runningState,
              warningType:this.requestParams.warningType,
              tags:this.requestParams.tags,
              pageSize:this.requestParams.pageSize,
              pageNum:this.requestParams.pageNum
            },function (data) {
              if(data.status === 0){
                that.dataList = data.result.list;
                 that.dataList.forEach((item,index)=>{
                  var location = item.lastLocation;
                  if(location != null) {
                    var bdPoi = gpsPoi.gdTobd(location.lng , location.lat);
                    that.dataList[index].lastLocation.lng = bdPoi['lng'];
                    that.dataList[index].lastLocation.lat = bdPoi['lat'];
                  }
                });
              }
              that.checkLastLocation();
              /*this.timeOut = setTimeout(() => {
                that.checkLastLocation();
                console.log(1);
              }, 10000);*/

            },function (failure) {

            })
          } ,
          addMarker() {
            let that = this;
            let addClickHandler = (item,marker)=>{
              if(item.serialNo === that.$route.params.serialNo && !that.$route.params.trace){
                let point = new BMap.Point(item.lastLocation.lng, item.lastLocation.lat);
                this.gMap.centerAndZoom(point, 10);
                this.panelData = item;
                this.modelData = item;
                this.showPopup = true;
                this.$route.params.serialNo = null;
              }
              if(item.serialNo === that.$route.params.serialNo && that.$route.params.trace){
                console.log(5);
                let point = new BMap.Point(item.lastLocation.lng, item.lastLocation.lat);
                this.gMap.centerAndZoom(point, 10);
                this.panelData = item;
                this.modelData = item;
                this.showPopup = false;
                this.$route.params.serialNo = null;
                this.calc();
              }
              marker.addEventListener("click",function(e) {
                let list = item;
                that.modelData = item;
                that.panelData = list;
                that.showPopup = true;
              },true);
            };
            that.dataList.forEach((item,index)=>{
              if(item.lastLocation){
                let point = new BMap.Point(item.lastLocation.lng,item.lastLocation.lat);
                let geoc = new BMap.Geocoder();
                geoc.getLocation(point, function(rs){
                  let addComp = rs.addressComponents;
                  that.dataList[index].lastLocationDesc = addComp.city+addComp.district+addComp.street;
                  var myIcon = new BMap.Icon(that.$api.root+"/wechat/static/image/carIcon-x.png", new BMap.Size(30,53));
                  let marker = new BMap.Marker(point,{icon:myIcon});
                  that.devices[that.index] = marker;
                  that.index++;
                  that.gMap.addOverlay(marker);
                  addClickHandler(item,marker);
                });
              }
            });
          }
        }
    }
</script>
<style scoped lang='less'>
  @import '../style/less/index.less';
  #allmap {
    width: 100vw;
    height:100vh;
    overflow: hidden;
    margin:0;
    font-family:"微软雅黑";
  }
</style>
