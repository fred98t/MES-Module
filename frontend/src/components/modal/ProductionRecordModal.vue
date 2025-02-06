<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <!-- Modal overlay -->
    <div class="fixed inset-0 bg-black opacity-50"></div>
    <!-- Modal content -->
    <div
      class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full z-50"
    >
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ mode === 'update' ? 'Update Record' : 'Record Details' }}
        </h3>
        <div v-if="record">
          <p class="text-sm text-gray-600">
            <strong>Order ID:</strong> {{ record.production_order_id }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Product Name:</strong>
            <span>{{ record.product_name }}</span>
          </p>
          <p class="text-sm text-gray-600">
            <strong>Quantity Ordered:</strong>
            <span v-if="mode === 'view'">{{ record.quantity_ordered }}</span>
            <input
              v-else
              type="number"
              v-model="form.quantity_ordered"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
              min="0"
            />
          </p>
          <p class="text-sm text-gray-600">
            <strong>Order Date:</strong> {{ formatDate(record.order_date) }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Due Date:</strong>
            <span v-if="mode === 'view'">{{
              formatDate(record.due_date)
            }}</span>
            <input
              v-else
              type="date"
              v-model="form.due_date"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
            />
          </p>
          <p class="text-sm text-gray-600">
            <strong>Status:</strong>
            <span v-if="mode === 'view'">{{ record.status }}</span>
            <select
              v-else
              v-model="form.status"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </p>
          <p class="text-sm text-gray-600">
            <strong>Start Date/Time:</strong>
            {{ formatDate(record.start_date_time) }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>End Date/Time:</strong>
            {{ formatDate(record.end_date_time) }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Step Status:</strong> {{ record.step_status }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Stage Name:</strong> {{ record.stage_name }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Stage Description:</strong> {{ record.stage_description }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Material Name:</strong> {{ record.material_name }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Quantity Used:</strong> {{ record.quantity_used }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Consumption Date:</strong>
            {{ formatDate(record.consumption_date) }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Result ID:</strong> {{ record.result_id }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Inspection Date:</strong>
            {{ formatDate(record.inspection_date) }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Inspector Name:</strong> {{ record.inspector_name }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Pass/Fail Status:</strong> {{ record.pass_fail_status }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Defect Count:</strong> {{ record.defect_count }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Comments:</strong> {{ record.comments }}
          </p>
        </div>
        <div class="mt-4 flex justify-end space-x-2">
          <button
            @click="$emit('close')"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            v-if="mode === 'update'"
            @click="submitUpdate"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            v-else
            @click="$emit('close')"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { formatDate } from '../../util/utilities';
import type { ProductionOrderRecordsModal } from '../../types';

export default defineComponent({
  name: 'ProductionRecordModal',
  props: {
    record: {
      type: Object as () => ProductionOrderRecordsModal | null,
      default: null,
    },
    mode: { type: String, default: 'view' },
  },
  emits: ['close', 'update'],
  setup(props, { emit }) {
    const form = ref({
      production_order_id: 0,
      quantity_ordered: 0,
      due_date: formatDate(props.record?.due_date),
      status: 'IN_PROGRESS',
    });

    // When the record changes, populate the form (only if in update mode)
    watch(
      () => props.record,
      (newRecord) => {
        if (newRecord && props.mode === 'update') {
          form.value.production_order_id =
            props.record?.production_order_id ?? 0;
          form.value.quantity_ordered = newRecord.quantity_ordered;
          form.value.due_date = formatDate(newRecord.due_date);
          form.value.status = newRecord.status;
        }
      },
      { immediate: true }
    );

    const submitUpdate = () => {
      emit('update', form.value);
    };

    return {
      form,
      formatDate,
      submitUpdate,
    };
  },
});
</script>
