import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../views/Index.vue'
import Brand from "../views/sys/Brand"
import GoodsInformation from "../views/sys/GoodsInformation"
import GoodsSpecification from "../views/sys/GoodsSpecification"
import GoodsType from "../views/sys/GoodsType"
import Supplier from "../views/sys/Supplier"
import Supply from "../views/sys/Supply"

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

//TODO
router.beforeEach((to, from, next) => {
  let nav = [
    {
      title: '信息管理',
      name: 'InfoManage',
      icon: 'el-icon-s-operation',
      component: '',
      path: '',
      children: [
        {
          title: '商品信息',
          name: 'Goods',
          icon: 'el-icon-shopping-cart-1',
          component: 'sys/GoodsInformation',
          path: '/sys/goodsInformation',
          children: []
        },
        {
          title: '供应商信息',
          name: 'Supplier',
          icon: 'el-icon-s-custom',
          component: 'sys/Supplier',
          path: '/sys/supplier',
          children: []
        },
        {
          title: '商品品牌',
          name: 'Brand',
          icon: 'el-icon-postcard',
          component: 'sys/Brand',
          path: '/sys/brand',
          children: []
        },
        {
          title: '商品分类',
          name: 'GoodsType',
          icon: 'el-icon-menu',
          component: 'sys/GoodsType',
          path: '/sys/goodsType',
          children: []
        },
        {
          title: '商品规格',
          name: 'GoodsSpecification',
          icon: 'el-icon-notebook-2',
          component: 'sys/GoodsSpecification',
          path: '/sys/goodsSpecification',
          children: []
        },
        {
          title: '供应记录',
          name: 'Supply',
          icon: 'el-icon-coin',
          component: 'sys/Supply',
          path: '/sys/supply',
          children: []
        }
      ]
    }
  ]
  let hasRoute = store.state.menus.hasRoutes
  if (!hasRoute) {
    /*//拿到menuList
    store.commit('setMenuList', nav)
    //拿到用户权限
    store.commit('setPermList', [])
    //动态绑定路由
    let newRoutes = router.options.routes
    nav.forEach(menu => {
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
    router.addRoutes(newRoutes)
    hasRoute = true
    store.commit('changeRouteStatus', hasRoute)*/
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
      router.addRoutes(newRoutes)
      hasRoute = true
      store.commit('changeRouteStatus', hasRoute)
    })
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
