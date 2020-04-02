import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import './plugins/element'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://www.klxin.cn:8888/api/private/v1/'
Vue.prototype.qs = qs

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
