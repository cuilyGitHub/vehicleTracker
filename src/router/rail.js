//电子围栏
const railList = [
  {
    path:'/rail',
    name:'rail',
    meta:{
      title:'电子围栏',
      keepAlive:false,
    },
    component:resolve => require(['@/page/rail/rail'],resolve)
  },
  {
    path:'/railcard/:id',
    name:'railcard',
    meta:{
      keepAlive:true,
      title:'新建电子围栏'
    },
    component:resolve => require(['@/page/rail/rail_card'],resolve)
  },
  {
    path:'/drawrail',
    name:'drawrail',
    meta:{
      keepAlive:false,
      title:'绘制围栏'
    },
    component:resolve => require(['@/page/rail/draw_rail'],resolve)
  },
  {
    path:'/regionrail',
    name:'regionrail',
    meta:{
      keepAlive:false,
      title:'区域围栏'
    },
    component:resolve => require(['@/page/rail/regionrail'],resolve)
  },
  {
    path:'/regionrailcard/:id',
    name:'regionrailcard',
    meta:{
      keepAlive:false,
      title:'新建区域围栏'
    },
    component:resolve => require(['@/page/rail/regionrail_card'],resolve)
  },
  {
    path:'/chooseregion',
    name:'chooseregion',
    meta:{
      keepAlive:false,
      title:'区域选择'
    },
    component:resolve => require(['@/page/rail/choose_region'],resolve)
  },
  {
    path:'/seerailcard',
    name:'seerailcard',
    meta:{
      keepAlive:false,
      title:'电子围栏'
    },
    component:resolve => require(['@/page/rail/see_rail_card'],resolve)
  },
  {
    path:'/seedrawrail',
    name:'seedrawrail',
    meta:{
      keepAlive:false,
      title:'电子围栏'
    },
    component:resolve => require(['@/page/rail/see_draw_rail'],resolve)
  },
  {
    path:'/seeregionrail',
    name:'seeregionrail',
    meta:{
      keepAlive:false,
      title:'区域围栏'
    },
    component:resolve => require(['@/page/rail/see_region_rail'],resolve)
  },
]

export default {
  railList
}
