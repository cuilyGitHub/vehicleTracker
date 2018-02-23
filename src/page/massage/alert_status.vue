<template>
  <div id="alertStatus">
    <div class="table-box">
      <table class="table">
        <thead>
        <tr class="head">
          <td class="small">停</td>
          <td class="small">驶</td>
          <td class="small">有效时长</td>
          <td class="long">报警状态描述</td>
          <td class="small">服务器简称</td>
        </tr>
        </thead>
        <tbody id="immediately">
          <tr class="content" v-for="item in immediatelyData">
            <td v-if="item.type === 'stop'">{{item.name}}</td>
            <td v-if="item.type != 'all'"></td>
            <td v-if="item.type === 'driver'">{{item.name}}</td>
            <td colspan="2" v-if="item.type === 'all'">{{item.name}}</td>
            <td>{{item.expireAfter}}</td>
            <td>{{item.description}}</td>
            <td class="small">{{item.abbreviation}}</td>
          </tr>
        </tbody>
      </table>
      <table class="table">
        <thead>
        <tr class="head">
          <td class="float" colspan="5">浮动类计算报警</td>
        </tr>
        <tr class="head">
          <td class="small">停</td>
          <td class="small">驶</td>
          <td class="small">有效时长</td>
          <td class="long">报警状态描述</td>
          <td class="small">服务器简称</td>
        </tr>
        </thead>
        <tbody id="float">
          <tr class="content" v-for="item in floatData">
            <td v-if="item.type === 'stop'">{{item.name}}</td>
            <td v-if="item.type != 'all'"></td>
            <td v-if="item.type === 'driver'">{{item.name}}</td>
            <td colspan="2" v-if="item.type === 'all'">{{item.name}}</td>
            <td>{{item.expireAfter}}</td>
            <td>{{item.description}}</td>
            <td class="small">{{item.abbreviation}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="des">
      <p>报警状态从上而下优先级递减</p>
      <ul>
        <li>1.例如：当车辆触发电子围栏。1小时内再次触发超速，则当前状态显示电子围栏报警。超过1小时，同时超速的报警还在有效期将显示超速。警告有效过期后，状态将显示停或者驶。</li>
        <li>2.停：指车辆ACC熄火、设备通讯间断超过10分钟等设备不发生位移。</li>
        <li>3.驶：指设置发生位移。</li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        immediatelyData:[],
        floatData:[]
      };
    },
    created() {
      let that = this;
      this.$api.get("http://tracker.uniits.com/wechat/static/alertStatusData.json", {
        },function (success) {
          that.immediatelyData = success.immediatelyData;
          that.floatData = success.floatData;
          console.log(success);
        },function (failure) {

      })
    },
    mounted() {

    },
    methods: {
      getDevice(deviceId) {

      }
    }
  };
</script>
<style scoped lang='less'>
  @import '../../../src/style/base/color.less';
  #alertStatus{
    background: @white;
    padding: 0.3rem;
    .table-box{
      box-sizing: border-box;
      table{
        border-left: 1px solid #d1d1d1;
        border-top: 1px solid #d1d1d1;
        .head,.content{
          .smallx-font-black;
          height: 0.5rem;
          box-sizing: border-box;
          td{
            border-right: 1px solid #d1d1d1;
            border-bottom: 1px solid #d1d1d1;
            text-align: center;
            vertical-align: middle;
            padding: 5px;
          }
          .small{
            width: 100/8*1.5%;
          }
          .long{
            width: 100/8*3%;
          }
          .float{
            text-align: left;
            padding-left: 5px;
          }
        }
      }
    }
    .table:last-of-type{
      margin-top: 1rem;
    }
    .des{
      margin: 0.5rem 10px 10px 10px;
      .smallx-font-black;
      p{
        .basics-font-black;
        margin-top: 1rem;
      }
      ul{
        margin-top: 0.1rem;
        li{
          color: #7e7e7e;
          margin-top: 0.3rem;
        }
      }
    }
  }
</style>

