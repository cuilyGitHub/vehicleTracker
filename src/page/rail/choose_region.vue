<template>
  <div id='chooseregion'>
    <ul class="box">
      <li class="li" v-for="(item,index) in dataList" @click="getCityData(item)">
        <span class="name">{{item.districtName}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
  import { MessageBox } from 'mint-ui';
  export default{
    name:'chooseregion',
    data(){
      return{
        dataList:[],
        districtCode:0
      }
    },
    created(){
      this.getProvince();
    },
    methods:{
      getCityData(item){
        if(item.type != 2){
          this.districtCode = item.districtCode;
          this.getProvince();
        }else{
          let cardData = JSON.parse(sessionStorage.getItem('regionrailCardData'));
          cardData.districtCode = item.districtCode;
          cardData.districtName = item.districtName;
          sessionStorage.setItem('regionrailCardData',JSON.stringify(cardData),7);
          this.$router.go(-1);
          //this.$router.push({path:'/regionrailcard/'+this.$route.query.id,query:{serialNo:this.$route.query.serialNo,districtName:item.districtName}})
        }
      },
      getProvince(){
        let that = this;
        this.$api.get("/region/region/clientQueryRegion.do", {
          districtCode:this.districtCode
        }, function (success) {
          if(success.status === 0){
            console.log(success);
            that.dataList =success.result;
          }else {
            MessageBox.alert(success.message,'提示');
          }
        }, function (error) {

        })
      }
    }
  }
</script>
<style scoped lang='less'>
  @import '../../style/base/base.less';
  .box{
    background: @white !important;
    .li{
      height: 1.5rem;
      line-height: 1.5rem;
      border-bottom: 1px solid @grey-xs;
      padding: 0 0.3rem;
      .smallx-font-black;
    }
  }
</style>
