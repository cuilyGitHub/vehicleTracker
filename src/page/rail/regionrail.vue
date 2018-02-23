<template>
    <div id='rail'>
        <div class="dashed-btn" @click="addRegionrail">
          <span>+</span>
          <span>新增</span>
        </div>
        <ul class="rail">
            <li class="card" v-for='item in dataList'>
                <div class="head">
                    <div class="name">{{item.name}}</div>
                    <span class="del" @click="del(item.id)"></span>
                </div>
                <div class="panel" @click="edit(item)">
                    <div class="left-box">
                        <div class="li">
                            <span class="title">围栏范围:</span>
                            <span>{{item.districtName}}</span>
                        </div>
                        <div class="li">
                            <span class="title">围栏有效期:</span>
                            <span>{{item.beginTime}}</span>
                            <span>-</span>
                            <span>{{item.endTime}}</span>
                        </div>
                        <div class="li">
                            <span class="title">报警设置:</span>
                            <span class="in" :class="{'policed':item.isIn === 1}">驶入报警</span>
                            <span class="out" :class="{'policed':item.isOut === 1}">驶出报警</span>
                        </div>
                    </div>
                    <div class="right-box"></div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    import { MessageBox } from 'mint-ui';
    import cookieUtil from '../../utils/utils';
    export default{
        name:'rail',
        data(){
            return{
              dataList:[],
              requestParams:{
                user:cookieUtil.getCookie("user"),
                serialNo:this.$route.query.serialNo,
                pageSize:0,
                pageNum:1
              },
            }
        },
        created(){
          this.getRegionrail();
        },
        methods:{
            addRegionrail(){
              sessionStorage.removeItem('regionrailCardData');
              this.$router.push({path:'/regionrailcard/new',query:{serialNo :this.requestParams.serialNo}})
            },
            getRegionrail(){
              let that = this;
              this.$api.get("/rail/rail/clientListDistrictRail.do", {
                user: this.requestParams.user,
                serialNo: this.requestParams.serialNo,
                pageSize: this.requestParams.pageSize,
                pageNum: this.requestParams.pageNum,
              }, function (success) {
                if (success.status === 0) {
                  that.dataList = success.result.list;
                  console.log(success);
                } else {
                  //请求失败
                  that.openAlert(success.message);
                }
              }, function (error) {

              })
            },
            del(id) {
              MessageBox.confirm('确定删除围栏吗?').then(action => {
                let that = this;
                this.$api.post("/rail/rail/clientDelRail.do", {
                  user: this.requestParams.user,
                  serialNo: this.requestParams.serialNo,
                  id:id
                }, function (success) {
                  console.log(success);
                  if (success.status === 0) {
                    that.getRegionrail();
                  } else {
                    that.openAlert(success.message);
                  }
                }, function (error) {

                })
              },err=>{

              });
            },
            edit(data){
              sessionStorage.setItem('regionrailCardData',JSON.stringify(data),7);
              this.$router.push({path:'/regionrailcard/update',query:{serialNo:this.requestParams.serialNo}});
            }
        }
    }
</script>
<style scoped lang='less'>
  @import '../../style/less/rail/regionrail.less';

</style>
