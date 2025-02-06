import { createRouter, createWebHistory } from 'vue-router';
import ProductionRecords from '../components/productionRecord.vue';
import Dashboard from '../components/Dashboard.vue';

const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/production-records',
    name: 'ProductionRecords',
    component: ProductionRecords,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
