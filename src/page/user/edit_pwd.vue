<template>
  <div id="pwd">
    <div class='edit-panel'>
      <div class="new-panel">
        <input class="old" v-model="oldPass" type="password" placeholder="旧密码">
      </div>
      <div class="new-panel">
        <input class="new" v-model="newPass" type="text" placeholder="新密码">
        <!--<span class="visual" @click="visual"></span>-->
      </div>
      <div class="push">
        <p class="pwd-des">密码由字符和数字组成，8-15位</p>
        <div class="blue-btn" @click="commit">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import cookieUtil from '../../utils/utils'
  import {MessageBox,Toast} from 'mint-ui';
  export default {
    name: 'pwd',
    data() {
      return {
        type: 'text',
        oldPass: null,
        newPass: null,
        userInfo:null
      }
    },
    created(){
      let that = this;
      this.$api.get('/user/client_get_user_info.do', {
        user: cookieUtil.getCookie("user")
      }, function (success) {
        if(success.result.phone){
          that.userInfo = success.result.phone;
          return;
        }else if(success.result.email){
          that.userInfo = success.result.email;
          return;
        }
        console.log(success.result)
      }, function (error) {
        console.log(that.userInfo)
      })
    },
    watch:{
      newPass(curVal,oldVal){
        if(this.newPass.length >= 16){
          this.newPass = oldVal;
        }
      }
    },
    methods: {
      commit(){
        let that = this;
        if (that.oldPass === "" || that.oldPass === null) {
          MessageBox.alert("请输入旧密码",'提示');
          return
        }
        if (that.newPass === "" || that.newPass === null) {
          MessageBox.alert("请输入新密码",'提示');
          return
        }
        if(that.newPass.length > 15 || that.newPass.length < 8){
          MessageBox.alert("密码不符合要求",'提示');
          return
        }
        this.$api.post('/user/client_update_password.do', {
          user: this.userInfo,
          oldPassword: that.oldPass,
          newPassword: that.newPass
        }, function (success) {
          if (success.status === 0) {
            //修改成功
            Toast({
              message: '修改成功',
              position: 'bottom',
            });
            that.$router.push({path:'/aboutme'});
          }else if(success.status === 1) {
            MessageBox.alert(success.message,'提示');
          }
        }, function (error) {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../style/less/user/edit_pwd.less';
</style>
