import Vue from 'vue';
import Router from 'vue-router';

//对应的路由配置文件
import RailRouter from './rail'; //电子围栏
import UserRouter from './user'; //用户
import Device from './device';


import Index from '@/page/index';
import CompanyExample from '@/page/company_example';
import AboutMe from '@/page/user/about_me';
import Massage from '@/page/massage/massage';
import Login from '@/page/login';
import Monitoring from '@/page/statistics/monitoring';


Vue.use(Router);

const other = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    name: 'index',
    component: Index,
    meta: {
      title: '神州畅行',
      requireAuth: true,
      keepAlive:false,
    },
  },
  {
    path: '/companyexample',
    name: 'CompanyExample',
    component: CompanyExample,
    meta: {
      title: '组织机构代码样例'
    }
  },
  {
    path: '/aboutme',
    name: 'AboutMe',
    component: AboutMe,
    meta: {
      title: '我的',
      requireAuth: true
    }
  },
  {
    path: '/massage',
    name: 'Massage',
    component: Massage,
    meta: {
      title: '消息',
      //requireAuth: true
    }
  },
  {
    path: '/monitoring',
    name: 'Monitoring',
    component: Monitoring,
    meta: {
      title: '统计'
    }
  },

];

const routes = [
  ...other,
  ...RailRouter.railList,
  ...UserRouter.userList,
  ...Device.deviceList
]
/*export default new Router({
  //mode: 'history',
  routes,
})*/
const router = new Router({
  //mode: 'history',
  routes
})

/*router.beforeEach((to, from, next) => {
  if(!user.accessToken ){
    console.log(user.accessToken);
    /!*console.log(to);
    console.log(from);
    console.log(next);*!/
    next('/login');
  }else{
    console.log(user.accessToken);
    next(false)
  }
})*/

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
  }
  return "";
}

/*router.beforeEach((to, from, next)=> {
  if (to.matched.some(r => r.meta.requireAuth)) {
    var v = getCookie("accessToken");//window.document.cookie.match('(^|;) ?accessToken=([^;]*)(;|$)');
    console.log(v);
    if (v && v != undefined) {
      next()
    }else {
      next({
        path: '/login',
        redirect: to.path  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }else {
    next();
  }
})*/

export default router;

