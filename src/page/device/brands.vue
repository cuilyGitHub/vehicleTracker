<template>
  <div id="order">
    <div class="box other-operation">
      <ul>
        <li v-for="(item,index) in brandsList" @click="brandsCheck(index)">
          <span class="name" v-bind:class="{select:index === checkBrands}">{{item.name}}</span>
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
        isShowSecure:false,
        checkBrands:null,
        brandsList:[],
        selectBrands:null
      };
    },
    created() {
      let that = this;
      this.$api.get('/system/dict/dictCarModel/queryAll.do', {
      }, function (success) {
        if (success.status === 0){
          that.brandsList = success.result;
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
      brandsCheck(index){
        this.checkBrands=index;
        this.selectBrands = deviceData.deviceData.brands = this.brandsList[index].name;
        this.$router.back(-1);
      }
    },
  };
</script>

<style scoped lang="less">
  @import '../../style/less/device/color.less';
</style>
