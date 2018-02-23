<template>
  <div class="secure-panel">
    <div class="title">神州畅行</div>
    <router-link class='secure' v-bind:to="'/versioninformation'">
      <mt-cell title="软件版本" is-link>
        <span class="value" >{{aboutInfo.version}}</span>
      </mt-cell>
    </router-link>
    <mt-cell title="神州畅行网站">
      <span class="des">http://wwww.cxsz.com.cn</span>
    </mt-cell>
    <mt-cell title="官方微信">
      <span class="des">神州畅行</span>
    </mt-cell>
    <mt-cell title="售后交流Q群">
      <span class="des">1158625866</span>
    </mt-cell>
    <mt-cell title="版权所有">
      <span class="des">深圳畅行深圳有限公司</span>
    </mt-cell>
    <router-link class='secure' v-bind:to="'/feedback'">
      <mt-cell title="建议意见" is-link></mt-cell>
    </router-link>
  </div>
</template>
<script>
  export default {
    name: 'drawrail',
    data () {
      return {
          aboutInfo:{}
      }
    },
    created () {
      let that = this;
      this.$api.get('/system/common/versionInfo/client_get_version.do', {},function (success) {
        if (success.status === 0) {
          that.aboutInfo=success.result[0];
        } else {
          alert(success.message)
        }
        console.log(success)
      }, function (error) {
        console.log(error)
      })
    },
    mounted() {

    },
    watch: {},
    methods: {}
  }
</script>
<style scoped lang='less'>
  @import '../../style/less/user/about.less';
</style>
