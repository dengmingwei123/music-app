import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入推荐页面
import Recommend from 'components/recommend/Recommend.vue'
// 引入歌手页面
import Singer from 'components/singer/Singer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: Recommend
  },
  {
    path: '/singer',
    name: 'singer',
    component: Singer
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
