<template>
  <div id='aboutMe'>
    <!--<Loading :class="isSuccess?'hide':'show'"></Loading>-->
    <div class='basic-info'>
      <div class="user-head">
        <div class="base64-upload">
          <img :src="src"  alt=""/>
          <input type="file"  accept="image/*" @change="onChangeImage" />
        </div>
      </div>
      <ul class="user-list">
        <li>
          <span class="name"><span class="booth">账</span><span class="booth">号:</span></span>
          <span class="value">{{userInfo.userName}}</span>
        </li>
        <li>
          <span class="name">账号类型:</span>
          <span class="value" v-if="userInfo.type===1">系统用户</span>
          <span class="value" v-else-if="userInfo.type===10">供应商</span>
          <span class="value" v-else-if="userInfo.type===20">经销商</span>
          <span class="value" v-else="userInfo.type===30">普通用户</span>
        </li>
        <li>
          <span class="name">企业资质:</span>
          <span class='right-arrow'></span>
          <span v-if="userInfo.isOrganization === 0" class="right-value">仅对企业用户开放</span>
          <span v-if="userInfo.isOrganization === 1" class="right-value">仅对企业用户开放</span>
        </li>
        <router-link class='secure' v-bind:to="'/user_rename'">
          <li>
            <span class="name">用户昵称:</span>
            <span class="value">{{userInfo.alias}}</span>
            <span class='right-arrow'></span>
          </li>
        </router-link>
        <li @click="loginOutWeixin">
          <span class="name">微信账号:</span>
          <span class="value" v-if="userInfo.isBindWechat === 1">绑定</span>
          <span class="value" v-if="userInfo.isBindWechat === 0">未绑定</span>
          <span class='right-arrow'></span>
        </li>
        <router-link class='secure' v-bind:to="'/secure'">
          <li>
            <span class="name">账号安全:</span>
            <span class='right-arrow'></span>
            <span class="right-value" v-if="userInfo.isIdentity ===2">未认证</span>
            <span class="right-value" v-else-if="userInfo.isIdentity ===3">审核中</span>
            <span class="right-value" v-else-if="userInfo.isIdentity ===1">已认证</span>
          </li>
        </router-link>
        <router-link class='secure' v-bind:to="'/devicemanager'">
          <li>
            <span class="name">我的设备:</span>
            <span class='right-arrow'></span>
            <span class="right-value">{{userInfo.totalDevice}}</span>
          </li>
        </router-link>
        <router-link class='secure' to="">
          <li>
            <span class="name">充值记录:</span>
            <span class='right-arrow'></span>
          </li>
        </router-link>
        <router-link class='secure' v-bind:to="'/setting'">
          <li>
            <span class="name">系统设置:</span>
            <span class='right-arrow'></span>
          </li>
        </router-link>
        <router-link class='secure' v-bind:to="'/about'">
          <li>
            <span class="name"><span class="booth">关</span><span class="booth">于:</span></span>
            <span class='right-arrow'></span>
          </li>
        </router-link>
      </ul>
    </div>

    <div class='white-bottom-btn' @click="loginOut">注销登录</div>
  </div>
</template>
<script>
  var _wx = require('weixin-js-sdk');
  import cookieUtil from '../../utils/utils'
  import {MessageBox} from 'mint-ui';
  export default{
    name: 'rail',
    data(){
      return {
       /* isSuccess:true,*/
        src: this.$api.root+"/wechat/static/image/userhead.png",
        userInfo: {},
        file:null,
        wx:_wx,
      }
    },
    created(){
      let that = this;
      this.$api.get('/user/client_get_user_info.do', {
        user: cookieUtil.getCookie("user")
      }, function (success) {
        /*that.isSuccess = false;*/
        that.userInfo = success.result;
        console.log(success.result);
        if (that.userInfo.avatar!=null&&that.userInfo.avatar!="") {
            that.src = that.$api.root + that.userInfo.avatar;
        }else{
            that.src = '/static/image/headImg.png';
        }
      }, function (error) {

      })
    },
    mounted(){

    },
    methods: {
      openAlert(des) {
          MessageBox.alert(des,'提示');
      },
      loginOutWeixin(des) {
        let that = this;
        if (this.userInfo.isBindWechat === 1) {
            MessageBox.confirm('是否解绑微信且关闭页面').then(action => {
              this.$api.post('/user/clientUnBindWeChat.do', {
                user: cookieUtil.getCookie("user")
              }, function (success) {
                if(success.status === 0){
                  that.wx.closeWindow();
                  //window.location.reload();
                  //this.openAlert('删除成功');
                }else {
                  this.openAlert(success.message);
                }
                console.log(success)
              }, function (error) {

              })
            },err=>{

            });
          } else {
            this.$api.post('/user/clientBindWeChat.do', {
              user: cookieUtil.getCookie("user"),
              wechatOpenId:null,
              wechartUnionId:null
            }, function (success) {
              if(success.status === 0){
                this.openAlert('删除成功');
              }else {
                this.openAlert(success.message);
              }
              console.log(success)
            }, function (error) {

            })
          }
      },
      loginOut(){
        //清除cookie 关闭当前界面
        let that = this;
        MessageBox.confirm('是否注销登录?').then(success => {
          this.$api.post('/user/api/logout.do', {
            user: cookieUtil.getCookie("user")
          }, function (success) {
            console.log(success);
            if (success.status === 0) {
              cookieUtil.delCookie("user");
              cookieUtil.delCookie("userId");
              cookieUtil.delCookie("accessToken");
              cookieUtil.delCookie("phone");
              that.wx.closeWindow();
              //that.$router.push({path: '/login'})
            } else {
              that.openAlert(success.message)
            }
          }, function (error) {
            console.log(error)
          })
        },err=>{
            this.openAlert('注销失败')
        });
      },
      postImg(file){
        //上传到服务器
          let that = this;
          this.$api.post('/userphoto/api/uploadAvatar.do', {
            user: cookieUtil.getCookie("user"),
            avatar: "data:" + file.type + ";base64," + file.base64
          }, function (success) {
            if (success.status === 0) {
              //修改成功
              that.openAlert("头像修改成功!")
            } else {
              that.openAlert(success.message)
            }
          }, function (error) {
            console.log(error)
          })
      },
      onChangeImage() {
        let that = this;
        if (event.target.files && event.target.files[0]) {
          let file = event.target.files[0]
          let reader = new FileReader()
          reader.addEventListener('load', e => {
            that.src = e.target.result
            let [, base64] = that.src.split(',')
            let imgList = {
              size: file.size,
              type: file.type,
              name: file.name,
              base64: base64
            }
            this.postImg(imgList);
          })
          console.log(file);
          reader.readAsDataURL(file);
        }

      }
    }
  }
</script>
<style scoped lang='less'>
  @import '../../style/less/about_me.less';
</style>
