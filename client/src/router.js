import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import CreatePost from './views/CreatePost.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import User from './views/User.vue'
import InsideCollection from './views/InsideCollection.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/posts/create',
      name: 'create a post',
      component: CreatePost
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/users/:Uid/collection/:Cid',
      name: 'inside a collection',
      component: InsideCollection
    }
  ]
})
