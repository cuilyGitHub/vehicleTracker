<template>
  <div id="tag">
    <div class="add-paenl clearfix">
      <input class="input" v-model="newTagValue" type="text" placeholder="填写标签名称"/>
      <div class="btn" @click="addTag();">增加</div>
    </div>
    <div class="box">
       <ul class="list">
         <li v-for="(item,index) in dataList" :id="item.tagId" ref="lis" @click.stop="tagCheck(item,index)">
           {{item.name}}
           <i v-on:click.stop="delTag(item.tagId)">删除</i></li>
       </ul>
     </div>
    <div class="blue-btn" @click="setTag();">确定</div>
  </div>
</template>

<script>
  import {MessageBox} from 'mint-ui';
  import cookieUtil from '../../utils/utils'
  export default {
    data() {
      return {
        dataList: [],
        newTagValue: null,
        deviceId: this.$route.query.deviceId,
        tagList: [],
      };
    },
    created() {
      this.getUserTags();
    },
    mounted() {
    },
    methods: {
      delDom(){
        //侧滑显示删除按钮
        var expansion = null; //是否存在展开的list
        var container = document.querySelectorAll('.list li');
        console.log(container);
        for(var i = 0; i < container.length; i++){
          var x, y, X, Y, swipeX, swipeY;
          container[i].addEventListener('touchstart', function(event) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;
            swipeX = true;
            swipeY = true ;
            if(expansion){   //判断是否展开，如果展开则收起
              expansion.className = "";
            }
          });
          container[i].addEventListener('touchmove', function(event){
            X = event.changedTouches[0].pageX;
            Y = event.changedTouches[0].pageY;
            // 左右滑动
            if(swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0){
              // 阻止事件冒泡
              event.stopPropagation();
              if(X - x > 10){   //右滑
                event.preventDefault();
                this.className = "";    //右滑收起
              }
              if(x - X > 10){   //左滑
                event.preventDefault();
                this.className = "swipeleft";   //左滑展开
                expansion = this;
              }
              swipeY = false;
            }
            // 上下滑动
            if(swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
              swipeX = false;
            }
          });
        }
      },
      getUserTags(){ //获取用户权限下所有的标签
        let that = this;
        this.$api.get('/device/deviceTag/clientListDeviceTags.do', {
          user: cookieUtil.getCookie("user")
        }, function (success) {
          if (success.status === 0) {
            that.dataList = success.result;
            that.getSelectTags();
            that.$nextTick(() => {
              that.delDom();
            })
          } else {
            this.openAlert(success.message);
          }
        }, function (error) {

        });
      },
      getSelectTags(){ //获取设备已添加的标签
        let that = this;
        this.$api.get('/device/deviceTag/clientListDeviceTagsBySerialNo.do', {
          serialNo: that.deviceId
        }, function (success) {
          if (success.status === 0) {
            if (success.result !== null) {
              let lis = that.$refs.lis;
              that.tagList = success.result;
              for(let x in lis){
                for(let y in success.result){
                  if(Number(lis[x].id) === success.result[y].tagId){
                    lis[x].className = 'select';
                  }
                }
              }
            }
          } else {
            that.openAlert(success.message);
          }
        }, function (error) {
          console.log(error);
        });
      },
      addTag(){
        if (!this.newTagValue) {
          return;
        }
        this.$api.post('/device/deviceTag/clientAddTag.do', {
          name: this.newTagValue,
          user: cookieUtil.getCookie("user")
        }, function (success) {
          if (success.status === 0) {
            window.location.reload();
          } else {
            this.openAlert(success.message)
          }
        }, function (error) {
          console.log(error);
        });
      },
      delTag(tagId){  //删除标签
        this.$api.post('/device/deviceTag/clientDelTag.do', {
          user: cookieUtil.getCookie("user"),
          tagId:tagId
        }, function (success) {
          if (success.status === 0) {
            window.location.reload();
          } else {
            this.openAlert(success.message);
          }
        }, function (error) {
          console.log(error);
        });
      },
      setTag(){ //设置标签
        let that = this;
        this.$api.post('/device/deviceTag/clientSetTags.do', {
          serialNo: this.deviceId,
          tagList: this.tagList
        }, function (success) {
          console.log(success);
            that.$router.go(-1);
        }, function (error) {
          console.log(error);
        });
      },
      tagCheck(item,index){  //选择标签
        let li = this.$refs.lis[index];
        if(li.className === 'select'){
          li.className = '';
          for(let i in this.tagList){
            if(this.tagList[i].tagId === item.tagId){
              this.tagList.splice(i, 1);
            }
          }
        }else {
          li.className = 'select';
          this.tagList.unshift(item);
        }
        for(let i in this.tagList){
          this.tagList[i].isSelected = true;
        }
      }
    }
  };
</script>

<style scoped lang="less">
  @import '../../style/less/device/tag.less';
</style>
