<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">MES Dashboard</h1>
    <!-- Show loading message or spinner -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
    </div>
    <!-- Show error message -->
    <div v-if="error">{{ error.message }}</div>
    
    <!-- Summary Cards -->
    <div v-if="!loading && result" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div class="bg-white shadow rounded-lg p-4">
        <h2 class="text-lg font-semibold">Inventory Turnover Ratio</h2>
        <p class="text-2xl font-bold">{{ inventoryTurnoverRatio }}</p>
      </div>
      <div class="bg-white shadow rounded-lg p-4">
        <h2 class="text-lg font-semibold">Production Throughput</h2>
        <p class="text-2xl font-bold">{{ productionThroughput }} units</p>
      </div>
      <div class="bg-white shadow rounded-lg p-4">
        <h2 class="text-lg font-semibold">First Pass Yield</h2>
        <p class="text-2xl font-bold">{{ productFPY }}%</p>
      </div>
    </div>
    <!-- Bar Chart -->
    <div v-if="!loading && result" class="bg-white shadow rounded-lg p-4">
      <apexchart
        type="bar"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useQuery } from '@vue/apollo-composable';
import { DASHBOARD } from '../schema';

export default defineComponent({
  name: 'Dashboard',
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const inventoryTurnoverRatio = ref(null);
    const productionThroughput = ref(null);
    const productFPY = ref(null);
    const series = ref([{ name: 'Defect Rate (%)', data: [] }]);
    const chartOptions = ref({
      chart: { height: 350, type: 'bar' },
      title: { text: 'Product Defect Rates' },
      xaxis: { type: 'category' },
      yaxis: { title: { text: 'Defect Rate (%)' } },
    });

    const { result, loading, error, onResult } = useQuery(DASHBOARD);

    onResult((queryResult) => {
      if (queryResult.data) {
        // Update dashboard state when result becomes available
        inventoryTurnoverRatio.value =
          queryResult.data.inventoryTurnoverRatio[0].inventory_turnover_ratio.toFixed(3);
        productionThroughput.value = queryResult.data.productionThroughput
          .map((data: { total_units_produced: number }) => data.total_units_produced)
          .reduce((a: number, b: number) => a + b, 0);
        productFPY.value = queryResult.data.productFPY[0].first_pass_yield_percentage;

        series.value[0].data = queryResult.data.productDefectRates.map(
          (product: { product_name: any; defect_rate_percentage: any }) => ({
            x: product.product_name,
            y: product.defect_rate_percentage,
          })
        );
      }
    });

    return {
      inventoryTurnoverRatio,
      productionThroughput,
      productFPY,
      series,
      chartOptions,
      loading,
      error,
      result,
    };
  },
});
</script>
