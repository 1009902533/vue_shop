import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/login'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/login.vue')
// import Home from '../components/home'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/home.vue')
// import Welcome from '../components/welcome'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/welcome.vue')

// import Users from '../components/user/users'
const Users = () => import(/* webpackChunkName:"user" */ '../components/user/users.vue')

// import Rights from '../components/power/rights'
const Rights = () => import(/* webpackChunkName:"power" */ '../components/power/rights.vue')
// import Roles from '../components/power/roles'
const Roles = () => import(/* webpackChunkName:"power" */ '../components/power/roles.vue')

// import Cate from '../components/goods/Cate'
const Cate = () => import(/* webpackChunkName:"goods" */ '../components/goods/Cate.vue')
// import Params from '../components/goods/Params'
const Params = () => import(/* webpackChunkName:"goods" */ '../components/goods/Params.vue')
// import Goods from '../components/goods/Goods'
const Goods = () => import(/* webpackChunkName:"goods" */ '../components/goods/Goods.vue')
// import GoodsAdd from '../components/goods/add'
const GoodsAdd = () => import(/* webpackChunkName:"goods" */ '../components/goods/add.vue')
// import GoodsEdi from '../components/goods/edi'
const GoodsEdi = () => import(/* webpackChunkName:"goods" */ '../components/goods/edi.vue')

// import Orders from '../components/orders/orders'
const Orders = () => import(/* webpackChunkName:"orders" */ '../components/orders/orders.vue')

// import Reports from '../components/reports/reports'
const Reports = () => import(/* webpackChunkName:"reports" */ '../components/reports/reports.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: GoodsAdd },
      { path: '/goods/edi/:id', component: GoodsEdi },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
