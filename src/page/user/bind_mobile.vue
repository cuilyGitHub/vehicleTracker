<template>
  <div id="bind" class='edit-panel'>
    <div v-if="type === 'email'">
      <p class="pwd-des">{{emailDes}}</p>
      <div class="input-panel">
        <input class="input" type="text" v-model="bindPhone" placeholder="输入邮箱号">
      </div>
      <div class="input-panel">
        <input class="input-code" type="text" v-model="picLyanzhengma" placeholder="验证码">
        <img class="code" :src="src"  alt="" @click='changeImg'>
      </div>
      <div class="input-panel">
        <input class="input-code" v-model="verifacationCode" type="text" placeholder="输入邮箱验证码">
        <div v-show="show" class="get-mobile-code" @click="getCode">获取验证码</div>
        <div v-show="!show" class="get-mobile-code" @click="getCode">{{count}} s</div>
      </div>
      <div class="push">
        <div :class="isSelect ? 'blue-btn' : 'grey-btn'" @click="emailCommit">确定</div>
      </div>
    </div>

    <div v-if="type === 'mobile'">
      <p class="pwd-des">{{mobileDes}}</p>
      <div class="input-panel">
        <input class="input" type="text" v-model="bindPhone" placeholder="输入手机号">
      </div>
      <div class="input-panel">
        <input class="input-code" type="text" v-model="picLyanzhengma" placeholder="验证码">
        <img class="code" :src="src"  alt="" @click='changeImg'>
      </div>
      <div class="input-panel">
        <input class="input-code" v-model="verifacationCode" type="text" placeholder="输入短信验证码">
        <div v-show="show" class="get-mobile-code" @click="getCode">获取验证码</div>
        <div v-show="!show" class="get-mobile-code" @click="getCode">{{count}} s</div>
      </div>
      <div class="push">
        <div :class="isSelect ? 'blue-btn' : 'grey-btn'" @click="mobileCommit">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import cookieUtil from '../../utils/utils';
  import {MessageBox} from 'mint-ui';
  export default {
    name: 'bind',
    data() {
      return {
        type:this.$route.params.id,
        mobileDes:'验证码将会发送至你的手机',
        emailDes:'验证码将会发送至你的邮箱',
        picLyanzhengma:null,
        unselect: 'pwd-btn',
        select: 'btn-select',
        isSelect: false,
        bindPhone: null,
        show: true,
        count: '',
        timer: null,
        verifacationCode: null,
        src:null
      }
    },
    created(){
      console.log(this.$route.params.id);
      this.src='http://tracker.uniits.com/v1/secCode/generate.do?type=bind';
    },
    mounted(){

    },
    methods: {
      changeImg(){
        this.src='http://tracker.uniits.com/v1/secCode/generate.do?type=bind&&math='+Math.ceil(Math.random()*10);
      },
      setTime(){
        const TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000)
        }
      },
      detect(){
        if(this.$route.params.id === 'mobile'){
          let myreg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
          if(!myreg.test(this.bindPhone) || this.bindPhone === "" || this.bindPhone === null){
            MessageBox.alert('请输入有效的手机号码！','提示');
            return false;
          }
        }else {
          var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
          if (!reg.test(this.bindPhone) || this.bindPhone === "" || this.bindPhone === null) {
            MessageBox.alert('请输入有效的邮箱号码！', '提示');
            return false;
          }
        }
        if(!this.picLyanzhengma){
          MessageBox.alert("请输入随机生成的4位有效验证码",'提示');
          return false;
        }
        return true;
      },
      getCode(){
        let that = this;
        if(!this.detect()){
          return;
        }
        if(this.timer){
          return;
        }
        this.$api.get("/system/common/smsRegister/clientGetVerifyCode.do", {
          user: this.bindPhone,
          secCode:this.picLyanzhengma,
          type: "3"
        }, function (success) {
          console.log(success);
          if (success.status === 0) {
            if(that.type === 'email'){
              that.emailDes = '验证码已发送至你的注册邮箱'
              that.setTime();
              return;
            }
            if(that.type === 'mobile'){
              that.mobileDes = '验证码已发送至你的注册手机'
              that.setTime();
              return;
            }
            //验证码已发送 获取按钮开始倒计时 不可点击
          } else {
            //获取失败
            MessageBox.alert("验证码获取失败",'提示');
          }
        }, function (failure) {

        })
      },
      emailCommit(){
        if(!this.isSelect){
          return;
        }
        if(!this.detect()){
          return;
        }
        let that = this;
        this.$api.post('/user/clientBindEmail.do', {
          user: cookieUtil.getCookie("user"),
          email: that.bindPhone,
          verifacationCode:that.verifacationCode
        }, function (success) {
          if (success.status === 0) {
            //修改成功
            MessageBox.alert("绑定成功!");
            that.$router.push({path:'/secure'});
          } else {
            MessageBox.alert(success.message);
          }
          console.log(success)
        }, function (error) {
          console.log(error)
        })
      },
      mobileCommit(){
        if(!this.isSelect){
          return;
        }
        if(!this.detect()){
          return;
        }
        let that = this;
        this.$api.post('/user/clientBindPhone.do', {
          user: cookieUtil.getCookie("user"),
          phone: that.bindPhone,
          verifacationCode:that.verifacationCode
        }, function (success) {
          if (success.status === 0) {
            //修改成功
            MessageBox.alert("绑定成功!");
            that.$router.go(-1);
          } else {
            MessageBox.alert(success.message);
          }
          console.log(success)
        }, function (error) {
          console.log(error)
        })
      },
      changeBtn(curVal, oldVal){
        if (!curVal) {
          this.isSelect = false;
        } else {
          this.isSelect = true;
        }
      }
    },
    watch: {
      verifacationCode: 'changeBtn'
    }

  }
</script>

<style scoped lang="less">
  @import '../../style/less/user/bind_mobile.less';
</style>
