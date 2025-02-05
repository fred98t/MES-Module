<template>
  <div>
    <ejs-dashboardlayout
      :columns="6"
      :cellSpacing="[10, 10]"
      :panels="panels"
    ></ejs-dashboardlayout>
  </div>
</template>

<script>
import { DashboardLayoutPlugin } from '@syncfusion/ej2-vue-layouts';
import VueApexCharts from 'vue-apexcharts';

export default {
  components: {
    ejsDashboardlayout: DashboardLayoutPlugin,
    apexchart: VueApexCharts,
  },
  data() {
    return {
      panels: [
        {
          id: 'panel1',
          sizeX: 2,
          sizeY: 2,
          row: 0,
          col: 0,
          content: '<div id="chart1"><apexchart ... ></apexchart></div>',
        },
        {
          id: 'panel2',
          sizeX: 2,
          sizeY: 2,
          row: 0,
          col: 2,
          content: '<div id="chart2"><apexchart ... ></apexchart></div>',
        },
        // Add more panels as needed
      ],
    };
  },
};
</script>
