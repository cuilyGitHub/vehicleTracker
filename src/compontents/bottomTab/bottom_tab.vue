<template>
    <div id="bottomTab">
      <div class='footer'>
        <router-link class='secure' v-bind:to="'/'">
          <div class="icon">
            <span class="monitor" v-bind:class="{monitorSelect:monitorChoose}"></span>
            <span class="title" v-bind:class="{blue:monitorChoose}">监控</span>
          </div>
        </router-link>
        <router-link class='secure' v-bind:to="{name:'Monitoring'}" >
          <div class="icon">
            <span class="statistics" v-bind:class="{statisticsSelect:statisticsChoose}"></span>
            <span class="title" v-bind:class="{blue:statisticsChoose}">统计</span>
          </div>
        </router-link>
        <router-link class='secure' v-bind:to="{name:'Massage' , params:{deviceId:'0'}}">
          <div class="icon">
            <span v-if="unReadTotal>99" class="total">99+</span>
            <span v-else-if="unReadTotal != 0" class="total">{{unReadTotal}}</span>
            <span class="message" v-bind:class="{massageSelect:messageChoose}"></span>
            <span class="title" v-bind:class="{blue:messageChoose}">消息</span>
          </div>
        </router-link>
        <router-link class='secure' v-bind:to="'/aboutme'">
          <div class="icon">
            <span class="my" v-bind:class="{mySelect:myChoose}"></span>
            <span class="title" v-bind:class="{blue:myChoose}">我的</span>
          </div>
        </router-link>
      </div>
    </div>
</template>

<script>
  import cookieUtil from '../../utils/utils'
  export default {
    data() {
      return {
        monitorChoose:false,
        statisticsChoose:false,
        messageChoose:false,
        myChoose:false,
        unReadTotal:null
      }
    },
    created() {
      var routerName = this.$route.name;
      if(routerName === 'index'){
        this.monitorChoose = true;
      }else if(routerName === 'Monitoring'){
        this.statisticsChoose = true;
      }else if(routerName === 'statistics'){
        this.messageChoose = true;
      }else if(routerName === 'Massage'){
        this.messageChoose = true;
      }
      this.getCountMsg();
    },
    methods: {
      getCountMsg() {
        let that = this;
        this.$api.get("/operating/push/pushMessage/clientGetKindMessageByUser.do",{
          user: cookieUtil.getCookie("user")
        },function (data) {
          if(data.status === 0){
            data.result.forEach(function (item, key) {
              that.unReadTotal += item.unReadNumber;
            })
            console.log(that.unReadTotal);
          }
        },function (failure) {
        })
      }
    }
  }
</script>

<style scoped lang='less'>
  @import '../../style/base/base.less';
  .footer{
    height: 2rem;
    background: rgba(255,255,255,1);
    position: fixed;
    bottom: 0;
    .icon{
      width: 100vw/4;
      height: 2rem;
      float: left;
      margin: 0.2rem 0;
      span{
        display: block;
      }
      .total{
        float: right;
        width: 0.8rem;
        background: @red;
        .smallxx-font-white;
        text-align: center;
        border-radius:10px;
        margin-right:0.3rem;
        padding: 0.03rem 0;
      }
      .blue{
        color: @blue !important;
      }
      .title{
        .basics-font-black;
        text-align: center;
        margin-left: 0.1rem;
      }
      .monitor{
        height: 1rem;
        background: url('../../../static/image/monitoring.png') no-repeat center;
        background-size:1rem;
      }
      .monitorSelect{
        height: 1rem;
        background: url('../../../static/image/monitoringSelect.png') no-repeat center;
        background-size:1rem;
      }
      .statistics{
        height: 1rem;
        background: url('../../../static/image/statistics.png') no-repeat center;
        background-size:1rem;
      }
      .statisticsSelect{
        height: 1rem;
        background: url('../../../static/image/statisticsSelect.png') no-repeat center;
        background-size:1rem;
      }
      .message{
        height: 1rem;
        background: url('../../../static/image/massage.png') no-repeat center;
        background-size:1rem;
      }
      .massageSelect{
        height: 1rem;
        background: url('../../../static/image/massageSelect.png') no-repeat center;
        background-size:1rem;
      }
      .my{
        height: 1rem;
        background: url('../../../static/image/me.png') no-repeat center;
        background-size:1rem;
      }
      .mySelect{
        height: 1rem;
        background: url('../../../static/image/meSelect.png') no-repeat center;
        background-size:1rem;
      }
    }

  }
</style>
