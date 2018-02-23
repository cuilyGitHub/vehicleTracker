<template>
  <div class='footer'>
    <router-link class='secure' v-bind:to="'/'">
      <div id='monitor' class="icon">
        <span class="monitor"></span>
        <span class="title">监控</span>
      </div>
    </router-link>
    <router-link class='secure' v-bind:to="''">
      <div id='statistics' class="icon">
        <span class="statistics"></span>
        <span class="title">统计</span>
      </div>
    </router-link>
    <router-link class='secure' v-bind:to="'/massage'">
      <div id='message' class="icon">
        <span class="message"></span>
        <span class="title">消息</span>
      </div>
    </router-link>
    <router-link class='secure' v-bind:to="'/aboutme'">
      <div id='my' @click="select" class="icon">
        <span :class="{'mySelect':isSelect}" class="my"></span>
        <span :class="{'titleSelect':isSelect}" class="title">我的</span>
      </div>
    </router-link>
  </div>
</template>

<script>

</script>

<style scoped >

</style>
