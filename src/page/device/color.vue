<template>
  <div id="order">
    <div class="box other-operation">
      <ul>
        <li v-for="(item,index) in color" @click="colorCheck(index)">
          <span class="name" v-bind:class="{select:index === checkColor}">{{item.color}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script >
  import deviceData from '../../utils/public_value'
  export default {
    data() {
      return {
        checkColor:null,
        color:[],
        selectColor:null
      };
    },
    created() {
      let that = this;
      this.$api.get('/system/common/dictColor/clientQueryDictColor.do', {
      }, function (success) {
        if (success.status === 0){
          that.color = success.result;
          console.log(success);
        }else{

        }
      }, function (error) {
        console.log(error);
      })
    },
    mounted() {

    },
    activated: function () {
      deviceData.deviceData.isBack = true;
    },
    methods: {
      colorCheck(index){
        this.checkColor=index;
        this.selectColor = deviceData.deviceData.color = this.color[index].color;
        this.$router.back(-1);
        //console.log(deviceData);
        //this.checkSecure=null; 执行完成后，可以清空
      },
    }
  };
</script>

<style scoped lang="less">
  @import '../../style/less/device/color.less';
</style>
