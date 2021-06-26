import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../views/Index.vue'

import axios from "../axios"
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
         {
           path: '/index',
           name: 'Index',
           component: Index
         },
      // {
      //   path: '/sys/brand',
      //   name: 'SysBrand',
      //   component: Brand
      // },
      // {
      //   path: '/sys/goodsInformation',
      //   name: 'SysGoodsInformation',
      //   component: GoodsInformation
      // },
      // {
      //   path: '/sys/goodsSpecification',
      //   name: 'SysGoodsSpecification',
      //   component: GoodsSpecification
      // },
      // {
      //   path: '/sys/goodsType',
      //   name: 'SysGoodsType',
      //   component: GoodsType
      // },
      // {
      //   path: '/sys/supplier',
      //   name: 'SysSupplier',
      //   component: Supplier
      // },
    ]
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const router = new VueRouter({
//  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.$addRoutes = (params) => {
  router.matcher = new VueRouter({mode: 'history'}).matcher;
  params.forEach((i) => {
    router.addRoute(i)
  })
}

//TODO
router.beforeEach((to, from, next) => {
  let hasRoute = store.state.menus.hasRoutes
  if (hasRoute === false) {
    axios.get('/sys/menu/nav', {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then(res => {
      //拿到menuList
      store.commit('setMenuList', res.data.data.nav)
      //拿到用户权限
      store.commit('setPermList', res.data.data.authorities)
      //动态绑定路由
      let newRoutes = router.options.routes
      res.data.data.nav.forEach(menu => {
        if (menu.children) {
          menu.children.forEach(e => {
            //转化路由
            let route = menuToRoute(e)
            //把路由添加到路由管理中
            if(route) {
              newRoutes[0].children.push(route)
            }
          })
        }
      })
      router.$addRoutes(newRoutes)
    })
    hasRoute = true
    store.commit('changeRouteStatus', hasRoute)
  }
  next()
})

//导航转成路由
const menuToRoute = (menu) => {
  if (!menu.component) {
    return null
  }
  let route = {
    name: menu.name,
    path: menu.path,
    component: () => import('../views/' + menu.component + '.vue'),
    meta: {
      icon: menu.icon,
      title: menu.title
    }
  }
  return route
}

export default router
