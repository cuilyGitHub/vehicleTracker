<template>
  <ul class="list" id="editDevice">
    <li >
      <span class="name">设备编号:</span>
      <span class="right-value">{{serialNo}}</span>
    </li>
    <li @click="bind">
      <span class="name">绑定的物品:</span>
      <span class='right-arrow'></span>
      <span class="right-value">{{carName}}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    data() {
      return {
        serialNo:this.$route.query.serialNo,
        number:this.$route.query.number,
        carName:this.$route.query.carName,
      };
    },
    created() {
      let that = this;
      this.$api.get("/device/device/clientGetDetailInfo.do", {
        serialNo: this.$route.query.serialNo,
      }, function (success) {
        if(success.status===0){
          console.log(success);
          that.carName = success.result.carName;
          that.serialNo = success.result.serialNo;
          that.number = success.result.number;
        }
      }, function (failure) {
      })
    },
    mounted() {

    },
    methods: {
      bind(){
        if(this.number){
          //this.$router.push({path:'/newbind/'+this.serialNo,query:{number:this.number,route:'editdevice'}})
          this.$router.push({path:'/newbind',query:{serialNo:this.serialNo,number:this.number,route:'editdevice'}})
        }else{
          this.$router.push({name:'editdevicebind',query:{serialNo:this.serialNo}})
        }
      }
    },
  };
</script>

<style scoped lang="less">
  @import '../../style/base/color';
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
      .name{
        min-width: 2.5rem;
        margin-right: 0.5rem;
        .smallx-font-black;
      }
      .right-value{
        float: right;
        margin-right: 0.3rem;
      }
      .right-arrow{
        float: right;
        height: 1.5rem;
        width: 0.5rem;
        background: url("../../../static/image/more.png") no-repeat center;
        background-size: 1.5rem;
      }
    }
  }
</style>
