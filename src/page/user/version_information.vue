<template>
  <div id="versioninformation">
      <ul class="box">
         <li class="li" v-for="item in data">
           <div class="line">
             <span class="name">版本号：</span>
             <span class="content">{{item.version}}</span>
           </div>
           <div class="line">
             <span class="name">发布人：</span>
             <span class="content">{{item.name}}</span>
           </div>
           <div class="line">
             <span class="name">发布日期：</span>
             <span class="content">{{item.date}}</span>
           </div>
           <div class="line">
             <span class="name">发布内容：</span>
             <span class="content">{{item.content}}</span>
           </div>
         </li>
      </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data:[]
      };
    },
    created () {
      let that = this;
      this.$api.get('/system/common/versionInfo/client_get_version.do', {},function (success) {
        if (success.status === 0) {
          that.data=success.result;
        } else {
          alert(success.message)
        }
        console.log(success)
      }, function (error) {
        console.log(error)
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
  .box{
    margin: 0.5rem;
    .li{
      border-radius: 5px;
      margin-bottom: 0.5rem;
      background: @grey-s;
      .line{
        margin: 0 0.3rem;
        .name,.content{
          .smallx-font-white;
        }
      }
    }
  }
</style>

