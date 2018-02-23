<template>
  <div id="alertStatus">
    <p class="des">由于设计师出差暂时没有详细数据，仅提供此页面测试</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        basicDate:[],
        floatData:[]
      };
    },
    created() {

    },
    mounted() {

    },
    methods: {
      getDevice(deviceId) {

      }
    }
  };
</script>
<style scoped lang='less'>
  @import '../../../src/style/base/color.less';
  .des{
    .smallxx-font-black;
    color: red !important;
    text-align: center;
    margin-top: 0.8rem;
    border: 1px solid red;
    padding: 0.2rem 0;
    margin-left:0.2rem;
    margin-right: 0.2rem;
  }
</style>

