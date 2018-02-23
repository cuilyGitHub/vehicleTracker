// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

// 引用API文件
import api from './api/index.js'
Vue.prototype.$api = api // 将API方法绑定到全局


//引入项目配置文件
/*import utils from './config/index.js';
Vue.prototype.$utils = utils.utils;*/


//更改单页应用title
import VueWechatTitle from 'vue-wechat-title';
Vue.use(VueWechatTitle);

//引入element-ui
import { Upload } from 'element-ui'
Vue.use(Upload);

// 引入mint-ui
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'
Vue.use(Mint);


//loading
import Loading from './compontents/loading'
Vue.use(Loading);

import bottomTab from './compontents/bottomTab'
Vue.use(bottomTab);

Vue.config.productionTip = true;//开启错误提示
//Vue.config.productionTip = false;

/*
(function(){
  var docEl = document.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      if(clientWidth>750){
        clientWidth=750;//这里限制最大的宽度尺寸，从而实现PC端的两边留白等
      } else {
        docEl.style.fontSize = parseInt(10 * (clientWidth / 320)) + 'px';
      }
    };
  if (!document.addEventListener) return;
  window.addEventListener(resizeEvt, recalc, false);
  document.addEventListener('DOMContentLoaded', recalc, false);
})()*/

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

