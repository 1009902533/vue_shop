import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import './plugins/element'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import Breadcrumb from './components/breadcrumb'
import TreeTable from 'vue-table-with-tree-grid'

// 设置默认请求地址头
axios.defaults.baseURL = 'http://www.klxin.cn:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => {
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.prototype.qs = qs
Vue.config.productionTip = false
Vue.component('Breadcrumb', Breadcrumb)
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
