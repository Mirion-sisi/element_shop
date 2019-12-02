import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import treetable from 'vue-table-with-tree-grid'

Vue.component('tree-table', treetable)
Vue.config.productionTip = false

// 导入基本的样式css
import './assets/css/global.css'
import './assets/css/font/iconfont.css'
import './plugins/element'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
