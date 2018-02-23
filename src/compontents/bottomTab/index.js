import BottomTabComponent from './bottom_tab.vue'

const bottomTab = {
  install:function (Vue) {
    Vue.component('bottom-tab',BottomTabComponent)
  }
}

export default bottomTab


/*import LoadingComponent from './loading.vue'

const Loading = {
  install:function (Vue) {
    Vue.component('Loading',LoadingComponent)
  }
}

export default Loading*/
