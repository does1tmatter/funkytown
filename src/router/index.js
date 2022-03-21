import { createRouter, createWebHistory } from 'vue-router'
import CityView from '../views/CityView.vue'
import Playground from '../views/Playground.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: CityView
    },
    {
      path: '/playground',
      name: 'Playground',
      component: Playground
    }
  ]
})

export default router