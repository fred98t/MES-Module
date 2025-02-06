<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Production Records</h2>
      <div class="flex gap-2">
        <button
          @click="downloadCSV"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Download CSV
        </button>
        <button
          @click="openCreateModal"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table
        class="min-w-full table-auto border-collapse border border-gray-300"
      >
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2 text-left text-sm font-medium">Order ID</th>
            <th class="border p-2 text-left text-sm font-medium">
              Product Name
            </th>
            <th class="border p-2 text-left text-sm font-medium">
              Quantity Ordered
            </th>
            <th class="border p-2 text-left text-sm font-medium">Order Date</th>
            <th class="border p-2 text-left text-sm font-medium">Due Date</th>
            <th class="border p-2 text-left text-sm font-medium">Status</th>
            <th class="border p-2 text-left text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="record in productionRecords"
            :key="record.production_order_id"
            class="hover:bg-gray-50"
          >
            <td class="border p-2">{{ record.production_order_id }}</td>
            <td class="border p-2">{{ record.product_name }}</td>
            <td class="border p-2">{{ record.quantity_ordered }}</td>
            <td class="border p-2">{{ formatDate(record.order_date) }}</td>
            <td class="border p-2">{{ formatDate(record.due_date) }}</td>
            <td class="border p-2">{{ record.status }}</td>
            <td class="border p-2">
              <button
                @click="openModal(record, 'view')"
                class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mr-2 text-sm"
              >
                View
              </button>
              <button
                @click="openModal(record, 'update')"
                class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2 text-sm"
              >
                Update
              </button>
              <button
                @click="handleDelete(record.production_order_id)"
                class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <CreateProductionModal
      v-if="showCreateModal"
      @close="closeCreateModal"
      @create="handleCreateData"
    />

    <!-- Modal for view/update -->
    <ProductionRecordModal
      v-if="showModal"
      :record="selectedRecord"
      :mode="modalMode"
      @close="closeModal"
      @update="handleUpdateData"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import {
  CREATE_PRODUCTION_RECORD,
  DELETE_PRODUCTION_RECORD,
  GET_PRODUCTION_RECORDS,
  UPDATE_PRODUCTION_RECORD,
} from '../schema';
import { formatDate } from '../util/utilities';
import CreateProductionModal from './modal/CreateProductionModal.vue';
import ProductionRecordModal from './modal/ProductionRecordModal.vue';
import type {
  CreateProductionRecordInput,
  ProductionOrderRecordsModal,
  UpdateProductionRecordInput,
} from '../types';

export default defineComponent({
  name: 'ProductionRecords',
  components: { ProductionRecordModal, CreateProductionModal },
  setup() {
    const productionRecords = ref<ProductionOrderRecordsModal[]>([]);
    const { result, loading, error, onResult } = useQuery(
      GET_PRODUCTION_RECORDS
    );

    const { mutate: createProductionRecord } = useMutation(
      CREATE_PRODUCTION_RECORD,
      {
        refetchQueries: [{ query: GET_PRODUCTION_RECORDS }],
        awaitRefetchQueries: true,
      }
    );

    const { mutate: updateProductionRecord } = useMutation(
      UPDATE_PRODUCTION_RECORD,
      {
        refetchQueries: [{ query: GET_PRODUCTION_RECORDS }],
        awaitRefetchQueries: true,
      }
    );

    const { mutate: deleteProductionRecord } = useMutation(
      DELETE_PRODUCTION_RECORD,
      {
        refetchQueries: [{ query: GET_PRODUCTION_RECORDS }],
        awaitRefetchQueries: true,
      }
    );

    onResult((queryResult) => {
      if (queryResult.data) {
        productionRecords.value = queryResult.data.productionOrderRecords;
      }
    });

    const showModal = ref(false);
    const selectedRecord = ref<ProductionOrderRecordsModal | null>(null);
    const modalMode = ref('view');
    const showCreateModal = ref(false);

    const openModal = (record: ProductionOrderRecordsModal, mode: string) => {
      selectedRecord.value = record;
      modalMode.value = mode;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      selectedRecord.value = null;
    };

    const openCreateModal = () => {
      showCreateModal.value = true;
    };

    const closeCreateModal = () => {
      showCreateModal.value = false;
    };

    const handleDelete = async (id: number) => {
      try {
        await deleteProductionRecord({ production_order_id: id });
        closeModal();
      } catch (error) {
        console.error('Error updating production record:', error);
      }
    };

    const handleCreateData = async (data: CreateProductionRecordInput) => {
      try {
        await createProductionRecord({ input: data });
        closeModal();
      } catch (error) {
        console.error('Error creating production record:', error);
      }
    };

    const handleUpdateData = async (
      updatedData: UpdateProductionRecordInput
    ) => {
      try {
        await updateProductionRecord({ input: updatedData });
        closeModal();
      } catch (error) {
        console.error('Error updating production record:', error);
      }
    };

    // Function to generate CSV file
    const downloadCSV = () => {
      if (!productionRecords.value.length) return;

      const headers = [
        'Order ID',
        'Product Name',
        'Quantity Ordered',
        'Order Date',
        'Due Date',
        'Status',
        'Start Date/Time',
        'End Date/Time',
        'Step Status',
        'Stage Name',
        'Stage Description',
        'Material Name',
        'Quantity Used',
        'Consumption Date',
        'Result ID',
        'Inspection Date',
        'Inspector Name',
        'Pass/Fail Status',
        'Defects Count',
        'Comments',
      ];

      const rows = productionRecords.value.map((record) => [
        record.production_order_id,
        record.product_name,
        record.quantity_ordered,
        formatDate(record.order_date),
        formatDate(record.due_date),
        record.status,
        formatDate(record.start_date_time),
        formatDate(record.end_date_time),
        record.step_status,
        record.stage_name,
        record.stage_description,
        record.material_name,
        record.quantity_used,
        formatDate(record.consumption_date),
        record.result_id,
        formatDate(record.inspection_date),
        record.inspector_name,
        record.pass_fail_status,
        record.defect_count,
        JSON.stringify(record.comments),
      ]);

      const csvContent = [
        headers.join(','), // Column headers
        ...rows.map((row) => row.join(',')), // Rows
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'production_records.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    return {
      productionRecords,
      loading,
      error,
      showCreateModal,
      openModal,
      closeModal,
      openCreateModal,
      closeCreateModal,
      handleDelete,
      handleCreateData,
      formatDate,
      showModal,
      selectedRecord,
      modalMode,
      handleUpdateData,
      downloadCSV,
    };
  },
});
</script>
