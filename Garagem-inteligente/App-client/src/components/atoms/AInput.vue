<template>
  <ion-item :lines="lines">
    <ion-label v-if="label" :position="labelPosition" :for="id">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </ion-label>
    <ion-input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="(modelValue as any)"
      :disabled="disabled"
      :readonly="readonly"
      :min="min"
      :max="max"
      :step="step as any"
      :maxlength="maxlength"
      :clear-input="clearInput"
      @ion-input="handleInput"
      @ion-blur="handleBlur"
    />
  </ion-item>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonInput } from '@ionic/vue'

interface Props {
  id?: string
  modelValue?: string | number | null
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'date'
  label?: string
  labelPosition?: 'stacked' | 'floating' | 'fixed'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  min?: number
  max?: number
  step?: number
  maxlength?: number
  clearInput?: boolean
  lines?: 'full' | 'inset' | 'none'
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  labelPosition: 'stacked',
  disabled: false,
  readonly: false,
  required: false,
  clearInput: false,
  lines: 'full'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur'): void
}>()

const handleInput = (event: CustomEvent) => {
  emit('update:modelValue', event.detail.value)
}

const handleBlur = () => {
  emit('blur')
}
</script>

<style scoped>
.required-mark {
  color: var(--ion-color-danger);
  margin-left: 2px;
}
</style>

