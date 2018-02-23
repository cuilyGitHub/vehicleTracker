<template>
  <div id='setting'>
    <ul class="list">
        <li v-for="(item,index) in mapList" @click="mapCheck(item,index)">
          <span v-bind:class="{select:index === checkMap}" class="name">{{item}}</span>
        </li>
    </ul>
  </div>
</template>
<script>
  import {MessageBox} from 'mint-ui';
  export default{
    name: 'setting',
    data(){
      return {
        gpsValue:false,
        checkMap:null,
        mapList:['高德地图','百度地图']
      }
    },
    created(){

    },
    mounted(){

    },
    methods: {
      mapCheck(item,index){
        this.checkMap=index;

      },
    }
  }
</script>
<style scoped lang='less'>
  @import '../../style/base/base.less';
  .list{
    background: @white;
    li{
      padding: 0 0.3rem;
      height: 1.5rem;
      line-height: 1.5rem;
      .smallx-font-grey;
      border-bottom: 1px solid @grey-xxs;
      span{
        display: block;
        float: left;
      }
      .select{
        background: url("../../../static/image/check.png") no-repeat right;
        background-size: 1.5rem;
      }
      .name{
        width: 9.5rem;
        margin-right: 0.2rem;
        .small-font-black;
        .booth:first-of-type{
          margin-right: 1.5rem;
        }
        .booth:last-of-type{
          margin-left: 1.2rem;
        }
      }
    }
  }

</style>
