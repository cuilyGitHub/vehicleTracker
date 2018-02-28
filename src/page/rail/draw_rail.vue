<template>
  <div id='drawrail'>
    <div id='allmap'></div>
    <div id='control' class="control-paenl">
      <div class="range-panel">
        <div class="num">
          <span>500</span>
          <span>{{cardData.radius}}</span>
          <span>100000</span>
        </div>
        <div class="range-box clearfix">
          <span class="add"></span>
          <span class="reduce"></span>
          <mt-range class="range" v-model="cardData.radius" :bar-height="2" :step="10" :min="0" :max="100000"></mt-range>
        </div>
      </div>
      <div class="radius-input">
        <div>
          <span class="title">自定义半径：</span>
          <input class='radius' type="number" v-model='cardData.radius'>
          <span class="other">米(500-100,000)</span>
        </div>
        <div class="sure-btn" @click="save">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
  import { MessageBox } from 'mint-ui';
  import cookieUtil from '../../utils/utils';
import gpsPoi from '../../utils/gpsPoi';
  export default {
    name: 'drawrail',
    data () {
      return {
        map:null,
        cardData:{
          id : 0 ,
          name:null,
          isIn:null,
          isOut:null,
          beginTime:null,
          endTime:null,
          centerLatitude:null,
          centerLongitude:null,
          radius:500,
        },
      }
    },
    beforeRouteLeave(to, from, next) {
      // 设置下一个路由的 meta
      to.meta.keepAlive = false;  // 让 railcard 不缓存，即刷新
      next();
    },
    mounted() {
      this.$nextTick(function () {
        var windowHeight = document.documentElement.clientHeight;
        var controlHeight = document.getElementById('control').clientHeight;
        document.getElementById('allmap').style.height = windowHeight - controlHeight + 'px';

        // 百度地图API功能
        this.map = new BMap.Map("allmap");    // 创建Map实例
        this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 14);  // 初始化地图,设置中心点坐标和地图级别
        this.map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
        this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        this.map.enableDragging();
        this.getData(this.map);
      })
    },
    methods: {
      getCircleRailById(id , radius) {
        var globalThis = this;
         this.$api.get("/rail/rail/clientGetRailInfo.do", {
           railId:id
          }, function (success) {
            globalThis.cardData.id = success.result.id;
            globalThis.cardData.name = success.result.name;
            globalThis.cardData.isIn = success.result.isInWarning === 1 ? true : false ;
            globalThis.cardData.isOut = success.result.isOutWarning === 1 ? true :false ;
            globalThis.cardData.beginTime = success.result.beginTime;
            globalThis.cardData.endTime = success.result.endTime;
            globalThis.cardData.centerLatitude = success.result.centerLatitude;
            globalThis.cardData.centerLongitude = success.result.centerLongitude;
            globalThis.cardData.radius = radius;
            globalThis.initMap() ;
          }, function( error) {

          });
      },
      getData(map){
        let that = this;
        let center = this.map.getCenter();
        if(this.$route.query.enterType == 1 || (this.$route.query.enterType == 2 && this.$route.query.isNew !="new")){
          this.getCircleRailById(this.$route.query.railId , this.$route.query.radius);
        } else {
          if(cookieUtil.getCookie('addRadius')){
            this.cardData.radius = cookieUtil.getCookie('addRadius');
          }else {
            this.cardData.radius = 500;
          }
          if(cookieUtil.getCookie('addLat')){
            this.cardData.centerLatitude = cookieUtil.getCookie('addLat');
          }else {
            console.log(this.$route.query.lat);
            this.cardData.centerLatitude = this.$route.query.lat;
          }
          if(cookieUtil.getCookie('addLng')){
            this.cardData.centerLongitude = cookieUtil.getCookie('addLng');
          }else {
            this.cardData.centerLongitude = this.$route.query.lng;
          }
          if(this.$route.query.addName != null) {
            cookieUtil.setCookie("addName" , this.$route.query.addName);
          }
          this.initMap();
        }
      },
      initMap() {
        let that = this;
        this.map.centerAndZoom(new BMap.Point(this.cardData.centerLongitude, this.cardData.centerLatitude), 14);
        this.darwCircle();
        this.map.addEventListener("dragend", function (a) {
            that.darwCircle();
        });
      },
      darwCircle() {
        this.map.clearOverlays();
        var center = this.map.getCenter();
        var gdPoi = gpsPoi.bdTogd(center.lng , center.lat);
        this.cardData.centerLatitude = gdPoi["lat"];
        this.cardData.centerLongitude = gdPoi["lng"];
        var point = new BMap.Point(center.lng, center.lat);
        var circle = new BMap.Circle(point, this.cardData.radius, {fillColor: '#cbdff0', strokeWeight: 2, strokeOpacity: 0.5}); //创建圆
        this.map.addOverlay(circle);
      },
      save(){
        let that = this;
        if(this.cardData.radius <500){
          MessageBox.alert('半径不得小于500米',"提示");
          return;
        }
        if(this.$route.query.serialNo){
          this.$api.post("/rail/rail/clientUpdateCircleRail.do", {
            user:cookieUtil.getCookie("user"),
            id:this.cardData.id,
            name:this.cardData.name,
            isIn:this.cardData.isIn===true?1:2,
            isOut:this.cardData.isOut===true?1:2,
            beginTime:this.cardData.beginTime,
            endTime:this.cardData.endTime,
            centerLatitude:this.cardData.centerLatitude,
            centerLongitude:this.cardData.centerLongitude,
            radius:this.cardData.radius,
          }, function (success) {
            console.log(success + "success");
            if(success.status === 0){
              cookieUtil.setCookie("lat",that.cardData.centerLatitude);
              cookieUtil.setCookie("lng",that.cardData.centerLongitude);
              cookieUtil.setCookie('radius',that.cardData.radius);
              that.$router.push({path:'/rail',query:{serialNo:that.$route.query.serialNo, lng : that.cardData.centerLongitude, lat :that.cardData.centerLatitude}})
            }else {
               MessageBox.alert(success.message,"提示");
            }
          }, function (error) {
               MessageBox.alert(error,"提示");
          })
        }else {
          cookieUtil.setCookie("addLat",this.cardData.centerLatitude);
          cookieUtil.setCookie("addLng",this.cardData.centerLongitude);
          cookieUtil.setCookie('addRadius',this.cardData.radius);
          cookieUtil.setCookie("lat",this.cardData.centerLatitude);
          cookieUtil.setCookie("lng",this.cardData.centerLongitude);
          cookieUtil.setCookie('radius',this.cardData.radius);
          this.$router.go(-1);
        }
      }
    },
    computed: {
      pokerHistory() {
        return this.cardData.radius
      }
    },

    watch: {
      pokerHistory(curVal, oldVal){
        if (curVal > 100000) {
          this.cardData.radius = 100000;
        }else {
          this.cardData.radius = Number(curVal);
        }
        this.map.clearOverlays();
        this.darwCircle();
      }
    }
  }
</script>
<style scoped lang='less'>
  #allmap {
    width: 100vw;
    overflow: hidden;
    margin: 0;
    font-family: "微软雅黑";
  }
  @import '../../style/less/rail/drawrail.less';
</style>
