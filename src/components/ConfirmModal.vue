<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click.self="handleCancel"
      >
        <div
          class="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-start justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-3">
              <!-- Icon baseado no variant -->
              <div
                :class="[
                  'flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0',
                  iconBgClass
                ]"
              >
                <svg
                  v-html="iconSvg"
                  :class="['w-5 h-5', iconColorClass]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </div>
              <h3
                :id="titleId"
                class="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {{ title }}
              </h3>
            </div>
            <button
              type="button"
              class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              @click="handleCancel"
              aria-label="Fechar"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-5">
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ message }}
            </p>

            <!-- Slot para conteúdo adicional -->
            <div v-if="$slots.default" class="mt-4">
              <slot />
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 p-5 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="secondary"
              @click="handleCancel"
              :disabled="loading"
            >
              {{ cancelText }}
            </Button>
            <Button
              :variant="confirmVariant"
              @click="handleConfirm"
              :loading="loading"
              :disabled="loading"
            >
              {{ confirmText }}
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import Button from './Button.vue'

export interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info' | 'success'
  loading?: boolean
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'update:isOpen', value: boolean): void
}

const props = withDefaults(defineProps<ConfirmModalProps>(), {
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  variant: 'danger',
  loading: false
})

const emit = defineEmits<Emits>()

// Gerar ID único para acessibilidade
const titleId = computed(() => `confirm-modal-title-${Math.random().toString(36).substr(2, 9)}`)

// Variante do botão de confirmação
const confirmVariant = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'danger'
    case 'warning':
      return 'warning'
    case 'success':
      return 'success'
    case 'info':
    default:
      return 'primary'
  }
})

// Componente de ícone baseado no variant
// SVG paths para cada ícone
const iconSvg = computed(() => {
  switch (props.variant) {
    case 'danger':
      return '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>'
    case 'warning':
      return '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'
    case 'success':
      return '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>'
    case 'info':
    default:
      return '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'
  }
})

// Classes do background do ícone
const iconBgClass = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'bg-red-100 dark:bg-red-900/30'
    case 'warning':
      return 'bg-yellow-100 dark:bg-yellow-900/30'
    case 'success':
      return 'bg-green-100 dark:bg-green-900/30'
    case 'info':
    default:
      return 'bg-blue-100 dark:bg-blue-900/30'
  }
})

// Classes da cor do ícone
const iconColorClass = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'text-red-600 dark:text-red-400'
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'success':
      return 'text-green-600 dark:text-green-400'
    case 'info':
    default:
      return 'text-blue-600 dark:text-blue-400'
  }
})

const handleConfirm = () => {
  if (!props.loading) {
    emit('confirm')
  }
}

const handleCancel = () => {
  if (!props.loading) {
    emit('cancel')
    emit('update:isOpen', false)
  }
}

// Fechar modal com ESC
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen && !props.loading) {
    handleCancel()
  }
}

// Prevenir scroll do body quando modal aberto
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Animações do modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  opacity: 0;
  transform: scale(0.95);
}
</style>
