import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import store from './store'
import router from './router'
import fastclick from 'fastclick'
import ElementUi from 'element-ui'
import Datetime from 'vue-datetime'

import 'common/stylus/index.styl'
import 'element-ui/lib/theme-default/index.css'

// datetime css
import 'vue-datetime/dist/vue-datetime.css'

Vue.use(ElementUi)
Vue.use(Datetime)

// 去除手机浏览器默认的点击 300ms 延迟
fastclick.attach(document.body)

// 设置全局请求头设备为 mobile
axios.defaults.headers['XX-Device-Type'] = 'mobile'

// 广告
console.log('想做一个想这样的网站吗？那就加入我们网站建设社吧！(二三四中午1点A501)')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
