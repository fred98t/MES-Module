import { createRouter, createWebHistory } from 'vue-router';
import ProductionRecords from '../components/productionRecord.vue';
import RealTimeUpdates from '../components/realTimeUpdates.vue';
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
  {
    path: '/real-time-updates',
    name: 'RealTimeUpdates',
    component: RealTimeUpdates,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
