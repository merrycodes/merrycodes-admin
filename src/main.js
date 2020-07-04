import Cookies from 'js-cookie'
import '../theme/index.css'
import '@/assets/styles/index.scss'
import App from './App'
import store from './store'
import router from './router'
import './assets/icons'
import './permission'
import './utils/error-log'
import { FUNCTIONS } from './utils/merry-codes'

// eslint-disable-next-line no-undef
Vue.prototype.$util = FUNCTIONS

// eslint-disable-next-line no-undef
Vue.use(ELEMENT, {
  size: Cookies.get('size') || 'medium'
})

// eslint-disable-next-line no-undef
Vue.config.productionTip = false

// eslint-disable-next-line no-undef
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
