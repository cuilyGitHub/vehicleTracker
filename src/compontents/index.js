import tabBarComponent from './tabBar.vue';

let tabBar = {
  install:function (Vue) {
    Vue.component('tabbar',tabBarComponent)
  }
}


export default tabBar;
