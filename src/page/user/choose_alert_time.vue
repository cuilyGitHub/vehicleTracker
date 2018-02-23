<template>
  <div id="choosealerttime">
    <div class="box">
      <ul>
        <li class="sort">
          <span class="copy">重复</span>
          <span class="right-value" @click='all'>全选</span>
        </li>
        <li v-for="(item,index) in aboutType"  @click="secureCheck(index,$event);">
          <span class="name" v-bind:class="{select: pushTimeList['isPush'+(index+1)]}">{{item}}</span>
        </li>
      </ul>

    </div>
    <div class="box">
        <mt-cell  @click.native="open('start')" title="选择开始时间">
            <span class="des">{{pushTimeList.beginTime}}</span>
        </mt-cell>
        <mt-datetime-picker ref="start"  type="time"  v-model="startValue"
        year-format="{value} 年" month-format="{value} 月"  date-format="{value} 日"  @confirm="start">
        </mt-datetime-picker>
    </div>
    <div class="box">
        <mt-cell @click.native="open('end')" title="选择结束时间">
            <span class="des">{{pushTimeList.endTime}}</span>
        </mt-cell>
        <mt-datetime-picker ref="end"  type="time"  v-model="endValue"
        year-format="{value} 年" month-format="{value} 月"  date-format="{value} 日"  @confirm="end">
        </mt-datetime-picker>
    </div>
  </div>
</template>

<script>
  import {MessageBox} from 'mint-ui';
  import cookieUtil from '../../utils/utils'
  export default {
    name: 'choosealerttime',
    data() {
      return {
        startValue:null,
        endValue:null,
        checkType:false,
        timeGroup:null,
        aboutType:['周一','周二','周三','周四','周五','周六','周天'],
        pushTimeList:[
          {
            "beginTime":"08:10",
            "endTime":  "10:00",
            "isPush1":  0,
            "isPush2":  0,
            "isPush3":  0,
            "isPush4":  0,
            "isPush5":  0,
            "isPush6":  0,
            "isPush7":  0
          },
          {
            "beginTime":"08:10",
            "endTime":  "10:00",
            "isPush1":  0,
            "isPush2":  0,
            "isPush3":  0,
            "isPush4":  0,
            "isPush5":  0,
            "isPush6":  0,
            "isPush7":  0
          },
          {
            "beginTime":"08:10",
            "endTime":  "10:00",
            "isPush1":  0,
            "isPush2":  0,
            "isPush3":  0,
            "isPush4":  0,
            "isPush5":  0,
            "isPush6":  0,
            "isPush7":  0
          },
          {
            "beginTime":"08:10",
            "endTime":  "10:00",
            "isPush1":  0,
            "isPush2":  0,
            "isPush3":  0,
            "isPush4":  0,
            "isPush5":  0,
            "isPush6":  0,
            "isPush7":  0
          },
        ],
        data:{}
      }
    },
    created(){
      let that = this;
      this.timeGroup = this.$route.query.timeGroup;
      console.log(this.timeGroup);
      this.$api.get('/operating/push/pushDevice/client_get_push_setting.do', {
        user: cookieUtil.getCookie("user"),
      }, function (success) {
        if (success.status === 0) {
          //获取成功
          that.data = success.result;
          that.pushTimeList = success.result.pushTimeList[that.timeGroup];
        } else {
          window.alert(success.message)
        }
      }, function (error) {
        console.log(error)
      })
    },
    methods: {
        all(){
          if(this.pushTimeList.isPush1&&this.pushTimeList.isPush2&&this.pushTimeList.isPush3&&this.pushTimeList.isPush4&&this.pushTimeList.isPush5&&this.pushTimeList.isPush6&&this.pushTimeList.isPush7){
            this.removeAlertDays([1,2,3,4,5,6,7]);
          }else {
            this.addAlertDays([1,2,3,4,5,6,7]);
          }
        },
        secureCheck(index,event){
          let weekIndex=index+1;
          if(this.pushTimeList['isPush'+weekIndex] === 0){
            this.addAlertDays([weekIndex]);
          }else {
            this.removeAlertDays([weekIndex]);
          }
        },
        addAlertDays(indexList){
          // this.pushTimeList.pushDes="";
          for(let i=0;i<indexList.length;i++){
            // console.log(indexList[i]);
            switch(indexList[i]) {
              case 1:
                this.pushTimeList.isPush1=1;
                this.pushTimeList.pushDes+="周一 ";
                break;
              case 2:
                this.pushTimeList.isPush2=1;
                this.pushTimeList.pushDes+="周二 ";
                break;
              case 3:
                this.pushTimeList.isPush3=1;
                this.pushTimeList.pushDes+="周三 ";
                break;
              case 4:
                this.pushTimeList.isPush4=1;
                this.pushTimeList.pushDes+="周四 ";
                break;
              case 5:
                this.pushTimeList.isPush5=1;
                this.pushTimeList.pushDes+="周五 ";
                break;
              case 6:
                this.pushTimeList.isPush6=1;
                this.pushTimeList.pushDes+="周六 ";
                break;
              case 7:
                this.pushTimeList.isPush7=1;
                this.pushTimeList.pushDes+="周天 ";
                break;
              default:
                break;
            }
          }
          if(this.pushTimeList.isPush1&&this.pushTimeList.isPush2&&this.pushTimeList.isPush3&&this.pushTimeList.isPush4&&this.pushTimeList.isPush5&&this.pushTimeList.isPush6&&this.pushTimeList.isPush7){
            this.pushTimeList.pushDes="每天"
          }
          this.saveSetting();
        },
        removeAlertDays(indexList){
          if(this.pushTimeList.pushDes=="每天"){
            this.pushTimeList.pushDes="周一 周二 周三 周四 周五 周六 周天 ";
          }
        for(let i=0;i<indexList.length;i++){
          switch(indexList[i]) {
            case 1:
              this.pushTimeList.isPush1=0;
              this.pushTimeList.pushDes=this.pushTimeList.pushDes.replace("周一 ","");
              break;
            case 2:
              this.pushTimeList.isPush2=0;
              this.pushTimeList.pushDes=this.pushTimeList.pushDes.replace("周二 ","");
              break;
            case 3:
              this.pushTimeList.isPush3=0;
              this.pushTimeList.pushDes=this.pushTimeList.pushDes.replace("周三 ","");
              break;
            case 4:
              this.pushTimeList.isPush4=0;
              this.pushTimeList.pushDes=this.pushTimeList.pushDes.replace("周四 ","");
              break;
            case 5:
              this.pushTimeList.isPush5=0;
              this.pushTimeList.pushDes=this.pushTimeList.pushDes.replace("周五 ","");
              break;
            case 6:
              this.pushTimeList.isPush6=0;
              this.pushTimeList.pushDes=this.pushTimeList.pushDes.replace("周六 ","");
              break;
            case 7:
              this.pushTimeList.isPush7=0;
              this.pushTimeList.pushDes=this.pushTimeList.pushDes.replace("周天 ","");
              break;
            default:
              break;
          }
        }
          this.saveSetting();
      },
        open(picker) {
            this.$refs[picker].open();
        },
        start(value) {
          console.log(value);
          this.pushTimeList.beginTime = value;
          this.saveSetting();
        },
        end(value) {
            this.pushTimeList.endTime = value;
            this.saveSetting();
        },
        saveSetting(){
          console.log(this.data.pushTimeList[this.timeGroup]);
          this.data.pushTimeList[this.timeGroup]=this.pushTimeList;
          this.data.user = cookieUtil.getCookie("user");
          this.data.idFromPushService = '';
          console.log(this.data);
          let that = this;
          this.$api.post("/operating/push/pushDevice/client_push_setting.do", that.data,
            function (success) {
            console.log(success);
          },function (error) {
              console.log(error);
          });
        }
    }

  }
</script>

<style scoped lang="less">
  @import '../../style/less/user/choosealerttime.less';
</style>
