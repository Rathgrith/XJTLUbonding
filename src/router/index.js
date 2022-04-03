import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home'
import welcome from '../components/welcome'
import register from '../components/register'
import notfound from '../components/notFoundPage'
import store from '../store/index'
import detail from '../components/postdetail'
import test from '../components/test'
import postList from'../components/postList'

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path: '/register', component: register },
    { path: '/404', component: detail },
    {
        path: '/postDetail/:postId',
        name:'postDetail',
        component: detail,
        props:true,
    },
    {
      path: '/home',
      component: home,
      children: [
        { path: '/welcome', component: welcome },
        { path: '/postList', component: postList},
      ]
    },
    { path: '*', redirect: '/404' }
  ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页, 直接放行
  console.log(localStorage.getItem('idToken'))
  console.log(to.path)
  if(to.path ==='/404') return next();
  if (to.path === '/Login'||to.path==='/register') return next();


  // 从 lOCALStorage 中获取到保存的 token 值
  const tokenstr = localStorage.getItem('idToken')
  const lastTime = localStorage.getItem('lastTime')
  console.log(typeof (tokenstr)=='undefined')
  const nowTime = Date.now()
  if(lastTime===0||!lastTime) return next('/Login')



  if((nowTime-lastTime)>3600000){
    console.log(nowTime)
    store.commit('CLEAR_Login')
    return next('/Login')
  }
  //需要加入一个时间判断机制
  // 没有 token，强制跳转到登录页
  if (tokenstr===0||!tokenstr) return next('/Login')
  next()
})



export default router
