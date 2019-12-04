import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../views/login/Login.vue')
const Home = () => import('../views/home/Home.vue')
const User = () => import('../views/home/user/User.vue')

const Rights=()=>import('../views/power/Rights.vue')
const Roles=()=>import('../views/power/Roles.vue')


const Categories=()=>import('../views/goods/Categories.vue')
const Params=()=>import('../views/goods/Params.vue')
const GoodsList=()=>import('../views/goods/GoodsList.vue')
const AddGoods=()=>import('../views/goods/AddGoods.vue')

const Order=()=>import('../views/order/Order.vue')

const Report=()=>import('../views/report/Report.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'

  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect:'/users',
    children:[
      {
        path:'/users',
        name:'user',
        component:User
      },
      {
        path: '/rights',
        name: 'rights',
        component: Rights
      },
      {
        path: '/roles',
        name: 'roles',
        component: Roles
      },
      {
        path: '/categories',
        name: 'categories',
        component: Categories
      },
      {
        path: '/params',
        name: 'params',
        component: Params
      },
      {
        path: '/goods',
        name: 'goods',
        component: GoodsList,
      },
      {
        path: '/goods/add',
        name: 'add',
        component: AddGoods,
      },
      {
        path: '/orders',
        name: 'orders',
        component: Order,
      },
      {
        path: '/reports',
        name: 'reports',
        component: Report,
      },

    ]
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 若用户访问的是登录页，直接放行
  if (to.path === '/login')
    return next()
  // 从sessionStorage中获取到保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  //  没有token,强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()

})

export default router
