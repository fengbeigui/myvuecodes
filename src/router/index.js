import Vue from 'vue'
import Router from 'vue-router'
import HelloHome from '@/components/HelloHome'
//导入登录
import Login from '@/components/login/login'
import Users from '@/components/users/users'
import Rights from '@/components/rights/rights'
import Roles from '@/components/roles/roles'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloHome',
      component: HelloHome,
      //路由里面又有路由需要用到 children数组,<router-view/>来渲染
      children:[
        {
          path:'/users',
          name: 'users',
          component: Users
        },
        {
          path:'/rights',
          name: 'rights',
          component: Rights
        },
        {
          path:'/roles',
          name: 'roles',
          component: Roles
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    // {
    //   path: '/users',
    //   name: 'users',
    //   component: Users
    // }
  ]
})
