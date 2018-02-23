<template>
  <div id="identity" class="identity-panel">
      <div class="icon-panel">
        <span class="identity-icon"></span>
        <p class="identity-des">实名认证已通过</p>
      </div>
      <p class="name">
        <span class="text">{{name}}</span>
        <span class="name-icon"></span></p>
      <p class="code">{{identityCard}}</p>
  </div>
</template>
<script>
  import cookieUtil from '../../utils/utils'
  export default {
    name:'identity',
    data () {
      return {
        name:'',
        identityCard:''
      }
    },
    created () {
      let that = this;
      this.$api.get('/user/client_get_user_info.do', {
        user: cookieUtil.getCookie("user")
      }, function (success) {
        that.identityCard = success.result.identityCard;
        that.identityCard = that.identityCard.substr(0, 6) + ' *******' + that.identityCard.substr(13,18);
        that.name = '* ' + success.result.name.substr(1, success.result.name.length);
      }, function (error) {

      })
    },
    mounted() {

    },
    methods:{

    }
  }
</script>
<style scoped lang='less'>
  @import '../../../src/style/base/color.less';
  .identity-panel{
    background: @white;
    margin-top: 0.3rem;
    padding-bottom: 0.5rem;
    .icon-panel{
       padding:1rem 0;
      .identity-icon{
        background: url("../../../static/image/identity.png") no-repeat center;
        background-size: 5rem;
        display: block;
        height: 3rem;
        width: 10rem;
        text-align: center;
        margin: 0 auto;
      }
      .identity-des{
        text-align: center;
        .smallx-font-grey;
      }
    }
    .name{
      width: 3rem;
      text-align: center;
      margin: 0 auto;
      overflow: hidden;
      height: 1rem;
      line-height: 1rem;
      .text{
        height: 1rem;
        line-height: 1.2rem;
        .basics-font-black;
        float: left;
        width: 2rem;
        text-align: center;
      }
      .name-icon{
        background:url("../../../static/image/identitySuccess.png") no-repeat center;
        background-size: 1rem;
        display: block;
        height: 1rem;
        width: 1rem;
        float: right;
      }
    }
    .code{
      width: 10rem;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      margin: 0 auto;
      .smallx-font-black;
    }
  }
</style>
