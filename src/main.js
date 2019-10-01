// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//引入elementUI组件
import ElementUI from 'element-ui'; 
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

// 引入我们的公共样式
import './assets/css/style.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
