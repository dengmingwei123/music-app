import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入基础样式文件
import 'common/stylus/index.styl'

// 引入vue-lazyload
import VueLazyLoad from 'vue-lazyload'
// 使用vue-lazyLoad
Vue.use(VueLazyLoad, {
  loading: require('common/image/logo.gif')
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
