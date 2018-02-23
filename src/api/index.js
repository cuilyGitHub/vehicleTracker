// 配置API接口地址
var root = 'http://tracker.uniits.com' //测试环境
//var root = 'http://localhost:8130/' //测试环境
//var root = 'http://tracker.cwucloud.com' //正式环境
//var root = 'http://47.93.137.203:13000' //泽哥自己搭建的
// 引用axios
var axios = require('axios');

import user from '../utils/public_value.js';
import {Indicator} from 'mint-ui';
//import {getCookie} from '../utils/utils.js'

// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
/*
 接口处理函数
 这个函数每个项目都是不一样的，我现在调整的是适用于
 https://cnodejs.org/api/v1 的接口，如果是其他接口
 需要根据接口的参数进行调整。参考说明文档地址：
 https://cnodejs.org/topic/5378720ed6e2d16149fa16bd
 主要是，不同的接口的成功标识和失败提示是不一致的。
 另外，不同的项目的处理方法也是不一致的，这里出错就是简单的alert
 */

function apiAxios(method, url, params, success, failure) {
  if (params) {
    params = filterNull(params)
  }
  Indicator.open();
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    withCredentials: false,
    headers: {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json;charset=UTF-8'}
  }).then(function (res) {
        Indicator.close();
        success(res.data)
  })
    .catch(function (err) {
      Indicator.close();
      failure(err)
    })
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
  }
  return "";
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure) {
    url = url + '?userId=' + getCookie("userId") + '&accessToken=' + getCookie("accessToken") + '&terminalType=4';
    return apiAxios('GET', url, params, success, failure)
  },
  post: function (url, params, success, failure) {
    url = url + '?userId=' + getCookie("userId") + '&accessToken=' + getCookie("accessToken") + '&terminalType=4';
    return apiAxios('POST', url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    url = url + '?userId=' + user.userId + '&accessToken=' + user.accessToken + '&terminalType=' + user.terminalType;
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    url = url + '?userId=' + user.userId + '&accessToken=' + user.accessToken + '&terminalType=' + user.terminalType;
    return apiAxios('DELETE', url, params, success, failure)
  },
  root:root
}

