import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from 'components/recommend/Recommend.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/recommend',
    name: 'recommend',
    component: Recommend
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
