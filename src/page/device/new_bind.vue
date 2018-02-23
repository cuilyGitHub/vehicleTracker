<template>
  <div id="newbind">
    <div class="bindthing">
      <input class="input" type="text" v-model="detailData.carName" placeholder="绑定物名称、不填写自动识别绑定物"/>
      <p class="des">最多十个字描述</p>
    </div>
    <div class="box">
        <div class="device clearfix">
          <div class="photo">绑定物照片</div>
          <div class="arrow"></div>
          <div class="base64-upload clearfix">
            <div class="img" :style="{background: 'url('+detailData.photo+') no-repeat center'}"  ></div>
            <input type="file"  accept="image/*" @change="onChangeImage" />
          </div>
        </div>
    </div>
    <div class="box other-operation">
      <div class="order-type" @click="carInfo">
        <span class="title">车辆信息</span>
        <span class="pull-down"></span>
      </div>
      <ul class="list" v-bind:class="{show:isShowCar}">
        <li class="li">
          <span class="name">车牌号:</span>
          <input class="right-input" v-model="detailData.number" type="text" placeholder="填写车牌"/>
        </li>
        <router-link v-bind:to="'/brands'">
          <li class="li">
            <span class="name">车品牌:</span>
            <span class="right-arrow"></span>
            <span class='right-value'>{{detailData.brand}}</span>
          </li>
        </router-link>
        <router-link v-bind:to="'/color'">
          <li class="li">
            <span class="name">车颜色:</span>
            <span class="right-arrow"></span>
            <span class='right-value'>{{detailData.color}}</span>
          </li>
        </router-link>
        <li class="li" @click="open('start')">
          <span class="name">购入时间:</span>
          <span class="right-arrow"></span>
          <span class='right-value'>{{detailData.buyTime | formatDate}}</span>
        </li>
        <li class="li">
          <span class="name">驾驶员:</span>
          <input class="right-input" type="text" v-model="detailData.driver" placeholder="填写驾驶人"/>
        </li>
      </ul>
    </div>
    <div class="box other-operation">
      <div class="order-type" @click="openPosition">
        <span class="title">安装位置</span>
        <span class="pull-down"></span>
      </div>
      <ul class="label-list" v-bind:class="{show:isShowPosition}">
        <li class="label" v-for="(item,index) in positions"
            v-bind:class="{select:index === check}"
            @click="positionCheck(index)">
            {{item}}
        </li>
      </ul>
    </div>
    <div class="box other-operation">
      <div class="order-type" @click="openSpecific">
        <span class="title">具体安装位置</span>
        <span class="pull-down"></span>
      </div>
      <ul class="label-list" v-bind:class="{show:isShowSpecific}">
        <li class="label" v-for="(item,index) in specific" v-bind:class="{select:index === specificCheck}"
            @click="openSpecificCheck(index)">
          {{item}}
        </li>
      </ul>
    </div>
    <div v-if="routeForm === 'editdevicebind'" class="blue-btn" @click="addCarInfo">确定</div>
    <div v-if="routeForm != 'editdevicebind'" class="blue-btn" @click="updateCarInfo">确定</div>
    <div v-if="routeForm != 'editdevicebind'" class="red-btn" @click="unBindDevice">移出绑定</div>
    <div v-if="routeForm === 'editdevicebind'" class="red-btn" @click="clear">移出绑定</div>
    <mt-datetime-picker ref="start" type="date" v-model="detailData.buyTime"
                        year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="start">
    </mt-datetime-picker>
  </div>
</template>
<script>
  import {MessageBox} from 'mint-ui';
  import cookieUtil from '../../utils/utils'
  import deviceData from '../../utils/public_value'
  import {formatDate} from '../../utils/filters.js';
  export default {
    name: 'newbind',
    data() {
      return {
        serialNo:this.$route.query.serialNo,
        number:this.$route.query.number,
        routeForm:this.$route.query.route,
        detailData:{
          carName:null,
          color:'请选择',
          brand:'请选择',
          driver:null,
          buyTime:new Date(),
          id:null,
          installDevice:null,
          installPosition:null,
          number:null,
          photo:this.$api.root+"/wechat/static/image/userhead.png"
        },
        watchCarName:null,
        isShowCar: false,
        isShowPosition: false,
        isShowSpecific: false,
        check: null,
        specificCheck: null,
        specific: ['前杠', '中控台', '后杠', 'OBD', '变速箱盖'],
        positions: ['左前', '前', '右前', '左', '中', '右', '左后', '后', '右后'],
        photoBase64:null,
        postPhoto:null,
        startTime:null,
      };
    },
    activated: function () {
      this.serialNo = this.$route.query.serialNo;
      this.number = this.$route.query.number;
      this.routeForm = this.$route.query.route;
      if(this.number){
        //this.$destroy(true);
        console.log(7777);
        let that = this;
        this.$api.get('/car/car/clientQueryCarDetailInfo.do', {
          serialNo: this.serialNo,
          number:this.number
        }, function (success) {
          console.log(success);
          if (success.status === 0){
            that.detailData = success.result;
            if(!that.detailData.carName || !that.detailData.carName === ''){
              that.detailData.carName = that.detailData.number;
            }
            if(!that.detailData.photo){
              that.detailData.photo = this.$api.root+'/wechat/static/image/userhead.png';
            }else{
              that.detailData.photo = that.$api.root+success.result.photo;
            }
            if(deviceData.deviceData.isBack){
              if(deviceData.deviceData.brands != null){
                that.detailData.brand = deviceData.deviceData.brands;
              }
              if(deviceData.deviceData.color != null){
                that.detailData.color = deviceData.deviceData.color;
              }
            }
          }else{
            that.openAlert(success.message)
          }
        }, function (error) {

        })
      }else{
        if(!deviceData.deviceData.brands){
          this.detailData.carName = null;
          this.detailData.color='请选择';
          this.detailData.brand='请选择';
          this.detailData.driver=null;
          this.detailData.buyTime=new Date();
          this.detailData.id=null;
          this.detailData.installDevice=null;
          this.detailData.installPosition=null;
          this.detailData.number=null;
          this.detailData.photo=this.$api.root+'/wechat/static/image/userhead.png';
        }
        if(deviceData.deviceData.brands != null){
          this.detailData.brand = deviceData.deviceData.brands;
        }
        if(deviceData.deviceData.color != null){
          this.detailData.color = deviceData.deviceData.color;
        }
      }
    },
    computed: {
      pokerHistory() {
        return this.detailData.number
      }
    },
    watch: {
      pokerHistory(newValue, oldValue){
          this.detailData.carName = newValue;
      }
    },
    methods: {
      open(picker) {
        this.$refs[picker].open();
      },
      start(value) {
        console.log(value);
        this.startTime = value;
      },
      carInfo(){
        this.isShowCar = !this.isShowCar;
      },
      openPosition(){
        this.isShowPosition = !this.isShowPosition;
      },
      positionCheck(index){
        if(this.check === index){
          this.check = null;
        }else{
          this.check = index;
        }
        this.specificCheck = null;
        console.log("安装位置"+index);
      },
      openSpecific(){
        this.isShowSpecific = !this.isShowSpecific;
      },
      openSpecificCheck(index){
        if(this.specificCheck === index){
          this.specificCheck = null;
        }else{
          this.specificCheck = index;
        }
        this.check = null;
      },
      openAlert(content) {
        MessageBox.alert(content, '提示');
      },

      updateCarInfo(){//修改绑定物

        if(!this.detailData.number){
          this.openAlert('车牌号错误');
          return;
        }
        if(!this.detailData.driver){
          this.openAlert('请填写驾驶员');
          return;
        }
        if(this.photoBase64){
          this.postPhoto = "data:" + this.photoBase64.type + ";base64," + this.photoBase64.base64;
        }
        if(this.detailData.buyTime instanceof Date){
          this.detailData.buyTime = formatDate(this.detailData.buyTime,'yyyy/MM/dd/');
        }
        let that = this;
        this.$api.post("/car/car/clientUpdateCar.do", {
          number: this.detailData.number,
          brand: this.detailData.brand,
          color:this.detailData.color,
          buyTime:this.detailData.buyTime,
          driver:this.detailData.driver,
          photo:this.postPhoto,
        }, function (success) {
          console.log(success);
          if (success.status === 0){
            //that.openAlert('添加成功');
            that.bindDevice();
          }else{
            that.openAlert(success.message);
          }
        }, function (error) {
          console.log(error);
        })
      },

      addCarInfo(){ //添加新绑定物
        if(!this.detailData.number){
          this.openAlert('车牌号错误');
          return;
        }
        if(this.detailData.brand === '请选择'){
          this.openAlert('请选择车辆型号');
          return;
        }
        if(!this.detailData.color === '请选择'){
          this.openAlert('请选择车辆颜色');
          return;
        }
        if(!this.detailData.driver){
          this.openAlert('请填写驾驶员');
          return;
        }
        if(this.photoBase64){
          this.postPhoto = "data:" + this.photoBase64.type + ";base64," + this.photoBase64.base64;
        }
        if(this.detailData.buyTime instanceof Date){
          this.detailData.buyTime = formatDate(this.detailData.buyTime,'yyyy/MM/dd/');
        }
        let that = this;
        this.$api.post("/car/car/clientAddCar.do", {
          number: this.detailData.number,
          brand: this.detailData.brand,
          color:this.detailData.color,
          buyTime:this.detailData.buyTime,
          driver:this.detailData.driver,
          photo:this.postPhoto,
        }, function (success) {
          console.log(success);
          if (success.status === 0){
              that.bindDevice();
            }
        }, function (error) {
          console.log(error);
        })
      },
      bindDevice(){
        let that = this;
        this.$api.post("/device/device/clientBindCar.do",{
          deviceSerialNo:this.serialNo,
          number:this.detailData.number,
          carName:this.detailData.carName,
          installPosition:this.check+1,
          installDevice:this.specificCheck+1
        }, function (success) {
          if(success.status === 0){
            if(that.routeForm === 'editdevicebind' || that.routeForm === 'deviceadd' || that.routeForm === 'bindexisting'){
              that.$router.push({name:'deviceadd',query:{serialNo:that.serialNo}})
            }else if(that.routeForm === 'editdevice') {
              that.$router.push({name:that.$route.query.route,query:{serialNo:that.serialNo}})
            }else {
              that.$router.push({name:'devicelist',query:{serialNo:that.serialNo}})
            }
          }else {
            that.openAlert(success.message);
          }
          console.log(success);


        },function (error) {
          console.log(error);
        })
      },
      clear(){
        MessageBox.confirm('确定移除当前的绑定物').then(action => {
          this.$router.go(-1)
        }).catch(()=>{

        });

      },
      unBindDevice(){
        MessageBox.confirm('确定移除当前的绑定物').then(action => {
          let that = this;
          this.$api.post("/device/device/clientUnBindCar.do",{
            deviceSerialNo:this.serialNo,
            number:this.number
          },function (success) {
            if (success.status === 0){
              that.$router.push({name:'editdevicebind',query:{serialNo:that.serialNo}})
            }else {
              that.openAlert(success.message);
            }
          },function (error) {
            console.log(error);
          })
        }).catch(()=>{

        });
      },
      onChangeImage() {
        let that = this;
        if (event.target.files && event.target.files[0]) {
          let file = event.target.files[0];
          let reader = new FileReader();
          reader.addEventListener('load', e => {
            that.detailData.photo = e.target.result
            let [, base64] = that.detailData.photo.split(',');
            let imgList = {
              size: file.size,
              type: file.type,
              name: file.name,
              base64: base64
            }
            that.photoBase64 = imgList;
          })
          console.log(file);
          reader.readAsDataURL(file);
        }
      },
    },
    filters: {
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy年MM月dd日');
      }
    }
  };
</script>

<style scoped lang="less">
  @import '../../style/less/device/new_bind.less';
</style>
