<template>
  <div id='railcard' class="edit-panel">
    <div class="input-panel">
      <input type="text" placeholder="围栏名称" v-model="cardData.name" readonly>
    </div>
    <p class="pwd-des">最多10个字的围栏名称</p>
    <mt-cell title="入栏报警">
      <mt-switch class="switch" v-model="cardData.isIn"></mt-switch>
    </mt-cell>
    <mt-cell title="出栏报警">
      <mt-switch class="switch" v-model="cardData.isOut"></mt-switch>
    </mt-cell>
    <mt-cell title="区域围栏有效期"></mt-cell>
    <mt-cell title="开始时间" is-link>
      <span class="des">{{cardData.beginTime}}</span>
    </mt-cell>
    <mt-cell title="结束时间" is-link>
      <span class="des">{{cardData.endTime}}</span>
    </mt-cell>
    <mt-cell title="区域" is-link>
      <span class="des">{{cardData.districtName}}</span>
    </mt-cell>
  </div>
</template>
<script>
  import {formatDate} from '../../utils/filters.js';
  import cookieUtil from '../../utils/utils';
  import {MessageBox} from 'mint-ui';
  export default{
    name: 'railcard',
    data(){
      return {
        cardData:{
          name:null,
          isIn:null,
          isOut:null,
          beginTime:null,
          endTime:null,
          districtCode:null,
          districtName:null,
        },
        value: null,
      }
    },
    created(){
      this.getData();
    },
    methods: {
      screening(data) {
        this.cardData = data;
        if (data.isInWarning === 1) {
          this.cardData.isIn = true;
        } else {
          this.cardData.isIn = false;
        }
        if (data.isOutWarning === 1) {
          this.cardData.isOut = true;
        } else {
          this.cardData.isOut = false;
        }
      },
      getData() {
        let that = this;
        this.$api.get("/rail/rail/clientGetRailInfo.do", {
          railId: this.$route.query.railId
        }, function (success) {
          if (success.status === 0) {
            that.screening(success.result);
            console.log(success);
          } else if (success.status === 1) {
            MessageBox.alert(success.message, '提示');
          }


        }, function (error) {

        })
      }
    }
  }
</script>
<style scoped lang='less'>
  @import '../../style/less/rail/regionrailcard.less';
</style>
