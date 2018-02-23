<template>
    <div id='rail'>
        <!--<Loading></Loading>-->
        <div class="dashed-btn" @click="addRail">
          <span>+</span>
          <span>新增</span>
        </div>
        <ul class="rail">
            <li class="card" v-for='item in dataList'>
                <div class="head">
                    <div class="name">{{item.name}}</div>
                    <span class="del" @click="delRail(item.id)"></span>
                    <span class="secure gps" @click="goDrawRail(item)"></span>
                </div>
                <div class="panel" @click="edit(item)">
                    <div class="left-box">
                        <div class="li">
                            <span class="title">围栏大小:</span>
                            <span>半径{{item.radius/1000}}KM的圆形围栏</span>
                        </div>
                        <div class="li">
                            <span class="title">围栏有效期:</span>
                            <span>{{item.beginTime}}</span>
                            <span>-</span>
                            <span>{{item.endTime}}</span>
                        </div>
                        <div class="li">
                            <span class="title">报警设置:</span>
                            <span :class="{'in':item.isIn === 1}">驶入报警</span>
                            <span :class="{'in':item.isOut === 1}">驶出报警</span>
                        </div>
                    </div>
                    <div class="right-box"></div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    import {MessageBox} from 'mint-ui';
    import cookieUtil from '../../utils/utils'
    export default{
        name:'rail',
        data(){
            return{
                requestParams:{
                  user:cookieUtil.getCookie("user"),
                  serialNo:this.$route.query.serialNo,
                  pageSize:99999,
                  pageNum:1
                },
                dataList:[],
                items:8
            }
        },
        beforeRouteLeave(to, from, next) {
          if(this.$route.query.routeForm && this.$route.query.routeForm === 'deviceManager'){
            next();
            return;
          }
          // 设置下一个路由的 meta
          to.meta.keepAlive = false;  // 让 railcard 不缓存，即刷新
          cookieUtil.delCookie('railCardData');
          next();
        },
        created(){
          this.getRail();
          cookieUtil.delCookie('addName');
          cookieUtil.delCookie('addLat');
          cookieUtil.delCookie('addLng');
          cookieUtil.delCookie('addRadius');
          cookieUtil.delCookie('addStartTime');
          cookieUtil.delCookie('addEndTime');
          cookieUtil.delCookie('addIsIn');
          cookieUtil.delCookie('addIsOut');
        },
        deactivated(){
          this.$destroy(true);
        },
        methods:{
            openAlert(des) {
                MessageBox.alert(des,'提示');
            },
            delCookie(){
              cookieUtil.delCookie('railCardData');
              cookieUtil.delCookie('lat');
              cookieUtil.delCookie('lng');
              cookieUtil.delCookie('radius');
            },
            goDrawRail(data){
              console.log(data);
              this.delCookie();
              this.$router.push({path:'drawrail',query:{serialNo:this.requestParams.serialNo  , enterType:1 , radius:data.radius , railId:data.id}});
              cookieUtil.setCookie('railCardData',JSON.stringify(data),7);
            },
            edit(data){
                this.delCookie();
                this.$router.push({path:'/railcard/update',query:{serialNo:this.requestParams.serialNo , dataJson :JSON.stringify(data) ,lng : this.$route.query.lng , lat : this.$route.query.lat}});
                cookieUtil.setCookie('railCardData',JSON.stringify(data),7);
            },
            getRail(){
              let that = this;
              this.$api.get("/rail/rail/clientListCircleRail.do", {
                user: this.requestParams.user,
                serialNo: this.requestParams.serialNo,
                pageSize: this.requestParams.pageSize,
                pageNum: this.requestParams.pageNum,
              }, function (success) {
                if (success.status === 0) {
                  that.dataList = success.result.list;
                } else {
                  //请求失败
                  that.openAlert(success.message);
                }
              }, function (error) {

              })
            },
            delRail(id){
              MessageBox.confirm('确定删除围栏吗?').then(action => {
                let that = this;
                this.$api.post("/rail/rail/clientDelRail.do", {
                  user: this.requestParams.user,
                  serialNo: this.requestParams.serialNo,
                  id:id
                }, function (success) {
                  console.log(success);
                  if (success.status === 0) {
                    that.getRail();
                  } else {
                    that.openAlert(success.message);
                  }
                }, function (error) {

                })
              },err=>{

              });
            },
            addRail(){
              this.delCookie();
              console.log(this.$route.query.lng);
              this.$router.push({path:'/railcard/new',query:{serialNo :this.requestParams.serialNo ,lng : this.$route.query.lng , lat : this.$route.query.lat}})
            }
        }
    }
</script>
<style scoped lang='less'>
  @import '../../style/less/rail/rail.less';
</style>
