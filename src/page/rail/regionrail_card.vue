<template>
  <div id='railcard' class="edit-panel">
    <div class="input-panel">
      <input type="text" placeholder="围栏名称" v-model="cardData.name">
    </div>
    <p class="pwd-des">最多10个字的围栏名称</p>
    <mt-cell title="入栏报警">
      <mt-switch class="switch" v-model="cardData.isIn" @change="intoChange"></mt-switch>
    </mt-cell>
    <mt-cell title="出栏报警">
      <mt-switch class="switch" v-model="cardData.isOut" @change="outChange"></mt-switch>
    </mt-cell>
    <mt-cell title="区域围栏有效期"></mt-cell>
    <mt-cell @click.native="open('start')" title="开始时间" is-link>
      <span class="des">{{cardData.beginTime}}</span>
    </mt-cell>
    <mt-cell @click.native="open('end')" title="结束时间" is-link>
      <span class="des">{{cardData.endTime}}</span>
    </mt-cell>

    <mt-datetime-picker ref="start" type="date" v-model="startTime"
                        year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="start">
    </mt-datetime-picker>
    <mt-datetime-picker ref="end" type="date" v-model="endTime"
                        year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="end">
    </mt-datetime-picker>

    <mt-cell @click.native="regionChoose" title="区域" is-link>
      <span class="des">{{cardData.districtName}}</span>
    </mt-cell>
    <div class="push">
      <div v-if="$route.params.id === 'new'" class="blue-btn" @click="add()">保存</div>
      <div v-if="$route.params.id === 'update'" class="blue-btn" @click="update()">保存</div>
    </div>
  </div>
</template>
<script>
  import {formatDate} from '../../utils/filters.js';
  import cookieUtil from '../../utils/utils';
  import {MessageBox} from 'mint-ui';
  export default{
    name: 'railcard',
    data(){
      return {
        cardData:{
          name:null,
          isIn:null,
          isOut:null,
          beginTime:null,
          endTime:null,
          districtCode:null,
          districtName:null,
        },
        value: null,
        startTime: new Date(),
        endTime: new Date()
      }
    },
    created(){
      this.getData();
    },
    mounted(){

    },
    methods: {
      open(picker) {
        this.$refs[picker].open();
      },
      start(value) {
        this.cardData.beginTime = formatDate(value,'yyyy/MM/dd');
      },
      end(value) {
        this.cardData.endTime = formatDate(value,'yyyy/MM/dd');
      },
      outChange(event){
        this.cardData.isOut = !event;
      },
      intoChange(event){
        this.cardData.isIn = !event;
      },
      getData(){
        //更改title
        var params = this.$route.params.id;
        if (params != 'new') {
          this.$route.meta.title = '区域围栏编辑';
        } else {
          this.$route.meta.title = '新增区域围栏';
        }
        if(sessionStorage.getItem('regionrailCardData')){
          this.cardData = JSON.parse(sessionStorage.getItem('regionrailCardData'));
          if(this.cardData.isIn === 1){
            this.cardData.isIn = true;
          }else if(this.cardData.isIn === 2){
            this.cardData.isIn = false;
          }
          if(this.cardData.isOut === 1){
            this.cardData.isOut = true;
          }else if(this.cardData.isOut === 2){
            this.cardData.isOut = false;
          }
        }
      },
      add(){
        if(!this.cardData.name){
          MessageBox.alert('请输入围栏名称','提示');
          return;
        }
        if(!this.cardData.beginTime){
          MessageBox.alert('请选择开始时间','提示');
          return;
        }
        if(!this.cardData.endTime){
          MessageBox.alert('请选择结束时间','提示');
          return;
        }
        if(!this.cardData.districtCode){
          MessageBox.alert('请选择结区域','提示');
          return;
        }
        let that = this;
        this.$api.post("/rail/rail/clientAddDistrictRail.do", {
          user:cookieUtil.getCookie("user"),
          serialNo: this.$route.query.serialNo,
          name:this.cardData.name,
          isIn:this.cardData.isIn===true?1:2,
          isOut:this.cardData.isOut===true?1:2,
          beginTime:this.cardData.beginTime,
          endTime:this.cardData.endTime,
          districtCode: this.cardData.districtCode
        }, function (success) {
          if(success.status === 0){
            that.$router.push({path:'/regionrail',query:{serialNo:that.$route.query.serialNo}})
          }else {
            MessageBox.alert(success.message,'提示');
          }
        }, function (error) {

        })
      },
      update(){
        let that = this;
        this.$api.post("/rail/rail/clientUpdateDistrictRail.do", {
          user:cookieUtil.getCookie("user"),
          id:this.cardData.id,
          name:this.cardData.name,
          isIn:this.cardData.isIn===true?1:2,
          isOut:this.cardData.isOut===true?1:2,
          beginTime:this.cardData.beginTime,
          endTime:this.cardData.endTime,
          districtCode: this.cardData.districtCode
        }, function (success) {
          if(success.status === 0){
            that.$router.push({path:'/regionrail',query:{serialNo:that.$route.query.serialNo}})
          }else {
            MessageBox.alert(success.message,'提示');
          }
        }, function (error) {

        })
      },
      regionChoose(){
        sessionStorage.setItem('regionrailCardData',JSON.stringify(this.cardData),7);
        this.$router.push({path:'/chooseregion',query:{id:this.$route.params.id,serialNo:this.$route.query.serialNo}});
      }
    },
    filters: {
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy年MM月dd日');
      }
    }
  }
</script>
<style scoped lang='less'>
  @import '../../style/less/rail/regionrailcard.less';
</style>
