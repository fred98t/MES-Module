<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">MES Dashboard</h1>
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-lg font-semibold">Machine Utilization</h2>
          <p class="text-2xl font-bold">{{ machineUtilization }}%</p>
        </div>
        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-lg font-semibold">Product Defect Rate</h2>
          <p class="text-2xl font-bold">{{ productDefectRate }}%</p>
        </div>
        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-lg font-semibold">Total Cost</h2>
          <p class="text-2xl font-bold">${{ totalCost }}</p>
        </div>
        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-lg font-semibold">Total Production</h2>
          <p class="text-2xl font-bold">{{ totalProduction }}</p>
        </div>
      </div>
      <!-- Line Chart -->
      <div class="bg-white shadow rounded-lg p-4">
        <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue';
  import VueApexCharts from 'vue3-apexcharts';
  
  export default defineComponent({
    name: 'Dashboard',
    components: {
      apexchart: VueApexCharts,
    },
    setup() {
      const machineUtilization = ref(85); // Dummy data; replace with actual data
      const productDefectRate = ref(5); // Dummy data; replace with actual data
      const totalCost = ref(50000); // Dummy data; replace with actual data
      const totalProduction = ref(1200); // Dummy data; replace with actual data
  
      const series = ref([
        {
          name: 'Production Rate',
          data: [30, 40, 35, 50, 49, 60, 70, 91, 125], // Dummy data; replace with actual data
        },
        {
          name: 'Defect Rate',
          data: [5, 6, 8, 4, 7, 3, 2, 5, 6], // Dummy data; replace with actual data
        },
      ]);
  
      const chartOptions = ref({
        chart: {
          height: 350,
          type: 'line',
        },
        title: {
          text: 'Daily Production and Defect Rates',
        },
        xaxis: {
          categories: [
            '2025-02-01',
            '2025-02-02',
            '2025-02-03',
            '2025-02-04',
            '2025-02-05',
            '2025-02-06',
            '2025-02-07',
            '2025-02-08',
            '2025-02-09',
          ], // Dummy dates; replace with actual dates
          type: 'datetime',
        },
        yaxis: [
          {
            title: {
              text: 'Production Rate',
            },
          },
          {
            opposite: true,
            title: {
              text: 'Defect Rate',
            },
          },
        ],
      });
  
      onMounted(() => {
        // Fetch data from backend GraphQL API and update the refs accordingly
        // Example:
        // fetchGraphQLData().then(data => {
        //   machineUtilization.value = data.machineUtilization;
        //   productDefectRate.value = data.productDefectRate;
        //   totalCost.value = data.totalCost;
        //   totalProduction.value = data.totalProduction;
        //   series.value = [
        //     { name: 'Production Rate', data: data.productionRates },
        //     { name: 'Defect Rate', data: data.defectRates },
        //   ];
        // });
      });
  
      return {
        machineUtilization,
        productDefectRate,
        totalCost,
        totalProduction,
        series,
        chartOptions,
      };
    },
  });
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  </style>
  