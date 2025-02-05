<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Production Records</h2>
    <ul>
      <li
        v-for="record in productionRecords"
        :key="record.id"
        class="mb-2 p-2 border rounded"
      >
        <p><strong>Status:</strong> {{ record.status }}</p>
        <p><strong>Schedule:</strong> {{ record.schedule }}</p>
        <p>
          <strong>Raw Materials:</strong> {{ record.rawMaterials.join(', ') }}
        </p>
        <p>
          <strong>Finished Goods:</strong> {{ record.finishedGoods.join(', ') }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const GET_PRODUCTION_RECORDS = gql`
  query {
    productionRecords {
      id
      rawMaterials
      finishedGoods
      status
      schedule
    }
  }
`;

export default defineComponent({
  name: 'ProductionRecords',
  setup() {
    const { result, loading, error } = useQuery(GET_PRODUCTION_RECORDS);
    return {
      productionRecords: result?.value?.productionRecords,
      loading,
      error,
    };
  },
});
</script>

<style scoped>
/* Additional component-specific styling */
</style>
