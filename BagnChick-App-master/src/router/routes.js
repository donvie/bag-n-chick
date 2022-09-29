
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { name: "Bag N' Chick", path: '', component: () => import('pages/Index.vue') },
      { name: 'Basket', path: 'basket', component: () => import('pages/Basket.vue') },
      { name: 'Order History', path: 'order_history', component: () => import('pages/OrderHistory.vue') },
      { name: 'Dashboard', path: 'dashboard', component: () => import('pages/Dashboard.vue') },
      { name: 'Account', path: 'account', component: () => import('pages/Account.vue') }
    ]
  },
  { path: '/login', component: () => import('pages/Login.vue') },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
