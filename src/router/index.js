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
// 引入排行页面
import Rank from 'components/rank/Rank.vue'
// 引入排行详情页面
import TopList from 'components/top-list/Top-List.vue'
// 引入搜索页面
import Search from 'components/search/Search.vue'

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
  },
  {
    path: '/rank',
    name: 'rank',
    component: Rank,
    children: [
      {
        path: ':id',
        component: TopList
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
