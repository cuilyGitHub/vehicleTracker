<template>
  <div id="pwd">
    <div class='edit-panel'>
      <div class="new-panel">
        <input class="old" type="text" v-model="nickName" placeholder="用户昵称">
      </div>
      <div class="push">
        <p class="pwd-des">最多10个字描述</p>
        <div class="blue-btn" @click="commit">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
  import variable from '../../utils/public_value'
  import cookieUtil from '../../utils/utils'
  import {MessageBox,Toast} from 'mint-ui';
  export default {
    name: 'pwd',
    data() {
      return {
        nickName: null
      }
    },
    mounted() {

    },
    watch:{
      nickName(curVal,oldVal){
        if(this.nickName.length >= 10){
          this.nickName = oldVal;
        }
      }
    },
    methods: {
      openAlert(des) {
          MessageBox.alert(des,'提示');
      },
      commit(){
        if(!this.nickName){
          this.openAlert("请输入用户昵称!");
          return;
        }
        let that = this;
        this.$api.post('/user/clientUpdateAlias.do', {
          user: cookieUtil.getCookie("user"),
          alias: that.nickName
        }, function (success) {
          if (success.status === 0) {
            //修改成功
            Toast({
              message: '修改成功',
              position: 'bottom',
            });
            that.$router.go(-1);
            return;
          } else {
            that.openAlert(success.message)
          }
          console.log(success)
        }, function (error) {
          console.log(error)
        })
      },
      bindWchat(){
        let that = this;
        this.$api.post('/user/clientBindWeChat.do', {
          user: cookieUtil.getCookie("user"),
          wechatOpenId: '',
          wechartUnionId:''
        }, function (success) {
          if (success.status === 0) {
            //修改成功
            that.openAlert("修改成功!")
          } else {
           that.openAlert(success.message)
          }
          console.log(success)
        }, function (error) {
          console.log(error)
        })
      },
      unBindWchat(){
        let that = this;
        this.$api.get('/user/clientUnBindWeChat.do', {
          user: cookieUtil.getCookie("user"),
        }, function (success) {
          if (success.status === 0) {
            //修改成功
            that.openAlert("删除成功")
          } else {
            that.openAlert(success.message)
          }
          console.log(success)
        }, function (error) {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../style/less/user/user_rename.less';
</style>
