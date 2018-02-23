<template>
  <div id='massage' class="page-loadmore">
    <div  class="massage-list-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
      <mt-loadmore :top-method="loadTop" @translate-change="translateChange" @top-status-change="handleTopChange" ref="loadmore" class="my-loadmore">
        <ul class="list" >
          <router-link class='secure' v-for="item in dataList" :key='item.messageTypeId' v-bind:to="{name:'massagelist',query :{title:item.messageType , type:item.messageTypeId}}">
            <li @click="popupVisible4 = true">
              <span v-if="item.unReadNumber != 0" class="unread"></span>
              <img v-if="item.messageTypeId === 1" src="../../../static/image/msg-shake.png" alt="">
              <img v-if="item.messageTypeId === 2" src="../../../static/image/msg-remove.png" alt="">
              <img v-if="item.messageTypeId === 3" src="../../../static/image/msg-outage.png" alt="">
              <img v-if="item.messageTypeId === 4" src="../../../static/image/msg-railOut.png" alt="">
              <img v-if="item.messageTypeId === 5" src="../../../static/image/msg-railIn.png" alt="">
              <img v-if="item.messageTypeId === 6" src="../../../static/image/msg-railOut.png" alt="">
              <img v-if="item.messageTypeId === 7" src="../../../static/image/msg-railIn.png" alt="">
              <img v-if="item.messageTypeId === 8" src="../../../static/image/msg-ACCstop.png" alt="">
              <img v-if="item.messageTypeId === 9" src="../../../static/image/msg-ACCopen.png" alt="">
              <img v-if="item.messageTypeId === 10" src="../../../static/image/msg-speed.png" alt="">
              <img v-if="item.messageTypeId === 11" src="../../../static/image/msg-electricity.png" alt="">
              <img v-if="item.messageTypeId === 12" src="../../../static/image/msg-earlywarning.png" alt="">
              <img v-if="item.messageTypeId === 13" src="../../../static/image/msg-warning.png" alt="">
              <img v-if="item.messageTypeId === 14" src="../../../static/image/msg-stay.png" alt="">
              <img v-if="item.messageTypeId === 15" src="../../../static/image/ms-interrupt.png" alt="">
              <img v-if="item.messageTypeId === 16" src="../../../static/image/msg-offline.png" alt="">
              <img v-if="item.messageTypeId === 17" src="../../../static/image/msg-shutdown.png" alt="">
              <div class="content">
                <div class="number">{{item.messageType}}</div>
                <div class="name">{{item.messageNumber}}条记录</div>
              </div>
              <div class="arrow"></div>
              <div class="time">{{item.lastMessageTime}}</div>
            </li>
          </router-link>
        </ul>
      </mt-loadmore>
    </div>
    <bottom-tab></bottom-tab>
  </div>
</template>
<script>
  import cookieUtil from '../../utils/utils'
  import {MessageBox} from 'mint-ui';
  import {formatDate} from '../../utils/filters.js';
  export default {
    name:'massage',
    data() {
      return {
        list: [],
        dataList:null,
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        popupVisible4: false,
        buttonBottom: 0,
        status:0,
        unReadTotal:null
      };
    },
    created() {
      this.getCountMsg();
    },
    mounted() {

    },
    methods: {
      handleTopChange(status) {
        this.topStatus = status;
      },
      translateChange(translate) {
        const translateNum = +translate;
        this.translate = translateNum.toFixed(2);
      },
      loadTop() {
        this.getCountMsg();
      },
      InitializeTime(data){
        let nowTime = Date.parse(new Date());
        data.forEach(function (val, key) {
          let time = nowTime - val.lastMessageTime;
          if(time === nowTime){
            val.lastMessageTime = '无';
          }else if(time <= 600000){
            val.lastMessageTime = '刚刚';
          }else if(time < 3600000){
            let x = parseInt(time/1000/60);
            val.lastMessageTime = x+'分钟前';
          }else if(time < 86400000){
            let x = parseInt(time/1000/60/60);
            val.lastMessageTime = x+'小时前';
          }else if(time < 172800000){
            let x = formatDate(new Date(val.lastMessageTime), 'hh:mm:ss');
            val.lastMessageTime = '昨天 '+x;
          }else if(time <= 604800000){
            let x = parseInt(time/1000/60/60/24);
            val.lastMessageTime = x+'天前';
          }else if(time > 604800000){
            let x = formatDate(new Date(val.lastMessageTime), 'yyyy-MM-dd');
            val.lastMessageTime = x;
          }
        });
        this.dataList = data;
      },
      getCountMsg() {
        let that = this;
        this.$api.get("/operating/push/pushMessage/clientGetKindMessageByUser.do",{
            user: cookieUtil.getCookie("user")
        },function (data) {
          if(data.status === 0){
            that.dataList = data.result;
            //that.InitializeTime(data.result);
            that.$refs.loadmore.onTopLoaded();
            /*data.result.forEach(function (item, key) {
              that.unReadList += item.unReadNumber;
            })*/
            console.log(data.result);
          }
        },function (failure) {
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
<style scoped lang='less'>
  @import '../../style/less/massage/massage.less';
</style>
