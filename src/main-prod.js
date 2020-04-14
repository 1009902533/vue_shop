import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
// import './plugins/element'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import Breadcrumb from './components/breadcrumb'
import TreeTable from 'vue-table-with-tree-grid'
import Nprogress from 'nprogress'
// import 'nprogress/nprogress.css'
import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
import Echarts from 'echarts'

// 设置默认请求地址头
// axios.defaults.baseURL = 'http://www.klxin.cn:8888/api/private/v1/'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => {
  Nprogress.start()
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})

Vue.prototype.$echarts = Echarts
Vue.prototype.$http = axios
Vue.prototype.qs = qs
Vue.config.productionTip = false
Vue.component('Breadcrumb', Breadcrumb)
Vue.component('tree-table', TreeTable)
Vue.filter('dateFormate', (val) => {
  const times = new Date(val)
  const y = times.getFullYear()
  const M = (times.getMonth() + 1).toString().padStart(2, '0')
  const D = times.getDay().toString().padStart(2, '0')
  const S = times.getHours().toString().padStart(2, '0')
  const m = times.getMinutes().toString().padStart(2, '0')
  const s = times.getSeconds().toString().padStart(2, '0')
  return `${y}-${M}-${D} ${S}:${m}:${s}`
})
Nprogress.configure({ 
  showSpinner: false,
  easing: 'ease', 
  speed: 500,
  trickle: false,
  minimum: 0.1
})
router.beforeEach((to, from, next) => {
  Nprogress.start()
  next()
})
router.afterEach((to, from, next) => {
  Nprogress.done()
})
Vue.use(VueQuillEditor)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
