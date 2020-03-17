import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入基础样式文件
import 'common/stylus/index.styl'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
