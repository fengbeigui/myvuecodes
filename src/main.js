// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入axios
import axios from 'axios';
//使用axios,这样但是不友好
//Vue.prototype.$axios = axios;
// 导入 myaxios 模块
import myaxios from '@/assets/js/myaxios.js'
Vue.use(myaxios) // 注册使用 axios 插件


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
