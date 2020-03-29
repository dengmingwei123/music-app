import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入推荐页面
import Recommend from 'components/recommend/Recommend.vue'
// 引入推荐详情页
import Disc from 'components/disc/Disc.vue'
// 引入歌手页面
import Singer from 'components/singer/Singer.vue'
// 引入歌手详情页
import SingerDetail from 'components/singer-detail/Singer-Detail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Disc
      }
    ]
  },
  {
    path: '/singer',
    name: 'singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
