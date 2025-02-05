import { createApp, h, provide } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import App from './App.vue';
import client from './apolloClient';
import './assets/main.css';
import router from './router';
import VueApexCharts from 'vue3-apexcharts';
import PrimeVue from 'primevue/config';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBook,
  faClock,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faBook, faClock, faChartLine);
const app = createApp({
  setup() {
    provide(DefaultApolloClient, client);
  },
  render: () => h(App),
}).component('font-awesome-icon', FontAwesomeIcon);

app.use(PrimeVue);
app.use(router);
app.use(VueApexCharts);
app.mount('#app');
