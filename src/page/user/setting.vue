<template>
  <div id='setting'>
      <ul class="list">
        <li>
          <span class="name">监控刷新间隔:</span>
          <span class='right-value'>秒</span>
          <input class="input" v-model="refreshNum" type="number" placeholder="10-60的整数" />
        </li>
        <!--<router-link class='secure' v-bind:to="'/choosemap'">
          <li>
            <span class="name">使用地图:</span>
            <span class='right-arrow'></span>
            <span class="right-value">百度地图</span>
          </li>
        </router-link>-->
        <router-link class='secure' v-bind:to="'/messagesetting'">
            <li>
            <span class="name">消息设置:</span>
            <span class='right-arrow'></span>
            </li>
        </router-link>
        <!--<li>
          <span class="name">使用GPS定位:</span>
          <mt-switch class="switch" v-model="gpsValue"></mt-switch>
        </li>-->
      </ul>
  </div>
</template>
<script>
  import {MessageBox} from 'mint-ui';
  export default{
    name: 'setting',
    data(){
      return {
        refreshNum:10,
        gpsValue:false
      }
    },
    created(){
      if(sessionStorage.getItem('refreshNum')){
        this.refreshNum = sessionStorage.getItem('refreshNum');
      }

    },
    watch:{
      refreshNum(curVal,oldVal){
          if(this.refreshNum > 60){
            this.refreshNum = 60;
          }
          sessionStorage.setItem('refreshNum',this.refreshNum)
        }
      },
    methods: {

    }
  }
</script>
<style scoped lang='less'>
  @import '../../style/less/user/setting.less';
</style>
