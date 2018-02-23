<template>
  <div>
    <div id="track"></div>
    <div class="date-btn" @click="openPanel"></div>
    <div class="date-panel" v-bind:class="{show:showDatePanel}">
      <ul class="time">
        <li class="li">
          <span class="des">时间选择:</span>
          <span class="time-btn" @click="beforeYesterday(-2)">前天</span>
          <span class="time-btn" @click="yesterDay(-1)">昨天</span>
        </li>
        <li class="li">
          <span class="des">开始时间:</span>
          <div class="text" @click="open('start')">{{startTime | formatDate}}</div>
        </li >
        <li class="li">
          <span class="des">结束时间:</span>
          <div class="text" @click="open('end')">{{endTime | formatDate}}</div>
        </li>
      </ul>
      <div class="btn">
        <span class="cancel" @click="openPanel">取消</span>
        <span class="sure" @click="submit">确定</span>
        <!--<span class="sure" @click="submitData">确定</span>-->
      </div>
    </div>
    <mt-datetime-picker ref="start" type="date" v-model="startTime"
                        year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="start">
    </mt-datetime-picker>
    <mt-datetime-picker ref="end" type="date" v-model="endTime"
                        year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="end">
    </mt-datetime-picker>
  </div>
</template>

<script>
  import cookieUtil from '../../utils/utils';
  import {MessageBox,Toast} from 'mint-ui';
  import {formatDate,GetFirstFewDays,stringToDate} from '../../utils/filters.js';
import gpsPoi from '../../utils/gpsPoi';
  export default {
    name:'index',
    data () {
      return {
        showDatePanel:false,
        startTime:new Date(),
        endTime:new Date(),
        startUnix:null,
        endUnix:null,
        localStartUnix:null,
        localEndUnix:null,
        serialNo:this.$route.query.serialNo,

        map:null,
        playback:null,
        playbackOptions:{
          tickLen: 250,
          speed: 1,
          orientIcons: true,
        },
        playbackData:{
          "type": "Feature",
          "icon": this.$api.root+"/wechat/static/image/carIcon-x.png",
          "geometry": {
            "type": "LineString",
            "coordinates": []
          },
          "properties": {
            "time": [],
          },
          "deviceSpeeds":[]
        }

      }
    },
    created(){
      if(sessionStorage.getItem('startUnix')){
        this.getData();
        return;
      }
      let date = this.startTime;
      let month = date.getMonth()+1;
      let day = date.getDate();
      let hours = date.getHours();
      if (month < 10 ) {
        month= "0" + month;
      }
      if (day < 10 ) {
        day = "0" + day ;
      }
      date = date.getFullYear() +"-"+month+'-'+day+' '+hours+':'+'00:00';
      this.startTime = date;
      //this.submitData();
      this.getData();
    },
    mounted() {
      this.$nextTick(() => {
        // 百度地图API功能
        window.bMap = new BMap.Map("track");    // 创建Map实例,
        window.bMap.centerAndZoom(new BMap.Point(116.404, 39.915), 10);  // 初始化地图,设置中心点坐标和地图级别
        this.map = new L.Map('track');
      })
    },

    watch:{

    },
    methods:{
      open(picker) {
        this.$refs[picker].open();
      },
      start(value) {
        this.startTime = value;
      },
      end(value) {
        this.endTime = value;
      },
      openPanel(){
        this.showDatePanel = !this.showDatePanel;
      },
      yesterDay(value){
        this.startTime = GetFirstFewDays(value);
        this.endTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
      },
      beforeYesterday(value){
        this.startTime = GetFirstFewDays(value);
        this.endTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
      },
      formatTime(){
        console.log(this.startTime);
        if(sessionStorage.getItem('startUnix')){
          this.localStartUnix = Number(sessionStorage.getItem('startUnix'));
          this.localEndUnix = Number(sessionStorage.getItem('endUnix'));
          return false;
        }
        if(this.startTime instanceof Date){
          var startUnix = stringToDate(formatDate(this.startTime, 'yyyy-MM-dd hh:mm:ss'));
        }else {
          var startUnix = stringToDate(this.startTime);
        }
        if(this.endTime instanceof Date){
          var endUnix = stringToDate(formatDate(this.endTime, 'yyyy-MM-dd hh:mm:ss'));
        }else {
          var endUnix = stringToDate(this.endTime);
        }
        startUnix = Date.parse(startUnix);
        endUnix = Date.parse(endUnix);
        if(endUnix <= startUnix){
          MessageBox.alert('请输入正确的时间','提示');
          return true;
        }
        sessionStorage.setItem('startUnix',startUnix);
        sessionStorage.setItem('endUnix',endUnix);
      },
      submit(){
        if(this.formatTime()){
          return;
        }
        window.location.reload();
      },
      getData(){
        if(this.formatTime()){
          return;
        }
        let that = this;
        if(sessionStorage.getItem('startUnix')){
          that.localStartUnix = sessionStorage.getItem('startUnix');
        }
        if(sessionStorage.getItem('endUnix')){
          that.localEndUnix = sessionStorage.getItem('endUnix');
        }
        this.$api.get('/device/device/clientGetTrackingBySerialNo.do', {
          serialNo:this.serialNo,
          start:that.localStartUnix,
          end:that.localEndUnix
        }, function (success) {
          if (success.status === 0){
            sessionStorage.removeItem('startUnix');
            sessionStorage.removeItem('endUnix');
            if(success.result.historyList.length === 0){
              Toast({
                message: '未查到该车数据',
                position: 'bottom',
              });
              return;
            }
            that.showDatePanel = false;
            let historyList = success.result.historyList;
            for (let i = 0, len = historyList.length; i < len; i++) {
              let bdLatLng = gpsPoi.gdTobd(historyList[i].location.lng , historyList[i].location.lat);
              that.playbackData.geometry.coordinates.push([bdLatLng["lng"], bdLatLng["lat"]]);
              that.playbackData.properties.time.push(historyList[i].utcTime);
              that.playbackData.deviceSpeeds.push(historyList[i].speed);
            }
            window.bMap.centerAndZoom(new BMap.Point(historyList[0].location.lng, historyList[0].location.lat), 10);
            if(that.playback == null) {
              console.log(that.playbackData);
              that.playback = new L.Playback(that.map, that.playbackData, null, that.playbackOptions);
              window.control = new L.Playback.Control(that.playback);//下面控件
              window.control.addTo(that.map);
            } else {
              console.log(that.playbackData);
              window.bMap.clearOverlays();
              that.playback.stop();
              //$('#play-pause-icon').removeClass('fa-pause');
              //$('#play-pause-icon').addClass('fa-play');
              that.playback.clearData();
              that.playback.setData(that.playbackData);
              window.control.resetTrackDefault();
            }
          }else{

          }
        }, function (error) {
          console.log(error);
        })
      },




      submitData(){
        if(this.startTime instanceof Date){
          var startUnix = stringToDate(formatDate(this.startTime, 'yyyy-MM-dd hh:mm:ss'));
        }else {
          var startUnix = stringToDate(this.startTime);
        }
        if(this.endTime instanceof Date){
          var endUnix = stringToDate(formatDate(this.endTime, 'yyyy-MM-dd hh:mm:ss'));
        }else {
          var endUnix = stringToDate(this.endTime);
        }
        startUnix = Date.parse(startUnix);
        endUnix = Date.parse(endUnix);
        if(endUnix <= startUnix){
          MessageBox.alert('请输入正确的时间','提示');
          return;
        }
        let that = this;
        this.$api.get('/device/device/clientGetTrackingBySerialNo.do', {
          serialNo:this.serialNo,
          start:startUnix,
          end:endUnix
        }, function (success) {
          if (success.status === 0){
            if(success.result.historyList.length === 0){
              Toast({
                message: '未查到该车数据',
                position: 'bottom',
              });
              return;
            }
            that.showDatePanel = false;
            let historyList = success.result.historyList;
            for (let i = 0, len = historyList.length; i < len; i++) {
              let bdLatLng = gpsPoi.gdTobd(historyList[i].location.lng , historyList[i].location.lat);
              that.playbackData.geometry.coordinates.push([bdLatLng["lng"], bdLatLng["lat"]]);
              that.playbackData.properties.time.push(historyList[i].utcTime);
              that.playbackData.deviceSpeeds.push(historyList[i].speed);
            }
            window.bMap.centerAndZoom(new BMap.Point(historyList[0].location.lng, historyList[0].location.lat), 10);
            if(that.playback == null) {
              console.log(that.playbackData);
              that.playback = new L.Playback(that.map, that.playbackData, null, that.playbackOptions);
              window.control = new L.Playback.Control(that.playback);//下面控件
              window.control.addTo(that.map);
            } else {
              console.log(that.playbackData);
              window.bMap.clearOverlays();
              that.playback.stop();
              //$('#play-pause-icon').removeClass('fa-pause');
              //$('#play-pause-icon').addClass('fa-play');
              that.playback.clearData();
              that.playback.setData(that.playbackData);
              window.control.resetTrackDefault();
            }
          }else{

          }
        }, function (error) {
          console.log(error);
        })
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

  @import '../../../static/css/historyTrack/history_track.css';

  @import '../../../static/js/historyTrack/jquery-ui/jquery-ui.min.css';
  @import '../../../static/js/historyTrack/Font-Awesome-4.1.0/css/font-awesome.min.css';
  #track {
    width: 100vw;
    height:100vh;
    overflow: hidden;
    margin:0;
    font-family:"微软雅黑";
  }
  /* 日期按钮 */
  .date-btn{
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 2rem;
    height: 2rem;
    background: url("../../../static/image/date.png") no-repeat center;
    background-size: 2rem;
  }
  .info{
    display: flex;
    justify-content: space-between;
  }
  .info span{
    display: inline-block;
    font-size: 0.4rem;
    color: #595959;
  }
  .info .time{
    padding-top: 2px;
  }

  .show{
    display: block !important;
  }
  /* 日期选择面板 */
  .date-panel{
    display: none;
    position: fixed;
    top: 4rem;
    left: 1.2rem;
    background: white;
    padding-top: 0.2rem;
  }
  .date-panel .time .li{
    height: 1rem;
    padding: 0 0.2rem;
  }
  .date-panel .time .li .des{
    font-size: 0.4rem;
    color: #595959;
    width: 2rem;
    display: block;
    float: left;
    padding: 0.23rem 0;
  }
  .date-panel .time .li .text{
    padding: 0.23rem 0;
    font-size: 0.4rem;
    color: #595959;
    float: left;
  }
  .date-panel .time .li .time-btn{
    font-size: 0.4rem;
    color: #595959;
    border: 1px solid #ebebeb;
    border-radius: 10px;
    padding: 0.2rem 0.25rem;
    float: left;
    margin-right: 0.3rem;
  }
  .date-panel .btn{
    height: 1rem;
    font-size: 0.4rem;
    color: #595959;
    border-top: 1px solid #ebebeb;
    padding: 0 0.2rem;
  }
  .date-panel .btn .sure{
    padding: 0.23rem 0;
    width: 3.55rem;
    text-align: center;
    display: block;
    float: left;
    border-left: 1px solid #ebebeb;
  }
  .date-panel .btn .cancel{
    padding: 0.23rem 0;
    width: 3.55rem;
    text-align: center;
    display: block;
    float: left;
  }

  /* 播放插件样式 */
  .tool-bar{
    padding: 0.3rem;
    background:white;
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
  }

  .tool-bar .play-rate{
    display: flex;
    justify-content: space-around;
  }

  .tool-bar .play-rate .rate{
    display: inline-block;
    flex: 1;
    max-width: 1.5rem;
    text-align: center;
    height: 0.75rem;
    line-height: 0.75rem;
    border-radius: 0.1rem;
    font-size: 0.4rem;
    color: #595959;

  }
  .tool-bar .play-rate .rate-active{
    color: #1e9aeb !important;
    font-weight: bold;
  }

  .slider-box{
    margin: 0.5rem 0;
  }
  .slider-box .slider{
    float: right;
    width: 8rem;
  }

  .info{
    display: flex;
    justify-content: space-between;
  }
  .info span{
    display: inline-block;
    font-size: 0.4rem;
    color: #595959;
  }
  .info .time{
    padding-top: 2px;
  }
</style>
