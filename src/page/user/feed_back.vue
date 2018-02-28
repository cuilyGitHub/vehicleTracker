<template>
  <div id="feedback">
    <div class="box">
      <h3 class="title">反馈问题类型</h3>
      <div class="type-panel">
        <span v-for="(item,index) in feedback" @click="Check(index)" v-bind:class="{label:index === checkIndex}">{{item}}</span>
      </div>
      <textarea class="textarea" maxlength="200" @input="descInput" v-model="desc"
                placeholder="不能使用现在的功能了？能方便我们迅速解决问题"></textarea>
      <span class="max">{{remnant}}/200</span>
    </div>
    <div class="img-container clearfix">
      <!--<el-upload action="http://jsonplaceholder.typicode.com/posts/"
                 list-type="picture-card"
                 :auto-upload="false"
                 :multiple="true"
                 :on-change="handleChange"
                 :on-preview="handlePictureCardPreview"
                 :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>-->
      <div class="base64-upload">
        <img :src="oneImg"  alt=""/>
        <input type="file"  accept="image/*" @change="changeImg(1)" />
      </div>
      <div class="base64-upload">
        <img :src="twoImg"  alt=""/>
        <input type="file"  accept="image/*" @change="changeImg(2)" />
      </div>
      <div class="base64-upload">
        <img :src="threeImg"  alt=""/>
        <input type="file"  accept="image/*" @change="changeImg(3)" />
      </div>
    </div>
    <div class="box">
      <input class="phone" type="number" placeholder="手机号" v-model="phone"/>
    </div>
    <div class="blue-btn"  @click="commit" >提交</div>
  </div>
</template>
<script>
  import cookieUtil from '../../utils/utils'
  import { Toast } from 'mint-ui';
  export default {
    name: 'feedback',
    data () {
      return {
        oneImg:this.$api.root+"/wechat/static/image/photo.png",
        twoImg:this.$api.root+"/wechat/static/image/photo.png",
        threeImg:this.$api.root+"/wechat/static/image/photo.png",
        imgList1:null,
        imgList2:null,
        imgList3:null,
        desc: '',
        imgList:[],
        remnant: 0,
        dialogImageUrl: '',
        dialogVisible: false,
        checkIndex: null,
        feedback: ["功能异常", "体验问题", "功能建议", "其他"],
        phone:"",
        requestParams:{
          userId:"",
          suggest:"",
          type:"",
          phone:"",
          image1:'',
          image2:'',
          image3:''
        }
      }
    },
    created () {
      //this.$utils.setFontSzie(document,window);
    },
    mounted() {

    },
    methods: {
      changeImg(number) {
        let that = this;
        if (event.target.files && event.target.files[0]) {
          let file = event.target.files[0];
          let reader = new FileReader();
          reader.addEventListener('load', e => {
            if(number === 1){
              that.oneImg = e.target.result;
              let [, base64] = that.oneImg.split(',');
              let imgList = {
                size: file.size,
                type: file.type,
                name: file.name,
                base64: base64
              }
              that.imgList1 = imgList
            }
            if(number === 2){
              that.twoImg = e.target.result;
              let [, base64] = that.twoImg.split(',');
              let imgList = {
                size: file.size,
                type: file.type,
                name: file.name,
                base64: base64
              }
              that.imgList2 = imgList
            }
            if(number === 3){
              that.threeImg = e.target.result;
              let [, base64] = that.threeImg.split(',');
              let imgList = {
                size: file.size,
                type: file.type,
                name: file.name,
                base64: base64
              }
              that.imgList3 = imgList
            }
          });

          reader.readAsDataURL(file);
        }
      },
      commit(){
        this.requestParams.userId=cookieUtil.getCookie("userId");
        this.requestParams.suggest=this.desc;
        this.requestParams.type=this.checkIndex+1;
        this.requestParams.phone=this.phone;
        if(this.imgList1){
          this.requestParams.image1= "data:" + this.imgList1.type + ";base64," + this.imgList1.base64;
        }
        if(this.imgList2){
          this.requestParams.image2= "data:" + this.imgList2.type + ";base64," + this.imgList2.base64;
        }
        if(this.imgList3){
          this.requestParams.image3= "data:" + this.imgList3.type + ";base64," + this.imgList3.base64;
        }
        if(!this.requestParams.type){
          Toast({
            message: '请选择反馈类型',
            position: 'center',
          });
          return;
        }
        if(!this.requestParams.suggest){
          Toast({
            message: '请填写反馈内容',
            position: 'center',
          });
          return;
        }
        let myreg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
        if(!this.phone || !myreg.test(this.phone)){
          Toast({
            message: '手机号错误',
            position: 'center',
          });
          return;
        }
        let that = this;

        this.$api.post('/system/common/suggestion/client_save_suggestion.do', this.requestParams, function (success) {
          if (success.status === 0) {
            //修改成功
            Toast({
              message: '感谢您的反馈',
              iconClass: 'icon icon-success'
            });
            that.$router.push({path:'/about'})
          } else {
            Toast({
              message: '提交失败',
              position: 'bottom',
            });
          }
        }, function (error) {
        });
      },
      descInput(){
        let txtVal = this.desc.length;
        this.remnant = txtVal;
      },
      /*handleChange(file,fileList){
        let that = this;
        // console.log(file.length);
        let image = file.raw;
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = function(e){
          let [, base64] = this.result.split(',');
          let files = {
            size: image.size,
            type: image.type,
            name: image.name,
            base64: base64 // 这个就是base64编码了
          };
          that.imgList.push(files);
        };
      },*/
      /*handleRemove(file, fileList) { //file->被删除项  //剩下的照片
        //console.log(file, fileList);
        let that = this;
        that.imgList = [];
        fileList.forEach(function(value,key) {
            console.log(value);
            let file = value;
            let reader = new FileReader();
            // reader.readAsDataURL(file);
            reader.onload = function(e){
                let [, base64] = this.result.split(',');
                let files = {
                  size: file.size,
                  type: file.type,
                  name: file.name,
                  base64: base64 // 这个就是base64编码了
                };
                console.log(files);
                that.imgList.push(files);
            }
        });
      },*/
      /*handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },*/
      Check(index){
        this.checkIndex = index;
      }
    }
  }
</script>
<style scoped lang='less'>
  @import '../../style/less/user/feedback.less';
</style>
