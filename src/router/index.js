import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
//导入登录
import Login from '@/components/login/login'
import Users from '@/components/users/users'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      //路由里面又有路由需要用到 children数组,<router-view/>来渲染
      children:[
        {
          path:'/users',
          name: 'users',
          component: Users
        }
      ]
    },
    {
      path: '/login',
      component: Login
    },
    // {
    //   path: '/users',
    //   name: 'users',
    //   component: Users
    // }
  ]
})
