<template>
  <div id="pwd">
    <div class='edit-panel'>
      <div class="new-panel">
        <input class="old" type="text" v-model="overSpeed" placeholder="超速设置">
      </div>
      <div class="push">
        <p class="pwd-des">0到200的整数、设置为0将不做超速报警</p>
        <div class="blue-btn" @click="commit">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {MessageBox} from 'mint-ui';
  export default {
    name: 'pwd',
    data() {
      return {
        overSpeed: null,
        deviceId: 0
      }
    },
    mounted() {
      console.log(this.$route.query);
      this.deviceId = this.$route.query.deviceId; //获取$route.params里保存的
      console.log(this.deviceId);
    },
    watch:{
        overSpeed(curVal,oldVal){
          if(curVal >= 200){
            this.overSpeed = 200;
          }else if(curVal < 0){
            this.overSpeed = 0;
          }
        }
    },
    methods: {
      openAlert(content) {
        MessageBox.alert(content, '提示');
      },
      commit(){
        if (!this.overSpeed) {
          this.openAlert('请填写报警速度');
          return;
        }
        let that = this;
        this.$api.post('/device/device/clientUpdateAlertSpeed.do', {
          serialNo: this.deviceId,
          alertSpeed: this.overSpeed
        }, function (success) {
          console.log(success);
          if (success.status === 0) {
            //修改成功
            that.$router.push({name:'devicecard',query:{deviceId:that.deviceId}})
          } else {
            //修改失败
            that.openAlert(success.message)
          }
        }, function (error) {

        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../style/base/base.less';

  .edit-panel {
    margin-top: 0.3rem;
    .new-panel {
      background: @white;
      padding: 0 0.3rem;
      border-bottom: 1px solid @grey-xs;
      .old {
        width: 100%;
        height: 1rem;
        padding: 0.1rem 0;
        .smallx-font-black;
      }
    }
    .push {
      .pwd-des {
        margin: 0.3rem;
        .smallx-font-grey;
      }
    }
  }
</style>
