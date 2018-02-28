<template>
  <div id='login'>
    <!--<div class="icon"></div>-->
    <img class="icon" src="../../static/image/login.png" alt="">
    <div class='login-panel'>
      <input class="input" v-model='name' type="text" placeholder="帐号">
      <input class="input" v-model='password' type="password" placeholder="密码">
    </div>
    <div class="blue-btn" @click="getInfo">登录</div>
  </div>
</template>

<script>
  import cookieUtil from '../utils/utils'
  import { MessageBox } from 'mint-ui';
  export default {
    name:'login',
    data () {
      return {
        name:null,
        password:null
      }
    },
    created () {

      //this.$utils.setFontSzie(document,window);
    },
    mounted() {

    },
    watch:{

    },
    methods:{
      openAlert(content) {
        MessageBox.alert(content, '提示');
      },
      login(change){
        //window.alert(change);
        let that = this;
        this.$api.post("/weChatPlatformLogin.do",{
          user: this.name,
          password: this.password,
          change:change
        },function (success) {
          if(success.status === 0){
            cookieUtil.setCookie("accessToken",success.result.accessToken);
            cookieUtil.setCookie("userId",success.result.userId);
            cookieUtil.setCookie("user",that.name);
            //cookieUtil.setCookie("unionid",success.result.unionid);
            console.log(document.cookie);
            that.$router.push({ path: '/' })
          }else if(success.status === 1){
            that.openAlert(success.message);
            return
          }
        },function (failure) {
          if(failure.message === 'passworderror'){
            that.openAlert('密码输入错误');
            return;
          }
          if(failure.message === 'usererror'){
            that.openAlert('用户名输入错误');
            return;
          }
        })
      },
      getInfo(){
        if(!this.name){
          this.openAlert('请输入用户名');
          return;
        }
        if(!this.password){
          this.openAlert('请输入密码');
          return;
        }
        let that = this;
        this.$api.post("/changeBind.do",{
          user: this.name,
          password: this.password
        },function (success) {
          //window.alert(JSON.stringify(success));
          console.log(success);
          if(success.status === 0){
            cookieUtil.setCookie("accessToken",success.result.accessToken);
            cookieUtil.setCookie("userId",success.result.userId);
            cookieUtil.setCookie("user",that.name);
            cookieUtil.setCookie("unionid",success.result.unionid);
            console.log(document.cookie);
            that.$router.push({ path: '/' });
            return;
          }
          if(success.status === 1){
            that.openAlert(success.message);
            return;
          }
          if(success.status === 2){
            MessageBox.confirm(success.message).then(action => {
              that.login(1);
            },err=>{
              that.login(0);
            });
          }
        },function (failure) {
          if(failure.message === 'passworderror'){
            that.openAlert('密码输入错误');
            return;
          }
          if(failure.message === 'usererror'){
            that.openAlert('用户名输入错误');
            return;
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../style/base/base.less';
  .icon{
    height:6rem;
    /*background: url("../../static/image/login.png") no-repeat center;
    background-size: 10rem;*/
  }
  .login-panel{
    background: @white;
    .input{
      height: 0.8rem;
      line-height:0.8rem;
      background: @white;
      padding:0.2rem 0.5rem;
      border-bottom: 1px solid @grey-xs;
      .smallx-font-black;
      width: 9rem;;
    }
  }
</style>
