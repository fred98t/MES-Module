<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-gray-800 text-white flex flex-col transition-all duration-300',
        expanded ? 'w-64' : 'w-20',
      ]"
    >
      <!-- Top Branding / Logo -->
      <div
        class="p-4 flex items-center justify-center border-b border-gray-700"
      >
        <h2 v-if="expanded" class="text-2xl font-bold">Menu</h2>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 mt-4">
        <ul>
          <li>
            <router-link
              to="/dashboard"
              class="flex items-center p-3 hover:bg-gray-700 rounded transition-colors"
            >
              <!-- Replace with your icon SVG -->
              <font-awesome-icon icon="chart-line" />
              <span v-if="expanded" class="ml-3">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/production-records"
              class="flex items-center p-3 hover:bg-gray-700 rounded transition-colors"
            >
              <font-awesome-icon icon="book" />
              <span v-if="expanded" class="ml-3">Production Records</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Expand / Collapse Toggle Button -->
      <button
        @click="toggleExpand"
        class="p-3 border-t border-gray-700 focus:outline-none"
      >
        <svg
          :class="{ 'rotate-180': expanded }"
          class="w-6 h-6 transform transition-transform duration-300 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 transition-margin duration-300">
      <header class="bg-white shadow md:hidden p-4">
        <button
          @click="toggleMobileSidebar"
          class="text-gray-700 focus:outline-none"
        >
          <!-- Hamburger Icon -->
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </header>
      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const expanded = ref(true);
const mobileVisible = ref(false);

function toggleExpand() {
  expanded.value = !expanded.value;
  // Optionally store state in localStorage for persistence
  localStorage.setItem('sidebarExpanded', expanded.value);
}

function toggleMobileSidebar() {
  mobileVisible.value = !mobileVisible.value;
  // Implement mobile-specific sidebar toggling if needed
}
</script>
