<template>
  <div>
    <div class="search">
      <span class="brand" @click="popupVisible = true">{{brand}}</span>
      <input class="input" type="text" v-model="number" placeholder="输入车牌号过滤" />
    </div>
    <ul class="results">
      <li v-for="item in dataList">
        <span @click="gobind(item.number)" class="name">{{item.number}}</span>
      </li>
    </ul>
    <!--<div class='btn' @click="clearResults">清空搜索历史</div>-->
    <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
      <div class="brand-panel" @click="">
          <span @click="checkBarnd(index)" class="item" v-for="index in barnds">{{index}}</span>
      </div>
    </mt-popup>
  </div>
</template>

<script type="text/babel">
  import { MessageBox } from 'mint-ui';
  import cookieUtil from '../../utils/utils'
  export default {
    data() {
      return {
        brand:'京',
        number:'',
        dataList:[],
        popupVisible: false,
        barnds:['京','津','豫','沪','渝','冀','云','辽','黑','湘','皖','鲁','新','苏','赣','浙','鄂','桂','甘','晋']
      };
    },
    created(){
      this.keyword = this.brand;
      this.getBrandType();
    },
    watch:{
      number(curVal,oldVal){
        this.getBrandType();
        console.log(curVal,oldVal);
      }
    },
    methods: {
      checkBarnd(index){
        this.brand = index;
        this.popupVisible = false;
        this.getBrandType();
      },
      gobind(number){
        //this.$router.push({path:'/newbind/'+this.$route.query.serialNo,query:{number:number}})
        this.$router.push({path:'/newbind',query:{serialNo:this.$route.query.serialNo,number:number,route:'bindexisting'}})
      },
      getBrandType(){
        let that = this;
        this.$api.get("/car/car/clientQueryCarInfo.do",{
          type:2,
          keyword:that.brand + that.number
        },function (data) {
          if(data.status === 0){
            that.dataList = data.result;
            console.log(data);
          }else {
            this.openAlert(data.message);
          }
        },function (failure) {

        })
      }
    }
  };
</script>

<style scoped lang='less'>
  @import '../../style/less/device/bind_existing.less';
</style>
