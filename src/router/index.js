import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入用户中心页面
const UserCenter = () => import('components/user-center/User-Center.vue')
// 引入搜索页面
const Search = () => import('components/search/Search.vue')
// 引入排行详情页面
const TopList = () => import('components/top-list/Top-List.vue')
// 引入排行页面
const Rank = () => import('components/rank/Rank.vue')
// 引入歌手详情页
const SingerDetail = () => import('components/singer-detail/Singer-Detail.vue')
// 引入歌手页面
const Singer = () => import('components/singer/Singer.vue')
// 引入推荐详情页
const Disc = () => import('components/disc/Disc.vue')
// 引入推荐页面
const Recommend = () => import('components/recommend/Recommend.vue')

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
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    component: UserCenter
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
