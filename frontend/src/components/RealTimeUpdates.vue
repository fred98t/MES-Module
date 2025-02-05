<template>
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">Real-Time Production Updates</h2>
      <div v-if="updatedRecord" class="mb-4 p-2 border rounded">
        <p><strong>ID:</strong> {{ updatedRecord.id }}</p>
        <p><strong>Status:</strong> {{ updatedRecord.status }}</p>
        <p><strong>Schedule:</strong> {{ updatedRecord.schedule }}</p>
      </div>
      <p v-else>No updates received yet.</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
  import socket from '../socket';
  
  export default defineComponent({
    name: 'RealTimeUpdates',
    setup() {
      const updatedRecord = ref<any>(null);
  
      const handleUpdate = (record: any) => {
        updatedRecord.value = record;
      };
  
      onMounted(() => {
        socket.on('productionStatusUpdated', handleUpdate);
      });
  
      onBeforeUnmount(() => {
        socket.off('productionStatusUpdated', handleUpdate);
      });
  
      return { updatedRecord };
    },
  });
  </script>
  
  <style scoped>
  /* Additional styling if necessary */
  </style>
  