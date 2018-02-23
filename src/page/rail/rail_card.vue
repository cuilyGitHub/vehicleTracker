<template>
  <div id='railcard' class="edit-panel">
    <div class="input-panel">
      <input type="text" placeholder="围栏名称" v-model="cardData.name">
    </div>
    <p class="pwd-des">最多10个字的围栏名称</p>
    <mt-cell title="入栏报警">
      <mt-switch class="switch" v-model="cardData.isIn" @change="intoChange"></mt-switch>
    </mt-cell>
    <mt-cell title="出栏报警">
      <mt-switch class="switch" v-model="cardData.isOut" @change="outChange"></mt-switch>
    </mt-cell>
    <mt-cell title="圆形围栏有效期"></mt-cell>
    <mt-cell @click.native="open('start')" title="开始时间" is-link>
      <span class="des">{{cardData.beginTime}}</span>
    </mt-cell>
    <mt-cell @click.native="open('end')" title="结束时间" is-link>
      <span class="des">{{cardData.endTime}}</span>
    </mt-cell>

    <mt-datetime-picker ref="start" type="date" v-model="startTime"
                        year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="start">
    </mt-datetime-picker>
    <mt-datetime-picker ref="end" type="date" v-model="endTime"
                        year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="end">
    </mt-datetime-picker>

    <router-link class='link' :to="{path:'/drawrail',query:{railId : cardData.id , enterType:2 , radius:cardData.radius , isNew:$route.params.id , lng : this.$route.query.lng , lat : this.$route.query.lat , addName : cardData.name}}">
      <mt-cell title="半径" is-link>
        <span class="des">{{cardData.radius/1000}}km</span>
      </mt-cell>
    </router-link>
    <div class="push">
      <div v-if="$route.params.id === 'new'" class="blue-btn" @click="addCircleRail()">保存</div>
      <div v-if="$route.params.id === 'update'" class="blue-btn" @click="updateRail()">保存</div>
    </div>
  </div>
</template>
<script>
  import {formatDate} from '../../utils/filters.js';
  import cookieUtil from '../../utils/utils';
  import {MessageBox} from 'mint-ui';
  export default{
    name: 'railcard',
    data(){
      return {
        cardData:{
          id : 0 ,
          name:null,
          isIn:false,
          isOut:false,
          beginTime:null,
          endTime:null,
          centerLatitude:null,
          centerLongitude:null,
          radius:500,
        },
        startTime: new Date(),
        endTime: new Date(),
        value: null,
      }
    },
    created(){
      this.getData();
    },
    activated(){
      this.getData();
    },
    methods: {
      openAlert(des) {
        MessageBox.alert(des,'提示');
      },
      outChange(event){
        this.cardData.isOut = !event;
        cookieUtil.setCookie("addIsOut" ,  this.cardData.isOut);
      },
      intoChange(event){
        this.cardData.isIn = !event;
        cookieUtil.setCookie("addIsIn" ,  this.cardData.isIn);
      },
      open(picker) {
        this.$refs[picker].open();
      },
      start(value) {
        this.cardData.beginTime = formatDate(value, 'yyyy/MM/dd');
        cookieUtil.setCookie("addStartTime" ,  this.cardData.beginTime);
      },
      end(value) {
        this.cardData.endTime = formatDate(value, 'yyyy/MM/dd');
        cookieUtil.setCookie("addEndTime" ,  this.cardData.endTime);
      },
      getRailById(id) {
        console.log("getRailById = " + id);
        var globalThis = this;
         this.$api.get("/rail/rail/clientGetRailInfo.do", {
           railId:id
          }, function (success) {
            console.log(success + "success");
            if(success.status === 0){
              globalThis.cardData.id = success.result.id;
              globalThis.cardData.name = success.result.name;
              globalThis.cardData.isIn = success.result.isInWarning === 1 ? true : false ;
              globalThis.cardData.isOut = success.result.isOutWarning === 1 ? true : false ;
              globalThis.cardData.beginTime = success.result.beginTime;
              globalThis.cardData.endTime = success.result.endTime;
              globalThis.cardData.centerLatitude = success.result.centerLatitude;
              globalThis.cardData.centerLongitude = success.result.centerLongitude;
              globalThis.cardData.radius = success.result.radius;
              if(cookieUtil.getCookie('lng')){
                globalThis.cardData.centerLongitude = cookieUtil.getCookie('lng');
              }
              if(cookieUtil.getCookie('lat')){
                globalThis.cardData.centerLatitude = cookieUtil.getCookie('lat');
              }
              if(cookieUtil.getCookie('radius')){
                globalThis.cardData.radius = cookieUtil.getCookie('radius');
              }
            }else {
               //MessageBox.alert(success.message,"提示");
            }
          }, function (error) {
               //MessageBox.alert(error,"提示");
          })
      },
      getData(){
        //更改title
        var params = this.$route.params.id;
        if (params != 'new') {
          this.$route.meta.title = '电子围栏编辑';
        } else {
          this.$route.meta.title = '新增电子围栏';
        }
        if(this.$route.query.dataJson){
          var dataJson = this.$route.query.dataJson;
          var cardData = JSON.parse(dataJson);
          this.getRailById( cardData.id);
        }else {

          this.cardData.centerLatitude = this.$route.query.lat;
          this.cardData.centerLongitude = this.$route.query.lng;
          if(cookieUtil.getCookie("addLat") && cookieUtil.getCookie("addLat") != null) {
            this.cardData.centerLatitude = cookieUtil.getCookie("addLat");
          }
          if(cookieUtil.getCookie("addLng")&& cookieUtil.getCookie("addLng") != null) {
            this.cardData.centerLongitude = cookieUtil.getCookie("addLng");
          }
          if(cookieUtil.getCookie("addName")&& cookieUtil.getCookie("addName") != null) {
            this.cardData.name = cookieUtil.getCookie("addName");
          }
          if(cookieUtil.getCookie("addRadius")&& cookieUtil.getCookie("addRadius") != null) {
              this.cardData.radius = cookieUtil.getCookie("addRadius");
          }else {
              this.cardData.radius = 500;
          }
          if(cookieUtil.getCookie("addStartTime")&& cookieUtil.getCookie("addStartTime") != null) {
            this.cardData.startTime = cookieUtil.getCookie("addStartTime");
          }
          if(cookieUtil.getCookie("addEndTime")&& cookieUtil.getCookie("addEndTime") != null) {
            this.cardData.startTime = cookieUtil.getCookie("addEndTime");
          }
          if(cookieUtil.getCookie("addIsIn")&& cookieUtil.getCookie("addIsIn") != null) {
              this.cardData.isIn = cookieUtil.getCookie("addIsIn");
          }
          if(cookieUtil.getCookie("addIsOut")&& cookieUtil.getCookie("addIsOut") != null) {
              this.cardData.isOut = cookieUtil.getCookie("addIsOut");
          }
        }
      },
     addCircleRail(){
        let that = this;
        if(!this.cardData.name){
          this.openAlert('请输入围栏名称');
          return;
        }
        if(!this.cardData.beginTime){
          this.openAlert('请选择开始时间');
          return;
        }
        if(!this.cardData.endTime){
          this.openAlert('请选择结束时间');
          return;
        }
        this.$api.post("/rail/rail/clientAddCircleRail.do", {
          user:cookieUtil.getCookie("user"),
          serialNo: this.$route.query.serialNo,
          name:this.cardData.name,
          isIn:this.cardData.isIn===true?1:2,
          isOut:this.cardData.isOut===true?1:2,
          beginTime:this.cardData.beginTime,
          endTime:this.cardData.endTime,
          centerLatitude:this.cardData.centerLatitude,
          centerLongitude:this.cardData.centerLongitude,
          radius:this.cardData.radius
        }, function (success) {
          if(success.status === 0){
            that.$router.push({path:'/rail',query:{serialNo:that.$route.query.serialNo , lng : that.cardData.centerLongitude, lat :that.cardData.centerLatitude}})
          }else {
            this.openAlert(success.message);
          }
        }, function (error) {

        })
      },
      updateRail(){
        let that = this;
        if(!this.cardData.name){
          this.openAlert('请输入围栏名称');
          return;
        }
        if(!this.cardData.beginTime){
          this.openAlert('请选择开始时间');
          return;
        }
        if(!this.cardData.endTime){
          this.openAlert('请选择结束时间');
          return;
        }
        if(this.cardData.radius <500){
          this.openAlert('半径不得小于500米');
          return;
        }
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
          if(success.status === 0){
            console.log(that.$route.query.lng + '  card');
            that.$router.push({path:'/rail',query:{serialNo:that.$route.query.serialNo , lng : that.$route.query.lng , lat : that.$route.query.lat }})
          }else {
            this.openAlert(success.message);
          }
        }, function (error) {

        })
      }
    },
    filters: {
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy年MM月dd日');
      }
    },

  }
</script>
<style scoped lang='less'>
  @import '../../style/less/rail/railcard.less';
</style>
