import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CartoucheView from '../views/CartoucheView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/cartouche/:id',
      name: 'cartouche',
      component: CartoucheView
    }
  ]
})

export default router
