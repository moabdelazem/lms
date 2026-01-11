import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
  { path: '/books', name: 'Books', component: () => import('../views/Books.vue') },
  { path: '/authors', name: 'Authors', component: () => import('../views/Authors.vue') },
  { path: '/members', name: 'Members', component: () => import('../views/Members.vue') },
  { path: '/loans', name: 'Loans', component: () => import('../views/Loans.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
