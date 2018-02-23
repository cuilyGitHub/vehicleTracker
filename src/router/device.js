//账号安全
const deviceList = [
  {
    path:'/devicelist',
    name:'devicelist',
    meta:{
      keepAlive:false,
      title:'我的设备'
    },
    component:resolve => require(['@/page/device/device_list'],resolve)
  },
  {
    path:'/devicemanager',
    name:'devicemanager',
    meta:{
      keepAlive:true,
      title:'设备管理'
    },
    component:resolve => require(['@/page/device/device_manager'],resolve)
  },
  {
    path:'/deviceadd',
    name: 'deviceadd',
    meta:{
      keepAlive:false,
      title:'添加设备'
    },
    component:resolve => require(['@/page/device/device_add'],resolve)
  },
  {
    path:'/devicecard',
    name:'devicecard',
    meta:{
      keepAlive:true,
      title:'设备信息'
    },
    component:resolve => require(['@/page/device/device_card'],resolve)
  },
  {
    path:'/tag',
    name:'tag',
    meta:{
      keepAlive:false,
      title:'选择标签'
    },
    component:resolve => require(['@/page/device/tag'],resolve)
  },
  {
    path:'/editspeed',
    name:'editspeed',
    meta:{
      keepAlive:false,
      title:'超速设置'
    },
    component:resolve => require(['@/page/device/edit_speed'],resolve)
  },
  {
    path:'/order',
    name:'order',
    meta:{
      keepAlive:false,
      title:'设备发送指令'
    },
    component:resolve => require(['@/page/device/order'],resolve)
  },
  {
    path:'/editdevicebind',
    name:'editdevicebind',
    meta:{
      keepAlive:false,
      title:'修改绑定物信息'
    },
    component:resolve => require(['@/page/device/edit_device_bind'],resolve)
  },
  {
    path:'/editdevice',
    name:'editdevice',
    meta:{
      keepAlive:false,
      title:'修改设备信息'
    },
    component:resolve => require(['@/page/device/edit_device'],resolve)
  },
  {
    path:'/newbind',
    //path:'/newbind/:id',
    name:'newBind',
    meta:{
      keepAlive:true,
      title:'修改绑定物信息'
    },
    component:resolve => require(['@/page/device/new_bind'],resolve)
  },
  {
    path:'/searchlist/:fromPage',
    name:'searchList',
    meta:{
      keepAlive:false,
      title:'搜索'
    },
    component:resolve => require(['@/page/device/search_list'],resolve)
  },
  {
    path:'/historytrack',
    name:'historytrack',
    meta:{
      keepAlive:false,
      title:'轨迹回放'
    },
    component:resolve => require(['@/page/device/history_track'],resolve)
  },
  {
    path:'/alarmMessageMap',
    name:'alarmMessageMap',
    meta:{
      keepAlive:false,
      title:'报警消息'
    },
    component:resolve => require(['@/page/alarm_message_map'],resolve)
  },
  {
    path:'/color',
    name:'color',
    meta:{
      keepAlive:true,
      title:'选择颜色'
    },
    component:resolve => require(['@/page/device/color'],resolve)
  },
  {
    path:'/brands',
    name:'brands',
    meta:{
      keepAlive:true,
      title:'选择品牌'
    },
    component:resolve => require(['@/page/device/brands'],resolve)
  },
  {
    path:'/bindexisting',
    name:'bindexisting',
    meta:{
      keepAlive:false,
      title:'选择车辆'
    },
    component:resolve => require(['@/page/device/bind_existing'],resolve)
  }
]

export default {
  deviceList
}
