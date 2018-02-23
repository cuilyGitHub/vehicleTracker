<template>
  <div id="identityapple" class="identityapple-panel">
    <div class="box">
      <input type="text" class="input" v-model="idCardName" placeholder="真实姓名">
      <input type="number" class="input" v-model="idCardNumber" placeholder="身份证号码">
    </div>
    <div class="box">
      <div class="title">手持身份证照片</div>
      <ul class="picture">
        <li>
          <div class="template idCardPositive"></div>
          <div class="base64-upload">
            <img :src="frontImageSrc"  alt=""/>
            <input type="file"  accept="image/*" @change="changeFrontImage" />
          </div>
        </li>
        <li>
          <div class="template idCardBack"></div>
          <div class="base64-upload">
            <img :src="backImageSrc"  alt=""/>
            <input type="file"  accept="image/*" @change="changeBackImage" />
          </div>
        </li>
      </ul>
    </div>
    <div class="blue-btn" @click="pushMessage">提交实名认证</div>
  </div>
</template>
<script>
  import {MessageBox} from 'mint-ui';
  import cookieUtil from '../../utils/utils'
  export default {
    name:'identityapple',
    data () {
      return {
        frontImageSrc: "../../../static/image/frontViewPhoto.png",
        backImageSrc:"../../../static/image/backViewPhoto.png",

        idCardName:null,
        idCardNumber:null,
        frontViewPhoto:null,
        backViewPhoto:null,
        aCity:{11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",
               31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",
               43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",
               61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}
      }
    },
    created () {

    },
    mounted() {

    },
    watch:{

    },
    methods:{
      changeFrontImage() {
        let that = this;
        if (event.target.files && event.target.files[0]) {
          let file = event.target.files[0]
          let reader = new FileReader()
          reader.addEventListener('load', e => {
            that.frontImageSrc = e.target.result
            let [, base64] = that.frontImageSrc.split(',')
            let imgList = {
              size: file.size,
              type: file.type,
              name: file.name,
              base64: base64
            }
            this.frontViewPhoto = imgList;
          })
          console.log(file);
          reader.readAsDataURL(file);
        }
      },
      changeBackImage() {
        let that = this;
        if (event.target.files && event.target.files[0]) {
          let file = event.target.files[0]
          let reader = new FileReader()
          reader.addEventListener('load', e => {
            that.backImageSrc = e.target.result
            let [, base64] = that.backImageSrc.split(',')
            let imgList = {
              size: file.size,
              type: file.type,
              name: file.name,
              base64: base64
            }
            this.backViewPhoto = imgList;
          })
          console.log(file);
          reader.readAsDataURL(file);
        }
      },
      postImg(frontViewPhoto,backViewPhoto){ //上传到服务器
        let that = this;
        this.$api.post('/user/api/certification.do', {
          user: cookieUtil.getCookie("user"),
          name:this.idCardName,
          identityCard:this.idCardNumber,
          frontViewPhoto:frontViewPhoto,
          backViewPhoto:backViewPhoto,
        }, function (success) {
          if (success.status === 0) {
            //修改成功
            MessageBox.alert("提交成功!");
            that.$router.push({ path: '/secure' });
          } else {
            MessageBox.alert(success.message)
          }
        }, function (error) {
          console.log(error)
        })
      },
      isCardID(sId){
        console.log(sId);
        var iSum=0 ;
        var info="" ;
        if(!/^\d{17}(\d|x)$/i.test(sId)){
          return "你输入的身份证长度或格式错误";
        }
        sId=sId.replace(/x$/i,"a");
        if(this.aCity[parseInt(sId.substr(0,2))]==null){
          return MessageBox.alert("你的身份证地区非法",'提示');
        }
        var sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
        var d=new Date(sBirthday.replace(/-/g,"/")) ;
        if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
          return MessageBox.alert("身份证上的出生日期非法",'提示');
        }
        for(var i = 17;i>=0;i --){
          iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
        }
        if(iSum%11!=1){
          return MessageBox.alert("你输入的身份证号非法",'提示');
        }
        return true;
      },
      pushMessage(){
        if(!this.idCardName){
          console.log(this.idCardName);
          MessageBox.alert('请填写真实姓名','提示');
          return;
        }
        if(!this.idCardNumber){
          MessageBox.alert('请填写身份证号','提示');
          return;
        }
        if(!this.frontViewPhoto){
          MessageBox.alert('请上传身份证正面照片','提示');
          return;
        }
        if(!this.backViewPhoto){
          MessageBox.alert('请上传身份证反面照片','提示');
          return;
        }
        this.isCardID(this.idCardNumber);
        MessageBox.confirm('确定提交上传?').then(action => {
          let frontViewPhoto = "data:" + this.frontViewPhoto.type + ";base64," + this.frontViewPhoto.base64;
          let backViewPhoto = "data:" + this.backViewPhoto.type + ";base64," + this.backViewPhoto.base64;
          this.postImg(frontViewPhoto,backViewPhoto);
        },err=>{

        });

      }
    }
  }
</script>
<style scoped lang='less'>
  @import '../../style/less/user/identityapple.less';
</style>
