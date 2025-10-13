<template>
  <div class="vehicle-form">
    <Card :title="isEditing ? 'Editar Veículo' : 'Cadastrar Novo Veículo'">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Marca -->
          <div>
            <label for="make" class="block text-sm font-medium text-gray-700 mb-1">
              Marca *
            </label>
            <input
              id="make"
              v-model="form.make"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Toyota, Honda, Ford"
            />
          </div>

          <!-- Modelo -->
          <div>
            <label for="model" class="block text-sm font-medium text-gray-700 mb-1">
              Modelo *
            </label>
            <input
              id="model"
              v-model="form.model"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Corolla, Civic, Focus"
            />
          </div>

          <!-- Ano -->
          <Input
            v-model="form.year"
            label="Ano"
            placeholder="Ex: 2020"
            mask="year"
            required
          />

          <!-- Placa -->
          <Input
            v-model="form.plate"
            label="Placa"
            placeholder="Ex: ABC-1234"
            mask="plate"
            required
          />

          <!-- Cor -->
          <div>
            <label for="color" class="block text-sm font-medium text-gray-700 mb-1">
              Cor
            </label>
            <input
              id="color"
              v-model="form.color"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Branco, Preto, Prata"
            />
          </div>

          <!-- Quilometragem -->
          <Input
            v-model="form.mileage"
            label="Quilometragem (km)"
            placeholder="Ex: 50.000"
            mask="mileage"
            required
          />
        </div>

        <!-- Tipo de Combustível -->
        <div>
          <label for="fuelType" class="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Combustível *
          </label>
          <select
            id="fuelType"
            v-model="form.fuelType"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione o tipo de combustível</option>
            <option value="gasoline">Gasolina</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Elétrico</option>
            <option value="hybrid">Híbrido</option>
          </select>
        </div>

        <!-- Botões -->
        <div class="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            @click="$emit('cancel')"
            :disabled="loading"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            :loading="loading"
            :disabled="!isFormValid"
          >
            {{ isEditing ? 'Atualizar' : 'Cadastrar' }} Veículo
          </Button>
        </div>
      </form>
    </Card>

    <!-- Alert para erros -->
    <Alert
      v-if="error"
      :message="error"
      type="error"
      class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Card from './Card.vue'
import Button from './Button.vue'
import Alert from './Alert.vue'
import Input from './Input.vue'
import type { Vehicle, VehicleInput } from '@/stores/vehicles'

interface Props {
  vehicle?: Vehicle
  loading?: boolean
}

interface Emits {
  submit: [data: VehicleInput]
  cancel: []
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const error = ref('')

const form = ref<VehicleInput>({
  make: '',
  model: '',
  year: new Date().getFullYear(),
  plate: '',
  color: '',
  mileage: 0,
  fuelType: 'gasoline'
})

const isEditing = computed(() => !!props.vehicle)

const isFormValid = computed(() => {
  return (
    form.value.make.trim() !== '' &&
    form.value.model.trim() !== '' &&
    form.value.year > 1900 &&
    form.value.year <= new Date().getFullYear() + 1 &&
    form.value.plate.trim() !== '' &&
    form.value.mileage >= 0 &&
    ['gasoline', 'diesel', 'electric', 'hybrid'].includes(form.value.fuelType)
  )
})

// Preencher formulário quando editando
watch(
  () => props.vehicle,
  (vehicle) => {
    if (vehicle) {
      form.value = {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
        color: vehicle.color || '',
        mileage: vehicle.mileage,
        fuelType: vehicle.fuelType
      }
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  error.value = ''
  
  if (!isFormValid.value) {
    error.value = 'Por favor, preencha todos os campos obrigatórios corretamente.'
    return
  }

  // Validação da placa (formato brasileiro)
  const plateRegex = /^[A-Z]{3}-?\d{4}$/i
  if (!plateRegex.test(form.value.plate)) {
    error.value = 'Formato de placa inválido. Use o formato ABC-1234.'
    return
  }

  emit('submit', { ...form.value })
}

// Limpar formulário
const resetForm = () => {
  form.value = {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    plate: '',
    color: '',
    mileage: 0,
    fuelType: 'gasoline'
  }
  error.value = ''
}

defineExpose({
  resetForm
})
</script>

<style scoped>
.vehicle-form {
  max-width: 800px;
  margin: 0 auto;
}
</style>