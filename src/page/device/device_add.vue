<template>
	<div id="deviceAadd">
		<ul class='add'>
			<li class="li">
				<span class="name">设备编号</span>
				<input class="input" type="text" @keyup.13="show($event)" v-model="serialNo" placeholder="扫码或者手动录入编号">
				<span class="icon" @click="firstScanQRCode"></span>
			</li>
			<li class="li">
				<span class="name">设备型号</span>
				<input class="input" type="text" v-model="deviceModel" placeholder="自动识别">
			</li>
			<li class="li">
				<span class="name">通讯号</span>
				<input class="input" type="text" v-model="phone" placeholder="自动识别">
			</li>
			<li class="li">
				<span class="name">开通时间</span>
				<input class="input" type="text" v-model="startTime" placeholder="初次识别当前时间">
			</li>
			<li class="li">
				<span class="name">到期时间</span>
				<input class="input" type="text" v-model="endTime" placeholder="自动识别">
			</li>
			<li class="li" v-if="bindThing ==='绑定物品' || bindThing === null" @click="jump()">
				<span class="name">绑定物品</span>
				<span class="right-arrow"></span>
				<span class="goods">{{bindThing}}</span>
			</li>
			<li v-if="bindThing!='绑定物品' && bindThing!=null " class="li" @click="jump()">
				<span class="name">绑定物品</span>
				<span class="right-arrow"></span>
				<span class="goods">{{bindThing}}</span>
			</li>
		</ul>
		<div class="grey-btn" v-bind:class="{'blue-btn':blueBtn}" @click="addUserDevice();">确认绑定设备到用户</div>
		<div class="grey-btn" v-bind:class="{'blue-btn':blueBtn}" @click="scanQRCode">继续扫码添加绑定设备</div>
		<div class="grey-btn" v-bind:class="{'blue-btn':blueBtn}"@click="continueToAdd();">继续添加绑定设备</div>
	</div>

</template>
<script>
	var _wx = require('weixin-js-sdk');
	import { formatDate } from '../../utils/filters.js';
	import cookieUtil from '../../utils/utils';
	import { MessageBox,Toast } from 'mint-ui';
	import deviceData from '../../utils/public_value'
	//import _wx from 'weixin-js-sdk'

	export default {
		name: 'deviceAadd',
		data() {
			return {
				wx:_wx,
				serialNo: null,
				deviceModel: null,
				phone: null,
				startTime: null,
				endTime: null,
				bindThing: null,
        blueBtn:false,
        routeFrom:this.$route.query.routeFrom
			};
		},
		created() {
      this.wechatConfig(_wx);
      if(this.$route.query.serialNo){
        this.serialNo = this.$route.query.serialNo;
        this.getDeviceInfoBySerialNo();
        this.blueBtn = true;
      }
      let deviceAddInfo = sessionStorage.getItem('deviceAddInfo');
      if(deviceAddInfo){
        deviceAddInfo = JSON.parse(deviceAddInfo)
        this.serialNo = deviceAddInfo.serialNo;
        this.phone = deviceAddInfo.phone;
        this.startTime = this.formatDate(deviceAddInfo.createTime);
        this.endTime = this.formatDate(deviceAddInfo.expireAt);
        this.deviceModel = deviceAddInfo.deviceType;
        this.number = deviceAddInfo.number;
        deviceAddInfo.carName ? that.bindThing = deviceAddInfo.carName : this.bindThing = '绑定物品';
        //,0-未激活,1-使用,2-损坏
        this.blueBtn = true;
        this.$forceUpdate();
      }
		},
		activated: function() {
			deviceData.deviceData.isBack = false;
		},
    deactivated(){
      this.$destroy(true);
    },
		methods: {
			wxReady() {
				// 检测客户端版本是否支持所用API
				this.wx.checkJsApi({
					jsApiList: ['scanQRCode'],
					success: function(res) {
						if(!res.checkResult.scanQRCode){
							alert("当前版本不支持扫一扫")
						}
					}
				});
			},
			wxError(err) {
				// config信息验证失败会执行error函数
			},
      //扫码添加
      firstScanQRCode(){
        let _self = this;
        _self.wx.scanQRCode({
          needResult: 1,
          desc: 'scanQRCode desc',
          success: function(res) {
            if(res.resultStr.indexOf('CODE_')>-1){
              _self.serialNo = res.resultStr.split(',')[1];
            }else {
              _self.serialNo = res.resultStr;
            }
            _self.getDeviceInfoBySerialNo();
          },
          error: function(res){
            if(res.errMsg.indexOf('function_not_exist') > 0){
              MessageBox.alert('版本过低请升级', '提示');
            }
          }
        });
      },
			// 继续扫码添加
			scanQRCode() {
        if(!this.blueBtn){
          return;
        }
				let _self = this;
        this.$api.post("/device/device/clientAddUserDevice.do", {
          user: cookieUtil.getCookie("user"),
          serialNo: this.serialNo
        }, function(success) {
          if(success.status !== 0){
            MessageBox.alert(success.message, '提示');
            return;
          }
          Toast({
            message: '添加成功',
            position: 'bottom',
          });
          setTimeout(function () {
            _self.phone = null;
            _self.startTime = null;
            _self.serialNo = null;
            _self.deviceModel = null;
            _self.endTime = null;
            _self.bindThing = null;
            _self.blueBtn = false;
            _self.wx.scanQRCode({
              needResult: 1,
              desc: 'scanQRCode desc',
              success: function(res) {
                if(res.resultStr.indexOf('CODE_')>-1){
                  _self.serialNo = res.resultStr.split(',')[1];
                }else {
                  _self.serialNo = res.resultStr;
                }
                _self.getDeviceInfoBySerialNo();
              },
              error: function(res){
                if(res.errMsg.indexOf('function_not_exist') > 0){
                  MessageBox.alert('版本过低请升级', '提示');
                }
              }
            });
          },1500)
        }, function(error) {
          console.log(error);
        })
			},
			wechatConfig(wx) {
				this.$api.get("/weixin/getSignature", {}, function(data) {
					wx.config({
						debug: false, // 调试模式是否开启
						appId: data.appId, // 必填，公众号的唯一标识
						timestamp: data.timestamp, // 必填，生成签名的时间戳
						nonceStr: data.noncestr, // 必填，生成签名的随机串
						signature: data.signature, // 必填，签名，见附录1
						// 必填，需要使用的JS接口列表
						jsApiList: [
									'checkJsApi',// 用于检测客户端版本是否支持所用API的API
									'scanQRCode' // 扫描二维码的API
									]
					});
				}, function(err) {
					console.log(err);
				});

				wx.ready(this.wxReady);
				wx.error(this.wxError);
			},
			//        TODO 添加用户设备
			addUserDevice() {
			  if(!this.blueBtn){
			    return;
        }
				let that = this;
				this.$api.post("/device/device/clientAddUserDevice.do", {
					user: cookieUtil.getCookie("user"),
					serialNo: that.serialNo
				}, function(success) {
          console.log(that.routeFrom);
					if(success.status !== 0){
            MessageBox.alert(success.message, '提示');
					}else{
            Toast({
              message: '添加成功',
              position: 'bottom',
            });
            if(that.routeFrom === 'devicemanager'){
              that.$router.push({ path: '/devicemanager',query:{reload:true} });
            }else{
              that.$router.push({ path: '/devicelist' });
            }
					}
					console.log(success);
				}, function(error) {
					console.log(error);
				})
			},
			//获取设备信息
			getDeviceInfoBySerialNo() {
				let that = this;
				this.$api.get('/device/device/clientGetDetailInfo.do', {
					serialNo: this.serialNo
				}, function(success) {
					if(success.status === 0) {
					  sessionStorage.setItem('deviceAddInfo',JSON.stringify(success.result));
						that.phone = success.result.phone;
						that.startTime = that.formatDate(success.result.createTime);
						that.endTime = that.formatDate(success.result.expireAt);
						that.deviceModel = success.result.deviceType;
						that.number = success.result.number;
						success.result.carName ? that.bindThing = success.result.carName : that.bindThing = '绑定物品';
            //,0-未激活,1-使用,2-损坏
            that.blueBtn = true;
            that.$forceUpdate();
					} else {
						MessageBox.alert(success.message, '提示');
					}
				}, function(error) {
					console.log(error);
				})
			},
			//继续添加
			continueToAdd() {
        if(!this.blueBtn){
          return;
        }
        let that = this;
        this.$api.post("/device/device/clientAddUserDevice.do", {
          user: cookieUtil.getCookie("user"),
          serialNo: that.serialNo
        }, function(success) {
          console.log(that.routeFrom);
          if(success.status !== 0){
            console.log(success);
            MessageBox.alert(success.message, '提示');
          }else{
            Toast({
              message: '添加成功',
              position: 'bottom',
            })
            that.phone = null;
            that.startTime = null;
            that.serialNo = null;
            that.deviceModel = null;
            that.endTime = null;
            that.bindThing = null;
            that.blueBtn = false;
          }
          console.log(success);
        }, function(error) {
          console.log(error);
        })
			},
			show(event) {
				if(event.which === 13) {
					this.getDeviceInfoBySerialNo();
				}
			},
			formatDate(time) {
				var date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd');
			},
			jump() { //跳转前进行判断

				if(!this.serialNo) {
					MessageBox.alert('请输入设备编号', '提示');
					return
				}
				if(this.bindThing != '绑定物品' && this.bindThing != null) {
					this.$router.push({
						path: '/newbind',
						query: {
              serialNo:this.serialNo,
							number: this.number,
              route:'deviceadd'
						}
					})
          return;
				}
				if(this.bindThing === '绑定物品' || this.bindThing === null) {
					this.$router.push({
            path: '/editdevicebind',
            query: {
              serialNo: this.serialNo,
            }
          })
				}
			}
		}
	};
</script>
<style scoped lang='less'>
	@import '../../style/less/device/device_add.less';
</style>
