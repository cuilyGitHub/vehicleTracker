<template>
  <div id="monitoring">
    <div class="dayly-info">
      <mt-swipe :auto="0" class="a" @change="swipeLineChart">
        <mt-swipe-item>
          <div class="info">
            <div class="today normal">
              <span class="num">{{monitorData.normalDevice}}</span>
              <mt-badge type="success">今日正常</mt-badge>
            </div>
            <div class="devs-num" @click="tomanager">
              <span>{{monitorData.totalDevice}}</span>
              设备总量
            </div>
            <div class="today abnormal">
              <span class="num">{{monitorData.abnormalDevice}}</span>
              <mt-badge type="error">今日异常</mt-badge>
            </div>
          </div>
        </mt-swipe-item>
        <mt-swipe-item>
          <div class="cv-container">
            <div class="cv-title">七日报警趋势</div>
            <canvas class="linechart" ref="linechart"  >该浏览器不支持canvas</canvas>
          </div>
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <div class="billboard weekly-alert">
      <div class="title">
        本周报警统计
      </div>
      <div class="items">
        <div class="amount">
          <div class="icon"><img src="../../../static/image/monitor-1.png" alt=""></div>
          <div class="kind"><b>报警总数量</b><br>{{monitorData.weeklyReport.warnType}}</div>
          <div class="num">{{monitorData.weeklyReport.warnCount}}</div>
        </div>
        <div class="amount">
          <div class="icon"><img src="../../../static/image/monitor-2.png" alt=""></div>
          <div class="kind"><b>报警设备</b><br><span>{{monitorData.weeklyReport.serialNo}}-{{monitorData.weeklyReport.carNumber}}</span></div>
          <div class="num">{{monitorData.weeklyReport.serialCount}}</div>
        </div>
      </div>
    </div>
    <div class="billboard monthly-alert">
      <div class="title">
        本月报警统计
      </div>
      <div class="items">
        <div class="amount">
          <div class="icon"><img src="../../../static/image/monitor-1.png" alt=""></div>
          <div class="kind"><b>报警总数量</b><br>{{monitorData.monthlyReport.warnType}}</div>
          <div class="num">{{monitorData.monthlyReport.warnCount}}</div>
        </div>
        <div class="amount">
          <div class="icon"><img src="../../../static/image/monitor-2.png" alt=""></div>
          <div class="kind"><b>报警设备</b><br><span>{{monitorData.monthlyReport.serialNo}}-{{monitorData.monthlyReport.carNumber}}</span></div>
          <div class="num">{{monitorData.monthlyReport.serialCount}}</div>
        </div>
      </div>
    </div>
    <div class="billboard month-billboard">
      <div class="title">
        月度榜单
      </div>
      <div class="lists">
        <div class="list">
          <div class="alert-type icon">
            <img src="../../../static/image/alerttype.png" alt="">
          </div>
          <div class="rank">
            <ul >
              <li>1、<span class="name">{{monitorData.topMonthly._$1stWarnType}}</span><span class="data">{{monitorData.topMonthly._$1stWarnCount}}</span></li>
              <li>2、<span class="name">{{monitorData.topMonthly._$2ndWarnType}}</span><span class="data">{{monitorData.topMonthly._$2ndWarnCount}}</span></li>
              <li>3、<span class="name">{{monitorData.topMonthly._$3rdWarnType}}</span><span class="data">{{monitorData.topMonthly._$3rdWarnCount}}</span></li>
            </ul>
          </div>
        </div>
        <div class="list">
          <div class="alert-dev icon">
            <img src="../../../static/image/devicealert.png" alt="">
          </div>
          <div class="rank">
            <ul>
              <li>1、<span class="name">{{monitorData.topMonthly._$1stSerialNo}}-{{monitorData.topMonthly._$1stCarNumber}}</span></li>
              <li>2、<span class="name">{{monitorData.topMonthly._$2ndSerialNo}}-{{monitorData.topMonthly._$2ndCarNumber}}</span></li>
              <li>3、<span class="name">{{monitorData.topMonthly._$3rdSerialNo}}-{{monitorData.topMonthly._$3rdCarNumber}}</span></li>
            </ul>
          </div>
        </div>
        <div class="list">
          <div class="manager-dev icon">
            <img src="../../../static/image/managerdevice.png" alt="">
          </div>
          <div class="rank">
            <ul>
              <li>1、<span class="name">{{monitorData.topMonthly._$1stUserName}}</span><span class="data">{{monitorData.topMonthly._$1stUserCount}}</span></li>
              <li>2、<span class="name">{{monitorData.topMonthly._$2ndUserName}}</span><span class="data">{{monitorData.topMonthly._$2ndUserCount}}</span></li>
              <li>3、<span class="name">{{monitorData.topMonthly._$3rdUserName}}</span><span class="data">{{monitorData.topMonthly._$3rdUserCount}}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <bottom-tab></bottom-tab>
  </div>
</template>
<script>
  import cookieUtil from '../../utils/utils'
  import {formatDate} from '../../utils/filters.js';
  export default{
    name: 'monitoring',
    data(){
      return {
        /* isSuccess:true,*/
        src: "",
        userInfo: {},
        status: 0,
        message: "ok",
        monitorData:{},
        file:null
      }
    },
    created(){
      this.getMonitorData();
    },
    mounted(){
      let cv=this.$refs.linechart;
    },
    methods: {
      tomanager(){
        this.$router.push({ path: '/devicemanager' })
      },
      getMonitorData(){
        let gThis = this;
        this.$api.get("/user/client_get_monitor_info.do",{
          user: cookieUtil.getCookie("user")
        },function (data) {
          console.log(data);
          if(data.status === 0){
            console.log(data);
            gThis.monitorData = data.result;
            gthis.$emit("drawlinechart");
          }
        },function (failure) {
        })
      },
      swipeLineChart(){
        let gthis=this;
        let normalDevice = [];
        let abnormalDevice = [];
        let maxInArray = 140;//正常和异常数据中的最大值，默认140
        if(gthis.monitorData.lastSevenDay){
          let data = gthis.monitorData.lastSevenDay;
          console.log(data);
          let ordinal=["first","second","third","fourth","fifth","sixth","seventh"];
          //循环请求到的数据，并按时间顺序放入数组
          for(let i=0;i<ordinal.length;i++){
            let n_key=ordinal[i]+"NormalDevice";
            let a_key=ordinal[i]+"AbnormalDevice";
            normalDevice.push(data[n_key]);
            abnormalDevice.push(data[a_key]);
            n_key="";
            a_key="";
          }
          let maxInNor = Math.max.apply(null,normalDevice);
          let maxInAbnor = Math.max.apply(null,abnormalDevice);
          maxInArray = Math.max.apply(null,[maxInNor,maxInAbnor]);
        }
        //绘制正常数据折线
        gthis.drawLineChart(normalDevice,maxInArray,"#00722e");
        //绘制异常数据折线
        gthis.drawLineChart(abnormalDevice,maxInArray,"#FF0000");
      },
      drawLineChart(data,maxInArray,color){
        let gthis=this;
        let cv = gthis.$refs.linechart;
        let ctx = cv.getContext("2d");
        let y_axis = 140;//Y轴长度
        let x_axis = 300;//X轴长度
        let maxCoo=Math.ceil(maxInArray/20)*20;//Y轴坐标最大值
        let y_interval = 20;//Y轴坐标值间隔
        let x_interval = 40;//X轴坐标值间隔
        let x_indent = 40;//X轴缩进
        let y_indent = 20;//Y轴缩进
        let y_coefficient = maxCoo/y_interval;//Y轴系数
        ctx.lineJoin="round";
        ctx.lineWidth=1;
        ctx.lineCap="round";
        ctx.font="10px Arial";
        //绘制边框和坐标
        for(let y=1,i=0;y<=maxCoo+1;y=y+y_interval,i++){
          ctx.textAlign="right";
          ctx.beginPath();
          ctx.strokeStyle = "#ebebeb";
          //画出背景线
          ctx.moveTo(y_indent, y_axis / y_coefficient * i);
          ctx.lineTo(x_axis, y_axis / y_coefficient * i);
          //标注部分纵坐标值
          if(i===0){
            ctx.fillText(maxCoo - Math.round(maxCoo / y_coefficient * i), y_indent, y_axis / y_coefficient * i + 8);
          }else if (i === Math.ceil(y_coefficient / 2)||i === Math.ceil(y_coefficient / 4) ||i === Math.ceil(y_coefficient / 4*3)||i===y_coefficient) {
            ctx.fillText(maxCoo - Math.round(maxCoo / y_coefficient * i), y_indent, y_axis / y_coefficient * i + 4);
          }
          ctx.closePath();
          ctx.stroke();
        }

        //绘制折线
        for (let i = 0;i < data.length-1;i ++){
//          console.log(data[i]);
          //起始坐标
          let numsY = y_axis-data[i]/maxCoo*y_axis;
          let numsX = i*x_interval+x_indent;
          //终止坐标
          let numsNY = y_axis-data[i+1]/maxCoo*y_axis;
          let numsNX = (i+1)*x_interval+x_indent;
          ctx.beginPath();
          ctx.moveTo(numsX,numsY);
          ctx.lineTo(numsNX,numsNY);
          ctx.strokeStyle = color;
          ctx.closePath();
          ctx.stroke();
        }
        //绘制数据点、数据
        for (let i=0;i<data.length;i++) {
          let x = i*x_interval+x_indent;
          let y = y_axis-data[i]/maxCoo*y_axis;
          ctx.beginPath();
          ctx.fillStyle = "#555555";
          ctx.arc(x, y, 1, 0, 2*Math.PI);//画点
          ctx.fill();
          ctx.fillText(data[i], x + 3, y - 5);
        }
        let myDate = new Date();
        let today_month= myDate.getMonth() + 1;
        let today_date= myDate.getDate();
        //绘制坐标值
        for(let i=0;i<7;i++){
          myDate.setDate(today_date-(6-i));
          let date = today_month+"-"+myDate.getDate();
          ctx.beginPath();
          //绘制横坐标值
          ctx.textAlign="center";
          ctx.fillText(date,x_indent+i*x_interval,y_axis+10);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }
</script>
<style scoped lang='less'>
  @import '../../style/less/statistics/monitoring.less';
</style>
