<template>
  <div>
      <div class="box">
        <div class="btn-panel">
          <img src="../../../static/image/newbind.png" alt="" @click="goNewBind">
          <img src="../../../static/image/continuebind.png" alt="" @click="goUpdateBid">
        </div>
      </div>
      <router-link v-bind:to="'/devicelist'">
        <div class="blue-bottom-btn">确定</div>
      </router-link>
  </div>
</template>

<script>
  import deviceData from '../../utils/public_value'
  export default {
    data() {
      return {

      };
    },
    created() {

    },
    mounted() {

    },
    methods: {
      goUpdateBid(){
        this.$router.push({path:'/bindexisting',query:{serialNo:this.$route.query.serialNo}});
      },
      goNewBind(){
        deviceData.deviceData.brands = null;
        deviceData.deviceData.color = null;
        this.$router.push({path:'/newbind',query:{serialNo:this.$route.query.serialNo,route:'editdevicebind'}});
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../style/base/base';
  .box{
    background: @white;
    padding:1.5rem;
    .btn-panel{
      text-align: center;
      margin: 0 auto;
      img{
        width: 7rem;
        /*height: 1.5rem;*/
        margin: 0.3rem 0;
      }
    }
  }

</style>
