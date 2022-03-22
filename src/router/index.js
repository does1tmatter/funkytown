import { createRouter, createWebHashHistory } from 'vue-router'
import CityView from '../views/CityView.vue'
import Playground from '../views/Playground.vue'

const router = createRouter({
  history: createWebHashHistory(),
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