<template>
  <div id="order">
    <div class="box">
      <router-link v-bind:to="{name:'editdevice',query:{serialNo:$route.query.serialNo,carName:$route.query.carName,number:info.number}}">
        <div class="device">
          <img :src="info.photo?$api.root+info.photo:this.$api.root+'/wechat/static/image/userhead.png'" alt="">
          <div class="content">
            <div class="number">设备编号：{{$route.query.serialNo}}</div>
            <div class="name">绑定物名：{{info.carName}}</div>
          </div>
          <div class="arrow"></div>
        </div>
      </router-link>
    </div>
    <div class="box other-operation">
      <div class="order-type" @click="openSecure">
        <span class="title">安全相关</span>
        <span class="pull-down"></span>
      </div>
      <ul v-bind:class="{show:isShowSecure}" >
        <li v-for="(item,index) in aboutSecure" @click="secureCheck(item,index)">
          <span class="name" v-bind:class="{select:index === checkSecure}">{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="box other-operation">
      <div class="order-type" @click="openFrequency">
        <span class="title">传输频率</span>
        <span class="pull-down"></span>
      </div>
      <ul v-bind:class="{show:isShowFrequency}">
        <li  v-for="(item,index) in Frequency" @click="frequencyCheck(item,index)">
          <span v-if='!item.des' class="name" v-bind:class="{select:index === checkFrequency}">{{item.name}}</span>
          <div v-else-if='item.des'>
            <input type='number' class="input" v-model="customNumber" :placeholder='item.des' />
            <span  class="execution" @click="execution(item)">执行</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="box other-operation">
      <div class="order-type" @click="openOther">
        <span class="title">其他</span>
        <span class="pull-down"></span>
      </div>
      <ul v-bind:class="{show:isShowOther}">
        <li v-for="(item,index) in other" @click="otherCheck(item,index)">
          <span class="name" v-bind:class="{select:index === checkOther}">{{item.name}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script >
  import { MessageBox } from 'mint-ui';
  export default {
    data() {
      return {
        request:{
          serialNo: this.$route.query.serialNo,
          typeId:null,
          transferInterval:null
        },
        info:[],
        customNumber:null,
        isShowSecure:true,
        checkSecure:null,
        isShowFrequency:false,
        checkFrequency:null,
        isShowOther:false,
        checkOther:null,
        aboutSecure:[{typeId:10,name:'恢复油'},{typeId:20,name:'断油'},
                     {typeId:30,name:'断电'},{typeId:40,name:'恢复电'},
                     {typeId:80,name:'重启设备'}],
        Frequency:[{typeId:50,name:'10s'},{typeId:50,name:'20s'},
                   {typeId:50,name:'1分钟'},{typeId:50,des:'自定义10-86400的传输频率'}],
        other:[{typeId:60,name:'开启通讯指示灯'},{typeId:70,name:'关闭通讯指示灯'},
               {typeId:90,name:'当前经纬度查询'},{typeId:100,name:'参数设置查询'},
               {typeId:110,name:'通讯卡号'},{typeId:120,name:'获取版本'}]

      };
    },
    created() {
      let that = this;
      this.$api.get("/device/device/clientGetDetailInfo.do", {
        serialNo: this.request.serialNo,
      }, function (success) {
        if(success.status===0){
          that.info = success.result;
        }
      }, function (failure) {
      })
    },
    mounted() {

    },
    methods: {
      setOrder(){
        let that = this;
        this.$api.post('/device/deviceCommand/clientAddCommand.do', {
          "serialNo": this.request.serialNo,
          "typeId":  this.request.typeId,
          "transferInterval":this.request.transferInterval
        }, function (success) {
          if (success.status === 0) {
            that.dataList = success.result;
            console.log(success.result);
            /*for (var i = 0; i < that.result.length; i++) {
              var obj = {};
              obj.label = that.result[i].name;
              obj.value = that.result[i].tagId;
              that.tagValue.push(obj);
            }*/
          } else {
            MessageBox.alert(success.message,'提示');
          }
        }, function (error) {
          console.log(error);
        });
      },
      execution(item){
        this.request.transferInterval = this.customNumber;
        this.request.typeId = item.typeId;
        this.setOrder();
        this.checkFrequency=null;
        //console.log(this.customNumber);
      },
      openSecure(){
          this.isShowSecure=!this.isShowSecure;
      },
      secureCheck(item,index){
        this.checkSecure=index;
        this.request.typeId = item.typeId;
        this.setOrder();
        this.checkSecure=null; //执行完成后，可以清空
      },
      openFrequency(){
        this.isShowFrequency=!this.isShowFrequency;
      },
      frequencyCheck(item,index){
        if(!item.name){
          return;
        }
        this.customNumber = null;
        this.checkFrequency=index;
        this.request.typeId = item.typeId;
        if(item.name === '1分钟'){
          this.request.transferInterval = 60
        }else{
          this.request.transferInterval = parseInt(item.name);
        }
        console.log(this.request.transferInterval);
        this.setOrder();
        this.checkFrequency=null; //执行完成后，可以清空
      },
      openOther(){
        this.isShowOther=!this.isShowOther;
      },
      otherCheck(item,index){
        this.checkOther=index;
        this.request.typeId = item.typeId;
        this.setOrder();
        this.checkOther=null; //执行完成后，可以清空
      },
    },
  };
</script>

<style scoped lang="less">
  @import '../../style/less/device/order.less';
</style>
