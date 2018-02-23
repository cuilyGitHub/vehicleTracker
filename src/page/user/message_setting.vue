<template>
  <div id='setting'>
    <ul class="list">
      <li>
        <span class="name">接受新消息通知</span>
        <mt-switch class="switch" v-model="isReceivePush" @change="ReceivePushChange"></mt-switch>
      </li>
    </ul>
    <ul class="list">
      <li>
        <span class="name">声音</span>
        <mt-switch class="switch" v-model="isPushSound" @change="pushSoundChange"></mt-switch>
      </li>
    </ul>
    <ul class="list" @click="goAlertType">
      <li>
        <span class="name">报警消息类型</span>
        <span class='right-arrow'></span>
      </li>
    </ul>
    <ul class="list">
      <li>
        <span class="name">提醒时段</span>
      </li>
      <!--pushTime1-->
        <li>
          <router-link class='router' v-bind:to="{name:'choosealerttime',query:{timeGroup:'0'}}">
            <span class="time" v-if="pushTime1!=null">{{pushTime1.beginTime}}-{{pushTime1.endTime}}</span>
            <span class="time" v-else-if="pushTime1==null">08:00-18:00</span>
            <span class="day" v-if="pushTime1!=null">{{pushTime1.pushDes}}</span>
            <span class="day" v-else-if="pushTime1==null">未开启</span>
          </router-link>
          <mt-switch class="switch" v-model="time1" @change="time1Change"></mt-switch>
        </li>
        <!--pushTime2-->
        <li>
          <router-link class='router' v-bind:to="{name:'choosealerttime',query:{timeGroup:'1'}}">
            <span class="time" v-if="pushTime2!=null">{{pushTime2.beginTime}}-{{pushTime2.endTime}}</span>
            <span class="time" v-else-if="pushTime2==null">08:00-18:00</span>
            <span class="day" v-if="pushTime2!=null">{{pushTime2.pushDes}}</span>
            <span class="day" v-else-if="pushTime2==null">未开启</span>
          </router-link>
          <mt-switch class="switch" v-model="time2" @change="time2Change"></mt-switch>
        </li>
      <!--pushTime3-->
        <li>
          <router-link class='router' v-bind:to="{name:'choosealerttime',query:{timeGroup:'2'}}">
            <span class="time" v-if="pushTime3!=null">{{pushTime3.beginTime}}-{{pushTime3.endTime}}</span>
            <span class="time" v-else-if="pushTime3==null">08:00-18:00</span>
            <span class="day" v-if="pushTime3!=null">{{pushTime3.pushDes}}</span>
            <span class="day" v-else-if="pushTime3==null">未开启</span>
          </router-link>
          <mt-switch class="switch" v-model="time3" @change="time3Change"></mt-switch>
        </li>
      <!--pushTime4-->
        <li>
          <router-link class='router' v-bind:to="{name:'choosealerttime',query:{timeGroup:'3'}}">
            <span class="time" v-if="pushTime4!=null">{{pushTime4.beginTime}}-{{pushTime4.endTime}}</span>
            <span class="time" v-else-if="pushTime4==null">08:00-18:00</span>
            <span class="day" v-if="pushTime4!=null">{{pushTime4.pushDes}}</span>
            <span class="day" v-else-if="pushTime4==null">未开启</span>
          </router-link>
          <mt-switch class="switch" v-model="time4" @change="time4Change"></mt-switch>
        <!--<mt-switch class="switch" v-model="item.isEnable"></mt-switch>-->
      </li>
      <div class="blue-bottom-btn" @click="saveSetting">确定</div>

    </ul>
  </div>
</template>
<script>
  import {MessageBox} from 'mint-ui';
  import cookieUtil from '../../utils/utils'
  export default{
    name: 'setting',
    data(){
      return {
        isReceivePush: false,
        isPushSound: false,
        jarring: false,
        time1: false,
        time2: false,
        time3: false,
        time4: false,
        pushTime1: null,
        pushTime2: null,
        pushTime3: null,
        pushTime4: null,
        warnTypeIds:[],
        pushTimeList:[
          {
            "isEnable": 1,
            "beginTime":"08:10",
            "endTime":  "10:00",
            "isPush1":  0,
            "isPush2":  0,
            "isPush3":  0,
            "isPush4":  0,
            "isPush5":  0,
            "isPush6":  0,
            "isPush7":  0
          },
          {
            "isEnable": 1,
            "beginTime":"08:10",
            "endTime":  "10:00",
            "isPush1":  0,
            "isPush2":  0,
            "isPush3":  0,
            "isPush4":  0,
            "isPush5":  0,
            "isPush6":  0,
            "isPush7":  0
          },
          {
            "isEnable": 1,
            "beginTime":"08:10",
            "endTime":  "10:00",
            "isPush1":  0,
            "isPush2":  0,
            "isPush3":  0,
            "isPush4":  0,
            "isPush5":  0,
            "isPush6":  0,
            "isPush7":  0
          },
          {
            "isEnable": 1,
            "beginTime":"08:10",
            "endTime":  "10:00",
            "isPush1":  0,
            "isPush2":  0,
            "isPush3":  0,
            "isPush4":  0,
            "isPush5":  0,
            "isPush6":  0,
            "isPush7":  0
          },
        ]
      }
    },
    created(){
      let that = this;
      this.$api.get('/operating/push/pushDevice/client_get_push_setting.do', {
        user: cookieUtil.getCookie("user"),
      }, function (success) {
        if (success.status === 0) {
          console.log(success);
          //获取成功
          that.isReceivePush = success.result.isReceivePush === 1;
          that.isPushSound = success.result.isPushSound === 1;
          if(success.result.pushTimeList){
            that.pushTimeList = success.result.pushTimeList;
          }
          if(sessionStorage.getItem('typeIds')){
            that.warnTypeIds = JSON.parse('['+sessionStorage.getItem('typeIds')+']');
          }else {
            that.warnTypeIds = success.result.warnTypeIds;
          }
          var list = success.result.pushTimeList;
          if(list!==null){
               that.pushTime = list;
              if(list.length ===1){
                that.pushTime1 = list[0];
                that.time1=that.pushTime1.isEnable===1;
              }else if (list.length === 2){
                that.pushTime1 = list[0];
                that.time1=that.pushTime1.isEnable===1;
                that.pushTime2 = list[1];
                that.time2=that.pushTime2.isEnable===1;
              }else if (list.length === 3){
                that.pushTime1 = list[0];
                that.time1=that.pushTime1.isEnable===1;
                that.pushTime2 = list[1];
                that.time2=that.pushTime2.isEnable===1;
                that.pushTime3 = list[2];
                that.time3=that.pushTime3.isEnable===1;
              }else if (list.length ===4){
                that.pushTime1 = list[0];
                that.time1=that.pushTime1.isEnable===1;
                that.pushTime2 = list[1];
                that.time2=that.pushTime2.isEnable===1;
                that.pushTime3 = list[2];
                that.time3=that.pushTime3.isEnable===1;
                that.pushTime4 = list[3];
                that.time4=that.pushTime4.isEnable===1;
              }
          }
        } else {
          //MessageBox.alert('服务器错误','提示')
        }
      }, function (error) {
        MessageBox.alert(error,'提示')
      })
    },
    activated(){
      if(sessionStorage.getItem('typeIds')){
        this.warnTypeIds = JSON.parse('['+sessionStorage.getItem('typeIds')+']');
      }
    },
    mounted(){

    },
    methods: {
      ReceivePushChange(event){
        this.isReceivePush = !event;
      },
      pushSoundChange(event){
        this.isPushSound = !event;
      },
      time1Change(event){
        this.time1 = !event;
      },
      time2Change(event){
        this.time2 = !event;
      },
      time3Change(event){
        this.time3 = !event;
      },
      time4Change(event){
        this.time4 = !event;
      },
      goAlertType(){
        this.processData();
        let setData = {
          isReceivePush:this.isReceivePush,
          isPushSound:this.isPushSound,
          pushTimeList:this.pushTimeList
        }
        sessionStorage.setItem('setData',JSON.stringify(setData));
        this.$router.push({path:'/alerttype'})
      },
      processData(){
        this.isReceivePush  = this.isReceivePush?1:0;
        this.isPushSound = this.isPushSound?1:0;
        this.time1 = this.time1?1:0;
        this.time2 = this.time2?1:0;
        this.time3 = this.time3?1:0;
        this.time4 = this.time4?1:0;
        for(let i=0;i<this.pushTimeList.length;i++){
          if(i === 0){
            this.pushTimeList[i].isEnable = this.time1;
          }
          if(i === 1){
            this.pushTimeList[i].isEnable = this.time2;
          }
          if(i === 2){
            this.pushTimeList[i].isEnable = this.time3;
          }
          if(i === 3){
            this.pushTimeList[i].isEnable = this.time4;
          }
        }
        console.log(this.pushTimeList);
      },
      saveSetting(){
        let that = this;
        this.processData();
        this.$api.post("/operating/push/pushDevice/client_push_setting.do",{
          user:cookieUtil.getCookie("user"),
          idFromPushService:'',
          isReceivePush:this.isReceivePush,
          isPushSound:this.isPushSound,
          warnTypeIds:this.warnTypeIds,
          pushTimeList:this.pushTimeList
        },function (success) {
          if(success.status === 0){
            sessionStorage.removeItem('typeIds');
            that.$router.push({name:'setting'})
          }
          console.log(success);
        },function (error) {

        });
      }
    }
  }
</script>
<style scoped lang='less'>
  @import '../../style/less/user/messagesetting.less';
</style>


