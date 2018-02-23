<template>
  <div id='drawrail'>
    <div id='allmap'></div>
  </div>
</template>
<script>
  import { MessageBox } from 'mint-ui';
  import cookieUtil from '../../utils/utils';
  import gpsPoi from '../../utils/gpsPoi';
  export default {
    data () {
      return {
        map:null
      }
    },
    mounted() {
      this.$nextTick(function () {
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
      getData(){
        let that = this;
        this.$api.get("/rail/rail/clientGetRailInfo.do", {
          railId:this.$route.query.railId
        }, function (success) {
          if(success.status === 0){
            console.log(success);
            that.map.centerAndZoom(new BMap.Point(success.result.centerLongitude, success.result.centerLatitude), 14);
            var point = new BMap.Point(success.result.centerLongitude, success.result.centerLatitude);
            var circle = new BMap.Circle(point, success.result.radius, {fillColor: '#cbdff0', strokeWeight: 2, strokeOpacity: 0.5}); //创建圆
            that.map.addOverlay(circle);
          }else if(success.status === 1){
            MessageBox.alert(success.message,'提示');
          }
        }, function (error) {

        })
      }
    }
  }
</script>
<style scoped lang='less'>
  #allmap {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    margin: 0;
    font-family: "微软雅黑";
  }
  @import '../../style/less/rail/drawrail.less';
</style>
