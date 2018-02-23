<template>
    <div class="loading-box">
      <mt-spinner class="loading" color="#f0f0f0" :size="60" type="fading-circle"></mt-spinner>
    </div>
</template>

<script>
  import { Indicator } from 'mint-ui';
  export default {
    created () {
      /*Indicator.open();
      setTimeout(() => Indicator.close(), 90000);*/
    }
  }
</script>

<style scoped lang='less'>
    .hide{
      display: none;
    }
    .show{
      display: block;
    }
    .loading-box{
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      position: absolute;
      z-index: 999;
      .loading{
        position: absolute;
        width: 60px;
        height: 60px;
        left: 0;
        right: 0;
        top:0;
        bottom: 0;
        margin: auto;
      }
    }
</style>
