<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  beforeImage?: string
  afterImage?: string
  beforeLabel?: string
  afterLabel?: string
}

withDefaults(defineProps<Props>(), {
  beforeLabel: 'Antes',
  afterLabel: 'Depois'
})

const showModal = ref(false)
const activeImage = ref<'before' | 'after'>('before')

const openModal = (image: 'before' | 'after') => {
  activeImage.value = image
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
</script>

<template>
  <div class="space-y-4">
    <!-- Image Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Before Image -->
      <div 
        v-if="beforeImage"
        class="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-gray-700 hover:border-blue-500 transition-all duration-300"
        @click="openModal('before')"
      >
        <img 
          :src="beforeImage" 
          :alt="beforeLabel"
          class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span class="text-white font-semibold">{{ beforeLabel }}</span>
          </div>
        </div>
        <div class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          ANTES
        </div>
      </div>

      <!-- After Image -->
      <div 
        v-if="afterImage"
        class="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-gray-700 hover:border-green-500 transition-all duration-300"
        @click="openModal('after')"
      >
        <img 
          :src="afterImage" 
          :alt="afterLabel"
          class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-white font-semibold">{{ afterLabel }}</span>
          </div>
        </div>
        <div class="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
          DEPOIS
        </div>
      </div>

      <!-- Empty State -->
      <div 
        v-if="!beforeImage"
        class="flex flex-col items-center justify-center h-48 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-lg"
      >
        <svg class="w-12 h-12 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-500 text-sm">Sem foto de antes</p>
      </div>

      <div 
        v-if="!afterImage"
        class="flex flex-col items-center justify-center h-48 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-lg"
      >
        <svg class="w-12 h-12 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-500 text-sm">Sem foto de depois</p>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div 
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
        @click="closeModal"
      >
        <div class="relative max-w-4xl w-full" @click.stop>
          <!-- Close Button -->
          <button
            @click="closeModal"
            class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            aria-label="Fechar"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Image Container -->
          <div class="bg-gray-900 rounded-lg overflow-hidden">
            <img 
              :src="activeImage === 'before' ? beforeImage : afterImage"
              :alt="activeImage === 'before' ? beforeLabel : afterLabel"
              class="w-full max-h-[80vh] object-contain"
            />
            <div class="p-4 bg-gray-800 flex items-center justify-between">
              <span class="text-white font-semibold">
                {{ activeImage === 'before' ? beforeLabel : afterLabel }}
              </span>
              <div class="flex space-x-2">
                <button
                  v-if="beforeImage && activeImage === 'after'"
                  @click="activeImage = 'before'"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                >
                  Ver Antes
                </button>
                <button
                  v-if="afterImage && activeImage === 'before'"
                  @click="activeImage = 'after'"
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  Ver Depois
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
