<template>
  <div>
    <div class="page-loadmore">
      <div class="massage-list-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :bottom-method="loadTop" :auto-fill="false" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="massage-list">
            <router-link v-for="item in list" :key='item.deviceId' class='massage-list-listitem'
                         v-bind:to="{name:'alarmMessageMap',query:{serialNo : item.serialNo}}">
            <li>
              <p class="date">{{item.messageTime | formatDate}}</p>
              <div class="content">
                <ul class="line">
                  <li>
                    <span class="name">设备编号:</span>
                    <span class="value">{{ item.serialNo }}</span>
                    <span class='right-arrow'></span>
                    <span class="right-value">{{item.messageType}}</span>
                  </li>
                  <li>
                    <span class="name">绑定物品:</span>
                    <span class="value">{{item.number}}</span>
                  </li>
                  <li v-if="item.messageTypeId != 17">
                    <span class="name">经纬度:</span>
                    <span class="value">{{item.location.lat}},{{item.location.lng}}</span>
                  </li>
                  <li v-if="item.messageTypeId === 4 || item.messageTypeId === 5">
                    <span class="name">围栏名称:</span>
                    <span class="value">{{item.railName}}</span>
                  </li>
                  <li v-if="item.messageTypeId === 6 || item.messageTypeId === 7">
                    <span class="name">围栏名称:</span>
                    <span class="blue-value" @click.prevent="goRail(item.railId)">{{item.railName}}</span>
                  </li>
                  <li v-if="item.messageTypeId === 10 ">
                    <span class="name">当前速度:</span>
                    <span class="value">{{item.speedWarnInfo}}</span>
                  </li>
                  <li v-if="item.messageTypeId === 11 ">
                    <span class="name">当前电量:</span>
                    <span class="value">{{item.batteryPercentage}}</span>
                  </li>
                  <li v-if="item.messageTypeId === 12 || item.messageTypeId === 13 || item.messageTypeId === 14 || item.messageTypeId === 15 || item.messageTypeId === 16">
                    <span class="name">间隔时间:</span>
                    <span class="value">{{item.timeInterval}}</span>
                  </li>
                  <li v-if="item.messageTypeId === 17 ">
                    <span class="name">停机种类:</span>
                    <span class="value">未知</span>
                  </li>
                  <li v-if="item.messageTypeId === 17 ">
                    <span class="name">停机原因:</span>
                    <span class="value">未知</span>
                  </li>
                  <li v-if="item.messageTypeId != 17">
                    <span class="name">报警地址:</span>
                    <p class="value">{{item.locationDescription}}{{item.lastAddress}}</p>
                  </li>
                </ul>
              </div>
              </li>
            </router-link>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
                <mt-spinner class="loading"  color="#26a2ff" type="fading-circle"></mt-spinner>
            </span>
          </div>
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import cookieUtil from '../../utils/utils'
  import {MessageBox,Toast} from 'mint-ui';
  import {formatDate} from '../../utils/filters.js';
  export default {
    data() {
      return {
        list: [],
        topStatus: '',
        dataList:null,
        bottomStatus:'',
        allLoaded: false,
        wrapperHeight: 0,
        translate: 0,
        pageSize:10,
        pageNum:1,
        serialNo:null,
        lastAddress:null
      };
    },
    created() {
      //更改title
      if(this.$route.query.serialNo){
        this.serialNo = this.$route.query.serialNo;
      }
      let title = this.$route.query.title;
      this.$route.meta.title = title;
      this.setMsgStatus();
      this.getMsgs();
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    },
    methods: {
      handleTopChange(status) {
        this.topStatus = status;
      },
      translateChange(translate) {
        const translateNum = +translate;
        this.translate = translateNum.toFixed(2);
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadTop() {
        this.pageNum += 1;
        this.more();
        this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
      },
      setMsgStatus(){ //修改信息状态，设为已读
        this.$api.post('/operating/push/pushMessage/clientSetMsgReadByType.do', {
          user: cookieUtil.getCookie("user"),
          warnTypeId: this.$route.query.type,
          status:1
        }, function (success) {
          if (success.status === 0) {
            console.log(success);
          }
        }, function (error) {
          console.log(error)
        })
      },
      parsingAddress(data,pageSwitch){
        let that = this;
        let list = data;
        let addArr = [];
        for (let i in list) {
          let lng = list[i].location.lng;
          let lat = list[i].location.lat;
          let point = new BMap.Point(lng, lat);
          let geoc = new BMap.Geocoder();
          geoc.getLocation(point, function (rs) {
            var addComp = rs.addressComponents;
            if(addComp){
              addArr.push(addComp.city + addComp.district + addComp.street);
              for (let x in addArr) {
                list[x].lastAddress = addArr[x];
              }
              if(i == list.length - 1 && !pageSwitch){
                that.list = list;
              }
              if(i == list.length - 1 && pageSwitch) {
                that.list.push.apply(that.list,list);
              }
            }
          });
        }

      },
      getMsgs() {  //获取初始数据
        let that = this;
        this.$api.get("/operating/push/pushMessage/clientQueryMessageByMsgType.do",{
          user: cookieUtil.getCookie("user"),
          messageTypeId : this.$route.query.type,
          serialNo:this.serialNo,
          pageSize:this.pageSize,
          pageNum:this.pageNum
        },function (data) {
          console.log(data);
          if(data.status != 0){
            MessageBox.alert(data.message,'提示');
            return;
          }
          if(data.result.messageList.length === 0){
            Toast({
              message: '暂无数据',
              position: 'center',
            });
            return;
          }
          that.$refs.loadmore.onTopLoaded();
          that.parsingAddress(data.result.messageList,false);
        },function (failure) {

        })
      },

      more(){ //加载更多
        let that = this;
        this.$api.get("/operating/push/pushMessage/clientQueryMessageByMsgType.do",{
          user: cookieUtil.getCookie("user"),
          messageTypeId : this.$route.query.type,
          serialNo:this.serialNo,
          pageSize:this.pageSize,
          pageNum:this.pageNum
        },function (data) {
          console.log(data);
          if(data.status != 0){
            MessageBox.alert(data.message,'提示');
            return;
          }
          that.$refs.loadmore.onTopLoaded();
          that.parsingAddress(data.result.messageList,true);
        },function (failure) {

        })
      },
      goRegionrail(id){
        this.$router.push({name:'seeregionrail',query:{railId:id}});
      },
      goRail(id){
        this.$router.push({name:'seerailcard',query:{railId:id}});
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
  @import '../../style/less/massage/massage_list.less';
</style>
