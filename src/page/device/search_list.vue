<template>
    <div>
        <div class="search">
            <input class="input" type="text" v-model="keyWord" placeholder="设备编号、绑定物名字、通讯号" @keyup.13="search(keyWord)"/>
            <span class="search-icon" @click="search(keyWord)"></span>
        </div>
        <p class="des">搜索历史</p>
        <ul class="results" v-if="$route.params.fromPage === 'list'">
            <li :key="index" v-for="(item,index) in resultList" @click="goList(item)">
              <span class="name">{{item.fieldName}}</span>
              <span v-if="item.fieldType === 1" class="right-value">标签</span>
              <span v-if="item.fieldType === 2" class="right-value">设备通信号</span>
              <span v-if="item.fieldType === 3" class="right-value">绑定物名称</span>
              <span v-if="item.fieldType === 4" class="right-value">设备序列号</span>
            </li>
        </ul>
        <ul class="results" v-if="$route.params.fromPage === 'manager'">
            <li :key="index" v-for="(item,index) in resultList" @click="goManager(item)">
              <span class="name">{{item.fieldName}}</span>
              <span v-if="item.fieldType === 1" class="right-value">标签</span>
              <span v-if="item.fieldType === 2" class="right-value">设备通信号</span>
              <span v-if="item.fieldType === 3" class="right-value">绑定物名称</span>
              <span v-if="item.fieldType === 4" class="right-value">设备序列号</span>
            </li>
        </ul>
        <div class='white-bottom-btn' @click="clearResults">清空搜索历史</div>
    </div>
</template>
<script>
  import { MessageBox } from 'mint-ui';
  import cookieUtil from '../../utils/utils'
  export default {
    data() {
      return {
          keyWord:null, //关键字
          resultList:[], //显示列表
          historyList:[], //存储本地数据，必须是json格式
          requestParams:{ //请求参数
            user: cookieUtil.getCookie("user"),
            keywords:'1997',
            pageSize:10,
            pageNum:1
          }
      };
    },
    created() {

    },
    watch: {
      '$route' (to, from) {
        console.log(this.getStatus(this.$route.path))
      }
    },
    mounted() {
      if(sessionStorage.getItem("history")){
        let str = '['+sessionStorage.getItem("history")+']';
        this.resultList = JSON.parse(str);
        this.historyList.push(sessionStorage.getItem("history"));
      }
    },
    deactivated(){
      this.$destroy(true);
    },
    methods: {
        openAlert(content) {
          MessageBox.alert(content, '提示');
        },
        search(){
          let that = this;
          that.requestParams.keywords = that.keyWord;
          this.$api.get("/device/device/clientQueryDeviceByKeyword.do",{
            user:that.requestParams.user,
            keywords:that.requestParams.keywords,
            pageSize:that.requestParams.pageSize,
            pageNum:that.requestParams.pageNum
          },function (data) {
            if(data.status === 0){
              console.log(data);
              if(data.result.totalNum === 0){
                that.openAlert('暂无记录');
                this.resultList = [];
                return;
              }
              that.resultList = data.result.list;
              console.log(that.resultList);
            }else {
              this.openAlert(data.message);
            }
          },function (failure) {

          })
        },
        clearResults(){
            MessageBox.confirm('确定删除历史记录').then(action => {
              this.resultList = [];
              this.historyList = [];
              sessionStorage.removeItem('history');
            }).catch(()=>
            {

            });
        },
        setHistory(data){
          let str = JSON.stringify(data);
          if(this.historyList.length === 0 || this.historyList[0].indexOf(str) === -1){
            //
            if(this.historyList.length === 1){
              var ary = JSON.parse('['+this.historyList[0]+']');
              if(ary.length >= 10){
                ary.splice(ary.length - 1,1);
                ary.forEach(function (item, index) {
                  let itemStr = JSON.stringify(item);
                  ary.splice(index,1,itemStr);
                })
                this.historyList = ary;
              }

            }
            this.historyList.unshift(str);
          }else {
            var ary = JSON.parse('['+this.historyList[0]+']');
            ary.forEach(function (item, index) {
              if(item.fieldId === data.fieldId && item.fieldType === data.fieldType){
                ary.splice(index,1);
                ary.unshift(str);
              }else {
                let itemStr = JSON.stringify(item);
                ary.splice(index,1,itemStr);
              }
            })
            this.historyList = ary;
          }
          sessionStorage.setItem('history',this.historyList,7);
        },
        goManager(data){
          this.setHistory(data);
          this.$router.push({name:'devicemanager',params:{data:data}})
        },
        goList(data){
          this.setHistory(data);
          if(data.fieldType === 1){
            this.$router.push({name:'devicelist',params:{data : data}})
          }else {
            this.$router.push({name:'index',params:{serialNo : data.fieldId}})
          }
        }
    }
  }
</script>
<style scoped lang='less'>
  @import '../../style/less/device/search_list.less';
</style>




