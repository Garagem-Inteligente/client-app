<template>
  <ion-page>
    <ModernHeader
      :title="isEdit ? 'Editar Veículo' : 'Adicionar Veículo'"
      :show-back-button="true"
      back-path="/tabs/vehicles"
    />

    <ion-content class="app-content">
      <!-- Background layers -->
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>

      <div class="page-content-wrapper form-page">
        <form @submit.prevent="handleSubmit" class="form-content">
          <!-- Error Alert -->
          <div v-if="vehiclesStore.error" class="alert alert-error">
            <div class="alert-body">
              <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{{ vehiclesStore.error }}</span>
              <button type="button" @click="vehiclesStore.clearError" class="alert-close">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Info Alert -->
          <div v-if="!isEdit" class="alert alert-info">
            <div class="alert-body">
              <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-sm">
                {{
                  useManualInput
                    ? 'Digite os dados do veículo manualmente'
                    : 'Use os campos de busca abaixo para encontrar seu veículo na tabela FIPE'
                }}
              </span>
            </div>
            <button
              type="button"
              @click="useManualInput = !useManualInput"
              class="toggle-input-button"
            >
              {{ useManualInput ? '🔍 Buscar na FIPE' : '✏️ Digitar manualmente' }}
            </button>
          </div>

          <!-- Main Fields Grid -->
          <div class="fields-grid">
            <!-- Vehicle Type (FIRST FIELD) -->
            <div class="full-width">
              <label for="vehicleType" class="field-label"> Tipo de Veículo * </label>
              <select
                id="vehicleType"
                v-model="formData.vehicleType"
                required
                :disabled="vehiclesStore.loading"
                class="field-select"
              >
                <option value="">Selecione o tipo</option>
                <option value="car">🚗 Carro</option>
                <option value="motorcycle">🏍️ Moto</option>
                <option value="van">🚐 Van</option>
                <option value="truck">🚚 Caminhão</option>
                <option value="bus">🚌 Ônibus</option>
                <option value="pickup">🛻 Caminhonete</option>
              </select>
            </div>

            <!-- Brand (FIPE) -->
            <div v-if="!isEdit && !useManualInput">
              <MSearchableSelectFipe
                :key="`brand-${fipeComponentKey}`"
                v-model="formData.brandCode"
                :options="brands"
                label="Marca"
                placeholder="Digite para buscar a marca..."
                :loading="loadingBrands"
                :disabled="vehiclesStore.loading"
                required
                @select="handleBrandSelect"
              />
            </div>

            <!-- Brand (Manual) -->
            <div v-if="isEdit || useManualInput">
              <label for="make" class="field-label"> Marca * </label>
              <input
                id="make"
                v-model="formData.make"
                type="text"
                placeholder="Ex: Toyota, Honda, Ford"
                required
                :disabled="vehiclesStore.loading"
                class="field-input"
              />
            </div>

            <!-- Model (FIPE) -->
            <div v-if="!isEdit && !useManualInput">
              <MSearchableSelectFipe
                :key="`model-${fipeComponentKey}`"
                v-model="formData.modelCode"
                :options="models"
                label="Modelo"
                placeholder="Selecione primeiro a marca..."
                :loading="loadingModels"
                :disabled="vehiclesStore.loading || !formData.brandCode"
                required
                @select="handleModelSelect"
              />
            </div>

            <!-- Model (Manual) -->
            <div v-if="isEdit || useManualInput">
              <label for="model" class="field-label"> Modelo * </label>
              <input
                id="model"
                v-model="formData.model"
                type="text"
                placeholder="Ex: Corolla, Civic, Focus"
                required
                :disabled="vehiclesStore.loading"
                class="field-input"
              />
            </div>

            <!-- Year (FIPE) -->
            <div v-if="!isEdit && !useManualInput">
              <MSearchableSelectFipe
                :key="`year-${fipeComponentKey}`"
                v-model="formData.yearCode"
                :options="years"
                label="Ano"
                placeholder="Selecione primeiro o modelo..."
                :loading="loadingYears"
                :disabled="vehiclesStore.loading || !formData.modelCode"
                required
                @select="handleYearSelect"
              />
            </div>

            <!-- Year (Manual) -->
            <div v-if="isEdit || useManualInput">
              <label for="year" class="field-label"> Ano * </label>
              <input
                id="year"
                v-model.number="formData.year"
                type="number"
                inputmode="numeric"
                :min="1900"
                :max="new Date().getFullYear() + 1"
                required
                :disabled="vehiclesStore.loading"
                class="field-input"
              />
            </div>

            <!-- Plate with mask -->
            <div>
              <label for="plate" class="field-label"> Placa * </label>
              <input
                id="plate"
                v-model="formData.plate"
                type="text"
                placeholder="ABC-1234"
                required
                :disabled="vehiclesStore.loading"
                class="field-input"
                maxlength="8"
                @input="(e) => {
                  const target = e.target as HTMLInputElement
                  const cleaned = target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
                  target.value = cleaned.length <= 3 ? cleaned : `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`
                  formData.plate = target.value
                }"
              />
            </div>

            <!-- Color -->
            <div>
              <label for="color" class="field-label"> Cor </label>
              <input
                id="color"
                v-model="formData.color"
                type="text"
                placeholder="Ex: Branco, Preto, Prata"
                :disabled="vehiclesStore.loading"
                class="field-input"
              />
            </div>

            <!-- Mileage with mask -->
            <div>
              <label for="mileage" class="field-label"> Quilometragem * </label>
              <input
                id="mileage"
                v-model="displayMileage"
                type="text"
                inputmode="numeric"
                placeholder="0"
                required
                :disabled="vehiclesStore.loading"
                class="field-input"
                @input="handleMileageInput"
              />
            </div>

            <!-- Fuel Type (Auto-inferred from FIPE) -->
            <div>
              <label for="fuelType" class="field-label">
                Tipo de Combustível *
                <span v-if="!isEdit" class="text-xs text-blue-400">(Auto-detectado da FIPE)</span>
              </label>
              <select
                id="fuelType"
                v-model="formData.fuelType"
                required
                :disabled="vehiclesStore.loading"
                class="field-select"
              >
                <option value="">Selecione o combustível</option>
                <option value="flex">⛽ Flex (Gasolina/Etanol)</option>
                <option value="gasoline">⛽ Gasolina</option>
                <option value="ethanol">🌱 Álcool (Etanol)</option>
                <option value="diesel">🛢️ Diesel Comum</option>
                <option value="diesel-s10">🛢️ Diesel S10</option>
                <option value="electric">🔋 Elétrico</option>
                <option value="hybrid-plugin">🔌 Híbrido Plugin</option>
                <option value="hybrid-mild">🔋 Híbrido Leve</option>
                <option value="gnv">💨 GNV (Gás Natural)</option>
              </select>
            </div>

            <!-- Average Fuel Consumption -->
            <div>
              <label for="averageFuelConsumption" class="field-label">
                Consumo Médio (km/l)
                <span class="text-xs text-gray-400">(Opcional)</span>
              </label>
              <input
                id="averageFuelConsumption"
                v-model.number="formData.averageFuelConsumption"
                type="number"
                inputmode="decimal"
                step="0.1"
                min="0"
                placeholder="Ex: 12.5"
                :disabled="vehiclesStore.loading"
                class="field-input"
              />
            </div>

            <!-- Purchase Value -->
            <div>
              <label for="purchaseValue" class="field-label"> Valor de Compra (R$) </label>
              <input
                id="purchaseValue"
                v-model="displayPurchaseValue"
                type="text"
                inputmode="numeric"
                placeholder="0,00"
                :disabled="vehiclesStore.loading"
                class="field-input"
                @input="handlePurchaseValueInput"
                @blur="formatPurchaseValue"
              />
            </div>

            <!-- FIPE Value Display (if available) -->
            <div v-if="formData.fipeValue > 0" class="full-width">
              <div class="fipe-value-card">
                <div class="fipe-icon">💰</div>
                <div class="fipe-content">
                  <div class="fipe-label">Valor FIPE</div>
                  <div class="fipe-price">
                    {{
                      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                        formData.fipeValue,
                      )
                    }}
                  </div>
                  <div class="fipe-hint">Valor atualizado da tabela FIPE</div>
                </div>
              </div>
            </div>

            <!-- Value Variation Display -->
            <div v-if="valueVariation" class="full-width">
              <div
                class="value-variation-card"
                :class="{
                  appreciation: valueVariation.isAppreciation,
                  depreciation: valueVariation.isDepreciation,
                }"
              >
                <div class="variation-icon">
                  {{ valueVariation.isAppreciation ? '📈' : '📉' }}
                </div>
                <div class="variation-content">
                  <div class="variation-label">
                    {{ valueVariation.isAppreciation ? 'Valorização' : 'Desvalorização' }}
                  </div>
                  <div class="variation-amount">
                    {{
                      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                        Math.abs(valueVariation.difference),
                      )
                    }}
                  </div>
                  <div class="variation-percentage">
                    {{ valueVariation.isAppreciation ? '+' : ''
                    }}{{ valueVariation.percentage.toFixed(2) }}% em relação ao valor de compra
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Photo Section -->
          <div class="section-divider"></div>
          <div class="photo-section">
            <div class="photo-header">
              <svg class="photo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span class="photo-title">📸 Foto do Veículo (Opcional)</span>
            </div>

            <div class="photo-content">
              <label for="photo-upload" class="field-label">Adicionar Foto</label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                @change="handlePhotoUpload"
                :disabled="vehiclesStore.loading"
                class="file-input"
              />
              <p class="photo-hint">Imagem do veículo (máx 2MB)</p>

              <!-- Preview -->
              <div v-if="formData.imageUrl" class="photo-preview-wrapper">
                <img :src="formData.imageUrl" alt="Preview do veículo" class="photo-preview" />
                <button type="button" @click="formData.imageUrl = ''" class="photo-remove">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Upload Error -->
              <div v-if="uploadError" class="alert alert-error alert-small">
                <div class="alert-body">
                  <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{{ uploadError }}</span>
                  <button type="button" @click="uploadError = ''" class="alert-close">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Insurance Section -->
          <div class="section-divider"></div>
          <div class="insurance-section">
            <h3 class="section-title">
              <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Dados do Seguro
              <span class="section-subtitle">(Opcional)</span>
            </h3>

            <div class="fields-grid">
              <!-- Insurance Company -->
              <div>
                <label for="insuranceCompany" class="field-label"> Seguradora </label>
                <input
                  id="insuranceCompany"
                  v-model="formData.insuranceCompany"
                  type="text"
                  placeholder="Ex: Porto Seguro, Itaú, Allianz"
                  :disabled="vehiclesStore.loading"
                  class="field-input"
                />
              </div>

              <!-- Policy Number -->
              <div>
                <label for="insurancePolicyNumber" class="field-label"> Número da Apólice </label>
                <input
                  id="insurancePolicyNumber"
                  v-model="formData.insurancePolicyNumber"
                  type="text"
                  placeholder="Ex: 123456789"
                  :disabled="vehiclesStore.loading"
                  class="field-input"
                />
              </div>

              <!-- Insurance Phone with mask -->
              <div>
                <label for="insurancePhone" class="field-label"> Telefone da Seguradora </label>
                <input
                  id="insurancePhone"
                  v-model="formData.insurancePhone"
                  type="tel"
                  inputmode="tel"
                  placeholder="(11) 98765-4321"
                  :disabled="vehiclesStore.loading"
                  class="field-input"
                  @input="(e) => {
                    const target = e.target as HTMLInputElement
                    const value = target.value.replace(/\\D/g, '')
                    if (value.length <= 10) {
                      target.value = value
                        .replace(/^(\\d{2})(\\d)/, '($1) $2')
                        .replace(/(\\d{4})(\\d)/, '$1-$2')
                    } else {
                      target.value = value
                        .replace(/^(\\d{2})(\\d)/, '($1) $2')
                        .replace(/(\\d{5})(\\d)/, '$1-$2')
                        .slice(0, 15)
                    }
                    formData.insurancePhone = target.value
                  }"
                />
              </div>

              <!-- Broker Contact with mask -->
              <div>
                <label for="brokerContact" class="field-label"> Telefone do Corretor </label>
                <input
                  id="brokerContact"
                  v-model="formData.brokerContact"
                  type="tel"
                  inputmode="tel"
                  placeholder="(11) 98765-4321"
                  :disabled="vehiclesStore.loading"
                  class="field-input"
                  @input="(e) => {
                    const target = e.target as HTMLInputElement
                    const value = target.value.replace(/\\D/g, '')
                    if (value.length <= 10) {
                      target.value = value
                        .replace(/^(\\d{2})(\\d)/, '($1) $2')
                        .replace(/(\\d{4})(\\d)/, '$1-$2')
                    } else {
                      target.value = value
                        .replace(/^(\\d{2})(\\d)/, '($1) $2')
                        .replace(/(\\d{5})(\\d)/, '$1-$2')
                        .slice(0, 15)
                    }
                    formData.brokerContact = target.value
                  }"
                />
              </div>

              <!-- Expiry Date -->
              <div>
                <label for="insuranceExpiryDate" class="field-label"> Data de Vencimento </label>
                <input
                  id="insuranceExpiryDate"
                  v-model="formData.insuranceExpiryDate"
                  type="date"
                  :disabled="vehiclesStore.loading"
                  class="field-input"
                />
              </div>

              <!-- Insurance Value with currency mask -->
              <div>
                <label for="insuranceValue" class="field-label"> Valor do Seguro (Anual) </label>
                <input
                  id="insuranceValue"
                  v-model="displayInsuranceValue"
                  type="text"
                  inputmode="decimal"
                  placeholder="R$ 0,00"
                  :disabled="vehiclesStore.loading"
                  class="field-input"
                  @input="handleInsuranceValueInput"
                  @blur="formatInsuranceValue"
                />
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button
              type="button"
              @click="handleCancel"
              :disabled="vehiclesStore.loading"
              class="btn btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="!isFormValid || vehiclesStore.loading"
              class="btn btn-primary"
            >
              <span v-if="vehiclesStore.loading">Salvando...</span>
              <span v-else>{{ isEdit ? 'Atualizar' : 'Adicionar' }}</span>
            </button>
          </div>
        </form>
      </div>
    </ion-content>

    <!-- Confirmation Modals -->
    <MConfirmModal
      v-model:is-open="showSubmitModal"
      :title="isEdit ? 'Confirmar Atualização' : 'Confirmar Adição'"
      :message="
        isEdit
          ? 'Deseja realmente atualizar este veículo?'
          : 'Deseja realmente adicionar este veículo?'
      "
      variant="info"
      :confirm-text="isEdit ? 'Atualizar' : 'Adicionar'"
      cancel-text="Cancelar"
      confirm-color="primary"
      @confirm="confirmSubmit"
    />

    <MConfirmModal
      v-model:is-open="showCancelModal"
      title="Cancelar Edição"
      message="Deseja realmente cancelar? Todas as alterações serão perdidas."
      variant="warning"
      confirm-text="Sim, Cancelar"
      cancel-text="Continuar Editando"
      confirm-color="danger"
      @confirm="confirmCancel"
    />
  </ion-page>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { IonPage, IonContent } from '@ionic/vue';
  import { useVehiclesStore, type VehicleType, type FuelType } from '@/stores/vehicles';
  import { fipeApi, type FipeVehicleType } from '@/services/fipeApi';
  import { translateFirebaseError } from '@/utils/errorMessages';
  import MSearchableSelectFipe from '@/components/molecules/MSearchableSelectFipe.vue';
  import ModernHeader from '@/components/organisms/ModernHeader.vue';
  import MConfirmModal from '@/components/molecules/MConfirmModal.vue';

  const router = useRouter();
  const route = useRoute();
  const vehiclesStore = useVehiclesStore();

  const isEdit = computed(() => !!route.params.id && route.params.id !== 'new');

  // Modal control
  const showSubmitModal = ref(false);
  const showCancelModal = ref(false);

  // FIPE State
  const vehicleType = ref<FipeVehicleType>('cars');
  const brands = ref<Array<{ code: string; name: string }>>([]);
  const models = ref<Array<{ code: string; name: string }>>([]);
  const years = ref<Array<{ code: string; name: string }>>([]);

  const loadingBrands = ref(false);
  const loadingModels = ref(false);
  const loadingYears = ref(false);
  const uploadError = ref('');

  // Key to force re-render of FIPE components
  const fipeComponentKey = ref(0);

  // Manual input mode (when user can't find vehicle in FIPE)
  const useManualInput = ref(false);

  // Map vehicle types to FIPE API types
  const mapVehicleTypeToFipe = (type: VehicleType): FipeVehicleType => {
    switch (type) {
      case 'motorcycle':
        return 'motorcycles';
      case 'truck':
      case 'bus':
        return 'trucks';
      case 'car':
      case 'van':
      case 'pickup':
      default:
        return 'cars';
    }
  };

  // Form Data
  const formData = ref({
    vehicleType: 'car' as VehicleType,
    make: '',
    model: '',
    year: new Date().getFullYear(),
    plate: '',
    color: '',
    mileage: 0,
    fuelType: 'flex' as FuelType,
    averageFuelConsumption: 0,
    imageUrl: '',
    brandCode: '',
    modelCode: '',
    yearCode: '',
    insuranceCompany: '',
    insurancePhone: '',
    insurancePolicyNumber: '',
    insuranceExpiryDate: '',
    insuranceValue: 0,
    brokerContact: '',
    fipeValue: 0,
    fipeCode: '',
    purchaseValue: 0,
  });

  // Display values with masks
  const displayInsuranceValue = ref('');
  const displayPurchaseValue = ref('');
  const displayMileage = ref('');

  // Handler for insurance value input with currency mask
  const handleInsuranceValueInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\D/g, '');

    if (!value) {
      displayInsuranceValue.value = '';
      formData.value.insuranceValue = 0;
      return;
    }

    const cents = Number.parseInt(value);
    const reais = cents / 100;

    displayInsuranceValue.value = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(reais);

    formData.value.insuranceValue = reais;
  };

  // Handler for purchase value input with currency mask
  const handlePurchaseValueInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\D/g, '');

    if (!value) {
      displayPurchaseValue.value = '';
      formData.value.purchaseValue = 0;
      return;
    }

    const cents = Number.parseInt(value);
    const reais = cents / 100;

    displayPurchaseValue.value = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(reais);

    formData.value.purchaseValue = reais;
  };

  const formatInsuranceValue = () => {
    if (formData.value.insuranceValue > 0) {
      displayInsuranceValue.value = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(formData.value.insuranceValue);
    }
  };

  const formatPurchaseValue = () => {
    if (formData.value.purchaseValue && formData.value.purchaseValue > 0) {
      displayPurchaseValue.value = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(formData.value.purchaseValue);
    }
  };

  // Handler for mileage input with numeric mask and limit
  const handleMileageInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\D/g, '');

    if (!value) {
      displayMileage.value = '';
      formData.value.mileage = 0;
      return;
    }

    let num = Number.parseInt(value);

    // Limit to 999999
    if (num > 999999) {
      num = 999999;
    }

    displayMileage.value = new Intl.NumberFormat('pt-BR').format(num);
    formData.value.mileage = num;
  };

  const isFormValid = computed(() => {
    return formData.value.make && formData.value.model && formData.value.plate;
  });

  // Computed para valorização/desvalorização
  const valueVariation = computed(() => {
    if (!formData.value.purchaseValue || formData.value.purchaseValue === 0) {
      return null;
    }

    if (!formData.value.fipeValue || formData.value.fipeValue === 0) {
      return null;
    }

    const difference = formData.value.fipeValue - formData.value.purchaseValue;
    const percentage = (difference / formData.value.purchaseValue) * 100;

    return {
      difference,
      percentage,
      isAppreciation: difference > 0,
      isDepreciation: difference < 0,
    };
  });

  // Load brands
  const loadBrands = async () => {
    try {
      loadingBrands.value = true;
      brands.value = await fipeApi.getBrandsByType(vehicleType.value);
      vehiclesStore.clearError();
    } catch (error) {
      console.error('❌ Erro ao carregar marcas FIPE:', error);
      const errorMessage = translateFirebaseError(
        error,
        'Não foi possível carregar as marcas. Verifique sua conexão com a internet.',
      );
      vehiclesStore.error = errorMessage;
      brands.value = [];
    } finally {
      loadingBrands.value = false;
    }
  };

  // Watch vehicle type changes to update FIPE type and reload brands
  watch(
    () => formData.value.vehicleType,
    async (newVehicleType) => {
      if (!newVehicleType || isEdit.value) return;

      // Update FIPE type based on vehicle type
      vehicleType.value = mapVehicleTypeToFipe(newVehicleType);

      // Reset FIPE selections and reload brands for new type
      formData.value.brandCode = '';
      formData.value.modelCode = '';
      formData.value.yearCode = '';
      brands.value = [];
      models.value = [];
      years.value = [];

      // Load brands for the new vehicle type
      await loadBrands();
    },
  );

  // Watch manual input toggle
  watch(useManualInput, (isManual) => {
    if (isManual) {
      // Switching to manual: clear FIPE codes but keep text values
      formData.value.brandCode = '';
      formData.value.modelCode = '';
      formData.value.yearCode = '';
    } else {
      // Switching to FIPE: clear text values and reload brands
      formData.value.make = '';
      formData.value.model = '';
      formData.value.year = new Date().getFullYear();
      brands.value = [];
      models.value = [];
      years.value = [];
      loadBrands();
    }
  });

  // Watch brand selection
  watch(
    () => formData.value.brandCode,
    async (newBrandCode) => {
      if (!newBrandCode) {
        models.value = [];
        years.value = [];
        formData.value.modelCode = '';
        formData.value.yearCode = '';
        return;
      }

      try {
        loadingModels.value = true;
        models.value = await fipeApi.getModelsByBrand(vehicleType.value, newBrandCode);
        years.value = [];
        formData.value.yearCode = '';
      } catch (error) {
        console.error('❌ Erro ao carregar modelos FIPE:', error);
        const errorMessage = translateFirebaseError(
          error,
          'Não foi possível carregar os modelos. Verifique sua conexão com a internet.',
        );
        vehiclesStore.error = errorMessage;
        models.value = [];
      } finally {
        loadingModels.value = false;
      }
    },
  );

  // Watch model selection
  watch(
    () => formData.value.modelCode,
    async (newModelCode) => {
      if (!newModelCode || !formData.value.brandCode) {
        years.value = [];
        formData.value.yearCode = '';
        return;
      }

      try {
        loadingYears.value = true;
        years.value = await fipeApi.getYearsByModel(
          vehicleType.value,
          formData.value.brandCode,
          newModelCode,
        );
      } catch (error) {
        console.error('❌ Erro ao carregar anos FIPE:', error);
        const errorMessage = translateFirebaseError(
          error,
          'Não foi possível carregar os anos. Verifique sua conexão com a internet.',
        );
        vehiclesStore.error = errorMessage;
        years.value = [];
      } finally {
        loadingYears.value = false;
      }
    },
  );

  const handleBrandSelect = (option: { code: string; name: string }) => {
    formData.value.make = option.name;
  };

  const handleModelSelect = (option: { code: string; name: string }) => {
    formData.value.model = option.name;
  };

  const handleYearSelect = async (option: { code: string; name: string }) => {
    // Extract year from name (ex: "2023 Gasolina" -> 2023)
    const yearMatch = option.name.match(/^\d{4}/);
    if (yearMatch) {
      formData.value.year = Number.parseInt(yearMatch[0]);
    }

    // Try to extract fuel type from name
    const nameLower = option.name.toLowerCase();
    if (nameLower.includes('diesel')) {
      formData.value.fuelType = 'diesel';
    } else if (nameLower.includes('elétrico') || nameLower.includes('eletrico')) {
      formData.value.fuelType = 'electric';
    } else if (nameLower.includes('etanol') || nameLower.includes('álcool')) {
      formData.value.fuelType = 'ethanol';
    } else if (nameLower.includes('flex')) {
      formData.value.fuelType = 'flex';
    } else if (nameLower.includes('híbrido') || nameLower.includes('hibrido')) {
      formData.value.fuelType = nameLower.includes('plugin') ? 'hybrid-plugin' : 'hybrid-mild';
    } else if (nameLower.includes('gnv')) {
      formData.value.fuelType = 'gnv';
    } else if (nameLower.includes('gasolina')) {
      formData.value.fuelType = 'gasoline';
    }

    // Fetch FIPE value
    if (formData.value.brandCode && formData.value.modelCode) {
      try {
        const fipeInfo = await fipeApi.getVehicleInfo(
          vehicleType.value,
          formData.value.brandCode,
          formData.value.modelCode,
          option.code,
        );

        if (fipeInfo) {
          // Store FIPE code
          formData.value.fipeCode = fipeInfo.codeFipe || '';

          // Parse and store FIPE value
          // Format: "R$ 50.000,00" -> 50000
          if (fipeInfo.price) {
            const valueStr = fipeInfo.price.replace(/[^\d,]/g, '').replace(/,/g, '.');
            formData.value.fipeValue = Number.parseFloat(valueStr) || 0;
          }

          // Auto-infer fuel type from FIPE if not already set by year name
          if (
            fipeInfo.fuel &&
            !nameLower.includes('gasolina') &&
            !nameLower.includes('diesel') &&
            !nameLower.includes('flex')
          ) {
            const fipeFuel = fipeInfo.fuel.toLowerCase();
            if (fipeFuel.includes('diesel')) {
              formData.value.fuelType = 'diesel';
            } else if (fipeFuel.includes('elétrico') || fipeFuel.includes('eletrico')) {
              formData.value.fuelType = 'electric';
            } else if (fipeFuel.includes('etanol') || fipeFuel.includes('álcool')) {
              formData.value.fuelType = 'ethanol';
            } else if (fipeFuel.includes('flex')) {
              formData.value.fuelType = 'flex';
            } else if (fipeFuel.includes('híbrido') || fipeFuel.includes('hibrido')) {
              formData.value.fuelType = 'hybrid-mild';
            } else if (fipeFuel.includes('gnv')) {
              formData.value.fuelType = 'gnv';
            } else if (fipeFuel.includes('gasolina')) {
              formData.value.fuelType = 'gasoline';
            }
          }
        }
      } catch (error) {
        console.error('❌ Erro ao buscar dados FIPE:', error);
        const errorMessage = translateFirebaseError(
          error,
          'Não foi possível buscar o valor FIPE. Verifique sua conexão com a internet.',
        );
        vehiclesStore.error = errorMessage;
      }
    }
  };

  // Photo handling (Web only)
  const handlePhotoUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      uploadError.value = 'A foto deve ter no máximo 2MB';
      input.value = '';
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      uploadError.value = 'Apenas imagens são permitidas';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.imageUrl = e.target?.result as string;
      uploadError.value = '';
    };
    reader.onerror = () => {
      uploadError.value = 'Erro ao carregar imagem';
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!isFormValid.value) return;
    showSubmitModal.value = true;
  };

  const confirmSubmit = async () => {
    try {
      const vehicleData = {
        vehicleType: formData.value.vehicleType,
        make: formData.value.make,
        model: formData.value.model,
        year: formData.value.year,
        plate: formData.value.plate,
        color: formData.value.color,
        mileage: formData.value.mileage,
        fuelType: formData.value.fuelType,
        ...(formData.value.averageFuelConsumption && {
          averageFuelConsumption: formData.value.averageFuelConsumption,
        }),
        ...(formData.value.imageUrl && { imageUrl: formData.value.imageUrl }),
        ...(formData.value.fipeValue && { fipeValue: formData.value.fipeValue }),
        ...(formData.value.fipeCode && { fipeCode: formData.value.fipeCode }),
        ...(formData.value.insuranceCompany && {
          insuranceCompany: formData.value.insuranceCompany,
        }),
        ...(formData.value.insurancePhone && { insurancePhone: formData.value.insurancePhone }),
        ...(formData.value.insurancePolicyNumber && {
          insurancePolicyNumber: formData.value.insurancePolicyNumber,
        }),
        ...(formData.value.insuranceExpiryDate && {
          insuranceExpiryDate: formData.value.insuranceExpiryDate,
        }),
        ...(formData.value.insuranceValue && { insuranceValue: formData.value.insuranceValue }),
        ...(formData.value.brokerContact && { brokerContact: formData.value.brokerContact }),
      };

      if (isEdit.value) {
        await vehiclesStore.updateVehicle(route.params.id as string, vehicleData);
      } else {
        await vehiclesStore.addVehicle(vehicleData);
      }

      router.push('/tabs/vehicles');
    } catch (error) {
      console.error('❌ Erro ao salvar veículo:', error);
      const errorMessage = translateFirebaseError(
        error,
        'Não foi possível salvar o veículo. Verifique sua conexão com a internet.',
      );
      vehiclesStore.error = errorMessage;
    }
  };

  const handleCancel = async () => {
    showCancelModal.value = true;
  };

  const confirmCancel = () => {
    router.back();
  };

  // Reset form to initial state
  const resetForm = () => {
    formData.value = {
      vehicleType: 'car' as VehicleType,
      make: '',
      model: '',
      year: new Date().getFullYear(),
      plate: '',
      color: '',
      mileage: 0,
      fuelType: 'flex' as FuelType,
      averageFuelConsumption: 0,
      imageUrl: '',
      brandCode: '',
      modelCode: '',
      yearCode: '',
      insuranceCompany: '',
      insurancePhone: '',
      insurancePolicyNumber: '',
      insuranceExpiryDate: '',
      insuranceValue: 0,
      brokerContact: '',
      fipeValue: 0,
      fipeCode: '',
      purchaseValue: 0,
    };

    // Reset display values
    displayInsuranceValue.value = '';
    displayPurchaseValue.value = '';
    displayMileage.value = '';

    // Reset FIPE type to cars (default)
    vehicleType.value = 'cars';

    // Reset to FIPE mode (not manual)
    useManualInput.value = false;

    // Reset FIPE lists
    brands.value = [];
    models.value = [];
    years.value = [];

    // Force re-render of FIPE components by changing key
    fipeComponentKey.value++;

    // Clear errors
    vehiclesStore.clearError();
    uploadError.value = '';
  };

  // Watch route changes to reset form when navigating to /new
  // Use query timestamp to detect when user clicks "add" button again
  watch(
    () => [route.path, route.query.t],
    async ([newPath]) => {
      // Always reset form when on /new route
      if (newPath === '/tabs/vehicle/new') {
        resetForm();
        await loadBrands();
      }
    },
    { immediate: true }, // Run immediately on mount
  );

  onMounted(async () => {
    if (isEdit.value) {
      const vehicle = vehiclesStore.getVehicleById(route.params.id as string);
      if (vehicle) {
        // Format insurance expiry date
        let insuranceExpiry = '';
        if (vehicle.insuranceExpiryDate) {
          if (vehicle.insuranceExpiryDate instanceof Date) {
            insuranceExpiry = vehicle.insuranceExpiryDate.toISOString().split('T')[0];
          } else {
            insuranceExpiry = String(vehicle.insuranceExpiryDate).split('T')[0];
          }
        }

        formData.value = {
          vehicleType: vehicle.vehicleType,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          plate: vehicle.plate,
          color: vehicle.color || '',
          mileage: vehicle.mileage,
          fuelType: vehicle.fuelType,
          averageFuelConsumption: vehicle.averageFuelConsumption || 0,
          imageUrl: vehicle.imageUrl || '',
          brandCode: '',
          modelCode: '',
          yearCode: '',
          insuranceCompany: vehicle.insuranceCompany || '',
          insurancePhone: vehicle.insurancePhone || '',
          insurancePolicyNumber: vehicle.insurancePolicyNumber || '',
          insuranceExpiryDate: insuranceExpiry,
          insuranceValue: vehicle.insuranceValue || 0,
          brokerContact: vehicle.brokerContact || '',
          fipeValue: vehicle.fipeValue || 0,
          fipeCode: vehicle.fipeCode || '',
          purchaseValue: vehicle.purchaseValue || 0,
        };

        // Format insurance value for display
        if (vehicle.insuranceValue && vehicle.insuranceValue > 0) {
          displayInsuranceValue.value = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(vehicle.insuranceValue);
        }

        // Format purchase value for display
        if (vehicle.purchaseValue && vehicle.purchaseValue > 0) {
          displayPurchaseValue.value = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(vehicle.purchaseValue);
        }

        // Format mileage for display
        if (vehicle.mileage > 0) {
          displayMileage.value = new Intl.NumberFormat('pt-BR').format(vehicle.mileage);
        }
      }
    }
    // Note: For new vehicles, resetForm() is called by the watch with immediate: true
  });
</script>

<style scoped>
  /* Page Container */
  .form-page {
    min-height: 100%;
  }

  .form-content {
    max-width: 896px; /* max-w-4xl */
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  /* Alerts */
  .alert {
    padding: 1rem;
    border-radius: 0.375rem;
    margin-bottom: 1.5rem;
  }

  .alert-error {
    background: rgba(153, 27, 27, 0.2); /* bg-red-900/20 */
    border: 1px solid rgba(239, 68, 68, 0.3); /* border-red-500/30 */
    color: #f87171; /* text-red-400 */
  }

  .alert-info {
    background: rgba(37, 99, 235, 0.1); /* bg-blue-900/10 */
    border: 1px solid rgba(59, 130, 246, 0.3); /* border-blue-500/30 */
    color: #93c5fd; /* text-blue-300 */
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .toggle-input-button {
    align-self: flex-start;
    padding: 0.5rem 1rem;
    background: rgba(59, 130, 246, 0.2);
    border: 1px solid rgba(59, 130, 246, 0.4);
    border-radius: 0.375rem;
    color: #93c5fd;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .toggle-input-button:hover {
    background: rgba(59, 130, 246, 0.3);
    border-color: rgba(59, 130, 246, 0.6);
  }

  .alert-small {
    padding: 0.75rem;
    margin-top: 0.5rem;
    margin-bottom: 0;
  }

  .alert-body {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .alert-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }

  .alert-close {
    margin-left: auto;
    padding: 0;
    background: none;
    border: none;
    color: currentColor;
    cursor: pointer;
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  .alert-close:hover {
    opacity: 0.7;
  }

  .alert-close svg {
    width: 100%;
    height: 100%;
  }

  /* Fields Grid */
  .fields-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem 1.5rem;
    margin-bottom: 1.5rem;
  }

  @media (min-width: 768px) {
    .fields-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .full-width {
    grid-column: 1 / -1;
  }

  /* Field Styles */
  .field-label {
    display: block;
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
    color: #d1d5db; /* text-gray-300 */
    margin-bottom: 0.5rem;
  }

  .field-input,
  .field-select {
    width: 100%;
    padding: 0.5rem 0.75rem; /* py-2 px-3 */
    background-color: #1f2937; /* bg-gray-800 */
    border: 1px solid #4b5563; /* border-gray-600 */
    border-radius: 0.375rem; /* rounded-md */
    color: #ffffff;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .field-input:focus,
  .field-select:focus {
    outline: none;
    border-color: #3b82f6; /* border-blue-500 */
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); /* ring effect */
  }

  .field-input::placeholder {
    color: #6b7280; /* text-gray-500 */
  }

  .field-input:disabled,
  .field-select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Section Divider */
  .section-divider {
    border-top: 1px solid #374151; /* border-gray-700 */
    padding-top: 1.5rem;
    margin-top: 0.5rem;
  }

  /* Photo Section */
  .photo-section {
    background: linear-gradient(
      to right,
      rgba(59, 130, 246, 0.1),
      rgba(168, 85, 247, 0.1)
    ); /* from-blue-500/10 to-purple-500/10 */
    border: 1px solid rgba(59, 130, 246, 0.3); /* border-blue-500/30 */
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .photo-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .photo-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #60a5fa; /* text-blue-400 */
  }

  .photo-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #93c5fd; /* text-blue-300 */
  }

  .photo-content {
    margin-top: 1rem;
  }

  .file-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    background-color: #1f2937;
    border: 1px solid #4b5563;
    border-radius: 0.375rem;
    color: #ffffff;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .file-input::file-selector-button {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: #ffffff;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
  }

  .file-input::file-selector-button:hover {
    background-color: #2563eb;
  }

  .file-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  .photo-hint {
    font-size: 0.75rem; /* text-xs */
    color: #6b7280; /* text-gray-500 */
    margin-top: 0.25rem;
  }

  .photo-preview-wrapper {
    margin-top: 0.75rem;
    position: relative;
    display: inline-block;
    max-width: 28rem; /* max-w-md */
  }

  .photo-preview {
    width: 100%;
    height: 12rem; /* h-48 */
    object-fit: cover;
    border-radius: 0.375rem;
    border: 2px solid #3b82f6; /* border-blue-500 */
  }

  .photo-remove {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background-color: #dc2626; /* bg-red-600 */
    color: #ffffff;
    border: none;
    border-radius: 9999px;
    padding: 0.5rem;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .photo-preview-wrapper:hover .photo-remove {
    opacity: 1;
  }

  .photo-remove:hover {
    background-color: #b91c1c; /* hover:bg-red-700 */
  }

  .photo-remove svg {
    width: 1rem;
    height: 1rem;
  }

  /* Insurance Section */
  .insurance-section {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1.125rem; /* text-lg */
    font-weight: 500; /* font-medium */
    color: #ffffff;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
  }

  .section-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
    color: #60a5fa; /* text-blue-400 */
  }

  .section-subtitle {
    margin-left: 0.5rem;
    font-size: 0.875rem;
    color: #9ca3af; /* text-gray-400 */
    font-weight: 400;
  }

  /* Form Actions */
  .form-actions {
    display: flex;
    flex-direction: column-reverse;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  @media (min-width: 640px) {
    .form-actions {
      flex-direction: row;
      justify-content: flex-end;
    }
  }

  /* Buttons */
  .btn {
    padding: 0.5rem 1.5rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    flex: 1;
  }

  @media (min-width: 640px) {
    .btn {
      flex: 0 0 auto;
      min-width: 120px;
    }
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary {
    background-color: #3b82f6; /* bg-blue-500 */
    color: #ffffff;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #2563eb; /* hover:bg-blue-600 */
  }

  .btn-outline {
    background-color: transparent;
    color: #ffffff;
    border: 1px solid #4b5563; /* border-gray-600 */
  }

  .btn-outline:hover:not(:disabled) {
    background-color: #374151; /* hover:bg-gray-700 */
  }

  /* FIPE Value Card */
  .fipe-value-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .fipe-icon {
    font-size: 2rem;
    line-height: 1;
  }

  .fipe-content {
    flex: 1;
  }

  .fipe-label {
    font-size: 0.75rem;
    color: #86efac; /* text-green-300 */
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .fipe-price {
    font-size: 1.5rem;
    font-weight: 600;
    color: #22c55e; /* text-green-500 */
    margin: 0.25rem 0;
  }

  .fipe-hint {
    font-size: 0.75rem;
    color: #6b7280; /* text-gray-500 */
  }

  /* Value Variation Card */
  .value-variation-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid;
    transition: all 0.3s ease;
  }

  .value-variation-card.appreciation {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.15) 100%);
    border-color: rgba(34, 197, 94, 0.3);
  }

  .value-variation-card.depreciation {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%);
    border-color: rgba(239, 68, 68, 0.3);
  }

  .variation-icon {
    font-size: 2rem;
    line-height: 1;
  }

  .variation-content {
    flex: 1;
  }

  .variation-label {
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
  }

  .value-variation-card.appreciation .variation-label {
    color: #86efac; /* text-green-300 */
  }

  .value-variation-card.depreciation .variation-label {
    color: #fca5a5; /* text-red-300 */
  }

  .variation-amount {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0.25rem 0;
  }

  .value-variation-card.appreciation .variation-amount {
    color: #22c55e; /* text-green-500 */
  }

  .value-variation-card.depreciation .variation-amount {
    color: #ef4444; /* text-red-500 */
  }

  .variation-percentage {
    font-size: 0.75rem;
    color: #9ca3af; /* text-gray-400 */
  }

  /* Modern Alert Styles (Global) */
  ion-alert.modern-alert {
    --background: #1f2937;
    --max-width: 400px;
  }

  ion-alert.modern-alert .alert-wrapper {
    border-radius: 1rem;
    border: 1px solid #374151;
    backdrop-filter: blur(10px);
  }

  ion-alert.modern-alert .alert-head {
    padding: 1.5rem 1.5rem 0;
  }

  ion-alert.modern-alert .alert-title {
    color: #ffffff;
    font-size: 1.125rem;
    font-weight: 600;
  }

  ion-alert.modern-alert .alert-message {
    color: #d1d5db;
    padding: 0.75rem 1.5rem 1.5rem;
    font-size: 0.875rem;
  }

  ion-alert.modern-alert .alert-button-group {
    padding: 0 1rem 1rem;
  }

  ion-alert.modern-alert .alert-button {
    border-radius: 0.5rem;
    font-weight: 500;
    text-transform: none;
    height: 2.75rem;
    margin: 0 0.25rem;
  }

  ion-alert.modern-alert .alert-button-cancel {
    color: #9ca3af;
    background-color: transparent;
    border: 1px solid #4b5563;
  }

  ion-alert.modern-alert .alert-button-cancel:hover {
    background-color: rgba(75, 85, 99, 0.2);
  }

  ion-alert.modern-alert .alert-button-confirm {
    color: #ffffff;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
  }

  ion-alert.modern-alert .alert-button-confirm:hover {
    opacity: 0.9;
  }
</style>
