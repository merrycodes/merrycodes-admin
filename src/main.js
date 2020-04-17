import Vue from 'vue'
import Cookies from 'js-cookie'
import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss'
import App from './App'
import store from './store'
import router from './router'
import './icons'
import './permission'
import './utils/error-log'
import { FUNCTIONS } from './utils/merry-codes'

Vue.prototype.$util = FUNCTIONS

Vue.use(Element, {
  size: Cookies.get('size') || 'medium'
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
