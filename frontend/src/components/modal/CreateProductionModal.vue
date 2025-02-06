<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <!-- Modal overlay -->
    <div class="fixed inset-0 bg-black opacity-50" @click="closeModal"></div>
    <!-- Modal content -->
    <div
      class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full z-50"
    >
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Create New Production Record
        </h3>
        <div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <select
              v-model="form.product_id"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
            >
              <option disabled value="">Select a product</option>
              <option
                v-for="prod in product"
                :key="prod.product_id"
                :value="prod.product_id"
              >
                {{ prod.product_name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">
              Quantity Ordered
            </label>
            <input
              type="number"
              v-model="form.quantity_ordered"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
              min="1"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              v-model="form.due_date"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              v-model="form.status"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-2">
          <button
            @click="closeModal"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            @click="submitCreate"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_PRODUCT } from '../../schema';
import type { ProductList } from '../../types';

export default defineComponent({
  name: 'CreateProductionRecordModal',
  emits: ['close', 'create'],
  setup(_, { emit }) {
    const form = ref({
      product_id: null,
      quantity_ordered: 0,
      due_date: '',
      status: 'IN_PROGRESS',
    });
    const { result, loading, error, onResult } = useQuery(GET_PRODUCT);
    const product = ref<ProductList[]>([]);

    const closeModal = () => {
      emit('close');
    };

    const submitCreate = () => {
      emit('create', form.value);
      closeModal();
    };

    onResult((productList) => {
      if (productList.data) {
        product.value = productList.data.products;
      }
    });

    return {
      form,
      product,
      closeModal,
      submitCreate,
    };
  },
});
</script>
