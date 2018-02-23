<template>
  <div id="alerttype">
    <div class="box">
      <ul>
        <li v-for="(item,index) in aboutType">
          <span class="name"
                :id="item.messageTypeId" ref="lis"
                @click="typeCheck(item,index)"
          >{{item.messageType}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script >
  import cookieUtil from '../../utils/utils';
  import {MessageBox} from 'mint-ui';
  export default {
    data() {
      return {
        aboutType:[],
        tagList:[],
        warnTypeIds:[]
      };
    },
    created() {
      this.getType();
    },
    mounted() {

    },
    methods: {
      typeCheck(item,index){  //选择标签
        let that = this;
        let li = this.$refs.lis[index];
        var typeIds = [];
        if(li.className === 'select'){
          li.className = '';
          this.tagList.forEach(function (x, key) {
            if(x === item.messageTypeId){
              that.tagList.splice(key, 1);
            }
          })
        }else {
          li.className = 'select';
          this.tagList.unshift(item.messageTypeId);
        }
        this.tagList.forEach(function (x, key) {
          typeIds.push(x);
        })
        let setData = JSON.parse(sessionStorage.getItem('setData'));
        console.log(setData);
        this.$api.post("/operating/push/pushDevice/client_push_setting.do",{
          user:cookieUtil.getCookie("user"),
          idFromPushService:'',
          isReceivePush:setData.isReceivePush,
          isPushSound:setData.isPushSound,
          warnTypeIds:typeIds,
          pushTimeList:setData.pushTimeList
        },function (success) {
          if(success.status === 0){

          }
          console.log(success);
        },function (error) {

        });
        sessionStorage.setItem('typeIds',typeIds,7);
      },
      screening(){
        let that = this;
        for(var i=0;i<that.warnTypeIds.length;i++){
          var x = that.warnTypeIds[i];
          let li = that.$refs.lis[x - 1];
          li.className = 'select';
          that.tagList.push(x);
        }
        console.log(that.tagList);
      },
      getType(){
        let that = this;
        this.$api.get("/operating/push/pushMessage/clientGetKindMessageByUser.do",{
          user: cookieUtil.getCookie("user")
        },function (data) {
          if(data.status === 0){
            that.aboutType = data.result
            that.getPushSetting();
          }
        },function (failure) {
        })
      },
      getPushSetting(){
        let that = this;
        this.$api.get('/operating/push/pushDevice/client_get_push_setting.do', {
          user: cookieUtil.getCookie("user"),
        }, function (success) {
          if (success.status === 0) {
            that.warnTypeIds = success.result.warnTypeIds;
            that.screening();
          }
        }, function (error) {

        })
      }
    }
  };
</script>

<style scoped lang="less">
  @import '../../style/less/user/alerttype.less';
</style>
