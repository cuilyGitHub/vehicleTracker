//账号安全
const userList = [
  {
    path:'/editpwd',
    name:'editpwd',
    meta:{
      keepAlive:false,
      title:'修改密码'
    },
    component:resolve => require(['@/page/user/edit_pwd'],resolve)
  },
  {
    path:'/editUserName',
    name:'editUserName',
    meta:{
      keepAlive:false,
      title:'修改用户昵称'
    },
    component:resolve => require(['@/page/user/edit_username'],resolve)
  },
  {
    path:'/secure',
    name:'secure',
    meta:{
      keepAlive:false,
      title:'账号安全'
    },
    component:resolve => require(['@/page/user/secure'],resolve)
  },
  {
    path:'/bindmobile/:id',
    name:'bindmobile',
    meta:{
      keepAlive:false,
      title:'绑定手机/邮箱'
    },
    component:resolve => require(['@/page/user/bind_mobile'],resolve)
  },
  {
    path:'/about',
    name:'About',
    meta:{
      keepAlive:false,
      title:'关于'
    },
    component:resolve => require(['@/page/user/about'],resolve)
  },
  {
    path:'/feedback',
    name:'feedback',
    meta:{
      keepAlive:false,
      title:'意见反馈'
    },
    component:resolve => require(['@/page/user/feed_back'],resolve)
  },
  {
    path:'/user_rename',
    name:'userRename',
    meta:{
      keepAlive:false,
      title:'修改用户昵称'
    },
    component:resolve => require(['@/page/user/user_rename'],resolve)
  },
  {
    path:'/identity',
    name:'Identity',
    meta:{
      keepAlive:false,
      title:'实名认证'
    },
    component:resolve => require(['@/page/user/identity'],resolve)
  },
  {
    path:'/identityapple',
    name:'Identityapple',
    meta:{
      keepAlive:false,
      title:'实名认证'
    },
    component:resolve => require(['@/page/user/identity_apple'],resolve)
  },
  {
    path:'/massagelist',
    name:'massagelist',
    meta:{
      keepAlive:false,
      title:''
    },
    component:resolve => require(['@/page/massage/massage_list'],resolve)
  },
  {
    path:'/setting',
    name:'setting',
    meta:{
      keepAlive:false,
      title:'设置'
    },
    component:resolve => require(['@/page/user/setting'],resolve)
  },
  {
    path:'/choosemap',
    name:'choosemap',
    meta:{
      keepAlive:false,
      title:'选择地图'
    },
    component:resolve => require(['@/page/user/choose_map'],resolve)
  },
  {
    path:'/messagesetting',
    name:'messagesetting',
    meta:{
      keepAlive:false,
      title:'消息设置'
    },
    component:resolve => require(['@/page/user/message_setting'],resolve)
  },
  {
    path:'/alerttype',
    name:'alerttype',
    meta:{
      keepAlive:false,
      title:'设置报警类型'
    },
    component:resolve => require(['@/page/user/alert_type'],resolve)
  },
  {
    path:'/choosealerttime',
    name:'choosealerttime',
    meta:{
      keepAlive:false,
      title:'设置时间'
    },
    component:resolve => require(['@/page/user/choose_alert_time'],resolve)
  },
  {
    path:'/alertstatus',
    name:'alertstatus',
    meta:{
      keepAlive:false,
      title:'报警状态一览'
    },
    component:resolve => require(['@/page/massage/alert_status'],resolve)
  },
  {
    path:'/activation',
    name:'activation',
    meta:{
      keepAlive:false,
      title:'设备激活方法'
    },
    component:resolve => require(['@/page/massage/activation'],resolve)
  },
  {
    path:'/versionInformation',
    name:'versionInformation',
    meta:{
      keepAlive:false,
      title:'历史版本信息'
    },
    component:resolve => require(['@/page/user/version_information'],resolve)
  }
];

export default {
  userList
}
