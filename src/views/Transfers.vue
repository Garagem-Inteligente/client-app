<script setup lang="ts">
import Navbar from '../components/Navbar.vue'
import PendingTransfers from '../components/PendingTransfers.vue'

</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <Navbar />
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-white">Transferências</h1>
          <p class="mt-2 text-gray-400">
            Gerencie as transferências de veículos pendentes
          </p>
        </div>

        <!-- Pending Transfers -->
        <PendingTransfers />
      </div>
    </div>
  </div>
</template>
